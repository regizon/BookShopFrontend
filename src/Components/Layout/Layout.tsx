import { Outlet } from "react-router"
import Header from "./Header/Header.tsx";

function Layout() {
    return (
        <div>
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;