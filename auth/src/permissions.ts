/**
 * Roles live in id-api (role_bindings); what a role may do is this one table,
 * shared by every service. An unknown role grants nothing, an unknown
 * permission is never granted.
 *
 * Two kinds of roles. Staff roles (owner, support) are granted by hand and
 * never bought. A paid role (subscriber) comes only from a subscription,
 * for the paid period (event `pay.subscription.changed.v1`); a one-off coin
 * pack never gives a role.
 */
export const permissions = [
    'users.read',
    'sessions.revoke',
    'notifications.read',
    'wallet.read',
    'wallet.adjust',
    'payments.read',
    /** What a paid plan unlocks; each service decides what that is. */
    'premium.use',
] as const
export type Permission = (typeof permissions)[number]

export const staffRoles = [
    'owner',
    'support',
] as const
export const paidRoles = [
    'subscriber',
] as const
export const roles = [
    ...staffRoles,
    ...paidRoles,
] as const
export type Role = (typeof roles)[number]
export type StaffRole = (typeof staffRoles)[number]
export type PaidRole = (typeof paidRoles)[number]

export const rolePermissions: Record<Role, readonly Permission[]> = {
    owner: permissions,
    support: [
        'users.read',
        'sessions.revoke',
        'notifications.read',
    ],
    subscriber: [
        'premium.use',
    ],
}

export function isRole(value: unknown): value is Role {
    return typeof value === 'string' && (roles as readonly string[]).includes(value)
}

export function isStaffRole(value: unknown): value is StaffRole {
    return typeof value === 'string' && (staffRoles as readonly string[]).includes(value)
}

/** Every permission the given roles carry; unknown roles add nothing. */
export function permissionsOf(granted: readonly string[]): ReadonlySet<Permission> {
    const result = new Set<Permission>()
    for (const role of granted) {
        if (isRole(role)) for (const permission of rolePermissions[role]) result.add(permission)
    }
    return result
}
