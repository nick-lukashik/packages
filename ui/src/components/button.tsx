import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import { Slot } from 'radix-ui'
import * as React from 'react'

// Mono Brutal: square, 1px, monospace caps; a press inverts the colours, nothing moves.
const buttonVariants = cva(
    "group/button inline-flex shrink-0 items-center justify-center border font-sans font-bold tracking-[0.1em] whitespace-nowrap uppercase outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default:
                    'border-foreground bg-foreground text-background hover:bg-background hover:text-foreground aria-expanded:bg-background aria-expanded:text-foreground',
                outline:
                    'border-foreground bg-background text-foreground hover:bg-foreground hover:text-background aria-expanded:bg-foreground aria-expanded:text-background',
                secondary:
                    'border-line bg-secondary text-secondary-foreground hover:border-foreground aria-expanded:border-foreground',
                ghost: 'border-transparent text-muted-foreground hover:text-foreground aria-expanded:text-foreground',
                destructive:
                    'border-destructive bg-background text-destructive hover:bg-destructive hover:text-background',
                link: 'border-transparent text-foreground underline underline-offset-4 hover:text-muted-foreground',
            },
            size: {
                default: 'h-[3.125rem] gap-2.5 px-6 text-[0.8125rem]',
                xs: "h-7 gap-1.5 px-2.5 text-[0.625rem] [&_svg:not([class*='size-'])]:size-3",
                sm: 'h-[2.375rem] gap-2 px-3.5 text-[0.6875rem]',
                lg: 'h-14 gap-3 px-7 text-sm',
                icon: 'size-11',
                'icon-xs': "size-7 [&_svg:not([class*='size-'])]:size-3",
                'icon-sm': 'size-9',
                'icon-lg': 'size-14',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
)

function Button({
    className,
    variant = 'default',
    size = 'default',
    asChild = false,
    ...props
}: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean
    }) {
    const Comp = asChild ? Slot.Root : 'button'

    return (
        <Comp
            data-slot="button"
            data-variant={variant}
            data-size={size}
            className={cn(
                buttonVariants({
                    variant,
                    size,
                    className,
                }),
            )}
            {...props}
        />
    )
}

export { Button, buttonVariants }
