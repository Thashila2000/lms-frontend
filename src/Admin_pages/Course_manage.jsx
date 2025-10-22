import { useState } from "react";
import AdminNavbar from "../Components/Admin_navbar";
import CourseForm from "../Components/CourseForm";
import CourseList from "../Components/CourseList";

export default function AdminPage() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [refreshCourses, setRefreshCourses] = useState(() => () => {});
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <AdminNavbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="flex flex-col items-center mt-20 ml-64 space-y-6">
        <CourseForm
          existingCourse={selectedCourse}
          onSave={() => {
            setSelectedCourse(null);
            setTimeout(() => refreshCourses(), 0);
          }}
        />
        <CourseList
          onEdit={setSelectedCourse}
          onReady={(fn) => setRefreshCourses(() => fn)}
          searchQuery={searchQuery}
        />
      </div>
    </>
  );
}