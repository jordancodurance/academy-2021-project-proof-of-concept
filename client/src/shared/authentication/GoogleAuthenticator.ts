import { gapi } from 'gapi-script';
import {Authenticator} from "./Authenticator";

export class GoogleAuthenticator implements Authenticator {

    isValidToken(token: string): boolean {
        return true;
    }

    async getAccessToken(): Promise<string> {
        await this.loadGoogleAuthLibrary();
        const auth = gapi.auth2.getAuthInstance();
        const signInResponse = await auth.signIn();

        return signInResponse.getAuthResponse().id_token;
    }

    private async loadGoogleAuthLibrary() {
        const clientId = process.env.GOOGLE_AUTH_CLIENT_ID;
        await new Promise((resolve) => gapi.load('client:auth2', resolve));
        await new Promise((resolve) => gapi.auth2.init({client_id: clientId}).then(resolve));
    }

}