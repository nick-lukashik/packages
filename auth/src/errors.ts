/** A token that cannot be trusted: missing, malformed, expired, wrong issuer, audience, type or signature. */
export class InvalidTokenError extends Error {
    constructor(
        readonly reason: string,
        options?: {
            cause?: unknown
        },
    ) {
        super(`Invalid access token: ${reason}`, options)
        this.name = 'InvalidTokenError'
    }
}
