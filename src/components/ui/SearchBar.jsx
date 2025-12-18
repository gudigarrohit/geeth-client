import { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useSongContext } from "../../context/SongContext";


const SearchBar = () => {
    const {
        allSongs,          // 👈 now comes from /api/songs
        setSelectedAlbum,
        setSelectedSong,
        setPlayingIndex,
        setIsPlaying,
        selectedSong,
        setSongs,
    } = useSongContext();

    const [query, setQuery] = useState("");

    // --- search over ALL songs ---
    const normalize = (str) => str.toLowerCase().trim();

    const results = (() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];

        const seenNames = new Set();   // 👈 to avoid duplicates by name
        const out = [];

        for (const song of allSongs) {
            const name = (song.name || "").toLowerCase();

            // must match query somehow (you can tweak this condition)
            if (!name.includes(q)) continue;

            // if we've already added a song with this exact name, skip it
            if (seenNames.has(name)) continue;

            seenNames.add(name);
            out.push(song);
        }

        return out;
    })();



    const handlePlaySong = (song) => {
        // 1️⃣ find all songs from the same album/folder
        const songsOfAlbum = allSongs.filter((s) => s.album === song.album);

        // 2️⃣ set current album & playlist
        setSelectedAlbum({
            title: song.album,          // you can map this to a nicer title if needed
            folder: song.album,
            cover: song.cover,
        });
        setSongs(songsOfAlbum);

        // 3️⃣ find index inside that album list
        const index = songsOfAlbum.findIndex((s) => s.file === song.file);
        setPlayingIndex(index >= 0 ? index : 0);

        // 4️⃣ select song & play
        setSelectedSong(song);
        if (!selectedSong || selectedSong.file !== song.file) {
            setIsPlaying(true);
        }

   
    };


    return (
        <div className="relative w-[95%]">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-[#1c1c1c] to-[#2a2a2a] backdrop-blur-md shadow-lg shadow-black/40 border border-white/10 transition-all duration-300 hover:shadow-[#1ed760]/20 hover:border-[#1ed760]/20 hover:scale-[1.02]">
                <div className="bg-gradient-to-br from-cyan-400 to-blue-600 w-7 h-6 rounded-full flex items-center justify-center">
                    <IoMdSearch className="invert size-3.5" />
                </div>

                <input
                    type="text"
                    placeholder="Search songs..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent outline-none text-white placeholder-gray-400 text-sm"
                />

                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <IoClose className="size-4" />
                    </button>
                )}
            </div>

            {results.length > 0 && (
                <ul className="absolute left-0 right-0 bg-[#2a2a2a] mt-2 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
                    {results.map((song, i) => (
                        <li
                            key={i}
                            onClick={() => handlePlaySong(song)}
                            className="px-3 py-2 text-white text-sm cursor-pointer hover:bg-[#3d3d3d] flex justify-between"
                        >
                            <span className="truncate max-w-[70%]">
                                {song.name}
                            </span>

                        </li>
                    ))}

                </ul>
            )}
        </div>
    );
};

export default SearchBar;
