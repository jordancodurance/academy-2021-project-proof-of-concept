import {render, screen} from "@testing-library/react";
import Login from "./Login";
import {LoginPolicyService} from "./LoginPolicyService";
import {BrowserRouter} from "react-router-dom";
import React from "react";
import {instance, mock, when} from "ts-mockito";

describe('on login rendered it should', () => {

    const loginPolicyService = mock(LoginPolicyService);

    beforeEach(async () => {
        render(<Login loginPolicyService={instance(loginPolicyService)}/>, {wrapper: BrowserRouter});
    });

    test('show no login error from successful login attempt on login button clicked', async () => {
        when(loginPolicyService.attemptLogin()).thenResolve();

        clickLoginButton();

        expect(await screen.queryByText('Unable to Login')).not.toBeInTheDocument();
    });

    test('show login error from unsuccessful login attempt on login button clicked', async () => {
        when(loginPolicyService.attemptLogin()).thenReject();

        clickLoginButton();

        expect(await screen.findByText('Unable to Login')).toBeInTheDocument();
    });

    const clickLoginButton = () => {
        screen.getByText('Login', {selector: 'button'}).click();
    };
});