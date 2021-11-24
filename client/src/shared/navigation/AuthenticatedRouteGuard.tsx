import {Navigate, useLocation} from "react-router-dom";
import React from "react";
import {Authenticator} from "../authentication/authenticator/Authenticator";
import {ApplicationNavigator} from "./ApplicationNavigator";
import {AuthenticatedUserStore} from "../authentication/AuthenticatedUserStore";

type Props = {
    authenticatedUserStore: AuthenticatedUserStore;
    authenticator: Authenticator;
    children: JSX.Element;
}

export const AuthenticatedRouteGuard = ({authenticatedUserStore, authenticator, children}: Props) => {
    const location = useLocation();
    const authenticatedUser = authenticatedUserStore.get();
    const accessToken = authenticatedUser?.accessToken;

    if (accessToken && authenticator.isValidToken(accessToken)) return children

    return <Navigate to={ApplicationNavigator.LOGIN_ROUTE} state={{from: location}}/>;
};
