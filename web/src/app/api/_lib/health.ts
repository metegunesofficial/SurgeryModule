export async function getHealthStatus() {
  // Placeholders; integrate real checks later
  return {
    database: 'healthy',
    supabase: 'healthy',
    medicasimple: 'healthy',
    webVitals: 'n/a',
  } as const;
}


