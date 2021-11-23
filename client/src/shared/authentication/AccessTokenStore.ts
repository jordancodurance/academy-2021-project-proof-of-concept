export abstract class AccessTokenStore {

    protected readonly ACCESS_TOKEN_KEY = 'proof-of-concept-access-token'

    abstract set(token: string): void

    abstract get(): string | null

}