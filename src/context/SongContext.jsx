// src/context/SongContext.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

const SongContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL ;

export const SongProvider = ({ children }) => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [songs, setSongs] = useState([]);          // current album songs
  const [playlist, setPlaylist] = useState([]);    // explicit playlist
  const [playingIndex, setPlayingIndex] = useState(null);

  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [albums, setAlbums] = useState([]);
  const [allSongs, setAllSongs] = useState([]);

  // 🔁 repeat mode: "default" | "repeat" | "repeatOne"
  const [repeatMode, setRepeatMode] = useState("default");
  const repeatOnePlayedRef = useRef(false);

  // 🔊 one global audio element that never unmounts
  const audioRef = useRef(
    typeof Audio !== "undefined" ? new Audio() : null
  );

  // keep playlist in sync with songs
  useEffect(() => {
    setPlaylist(songs || []);
  }, [songs]);

  // when playingIndex changes → update selectedSong
  useEffect(() => {
    if (
      playingIndex == null ||
      !playlist ||
      playlist.length === 0 ||
      playingIndex < 0 ||
      playingIndex >= playlist.length
    ) {
      return;
    }
    setSelectedSong(playlist[playingIndex]);
  }, [playingIndex, playlist]);

  // 🎵 1) Load / change song ONLY when selectedSong changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !selectedSong) return;

    repeatOnePlayedRef.current = false; // reset repeatOne counter

    const newSrc = `${API_URL}${selectedSong.filePath}`;

    // if same song is already loaded, don't reload it
    if (audio.src === newSrc || audio.src.endsWith(selectedSong.filePath)) {
      return;
    }

    audio.src = newSrc;
    audio.load();

    // usually we want to start playing when user selects a song
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  }, [selectedSong]); // 👈 IMPORTANT: no isPlaying here

  // ▶️⏸ 2) Play / pause logic, WITHOUT touching src or currentTime
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !selectedSong) return;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, selectedSong]);

  // duration + currentTime tracking
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setDuration(audio.duration || 0);
    const onTime = () => setCurrentTime(audio.currentTime || 0);

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
    };
  }, []);

  // END OF SONG LOGIC (repeat / repeatOne / playlist loop)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      if (!playlist || playlist.length === 0 || !selectedSong) return;

      // 🟢 REPEAT: loop same song forever
      if (repeatMode === "repeat") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        setIsPlaying(true);
        return;
      }

      // 🔴 REPEAT ONE: once more then stop & revert to default
      if (repeatMode === "repeatOne") {
        if (!repeatOnePlayedRef.current) {
          // first end → play one more time
          repeatOnePlayedRef.current = true;
          audio.currentTime = 0;
          audio.play().catch(() => {});
          setIsPlaying(true);
          return;
        }

        // second end → stop and revert
        repeatOnePlayedRef.current = false;
        audio.pause();
        try {
          audio.currentTime = audio.duration || 0;
        } catch (e) {}
        setIsPlaying(false);
        setRepeatMode("default");
        return;
      }

      // ⚪ DEFAULT: next song in playlist (wrap to first)
      const idx = playlist.findIndex((s) => s.name === selectedSong.name);
      let next = idx + 1;
      if (next >= playlist.length) next = 0;
      setPlayingIndex(next);
    };

    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [playlist, selectedSong, repeatMode]);

  // controls
  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const playNext = () => {
    if (!playlist || playlist.length === 0) return;
    let next = (playingIndex ?? -1) + 1;
    if (next >= playlist.length) next = 0;
    setPlayingIndex(next);
  };

  const playPrev = () => {
    if (!playlist || playlist.length === 0) return;
    let prev = (playingIndex ?? 0) - 1;
    if (prev < 0) prev = playlist.length - 1;
    setPlayingIndex(prev);
  };

  const seek = (percent) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = (percent / 100) * audio.duration;
    setCurrentTime(audio.currentTime);
  };

  // load all songs once (for search)
  useEffect(() => {
    async function loadAllSongs() {
      try {
        const res = await fetch(`${API_URL}/api/songs`)
;
        const data = await res.json();
        setAllSongs(data.songs || []);
      } catch (err) {
        console.error("Failed to load all songs:", err);
      }
    }
    loadAllSongs();
  }, []);

  return (
    <SongContext.Provider
      value={{
        // playback state
        selectedAlbum,
        setSelectedAlbum,
        songs,
        setSongs,
        playlist,
        setPlaylist,
        playingIndex,
        setPlayingIndex,
        selectedSong,
        setSelectedSong,
        isPlaying,
        setIsPlaying,
        duration,
        currentTime,

        // library
        albums,
        setAlbums,
        allSongs,
        setAllSongs,

        // audio ref if needed
        audioRef,

        // controls
        togglePlayPause,
        playNext,
        playPrev,
        seek,

        // repeat
        repeatMode,
        setRepeatMode,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export const useSongContext = () => useContext(SongContext);
