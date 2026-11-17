import type * as React from 'react'
import { cn } from '../lib/cn.ts'

/** A section's opening: a small label and a big title on the left, a short intro on the right. */
function SectionHead({
    id,
    label,
    title,
    intro,
    className,
}: {
    /** The id of the title, for the section's `aria-labelledby`. */
    id: string
    label: React.ReactNode
    title: React.ReactNode
    intro?: React.ReactNode
    className?: string
}) {
    return (
        <div
            data-slot="section-head"
            className={cn('reveal mb-14 grid items-end gap-10 min-[980px]:grid-cols-2', className)}
        >
            <div>
                <p className="label mb-4 text-muted-foreground">{label}</p>
                <h2
                    id={id}
                    className="display text-[clamp(44px,5.6vw,88px)]"
                >
                    {title}
                </h2>
            </div>
            {intro ? <p className="max-w-[520px] text-base text-soft">{intro}</p> : null}
        </div>
    )
}

/** The top of a page of its own: breadcrumbs, the title (the page's h1) and an intro. */
function PageHead({
    crumbs,
    title,
    intro,
    className,
}: {
    crumbs?: React.ReactNode
    title: React.ReactNode
    intro?: React.ReactNode
    className?: string
}) {
    return (
        <div
            data-slot="page-head"
            className={className}
        >
            {crumbs ? <p className="label mb-6 text-muted-foreground">{crumbs}</p> : null}
            <h1 className="display mb-5 max-w-[1000px] text-[clamp(44px,6vw,96px)]">{title}</h1>
            {intro ? <p className="mb-12 max-w-[760px] text-base text-soft">{intro}</p> : null}
        </div>
    )
}

/** The green "live" dot: something is running. Decorative; say it in words next to it. */
function LiveDot({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            aria-hidden="true"
            data-slot="live-dot"
            className={cn('live-dot', className)}
            {...props}
        />
    )
}

/**
 * A running line of short items between two rules. Decorative (hidden from
 * assistive tech): never the only place a fact is stated. Still with reduced motion.
 */
function Ticker({ items, className }: { items: string[]; className?: string }) {
    return (
        <div
            aria-hidden="true"
            data-slot="ticker"
            className={cn('flex h-10 items-center overflow-hidden border-t border-foreground bg-background', className)}
        >
            <div className="ticker-track label flex gap-12 whitespace-nowrap text-muted-foreground">
                {[
                    ...items,
                    ...items,
                ].map((item, i) => (
                    <span
                        key={i}
                        className="flex items-center gap-2"
                    >
                        {i % items.length === 0 ? <span className="live-dot" /> : null}
                        {item}
                    </span>
                ))}
            </div>
        </div>
    )
}

export { LiveDot, PageHead, SectionHead, Ticker }
