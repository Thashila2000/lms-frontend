import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChalkboardTeacher, FaUserGraduate, FaUserPlus } from 'react-icons/fa';

const LandingNavbar = () => {
  return (
    <div className="font-sans text-gray-800 bg-gradient-to-b from-white via-sky-50 to-blue-100">
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="fixed top-0 left-0 z-50 w-full shadow-md bg-white/80 backdrop-blur-lg"
      >
        <div className="flex items-center justify-between max-w-6xl px-6 py-4 mx-auto">
          {/* Logo */}
          <div className="flex items-center ml-[-150px]">
            <img
              src="https://www.harlow-college.ac.uk/images/harlow_college/study-options/course-areas/bright-futures/redesign/bright-futures-logo-large-cropped.png"
              alt="Bright Futures Logo"
              className="object-contain w-auto h-10 sm:h-14"
            />
          </div>

          {/* Navigation Links */}
          <nav className="hidden space-x-8 text-base font-semibold md:flex">
            {[
              { label: 'Home', path: '/' },
              { label: 'About Us', path: '/about' },
              { label: 'Courses', path: '/online_courses' },
              { label: 'Blog', path: '/blog' },
              { label: 'Contact', path: '/contact' },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className="relative text-gray-800 transition-colors group hover:text-blue-600"
              >
                {item.label}
                <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Login Buttons */}
          <div className="flex space-x-2">
            <Link to="/login">
              <button
                className="flex items-center px-4 py-2 text-sm text-white transition-transform transform rounded bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-105"
                aria-label="Lecturer Login"
              >
                <FaChalkboardTeacher className="mr-2" /> Lecturer
              </button>
            </Link>

            <Link to="/login">
              <button
                className="flex items-center px-4 py-2 text-sm text-white transition-transform transform rounded bg-gradient-to-r from-green-500 to-green-700 hover:scale-105"
                aria-label="Student Login"
              >
                <FaUserGraduate className="mr-2" /> Student
              </button>
            </Link>

            <Link to="/register">
              <button
                className="flex items-center px-4 py-2 text-sm text-white transition-transform transform rounded bg-gradient-to-r from-purple-500 to-indigo-700 hover:scale-105"
                aria-label="Register"
              >
                <FaUserPlus className="mr-2" /> Register
              </button>
            </Link>
          </div>
        </div>
      </motion.header>
    </div>
  );
};

export default LandingNavbar;