import { Hono } from 'hono';
import type { Handler } from 'hono/types';
import updatedFetch from '../src/__create/fetch';

const API_BASENAME = '/api';
const api = new Hono();

if (globalThis.fetch) {
	globalThis.fetch = updatedFetch;
}

// Bundle API routes using Vite's glob import so they exist in production builds
const routeModuleLoaders = import.meta.glob('../src/app/api/**/route.js');

function getHonoPathFromGlobKey(key: string): { name: string; pattern: string }[] {
	const relativePath = key.replace('../src/app/api', '');
	const parts = relativePath.split('/').filter(Boolean);
	const routeParts = parts.slice(0, -1); // Remove 'route.js'
	if (routeParts.length === 0) {
		return [{ name: 'root', pattern: '' }];
	}
	const transformedParts = routeParts.map((segment) => {
		const match = segment.match(/^\[(\.{3})?([^\]]+)\]$/);
		if (match) {
			const [, dots, param] = match;
			return dots === '...'
				? { name: param, pattern: `:${param}{.+}` }
				: { name: param, pattern: `:${param}` };
		}
		return { name: segment, pattern: segment };
	});
	return transformedParts;
}

async function registerRoutes() {
	// Clear existing routes
	// @ts-ignore - Hono exposes routes array
	api.routes = [];

	const entries = Object.entries(routeModuleLoaders).sort((a, b) => b[0].length - a[0].length);
	for (const [key, loader] of entries) {
		try {
			// Each loader returns a module with HTTP verb handlers
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const route = await loader();
			const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;
			for (const method of methods) {
				try {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					if (route[method]) {
						const parts = getHonoPathFromGlobKey(key);
						const honoPath = `/${parts.map(({ pattern }) => pattern).join('/')}`;
						const handler: Handler = async (c) => {
							const params = c.req.param();
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore
							return await route[method](c.req.raw, { params });
						};
						switch (method) {
							case 'GET':
								api.get(honoPath, handler);
								break;
							case 'POST':
								api.post(honoPath, handler);
								break;
							case 'PUT':
								api.put(honoPath, handler);
								break;
							case 'DELETE':
								api.delete(honoPath, handler);
								break;
							case 'PATCH':
								api.patch(honoPath, handler);
								break;
						}
					}
				} catch (error) {
					console.error(`Error registering route ${key} for method ${method}:`, error);
				}
			}
		} catch (error) {
			console.error(`Error importing route file ${key}:`, error);
		}
	}
}

// Initial registration without top-level await to keep SSR target happy
registerRoutes().catch((err) => {
	console.error('Error registering routes:', err);
});

// Hot reload routes in development
if (import.meta.env.DEV && import.meta.hot) {
	import.meta.hot.accept(() => {
		registerRoutes().catch((err) => {
			console.error('Error reloading routes:', err);
		});
	});
}

export { api, API_BASENAME };
