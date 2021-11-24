import {AuthenticatedHttpClient} from "./AuthenticatedHttpClient";
import axios, {AxiosRequestConfig} from "axios";
import {ApplicationNavigator} from "../navigation/ApplicationNavigator";
import {HttpResponse} from "./HttpResponse";
import {AuthenticatedUserStore} from "../authentication/AuthenticatedUserStore";

export class AuthenticatedAxiosClient implements AuthenticatedHttpClient {
    private readonly axiosClient = axios.create();
    private readonly applicationNavigator: ApplicationNavigator;
    private readonly authenticatedUserStore: AuthenticatedUserStore;

    constructor(applicationNavigator: ApplicationNavigator, authenticatedUserStore: AuthenticatedUserStore) {
        this.applicationNavigator = applicationNavigator;
        this.authenticatedUserStore = authenticatedUserStore;
    }

    enableResponseInterception(): void {
        this.axiosClient.interceptors.response.use(
            response => response,
            error => {
                const responseStatus = error.response.status;
                if (responseStatus === 401 || responseStatus === 403) {
                    this.applicationNavigator.navigateToLogin();
                    return new Promise(() => {
                    });
                }

                return Promise.reject(error);
            }
        );
    }

    get(url: string): Promise<HttpResponse> {
        return this.axiosClient.get(url, this.addAuthorisationHeader());
    }

    private addAuthorisationHeader(): AxiosRequestConfig {
        const authenticatedUser = this.authenticatedUserStore.get();
        const accessToken = authenticatedUser?.accessToken;

        return {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        };
    }
}