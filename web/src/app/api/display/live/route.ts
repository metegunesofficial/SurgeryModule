import { buildRateLimitHeaders, createRateLimiter } from '@/lib/rate-limit';
import { getDisplayChannel, type DisplayUpdate } from '../../_lib/events';

const limiter = createRateLimiter({ windowMs: 10_000, max: 30 });

export async function GET(req: Request) {
  const { allowed, remaining, resetIn } = await limiter(req);
  if (!allowed) {
    return new Response('Too many requests', {
      status: 429,
      headers: buildRateLimitHeaders({ limit: 30, remaining, resetInMs: resetIn, includeRetryAfter: true }),
    });
  }

  const channel = getDisplayChannel();

  const stream = new ReadableStream<Uint8Array>({
    start(controller: ReadableStreamDefaultController<Uint8Array>) {
      const encoder = new TextEncoder();
      function send(data: DisplayUpdate) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }
      send({ type: 'display-update', payload: { hello: 'world' } });

      const onMessage = (event: MessageEvent<DisplayUpdate>) => send(event.data);
      channel?.addEventListener('message', onMessage as EventListener);
      (controller as unknown as { _cleanup?: () => void })._cleanup = () =>
        channel?.removeEventListener('message', onMessage as unknown as EventListener);
    },
    cancel(this: ReadableStream<Uint8Array>) {
      (this as unknown as { _cleanup?: () => void })._cleanup?.();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      ...buildRateLimitHeaders({ limit: 30, remaining, resetInMs: resetIn }),
    },
  });
}


