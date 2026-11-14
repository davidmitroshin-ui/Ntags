import { cp, copyFile, mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const output = path.join(root, 'dist')
const routes = ['catalog', 'standard', 'custom', 'how-it-works', 'business', 'faq', 'contacts', 'cart']

await rm(output, { recursive: true, force: true })
await mkdir(output, { recursive: true })

for (const file of ['index.html', 'app.js', 'styles.css', 'pricing.js']) {
  await copyFile(path.join(root, file), path.join(output, file))
}

await cp(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true })

const entry = path.join(output, 'index.html')
for (const route of routes) {
  const routeDir = path.join(output, route)
  await mkdir(routeDir, { recursive: true })
  await copyFile(entry, path.join(routeDir, 'index.html'))
}

// GitHub Pages serves this for unknown paths; app.js renders its own branded 404 state.
await copyFile(entry, path.join(output, '404.html'))
await writeFile(path.join(output, '.nojekyll'), '')
console.log(`GitHub Pages site prepared in ${output}`)