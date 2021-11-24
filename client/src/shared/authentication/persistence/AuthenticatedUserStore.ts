import {AuthenticatedUser} from "./AuthenticatedUser";

export interface AuthenticatedUserStore {

    set(authenticatedUser: AuthenticatedUser): void

    get(): AuthenticatedUser | null

}