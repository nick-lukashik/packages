import { describe, expect, it } from 'vitest'
import { paymentSucceededV1 } from './events.js'
import { grmAmountSchema, moneySchema } from './values.js'

describe('values', () => {
    it('accepts whole positive GRM only', () => {
        expect(grmAmountSchema.safeParse('1250').success).toBe(true)
        for (const bad of [
            '0',
            '-1',
            '01',
            '1.5',
            '1000000000000000',
        ]) {
            expect(grmAmountSchema.safeParse(bad).success).toBe(false)
        }
    })

    it('accepts money with at most two decimals', () => {
        expect(moneySchema.safeParse('4.99').success).toBe(true)
        expect(moneySchema.safeParse('4.999').success).toBe(false)
    })

    it('validates the payment event payload', () => {
        const result = paymentSucceededV1.payload.safeParse({
            paymentId: '0196f3c4-5b1a-7c3d-8e9f-0a1b2c3d4e5f',
            userId: '0196f3c4-5b1a-7c3d-8e9f-0a1b2c3d4e60',
            productKey: 'grm-500',
            grm: '500',
            amount: '449',
            currency: 'RUB',
            provider: 'fake',
            paidAt: new Date().toISOString(),
        })
        expect(result.success).toBe(true)
    })
})
