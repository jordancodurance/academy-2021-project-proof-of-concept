import {render, screen, waitFor} from "@testing-library/react";
import Login from "./Login";
import {LoginService} from "./LoginService";
import {AccessTokenStore} from "../shared/authentication/AccessTokenStore";
import {BrowserRouter, useNavigate} from "react-router-dom";
import React from "react";
import {Authenticator} from "../shared/authentication/Authenticator";
import {ApplicationNavigator} from "../shared/navigation/ApplicationNavigator";
import {renderHook} from "@testing-library/react-hooks";

describe('on login rendered it should', () => {
    const navigator = renderHook(() => useNavigate(), {wrapper: BrowserRouter})

    let accessTokenResult: Promise<string>;

    let authenticator: Authenticator;
    let accessTokenStore: AccessTokenStore;
    let applicationNavigator: ApplicationNavigator;

    beforeEach(() => {
        window.localStorage.clear();
        authenticator = buildAuthenticatorStub();
        accessTokenStore = new AccessTokenStore();
        applicationNavigator = new ApplicationNavigator(navigator.result.current);
    });

    test('persist access token on successful login', async () => {
        accessTokenResult = Promise.resolve("access-token");
        const loginService = new LoginService(authenticator, accessTokenStore, applicationNavigator);
        render(<Login loginService={loginService}/>, {wrapper: BrowserRouter});

        clickLoginButton();

        return waitFor(() => {
            expect(window.localStorage.getItem('proof-of-concept-access-token')).toEqual('access-token');
        });
    });

    test('navigate to home on successful login', async () => {
        accessTokenResult = Promise.resolve("access-token");
        const loginService = new LoginService(authenticator, accessTokenStore, applicationNavigator);
        render(<Login loginService={loginService}/>, {wrapper: BrowserRouter});

        clickLoginButton();

        return waitFor(() => {
            expect(window.location.pathname).toEqual('/home');
        });
    });

    test('show login error on unsuccessful login', async () => {
        accessTokenResult = Promise.reject("Failed to get token");
        const loginService = new LoginService(authenticator, accessTokenStore, applicationNavigator);
        render(<Login loginService={loginService}/>, {wrapper: BrowserRouter});

        clickLoginButton();

        expect(await screen.findByText('Unable to Login')).toBeInTheDocument();
    });

    const buildAuthenticatorStub = () => new class AuthenticatorStub implements Authenticator {
        getAccessToken(): Promise<string> {
            return accessTokenResult;
        }

        isValidToken(token: string): boolean {
            return false;
        }
    };

    const clickLoginButton = () => {
        screen.getByText('Login', {selector: 'button'}).click();
    };
});