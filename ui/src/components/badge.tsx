import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import { Slot } from 'radix-ui'
import * as React from 'react'

const badgeVariants = cva(
    'group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden border px-2.5 font-sans text-[0.6875rem] font-medium tracking-[0.08em] whitespace-nowrap uppercase focus-visible:outline-2 focus-visible:outline-ring has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 aria-invalid:border-destructive [&>svg]:pointer-events-none [&>svg]:size-3!',
    {
        variants: {
            variant: {
                default:
                    'border-foreground bg-foreground text-background [a]:hover:bg-background [a]:hover:text-foreground',
                // The four states, each on its own dark tint and always with a word.
                ok: 'border-ok/40 bg-ok-soft text-ok',
                warn: 'border-warn/40 bg-warn-soft text-warn',
                danger: 'border-destructive/40 bg-danger-soft text-destructive',
                info: 'border-info/40 bg-info-soft text-info',
                secondary: 'border-line bg-secondary text-secondary-foreground [a]:hover:border-foreground',
                destructive: 'border-destructive text-destructive [a]:hover:bg-destructive [a]:hover:text-background',
                outline:
                    'border-line text-soft [a]:hover:border-foreground [a]:hover:bg-foreground [a]:hover:text-background',
                ghost: 'border-transparent text-muted-foreground hover:text-foreground',
                link: 'border-transparent text-foreground underline underline-offset-4',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
)

function Badge({
    className,
    variant = 'default',
    asChild = false,
    ...props
}: React.ComponentProps<'span'> &
    VariantProps<typeof badgeVariants> & {
        asChild?: boolean
    }) {
    const Comp = asChild ? Slot.Root : 'span'

    return (
        <Comp
            data-slot="badge"
            data-variant={variant}
            className={cn(
                badgeVariants({
                    variant,
                }),
                className,
            )}
            {...props}
        />
    )
}

export { Badge, badgeVariants }
