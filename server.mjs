import http from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const port = Number(process.env.PORT || 4173)
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.json': 'application/json; charset=utf-8',
}

const server = http.createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8', 'Allow': 'GET, HEAD' })
    res.end('Method not allowed')
    return
  }
  try {
    const pathname = decodeURIComponent(new URL(req.url || '/', 'http://localhost').pathname)
    const requested = pathname === '/' ? 'index.html' : pathname.startsWith('/images/') ? `public${pathname}` : pathname.replace(/^\/+/, '')
    const resolved = path.resolve(root, requested)
    if (!resolved.startsWith(root + path.sep) && resolved !== path.join(root, 'index.html')) throw new Error('Invalid path')
    let filePath = resolved
    let body
    try { body = await readFile(filePath) }
    catch {
      // Client-side routes are served by the same application entry point.
      filePath = path.join(root, 'index.html')
      body = await readFile(filePath)
    }
    const ext = path.extname(filePath).toLowerCase()
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream', 'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600' })
    if (req.method === 'HEAD') res.end(); else res.end(body)
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Bad request')
  }
})

server.listen(port, '0.0.0.0', () => {
  console.log(`Ntags is running at http://localhost:${port}`)
})