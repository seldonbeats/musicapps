import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./footer";


const CartScreen = () => {
    return (
        <div className="w-full h-auto flex flex-col items-center justify-center bg-primary">
            <Header />

            <Footer />
        </div>
    );

};

export default CartScreen;