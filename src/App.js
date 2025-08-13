import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminHomePage from './Admin_pages/Admin_home';
import Students from './Admin_pages/Students';
import ClassroomsPage from './Admin_pages/Classroom';
import ClassroomDetailsPage from './Admin_pages/ClassroomDetails';



function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/admin_home" element={<AdminHomePage />} />
        <Route path="/students" element={<Students />} />
        <Route path="/classrooms" element={<ClassroomsPage />} />
        <Route path="/classrooms/:id" element={<ClassroomDetailsPage />} />

      </Routes>
    </Router>

    </div>
  );
}

export default App;
