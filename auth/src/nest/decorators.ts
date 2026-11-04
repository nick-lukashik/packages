import { applyDecorators, createParamDecorator, type ExecutionContext, SetMetadata, UseGuards } from '@nestjs/common'
import type { AccessClaims } from '../claims.js'
import type { Permission } from '../permissions.js'
import { AccessTokenGuard, type AuthenticatedRequest } from './access-token.guard.js'
import { InternalTokenGuard } from './internal-token.guard.js'
import { REQUIRED_PERMISSIONS } from './tokens.js'

/** The route needs a valid access token; with permissions, every one of them. */
export const Authenticated = (...required: Permission[]) =>
    applyDecorators(SetMetadata(REQUIRED_PERMISSIONS, required), UseGuards(AccessTokenGuard))

/** Only for in-cluster callers holding this service's INTERNAL_API_TOKEN. */
export const Internal = () => UseGuards(InternalTokenGuard)

/** The verified caller of an @Authenticated() route. */
export const Caller = createParamDecorator((_data: unknown, context: ExecutionContext): AccessClaims => {
    const auth = context.switchToHttp().getRequest<AuthenticatedRequest>().auth
    if (!auth) throw new Error('@Caller() used on a route without @Authenticated()')
    return auth
})
