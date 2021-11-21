import {RequestAuthoriser} from "./RequestAuthoriser";
import {OAuth2Client} from "google-auth-library";

export class GoogleAuthoriser implements RequestAuthoriser {

    async authorise(token: string): Promise<any> {
        const clientId = "";
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