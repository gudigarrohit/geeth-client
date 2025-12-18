import { useState, useEffect } from "react";
import { useSongContext } from "../context/SongContext";
import Playbar from "../components/Playbar";
import { FaPlay } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import { Link } from "react-router-dom";



function Home() {


  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const { setSelectedAlbum, setSongs, setAllSongs } = useSongContext();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await fetch(`${API_URL}/api/albums`);
        if (!res.ok) throw new Error("Failed to fetch albums");
        const json = await res.json();
        setAlbums(json.albums || []);
      } catch (err) {
        console.error("Error fetching albums:", err);
      }
    };
    fetchAlbums();
  }, [API_URL]);

  const getSongs = async (albumFolder) => {
    try {
      const res = await fetch(`${API_URL}/api/songs/${albumFolder}`);
      if (!res.ok) throw new Error("Failed to fetch songs");
      const data = await res.json();

      const songsList = (data.songs || data).map((song) => {
        const name = song.name || song.file?.replace(".mp3", "") || "Unknown";
        const file = song.file || `${name}.mp3`;
        return {
          ...song,
          name,
          filePath: `/songs/${albumFolder}/${file}`,
        };
      });

      // ✅ Set current album playlist for Library / Playbar
      setSelectedAlbum({ folder: albumFolder, songs: songsList });
      setSongs(songsList);

      // ✅ Store song into global searchable list *with album + songs reference*
      setAllSongs(prev => [
        ...prev.filter(s => s.album.folder !== albumFolder), // remove old duplicates
        ...songsList.map(s => ({
          ...s,
          album: { folder: albumFolder, songs: songsList }   // ✅ IMPORTANT FIX
        }))
      ]);

    } catch (err) {
      console.error("Error fetching songs:", err);
      setError("Could not load songs");
    }
  };





  return (
    <>
      <Link to ="/search"
        className="group flex items-center gap-1.5 ml-4 mt-2 mb-3
      4 cursor-pointer"
      >
        {/* Icon */}
        <div className="bg-gradient-to-br from-cyan-300 to-blue-800 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
          <IoMdSearch className="invert size-4" />
        </div>

        {/* Sliding text */}
        <span
          className="text-white whitespace-nowrap overflow-hidden w-0 group-hover:w-24 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out"
        >
          Search...
        </span>
      </Link>

      <div className="flex-wrap flex-col items-center justify-center px-5 pb-30 ">
        <div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex flex-wrap gap-8 items-center justify-start">
            {albums.length > 0 ? (
              albums.map((album) => (
                <div
                  key={album.folder}
                  onClick={() => getSongs(album.folder)}
                  className="   group  relative   w-36 flex-shrink-0 cursor-pointer  snap-star  transition-transform duration-300 hover:-translate-y-1 "
                >
                  {/* Cover */}
                  <div className="relative rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={`${API_URL}/${album.cover}`}
                      alt={album.title}
                      className="
                  object-cover w-full h-35 
                  transition duration-300
                  group-hover:brightness-[.65]
                  group-hover:scale-105
                "
                    />

                    {/* Floating play button */}
                    <div
                      className="
                  absolute bottom-2 right-2
                  opacity-0 group-hover:opacity-100
                  translate-y-4 group-hover:translate-y-0
                  transition-all duration-300
                "
                    >
                      <div
                        className="
                     rounded-full flex items-center justify-center
                   bg-blue-500 shadow-lg hover:scale-110 active:scale-95
                  "
                      >
                        <FaPlay className="p-2 z-20 size-8 text-white " />

                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <h4 className="my-1.5 text-white font-semibold text-sm truncate">
                    {album.title}
                  </h4>

                  {/* Description */}
                  <p className="text-gray-300 text-xs truncate">
                    {album.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No albums found.</p>
            )}
          </div>
        </div>
        <Playbar />
      </div>


    </>
  );
}

export default Home;
