import {LoginPolicyService} from "./LoginPolicyService";
import {Authenticator} from "../shared/authentication/Authenticator";
import {ApplicationNavigator} from "../shared/navigation/ApplicationNavigator";
import {instance, mock, verify, when} from "ts-mockito";
import {AuthenticatedUserStore} from "../shared/authentication/AuthenticatedUserStore";
import {AuthenticatedUser} from "../shared/authentication/AuthenticatedUser";

describe('login policy service should ', () => {
    const authenticator = mock<Authenticator>();
    const authenticatedUserStore = mock<AuthenticatedUserStore>();
    const applicationNavigator = mock<ApplicationNavigator>();

    const loginService = new LoginPolicyService(
        instance(authenticator),
        instance(authenticatedUserStore),
        instance(applicationNavigator)
    );

    test('perform login criteria on successful login', async () => {
        const authenticatedUser: AuthenticatedUser = {
            name: "Best User",
            email: "best.user@codurance.com",
            accessToken: "access-token"
        };
        when(authenticator.getAuthenticatedUser()).thenResolve(authenticatedUser);

        await loginService.attemptLogin();

        verify(authenticatedUserStore.set(authenticatedUser)).calledBefore(applicationNavigator.navigateToHome());
    });

});