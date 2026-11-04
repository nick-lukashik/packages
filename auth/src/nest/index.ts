import 'reflect-metadata'

export { AccessTokenGuard, type AuthenticatedRequest } from './access-token.guard.js'
export { AuthModule, InternalAuthModule } from './auth.module.js'
export { Authenticated, Caller, Internal } from './decorators.js'
export { InternalTokenGuard } from './internal-token.guard.js'
export { ACCESS_TOKEN_VERIFIER, INTERNAL_API_TOKEN, REQUIRED_PERMISSIONS } from './tokens.js'
