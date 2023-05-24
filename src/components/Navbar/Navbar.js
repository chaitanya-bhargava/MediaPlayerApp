import { NavLink, useNavigate } from "react-router-dom";
import './Navbar.css';
import { useSelector } from "react-redux";
import { auth } from "../../firebase";
import {  signOut } from "firebase/auth";
import Button from "../Button/Button";
const Navbar = () => {
    const onClickHandler = () => {
        const nav=document.querySelector('nav');
        const navlist= document.querySelector('nav ul');
        navlist.classList.toggle('hide');
        nav.classList.toggle('responsive');
    }
    const navigate=useNavigate();
    async function logOutHandler(){
        await signOut(auth);
        navigate('/');
    }
    const user=useSelector(state=>state.authReducer);
    if(user){
        return <nav className="responsive">
        <img className="nav-logo" src="play.png" alt="logo"/>
        <ul className="hide">
            <li><NavLink to={'/'}>Home</NavLink></li>
            <li><NavLink to={'/history'}>History</NavLink></li>
            {user && <Button onClick={logOutHandler} text="LOG OUT"/>}
        </ul>
        <img onClick={onClickHandler} className="hamburger" src="hamburger.png" alt="menu"/>
    </nav>
    }
    else{
        return <nav className="responsive">
        <img className="nav-logo" src="play.png" alt="logo"/>
        <ul className="hide">
            <li><NavLink to={'/'}>Home</NavLink></li>
            <li><NavLink to={'/auth'}>Sign Up/Log in</NavLink></li>
        </ul>
        <img onClick={onClickHandler} className="hamburger" src="hamburger.png" alt="menu"/>
    </nav> 
    } 
}

export default Navbar;