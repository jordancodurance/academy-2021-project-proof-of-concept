import React, {useEffect, useState} from 'react';
import {AuthenticatedHttpClient} from "../shared/http/AuthenticatedHttpClient";
import {AuthenticatedUserStore} from "../shared/authentication/AuthenticatedUserStore";

type Profile = {
    name: string;
    email: string;
};

type Props = {
    authenticatedHttpClient: AuthenticatedHttpClient,
    authenticatedUserStore: AuthenticatedUserStore
};

const Home = ({authenticatedHttpClient, authenticatedUserStore}: Props) => {
    const authenticatedUser = authenticatedUserStore.get();
    const [profile, setProfile] = useState<Profile | undefined>(undefined);

    useEffect(() => {
        const getProfile = async () => {
            const response = await authenticatedHttpClient.get('http://localhost:3004/dev/profile');
            const profile = response.data as Profile;
            setProfile(profile);
        }

        getProfile();
    }, [authenticatedHttpClient, setProfile]);

    return (
        <>
            <p>Logged In: <img src={authenticatedUser?.profileImageUrl}/> {authenticatedUser?.name}</p>

            {profile &&
            <>
                <p>Backend Profile Name: {profile.name}</p>
                <p>Backend Profile Name: {profile.email}</p>
            </>
            }

        </>
    );
};

export default Home;
