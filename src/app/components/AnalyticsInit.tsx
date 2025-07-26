'use client'

import { useEffect } from "react";
import { initAnalytics } from "../../../firebase-analytics";

export default function AnalyticsInit() {
    useEffect(() => {
        initAnalytics();
    }, [])

    return null;
}