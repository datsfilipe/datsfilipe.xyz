import { createD3Middleware } from '@d3-inc/d3-edge-vercel-middleware';

export default createD3Middleware();

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
  runtime: 'nodejs',
};
