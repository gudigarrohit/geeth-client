import React, { useState } from "react";
import { GiMusicalNotes } from "react-icons/gi";
import { FaRegCirclePlay } from "react-icons/fa6"
import { FaRegPauseCircle } from "react-icons/fa";
import { useSongContext } from "../../context/SongContext";

const Library = () => {
  const { selectedAlbum, songs, setSelectedSong, playingIndex, setPlayingIndex, setIsPlaying, isPlaying } = useSongContext();

  const handlePlayClick = (song, index) => {
    if (playingIndex === index) {
      // Pause
      setIsPlaying((prev) => !prev);
      setPlayingIndex(null);
      setSelectedSong(null);
    } else {
      // Play Song
      setPlayingIndex(index);
      setSelectedSong({ ...song, album: selectedAlbum });
      setIsPlaying(true);
    }
  };



  return (
    <div className="bg-[#121212] w-full h-full overflow-y-scroll p-2.5 ">
      <ul className="space-y-1 ">
        {songs && songs.length > 0 ? (
          songs.map((song, index) => (
            <li
              key={index}
              onClick={() => handlePlayClick(song, index)}
              className={`  group  flex items-center justify-between  px-4 py-2.5   rounded-xl  transition-all duration-300 cursor-pointerborder border-transparent hover:bg-[#2b2b2b] backdrop-blur-md
    ${playingIndex === index ? "bg-[#3a3a3a] shadow-[0_0_10px_rgba(0,255,136,0.25)] border-[#00ff88]" : "border-[#2d2d2d]"} `} >
              {/* Left section: Icon + text */}
              <div className="flex items-center gap-3">
                {/* Animated music bars when playing */}
                {playingIndex === index && isPlaying ? (
                  <div className="flex gap-[2px]">
                    <span className="equalizer-bar bar1"></span>
                    <span className="equalizer-bar bar2"></span>
                    <span className="equalizer-bar bar3"></span>
                  </div>
                ) : (
                  <GiMusicalNotes className="invert size-5 opacity-80 group-hover:opacity-100 transition" />
                )}

                <div className="flex flex-col gap-0.5 text-white font-semibold text-[.85rem] leading-tight">
                  <span className="truncate group-hover:text-[#00ffc3] transition">
                    {song.name}
                  </span>
                  <span className="text-gray-300 text-[.7rem]">Geeth-Music</span>
                </div>
              </div>

              {/* Right: Play / Pause */}
              <div className="flex items-center gap-2">
                <span className="text-[.78rem] font-semibold text-gray-300 group-hover:text-white transition">
                  {playingIndex === index && isPlaying ? "Pause" : "Play"}
                </span>

                {playingIndex === index && isPlaying ? (
                  <FaRegPauseCircle className="size-6 text-[#00ffc3] drop-shadow-[0_0_6px_#00ff8850] transition transform group-hover:scale-110" />
                ) : (
                  <FaRegCirclePlay className="size-6 text-white/80 group-hover:text-[#00ffc3] group-hover:scale-110 transition" />
                )}
              </div>
            </li>

          ))
        ) : (
          <p className="text-gray-200 text-sm font-bold px-3.5 flex items-center gap-1.5">
            <GiMusicalNotes className="size-4.5" /> No Album is selected...
          </p>
        )}
      </ul>
    </div >
  );
};

export default Library;
