import {LocalStorageAccessTokenStore} from "./LocalStorageAccessTokenStore";

describe('local storage access token store should', () => {
    const localStorageAccessTokenStore = new LocalStorageAccessTokenStore();

    test('persist token in local storage', () => {
        window.localStorage.clear();

        localStorageAccessTokenStore.set('token');

        expect(localStorageAccessTokenStore.get()).toEqual('token');
    })
})