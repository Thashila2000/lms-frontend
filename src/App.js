import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminHomePage from './Admin_pages/Admin_home';
import Students from './Admin_pages/Students';
import ClassroomsPage from './Admin_pages/Classroom';
import AirQuality from './Admin_pages/AirQality';
import Light_Control from './Admin_pages/Light';




function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/admin_home" element={<AdminHomePage />} />
        <Route path="/students" element={<Students />} />
        <Route path="/classrooms" element={<ClassroomsPage />} />
        <Route path="/classrooms/:slug" element={<AirQuality />} />
        <Route path="/light-control/:slug" element={<Light_Control />} />

        

      </Routes>
    </Router>

    </div>
  );
}

export default App;
