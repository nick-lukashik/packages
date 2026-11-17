import * as React from 'react'
import { createRoot } from 'react-dom/client'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Alert,
    AlertDescription,
    AlertTitle,
    Avatar,
    AvatarFallback,
    Badge,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Button,
    Calendar,
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Checkbox,
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    FilterList,
    FloatingWordmark,
    Input,
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    Kbd,
    Label,
    LiveDot,
    Monogram,
    PageHead,
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    Progress,
    RadioGroup,
    RadioGroupItem,
    Roulette,
    SectionHead,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Separator,
    Skeleton,
    Slider,
    Spinner,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Textarea,
    Ticker,
    Toaster,
    Toggle,
    ToggleGroup,
    ToggleGroupItem,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../src/index.ts'

const swatches = [
    [
        'background',
        'bg-background',
    ],
    [
        'foreground',
        'bg-foreground',
    ],
    [
        'secondary',
        'bg-secondary',
    ],
    [
        'muted-foreground',
        'bg-muted-foreground',
    ],
    [
        'soft',
        'bg-soft',
    ],
    [
        'line',
        'bg-line',
    ],
    [
        'signal',
        'bg-signal',
    ],
    [
        'destructive',
        'bg-destructive',
    ],
    [
        'warn',
        'bg-warn',
    ],
    [
        'info',
        'bg-info',
    ],
]

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
    return (
        <section
            aria-labelledby={id}
            className="border-t border-foreground py-14"
        >
            <div className="wrap">
                <h2
                    id={id}
                    className="label mb-8 text-muted-foreground"
                >
                    {title}
                </h2>
                {children}
            </div>
        </section>
    )
}

function Kit() {
    const pages = [
        {
            path: '/',
            name: 'Home',
            hint: 'index',
        },
        {
            path: '/blog',
            name: 'Blog',
            hint: 'notes',
        },
        {
            path: '/tools',
            name: 'Tools',
            hint: 'how I work',
        },
        {
            path: '/platform/events',
            name: 'Events',
            hint: 'platform',
        },
        {
            path: '/platform/identity',
            name: 'Identity',
            hint: 'platform',
        },
    ]
    const [path, setPath] = React.useState('/')
    return (
        <TooltipProvider>
            <header className="sticky top-0 z-30 border-b border-foreground bg-background">
                <div className="wrap flex h-16 items-center justify-between">
                    <span className="flex items-center gap-3.5">
                        <Monogram />
                        <span className="label text-[0.6875rem] tracking-[0.2em] text-muted-foreground">
                            @nick-lukashik/ui · Mono Brutal
                        </span>
                    </span>
                    <nav className="flex items-center gap-1">
                        <a
                            className="label inline-flex h-11 items-center px-2 text-muted-foreground hover:text-foreground"
                            href="#tokens"
                        >
                            Tokens
                        </a>
                        <a
                            className="label inline-flex h-11 items-center px-2 text-muted-foreground hover:text-foreground"
                            href="#controls"
                        >
                            Controls
                        </a>
                        <a
                            className="label inline-flex h-11 items-center px-2 text-muted-foreground hover:text-foreground"
                            href="#blocks"
                        >
                            Blocks
                        </a>
                        <Button
                            size="sm"
                            variant="outline"
                            className="ml-2"
                        >
                            Book a call
                        </Button>
                    </nav>
                </div>
            </header>
            <main>
                <section className="wrap py-20">
                    <p className="label mb-7 flex items-center gap-2.5 text-muted-foreground">
                        <LiveDot />
                        Design system · v0.3.0
                    </p>
                    <h1 className="mb-8">
                        <span className="sr-only">Nick Lukashik</span>
                        <FloatingWordmark className="block h-auto w-full max-w-[560px]" />
                    </h1>
                    <p className="max-w-[560px] text-base text-soft">
                        Black and white, square corners, 1px lines, condensed caps for titles and a monospace for
                        everything else. One colour, green, means "live".
                    </p>
                </section>
                <Ticker
                    items={[
                        'Mono Brutal',
                        '63 shadcn/ui components',
                        'Sofia Sans Extra Condensed',
                        'Martian Mono',
                        'WCAG AA on black',
                        'Strict CSP',
                    ]}
                />

                <Block
                    id="tokens"
                    title="01 · Tokens"
                >
                    <ul className="grid grid-cols-2 border-t border-l border-foreground sm:grid-cols-5">
                        {swatches.map(([name, cls]) => (
                            <li
                                key={name}
                                className="border-r border-b border-foreground p-4"
                            >
                                <span className={`mb-3 block h-14 border border-line ${cls}`} />
                                <span className="label text-[0.6875rem]">{name}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-10 grid gap-6 sm:grid-cols-2">
                        <div>
                            <p className="label mb-3 text-muted-foreground">Display · Sofia Sans Extra Condensed 800</p>
                            <p className="display text-[88px]">Let's talk</p>
                        </div>
                        <div>
                            <p className="label mb-3 text-muted-foreground">Text · Martian Mono 400 / 500 / 700</p>
                            <p className="text-base text-soft">
                                I own products end to end and run the platform this site lives on.
                            </p>
                            <p className="label mt-4">Label · small caps</p>
                        </div>
                    </div>
                </Block>

                <Block
                    id="controls"
                    title="02 · Controls"
                >
                    <div className="grid gap-10 lg:grid-cols-2">
                        <div className="grid content-start gap-6">
                            <div className="flex flex-wrap gap-3">
                                <Button>Default</Button>
                                <Button variant="outline">Outline</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="destructive">Delete</Button>
                                <Button variant="ghost">Ghost</Button>
                                <Button variant="link">Link</Button>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <Button size="lg">Large</Button>
                                <Button size="sm">Small</Button>
                                <Button
                                    size="xs"
                                    variant="outline"
                                >
                                    Tiny
                                </Button>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    aria-label="Spinner"
                                >
                                    <Spinner />
                                </Button>
                                <Button disabled>Disabled</Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Badge>Default</Badge>
                                <Badge variant="outline">Outline</Badge>
                                <Badge variant="secondary">Secondary</Badge>
                                <Badge variant="ok">Live</Badge>
                                <Badge variant="warn">Degraded</Badge>
                                <Badge variant="danger">Down</Badge>
                                <Badge variant="info">Syncing</Badge>
                            </div>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    placeholder="you@example.com"
                                />
                                <FieldDescription>A code arrives within a minute.</FieldDescription>
                            </Field>
                            <Field data-invalid="true">
                                <FieldLabel htmlFor="code">Code</FieldLabel>
                                <Input
                                    id="code"
                                    aria-invalid="true"
                                    defaultValue="12"
                                />
                                <FieldError>The code has six digits.</FieldError>
                            </Field>
                            <InputOTP
                                maxLength={6}
                                defaultValue="1234"
                            >
                                <InputOTPGroup>
                                    {[
                                        0,
                                        1,
                                        2,
                                        3,
                                        4,
                                        5,
                                    ].map(i => (
                                        <InputOTPSlot
                                            key={i}
                                            index={i}
                                        />
                                    ))}
                                </InputOTPGroup>
                            </InputOTP>
                            <Textarea placeholder="A few lines are enough." />
                        </div>
                        <div className="grid content-start gap-6">
                            <Select defaultValue="en">
                                <SelectTrigger className="w-60">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="ru">Русский</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex items-center gap-6">
                                <Label className="gap-2">
                                    <Checkbox defaultChecked /> Remember me
                                </Label>
                                <Label className="gap-2">
                                    <Switch defaultChecked /> Alerts
                                </Label>
                            </div>
                            <RadioGroup
                                defaultValue="b2b"
                                className="flex gap-6"
                            >
                                <Label className="gap-2">
                                    <RadioGroupItem value="b2b" /> Contract
                                </Label>
                                <Label className="gap-2">
                                    <RadioGroupItem value="ft" /> Employment
                                </Label>
                            </RadioGroup>
                            <Slider
                                defaultValue={[
                                    60,
                                ]}
                                max={100}
                            />
                            <Progress value={72} />
                            <div className="flex flex-wrap items-center gap-3">
                                <Toggle
                                    aria-label="Bold"
                                    defaultPressed
                                >
                                    B
                                </Toggle>
                                <ToggleGroup
                                    type="single"
                                    defaultValue="week"
                                    variant="outline"
                                >
                                    <ToggleGroupItem value="day">Day</ToggleGroupItem>
                                    <ToggleGroupItem value="week">Week</ToggleGroupItem>
                                    <ToggleGroupItem value="month">Month</ToggleGroupItem>
                                </ToggleGroup>
                                <Kbd>⌘</Kbd>
                                <Kbd>K</Kbd>
                            </div>
                            <Tabs defaultValue="how">
                                <TabsList>
                                    <TabsTrigger value="how">How</TabsTrigger>
                                    <TabsTrigger value="trade">Trade-offs</TabsTrigger>
                                    <TabsTrigger value="proof">Proof</TabsTrigger>
                                </TabsList>
                                <TabsContent
                                    value="how"
                                    className="pt-4 text-soft"
                                >
                                    Outbox in the same transaction, inbox on the consumer.
                                </TabsContent>
                            </Tabs>
                            <div className="flex flex-wrap gap-3">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">Open dialog</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Sign out everywhere</DialogTitle>
                                            <DialogDescription>
                                                Every site in this browser loses the session.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="outline">Cancel</Button>
                                            </DialogClose>
                                            <Button>Sign out</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">Menu</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Wallet</DropdownMenuItem>
                                        <DropdownMenuItem>Passkeys</DropdownMenuItem>
                                        <DropdownMenuItem>Sign out</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost">Hover me</Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Alerts straight to Telegram</TooltipContent>
                                </Tooltip>
                            </div>
                            <Calendar
                                mode="single"
                                selected={new Date(2026, 10, 18)}
                                defaultMonth={new Date(2026, 10, 1)}
                                className="w-fit border border-foreground"
                            />
                        </div>
                    </div>
                </Block>

                <Block
                    id="data"
                    title="03 · Content"
                >
                    <div className="grid gap-10 lg:grid-cols-2">
                        <div className="grid content-start gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Identity</CardTitle>
                                    <CardDescription>One sign-in for every site.</CardDescription>
                                    <CardAction>
                                        <LiveDot />
                                    </CardAction>
                                </CardHeader>
                                <CardContent className="text-soft">
                                    Short ES256 access tokens, rotating refresh tokens, sealed HttpOnly cookies.
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                    >
                                        Read more →
                                    </Button>
                                </CardFooter>
                            </Card>
                            <Alert>
                                <AlertTitle>Deployed</AlertTitle>
                                <AlertDescription>landing-web 251844d is live.</AlertDescription>
                            </Alert>
                            <Alert variant="destructive">
                                <AlertTitle>Smoke failed</AlertTitle>
                                <AlertDescription>/health/ready answered 503.</AlertDescription>
                            </Alert>
                            <Accordion
                                type="single"
                                collapsible
                                defaultValue="a"
                            >
                                <AccordionItem value="a">
                                    <AccordionTrigger>Why one node?</AccordionTrigger>
                                    <AccordionContent className="text-soft">
                                        Cheap to keep; recovery is drilled instead.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="b">
                                    <AccordionTrigger>Why GitOps?</AccordionTrigger>
                                    <AccordionContent>Nothing changes by hand.</AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                        <div className="grid content-start gap-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Service</TableHead>
                                        <TableHead>State</TableHead>
                                        <TableHead className="text-right">Replicas</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>landing-web</TableCell>
                                        <TableCell>
                                            <Badge variant="ok">Live</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">1</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>id-api</TableCell>
                                        <TableCell>
                                            <Badge variant="ok">Live</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">2</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>pay-api</TableCell>
                                        <TableCell>
                                            <Badge variant="warn">Off</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">0</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarFallback>NL</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-2">
                                    <Skeleton className="h-3 w-48" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="#">Platform</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Events</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious href="#" />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink
                                            href="#"
                                            isActive
                                        >
                                            1
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#">2</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationNext href="#" />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                            <Separator />
                            <Empty className="border border-dashed border-line">
                                <EmptyHeader>
                                    <EmptyTitle>No payments yet</EmptyTitle>
                                    <EmptyDescription>Coin packs show up here once you buy one.</EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        </div>
                    </div>
                </Block>

                <Block
                    id="blocks"
                    title="04 · Blocks and motion"
                >
                    <SectionHead
                        id="demo-section"
                        label="01 · Platform"
                        title="The platform"
                        intro="SectionHead: a label and a big title on the left, the intro on the right."
                    />
                    <PageHead
                        crumbs="Blog / Testing"
                        title="PageHead is the page h1"
                        intro="Breadcrumbs, title, intro."
                    />
                    <FilterList
                        label="Filter by topic"
                        all="All"
                        options={[
                            {
                                id: 'k3s',
                                name: 'K3s',
                            },
                            {
                                id: 'ai',
                                name: 'AI',
                            },
                        ]}
                    >
                        <ul className="border-t border-foreground">
                            <li
                                data-tags="k3s"
                                className="border-b border-foreground py-4 display text-2xl"
                            >
                                Alerts every four hours
                            </li>
                            <li
                                data-tags="ai"
                                className="border-b border-foreground py-4 display text-2xl"
                            >
                                One AI image, a live 3D logo
                            </li>
                        </ul>
                    </FilterList>
                    <p className="mt-10 mb-4 text-soft">The roulette: click a link to another page.</p>
                    <div className="flex flex-wrap gap-3">
                        {pages.slice(1).map(page => (
                            <Button
                                key={page.path}
                                asChild
                                variant="outline"
                            >
                                <a href={page.path}>{page.name}</a>
                            </Button>
                        ))}
                    </div>
                    <p className="label mt-4 text-muted-foreground">Current path: {path}</p>
                </Block>
            </main>
            <Roulette
                pages={pages}
                labels={{
                    opening: 'Opening → {name}',
                    site: 'nick-lukashik.com',
                    page: 'page',
                }}
                pathname={path}
                navigate={href => setTimeout(() => setPath(href), 300)}
            />
            <Toaster />
        </TooltipProvider>
    )
}

createRoot(document.getElementById('root') as HTMLElement).render(<Kit />)
