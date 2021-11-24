import {AuthenticatedUser} from "./AuthenticatedUser";

export interface Authenticator {

    isValidToken(token: string): boolean;

    getAuthenticatedUser(): Promise<AuthenticatedUser>;

}