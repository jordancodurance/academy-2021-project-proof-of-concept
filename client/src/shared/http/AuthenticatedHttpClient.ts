import {HttpResponse} from "./HttpResponse";

export interface AuthenticatedHttpClient {

    enableResponseInterception(): void

    get(path: string): Promise<HttpResponse>

}