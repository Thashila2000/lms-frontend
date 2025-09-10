import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaCamera, FaUserGraduate, FaIdCard, FaUpload } from "react-icons/fa";
import AdminNavbar from "../Components/Admin_navbar";

export default function StudentTracking() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);

  // Start webcam feed
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    }
    startCamera();
  }, []);

  // Capture image
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      setCapturedImage(blob);
    }, "image/jpeg");
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!capturedImage) {
      alert("Please capture an image first.");
      return;
    }
    const formData = new FormData();
    formData.append("name", studentName);
    formData.append("studentId", studentId);
    formData.append("faceImage", capturedImage, "face.jpg");

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        alert("Student registered successfully!");
        setStudentName("");
        setStudentId("");
        setCapturedImage(null);
      } else {
        alert("Failed to register student.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form.");
    }
  };

  return (
    <>
      <AdminNavbar />
      <motion.div
        className="flex flex-col items-center p-4 mt-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="flex items-center gap-3 mb-6 text-2xl font-bold text-gray-800 sm:text-3xl md:text-4xl md:text-left"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Student Tracking
        </motion.h1>

        {/* Video feed */}
        <motion.video
          ref={videoRef}
          autoPlay
          playsInline
          className="rounded-2xl shadow-lg border-4 border-purple-300 mb-4 w-[320px] h-[240px]"
          whileHover={{ scale: 1.02 }}
        ></motion.video>

        {/* Hidden canvas */}
        <canvas ref={canvasRef} width={320} height={240} className="hidden"></canvas>

        {/* Capture Button */}
        <motion.button
          onClick={captureImage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-5 py-2 mb-4 text-white bg-blue-600 rounded-full shadow-md hover:bg-blue-700"
        >
          <FaCamera /> Capture Image
        </motion.button>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 p-4 border shadow-lg w-72 bg-white/50 backdrop-blur-sm rounded-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <FaUserGraduate className="text-purple-600" />
            <input
              type="text"
              placeholder="Student Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <FaIdCard className="text-purple-600" />
            <input
              type="text"
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-5 py-2 mt-2 text-white bg-green-600 rounded-full shadow-md hover:bg-green-700"
          >
            <FaUpload /> Register Student
          </motion.button>
        </motion.form>
      </motion.div>
    </>
  );
}
