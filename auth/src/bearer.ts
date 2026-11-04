import { createHash, timingSafeEqual } from 'node:crypto'

const BEARER = /^Bearer ([A-Za-z0-9._~+/-]+=*)$/

/** The token of an `Authorization: Bearer <token>` header, or undefined. */
export function bearerToken(header: string | string[] | undefined): string | undefined {
    if (typeof header !== 'string' || header.length > 8_192) return undefined
    return BEARER.exec(header)?.[1]
}

/**
 * Compares a presented secret with the expected one in constant time. Both
 * are hashed first, so neither their length nor a common prefix leaks.
 */
export function secretMatches(presented: string | undefined, expected: string): boolean {
    if (!presented || !expected) return false
    const digest = (value: string) => createHash('sha256').update(value).digest()
    return timingSafeEqual(digest(presented), digest(expected))
}
