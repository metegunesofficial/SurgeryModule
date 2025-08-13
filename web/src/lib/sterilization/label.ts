import type { Label } from '@/types/prd';

function toBase36(num: number): string {
  return num.toString(36).toUpperCase();
}

/**
 * Generates a deterministic mock DataMatrix payload for labels.
 * Avoids heavy libraries and external IO (rate-limit safe). Not a real DataMatrix.
 */
export function generateMockDataMatrix(kitId: string, lot?: string): string {
  const ts = Date.now();
  const hash = `${toBase36(ts)}-${kitId.slice(0, 8)}-${(lot ?? 'NA').slice(0, 6)}`;
  return `DMX:${hash}`;
}

export function createMockLabel(kitId: string, userId: string, lot?: string): Label {
  const datamatrix = generateMockDataMatrix(kitId, lot);
  return {
    label_id: crypto.randomUUID(),
    datamatrix,
    printed_at: new Date().toISOString(),
    printed_by: userId,
  };
}


