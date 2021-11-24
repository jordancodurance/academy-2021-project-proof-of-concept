import { gapi } from 'gapi-script';
import {Authenticator} from "./Authenticator";
import jwtDecode, {JwtPayload} from "jwt-decode";
import {AuthenticatedUser} from "./AuthenticatedUser";

export class GoogleAuthenticator implements Authenticator {

    isValidToken(token: string): boolean {
        const decodedToken = jwtDecode<JwtPayload>(token);
        const tokenExpiry = decodedToken.exp;
        if (tokenExpiry === undefined) return false;

        return (tokenExpiry * 1000) > Date.now();
    }

    async getAuthenticatedUser(): Promise<AuthenticatedUser> {
        await this.loadGoogleAuthLibrary();
        const auth = gapi.auth2.getAuthInstance();
        const signInResponse = await auth.signIn();
        const authResponse = signInResponse.getAuthResponse();
        const profile = signInResponse.getBasicProfile();

        return {
            name: profile.getName(),
            email: profile.getEmail(),
            profileImageUrl: profile.getImageUrl(),
            accessToken: authResponse.id_token
        };
    }

    private async loadGoogleAuthLibrary() {
        const clientId = "771128432913-tsa08p8ihoibd4vbbsd6c059caelp1ni.apps.googleusercontent.com";
        await new Promise((resolve) => gapi.load('client:auth2', resolve));
        await new Promise((resolve) => gapi.auth2.init({client_id: clientId}).then(resolve));
    }

}