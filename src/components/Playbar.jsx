// src/components/Playbar.jsx
import React from "react";
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1 } from "lucide-react";
import { useSongContext } from "../context/SongContext";

function Playbar() {
  const {
    
    selectedSong,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrev,
    duration,
    currentTime,
    repeatMode,
    setRepeatMode,
        seek,          // 👈 use seek from context

  } = useSongContext();

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const formatTime = (t) => {
    if (!t || Number.isNaN(t)) return "00:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

   const handleSeek = (e) => {
    const val = Number(e.target.value); // 0–100
    seek(val);                          // 👈 update audio.currentTime in context
  };

  return (
    <div className="flex flex-col gap-2 pt-3 px-5 mt-2.5 absolute bottom-0 left-1/2 -translate-x-1/2 pb-5 w-[98%] bg-[#1f1f1f] shadow-[#969090] rounded-[1.3rem] m-auto mb-2 shadow">
      <div className="flex items-center justify-between text-white">
        {/* Left: song name */}
        <div className="w-1/3 text-center">
          {selectedSong?.name || "No song playing"}
        </div>

        {/* Middle: controls */}
        <div className="flex items-center gap-4">
          <SkipBack
            size={20}
            onClick={playPrev}
            className="cursor-pointer hover:text-blue-400"
          />

          <button
            onClick={togglePlayPause}
            className="p-3 bg-white/10 rounded-full hover:bg-white/20"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <SkipForward
            size={20}
            onClick={playNext}
            className="cursor-pointer hover:text-blue-400"
          />

          {/* MODE TOGGLE (same behaviour as your old code) */}
          {repeatMode === "repeatOne" ? (
            <Repeat1
              size={20}
              className="cursor-pointer text-blue-400"
              onClick={() => setRepeatMode("default")}
            />
          ) : repeatMode === "repeat" ? (
            <Repeat
              size={20}
              className="cursor-pointer text-green-400"
              onClick={() => setRepeatMode("repeatOne")}
            />
          ) : (
            <Repeat
              size={20}
              className="cursor-pointer text-white"
              onClick={() => setRepeatMode("repeat")}
            />
          )}
        </div>

        {/* Right: time */}
        <div className="w-1/3 text-center text-sm text-gray-300">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Progress bar */}
        <input
        type="range"
        min="0"
        max="100"
        value={Number.isFinite(progress) ? progress : 0}
        onChange={handleSeek}
         style={{ "--progress": `${progress}%` }}
        className="w-full h-1 cursor-pointer mt-0.5"
      />
    </div>
  
  );
}

export default Playbar;
       
