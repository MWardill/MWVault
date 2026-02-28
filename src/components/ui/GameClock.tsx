"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export function GameClock() {
    const [timeStr, setTimeStr] = useState("00:00:00");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            setTimeStr(`${hours}:${minutes}:${seconds}`);
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-between">
            <Clock className="w-5 h-5 text-gray-300 drop-shadow-md" />
            <span className="text-xl tracking-widest text-gray-100 jrpg-text-shadow leading-none">
                {timeStr}
            </span>
        </div>
    );
}
