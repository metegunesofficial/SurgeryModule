import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.string().optional(),
    DATABASE_URL: z.string().url('DATABASE_URL must be a valid Postgres URL'),
    AUTH_SECRET: z.string(),
    AUTH_URL: z.string().url().optional(),
    CORS_ORIGINS: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
    // during react-router build, NODE_ENV is 'production' even for prerender; detect via PRERENDER flag
    const isPrerender = process.env.PRERENDER === 'true';
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
        // Allow missing env in non-prod or prerender and return partial to avoid build-time crash
        if (process.env.NODE_ENV !== 'production' || isPrerender) {
            return {
                NODE_ENV: 'development',
                DATABASE_URL: process.env.DATABASE_URL ?? '',
                AUTH_SECRET: process.env.AUTH_SECRET ?? '',
                AUTH_URL: process.env.AUTH_URL,
                CORS_ORIGINS: process.env.CORS_ORIGINS,
                PORT: process.env.PORT,
            } as Env;
        }
        throw new Error(`Invalid environment: ${parsed.error.message}`);
    }
    return parsed.data;
}


