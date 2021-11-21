import React, {useState} from 'react';
import {LoginService} from "./LoginService";
import {useNavigate} from "react-router-dom";

const Login = ({loginService}: { loginService: LoginService }) => {
    const [hasLoginError, setHasLoginError] = useState(false);
    const navigator = useNavigate();

    async function attemptLogin() {
        setHasLoginError(false);

        await loginService
            .attemptLogin()
            .then(() => navigator('/home'))
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