import React from "react";
import AddResultForm from "../Components/AddResultsForm";

const BadgeManage = () => {
  const handleResultSubmit = (data) => {
    console.log("Submitted Result:", data);
    // TODO: Send to backend or update state
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100">
      <AddResultForm onSubmit={handleResultSubmit} />
    </div>
  );
};

export default BadgeManage;