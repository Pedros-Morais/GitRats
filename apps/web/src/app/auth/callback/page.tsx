"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            // Store token in localStorage or cookie
            localStorage.setItem("gitrats_token", token);

            // Redirect to dashboard or home
            router.push("/dashboard");
        } else {
            router.push("/");
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin h-8 w-8 border-4 border-git-green rounded-full border-t-transparent"></div>
                <p className="font-mono text-git-neon animate-pulse">AUTHENTICATING...</p>
            </div>
        </div>
    );
}
