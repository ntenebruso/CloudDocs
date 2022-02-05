import React, { useEffect, createContext, useState } from "react";
import axios from "axios";
import TextEditor from './pages/TextEditor.jsx';
import Login from './pages/Login';
import Dashboard from "./pages/Dashboard";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from 'react-router-dom';
import { UserContext } from "./UserContext";
import 'antd/dist/antd.css';
import history from "./history";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:3001/api/user", { withCredentials: true }).then(res => {
            if (res.data.loggedIn) {
                setUser(res.data.user);
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
            console.log(res.data);
            setLoading(false);
        })
    }, [])

    function logIn(username, password) {
        axios.post("http://localhost:3001/api/login", {
            username,
            password
        }, { withCredentials: true }).then(res => {
            if (res.data.success == true) {
                setUser(res.data.user);
                setLoggedIn(true);
                window.location.href = "/";
            }
        })
    }

    function ProtectedRoute({children, ...props}) {
        if (!loading) {
            return loggedIn ? <Route {...props}>{children}</Route> : <Redirect to="/login" />;
        } else {
            return <div>Loading page...</div>
        }
    }

    return (
        <UserContext.Provider value={user}>
            <Router history={history}>
                <Switch>
                    <ProtectedRoute exact path="/">
                        <Dashboard />
                    </ProtectedRoute>
                    <Route path="/login" render={() => (
                        loggedIn ? <Redirect to="/" /> : <Login onSubmit={logIn} />
                    )} />
                    <Route path="/document/:id">
                        <TextEditor />
                    </Route>
                </Switch>
            </Router>
        </UserContext.Provider>
    )
}

export default App;
