import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

export default function AdminSidebar({ isOpen, isMobile, toggleSidebar }) {
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <>
      {/* Sidebar */}
      <motion.nav
        className="fixed top-16 left-0 h-full w-64 bg-gradient-to-b from-[#4A00E0] to-[#8E2DE2] text-white z-40"
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <ul className="px-4 mt-6 space-y-4">
          <li>
            <NavLink
              to="/admin_home"
              className={({ isActive }) =>
                `block px-3 py-2 rounded hover:bg-white/20 ${
                  isActive ? 'bg-white/30 font-semibold' : ''
                }`
              }
              onClick={isMobile ? toggleSidebar : undefined}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/students"
              className={({ isActive }) =>
                `block px-3 py-2 rounded hover:bg-white/20 ${
                  isActive ? 'bg-white/30 font-semibold' : ''
                }`
              }
              onClick={isMobile ? toggleSidebar : undefined}
            >
              Students
            </NavLink>
          </li>
        </ul>
      </motion.nav>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}