import { type CanActivate, type ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { bearerToken, secretMatches } from '../bearer.js'
import { INTERNAL_API_TOKEN } from './tokens.js'

/**
 * In-cluster service calls: `Authorization: Bearer <INTERNAL_API_TOKEN>` of
 * the receiving service, compared in constant time. The NetworkPolicy admits
 * only api-client pods; this is the second lock.
 */
@Injectable()
export class InternalTokenGuard implements CanActivate {
    constructor(@Inject(INTERNAL_API_TOKEN) private readonly token: string) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<{
            headers: Record<string, string | string[] | undefined>
        }>()
        if (!secretMatches(bearerToken(request.headers.authorization), this.token)) {
            throw new UnauthorizedException('Service token required')
        }
        return true
    }
}
