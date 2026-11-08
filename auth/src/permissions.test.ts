import { describe, expect, it } from 'vitest'
import { bearerToken, secretMatches } from './bearer.js'
import { grantKey, hasGrant, isGrant } from './grants.js'
import { isRole, permissions, permissionsOf } from './permissions.js'

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

    it('knows tailor as a role that carries no staff permission', () => {
        expect(isRole('tailor')).toBe(true)
        expect(
            permissionsOf([
                'tailor',
            ]).size,
        ).toBe(0)
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

describe('grants', () => {
    it('names a plan of a service', () => {
        expect(grantKey('roulette', 'vip')).toBe('roulette:vip')
        expect(isGrant('edu:pro')).toBe(true)
        for (const bad of [
            'roulette',
            'roulette:',
            'Roulette:vip',
            'a:b:c',
            7,
        ]) {
            expect(isGrant(bad)).toBe(false)
        }
        expect(() => grantKey('roulette', 'VIP')).toThrow()
    })

    it('answers for one plan or any plan of a service', () => {
        const claims = {
            grants: [
                'roulette:vip',
                'edu:pro',
            ],
        }
        expect(hasGrant(claims, 'roulette', 'vip')).toBe(true)
        expect(hasGrant(claims, 'roulette', 'basic')).toBe(false)
        expect(hasGrant(claims, 'edu')).toBe(true)
        expect(hasGrant(claims, 'battleship')).toBe(false)
    })
})
