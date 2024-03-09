"use client";

import { signOut, signIn, useSession } from "next-auth/react";
import { Button } from "../Button";

export default function AuthButton() {
    const { data: session } = useSession();
    if (session) {
        return (
            <>
                <Button
                    className="bg-[#222] hover:bg-[#333] text-white border-none px-10 h-[31px] drop-shadow-authButton"
                    onClick={() => signOut()}
                >
                    Sign out
                </Button>
            </>
        );
    }
    return (
        <>
            <Button
                className="bg-[#222] hover:bg-[#333] text-white border-none px-10 h-auto drop-shadow-authButton"
                onClick={() => signIn()}
            >
                Sign in
            </Button>
        </>
    );
}
