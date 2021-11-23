import {LoginPolicyService} from "./LoginPolicyService";
import {Authenticator} from "../shared/authentication/Authenticator";
import {ApplicationNavigator} from "../shared/navigation/ApplicationNavigator";
import {instance, mock, verify, when} from "ts-mockito";
import {AccessTokenStore} from "../shared/authentication/AccessTokenStore";

describe('login policy service should ', () => {
    const authenticator = mock<Authenticator>();
    const accessTokenStore = mock<AccessTokenStore>();
    const applicationNavigator = mock<ApplicationNavigator>();

    const loginService = new LoginPolicyService(
        instance(authenticator),
        instance(accessTokenStore),
        instance(applicationNavigator)
    );

    test('perform login criteria on successful login', async () => {
        when(authenticator.getAccessToken()).thenResolve("access-token");

        await loginService.attemptLogin();

        verify(accessTokenStore.set('access-token')).calledBefore(applicationNavigator.navigateToHome());
    });

});