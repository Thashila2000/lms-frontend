import { motion } from "framer-motion";
import AdminNavbar from "../Components/Admin_navbar";
import ClassroomDetailsCards from "../Components/ClassRoomDetailsCard";

const ClassroomDetailsPage = () => {
  return (
    <>
      <AdminNavbar />
        <div className="min-h-screen p-4 mt-16 sm:p-6 md:p-8 lg:p-12 sm:mt-32 md:mt-12 md:ml-64 bg-gradient-to-b from-gray-100 to-gray-200">
        <motion.h1
          className="mb-6 text-2xl font-bold text-center text-gray-800  sm:text-3xl md:text-4xl md:text-left"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Classroom Controls
        </motion.h1>
        <div className="flex justify-center md:justify-start">
          <ClassroomDetailsCards />
        </div>
      </div>
    </>
  );
};

export default ClassroomDetailsPage;