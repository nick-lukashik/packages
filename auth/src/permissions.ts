/**
 * Staff roles live in id-api (role_bindings) and are granted by hand; what a
 * role may do is this one table, shared by every service. An unknown role
 * grants nothing, an unknown permission is never granted. Money never buys a
 * role: what a subscription pays for is a grant (grants.ts).
 */
export const permissions = [
    'users.read',
    'sessions.revoke',
    'notifications.read',
    'wallet.read',
    'wallet.adjust',
    'payments.read',
] as const
export type Permission = (typeof permissions)[number]

export const roles = [
    'owner',
    'support',
] as const
export type Role = (typeof roles)[number]

export const rolePermissions: Record<Role, readonly Permission[]> = {
    owner: permissions,
    support: [
        'users.read',
        'sessions.revoke',
        'notifications.read',
    ],
}

export function isRole(value: unknown): value is Role {
    return typeof value === 'string' && (roles as readonly string[]).includes(value)
}

/** Every permission the given roles carry; unknown roles add nothing. */
export function permissionsOf(granted: readonly string[]): ReadonlySet<Permission> {
    const result = new Set<Permission>()
    for (const role of granted) {
        if (isRole(role)) for (const permission of rolePermissions[role]) result.add(permission)
    }
    return result
}
