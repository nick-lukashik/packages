import { describe, expect, it } from 'vitest'
import { bearerToken, secretMatches } from './bearer.js'
import { permissions, permissionsOf } from './permissions.js'

describe('permissionsOf', () => {
    it('gives the owner every permission', () => {
        expect([
            ...permissionsOf([
                'owner',
            ]),
        ]).toEqual([
            ...permissions,
        ])
    })

    it('ignores unknown roles', () => {
        expect(
            permissionsOf([
                'pro',
                'admin',
            ]).size,
        ).toBe(0)
    })
})

describe('bearer helpers', () => {
    it('reads only a well-formed bearer header', () => {
        expect(bearerToken('Bearer abc.def-ghi_jkl')).toBe('abc.def-ghi_jkl')
        expect(bearerToken('bearer abc')).toBeUndefined()
        expect(bearerToken('Bearer a b')).toBeUndefined()
        expect(
            bearerToken([
                'Bearer abc',
            ]),
        ).toBeUndefined()
    })

    it('compares secrets without accepting empty ones', () => {
        expect(secretMatches('s'.repeat(40), 's'.repeat(40))).toBe(true)
        expect(secretMatches('s'.repeat(39), 's'.repeat(40))).toBe(false)
        expect(secretMatches(undefined, 's'.repeat(40))).toBe(false)
        expect(secretMatches('', '')).toBe(false)
    })
})
