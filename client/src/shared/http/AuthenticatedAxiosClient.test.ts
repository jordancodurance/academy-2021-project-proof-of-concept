import {AuthenticatedAxiosClient} from "./AuthenticatedAxiosClient";
import {ApplicationNavigator} from "../navigation/ApplicationNavigator";
import {act, waitFor} from "@testing-library/react";
import {setupServer} from "msw/node";
import {rest} from "msw";
import {instance, mock, verify, when} from "ts-mockito";
import {AuthenticatedUserStore} from "../authentication/AuthenticatedUserStore";
import {AuthenticatedUser} from "../authentication/AuthenticatedUser";

describe('authenticated axios client should', () => {
    const server = setupServer();

    const applicationNavigator = mock<ApplicationNavigator>();
    const authenticatedUserStore = mock<AuthenticatedUserStore>();

    const authenticatedAxiosClient = new AuthenticatedAxiosClient(
        instance(applicationNavigator),
        instance(authenticatedUserStore),
    );

    beforeAll(() => server.listen());

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
            verify(applicationNavigator.navigateToLogin()).called();
        });
    });

    test('perform get with stored access token in authorisation header', async () => {
        const authenticatedUser: AuthenticatedUser = {accessToken: "access-token"} as AuthenticatedUser;
        let authorisationHeader: string | null;
        when(authenticatedUserStore.get()).thenReturn(authenticatedUser);
        server.use(
            rest.get('http://localhost:3000/path', (request, response) => {
                authorisationHeader = request.headers.get('Authorization');
                return response();
            })
        );

        await authenticatedAxiosClient.get('http://localhost:3000/path');

        return waitFor(() => {
            expect(authorisationHeader).toBe('Bearer access-token');
        });
    });
});