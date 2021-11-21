import {AccessTokenStore} from "../shared/authentication/AccessTokenStore";
import {Authenticator} from "../shared/authentication/Authenticator";
import {ApplicationNavigator} from "../shared/navigation/ApplicationNavigator";

export class LoginService {

    private authenticator: Authenticator;
    private accessTokenStore: AccessTokenStore;
    private applicationNavigator: ApplicationNavigator;

    constructor(authenticator: Authenticator, accessTokenStore: AccessTokenStore, applicationNavigator: ApplicationNavigator) {
        this.authenticator = authenticator;
        this.accessTokenStore = accessTokenStore;
        this.applicationNavigator = applicationNavigator;
    }

    attemptLogin(): Promise<void> {
        return this.authenticator.getAccessToken()
            .then(token => {
                this.accessTokenStore.addToken(token);
                this.applicationNavigator.navigateToHome();
            });
    }
}