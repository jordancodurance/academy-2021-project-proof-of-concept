import {LocalStorageAccessTokenStore} from "../shared/authentication/LocalStorageAccessTokenStore";
import {Authenticator} from "../shared/authentication/Authenticator";
import {ApplicationNavigator} from "../shared/navigation/ApplicationNavigator";

export class LoginPolicyService {

    private authenticator: Authenticator;
    private accessTokenStore: LocalStorageAccessTokenStore;
    private applicationNavigator: ApplicationNavigator;

    constructor(authenticator: Authenticator, accessTokenStore: LocalStorageAccessTokenStore, applicationNavigator: ApplicationNavigator) {
        this.authenticator = authenticator;
        this.accessTokenStore = accessTokenStore;
        this.applicationNavigator = applicationNavigator;
    }

    attemptLogin(): Promise<void> {
        return this.authenticator.getAccessToken()
            .then(token => {
                this.accessTokenStore.set(token);
                this.applicationNavigator.navigateToHome();
            });
    }
}