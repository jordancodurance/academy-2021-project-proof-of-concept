import React from 'react';
import {Routes, Route, useNavigate} from "react-router-dom";
import Home from "./home/Home";
import Login from "./login/Login";
import {AuthenticatedRouteGuard} from "./shared/navigation/AuthenticatedRouteGuard";
import {GoogleAuthenticator} from "./shared/authentication/GoogleAuthenticator";
import {AccessTokenStore} from "./shared/authentication/AccessTokenStore";
import {LoginService} from "./login/LoginService";
import {AuthenticatedAxiosClient} from "./shared/http/AuthenticatedAxiosClient";
import {ApplicationNavigator} from "./shared/navigation/ApplicationNavigator";

function App() {
    const navigator = useNavigate();
    const authenticator = new GoogleAuthenticator();
    const accessTokenStore = new AccessTokenStore();
    const applicationNavigator = new ApplicationNavigator(navigator);
    const loginService = new LoginService(authenticator, accessTokenStore, applicationNavigator);
    const authenticatedHttpClient = new AuthenticatedAxiosClient(applicationNavigator, accessTokenStore);

    authenticatedHttpClient.enableResponseInterception();

    return (
        <div className="App">
            <Routes>
                <Route path="/login" element={<Login loginService={loginService} />} />
                <Route path="/home" element={
                    <AuthenticatedRouteGuard authenticator={authenticator} accessTokenStore={accessTokenStore}>
                        <Home authenticatedHttpClient={authenticatedHttpClient} />
                    </AuthenticatedRouteGuard>
                } />
            </Routes>
        </div>
    );
}

export default App;
