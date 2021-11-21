import {Navigate, useLocation} from "react-router-dom";
import React from "react";
import {AccessTokenStore} from "../authentication/AccessTokenStore";
import {Authenticator} from "../authentication/Authenticator";

type Props = {
    accessTokenStore: AccessTokenStore;
    authenticator: Authenticator;
    children: JSX.Element;
}

export const AuthenticatedRouteGuard = ({accessTokenStore, authenticator, children}: Props) => {
    const location = useLocation();
    const accessToken = accessTokenStore.getToken();

    if (accessToken && authenticator.isValidToken(accessToken)) return children

    return <Navigate to="/login" state={{from: location}}/>;
};
