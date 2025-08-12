import 'react-router';
module 'virtual:load-fonts.jsx' {
	export function LoadFonts(): null;
}
declare module 'react-router' {
	interface AppLoadContext {
		// add context properties here
	}
}
declare module 'npm:stripe' {
	import Stripe from 'stripe';
	export default Stripe;
}
declare module '@auth/create/react' {
	import { SessionProvider } from '@auth/react';
	export { SessionProvider };
}

// Allow React Router typegen to import JS route modules without typings
declare module '*page.js' {
  const mod: any;
  export default mod;
  export const loader: any;
  export const action: any;
  export const links: any;
  export const meta: any;
  export const headers: any;
  export const ErrorBoundary: any;
  export const Component: any;
}

declare module '../page.js' {
  const mod: any;
  export default mod;
  export const loader: any;
  export const action: any;
  export const links: any;
  export const meta: any;
  export const headers: any;
  export const ErrorBoundary: any;
  export const Component: any;
}
