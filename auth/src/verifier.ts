import { createRemoteJWKSet, errors, type JWTPayload, type JWTVerifyGetKey, jwtVerify } from 'jose'
import { ACCESS_TOKEN_ALGORITHM, ACCESS_TOKEN_TYPE, type AccessClaims } from './claims.js'
import { InvalidTokenError } from './errors.js'
import { isGrant } from './grants.js'
import { permissionsOf } from './permissions.js'

export type VerifierOptions = {
    issuer: string
    audience: string
    /** Clock skew allowed on `exp` and `nbf`, seconds. */
    clockToleranceSec?: number
} & (
    | {
          /** id-api's JWKS, e.g. http://id-api.prod.svc/.well-known/jwks.json. */
          jwksUrl: string
          /** Deadline of one JWKS fetch; a hung id-api fails the request fast. */
          jwksTimeoutMs?: number
      }
    | {
          /** Local keys: id-api verifies its own tokens without HTTP. */
          keys: JWTVerifyGetKey
      }
)

export type AccessTokenVerifier = (token: string) => Promise<AccessClaims>

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Verifies access tokens of id-api. The JWKS is cached and refetched on an
 * unknown `kid` (at most every 30 s), so a key rotation needs no restart and a
 * short id-api outage does not fail requests whose key is cached.
 */
export function createAccessTokenVerifier(options: VerifierOptions): AccessTokenVerifier {
    const keys =
        'keys' in options
            ? options.keys
            : createRemoteJWKSet(new URL(options.jwksUrl), {
                  timeoutDuration: options.jwksTimeoutMs ?? 2_000,
                  cooldownDuration: 30_000,
                  cacheMaxAge: 10 * 60_000,
              })
    return async token => {
        let payload: JWTPayload
        try {
            ;({ payload } = await jwtVerify(token, keys, {
                issuer: options.issuer,
                audience: options.audience,
                algorithms: [
                    ACCESS_TOKEN_ALGORITHM,
                ],
                typ: ACCESS_TOKEN_TYPE,
                clockTolerance: options.clockToleranceSec ?? 5,
                requiredClaims: [
                    'sub',
                    'exp',
                    'iat',
                ],
            }))
        } catch (error) {
            // A JWKS that cannot be fetched is an outage, not a bad token.
            if (error instanceof errors.JWKSTimeout || isFetchFailure(error)) throw error
            throw new InvalidTokenError(error instanceof errors.JOSEError ? error.code : 'malformed', {
                cause: error,
            })
        }
        return toClaims(payload)
    }
}

function isFetchFailure(error: unknown) {
    return error instanceof TypeError && /fetch/i.test(error.message)
}

function toClaims(payload: JWTPayload): AccessClaims {
    const {
        sub,
        sid,
        roles,
        grants = [],
        av,
        exp,
    } = payload as JWTPayload & {
        sid?: unknown
        roles?: unknown
        grants?: unknown
        av?: unknown
    }
    if (typeof sub !== 'string' || !UUID.test(sub)) throw new InvalidTokenError('sub')
    if (typeof sid !== 'string' || !UUID.test(sid)) throw new InvalidTokenError('sid')
    if (!Array.isArray(roles) || !roles.every(role => typeof role === 'string')) throw new InvalidTokenError('roles')
    if (!Array.isArray(grants) || !grants.every(isGrant)) throw new InvalidTokenError('grants')
    if (typeof av !== 'number' || !Number.isInteger(av) || av < 0) throw new InvalidTokenError('av')
    return {
        userId: sub,
        sessionId: sid,
        roles,
        grants,
        accessVersion: av,
        permissions: permissionsOf(roles),
        expiresAt: new Date((exp ?? 0) * 1000),
    }
}
