import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaClipboardList } from 'react-icons/fa';
import Toast from '../Components/Toast';

const AddOnlineQuiz = ({ badgeSlug }) => {
  const [quiz, setQuiz] = useState({
    badgeSlug: badgeSlug || "",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    questions: [],
  });

  const [toast, setToast] = useState({ message: "", type: "info" });

  useEffect(() => {
    if (badgeSlug) setQuiz(prev => ({ ...prev, badgeSlug }));
  }, [badgeSlug]);

  const handleAddQuestion = () => {
    setQuiz(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0 },
      ],
    }));
  };

  const handleDeleteQuestion = (index) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleQuizChange = (field, value) => {
    setQuiz(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...quiz.questions];
    updated[index][field] = value;
    setQuiz(prev => ({ ...prev, questions: updated }));
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...quiz.questions];
    updated[qIndex].options[optIndex] = value;
    setQuiz(prev => ({ ...prev, questions: updated }));
  };

  const validateQuiz = () => {
    if (!quiz.title.trim()) { setToast({ message: "❌ Quiz title is required.", type: "error" }); return false; }
    if (!quiz.description.trim()) { setToast({ message: "❌ Quiz description is required.", type: "error" }); return false; }
    if (!quiz.startTime || !quiz.endTime) { setToast({ message: "❌ Start and end time are required.", type: "error" }); return false; }
    if (quiz.questions.length === 0) { setToast({ message: "❌ Add at least one question.", type: "error" }); return false; }

    for (let i = 0; i < quiz.questions.length; i++) {
      const q = quiz.questions[i];
      if (!q.questionText.trim()) { setToast({ message: `❌ Question ${i + 1} text is required.`, type: "error" }); return false; }
      if (!q.options.every(opt => opt.trim() !== "")) { setToast({ message: `❌ All options for question ${i + 1} are required.`, type: "error" }); return false; }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateQuiz()) return;

    const payload = {
      badgeSlug: quiz.badgeSlug,
      title: quiz.title,
      description: quiz.description,
      startTime: quiz.startTime,
      endTime: quiz.endTime,
      questions: quiz.questions.map(q => ({
        question: q.questionText,
        type: "MCQ",
        options: q.options,
        correctAnswer: q.options[q.correctAnswerIndex],
      })),
    };

    try {
      await axios.post("http://localhost:8080/api/online-quizzes", payload);
      setToast({ message: "✅ Quiz created successfully!", type: "success" });
      setQuiz({ badgeSlug, title: "", description: "", startTime: "", endTime: "", questions: [] });
    } catch (err) {
      console.error(err);
      setToast({ message: "❌ Failed to create quiz.", type: "error" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl px-6 py-10 mx-auto"
    >
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "info" })} />

      <h2 className="mb-10 text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
        <FaClipboardList className="inline-block mr-2 text-indigo-600" />
        Create Quiz — {badgeSlug}
      </h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="p-8 border shadow-xl rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-100 bg-white/80 backdrop-blur-md"
      >
        {/* Inputs */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="col-span-2">
            <label className="font-semibold text-gray-700">Quiz Title</label>
            <input type="text" value={quiz.title} onChange={(e) => handleQuizChange("title", e.target.value)}
              className="w-full px-4 py-3 mt-1 border rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="col-span-2">
            <label className="font-semibold text-gray-700">Description</label>
            <textarea value={quiz.description} onChange={(e) => handleQuizChange("description", e.target.value)}
              className="w-full px-4 py-3 mt-1 border rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Start Time</label>
            <input type="datetime-local" value={quiz.startTime} onChange={(e) => handleQuizChange("startTime", e.target.value)}
              className="w-full px-4 py-3 mt-1 border rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">End Time</label>
            <input type="datetime-local" value={quiz.endTime} onChange={(e) => handleQuizChange("endTime", e.target.value)}
              className="w-full px-4 py-3 mt-1 border rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        {/* Questions */}
        <div className="mt-10 space-y-8">
          {quiz.questions.map((q, qIndex) => (
            <motion.div key={qIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="relative p-6 border shadow-md rounded-xl bg-gradient-to-br from-white via-indigo-50 to-purple-50"
            >
              <button onClick={() => handleDeleteQuestion(qIndex)}
                className="absolute px-2 py-1 text-white bg-red-500 rounded-md top-3 right-3 hover:bg-red-600"
              >
                🗑 Remove
              </button>

              <input type="text" value={q.questionText} placeholder={`Question ${qIndex + 1}`}
                onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
                className="w-full px-4 py-2 mb-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400"
              />

              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="flex items-center gap-3 mb-2">
                  <input type="radio" name={`correct-${qIndex}`} checked={q.correctAnswerIndex === optIndex}
                    onChange={() => handleQuestionChange(qIndex, "correctAnswerIndex", optIndex)}
                  />
                  <input type="text" value={opt} placeholder={`Option ${optIndex + 1}`}
                    onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mt-10"
        >
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleAddQuestion}
            className="px-5 py-3 font-semibold text-white rounded-lg shadow-md bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl"
          >
            ➕ Add Question
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSubmit}
            className="px-6 py-3 font-semibold text-white rounded-lg shadow-md bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-xl"
          >
            ✅ Submit Quiz
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AddOnlineQuiz;
