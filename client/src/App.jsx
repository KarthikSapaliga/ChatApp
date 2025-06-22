import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";

import { useAppStore } from "./store/store";
import { apiClient } from "./lib/axios";
import { GET_USER_INFO_ROUTE } from "./lib/routes";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Chat from "./pages/chat/Index";
import Profile from "./pages/profile/Profile";
import toast from "./lib/toast";

const PrivateRoute = ({ children }) => {
    const { userInfo } = useAppStore();
    const isAuthenticated = !!userInfo;
    return isAuthenticated ? children : <Navigate to="/auth/login" />;
};

const AuthRoute = ({ children }) => {
    const { userInfo } = useAppStore();
    const isAuthenticated = !!userInfo;
    return isAuthenticated ? <Navigate to="/chat" /> : children;
};

function App() {
    const { userInfo, setUserInfo } = useAppStore();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getUserData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(GET_USER_INFO_ROUTE, {
                    withCredentials: true,
                });
                console.log(response);
                if (response.status === 200) {
                    setUserInfo(response.data);
                } else {
                    setUserInfo(undefined);
                }
            } catch (error) {
                setUserInfo(undefined);

                const token = Cookies.get("QuickChatAccessToken");
                if (!token) return;

                toast(
                    "error",
                    error?.response?.data?.error || "Failed to get user info"
                );
            } finally {
                setLoading(false);
            }
        };

        if (!userInfo) {
            getUserData();
        } else {
            setLoading(false);
        }
    }, [userInfo]);

    if (loading) {
        return (
            <div className="w-full h-screen bg-gray1 dark:bg-dark3 flex justify-center items-center text-2xl">
                Loading...
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<Navigate to="/auth/login" />} />
                <Route
                    path="/auth/login"
                    element={
                        <AuthRoute>
                            <Login />
                        </AuthRoute>
                    }
                />
                <Route
                    path="/auth/signup"
                    element={
                        <AuthRoute>
                            <Signup />
                        </AuthRoute>
                    }
                />
                <Route
                    path="/chat"
                    element={
                        <PrivateRoute>
                            <Chat />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
