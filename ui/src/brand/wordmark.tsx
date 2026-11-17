import type * as React from 'react'
import { cn } from '../lib/cn.ts'
import { WORDMARK_PATH, WORDMARK_VIEWBOX } from './wordmark-paths.ts'

/** The NICK LUKASHIK wordmark as one shape. Decorative: put the name as text next to it (or `sr-only`). */
function Wordmark(props: React.ComponentProps<'svg'>) {
    return (
        <svg
            viewBox={WORDMARK_VIEWBOX}
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
            {...props}
        >
            <path
                fillRule="evenodd"
                d={WORDMARK_PATH}
            />
        </svg>
    )
}

/** The NL monogram set in the display face: the small mark of a header or a favicon. */
function Monogram({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            aria-hidden="true"
            className={cn('font-display text-2xl leading-none font-bold', className)}
            {...props}
        >
            NL
        </span>
    )
}

export { Monogram, Wordmark }
