import { initAuthConfig } from '@hono/auth-js';
import Credentials from '@auth/core/providers/credentials';
import { hash, verify } from 'argon2';
import NeonAdapter, { QueryableClient } from '../../__create/adapter';

export function createAuthConfig(client: QueryableClient) {
    const adapter = NeonAdapter(client);
    return initAuthConfig((c) => ({
        secret: c.env.AUTH_SECRET,
        session: { strategy: 'jwt' },
        cookies: {
            // Ensure secure cookies and SameSite=None in HTTPS environments for cross-site auth flows
            // @auth/core reads this shape when using initAuthConfig
            sessionToken: {
                name: 'authjs.session-token',
                options: getSessionCookieOptions({ AUTH_URL: c.env.AUTH_URL, NODE_ENV: process.env.NODE_ENV }),
            },
        },
        pages: {
            signIn: '/account/signin',
            signOut: '/account/logout',
        },
        providers: [
            Credentials({
                id: 'credentials-signin',
                name: 'Credentials Sign in',
                credentials: {
                    email: { label: 'Email', type: 'email' },
                    password: { label: 'Password', type: 'password' },
                },
                authorize: async (credentials) => {
                    const { email, password } = credentials;
                    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') return null;
                    const user = await adapter.getUserByEmail(email);
                    if (!user) return null;
                    const account = user.accounts.find((a) => a.provider === 'credentials');
                    if (!account?.password) return null;
                    const ok = await verify(account.password, password);
                    return ok ? user : null;
                },
            }),
            Credentials({
                id: 'credentials-signup',
                name: 'Credentials Sign up',
                credentials: {
                    email: { label: 'Email', type: 'email' },
                    password: { label: 'Password', type: 'password' },
                },
                authorize: async (credentials) => {
                    const { email, password } = credentials;
                    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') return null;
                    const existing = await adapter.getUserByEmail(email);
                    if (existing) return null;
                    const newUser = await adapter.createUser({ id: crypto.randomUUID(), email, emailVerified: null });
                    await adapter.linkAccount({
                        extraData: { password: await hash(password) },
                        type: 'credentials',
                        userId: newUser.id,
                        providerAccountId: newUser.id,
                        provider: 'credentials',
                    });
                    return newUser;
                },
            }),
        ],
    }));
}

export function getSessionCookieOptions(env: { AUTH_URL?: string; NODE_ENV?: string }) {
    const isHttps = Boolean(env.AUTH_URL?.startsWith('https'));
    const isProduction = env.NODE_ENV === 'production';
    return {
        httpOnly: true as const,
        sameSite: isProduction || isHttps ? ('none' as const) : ('lax' as const),
        secure: Boolean(isProduction || isHttps),
        path: '/',
    };
}


