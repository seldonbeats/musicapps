import React, { useEffect, useState, Fragment } from "react";
import { useStateValue } from "../Context/StateProvider";
import { NavLink, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { IoArrowRedo, IoArrowUndo, IoCartOutline, IoMusicalNote } from "react-icons/io5";
import { motion } from "framer-motion";
import { Dialog, Transition } from '@headlessui/react'
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { actionType } from "../Context/reducer";
import { MdPlaylistPlay } from "react-icons/md";
import { getAllSongs } from "../api";
import { RiPlayListFill } from "react-icons/ri";
import { list } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import CartScreen from "./CartScreen";
const MusicPlayer = () => {
  const [isPlayList, setIsPlayList] = useState(false);
  const [{ allSongs, song, isSongPlaying, miniPlayer }, dispatch] =
    useStateValue();

  const [isOpen, setIsOpen] = useState(true);

  const closeMusicPlayer = () => {
    if (isSongPlaying) {
      dispatch({
        type: actionType.SET_SONG_PLAYING,
        isSongPlaying: false,
      });
    }
  };

  const togglePlayer = () => {
    if (miniPlayer) {
      dispatch({
        type: actionType.SET_MINI_PLAYER,
        miniPlayer: false,
      });
    } else {
      dispatch({
        type: actionType.SET_MINI_PLAYER,
        miniPlayer: true,
      });
    }
  };

  const nextTrack = () => {
    if (song > allSongs.length) {
      dispatch({
        type: actionType.SET_SONG,
        song: 0,
      });
    } else {
      dispatch({
        type: actionType.SET_SONG,
        song: song + 1,
      });
    }
  };

  const previousTrack = () => {
    if (song === 0) {
      dispatch({
        type: actionType.SET_SONG,
        song: 0,
      });
    } else {
      dispatch({
        type: actionType.SET_SONG,
        song: song - 1,
      });
    }
  };

  useEffect(() => {
    if (song > allSongs.length) {
      dispatch({
        type: actionType.SET_SONG,
        song: 0,
      });
    }
  }, [song]);


  return (
    <div className="w-full h-full flex items-center gap-3 overflow-hidden">
      <div
        className={`w-full full items-center gap-3 p-4 ${miniPlayer ? "absolute top-40" : "flex relative"
          }`}
      >
        <img
          src={allSongs[song]?.imageURL}
          className="w-30 h-20 object-cover rounded-md"
          alt=""
        />
        <div className="flex items-start flex-col">
          <p className="text-xl text-headingColor font-semibold">
            {`${allSongs[song]?.name.length > 20
              ? allSongs[song]?.name.slice(0, 20)
              : allSongs[song]?.name
              }`}{" "}
            <span className="text-base">({allSongs[song]?.album})</span>
          </p>
          <p className="text-textColor">
            {allSongs[song]?.artist}{" "}
          </p>
          <motion.i
            whileTap={{ scale: 0.8 }}
            onClick={() => setIsPlayList(!isPlayList)}
          >
            <RiPlayListFill className="text-textColor hover:text-headingColor text-3xl cursor-pointer" />
          </motion.i>
        </div>
        <div className="flex items-start">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-start px-3 py-2 rounded-md bg-red-700 bg-opacity-80 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          ><IoCartOutline className="pr-1 flex items-start text-white group-hover:text-headingColor text-xl cursor-pointer" />
            ${allSongs[song]?.price}
          </button>
        </div>
        <div className="flex-1">
          <AudioPlayer
            src={allSongs[song]?.songUrl}
            onPlay={() => console.log("is playing")}
            autoPlay={true}
            showSkipControls={true}
            onClickNext={nextTrack}
            onClickPrevious={previousTrack}
          />

        </div>
        <div className="h-full flex items-center justify-center flex-col gap-3">
          <motion.i whileTap={{ scale: 0.8 }} onClick={closeMusicPlayer}>
            <IoMdClose className="text-textColor hover:text-headingColor text-2xl cursor-pointer" />
          </motion.i>

          <motion.i whileTap={{ scale: 0.8 }} onClick={togglePlayer}>
            <IoArrowRedo className="text-textColor hover:text-headingColor text-2xl cursor-pointer" />
          </motion.i>
        </div>
      </div>

      {isPlayList && (
        <>
          <PlayListCard />
        </>
      )}

      {miniPlayer && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed right-2 bottom-2 "
        >
          <div className="w-40 h-40 rounded-full flex items-center justify-center  relative ">
            <div className="absolute inset-0 rounded-full bg-gray-600 blur-xl animate-pulse"></div>
            <img
              onClick={togglePlayer}
              src={allSongs[song]?.imageURL}
              className="z-50 w-32 h-32 rounded-full object-cover cursor-pointer"
              alt=""
            />
          </div>
        </motion.div>
      )}

      <>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" open={isOpen} onClose={() => setIsOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    ><div className="flex ml-auto pl-8 justify-end cursor-pointer text-xl" onClick={() => setIsOpen(false)}><h1>X</h1></div>
                      Payment successful
                    </Dialog.Title>
                    <div className="w-50 h-30 flex flex-wrap justify-between pt-8 text-gray-200 cursor-pointer">
                      <div className=" bg-gray-700 px-8 py-3 shadow-md rounded-md "><h3>MP3</h3><span>{allSongs[song]?.price}$</span><h5 className=" text-sm text-gray-200 pb-5 ">MP3</h5></div>
                      <div className=" bg-gray-700 px-8 py-3 shadow-md rounded-md "><h3>WAV</h3><span>{allSongs[song]?.price}$</span></div>
                      <div className=" bg-gray-700 px-8 py-3 shadow-md rounded-md "><h3>UNLIMITED</h3><span>100$</span></div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 pt-8">
                        Your payment has been successfully submitted. We’ve sent
                        you an email with all of the details of your order.
                      </p>
                    </div>

                    <div className="mt-4">
                      <NavLink to={`/cart/${allSongs[song]?._id}`}>
                        <button
                          type="button"
                          className="flex justify-center ml-auto rounded-md border border-transparent bg-red-700 bg-opacity-80 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-red-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                          onClick={CartScreen}
                        > <IoCartOutline className="pr-1 flex items-start text-yellow-500 group-hover:text-headingColor text-2xl cursor-pointer" />
                          Add To Cart
                        </button>
                      </NavLink>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    </div>
  );
};



export const PlayListCard = () => {
  const [{ allSongs, song, isSongPlaying }, dispatch] = useStateValue();
  useEffect(() => {
    if (!allSongs) {
      getAllSongs().then((data) => {
        dispatch({
          type: actionType.SET_ALL_SONGS,
          allSongs: data.data,
        });
      });
    }
  }, []);

  const setCurrentPlaySong = (songindex) => {
    if (!isSongPlaying) {
      dispatch({
        type: actionType.SET_SONG_PLAYING,
        isSongPlaying: true,
      });
    }
    if (song !== songindex) {
      dispatch({
        type: actionType.SET_SONG,
        song: songindex,
      });
    }
  };

  return (
    <div className="absolute left-4 bottom-24 gap-2 py-2 w-350 max-w-[350px] h-510 max-h-[510px] flex flex-col overflow-y-scroll scrollbar-thin rounded-md shadow-md bg-primary">
      {allSongs.length > 0 ? (
        allSongs.map((music, index) => (
          <motion.div
            initial={{ opacity: 0, translateX: -50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`group w-full p-4 hover:bg-card flex gap-3 items-center cursor-pointer ${music?._id === song._id ? "bg-card" : "bg-transparent"
              }`}
            onClick={() => setCurrentPlaySong(index)}
          >
            <IoMusicalNote className="text-textColor group-hover:text-headingColor text-2xl cursor-pointer" />

            <div className="flex items-start flex-col">
              <p className="text-lg text-headingColor font-semibold">
                {`${music?.name.length > 20
                  ? music?.name.slice(0, 20)
                  : music?.name
                  }`}{" "}
                <span className="text-base">({music?.album})</span>
              </p>
              <p className="text-textColor">
                {music?.artist}{" "}
                <span className="text-sm text-textColor font-semibold">
                  ({music?.category})

                </span>
              </p>

            </div>
          </motion.div>
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

export default MusicPlayer;
