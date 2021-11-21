import {AuthenticatedHttpClient} from "./AuthenticatedHttpClient";
import axios from "axios";
import {AccessTokenStore} from "../authentication/AccessTokenStore";
import {ApplicationNavigator} from "../navigation/ApplicationNavigator";
import {HttpResponse} from "./HttpResponse";

export class AuthenticatedAxiosClient implements AuthenticatedHttpClient {
    private readonly axiosClient = axios.create();
    private readonly applicationNavigator: ApplicationNavigator;
    private readonly accessTokenStore: AccessTokenStore;

    constructor(applicationNavigator: ApplicationNavigator, accessTokenStore: AccessTokenStore) {
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
                } else {
                    throw error;
                }
            }
        );
    }

    get(url: string): Promise<HttpResponse> {
        return this.axiosClient.get(url, this.addAuthorisationHeader());
    }

    private addAuthorisationHeader() {
        const accessToken = this.accessTokenStore.getToken();
        return {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        };
    }
}