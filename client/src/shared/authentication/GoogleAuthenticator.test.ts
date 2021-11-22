import jwt from "jsonwebtoken";
import {GoogleAuthenticator} from "./GoogleAuthenticator";

jest.mock('gapi-script', () => ({
    gapi: jest.fn()
}))

describe('google authenticator should', () => {
    let googleAuthenticator: GoogleAuthenticator;

    beforeEach(() => {
        googleAuthenticator = new GoogleAuthenticator();
    });

    test('verify that a token is valid when still alive', () => {
        const aliveToken = jwt.sign({data: 'foobar'}, 'secret', { expiresIn: '1m' });

        expect(googleAuthenticator.isValidToken(aliveToken)).toBeTruthy();
    });

    test('verify that a token is invalid when expired', () => {
        const expiredToken = jwt.sign({data: 'foobar'}, 'secret', { expiresIn: '-1s' });

        expect(googleAuthenticator.isValidToken(expiredToken)).toBeFalsy();
    });
})