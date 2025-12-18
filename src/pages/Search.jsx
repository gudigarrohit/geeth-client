import React from 'react'
import { useSongContext } from '../context/SongContext'
import MainSearchBar from '../components/ui/MainSearch'
import Playbar from '../components/Playbar'

const Search = () => {
  return (
    <>
      <MainSearchBar />
      <Playbar />
    </>
  )
}

export default Search