import React, {useState} from 'react';
import {LoginService} from "./LoginService";

const Login = ({loginService}: { loginService: LoginService }) => {
    const [hasLoginError, setHasLoginError] = useState(false);

    async function attemptLogin() {
        setHasLoginError(false);

        await loginService
            .attemptLogin()
            .catch(error => {
                console.log(error);
                setHasLoginError(true);
            });
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