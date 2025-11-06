import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StudentNavbar from "../Components/StudentNavbar";
import {
  FaClipboardList,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";

function ViewQuizPage() {
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  const studentIndex = localStorage.getItem("studentIndex");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/quizzes?indexNumber=${studentIndex}`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.formUrl) {
            setQuiz(data);
            console.log("✅ Quiz fetched:", data);
          } else {
            setError("⚠️ No quiz data returned.");
            console.warn("⚠️ Empty quiz response.");
          }
        } else {
          const message = await res.text();
          setError(message);
          console.warn("⚠️ Quiz fetch error:", message);
        }
      } catch (err) {
        setError("❌ Failed to fetch quiz. Please try again later.");
        console.error("❌ Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (studentIndex) {
      fetchQuiz();
    } else {
      setError("❌ Student not logged in. Please log in to view your quiz.");
      setLoading(false);
    }

    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, [studentIndex]);

  const isActive =
    quiz &&
    new Date(quiz.startTime) <= now &&
    new Date(quiz.endTime) >= now;

  const formatTime = (iso) =>
    new Date(iso).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <>
      <StudentNavbar />
      <div className="min-h-screen px-6 pt-24 pb-10 mt-[-40px] bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
         className="max-w-6xl p-6 mx-auto bg-white scroll-mt-24"
        >
          {/* Header */}
          <h2 className="flex items-center justify-center mb-8 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            <FaClipboardList className="mr-3 text-blue-600" />
            Quiz Portal
          </h2>

          {/* Loading State */}
          {loading && (
            <div className="mt-6 text-lg text-center text-gray-500">
              ⏳ Loading quiz...
            </div>
          )}

          {/* Error Message */}
          {!loading && error && (
            <div className="flex items-center justify-center p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
              <FaExclamationTriangle className="mr-2" />
              <span>{error}</span>
            </div>
          )}

          {/* Quiz Metadata */}
          {!loading && quiz && (
            <div className="mb-6 text-center text-gray-700">
              <p className="flex items-center justify-center gap-2">
                <FaClock className="text-indigo-500" />
                <span>
                  <strong>Start:</strong> {formatTime(quiz.startTime)} &nbsp;|&nbsp;
                  <strong>End:</strong> {formatTime(quiz.endTime)}
                </span>
              </p>
            </div>
          )}

          {/* Active Quiz Display */}
          {!loading && quiz && isActive && (
           <div className="w-full max-w-5xl mx-auto aspect-[9/12] rounded-lg border border-gray-300 shadow-md overflow-hidden">
            <iframe
            src={quiz.formUrl}
            title="Quiz Form"
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
         />
      </div>
          )}

          {/* Inactive Quiz Message */}
          {!loading && quiz && !isActive && (
            <div className="flex items-center justify-center p-6 mt-6 text-lg font-semibold text-gray-800 bg-yellow-100 rounded-lg shadow">
              <FaExclamationTriangle className="mr-2 text-yellow-600" />
              Quiz is not currently active. Please check the time window.
            </div>
          )}

          {/* No Quiz Fallback */}
          {!loading && !quiz && !error && (
            <div className="mt-10 text-center text-gray-600">
              ⚠️ No quiz available for your badge at this time.
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}

export default ViewQuizPage;