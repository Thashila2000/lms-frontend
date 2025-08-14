import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

export default function AdminNavbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  // Smooth sidebar animation
  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 80, damping: 14 }
    },
    closed: {
      x: '-100%',
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  // Overlay fade
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.5 }
  };

  const navLinks = [
    { label: 'Home', path: '/admin_home' },
    { label: 'Students', path: '/students' },
    { label: 'Classrooms', path: '/classrooms' },
  ];

  return (
    <div className="relative">
      {/* Navbar */}
      <header className="fixed top-0 left-0 z-50 flex items-center justify-between w-full h-16 px-3 bg-white shadow-md sm:px-6 md:px-8">
        {/* Left: Logo + Hamburger */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {isMobile && (
            <FaBars
              className="text-2xl text-gray-800 transition-transform cursor-pointer hover:scale-110"
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
            className="w-32 px-3 py-1 text-gray-800 transition-all border border-gray-300 rounded-full sm:w-48 md:w-64 sm:py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <FaBell className="text-xl text-gray-800 transition-colors cursor-pointer sm:text-2xl hover:text-purple-600" />
          <FaUserCircle className="text-xl text-gray-800 transition-colors cursor-pointer sm:text-2xl hover:text-purple-600" />
        </div>
      </header>

      {/* Sidebar with AnimatePresence for mount/unmount animations */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.nav
            key="sidebar"
            className="fixed top-16 left-0 z-40 w-64 h-full text-white bg-gradient-to-b from-[#4A00E0] to-[#8E2DE2] shadow-lg rounded-tr-2xl rounded-br-2xl"
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
          >
            <ul className="px-4 mt-6 space-y-4">
              {navLinks.map(({ label, path }) => (
                <motion.li
                  key={path}
                  whileHover={{ scale: 1.05, x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base ${
                        isActive ? 'bg-white/30 font-semibold' : 'hover:bg-white/20'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile Overlay with fade */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-30 bg-black"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            transition={{ duration: 0.3 }}
            onClick={toggleSidebar}
            aria-label="Close sidebar overlay"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
