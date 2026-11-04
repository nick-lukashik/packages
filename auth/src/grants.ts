/**
 * What a person has paid for: a plan of a service ("roulette:vip",
 * "edu:pro"), from a subscription, for its paid period. Any number at once,
 * one per subscription. id-api puts the grants in force into the access token
 * (`grants`), so a grant that ran out or was refunded is gone from the next
 * token, within five minutes, with no job.
 */
export const GRANT_PART = /^[a-z][a-z0-9-]{1,30}$/

export type Grant = `${string}:${string}`

export function grantKey(service: string, plan: string): Grant {
    if (!GRANT_PART.test(service) || !GRANT_PART.test(plan)) throw new Error(`not a grant: ${service}:${plan}`)
    return `${service}:${plan}`
}

export function isGrant(value: unknown): value is Grant {
    if (typeof value !== 'string') return false
    const [service = '', plan = '', ...rest] = value.split(':')
    return rest.length === 0 && GRANT_PART.test(service) && GRANT_PART.test(plan)
}

/** Whether the caller has a plan of a service, or any plan of it without `plan`. */
export function hasGrant(
    claims: {
        grants: readonly string[]
    },
    service: string,
    plan?: string,
) {
    return claims.grants.some(grant =>
        plan === undefined ? grant.startsWith(`${service}:`) : grant === `${service}:${plan}`,
    )
}
