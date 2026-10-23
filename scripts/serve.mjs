import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import { extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const host = '127.0.0.1';
const publicFiles = new Set([
  '/index.html', '/README.md', '/DESIGN.md', '/platforms.md',
  '/preview/app.js', '/preview/app.css', '/preview/tailwind.generated.css', '/preview/shadcn/tokens.css',
]);
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.jsx': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.zip': 'application/zip',
};
const assetExtensions = new Set([
  '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.ico', '.woff', '.woff2', '.txt',
]);
const exportExtensions = new Set([
  ...assetExtensions, '.html', '.css', '.js', '.mjs', '.json', '.md', '.pdf', '.zip',
]);

function isWithin(directory, path) {
  const difference = relative(directory, path);
  return difference === '' || (!difference.startsWith(`..${sep}`) && difference !== '..' && !isAbsolute(difference));
}

function isPublic(pathname) {
  // The curated design specification is an intentional public resource.
  if (publicFiles.has(pathname)) return true;
  const segments = pathname.split('/').slice(1);
  if (segments.some(segment => !segment || segment.startsWith('.') || /^(AGENTS|PRODUCT|DESIGN|MEMORY)(\.|$)/i.test(segment))) return false;
  if (segments.some(segment => segment.toLowerCase() === 'memory')) return false;
  const extension = extname(pathname).toLowerCase();
  if (pathname.startsWith('/tokens/')) return ['.css', '.json', '.js'].includes(extension);
  if (pathname.startsWith('/theme/')) return ['.json', '.mjs'].includes(extension);
  if (pathname.startsWith('/vendor/')) return ['.js', '.css', '.json', '.txt', '.woff', '.woff2'].includes(extension);
  if (pathname.startsWith('/preview/assets/')) return assetExtensions.has(extension);
  // JSX in dist/react is an intentional downloadable copy-package artifact.
  if (pathname.startsWith('/dist/')) return exportExtensions.has(extension) || (pathname.startsWith('/dist/react/') && extension === '.jsx');
  if (pathname.startsWith('/docs/')) return exportExtensions.has(extension);
  return false;
}

export async function createPreviewServer() {
  const realRoot = await realpath(root);
  return createServer(async (request, response) => {
    const finish = (status, message) => {
      response.writeHead(status, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      });
      response.end(request.method === 'HEAD' ? undefined : message);
    };
    if (!/^(127\.0\.0\.1|localhost)(:\d+)?$/i.test(request.headers.host || '')) return finish(403, 'Forbidden');
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.setHeader('Allow', 'GET, HEAD');
      return finish(405, 'Method not allowed');
    }

    let pathname;
    try {
      const rawPath = (request.url || '/').split('?')[0];
      if (!rawPath.startsWith('/')) return finish(400, 'Bad request');
      pathname = decodeURIComponent(rawPath);
    } catch {
      return finish(400, 'Bad request');
    }
    if (/[\\\0-\x1f\x7f]/.test(pathname)) return finish(400, 'Bad request');
    if (pathname === '/') pathname = '/index.html';
    if (!isPublic(pathname)) return finish(404, 'Not found');

    const candidate = resolve(root, `.${pathname}`);
    if (!isWithin(root, candidate)) return finish(404, 'Not found');
    try {
      const realFile = await realpath(candidate);
      if (!isWithin(realRoot, realFile)) return finish(404, 'Not found');
      const details = await stat(realFile);
      if (!details.isFile()) return finish(404, 'Not found');
      const headers = {
        'Content-Type': mimeTypes[extname(pathname).toLowerCase()] || 'application/octet-stream',
        'Content-Length': details.size,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
      };
      if (extname(pathname).toLowerCase() === '.jsx') {
        headers['Content-Disposition'] = `attachment; filename="${pathname.split('/').pop()}"`;
      }
      response.writeHead(200, headers);
      if (request.method === 'HEAD') return response.end();
      createReadStream(realFile).on('error', () => response.destroy()).pipe(response);
    } catch (error) {
      if (['ENOENT', 'ENOTDIR', 'EACCES', 'EPERM'].includes(error.code)) return finish(404, 'Not found');
      finish(500, 'Unable to read this file');
    }
  });
}

async function main() {
  const args = process.argv.slice(2);
  let port = 8766;
  if (args.length) {
    const requested = args.length === 1 && args[0].startsWith('--port=')
      ? args[0].slice('--port='.length)
      : args.length === 2 && args[0] === '--port' ? args[1] : '';
    if (!/^\d+$/.test(requested)) throw new Error('Usage: pnpm serve [--port 8766]');
    port = Number(requested);
    if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Port must be between 1 and 65535.');
  }
  const server = await createPreviewServer();
  server.on('error', error => {
    console.error(error.code === 'EADDRINUSE' ? `Port ${port} is already in use. Pass --port to use another port.` : error.message);
    process.exitCode = 1;
  });
  server.listen(port, host, () => console.log(`COHESION preview: http://${host}:${port}`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => server.close());
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
