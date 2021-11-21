import {render, screen, waitFor} from "@testing-library/react";
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthenticatedRouteGuard} from "./AuthenticatedRouteGuard";
import {AccessTokenStore} from "../authentication/AccessTokenStore";
import {Authenticator} from "../authentication/Authenticator";

describe('authenticated route guard should', () => {
    let isValidAccessToken: boolean;

    let accessTokenStore: AccessTokenStore;
    let authenticator:Authenticator;

    beforeEach(() => {
        window.localStorage.clear();
        authenticator = buildAuthenticatorStub();
        accessTokenStore = new AccessTokenStore();
    });

    test('load protected route with valid access token', async () => {
        window.localStorage.setItem('proof-of-concept-access-token', 'token');
        isValidAccessToken = true;

        await attemptProtectedRouteRender();

        expect(await screen.findByText('Protected Route')).toBeInTheDocument();
    });

    test('redirect to login for invalid access token', async () => {
        window.localStorage.setItem('proof-of-concept-access-token', 'token');
        isValidAccessToken = false;

        await attemptProtectedRouteRender();

        return waitFor(() => {
            expect(window.location.pathname).toEqual('/login');
        });
    });

    test('redirect to login for missing access token', async () => {
        await attemptProtectedRouteRender();

        return waitFor(() => {
            expect(window.location.pathname).toEqual('/login');
        });
    });

    const attemptProtectedRouteRender = async () =>
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <AuthenticatedRouteGuard accessTokenStore={accessTokenStore} authenticator={authenticator}>
                            <div>Protected Route</div>
                        </AuthenticatedRouteGuard>
                    }/>
                    <Route path="/login" element={<p>Login</p>}/>
                </Routes>
            </BrowserRouter>
        );

    const buildAuthenticatorStub = () => new class AuthenticatorStub implements Authenticator {
        getAccessToken(): Promise<string> {
            return Promise.resolve("");
        }

        isValidToken(token: string): boolean {
            return isValidAccessToken;
        }
    };
});