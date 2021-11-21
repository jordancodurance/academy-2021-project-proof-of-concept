import {Context, Handler} from 'aws-lambda';
import {ProfileController} from "./ProfileController";
import {GoogleAuthoriser} from "./GoogleAuthoriser";

const profileController = new ProfileController();
const requestAuthoriser = new GoogleAuthoriser();

export const getProfile: Handler = (event: any, context: Context) => {
    return profileController.get(event, context);
};

export const authorise: Handler = async (event: any, context: Context) => {
    const token = event.authorizationToken.split('Bearer ')[1];

    try {
        await requestAuthoriser.authorise(token);
        return context.succeed(generatePolicy('user', 'Allow', '*'));
    } catch (error) {
        console.log(error);
        return context.succeed(generatePolicy('user', 'Deny', event.methodArn));
    }
};

const generatePolicy = (principalId, effect, resource) => ({
    principalId,
    policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource
            }
        ]
    }
});