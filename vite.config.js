import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  plugins: [
    {
      name: 'vercel-rewrites',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = new URL(req.url, 'http://localhost');
          const pathname = url.pathname;

          if (pathname === '/mieayam' || pathname === '/admin') {
            req.url = '/mieayam.html' + url.search;
          }
          next();
        });
      }
    }
  ]
});
