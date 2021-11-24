import {LocalStorageAuthenticatedUserStore} from "./LocalStorageAuthenticatedUserStore";
import {AuthenticatedUser} from "./AuthenticatedUser";

describe('local storage access token store should', () => {
    const localStorageAccessTokenStore = new LocalStorageAuthenticatedUserStore();

    beforeEach(() => {
        window.localStorage.clear();
    });

    test('persist authenticated user in local storage', () => {
        const authenticatedUser: AuthenticatedUser = {
            name: "Best User",
            email: "best.user@codurance.com",
            profileImageUrl: 'https://hosting.site/profile/best-user-image.png',
            accessToken: "access-token"
        };
        localStorageAccessTokenStore.set(authenticatedUser);

        expect(localStorageAccessTokenStore.get()).toEqual({
            name: "Best User",
            email: "best.user@codurance.com",
            profileImageUrl: 'https://hosting.site/profile/best-user-image.png',
            accessToken: "access-token"
        });
    });

    test('return nothing when no user persisted in local storage', () => {
        expect(localStorageAccessTokenStore.get()).toBeNull();
    });
})