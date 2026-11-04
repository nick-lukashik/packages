import { z } from 'zod'

export const locales = [
    'en',
    'ru',
] as const
export type Locale = (typeof locales)[number]
export const localeSchema = z.enum(locales)

/** The wallet's only unit: grumbles. Whole numbers, no fractions. */
export const GRM = 'GRM'
export const unitSchema = z.literal(GRM)

/**
 * A positive amount of GRM as a decimal string ("1250"), 1 to 10^15 - 1:
 * strings keep big integers exact in JSON.
 */
export const grmAmountSchema = z.string().regex(/^[1-9][0-9]{0,14}$/, 'a whole number of GRM from 1 to 10^15 - 1')
/** A signed amount as in ledger rows ("+150", "-40"). */
export const signedGrmAmountSchema = z.string().regex(/^[+-][1-9][0-9]{0,14}$/)
/** A balance: zero or more. */
export const grmBalanceSchema = z.string().regex(/^(0|[1-9][0-9]{0,14})$/)

export const currencies = [
    'RUB',
    'USD',
    'EUR',
] as const
export type Currency = (typeof currencies)[number]
export const currencySchema = z.enum(currencies)
/** Money as a decimal string with at most two fraction digits ("499", "4.99"). */
export const moneySchema = z.string().regex(/^(0|[1-9][0-9]{0,11})(\.[0-9]{1,2})?$/)
