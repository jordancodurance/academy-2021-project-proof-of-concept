import {act, render, waitFor} from "@testing-library/react";
import {renderHook} from "@testing-library/react-hooks";
import {BrowserRouter, useNavigate} from "react-router-dom";
import {ReactRouterApplicationNavigator} from "./ReactRouterApplicationNavigator";

describe('react router application navigator should', () => {
    const navigator = renderHook(() => useNavigate(), {wrapper: BrowserRouter});

    const reactRouterApplicationNavigator = new ReactRouterApplicationNavigator(navigator.result.current);

    beforeEach(async () => {
        render(<div/>);
    });

    test('navigate to login', async () => {
        act(() => {
            reactRouterApplicationNavigator.navigateToLogin();
        });

        return waitFor(() => {
            expect(window.location.pathname).toEqual('/login');
        });
    });

    test('navigate to home', async () => {
        act(() => {
            reactRouterApplicationNavigator.navigateToHome();
        });

        return waitFor(() => {
            expect(window.location.pathname).toEqual('/home');
        });
    });
})