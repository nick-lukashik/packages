import 'reflect-metadata'
import { randomUUID } from 'node:crypto'
import { ForbiddenException, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { describe, expect, it } from 'vitest'
import type { AccessClaims } from '../claims.js'
import { InvalidTokenError } from '../errors.js'
import { permissionsOf } from '../permissions.js'
import { AccessTokenGuard } from './access-token.guard.js'
import { Authenticated } from './decorators.js'
import { InternalTokenGuard } from './internal-token.guard.js'

class Controller {
    @Authenticated('wallet.adjust')
    adjust() {}

    @Authenticated()
    read() {}
}

const claims = (roles: string[]): AccessClaims => ({
    userId: randomUUID(),
    sessionId: randomUUID(),
    roles,
    grants: [],
    accessVersion: 0,
    permissions: permissionsOf(roles),
    expiresAt: new Date(Date.now() + 60_000),
})

function context(handler: () => void, authorization?: string) {
    const request: Record<string, unknown> = {
        headers: authorization
            ? {
                  authorization,
              }
            : {},
    }
    return {
        request,
        context: {
            switchToHttp: () => ({
                getRequest: () => request,
            }),
            getHandler: () => handler,
            getClass: () => Controller,
        } as never,
    }
}

describe('AccessTokenGuard', () => {
    const guard = (verify: (token: string) => Promise<AccessClaims>) => new AccessTokenGuard(verify, new Reflector())

    it('sets the caller and checks permissions', async () => {
        const { context: ctx, request } = context(Controller.prototype.adjust, 'Bearer t')
        await expect(
            guard(async () =>
                claims([
                    'owner',
                ]),
            ).canActivate(ctx),
        ).resolves.toBe(true)
        expect((request.auth as AccessClaims).roles).toEqual([
            'owner',
        ])
    })

    it('answers 403 without the permission', async () => {
        const { context: ctx } = context(Controller.prototype.adjust, 'Bearer t')
        await expect(
            guard(async () =>
                claims([
                    'support',
                ]),
            ).canActivate(ctx),
        ).rejects.toBeInstanceOf(ForbiddenException)
    })

    it('answers 401 without a token or with a bad one', async () => {
        await expect(
            guard(async () => claims([])).canActivate(context(Controller.prototype.read).context),
        ).rejects.toBeInstanceOf(UnauthorizedException)
        await expect(
            guard(async () => {
                throw new InvalidTokenError('ERR_JWT_EXPIRED')
            }).canActivate(context(Controller.prototype.read, 'Bearer t').context),
        ).rejects.toBeInstanceOf(UnauthorizedException)
    })

    it('answers 503 when the keys cannot be fetched', async () => {
        await expect(
            guard(async () => {
                throw new TypeError('fetch failed')
            }).canActivate(context(Controller.prototype.read, 'Bearer t').context),
        ).rejects.toBeInstanceOf(ServiceUnavailableException)
    })
})

describe('InternalTokenGuard', () => {
    const secret = 'x'.repeat(48)

    it('lets the right service token in and nothing else', () => {
        const guard = new InternalTokenGuard(secret)
        expect(guard.canActivate(context(Controller.prototype.read, `Bearer ${secret}`).context)).toBe(true)
        expect(() => guard.canActivate(context(Controller.prototype.read, 'Bearer nope').context)).toThrow(
            UnauthorizedException,
        )
        expect(() => guard.canActivate(context(Controller.prototype.read).context)).toThrow(UnauthorizedException)
    })
})
