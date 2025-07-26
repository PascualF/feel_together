'use client'

import { ReactNode } from "react";
import { AuthProvider } from "../../../context/AuthContext";
import AnalyticsInit from "./AnalyticsInit";
import Header from "./Header";
import Footer from "./Footer";
import useHasMounted from "../../../hooks/useHadMounted";


export default function AppWrapper({children} : {children: ReactNode}) {
    const hasMounted = useHasMounted()
    if (!hasMounted) return null // This will avoid rendering dynamic things on server => so hydration problems
    // Hydraton problems can persist with some extension.
    // In my case it was grammarly and adblock

    return (
        <AuthProvider >
            <AnalyticsInit />
            <Header />
            {children}
            <Footer />
        </AuthProvider>
    )
}