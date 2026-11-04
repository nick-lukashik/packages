import type { Permission } from './permissions.js'

/** `typ` header of an access token (RFC 9068); tokens of any other type are refused. */
export const ACCESS_TOKEN_TYPE = 'at+jwt'
/** The only signing algorithm id-api uses and verifiers accept. */
export const ACCESS_TOKEN_ALGORITHM = 'ES256'

/** The verified caller of a request. */
export type AccessClaims = {
    userId: string
    sessionId: string
    roles: readonly string[]
    /** Bumped by id-api when roles or the account status change. */
    accessVersion: number
    permissions: ReadonlySet<Permission>
    expiresAt: Date
}
