import {Context} from 'aws-lambda';

type Profile = {
  name: string;
  email: string;
};

export class ProfileController {

    async get(event: any, context: Context) {
        const profile: Profile = {
            name: "name",
            email: "email"
        }

        return {
            statusCode: 200,
            body: JSON.stringify(profile)
        }
    }

}