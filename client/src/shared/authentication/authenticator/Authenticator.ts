import {AuthenticatedUser} from "../persistence/AuthenticatedUser";

export interface Authenticator {

    isValidToken(token: string): boolean;

    getAuthenticatedUser(): Promise<AuthenticatedUser>;

}