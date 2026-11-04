import { z } from 'zod'
import { coinAmountSchema, coinBalanceSchema, currencySchema, localeSchema, moneySchema, unitSchema } from './values.js'

/**
 * Event contracts between the services: type, producer (the exchange is
 * `<producer>.events`) and payload. Envelopes, the outbox and the inbox are
 * each service's own (nest-example, src/common/messaging). A breaking change
 * is a new type with the next version, published next to the old one until
 * every consumer has moved.
 */
export type EventContract<Type extends string, Payload extends z.ZodType> = {
    type: Type
    producer: string
    payload: Payload
}

const contract = <Type extends string, Payload extends z.ZodType>(
    type: Type,
    producer: string,
    payload: Payload,
): EventContract<Type, Payload> => ({
    type,
    producer,
    payload,
})

/** A person signed in for the first time (id-api). */
export const userRegisteredV1 = contract(
    'id.user.registered.v1',
    'id',
    z.object({
        userId: z.uuid(),
        locale: localeSchema,
        registeredAt: z.iso.datetime(),
    }),
)

/**
 * A payment is confirmed by its provider and matches the order snapshot
 * (pay-api). The wallet credits `coins` once per paymentId.
 */
export const paymentSucceededV1 = contract(
    'pay.payment.succeeded.v1',
    'pay',
    z.object({
        paymentId: z.uuid(),
        userId: z.uuid(),
        productKey: z.string().min(1).max(64),
        coins: coinAmountSchema,
        amount: moneySchema,
        currency: currencySchema,
        provider: z.string().min(1).max(32),
        paidAt: z.iso.datetime(),
    }),
)

/** Coins were credited to a wallet (wallet-api). */
export const walletCreditedV1 = contract(
    'wallet.credit.posted.v1',
    'wallet',
    z.object({
        txId: z.uuid(),
        userId: z.uuid(),
        unit: unitSchema,
        amount: coinAmountSchema,
        balanceAfter: coinBalanceSchema,
        source: z.enum([
            'pay',
            'admin',
            'roulette',
            'daily-bonus',
        ]),
        ref: z.string().min(1).max(209),
        createdAt: z.iso.datetime(),
    }),
)

/**
 * What a subscription gives changed (pay-api, once subscriptions are sold):
 * the plan `plan` of the service `service` ("roulette" + "vip") for the user,
 * until `accessUntil`, or nothing from now on when that is null (refunded,
 * ended). A person may hold any number of subscriptions, one grant each. A
 * one-off coin pack never sends this. `version` grows with every change of
 * one subscription: an older event never overrides a newer one.
 */
export const subscriptionChangedV1 = contract(
    'pay.subscription.changed.v1',
    'pay',
    z.object({
        subscriptionId: z.uuid(),
        userId: z.uuid(),
        service: z.string().regex(/^[a-z][a-z0-9-]{1,30}$/),
        plan: z.string().regex(/^[a-z][a-z0-9-]{1,30}$/),
        accessUntil: z.iso.datetime().nullable(),
        version: z.number().int().positive(),
        changedAt: z.iso.datetime(),
    }),
)
