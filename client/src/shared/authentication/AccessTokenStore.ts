export class AccessTokenStore {

    public addToken(token: string): void {
        localStorage.setItem('proof-of-concept-access-token', token);
    }

    public getToken(): string | null {
        return localStorage.getItem('proof-of-concept-access-token');
    }

}