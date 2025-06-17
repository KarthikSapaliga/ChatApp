import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { Mail, KeyRound } from "lucide-react";

import { apiClient } from "@/lib/axios.js";
import { SIGNUP_ROUTE } from "@/lib/routes.js";
import { useAppStore } from "@/store/store.js";

import toast from "@/lib/toast";
import loginBanner from "@/assets/login.png";
import ThemeToggle from "@/components/ThemeToggle";

function Signup() {
    const navigate = useNavigate();
    const { setUserInfo } = useAppStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confiemPassword, setConfiemPassword] = useState("");

    const validate = () => {
        if (!email.length) {
            toast("error", "Email is required.");
            return false;
        }
        if (!password.length) {
            toast("error", "Password is required.");
            return false;
        }

        if (password !== confiemPassword) {
            toast("error", "Password and Confirm Password should match.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            const response = await apiClient.post(
                SIGNUP_ROUTE,
                {
                    email,
                    password,
                },
                { withCredentials: true }
            );

            toast("success", "User Registered Successfully");
            if (response.status === 201) {
                setUserInfo(response.data);
                navigate("/profile");
            }
        } catch (error) {
            toast("error", "SignUp failed");
        }
    };

    return (
        <div className="bg-light3 dark:bg-dark1 h-screen relative p-10">
            <div className="absolute right-2 top-2">
                <ThemeToggle />
            </div>
            <div className="flex flex-wrap items-center h-full overflow-auto no-scrollbar">
                <div className="hidden w-full h-full md:flex xl:w-1/2 items-center justify-center">
                    <img
                        src={loginBanner}
                        className="mx-auto w-full object-cover object-center"
                    />
                </div>
                <div className="w-full xl:w-1/2">
                    <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                        <h1 className="text-2xl font-bold text-black dark:text-white">
                            Sign Up
                        </h1>
                        <p className="mb-6">Please enter your login details.</p>
                        <form onSubmit={handleSubmit}>
                            <div className="relative mb-6">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-lg border border-stroke dark:border-strokedark py-3 pl-6 pr-10 bg-light2 dark:bg-dark3 outline-none focus:border-[2px] focus:border-primary dark:focus:border-primary text-black dark:text-white"
                                />
                                <Mail
                                    size={20}
                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                />
                            </div>
                            <div className="relative mb-6">
                                <input
                                    type="password"
                                    placeholder="Enter the password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-stroke dark:border-strokedark py-3 pl-6 pr-10 bg-light2 dark:bg-dark3 outline-none focus:border-[2px] focus:border-primary dark:focus:border-primary text-black dark:text-white"
                                />
                                <KeyRound
                                    size={20}
                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                />
                            </div>
                            <div className="relative mb-6">
                                <input
                                    type="password"
                                    placeholder="Confirm the password"
                                    value={confiemPassword}
                                    onChange={(e) =>
                                        setConfiemPassword(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-stroke dark:border-strokedark py-3 pl-6 pr-10 bg-light2 dark:bg-dark3 outline-none focus:border-[2px] focus:border-primary dark:focus:border-primary text-black dark:text-white"
                                />
                                <KeyRound
                                    size={20}
                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-primary text-white rounded-lg"
                            >
                                Sign Up
                            </button>

                            <p className="text-center mt-6">
                                Already have an account?
                                <Link to="/auth/login" className="text-primary">
                                    &nbsp;Log In
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
