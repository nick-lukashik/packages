import { type DynamicModule, Global, Module, type ModuleMetadata } from '@nestjs/common'
import { createAccessTokenVerifier, type VerifierOptions } from '../verifier.js'
import { AccessTokenGuard } from './access-token.guard.js'
import { InternalTokenGuard } from './internal-token.guard.js'
import { ACCESS_TOKEN_VERIFIER, INTERNAL_API_TOKEN } from './tokens.js'

type Factory<T> = {
    /** Modules whose providers the factory injects (e.g. id-api's own signing keys). */
    imports?: ModuleMetadata['imports']
    inject?: (string | symbol | (abstract new (...args: never[]) => unknown))[]
    useFactory: (...args: never[]) => T | Promise<T>
}

/** Verifies access tokens of id-api for @Authenticated() routes. */
@Global()
@Module({})
export class AuthModule {
    static forRootAsync(options: Factory<VerifierOptions>): DynamicModule {
        return {
            module: AuthModule,
            imports: options.imports ?? [],
            providers: [
                {
                    provide: ACCESS_TOKEN_VERIFIER,
                    inject: options.inject ?? [],
                    useFactory: async (...args: never[]) =>
                        createAccessTokenVerifier(await options.useFactory(...args)),
                },
                AccessTokenGuard,
            ],
            exports: [
                ACCESS_TOKEN_VERIFIER,
                AccessTokenGuard,
            ],
        }
    }
}

/** Checks the service token of in-cluster callers for @Internal() routes. */
@Global()
@Module({})
export class InternalAuthModule {
    static forRootAsync(options: Factory<string>): DynamicModule {
        return {
            module: InternalAuthModule,
            imports: options.imports ?? [],
            providers: [
                {
                    provide: INTERNAL_API_TOKEN,
                    inject: options.inject ?? [],
                    useFactory: async (...args: never[]) => {
                        const token = await options.useFactory(...args)
                        if (token.length < 32) throw new Error('INTERNAL_API_TOKEN must be at least 32 characters')
                        return token
                    },
                },
                InternalTokenGuard,
            ],
            exports: [
                INTERNAL_API_TOKEN,
                InternalTokenGuard,
            ],
        }
    }
}
