import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from "./home/Home";
import Login from "./login/Login";
import {AuthenticatedRouteGuard} from "./shared/navigation/AuthenticatedRouteGuard";
import {GoogleAuthenticator} from "./shared/authentication/GoogleAuthenticator";
import {AccessTokenStore} from "./shared/authentication/AccessTokenStore";
import {LoginService} from "./login/LoginService";

function App() {
    const authenticator = new GoogleAuthenticator();
    const accessTokenStore = new AccessTokenStore();
    const loginService = new LoginService(authenticator, accessTokenStore);

    return (
        <div className="App">
            <Routes>
                <Route path="/login" element={<Login loginService={loginService} />} />
                <Route path="/home" element={
                    <AuthenticatedRouteGuard authenticator={authenticator} accessTokenStore={accessTokenStore}>
                        <Home />
                    </AuthenticatedRouteGuard>
                } />
            </Routes>
        </div>
    );
}

export default App;
