import {render, screen, waitFor} from "@testing-library/react";
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthenticatedRouteGuard} from "./AuthenticatedRouteGuard";
import {Authenticator} from "../authentication/Authenticator";
import {instance, mock, when} from "ts-mockito";
import {AuthenticatedUserStore} from "../authentication/AuthenticatedUserStore";
import {AuthenticatedUser} from "../authentication/AuthenticatedUser";

describe('authenticated route guard should', () => {

    const authenticatedUserStore = mock<AuthenticatedUserStore>();
    const authenticator = mock<Authenticator>();

    test('load protected route with valid access token', async () => {
        const authenticatedUser: AuthenticatedUser = {accessToken: "access-token"} as AuthenticatedUser;
        when(authenticatedUserStore.get()).thenReturn(authenticatedUser);
        when(authenticator.isValidToken("access-token")).thenReturn(true);

        await attemptProtectedRouteRender();

        expect(await screen.findByText('Protected Route')).toBeInTheDocument();
    });


    test('redirect to login for invalid access token', async () => {
        const authenticatedUser: AuthenticatedUser = {accessToken: "invalid-access-token"} as AuthenticatedUser;
        when(authenticatedUserStore.get()).thenReturn(authenticatedUser);
        when(authenticator.isValidToken("invalid-access-token")).thenReturn(false);

        await attemptProtectedRouteRender();

        return waitFor(() => {
            expect(window.location.pathname).toEqual('/login');
        });
    });

    test('redirect to login when user has not logged in yet', async () => {
        when(authenticatedUserStore.get()).thenReturn(null);

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
                        <AuthenticatedRouteGuard authenticatedUserStore={instance(authenticatedUserStore)}
                                                 authenticator={instance(authenticator)}>
                            <div>Protected Route</div>
                        </AuthenticatedRouteGuard>
                    }/>
                    <Route path="/login" element={<p>Login</p>}/>
                </Routes>
            </BrowserRouter>
        );
});