import {AuthenticatedHttpClient} from "./AuthenticatedHttpClient";
import axios from "axios";
import {LocalStorageAccessTokenStore} from "../authentication/LocalStorageAccessTokenStore";
import {ApplicationNavigator} from "../navigation/ApplicationNavigator";
import {HttpResponse} from "./HttpResponse";

export class AuthenticatedAxiosClient implements AuthenticatedHttpClient {
    private readonly axiosClient = axios.create();
    private readonly applicationNavigator: ApplicationNavigator;
    private readonly accessTokenStore: LocalStorageAccessTokenStore;

    constructor(applicationNavigator: ApplicationNavigator, accessTokenStore: LocalStorageAccessTokenStore) {
        this.applicationNavigator = applicationNavigator;
        this.accessTokenStore = accessTokenStore;
    }

    enableResponseInterception(): void {
        this.axiosClient.interceptors.response.use(
            response => response,
            error => {
                const responseStatus = error.response.status;
                if (responseStatus === 401 || responseStatus === 403) {
                    this.applicationNavigator.navigateToLogin();
                    return new Promise(() => {});
                }

                return Promise.reject(error);
            }
        );
    }

    get(url: string): Promise<HttpResponse> {
        return this.axiosClient.get(url, this.addAuthorisationHeader());
    }

    private addAuthorisationHeader() {
        const accessToken = this.accessTokenStore.get();
        return {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        };
    }
}