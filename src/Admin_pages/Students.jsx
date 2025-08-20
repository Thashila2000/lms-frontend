import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import AdminNavbar from "../Components/Admin_navbar";

export default function StudentPage() {
  const [searchId, setSearchId] = useState('');
  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState('');
  const [newStudent, setNewStudent] = useState({ username: '', email: '' });

  const handleSearch = async () => {
    try {
      const res = await axios.get(`/api/students/${searchId}`);
      if (res.data.code === '00') {
        setStudent(res.data.content[0]);
        setMessage(res.data.msg);
      } else {
        setStudent(null);
        setMessage(res.data.msg);
      }
    } catch (err) {
      setStudent(null);
      setMessage('Error fetching student');
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`/api/students/${student.id}`, student);
      setMessage(res.data.msg);
    } catch (err) {
      setMessage('Update failed');
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`/api/students/${student.id}`);
      setStudent(null);
      setMessage(res.data.msg);
    } catch (err) {
      setMessage('Delete failed');
    }
  };

  const handleAdd = async () => {
    try {
      const res = await axios.post('/api/students', newStudent);
      setMessage(res.data.msg);
      setNewStudent({ username: '', email: '' });
    } catch (err) {
      setMessage('Add failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="max-w-4xl px-4 py-6 mx-auto mt-16 sm:px-6 md:px-8">
        <motion.h1
          className="mb-6 text-2xl font-bold text-center text-gray-800 sm:text-3xl md:text-4xl md:text-left"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Student Management
        </motion.h1>

        {/* Search */}
        <motion.div
          className="flex flex-col items-center mb-6 space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <input
            type="text"
            placeholder="Enter student number"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <button
            onClick={handleSearch}
            className="w-full px-4 py-2 text-white transition-colors bg-blue-600 rounded-full hover:bg-blue-700 sm:w-auto"
          >
            Search
          </button>
        </motion.div>

        {/* Message */}
        {message && (
          <motion.div
            className="mb-4 text-sm font-medium text-center text-purple-700 sm:text-base md:text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {message}
          </motion.div>
        )}

        {/* Student Info Box */}
        {student && (
          <motion.div
            className="p-6 mb-6 bg-white border border-gray-200 shadow-md rounded-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="mb-2"><strong>Username:</strong> {student.username}</p>
            <p className="mb-4"><strong>Email:</strong> {student.email}</p>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                onClick={handleUpdate}
                className="w-full px-4 py-2 text-white transition-colors bg-yellow-500 rounded hover:bg-yellow-600 sm:w-auto"
              >
                Update
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-white transition-colors bg-red-500 rounded hover:bg-red-600 sm:w-auto"
              >
                Delete
              </button>
            </div>
          </motion.div>
        )}

        {/* Add New Student */}
        <motion.div
          className="p-6 bg-white border border-gray-200 shadow-md rounded-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-700 sm:text-xl">Add New Student</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              value={newStudent.username}
              onChange={(e) =>
                setNewStudent({ ...newStudent, username: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <input
              type="email"
              placeholder="Email"
              value={newStudent.email}
              onChange={(e) =>
                setNewStudent({ ...newStudent, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <button
              onClick={handleAdd}
              className="w-full px-4 py-2 text-white transition-colors bg-green-600 rounded hover:bg-green-700 sm:w-40"
            >
              Add Student
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
