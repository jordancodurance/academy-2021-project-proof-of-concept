import { gapi } from 'gapi-script';
import {Authenticator} from "./Authenticator";
import jwtDecode, {JwtPayload} from "jwt-decode";

export class GoogleAuthenticator implements Authenticator {

    isValidToken(token: string): boolean {
        const decodedToken = jwtDecode<JwtPayload>(token);
        const tokenExpiry = decodedToken.exp;
        if (tokenExpiry === undefined) return false;

        return (tokenExpiry * 1000) > Date.now();
    }

    async getAccessToken(): Promise<string> {
        await this.loadGoogleAuthLibrary();
        const auth = gapi.auth2.getAuthInstance();
        const signInResponse = await auth.signIn();

        return signInResponse.getAuthResponse().id_token;
    }

    private async loadGoogleAuthLibrary() {
        const clientId = "771128432913-tsa08p8ihoibd4vbbsd6c059caelp1ni.apps.googleusercontent.com";
        await new Promise((resolve) => gapi.load('client:auth2', resolve));
        await new Promise((resolve) => gapi.auth2.init({client_id: clientId}).then(resolve));
    }

}