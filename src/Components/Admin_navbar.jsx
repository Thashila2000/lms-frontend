import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

export default function AdminNavbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile); // Open sidebar on desktop, closed on mobile
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  const navLinks = [
    { label: 'Home', path: '/admin_home' },
    { label: 'Students', path: '/students' },
    { label: 'Classrooms', path: '/classrooms' },
    // Add more links as needed
  ];

  return (
    <div className="relative">
      {/* Navbar */}
      <header className="fixed top-0 left-0 z-50 flex items-center justify-between w-full h-16 px-3 bg-white shadow-md sm:px-6 md:px-8">
        {/* Left: Logo + Hamburger */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {isMobile && (
            <FaBars
              className="text-2xl text-gray-800 cursor-pointer"
              onClick={toggleSidebar}
              aria-label="Open sidebar"
            />
          )}
          <span className="text-lg font-bold tracking-wide sm:text-xl">Admin Panel</span>
        </div>

        {/* Right: Search + Icons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-32 px-3 py-1 text-gray-800 border border-gray-300 rounded-full sm:w-48 md:w-64 sm:py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <FaBell className="text-xl text-gray-800 cursor-pointer sm:text-2xl" />
          <FaUserCircle className="text-xl text-gray-800 cursor-pointer sm:text-2xl" />
        </div>
      </header>

      {/* Sidebar */}
      <motion.nav
        className="fixed top-16 left-0 z-40 w-64 sm:w-64 md:w-64 h-full text-white bg-gradient-to-b from-[#4A00E0] to-[#8E2DE2] shadow-lg"
        initial={false}
        animate={isSidebarOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <ul className="px-4 mt-6 space-y-4">
          {navLinks.map(({ label, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded transition-colors duration-200 text-sm sm:text-base ${
                    isActive ? 'bg-white/30 font-semibold' : 'hover:bg-white/20'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </motion.nav>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50"
          onClick={toggleSidebar}
          aria-label="Close sidebar overlay"
        />
      )}
    </div>
  );
}
