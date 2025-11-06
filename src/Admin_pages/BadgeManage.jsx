import React, { useEffect } from "react";
import AddResultForm from "../Components/AddResultsForm";
import AddSchedule from "../Components/Add_schedule";
import AddQuiz from "../Components/AddQuiz";

const BadgeManage = () => {
  const handleResultSubmit = (data) => {
    console.log("Submitted Result:", data);
    // TODO: Send to backend or update state
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen px-4 py-10 mt-20 ml-64 bg-white">
      <div className="flex flex-col gap-6">
        {/* Full Width: AddSchedule */}
        <div className="w-full p-6 shadow-md bg-white/80 rounded-xl">
          <div className="ml-[-200px] mt-[-60px]">
            <AddSchedule />
          </div>
        </div>

        {/* Side-by-side: AddQuiz + AddResultForm */}
        <div className="grid grid-cols-2 gap-6 mt-5">
          {/* Left: AddQuiz */}
          <div className="shadow-md bg-white/80 rounded-xl" style={{ height: "500px" }}>
            <div className="flex flex-col justify-start h-full p-6 overflow-y-auto">
              <AddQuiz />
            </div>
          </div>

          {/* Right: AddResultForm */}
          <div className="shadow-md bg-white/80 rounded-xl " style={{ height: "600px" }}>
            <div className="flex flex-col justify-start h-full p-6 overflow-y-auto ">
              <AddResultForm onSubmit={handleResultSubmit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeManage;