'use client'

import { getAnalytics, isSupported, logEvent } from "firebase/analytics"
import { app } from "./firebase"

export const initAnalytics = async () => {
    if(typeof window === 'undefined') return;

    const supported = await isSupported();
    if (!supported) return;

    const analytics = getAnalytics(app);
    logEvent(analytics, "notification_received")
}