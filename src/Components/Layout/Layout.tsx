import { Outlet } from "react-router"
import Header from "../Header/Header.tsx";
import ModalHost from "../ModalHost/ModalHost.tsx";
import Footer from "../Footer/Footer.tsx";

function Layout() {
    return (
        <div>
            <Header />
            <main className={"container"}>
                <Outlet />
            </main>
            <ModalHost />
            <Footer />
        </div>
    )
}

export default Layout;