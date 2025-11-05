import React, { useEffect } from "react";
import AddResultForm from "../Components/AddResultsForm";
import AddSchedule from "../Components/Add_schedule";

const BadgeManage = () => {
  const handleResultSubmit = (data) => {
    console.log("Submitted Result:", data);
    // TODO: Send to backend or update state
  };

  // Scroll to top on page load
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

        {/* Full Width: AddResultForm (Marks) */}
        <div className="w-full p-6 shadow-md bg-white/80 rounded-xl">
          <div className="ml-[-250px]">
            <AddResultForm onSubmit={handleResultSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeManage;