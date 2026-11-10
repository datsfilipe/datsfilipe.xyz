import { createD3Middleware } from '@d3-inc/d3-dna-vercel-middleware';

export default createD3Middleware();

export const config = {
  matcher: '/((?!api/|assets/|.*\\.[^/]+$).*)',
  runtime: 'nodejs',
};
