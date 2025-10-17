import AdminNavbar from '../Components/Admin_navbar';
import CourseForm from '../Components/CourseForm';
import CourseList from '../Components/CourseList';

export default function AdminPage() {
  return (
    
      <>
      <AdminNavbar />
      <div className="flex flex-col items-center mt-20 ml-64 space-y-6">

  <CourseForm />
  <CourseList />
</div>
    </>

  );
}