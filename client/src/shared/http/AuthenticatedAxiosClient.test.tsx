import {AuthenticatedAxiosClient} from "./AuthenticatedAxiosClient";
import {ApplicationNavigator} from "../navigation/ApplicationNavigator";
import {LocalStorageAccessTokenStore} from "../authentication/LocalStorageAccessTokenStore";
import {act, waitFor} from "@testing-library/react";
import {setupServer} from "msw/node";
import {rest} from "msw";
import {ReactRouterApplicationNavigator} from "../navigation/ReactRouterApplicationNavigator";

const navigator = jest.fn();

describe('authenticated axios client should', () => {
    const server = setupServer();

    let applicationNavigator: ApplicationNavigator;
    let accessTokenStore: LocalStorageAccessTokenStore;

    let authenticatedAxiosClient: AuthenticatedAxiosClient;

    beforeAll(() => server.listen());

    beforeEach(() => {
        applicationNavigator = new ReactRouterApplicationNavigator(navigator);
        accessTokenStore = new LocalStorageAccessTokenStore();
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