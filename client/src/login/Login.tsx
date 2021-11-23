import React, {useState} from 'react';
import {LoginPolicyService} from "./LoginPolicyService";

const Login = ({loginPolicyService}: { loginPolicyService: LoginPolicyService }) => {
    const [hasLoginError, setHasLoginError] = useState(false);

    async function attemptLogin() {
        setHasLoginError(false);

        await loginPolicyService
            .attemptLogin()
            .catch(() => setHasLoginError(true));
    }

    return (
        <>
            <p>Login</p>

            {hasLoginError &&
            <p>Unable to Login</p>
            }

            <button onClick={attemptLogin}>Login</button>
        </>
    );
};

export default Login;