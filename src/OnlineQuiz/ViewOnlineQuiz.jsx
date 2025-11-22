import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import StudentNavbar from "../Components/StudentNavbar";

const ViewOnlineQuiz = () => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  const studentIndex = localStorage.getItem("studentIndex");

  useEffect(() => {
    if (!studentIndex) {
      setMessage("❌ Please log in to access the quiz.");
      return;
    }

    const fetchQuiz = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/online-quizzes/student/${studentIndex}`
        );

        if (res.ok) {
          const data = await res.json();

          // Already submitted
          if (data.submitted) {
            setSubmitted(true);
            setMessage(data.message || "You have already submitted this quiz");
            setQuiz(null);
            return;
          }

          // Quiz available
          const quizData = data.quiz;
          if (!quizData) {
            setMessage("⚠️ No quiz data available.");
            return;
          }

          // Normalize questions
          const normalizedQuestions = (quizData.questions || []).map((q) => ({
            question: q.question || q.questionText,
            type: (q.type || "text").toLowerCase(),
            options: q.options || [],
            correctAnswer: q.correctAnswer || "",
          }));

          setQuiz({ ...quizData, questions: normalizedQuestions });
        } else {
          setMessage("⚠️ No active quiz found.");
        }
      } catch (err) {
        console.error(err);
        setMessage("❌ Error fetching quiz.");
      }
    };

    fetchQuiz();
  }, [studentIndex]);

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { studentIndex, answers };
      const res = await fetch("http://localhost:8080/api/online-quizzes/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setResult({ ...data.result, studentAnswers: answers });
        setSubmitted(true);
        if (quiz?.id) localStorage.setItem("lastSubmittedQuizId", quiz.id);
      } else {
        const errData = await res.json();
        setMessage(errData.error || "⚠️ Submission failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Submission failed.");
    }
  };

  if (message) {
    return (
      <div className="min-h-screen pt-24 text-center bg-white">
        <StudentNavbar />
        <p className="text-gray-700">{message}</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen pt-24 text-center bg-white">
        <StudentNavbar />
        <p className="text-gray-600">⏳ Loading quiz...</p>
      </div>
    );
  }

  return (
    <>
      <StudentNavbar />
      <div className="min-h-screen px-6 pt-24 pb-16 bg-gradient-to-br from-white via-indigo-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md"
        >
          <h2 className="mb-6 text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            {quiz.title}
          </h2>

          {quiz.questions.length === 0 && (
            <p className="text-center text-gray-500">No questions available.</p>
          )}

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {quiz.questions.map((q, index) => (
                <div key={index} className="p-4 border rounded-md shadow-sm bg-gray-50">
                  <p className="mb-3 font-semibold text-gray-800">
                    {index + 1}. {q.question}
                  </p>

                  {q.type === "mcq" && q.options.length > 0 ? (
                    q.options.map((opt, i) => (
                      <label key={i} className="flex items-center mb-2">
                        <input
                          type="radio"
                          name={`q${index}`}
                          value={opt}
                          checked={answers[index] === opt}
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                          className="mr-2"
                        />
                        {opt}
                      </label>
                    ))
                  ) : (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Your answer"
                      value={answers[index] || ""}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                    />
                  )}
                </div>
              ))}

              {quiz.questions.length > 0 && (
                <div className="flex justify-center mt-6">
                  <button
                    type="submit"
                    className="px-6 py-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Submit Quiz
                  </button>
                </div>
              )}
            </form>
          ) : (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-center text-green-700">
                ✅ Quiz Submitted Successfully!
              </h3>
              <p className="text-center text-gray-700">
                Your Score:{" "}
                <span className="font-bold text-indigo-600">
                  {result?.score} / {quiz.questions.length}
                </span>
              </p>

              {quiz.questions.map((q, index) => {
                const studentAnswer = result?.studentAnswers?.[index];
                const isCorrect = studentAnswer === q.correctAnswer;

                return (
                  <div
                    key={index}
                    className={`p-4 border rounded-md ${
                      isCorrect
                        ? "border-green-400 bg-green-50"
                        : "border-red-400 bg-red-50"
                    }`}
                  >
                    <p className="font-semibold text-gray-800">
                      {index + 1}. {q.question}
                    </p>
                    <p className="mt-2">
                      <span className="font-medium">Your Answer:</span> {studentAnswer || "—"}
                    </p>
                    <p className="mt-1">
                      <span className="font-medium">Correct Answer:</span> {q.correctAnswer}
                    </p>
                    {isCorrect ? (
                      <FaCheckCircle className="mt-2 text-green-600" />
                    ) : (
                      <FaTimesCircle className="mt-2 text-red-600" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ViewOnlineQuiz;
