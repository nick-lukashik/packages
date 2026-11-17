// Builds the kit's showcase into demo/dist/index.html: one self-contained page
// (bundle and CSS inlined, the fonts as data URLs) to open or publish as it is.
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { build } from 'esbuild'

const out = new URL('../demo/dist/', import.meta.url)
mkdirSync(out, {
    recursive: true,
})
await build({
    entryPoints: [
        new URL('../demo/kit.tsx', import.meta.url).pathname,
    ],
    bundle: true,
    minify: true,
    format: 'esm',
    jsx: 'automatic',
    define: {
        'process.env.NODE_ENV': '"production"',
    },
    loader: {
        '.woff2': 'dataurl',
        '.woff': 'dataurl',
    },
    outfile: new URL('kit.js', out).pathname,
})
execFileSync('pnpm', [
    'exec',
    'tailwindcss',
    '-i',
    new URL('../demo/demo.css', import.meta.url).pathname,
    '-o',
    new URL('kit.css', out).pathname,
    '--minify',
])
// The fonts, inlined: Latin and Cyrillic subsets of the two families.
const fonts = await build({
    entryPoints: [
        new URL('../src/styles/fonts.css', import.meta.url).pathname,
    ],
    bundle: true,
    minify: true,
    write: false,
    loader: {
        '.woff2': 'dataurl',
        '.woff': 'dataurl',
    },
})
const css = fonts.outputFiles[0]?.text ?? ''
const page = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>@nick-lukashik/ui · Mono Brutal</title><style>${css}${readFileSync(new URL('kit.css', out), 'utf8')}</style></head><body><div id="root"></div><script type="module">${readFileSync(new URL('kit.js', out), 'utf8').replaceAll('</script', '<\\/script')}</script></body></html>`
writeFileSync(new URL('index.html', out), page)
console.log(`demo/dist/index.html: ${Math.round(page.length / 1024)} KB`)
