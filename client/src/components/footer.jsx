import React from 'react'
import { NavLink } from "react-router-dom";
import { Logo } from "../assets/img";
export default function footer() {
    return (
        <footer className="flex items-center w-full h-96 p-4 md:py-2 md:px-6 bg-black">
            <NavLink to={"/"}>
                <img src={Logo} className="w-16" alt="" />
            </NavLink>
        </footer>
    )
}
