import { useState, useRef, useEffect } from "react";
import { IoMdSearch } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useSongContext } from "../../context/SongContext";

const SearchBar = () => {
  const {
    allSongs,
    setSelectedAlbum,
    setSelectedSong,
    setPlayingIndex,
    setIsPlaying,
    selectedSong,
    setSongs,
  } = useSongContext();

  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const wrapperRef = useRef(null);

  // 🔹 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔍 Search filter
  const results = (() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const seenNames = new Set();
    const out = [];

    for (const song of allSongs) {
      const name = (song.name || "").toLowerCase();
      if (!name.includes(q)) continue;

      if (seenNames.has(name)) continue;
      seenNames.add(name);
      out.push(song);
    }

    return out;
  })();

  const handlePlaySong = (song) => {
    const songsOfAlbum = allSongs.filter((s) => s.album === song.album);

    setSelectedAlbum({
      title: song.album,
      folder: song.album,
      cover: song.cover,
    });

    setSongs(songsOfAlbum);

    const index = songsOfAlbum.findIndex((s) => s.file === song.file);
    setPlayingIndex(index >= 0 ? index : 0);

    setSelectedSong(song);

    if (!selectedSong || selectedSong.file !== song.file) {
      setIsPlaying(true);
    }

    setShowResults(false); // Close dropdown after selecting
    setQuery(""); // Optional: clear search
  };

  return (
    <div ref={wrapperRef} className="relative w-[85%] mx-auto my-2">
      <div
        className="flex items-center gap-3 px-4 py-2 rounded-full 
        bg-gradient-to-r from-[#1c1c1c] to-[#2a2a2a]
        backdrop-blur-md shadow-lg shadow-black/40 border border-white/10
        transition-all duration-300 hover:shadow-[#1ed760]/20 hover:border-[#1ed760]/20 hover:scale-[1.02]"
      >
        <div className="bg-gradient-to-br from-cyan-400 to-blue-600 w-6 h-6 rounded-full flex items-center justify-center">
          <IoMdSearch className="invert size-3.5" />
        </div>

        <input
          type="text"
          placeholder="Search songs..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          className="w-full bg-transparent outline-none text-white placeholder-gray-400 text-sm"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setShowResults(false);
            }}
            className="text-gray-400 hover:text-white transition"
          >
            <IoClose className="size-4" />
          </button>
        )}
      </div>

      {showResults && results.length > 0 && (
        <ul className="absolute left-0 right-0 bg-[#2a2a2a] mt-2 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
          {results.map((song, i) => (
            <li
              key={i}
              onClick={() => handlePlaySong(song)}
              className="px-3 py-2 text-white text-sm cursor-pointer hover:bg-[#3d3d3d] flex justify-between"
            >
              <span className="truncate max-w-[70%]">{song.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
