export const config = { runtime: 'nodejs20.x' };

let cachedHandler: any;

export default async function handler(req: any, res: any) {
    if (!cachedHandler) {
        const mod = await import('../web/build/server/index.js');
        cachedHandler = (mod as any).default ?? (mod as any).handler ?? mod;
    }
    return (cachedHandler as any)(req, res);
}


