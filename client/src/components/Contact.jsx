import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LoginBg } from "../assets/video";
import Header from "./Header";
import { useStateValue } from "../Context/StateProvider";
import { Link } from "react-router-dom";
import { IoLogoInstagram, IoLogoTwitter, IoLogoVk, IoLogoYoutube } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { getAllArtist } from "../api";
import { actionType } from "../Context/reducer";

const Contact = () => {
    const [{ artists }, dispatch] = useStateValue();

    useEffect(() => {
        if (!artists) {
            getAllArtist().then((data) => {
                dispatch({ type: actionType.SET_ARTISTS, artists: data.data });
            });
        }
    }, []);

    return (
        <div className="w-full p-4 flex items-center justify-center flex-col">
            <Header />
            <div className="video-block">
                <video
                    src={LoginBg}
                    type="video/mp4"
                    autoPlay
                    muted
                    loop
                    className="bg-video" />

                <div className="relative w-full gap-3  my-4 p-4 py-12 border border-gray-300 rounded-md flex flex-wrap justify-evenly">
                    {artists &&
                        artists.map((data, index) => (
                            <>
                                <ArtistCard key={index} data={data} index={index} />
                            </>
                        ))}
                </div>

            </div>
        </div>
    );
};

export const ArtistCard = ({ data, index }) => {
    const [isDelete, setIsDelete] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, translateX: -50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative w-80 min-w-340 px-2 py-4 gap-3 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-center"
        >
            <img
                src={data?.imageURL}
                className="w-full h-96 object-cover rounded-md"
                alt=""
            />

            <p className="text-xl text-textColor">E-mail: seldonbeatz@gmail.com</p>
            <div className="flex items-center gap-4">
                <a href="https://www.instagram.com/sadvokasoov" target="_blank">
                    <motion.i whileTap={{ scale: 0.75 }}>
                        <IoLogoInstagram className="text-gray-500 hover:text-headingColor text-2xl" />
                    </motion.i>
                </a>
                <a href="https://vk.com" target="_blank">
                    <motion.i whileTap={{ scale: 0.75 }}>
                        <IoLogoVk className="text-gray-500 hover:text-headingColor text-2xl" />
                    </motion.i>
                </a>
                <a href="https://www.youtube.com/@SeldonBeats" target="_blank">
                    <motion.i whileTap={{ scale: 0.75 }}>
                        <IoLogoYoutube className="text-gray-500 hover:text-headingColor text-2xl" />
                    </motion.i>
                </a>
            </div>
        </motion.div>
    );
};

export default Contact;
