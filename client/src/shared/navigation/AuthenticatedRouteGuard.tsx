import {Navigate, useLocation} from "react-router-dom";
import React from "react";
import {LocalStorageAccessTokenStore} from "../authentication/LocalStorageAccessTokenStore";
import {Authenticator} from "../authentication/Authenticator";
import {ApplicationNavigator} from "./ApplicationNavigator";

type Props = {
    accessTokenStore: LocalStorageAccessTokenStore;
    authenticator: Authenticator;
    children: JSX.Element;
}

export const AuthenticatedRouteGuard = ({accessTokenStore, authenticator, children}: Props) => {
    const location = useLocation();
    const accessToken = accessTokenStore.get();

    if (accessToken && authenticator.isValidToken(accessToken)) return children

    return <Navigate to={ApplicationNavigator.LOGIN_ROUTE} state={{from: location}}/>;
};
