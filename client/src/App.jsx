import React, { useEffect, useState } from "react";
import axios from "axios";
import TextEditor from "./pages/TextEditor.jsx";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import "antd/dist/reset.css";

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("http://localhost:3001/api/user", { withCredentials: true })
            .then((res) => {
                setUser(res.data.user);
                setLoading(false);
            });
    }, []);

    function ProtectedRoute({ children, ...props }) {
        if (!loading) {
            return user ? children : <Navigate to="/login" />;
        } else {
            return <>Loading page...</>;
        }
    }

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    ></Route>
                    <Route
                        path="/login"
                        element={user ? <Navigate to="/" /> : <Login />}
                    />
                    <Route
                        path="/document/:id"
                        element={<TextEditor />}
                    ></Route>
                </Routes>
            </BrowserRouter>
        </UserContext.Provider>
    );
}

export default App;
