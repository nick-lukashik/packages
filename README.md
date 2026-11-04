# packages

Shared `@nick-lukashik/*` packages, published to GitHub Packages. A service depends on a package by version and gets fixes as Renovate updates. Business modules and each service's schema stay in the service. Design: [`.github/docs/identity.md`](https://github.com/nick-lukashik/.github/blob/master/docs/identity.md), [`docs/templates.md`](https://github.com/nick-lukashik/.github/blob/master/docs/templates.md#packages-with-the-first-service).

| Package | What |
|---|---|
| [`@nick-lukashik/auth`](auth) | Verification of id-api access tokens (ES256, JWKS, `iss`, `aud`, `typ: at+jwt`), roles and permissions. Nest (`/nest`): `AuthModule`, `@Authenticated(...permissions)`, `@Caller()`, `InternalAuthModule` and `@Internal()` for in-cluster calls with a service token |
| [`@nick-lukashik/contracts`](contracts) | Payloads of the events between services, and the values they share: locales, coin amounts, currencies, money |

## Commands

```bash
pnpm install
pnpm verify    # biome, typecheck, build, vitest
```

## Using a package

```ts
import { AuthModule, Authenticated, Caller } from '@nick-lukashik/auth/nest'

AuthModule.forRootAsync({
    inject: [authConfig.KEY],
    useFactory: (auth: AuthConfig) => ({
        jwksUrl: auth.jwksUrl,
        issuer: auth.issuer,
        audience: auth.audience,
    }),
})

@Get('me/wallet')
@Authenticated()
wallet(@Caller() caller: AccessClaims) { ... }

@Post('admin/wallets/:userId/grant')
@Authenticated('wallet.adjust')
grant(...) { ... }
```

Errors: no token or a bad one → 401, a missing permission → 403, JWKS unreachable → 503. Each service's error filter maps them to its error codes.

## Before the first publish

Nothing is published yet. Until then the services under `apps/` depend on the local folders (`"@nick-lukashik/auth": "file:../../packages/auth"`). When the repo is on GitHub:

1. Tag and publish `0.1.0` (CI: `pnpm publish -r` with `GITHUB_TOKEN`, `packages: write`).
2. In each service, replace the `file:` dependency with `"0.1.0"` and add `.npmrc`:

   ```ini
   @nick-lukashik:registry=https://npm.pkg.github.com
   ```

3. Give `build.yml` the registry token input (planned in `docs/templates.md`). GitHub Packages needs a token even to install a public package.
