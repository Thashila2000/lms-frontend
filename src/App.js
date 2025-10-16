import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminHomePage from './Admin_pages/Admin_home';
import Students from './Admin_pages/Students';
import ClassroomsPage from './Admin_pages/Classroom';
import AirQuality from './Admin_pages/AirQuality';
import Light_Control from './Admin_pages/Light';
import LightControl from './Components/LightControl';
import ClassroomDetailsPage from "./Admin_pages/ClassRoomDetails";
import DoorControl from "./Admin_pages/DoorLock";
import SmartControl from './Admin_pages/SmartControl';
import StudentTracking from './Admin_pages/StudentTracking';
import Lms_Home from './Student_pages/Lms_Home';
import AddSchedule from './Components/Add_schedule';
import ViewSchedule from './Components/View_Schedule';





function App() {
  return (
    <div>
    <Router>
      <Routes>
        //Admin pages
        <Route path="/admin_home" element={<AdminHomePage />} />
        <Route path="/students" element={<Students />} />
        <Route path="/classrooms" element={<ClassroomsPage />} />
        <Route path="/airquality/:slug" element={<AirQuality />} />
        
        <Route path="/light-control/:slug" element={<Light_Control />} />
        
        <Route path="/lightcontrol/:slug" element={<LightControl />} />
        <Route path="/classroomdetails/:slug" element={<ClassroomDetailsPage />} />
        <Route path="/doorcontrol/:slug" element={<DoorControl />} />
        <Route path="/smartcontrol/:slug" element={<SmartControl />} />
        <Route path="/studenttracking/:slug" element={<StudentTracking />} />
        <Route path="/add_schedule" element={<AddSchedule />} />

        //Student pages
         
           <Route path="/" element={<Lms_Home />} />
           
      
        

      </Routes>
    </Router>

    </div>
  );
}

export default App;
