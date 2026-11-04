import { randomUUID } from 'node:crypto'
import { createLocalJWKSet, exportJWK, generateKeyPair, type JWK, SignJWT } from 'jose'
import { beforeAll, describe, expect, it } from 'vitest'
import { InvalidTokenError } from './errors.js'
import { createAccessTokenVerifier } from './verifier.js'

const issuer = 'https://id.example.test'
const audience = 'nick-lukashik'
let privateKey: CryptoKey
let jwks: {
    keys: JWK[]
}

beforeAll(async () => {
    const pair = await generateKeyPair('ES256', {
        extractable: true,
    })
    privateKey = pair.privateKey
    jwks = {
        keys: [
            {
                ...(await exportJWK(pair.publicKey)),
                kid: 'k1',
                alg: 'ES256',
            },
        ],
    }
})

const verifier = () =>
    createAccessTokenVerifier({
        issuer,
        audience,
        keys: createLocalJWKSet(jwks),
    })

type Overrides = {
    typ?: string
    iss?: string
    aud?: string
    exp?: number
    sub?: string
    roles?: unknown
}

async function token(overrides: Overrides = {}) {
    const now = Math.floor(Date.now() / 1000)
    return new SignJWT({
        sid: randomUUID(),
        roles: overrides.roles ?? [
            'support',
        ],
        av: 3,
    })
        .setProtectedHeader({
            alg: 'ES256',
            kid: 'k1',
            typ: overrides.typ ?? 'at+jwt',
        })
        .setSubject(overrides.sub ?? randomUUID())
        .setIssuer(overrides.iss ?? issuer)
        .setAudience(overrides.aud ?? audience)
        .setIssuedAt(now)
        .setExpirationTime(overrides.exp ?? now + 300)
        .sign(privateKey)
}

describe('createAccessTokenVerifier', () => {
    it('returns the caller with permissions derived from roles', async () => {
        const claims = await verifier()(await token())
        expect(claims.roles).toEqual([
            'support',
        ])
        expect(claims.accessVersion).toBe(3)
        expect(claims.permissions.has('sessions.revoke')).toBe(true)
        expect(claims.permissions.has('wallet.adjust')).toBe(false)
    })

    it.each([
        [
            'a token of another type',
            {
                typ: 'JWT',
            },
        ],
        [
            'another issuer',
            {
                iss: 'https://evil.example',
            },
        ],
        [
            'another audience',
            {
                aud: 'someone-else',
            },
        ],
        [
            'an expired token',
            {
                exp: Math.floor(Date.now() / 1000) - 60,
            },
        ],
        [
            'a subject that is not a user id',
            {
                sub: 'admin',
            },
        ],
        [
            'roles that are not strings',
            {
                roles: [
                    1,
                ],
            },
        ],
    ] satisfies [
        string,
        Overrides,
    ][])('refuses %s', async (_name, overrides) => {
        await expect(verifier()(await token(overrides))).rejects.toBeInstanceOf(InvalidTokenError)
    })

    it('refuses an HMAC token signed with the public key', async () => {
        const forged = await new SignJWT({
            sid: randomUUID(),
            roles: [
                'owner',
            ],
            av: 0,
        })
            .setProtectedHeader({
                alg: 'HS256',
                kid: 'k1',
                typ: 'at+jwt',
            })
            .setSubject(randomUUID())
            .setIssuer(issuer)
            .setAudience(audience)
            .setIssuedAt()
            .setExpirationTime('5m')
            .sign(new TextEncoder().encode(JSON.stringify(jwks.keys[0])))
        await expect(verifier()(forged)).rejects.toBeInstanceOf(InvalidTokenError)
    })

    it('refuses garbage', async () => {
        await expect(verifier()('not.a.jwt')).rejects.toBeInstanceOf(InvalidTokenError)
    })
})
