import {AccessTokenStore} from "../../shared/authentication/AccessTokenStore";
import {Authenticator} from "../../shared/authentication/Authenticator";

export class LoginService {

    private authenticator: Authenticator;
    private accessTokenStore: AccessTokenStore;

    constructor(authenticator: Authenticator, accessTokenStore: AccessTokenStore) {
        this.authenticator = authenticator;
        this.accessTokenStore = accessTokenStore;
    }

    attemptLogin(): Promise<void> {
        return this.authenticator.getAccessToken()
            .then(token => {
                this.accessTokenStore.addToken(token);
            });
    }
}