import React from 'react';
import {Route, Routes, useNavigate} from "react-router-dom";
import Home from "./home/Home";
import Login from "./login/Login";
import {AuthenticatedRouteGuard} from "./shared/navigation/AuthenticatedRouteGuard";
import {GoogleAuthenticator} from "./shared/authentication/authenticator/GoogleAuthenticator";
import {LocalStorageAuthenticatedUserStore} from "./shared/authentication/LocalStorageAuthenticatedUserStore";
import {LoginPolicyService} from "./login/LoginPolicyService";
import {AuthenticatedAxiosClient} from "./shared/http/AuthenticatedAxiosClient";
import {ReactRouterApplicationNavigator} from "./shared/navigation/ReactRouterApplicationNavigator";
import {ApplicationNavigator} from "./shared/navigation/ApplicationNavigator";
import {GoogleUserProvider} from "./shared/authentication/authenticator/GoogleUserProvider";

function App() {
    const navigator = useNavigate();
    const googleUserProvider = new GoogleUserProvider();
    const authenticator = new GoogleAuthenticator(googleUserProvider);
    const authenticatedUserStore = new LocalStorageAuthenticatedUserStore();
    const applicationNavigator = new ReactRouterApplicationNavigator(navigator);
    const loginService = new LoginPolicyService(authenticator, authenticatedUserStore, applicationNavigator);
    const authenticatedHttpClient = new AuthenticatedAxiosClient(applicationNavigator, authenticatedUserStore);

    authenticatedHttpClient.enableResponseInterception();

    return (
        <div className="App">
            <Routes>
                <Route path={ApplicationNavigator.LOGIN_ROUTE} element={<Login loginPolicyService={loginService}/>}/>
                <Route path={ApplicationNavigator.HOME_ROUTE} element={
                    <AuthenticatedRouteGuard authenticator={authenticator} authenticatedUserStore={authenticatedUserStore}>
                        <Home authenticatedHttpClient={authenticatedHttpClient} authenticatedUserStore={authenticatedUserStore}/>
                    </AuthenticatedRouteGuard>
                }/>
            </Routes>
        </div>
    );
}

export default App;
