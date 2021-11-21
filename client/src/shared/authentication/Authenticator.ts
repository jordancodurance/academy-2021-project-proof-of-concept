export interface Authenticator {

    isValidToken(token: string): boolean

    getAccessToken(): Promise<string>;

}