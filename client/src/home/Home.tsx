import React, {useEffect, useState} from 'react';
import {AuthenticatedHttpClient} from "../shared/http/AuthenticatedHttpClient";

type Profile = {
  name: string;
  email: string;
};

const Home = ({authenticatedHttpClient}: { authenticatedHttpClient: AuthenticatedHttpClient }) => {
  const [profile, setProfile] = useState<Profile | undefined>(undefined);

    useEffect(() => {
        const abortController = new AbortController();
        const getProfile = async () => {
            const response = await authenticatedHttpClient.get('http://localhost:3004/dev/profile');
            const profile = response.data as Profile;
            setProfile(profile);
        }

        getProfile();

        return () => abortController.abort();
    }, [authenticatedHttpClient, setProfile]);

  return (
      <>
        <p>Logged In</p>
          {profile &&
          <>
              <p>Name: {profile.name}</p>
              <p>Email: {profile.email}</p>
          </>
          }

      </>
  );
};

export default Home;
