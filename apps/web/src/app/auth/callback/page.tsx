"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");
        console.log("AuthCallback: processing token", token ? "FOUND" : "MISSING");

        if (token) {
            // Store token in localStorage or cookie
            localStorage.setItem("gitrats_token", token);

            // Redirect to dashboard
            console.log("AuthCallback: redirecting to /dashboard");
            router.push("/dashboard");
        } else {
            console.log("AuthCallback: no token, redirecting home");
            router.push("/");
        }
    }, [searchParams, router]);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="animate-spin h-8 w-8 border-4 border-git-green rounded-full border-t-transparent"></div>
            <p className="font-mono text-git-neon animate-pulse">AUTHENTICATING...</p>
        </div>
    );
}

export default function AuthCallback() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <AuthCallbackContent />
            </Suspense>
        </div>
    );
}
