type JsonInit = ResponseInit & { headers?: HeadersInit };

export function json(body: unknown, init?: JsonInit): Response {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init?.headers ?? {}),
  };
  return new Response(JSON.stringify(body), { ...init, headers });
}

export function errorJson(
  status: number,
  message: string,
  extra?: Record<string, unknown>,
  init?: JsonInit
): Response {
  return json({ error: message, ...(extra ?? {}) }, { status, ...(init ?? {}) });
}


