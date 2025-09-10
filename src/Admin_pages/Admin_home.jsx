import { motion } from "framer-motion";
import { FaUserGraduate, FaBook, FaChalkboardTeacher, FaChartPie } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import AdminNavbar from "../Components/Admin_navbar";

const data = [
  { name: "Students", value: 400 },
  { name: "Teachers", value: 50 },
  { name: "Courses", value: 120 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function AdminHomePage() {
  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen p-4 mt-16 ml-64 bg-gradient-to-b from-gray-50 to-gray-100 sm:p-6 md:p-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-3xl font-bold text-gray-800"
        >
          LMS Admin Dashboard
        </motion.h1>

        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Total Students", value: 1200, icon: <FaUserGraduate className="text-3xl text-blue-500" /> },
            { title: "Total Teachers", value: 85, icon: <FaChalkboardTeacher className="text-3xl text-green-500" /> },
            { title: "Total Courses", value: 45, icon: <FaBook className="text-3xl text-yellow-500" /> },
            { title: "Active Enrollments", value: 320, icon: <FaChartPie className="text-3xl text-purple-500" /> },
          ].map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="flex items-center p-4 space-x-4 transition bg-white shadow-md rounded-2xl hover:shadow-xl">
                <div>{card.icon}</div>
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-xl font-semibold text-gray-800">{card.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="p-6 bg-white shadow-md rounded-2xl"
        >
          <h2 className="mb-4 text-xl font-semibold text-gray-700">User Distribution</h2>
          <div className="w-full h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </>
  );
}
