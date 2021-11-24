import {Authenticator} from "../shared/authentication/authenticator/Authenticator";
import {ApplicationNavigator} from "../shared/navigation/ApplicationNavigator";
import {AuthenticatedUserStore} from "../shared/authentication/AuthenticatedUserStore";

export class LoginPolicyService {

    private authenticator: Authenticator;
    private authenticatedUserStore: AuthenticatedUserStore;
    private applicationNavigator: ApplicationNavigator;

    constructor(authenticator: Authenticator, authenticatedUserStore: AuthenticatedUserStore, applicationNavigator: ApplicationNavigator) {
        this.authenticator = authenticator;
        this.authenticatedUserStore = authenticatedUserStore;
        this.applicationNavigator = applicationNavigator;
    }

    attemptLogin(): Promise<void> {
        return this.authenticator.getAuthenticatedUser()
            .then(user => {
                this.authenticatedUserStore.set(user);
                this.applicationNavigator.navigateToHome();
            });
    }
}