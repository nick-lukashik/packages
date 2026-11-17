import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const read = (name: string) => readFileSync(new URL(name, import.meta.url), 'utf8')
const tokens = Object.fromEntries(
    [
        ...read('./tokens.css').matchAll(/^\s+--([\w-]+):\s*([^;]+);/gm),
    ].map(([, name, value]) => [
        name,
        value?.trim(),
    ]),
)
const theme = read('./theme.css')

/** WCAG relative luminance of a #rrggbb colour. */
const luminance = (hex: string) => {
    const [r, g, b] = [
        1,
        3,
        5,
    ].map(i => {
        const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    }) as [
        number,
        number,
        number,
    ]
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a: string, b: string) => {
    const [x, y] = [
        luminance(a),
        luminance(b),
    ].sort((p, q) => q - p) as [
        number,
        number,
    ]
    return (x + 0.05) / (y + 0.05)
}
const token = (name: string) => {
    const value = tokens[name]
    if (!value?.match(/^#[0-9a-f]{6}$/i)) throw new Error(`--${name} is not a #rrggbb colour: ${value}`)
    return value
}

describe('tokens', () => {
    it('is black and white', () => {
        expect(token('background')).toBe('#000000')
        expect(token('foreground')).toBe('#ffffff')
        expect(tokens['color-scheme'] ?? read('./tokens.css')).toContain('color-scheme: dark')
    })

    it.each([
        [
            'foreground',
            'background',
        ],
        [
            'muted-foreground',
            'background',
        ],
        [
            'muted-foreground',
            'muted',
        ],
        [
            'soft',
            'background',
        ],
        [
            'primary-foreground',
            'primary',
        ],
        [
            'secondary-foreground',
            'secondary',
        ],
        [
            'accent-foreground',
            'accent',
        ],
        [
            'destructive',
            'background',
        ],
        [
            'ok',
            'ok-soft',
        ],
        [
            'warn',
            'warn-soft',
        ],
        [
            'destructive',
            'danger-soft',
        ],
        [
            'info',
            'info-soft',
        ],
        [
            'sidebar-accent-foreground',
            'sidebar-accent',
        ],
    ])('%s on %s passes AA for text', (text, ground) => {
        expect(contrast(token(text), token(ground))).toBeGreaterThanOrEqual(4.5)
    })

    it('a control frame and the focus ring stand out from the ground (3:1)', () => {
        expect(contrast(token('input'), token('background'))).toBeGreaterThanOrEqual(3)
        expect(contrast(token('ring'), token('background'))).toBeGreaterThanOrEqual(3)
    })

    it('every corner is square and nothing casts a shadow', () => {
        expect(tokens.radius).toBe('0rem')
        expect(theme.match(/--radius-[\w-]+: ([^;]+);/g)?.every(line => line.endsWith('0rem;'))).toBe(true)
        expect(theme.match(/--shadow-[\w-]+: ([^;]+);/g)?.every(line => line.endsWith('0 0 #0000;'))).toBe(true)
    })

    it('every colour token has a Tailwind name', () => {
        for (const name of Object.keys(tokens).filter(
            name => !name.startsWith('font') && !name.startsWith('radius') && name !== 'page-width',
        ))
            expect(theme, name).toContain(`--color-${name}: var(--${name});`)
    })
})
