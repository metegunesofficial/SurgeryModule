import { neon, Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

export type QueryResult<Row = unknown> = {
    rows: Row[];
    rowCount: number;
};

export interface QueryableClient {
    query: (text: string, params?: unknown[]) => Promise<QueryResult>;
}

export function getServerlessClient(): QueryableClient {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not set');
    }
    // Neon HTTP client for serverless environments
    const http = neon(process.env.DATABASE_URL);
    return {
        async query(text: string, params: unknown[] = []) {
            // @ts-ignore neon typing differs; it returns array of rows
            const rows = await http(text, params);
            return { rows, rowCount: Array.isArray(rows) ? rows.length : 0 };
        },
    };
}

export function getPoolClient(): QueryableClient {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not set');
    }
    const url = process.env.DATABASE_URL;
    const isNeon = /neon\.tech/.test(url);
    if (isNeon) {
        const pool = new NeonPool({ connectionString: url });
        return {
            async query(text: string, params?: unknown[]) {
                const result = await pool.query(text, params as unknown[]);
                return { rows: result.rows, rowCount: result.rowCount };
            },
        };
    }
    let pgPoolPromise: Promise<any> | null = null;
    const getPgPool = async () => {
        if (!pgPoolPromise) {
            pgPoolPromise = import('pg').then((mod: any) => new mod.Pool({ connectionString: url, ssl: { rejectUnauthorized: false } }));
        }
        return pgPoolPromise;
    };
    return {
        async query(text: string, params?: unknown[]) {
            const pool = await getPgPool();
            const result = await pool.query(text, params as unknown[]);
            return { rows: result.rows, rowCount: result.rowCount };
        },
    };
}


