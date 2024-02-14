import { Outlet } from "react-router-dom";
import NavBar from "../component/Navbar";
import MainBar from "../component/mainbar";

export default function Root() {
    return (
        <>
            <NavBar />
            <MainBar />
            <Outlet />
        </>
    )
}