import jwt from "jsonwebtoken";
import {GoogleAuthenticator} from "./GoogleAuthenticator";
import {GoogleUserProvider} from "./GoogleUserProvider";
import {instance, mock, when} from "ts-mockito";

jest.mock('gapi-script', () => ({
    gapi: jest.fn()
}));

describe('google authenticator should', () => {
    const googleUserProvider = mock(GoogleUserProvider);

    const googleAuthenticator = new GoogleAuthenticator(
        instance(googleUserProvider)
    );

    test('verify that a token is valid when still alive', () => {
        const aliveToken = jwt.sign({data: 'foobar'}, 'secret', {expiresIn: '1m'});

        expect(googleAuthenticator.isValidToken(aliveToken)).toBeTruthy();
    });

    test('verify that a token is invalid when expired', () => {
        const expiredToken = jwt.sign({data: 'foobar'}, 'secret', {expiresIn: '-1s'});

        expect(googleAuthenticator.isValidToken(expiredToken)).toBeFalsy();
    });

    test('get authenticated user from google', async () => {
        const googleUser: gapi.auth2.GoogleUser = {
            getAuthResponse(): gapi.auth2.AuthResponse {
                return {
                    id_token: "google-id-token"
                } as gapi.auth2.AuthResponse;
            }, getBasicProfile(): gapi.auth2.BasicProfile {
                return {
                    getName(): string {
                        return "Full Name"
                    },
                    getEmail(): string {
                        return "best.user@codurance.com"
                    },
                    getImageUrl(): string {
                        return 'https://google.com/profile/best-user-image.png'
                    }
                } as gapi.auth2.BasicProfile;
            }
        } as gapi.auth2.GoogleUser;
        when(googleUserProvider.getAuthenticatedInstance()).thenResolve(googleUser);

        expect(await googleAuthenticator.getAuthenticatedUser()).toEqual({
            name: 'Full Name',
            email: 'best.user@codurance.com',
            profileImageUrl: 'https://google.com/profile/best-user-image.png',
            accessToken: 'google-id-token'
        });
    });
});