import AdminNavbar from "../Components/Admin_navbar";

export default function AdminHomePage() {
  return (
   
    <div className="min-h-screen bg-gray-100">
    
      <AdminNavbar />

      {/* Main Content Area */}
      <div className="flex pt-16">
      <div className="flex-1 p-6 ml-64">
      <h1 className="text-2xl font-bold text-gray-800">Welcome to Admin Dashboard</h1>
     

        </div>
      </div>
    </div>
  );
}