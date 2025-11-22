import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    if (badgeSlug) {
      setQuiz(prev => ({ ...prev, badgeSlug }));
    }
  }, [badgeSlug]);

  const handleAddQuestion = () => {
    setQuiz(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 },
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
    if (!quiz.title.trim()) {
      setToast({ message: "❌ Quiz title is required.", type: "error" });
      return false;
    }
    if (!quiz.description.trim()) {
      setToast({ message: "❌ Quiz description is required.", type: "error" });
      return false;
    }
    if (!quiz.startTime || !quiz.endTime) {
      setToast({ message: "❌ Start and end time are required.", type: "error" });
      return false;
    }
    if (quiz.questions.length === 0) {
      setToast({ message: "❌ Quiz must have at least one question.", type: "error" });
      return false;
    }
    for (let i = 0; i < quiz.questions.length; i++) {
      const q = quiz.questions[i];
      if (!q.questionText.trim()) {
        setToast({ message: `❌ Question ${i + 1} text is required.`, type: "error" });
        return false;
      }
      if (!q.options.every(opt => opt.trim() !== "")) {
        setToast({ message: `❌ All options for question ${i + 1} are required.`, type: "error" });
        return false;
      }
      if (q.correctAnswerIndex === null || q.correctAnswerIndex >= q.options.length) {
        setToast({ message: `❌ Select a correct answer for question ${i + 1}.`, type: "error" });
        return false;
      }
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
        type: 'MCQ',
        options: q.options,
        correctAnswer: q.options[q.correctAnswerIndex],
      })),
    };

    try {
      await axios.post('http://localhost:8080/api/online-quizzes', payload);
      setToast({ message: "✅ Quiz created successfully!", type: "success" });
      setQuiz({ badgeSlug, title: '', description: '', startTime: '', endTime: '', questions: [] });
    } catch (err) {
      console.error(err.response?.data || err.message);
      setToast({ message: "❌ Failed to create quiz.", type: "error" });
    }
  };

  return (
    <div className="max-w-5xl px-6 py-10 mx-auto">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "info" })} />

      <h2 className="mb-6 text-3xl font-bold text-center text-indigo-600">
        Create New Quiz for {badgeSlug}
      </h2>

      {/* Quiz Title, Description, Start/End */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Quiz Title"
          value={quiz.title}
          onChange={e => handleQuizChange('title', e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
        <textarea
          placeholder="Quiz Description"
          value={quiz.description}
          onChange={e => handleQuizChange('description', e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
        <div className="flex gap-4">
          <input
            type="datetime-local"
            value={quiz.startTime}
            onChange={e => handleQuizChange('startTime', e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="datetime-local"
            value={quiz.endTime}
            onChange={e => handleQuizChange('endTime', e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
      </div>

      {/* Questions */}
      <div className="mt-8 space-y-6">
        {quiz.questions.map((q, qIndex) => (
          <div key={qIndex} className="relative p-4 border rounded shadow-sm bg-gray-50">
            <button
              onClick={() => handleDeleteQuestion(qIndex)}
              className="absolute px-2 py-1 text-sm text-white bg-red-500 rounded top-2 right-2 hover:bg-red-600"
            >
              🗑 Delete
            </button>
            <input
              type="text"
              placeholder={`Question ${qIndex + 1}`}
              value={q.questionText}
              onChange={e => handleQuestionChange(qIndex, 'questionText', e.target.value)}
              className="w-full px-3 py-2 mb-4 border rounded"
            />
            {q.options.map((opt, optIndex) => (
              <div key={optIndex} className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name={`correct-${qIndex}`}
                  checked={q.correctAnswerIndex === optIndex}
                  onChange={() => handleQuestionChange(qIndex, 'correctAnswerIndex', optIndex)}
                />
                <input
                  type="text"
                  placeholder={`Option ${optIndex + 1}`}
                  value={opt}
                  onChange={e => handleOptionChange(qIndex, optIndex, e.target.value)}
                  className="w-full px-3 py-1 border rounded"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleAddQuestion}
          className="px-4 py-2 text-white bg-indigo-500 rounded hover:bg-indigo-600"
        >
          ➕ Add Question
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          ✅ Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default AddOnlineQuiz;
