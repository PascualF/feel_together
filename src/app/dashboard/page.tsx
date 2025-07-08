import Dashboard from "../components/Dashboard";
import Login from "../components/Login";
import Main from "../components/Main"

export const metadata = {
  title: "Feel Together ⋅ Dashboard",
};

export default function DashboardPage(){

    const isAuthenticated = true

    // If user Auth, than DashBoard will appear.
    let children = (
        <Login />
    )

    if(isAuthenticated){
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