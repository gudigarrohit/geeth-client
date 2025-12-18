import React from 'react'
import { Link } from "react-router-dom";
import { BiLogoInstagramAlt } from "react-icons/bi";
import { IoLogoGithub } from "react-icons/io";
import { FaFacebook } from "react-icons/fa";
import { SiLinkedin } from "react-icons/si";
import { FaTwitter } from "react-icons/fa";

const Footer = () => {
    return (
        <>
            <footer className="w-full  bg-[#1c1b1b] rounded-b flex items-center justify-center text-white font-semibold mb-0.5">
                <div className="flex w-[33%] h-[4.5vh]  gap-4.5 px-2.5 text-[.74rem] items-center   ">
                    <Link
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 no-underline hover:text-gray-200 transition-colors"
                    >
                        <span>Legal</span>
                    </Link>
                    <Link
                        href="#" target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 no-underline hover:text-gray-200 transition-colors"
                    >
                        <span>Safety & Privacy Center</span>
                    </Link>
                    <Link
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 no-underline hover:text-gray-200 transition-colors"
                    >
                        <span>Cookies</span>
                    </Link>
                    <Link
                        href="#" target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 no-underline hover:text-gray-200 transition-colors"
                    >
                        <span>About Ads</span>
                    </Link>
                    <Link
                        href="#" target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 no-underline hover:text-gray-200 transition-colors"
                    >
                        <span>Accessibility</span>
                    </Link>
                </div>
                <div className='w-[33%] h-[4.5vh] flex justify-center items-center text-[.8rem] font-semibold'>
                    <span>© 2026 Geeth-Music , All Rights Reserved.</span>
                </div>
                <div className="flex w-[33%] h-[4.5vh] justify-end items-center gap-3 px-8">
                    <SiLinkedin className="cursor-pointer size-4 transition-transform duration-200 hover:scale-125" />
                    <BiLogoInstagramAlt className="cursor-pointer size-5 transition-transform duration-200 hover:scale-125" />
                    <IoLogoGithub className="cursor-pointer size-5 transition-transform duration-200 hover:scale-125" />
                    <FaFacebook className="cursor-pointer size-4.5 transition-transform duration-200 hover:scale-125" />
                    <FaTwitter className="cursor-pointer size-4.5 transition-transform duration-200 hover:scale-125" />
                </div>


            </footer>

        </>
    )
}

export default Footer


