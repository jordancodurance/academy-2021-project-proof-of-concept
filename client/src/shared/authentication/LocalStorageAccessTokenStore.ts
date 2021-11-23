import {AccessTokenStore} from "./AccessTokenStore";

export class LocalStorageAccessTokenStore extends AccessTokenStore {

    public set(token: string): void {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    }

    public get(): string | null {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY) ?? '';
    }

}