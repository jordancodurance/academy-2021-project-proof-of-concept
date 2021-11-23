import {RequestAuthoriser} from "./RequestAuthoriser";
import {OAuth2Client} from "google-auth-library";

export class GoogleAuthoriser implements RequestAuthoriser {

    async authorise(token: string): Promise<any> {
        const clientId = "771128432913-tsa08p8ihoibd4vbbsd6c059caelp1ni.apps.googleusercontent.com";
        const client = new OAuth2Client(clientId);
        const tokenVerification = await client.verifyIdToken({
            idToken: token,
            audience: clientId
        });
        const payload = tokenVerification.getPayload();
        if (payload?.hd !== "codurance.com") throw new Error("Invalid domain");

        return Promise.resolve();
    }

}