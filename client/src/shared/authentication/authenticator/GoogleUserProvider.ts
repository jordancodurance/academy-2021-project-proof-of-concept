import {gapi} from "gapi-script";

export class GoogleUserProvider {

    public async getAuthenticatedInstance(): Promise<gapi.auth2.GoogleUser> {
        await this.loadGoogleAuthenticationLibrary();

        const auth = gapi.auth2.getAuthInstance();
        return auth.signIn();
    }

    private async loadGoogleAuthenticationLibrary() {
        const clientId = "771128432913-tsa08p8ihoibd4vbbsd6c059caelp1ni.apps.googleusercontent.com";
        await new Promise((resolve) => gapi.load('client:auth2', resolve));
        await new Promise((resolve) => gapi.auth2.init({client_id: clientId}).then(resolve));
    }

}