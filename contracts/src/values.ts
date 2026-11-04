import { z } from 'zod'

export const locales = [
    'en',
    'ru',
] as const
export type Locale = (typeof locales)[number]
export const localeSchema = z.enum(locales)

/** The wallet's only unit: coins. Whole numbers, no fractions. */
export const COIN = 'COIN'
export const unitSchema = z.literal(COIN)

/**
 * A positive amount of coins as a decimal string ("1250"), 1 to 10^15 - 1:
 * strings keep big integers exact in JSON.
 */
export const coinAmountSchema = z.string().regex(/^[1-9][0-9]{0,14}$/, 'a whole number of coins from 1 to 10^15 - 1')
/** A signed amount as in ledger rows ("+150", "-40"). */
export const signedCoinAmountSchema = z.string().regex(/^[+-][1-9][0-9]{0,14}$/)
/** A balance: zero or more. */
export const coinBalanceSchema = z.string().regex(/^(0|[1-9][0-9]{0,14})$/)

export const currencies = [
    'RUB',
    'USD',
    'EUR',
] as const
export type Currency = (typeof currencies)[number]
export const currencySchema = z.enum(currencies)
/** Money as a decimal string with at most two fraction digits ("499", "4.99"). */
export const moneySchema = z.string().regex(/^(0|[1-9][0-9]{0,11})(\.[0-9]{1,2})?$/)
