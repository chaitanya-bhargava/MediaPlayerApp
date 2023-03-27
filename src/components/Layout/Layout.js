import { Fragment } from "react"
import { Outlet } from "react-router-dom";
import Navbar from '../Navbar/Navbar';
import './Layout.css'
const Layout = (props) => {
    return <Fragment>
        <Navbar/>
        <div className="outlet">
            <Outlet/>
        </div>
    </Fragment>
}

export default Layout;