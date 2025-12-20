import React from "react";
import Library from "./ui/Library";
import Controlbox from "./ui/Controlbox";
import { MdLibraryMusic } from "react-icons/md";
import '../index.css';


const Sidebar = () => {

  return (
    <div className="h-full w-[25vw] bg-[#1c1b1b] border rounded-t flex flex-col p-0.5 ">
      <Controlbox />
      <div className="bg-[#121212] mt-0.5 flex items-center px-5 font-semibold gap-2 py-2">
        <MdLibraryMusic className="invert size-5" />
        <h4 className="text-md  text-white bg">
          Song library...</h4>
      </div>
      <Library />
    </div >
  );
};

export default Sidebar;
