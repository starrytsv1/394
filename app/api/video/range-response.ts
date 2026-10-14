// The host caps individual assets at 25 MiB. Byte-identical pieces remain one MP4.
export function joinedVideoResponse(parts: Response[], head = false): Response {
  if (parts.some(part => !part.ok || !part.headers.has('content-length'))) {
    parts.forEach(part => { void part.body?.cancel(); });
    return new Response('Video unavailable', { status: 502 });
  }
  const size = parts.reduce((sum, part) => sum + Number(part.headers.get('content-length')), 0);
  let index = 0;
  let reader = head ? undefined : parts[0].body!.getReader();
  const body = head ? null : new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        while (reader) {
          const { done, value } = await reader.read();
          if (!done) { controller.enqueue(value); return; }
          reader.releaseLock();
          index++;
          if (index === parts.length) { reader = undefined; controller.close(); return; }
          reader = parts[index].body!.getReader();
        }
      } catch (error) { controller.error(error); }
    },
    async cancel(reason) {
      await reader?.cancel(reason);
      await Promise.all(parts.slice(index + 1).map(part => part.body?.cancel(reason)));
    },
  });
  return new Response(body, { headers: { 'content-length': String(size), 'content-type': 'video/mp4' } });
}

export function rangedVideoResponse(upstream: Response, range: string | null, head = false): Response {
  const size = Number(upstream.headers.get('content-length'));
  if (!Number.isSafeInteger(size) || size <= 0) {
    void upstream.body?.cancel();
    return new Response('Video length unavailable', { status: 502 });
  }
  const headers = new Headers({
    'Content-Type': 'video/mp4',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=3600',
    'X-Content-Type-Options': 'nosniff',
  });
  let start = 0;
  let end = size - 1;
  if (range && !head) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (match && (match[1] || match[2])) {
      start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
      end = match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
    }
    if (!match || (!match[1] && !match[2]) || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= size) {
      void upstream.body?.cancel();
      headers.set('Content-Range', `bytes */${size}`);
      return new Response(null, { status: 416, headers });
    }
    headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  }
  headers.set('Content-Length', String(end - start + 1));
  if (head) return new Response(null, { headers });
  if (!range) return new Response(upstream.body, { headers });
  const reader = upstream.body!.getReader();
  let offset = 0;
  const body = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) { controller.error(new Error('Incomplete video response')); return; }
          const chunkStart = offset;
          offset += value.byteLength;
          if (offset <= start) continue;
          controller.enqueue(value.subarray(Math.max(0, start - chunkStart), Math.min(value.byteLength, end + 1 - chunkStart)));
          if (offset > end) { controller.close(); await reader.cancel(); }
          return;
        }
      } catch (error) { controller.error(error); }
    },
    cancel(reason) { return reader.cancel(reason); },
  });
  return new Response(body, { status: 206, headers });
}
