import React from "react";
import AdminNavbar from "../Components/Admin_navbar";
import CurtainControl from "../Components/CurtainControl";
import LockControl from "../Components/LockControl";
import DustbinStatus from "../Components/DustbinStatus";
import { motion } from "framer-motion";
import { MdOutlineDashboard } from "react-icons/md";
import { LightBulbIcon } from "@heroicons/react/24/solid";
import LightControl from "../Components/LightControl";

export default function SmartControl() {
  return (
    <>
      <AdminNavbar/>
    <div className="min-h-screen ml-64 bg-gradient-to-br from-gray-100 to-blue-200">
  
      <div className="p-4 sm:p-6 md:p-8">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-3 mt-16 mb-10 text-3xl font-bold text-black sm:text-4xl"
        >
          <MdOutlineDashboard className="w-8 h-8 text-blue-600" />
          Smart Control
        </motion.h1>

        <div className="grid max-w-6xl grid-cols-1 gap-6 mx-auto sm:grid-cols-2 lg:grid-cols-3">
          <CurtainControl />
          <LockControl />
          <DustbinStatus/>
          <LightControl/>
        </div>
      </div>
    </div>
    </>
  );
}