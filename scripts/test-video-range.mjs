import assert from 'node:assert/strict';
import { rangedVideoResponse, joinedVideoResponse } from '../app/api/video/range-response.ts';

const upstream = () => new Response(new ReadableStream({ start(c) {
  c.enqueue(new TextEncoder().encode('012'));
  c.enqueue(new TextEncoder().encode('3456'));
  c.enqueue(new TextEncoder().encode('789'));
  c.close();
} }), { headers: { 'content-length': '10' } });
for (const [range, status, expected] of [[null, 200, '0123456789'], ['bytes=0-1', 206, '01'], ['bytes=4-7', 206, '4567'], ['bytes=7-', 206, '789'], ['bytes=-3', 206, '789'], ['bytes=8-99', 206, '89'], ['bytes=10-', 416, ''], ['bytes=7-2', 416, ''], ['bytes=-0', 416, ''], ['bytes=-', 416, ''], ['bytes=0-1,4-5', 416, '']]) {
  const response = rangedVideoResponse(upstream(), range);
  assert.equal(response.status, status, range);
  assert.equal(await response.text(), expected, range);
  assert.equal(response.headers.get('accept-ranges'), 'bytes');
  if (status !== 416) assert.equal(Number(response.headers.get('content-length')), expected.length);
}
const head = rangedVideoResponse(upstream(), null, true);
assert.equal(await head.text(), '');
assert.equal(head.headers.get('content-length'), '10');
console.log('Video range checks passed');
const pieces = () => ['01234', '56789'].map(s => new Response(s, { headers: { 'content-length': '5' } }));
assert.equal(await joinedVideoResponse(pieces()).text(), '0123456789');
assert.equal(await rangedVideoResponse(joinedVideoResponse(pieces()), 'bytes=3-7').text(), '34567');
assert.equal(await rangedVideoResponse(joinedVideoResponse(pieces()), 'bytes=8-').text(), '89');
console.log('Split-file playback checks passed');
