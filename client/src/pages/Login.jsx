import { useRef, useContext } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const username = useRef(null);
    const password = useRef(null);
    const navigate = useNavigate();

    const { setUser } = useContext(UserContext);

    function logIn() {
        axios
            .post(
                "http://localhost:3001/api/login",
                {
                    username: username.current.value,
                    password: password.current.value,
                },
                { withCredentials: true }
            )
            .then((res) => {
                setUser(res.data.user);
                navigate("/");
            });
    }

    return (
        <>
            <h1>Log in</h1>
            <input placeholder="username" ref={username} />
            <input placeholder="password" ref={password} />
            <button onClick={logIn}>Log In</button>
        </>
    );
}

export default Login;
