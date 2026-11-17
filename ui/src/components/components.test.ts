import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { FloatingWordmark } from '../brand/floating-wordmark.tsx'
import { Monogram, Wordmark } from '../brand/wordmark.tsx'
import * as kit from '../index.ts'
import { Roulette } from '../motion/roulette.tsx'
import { Badge, badgeVariants } from './badge.tsx'
import { Button, buttonVariants } from './button.tsx'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card.tsx'
import { FilterList } from './filter-list.tsx'
import { Input } from './input.tsx'
import { Label } from './label.tsx'
import { LiveDot, PageHead, SectionHead, Ticker } from './section.tsx'

const html = (element: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(element)
const count = (markup: string, part: string) => markup.split(part).length - 1
const root = fileURLToPath(new URL('..', import.meta.url))
const sources = [
    'components',
    'brand',
    'motion',
    'next',
].flatMap(dir =>
    readdirSync(`${root}${dir}`)
        .filter(name => name.endsWith('.tsx'))
        .map(name => `${dir}/${name}`),
)
const components = sources.filter(name => name.startsWith('components/')).map(name => name.slice(11, -4))
const source = (name: string) => readFileSync(`${root}${name}`, 'utf8')

const buttonKinds = [
    'default',
    'outline',
    'secondary',
    'ghost',
    'destructive',
    'link',
] as const
const buttonSizes = [
    'default',
    'xs',
    'sm',
    'lg',
    'icon',
    'icon-xs',
    'icon-sm',
    'icon-lg',
] as const
const badgeKinds = [
    'default',
    'secondary',
    'destructive',
    'outline',
    'ghost',
    'link',
    'ok',
    'warn',
    'danger',
    'info',
] as const

/** The shadcn/ui components, as the CLI names them: the kit is a drop-in for each. */
const shadcn = [
    'accordion',
    'alert',
    'alert-dialog',
    'aspect-ratio',
    'attachment',
    'avatar',
    'badge',
    'breadcrumb',
    'bubble',
    'button',
    'button-group',
    'calendar',
    'card',
    'carousel',
    'chart',
    'checkbox',
    'code-block',
    'collapsible',
    'combobox',
    'command',
    'context-menu',
    'dialog',
    'direction',
    'drawer',
    'dropdown-menu',
    'empty',
    'field',
    'hover-card',
    'input',
    'input-group',
    'input-otp',
    'item',
    'kbd',
    'label',
    'marker',
    'menubar',
    'message',
    'message-scroller',
    'native-select',
    'navigation-menu',
    'pagination',
    'popover',
    'progress',
    'questionnaire',
    'radio-group',
    'resizable',
    'scroll-area',
    'select',
    'separator',
    'sheet',
    'sidebar',
    'skeleton',
    'slider',
    'sonner',
    'spinner',
    'switch',
    'table',
    'tabs',
    'textarea',
    'toggle',
    'toggle-group',
    'tooltip',
    'trace',
]

describe('the kit', () => {
    it('has all 63 shadcn/ui components, plus its own', () => {
        expect(components.sort()).toEqual(
            [
                ...shadcn,
                'filter-list',
                'section',
            ].sort(),
        )
    })

    it('exports every one from the package root', () => {
        const exported = Object.keys(kit)
        for (const name of [
            'Accordion',
            'AlertDialog',
            'Calendar',
            'ChartContainer',
            'Command',
            'Dialog',
            'Field',
            'InputOTP',
            'Select',
            'Sidebar',
            'Table',
            'Tabs',
            'Toaster',
            'Tooltip',
            'FilterList',
            'SectionHead',
            'PageHead',
            'LiveDot',
            'Ticker',
            'Wordmark',
            'FloatingWordmark',
            'Monogram',
            'Roulette',
            'cn',
            'useIsMobile',
        ])
            expect(exported, name).toContain(name)
        // Next.js stays optional: the root never imports it.
        expect(exported).not.toContain('RouteRoulette')
    })

    it.each(sources)('%s has no dark variant: there is one theme', name => {
        expect(source(name)).not.toMatch(/\bdark:|\.dark\b|light-dark\(|prefers-color-scheme/)
    })

    it.each(sources)('%s imports nothing through an app alias', name => {
        expect(source(name)).not.toMatch(/from ["']@\//)
    })

    it.each(sources)('%s has square corners and no glow ring', name => {
        expect(source(name)).not.toMatch(/ring-ring\/50|ring-foreground\/10/)
    })

    it('only these render a style attribute; check the CSP before using them on the server', () => {
        // A new name here means a new component that a strict style-src may block.
        expect(sources.filter(name => /\bstyle=\{/.test(source(name))).sort()).toEqual([
            'components/chart.tsx',
            'components/code-block.tsx',
            'components/progress.tsx',
            'components/sidebar.tsx',
            'components/sonner.tsx',
            'components/toggle-group.tsx',
        ])
    })
})

describe('Button', () => {
    it('is the shadcn button in monospace caps', () => {
        const markup = html(h(Button, null, 'Book a call'))
        expect(markup).toMatch(/^<button /)
        expect(markup).toContain('data-slot="button"')
        expect(markup).toContain('data-variant="default"')
        expect(markup).toContain('uppercase')
        expect(markup).toContain('>Book a call</button>')
    })

    it.each(buttonKinds)('variant %s has its own look', variant => {
        const classes = buttonVariants({
            variant,
        })
        expect(
            buttonKinds
                .filter(other => other !== variant)
                .map(other =>
                    buttonVariants({
                        variant: other,
                    }),
                ),
        ).not.toContain(classes)
    })

    it.each(buttonSizes)('size %s sets a height', size => {
        expect(
            buttonVariants({
                size,
            }),
        ).toMatch(/\b(h|size)-(\d|\[)/)
    })

    it('the solid and outline buttons invert on hover, without a transition', () => {
        expect(
            buttonVariants({
                variant: 'default',
            }),
        ).toContain('hover:bg-background hover:text-foreground')
        expect(
            buttonVariants({
                variant: 'outline',
            }),
        ).toContain('hover:bg-foreground hover:text-background')
        expect(source('components/button.tsx')).not.toMatch(/transition|translate-y/)
    })

    it('asChild gives the look to a link and renders no button', () => {
        const markup = html(
            h(
                Button,
                {
                    asChild: true,
                    size: 'lg',
                },
                h(
                    'a',
                    {
                        href: '#contact',
                    },
                    'Write',
                ),
            ),
        )
        expect(markup).toMatch(/^<a /)
        expect(markup).toContain('href="#contact"')
        expect(markup).toContain('data-slot="button"')
    })

    it('a class from the caller wins over the size', () => {
        const markup = html(
            h(
                Button,
                {
                    className: 'h-9 px-9',
                },
                'x',
            ),
        )
        expect(markup).toContain('h-9')
        expect(markup).not.toContain('h-[3.125rem]')
    })
})

describe('Badge', () => {
    it.each(badgeKinds)('variant %s has its own look', variant => {
        expect(
            html(
                h(
                    Badge,
                    {
                        variant,
                    },
                    'Live',
                ),
            ),
        ).toContain(`data-variant="${variant}"`)
        expect(
            badgeKinds
                .filter(other => other !== variant)
                .map(other =>
                    badgeVariants({
                        variant: other,
                    }),
                ),
        ).not.toContain(
            badgeVariants({
                variant,
            }),
        )
    })

    it('a state badge pairs its ink with its own dark tint', () => {
        expect(
            badgeVariants({
                variant: 'ok',
            }),
        ).toContain('bg-ok-soft text-ok')
        expect(
            badgeVariants({
                variant: 'danger',
            }),
        ).toContain('bg-danger-soft text-destructive')
    })
})

describe('Card', () => {
    const markup = html(
        h(
            Card,
            null,
            h(
                CardHeader,
                null,
                h(CardTitle, null, 'Identity'),
                h(CardDescription, null, 'One sign-in for every site.'),
                h(CardAction, null, '→'),
            ),
            h(CardContent, null, 'Body'),
            h(CardFooter, null, 'Footer'),
        ),
    )

    it('has every part of the shadcn Card', () => {
        for (const slot of [
            'card',
            'card-header',
            'card-title',
            'card-description',
            'card-action',
            'card-content',
            'card-footer',
        ])
            expect(count(markup, `data-slot="${slot}"`), slot).toBe(1)
    })

    it('is one 1px white frame with a condensed caps title', () => {
        expect(markup).toContain('border border-foreground')
        expect(markup).toContain('font-heading')
        expect(markup).toMatch(/data-slot="card-title"[^>]*uppercase/)
    })
})

describe('Input and Label', () => {
    it('is a text field with a white frame and a green focus', () => {
        const markup = html(
            h(Input, {
                id: 'email',
                name: 'email',
                placeholder: 'you@example.com',
            }),
        )
        expect(markup).toContain('data-slot="input"')
        expect(markup).toContain('border-input')
        expect(markup).toContain('focus-visible:ring-ring')
    })

    it('the label points at its field', () => {
        expect(
            html(
                h(
                    Label,
                    {
                        htmlFor: 'email',
                    },
                    'Email',
                ),
            ),
        ).toMatch(/^<label [^>]*for="email"[^>]*>Email<\/label>$/)
    })
})

describe('sections', () => {
    it('SectionHead titles its section with an h2 the section can point at', () => {
        const markup = html(
            h(SectionHead, {
                id: 'platform-title',
                label: '01 · Platform',
                title: 'The platform',
                intro: 'One server.',
            }),
        )
        expect(markup).toContain('<h2 id="platform-title"')
        expect(markup).toContain('01 · Platform')
        expect(markup).toContain('One server.')
    })

    it('PageHead is the page h1, and leaves out what it is not given', () => {
        const markup = html(
            h(PageHead, {
                title: 'Blog',
            }),
        )
        expect(markup).toMatch(/<h1 [^>]*>Blog<\/h1>/)
        expect(markup).not.toContain('<p')
    })

    it('Ticker is decorative and runs its items twice for a seamless loop', () => {
        const markup = html(
            h(Ticker, {
                items: [
                    'K3s',
                    'Argo CD',
                ],
            }),
        )
        expect(markup).toMatch(/^<div aria-hidden="true"/)
        expect(count(markup, 'K3s')).toBe(2)
        expect(count(markup, 'live-dot')).toBe(2)
    })

    it('LiveDot is decorative', () => {
        expect(html(h(LiveDot))).toBe('<span aria-hidden="true" data-slot="live-dot" class="live-dot"></span>')
    })
})

describe('FilterList', () => {
    const markup = html(
        h(
            FilterList,
            {
                label: 'Filter notes by topic',
                all: 'All',
                options: [
                    {
                        id: 'k3s',
                        name: 'K3s',
                    },
                    {
                        id: 'ai',
                        name: 'AI',
                    },
                ],
            },
            h(
                'ul',
                null,
                h('li', {
                    'data-tags': 'k3s',
                }),
            ),
        ),
    )

    it('is a named group of toggle buttons, "all" pressed first', () => {
        expect(markup).toContain('<legend class="sr-only">Filter notes by topic</legend>')
        expect(count(markup, 'aria-pressed="true"')).toBe(1)
        expect(count(markup, 'aria-pressed="false"')).toBe(2)
        expect(markup).toMatch(/aria-pressed="true"[^>]*>All</)
    })

    it('shows the whole list until a button is pressed (and without JavaScript)', () => {
        expect(markup).toContain('<li data-tags="k3s"></li>')
        expect(markup).not.toContain('hidden')
    })
})

describe('brand', () => {
    it('Wordmark is one decorative shape', () => {
        const markup = html(h(Wordmark))
        expect(markup).toMatch(/^<svg [^>]*aria-hidden="true"/)
        expect(count(markup, '<path')).toBe(1)
    })

    it('FloatingWordmark has a group per letter of NICK LUKASHIK', () => {
        const markup = html(h(FloatingWordmark))
        expect(count(markup, 'class="float-letter"')).toBe('NICKLUKASHIK'.length)
    })

    it('Monogram is the NL mark', () => {
        expect(html(h(Monogram))).toMatch(/aria-hidden="true"[^>]*>NL<\/span>$/)
    })
})

describe('Roulette', () => {
    it('renders nothing until a link is clicked', () => {
        expect(
            html(
                h(Roulette, {
                    pages: [],
                    labels: {
                        opening: 'Opening → {name}',
                        site: 'example.com',
                        page: 'page',
                    },
                    pathname: '/',
                    navigate: () => {},
                }),
            ),
        ).toBe('')
    })
})
