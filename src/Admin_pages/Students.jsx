import { useState } from 'react';
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

    
     <div className="max-w-4xl p-6 mx-auto mt-20">

      <h1 className="mb-4 text-2xl font-bold">Student Management</h1>

      {/* Search */}
      <div className="flex items-center mb-6 space-x-4">
        <input
          type="text"
          placeholder="Enter student number"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="mb-4 text-sm font-medium text-purple-700">
          {message}
        </div>
      )}

      {/* Student Info Box */}
      {student && (
        <div className="p-6 mb-6 bg-white border border-gray-200 shadow-md rounded-xl">
          <p><strong>Username:</strong> {student.username}</p>
          <p><strong>Email:</strong> {student.email}</p>

          <div className="flex mt-4 space-x-4">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
            >
              Update
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Add New Student */}
      <div className="p-6 bg-white border border-gray-200 shadow-md rounded-xl">
        <h2 className="mb-4 text-lg font-semibold">Add New Student</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={newStudent.username}
            onChange={(e) =>
              setNewStudent({ ...newStudent, username: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={newStudent.email}
            onChange={(e) =>
              setNewStudent({ ...newStudent, email: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
          />
          <button
            onClick={handleAdd}
            className="w-32 px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
          >
            Add Student
          </button>
        </div>
      </div>
    </div>
   </div>
  );
}