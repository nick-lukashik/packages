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

## Releasing

1. Bump `version` in the packages that changed (semver: a breaking change is a new major) and merge.
2. Tag the merge commit `v<version>` and push the tag: `ci` verifies and publishes every package with that version to GitHub Packages.
3. Renovate opens the update in each service.

## Installing

A service has `.npmrc` with the scope only:

```ini
@nick-lukashik:registry=https://npm.pkg.github.com
```

GitHub Packages needs a token even for a public package, and pnpm ignores credentials with variables in a repository's `.npmrc`, so the token is user-level:

- CI: `build.yml` writes it from the run's `GITHUB_TOKEN` (`packages: read`) and passes it to the image build as the secret `npmrc`.
- Docker: the `pnpm install` steps mount the secret `npmrc` at `/root/.npmrc`.
- A Mac: once, with a token that has `read:packages`:

  ```bash
  gh auth refresh -h github.com -s read:packages
  pnpm config set //npm.pkg.github.com/:_authToken "$(gh auth token)"
  ```
