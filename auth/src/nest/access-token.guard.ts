import {
    type CanActivate,
    type ExecutionContext,
    ForbiddenException,
    Inject,
    Injectable,
    ServiceUnavailableException,
    UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { bearerToken } from '../bearer.js'
import type { AccessClaims } from '../claims.js'
import { InvalidTokenError } from '../errors.js'
import type { Permission } from '../permissions.js'
import type { AccessTokenVerifier } from '../verifier.js'
import { ACCESS_TOKEN_VERIFIER, REQUIRED_PERMISSIONS } from './tokens.js'

/** The request after AccessTokenGuard: `auth` is the verified caller. */
export type AuthenticatedRequest = {
    headers: Record<string, string | string[] | undefined>
    auth?: AccessClaims
}

/**
 * Lets a request in only with a valid access token of id-api, and only with
 * every permission named by @RequirePermissions. 401 for a missing or bad
 * token (the client refreshes and retries), 403 for a missing permission,
 * 503 when the JWKS cannot be fetched.
 */
@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(
        @Inject(ACCESS_TOKEN_VERIFIER) private readonly verify: AccessTokenVerifier,
        @Inject(Reflector) private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
        const token = bearerToken(request.headers.authorization)
        if (!token) throw new UnauthorizedException('Access token required')
        try {
            request.auth = await this.verify(token)
        } catch (error) {
            if (error instanceof InvalidTokenError) throw new UnauthorizedException('Invalid or expired access token')
            throw new ServiceUnavailableException('Identity keys unavailable, retry later')
        }
        const required =
            this.reflector.getAllAndOverride<Permission[] | undefined>(REQUIRED_PERMISSIONS, [
                context.getHandler(),
                context.getClass(),
            ]) ?? []
        const missing = required.filter(permission => !request.auth?.permissions.has(permission))
        if (missing.length > 0) throw new ForbiddenException(`Missing permission: ${missing.join(', ')}`)
        return true
    }
}
