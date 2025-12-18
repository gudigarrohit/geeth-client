import React from 'react'
import { Link } from "react-router-dom";
import { LuPanelLeftClose } from "react-icons/lu";
import { HiHome } from "react-icons/hi";
import SearchBar from './SearchBar';

const Controlbox = () => {
  return (
    <>
      <div className="w-full  bg-[#121212] rounded-t flex flex-col gap-1 relative py-2 px-3.5">
        <LuPanelLeftClose className="absolute right-2 top-2 size-5.5  invert cursor-pointer"
        />


        <div className="flex items-center  ">
          <Link
          to={"/"}
            className="flex items-center text-white text-xl font-[Lobster] tracking-[0.07rem] no-underline hover:text-white gap-1"
          >
            <img
              src="/img/geeth_logo.png"
              className="invert "
              width="35"
              alt="Geeth Logo"
            />
            Geeth
          </Link>
        </div>


        <div>
          <ul className="  py-1 flex flex-col gap-2.5">
            <li className=" px-3 flex items-center gap-1.5 text-sm font-medium text-white ">
              <HiHome className='size-4.5' />

              Home
            </li>


            <li>
              <SearchBar/>
            </li>
          </ul>
        </div>
      </div>

    </>
  )
}

export default Controlbox