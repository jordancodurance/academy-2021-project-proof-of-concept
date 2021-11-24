import {Authenticator} from "./Authenticator";
import jwtDecode, {JwtPayload} from "jwt-decode";
import {AuthenticatedUser} from "../persistence/AuthenticatedUser";
import {GoogleUserProvider} from "./GoogleUserProvider";

export class GoogleAuthenticator implements Authenticator {

    private googleUserProvider: GoogleUserProvider;

    constructor(googleUserProvider: GoogleUserProvider) {
        this.googleUserProvider = googleUserProvider
    }

    isValidToken(token: string): boolean {
        const decodedToken = jwtDecode<JwtPayload>(token);
        const tokenExpiry = decodedToken.exp;
        if (tokenExpiry === undefined) return false;

        return (tokenExpiry * 1000) > Date.now();
    }

    async getAuthenticatedUser(): Promise<AuthenticatedUser> {
        const googleUser = await this.googleUserProvider.getAuthenticatedInstance();
        const authResponse = googleUser.getAuthResponse();
        const profile = googleUser.getBasicProfile();

        return {
            name: profile.getName(),
            email: profile.getEmail(),
            profileImageUrl: profile.getImageUrl(),
            accessToken: authResponse.id_token
        };
    }

}