import {AuthenticatedAxiosClient} from "./AuthenticatedAxiosClient";
import {ApplicationNavigator} from "../navigation/ApplicationNavigator";
import {AccessTokenStore} from "../authentication/AccessTokenStore";
import {act, waitFor} from "@testing-library/react";
import {setupServer} from "msw/node";
import {rest} from "msw";

const navigator = jest.fn();

describe('authenticated axios client should', () => {
    const server = setupServer();

    let applicationNavigator: ApplicationNavigator;
    let accessTokenStore: AccessTokenStore;

    let authenticatedAxiosClient: AuthenticatedAxiosClient;

    beforeAll(() => server.listen());

    beforeEach(() => {
        applicationNavigator = new ApplicationNavigator(navigator);
        accessTokenStore = new AccessTokenStore();
        authenticatedAxiosClient = new AuthenticatedAxiosClient(applicationNavigator, accessTokenStore);
    });

    afterEach(() => server.resetHandlers());

    afterAll(() => server.close());

    test.each([401, 403])
    ('navigate to login for intercepted response with status code %d', async (statusCode) => {
        authenticatedAxiosClient.enableResponseInterception();
        server.use(
            rest.get('http://localhost:3000/path', (request, response, context) =>
                response(
                    context.status(statusCode)
                ))
        );

        act(() => {
            authenticatedAxiosClient.get('http://localhost:3000/path');
        });

        return waitFor(() => {
            expect(navigator).toBeCalledWith('/login');
        });
    });

    test('perform get with stored access token in authorisation header', async () => {
        let authorisationHeader: string | null;
        server.use(
            rest.get('http://localhost:3000/path', (request, response) => {
                authorisationHeader = request.headers.get('Authorization');
                return response();
            })
        );
        window.localStorage.setItem('proof-of-concept-access-token', 'token');

        await authenticatedAxiosClient.get('http://localhost:3000/path');

        return waitFor(() => {
            expect(authorisationHeader).toBe('Bearer token');
        });
    });
});