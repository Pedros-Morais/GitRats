"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
    const router = useRouter();

    useEffect(() => {
        router.push("/dashboard/squads");
    }, [router]);

    return (
        <div className="h-full flex items-center justify-center p-20">
            <Loader2 className="w-8 h-8 text-git-neon animate-spin" />
        </div>
    );
}
