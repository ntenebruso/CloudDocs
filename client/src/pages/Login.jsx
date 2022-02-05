import React, { useState, useEffect } from "react";
import axios from "axios";

function Login({onSubmit, history}) {
    const [loginUsername, setLoginUsername] = useState();
    const [loginPassword, setLoginPassword] = useState();

    return (
        <>
            <h1>Log in</h1>
            <input placeholder="username" onChange={e => setLoginUsername(e.target.value)} />
            <input placeholder="password" onChange={e => setLoginPassword(e.target.value)} />
            <button onClick={() => {onSubmit(loginUsername, loginPassword)}}>Log In</button>
        </>
    )
}

export default Login;