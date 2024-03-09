"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/app/components/Button";

export default function SignIn() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = await signIn("credentials", {
            redirect: false,
            username,
            password,
            callbackUrl: "/",
        });

        if (result && result.error) {
            console.error(result.error);
            setErrorMessage("Login failed. Please check your credentials.");
        } else if (result?.url) {
            window.location.href = result.url;
        }
    };

    return (
        <>
            {/* <section className="w-[screen] h-screen flex justify-center items-center text-white flex-col gap-4"> */}
            <section className="w-screen h-screen flex justify-center items-center text-white flex-col gap-4 bg-[#7272728f]">
                <section className="flex flex-col gap-4 bg-black p-6 drop-shadow-form w-[300px]">
                    <h1 className="text-2xl leading-none text-center">
                        Welcome to the <br></br>
                        <span className="text-sm">👾</span> Gateway{" "}
                        <span className="text-sm">👾</span> <br></br> of Wonders
                    </h1>
                    <form
                        className="w-[250px] flex justify-center items-center text-white flex-col gap-2"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col gap-1 justify-center text-center">
                            <input
                                className="text-[red] 
                                bg-[#3c3c3c] focus:bg-[#4d4d4d] px-4 py-[2px] w-[200px]"
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="admin"
                            />
                        </div>
                        <div className="flex flex-col gap-1 justify-center text-center">
                            <input
                                className="text-[red] bg-[#3c3c3c] focus:bg-[#4d4d4d] px-4 py-[2px] w-[200px]"
                                id="password"
                                type="password"
                                placeholder="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button className="bg-[#222] px-10 hover:bg-[#333] text-white border-none py-1 h-auto drop-shadow-authButton scale-[0.8] mt-2">
                            Sign In
                        </Button>
                        {errorMessage && (
                            <div className="text-red-500 text-center">
                                {errorMessage}
                            </div>
                        )}
                    </form>
                </section>
                <small className="absolute bottom-4">
                    Powered by Stille Studio 💫
                </small>
            </section>
        </>
    );
}
