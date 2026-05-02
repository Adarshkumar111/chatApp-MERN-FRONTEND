import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = BACKEND_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    // check if user is authenticated and if so, set the user data and connect the socket

    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check")

            if (data.success) {
                setAuthUser(data.user)
                connectSocket(data.user);
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    // login function to handle user authentication and socket connection

    const login = async (state, Credential) => {
        try {

            const { data } = await axios.post(`/api/auth/${state}`, Credential)

            if (data.success) {

                setAuthUser(data.userData);

                axios.defaults.headers.common["token"] = data.token;

                setToken(data.token);

                localStorage.setItem("token", data.token);

                connectSocket(data.userData);

                toast.success(data.message);

            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // logout function to handle user logout and socket disconnection

    const logout = async () => {

        localStorage.removeItem("token");

        setAuthUser(null);

        setToken(null);

        setOnlineUsers([]);

        axios.defaults.headers.common["token"] = null;

        socket?.disconnect(); // safe disconnect

        setSocket(null);

        toast.success("Logout Successfully");
    }

    // update profile function to handle user profile update

    const updateProfile = async (body) => {
        try {

            const { data } = await axios.put("/api/auth/update-profile", body)

            if (data.success) {

                setAuthUser(data.user);

                toast.success("profile update successfully");

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // connect socket function to handle socket connection and online users updates

    const connectSocket = (userData) => {

        if (!userData) return;

        if (socket?.connected) return;

        const newSocket = io(BACKEND_URL, {
            query: {
                userId: userData._id,
            }
        });

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        })

        setSocket(newSocket);
    }

    useEffect(() => {

        if (token) {

            axios.defaults.headers.common["token"] = token;

            checkAuth();

        }

    }, [token])

    const value = {

        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile

    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}