import { Outlet } from "react-router"
import Header from "../Header/Header.tsx";
import ModalHost from "../ModalHost/ModalHost.tsx";

function Layout() {
    return (
        <div>
            <Header />
            <main className={"container"}>
                <Outlet />
            </main>
            <ModalHost />
        </div>
    )
}

export default Layout;