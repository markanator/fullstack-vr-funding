import React from 'react';
import { FaRegCompass, FaSearch, FaUserAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="w-full border-b-2 py-2">
      <div className="container m-auto py-2">
        <nav className="w-full flex flex-row justify-between items-center text-xl text-gray-700">
          <div className="flex text-xl text-gray-700">
            <Link to="/" className="font-bold hover:underline">
              VR Funding
            </Link>
          </div>
          <div className="flex flex-row">
            {/* LINKS */}
            <Link
              to="/explore"
              className="mr-6 flex items-center hover:underline"
            >
              <FaRegCompass className="mr-2 text-blue-400 text-2xl" />
              Explore
            </Link>
            {/* LINKS */}
            {/* NEEDS CONTEXT */}
            <Link to="/" className="ml-6 hover:underline">
              Start a Project
            </Link>
          </div>
          <div className="flex flex-row items-center">
            <Link to="/" className="mr-4">
              {/* <span className="mr-4"> */}
              <FaSearch />
              {/* </span> */}
            </Link>
            <Link to="/login">
              <span className="mr-4 border-2 border-gray-400 rounded-full py-2 px-2 transition-colors duration-300 hover:bg-gray-400 focus:bg-gray-500 focus:border-gray-500 flex items-center">
                <FaUserAlt className="" />
              </span>
            </Link>
            {/* <Link to="/">
              <span>
                <img
                  className="rounded-full h-12 w-12"
                  src="https://i.imgur.com/vKBxTj7.jpg"
                  alt="user"
                />
              </span>
            </Link> */}
          </div>
        </nav>
      </div>
    </header>
  );
}
