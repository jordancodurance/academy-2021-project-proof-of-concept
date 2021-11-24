import {AuthenticatedUserStore} from "./AuthenticatedUserStore";
import {AuthenticatedUser} from "./AuthenticatedUser";

export class LocalStorageAuthenticatedUserStore implements AuthenticatedUserStore {

    private readonly AUTHENTICATED_USER_KEY = 'proof-of-concept-authenticated-user';

    public set(authenticatedUser: AuthenticatedUser): void {
        const formattedUser = JSON.stringify(authenticatedUser);
        localStorage.setItem(this.AUTHENTICATED_USER_KEY, formattedUser);
    }

    public get(): AuthenticatedUser | null {
        const persistedUser = localStorage.getItem(this.AUTHENTICATED_USER_KEY);
        if (!persistedUser) return null;

        return JSON.parse(persistedUser);
    }

}