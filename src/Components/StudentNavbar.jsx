import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaBell, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

export default function StudentNavbar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showServices, setShowServices] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const servicesLinks = [
    { label: 'Library', path: '/student_services/library' },
    { label: 'Counseling', path: '/student_services/counseling' },
    { label: 'Career Center', path: '/student_services/career' },
  ];

  return (
    <header className="fixed top-0 left-0 z-50 w-full h-16 px-3 bg-white shadow-md sm:px-6 md:px-8">
      <div className="flex items-center justify-between h-full">
        {/* Left: Logo */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <img
            src="https://www.harlow-college.ac.uk/images/harlow_college/study-options/course-areas/bright-futures/redesign/bright-futures-logo-large-cropped.png" 
            alt="Student Portal Logo"
            className="object-contain w-auto h-10 sm:h-14"
          />
        </div>

        {/* Center: Navigation */}
        <nav className="items-center hidden space-x-6 font-medium text-gray-800 md:flex">
          
          <NavLink to="/student_courses" className="hover:text-blue-600">Courses</NavLink>
          

          {/* Services Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowServices(prev => !prev)}
              className="flex items-center space-x-1 hover:text-blue-600"
            >
              <span>Services</span>
              <FaChevronDown className="mt-1 text-xs" />
            </button>
            <AnimatePresence>
              {showServices && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 z-10 w-40 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg"
                >
                  {servicesLinks.map(({ label, path }) => (
                    <li key={path}>
                      <NavLink
                        to={path}
                        className="block px-4 py-2 text-sm hover:bg-green-100"
                        onClick={() => setShowServices(false)}
                      >
                        {label}
                      </NavLink>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          <NavLink to="/student_news" className="hover:text-blue-600">News</NavLink>
           <NavLink to="/results" className="hover:text-blue-600">Results</NavLink>
          <NavLink to="/student_help" className="hover:text-blue-600">Help</NavLink>
          
          
        </nav>

        {/* Right: Search + Icons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-32 px-3 py-1 text-gray-800 transition-all border border-gray-300 rounded-full sm:w-48 md:w-64 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <FaBell className="text-xl text-gray-800 transition-colors cursor-pointer sm:text-2xl hover:text-blue-600" />
          <FaUserCircle className="text-xl text-gray-800 transition-colors cursor-pointer sm:text-2xl hover:text-blue-600" />
        </div>
      </div>
    </header>
  );
}