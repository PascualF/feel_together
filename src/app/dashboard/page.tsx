'use client'

import { useAuth } from "../../../context/AuthContext";
import Dashboard from "../components/Dashboard";
import Loading from "../components/Loading";
import Login from "../components/Login";
import Main from "../components/Main"

/* export const metadata = {
  title: "Feel Together ⋅ Dashboard",
}; */

export default function DashboardPage(){

    /* const isAuthenticated = true */
    const { currentUser, loading } =  useAuth();

    // If user Auth, than DashBoard will appear.
    let children = (
        <Login />
    )

    if(loading) {
        children = (
            <Loading />
        )
    }

    if(currentUser){
        children = (
            <Dashboard />
        )
    }

    return (
        <Main>
            {children}
        </Main>
    )
}