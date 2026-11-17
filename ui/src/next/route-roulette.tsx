'use client'

import { usePathname, useRouter } from 'next/navigation.js'
import { Roulette, type RouletteLabels, type RoulettePage } from '../motion/roulette.tsx'

/** The roulette between pages, wired to the Next.js App Router. Render once, in the root layout. */
function RouteRoulette({ pages, labels }: { pages: RoulettePage[]; labels: RouletteLabels }) {
    const router = useRouter()
    const pathname = usePathname()
    return (
        <Roulette
            pages={pages}
            labels={labels}
            pathname={pathname}
            navigate={href => router.push(href as Parameters<typeof router.push>[0])}
        />
    )
}

export type { RouletteLabels, RoulettePage }
export { RouteRoulette }
