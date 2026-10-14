import { rangedVideoResponse, joinedVideoResponse } from '../range-response';

const files = new Set(['moscow-239', 'img_1628', 'img_1645', 'img_1625', 'img_1643', 'img_1626', 'img_1642', 'img_1635', 'img_1639', 'img_1637', 'img_1636', 'img_1638', 'img_1800', 'img_9457', 'img_9953', 'img_0533'].map(name => `${name}.mp4`));

async function serve(request: Request, context: { params: Promise<{ file: string }> }) {
  const { file } = await context.params;
  if (!files.has(file)) return new Response('Not found', { status: 404 });
  // Static hosting ignores Range. Serve bounded slices without buffering the MP4.
  try {
    const method = request.method === 'HEAD' ? 'HEAD' : 'GET';
    const names = file === 'img_1800.mp4' ? ['img_1800.part1', 'img_1800.part2'] : [file];
    const responses = await Promise.all(names.map(name => fetch(new URL(`/videos/switch-tv/${name}?v=345`, request.url), { method })));
    const upstream = responses.length === 1 ? responses[0] : joinedVideoResponse(responses, method === 'HEAD');
    if (!upstream.ok) return new Response('Video unavailable', { status: 502 });
    return rangedVideoResponse(upstream, request.headers.get('range'), request.method === 'HEAD');
  } catch {
    return new Response('Video unavailable', { status: 502 });
  }
}

export const GET = serve;
export const HEAD = serve;
