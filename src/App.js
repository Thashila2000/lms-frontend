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
import Dashboard from './Student_pages/Dashboard';
import AddSchedule from './Components/Add_schedule';
import CourseManage from './Admin_pages/Course_manage';
import LandingPage from './Student_pages/Landing_Page';
import LogInPage from './Student_pages/LogInPage';
import Register from './Admin_pages/Register';

import BadgeManage from './Admin_pages/BadgeManage';
import StudentResultDisplay from './Student_pages/StudentResultDisplay';
import OnlineCourseDisplay from './Landing_page_pages/OnlineCourseDisplay';
import ManageDegreesWrapper from './Admin_pages/ManageDegreesWrapper';
import ViewQuizPage from './Student_pages/ViewQuiz';

import ViewOnlineQuiz from './OnlineQuiz/ViewOnlineQuiz';
import QuizList from './OnlineQuiz/QuizList';


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
        <Route path="/manage_courses" element={<CourseManage />} />
        <Route path="/manage_degrees" element={<ManageDegreesWrapper />} />
        <Route path="/manage_badge/:slug" element={<BadgeManage/>} />


        //Student pages
         
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LogInPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/results" element={<StudentResultDisplay />} />
            <Route path="/quizzes" element={<ViewQuizPage />} />
            {/* Quiz list page */}
           <Route path="/quiz_list" element={<QuizList />} />

           {/* View a single quiz by ID */}
           <Route path="/quiz/:quizId" element={<ViewOnlineQuiz />} />



         //Landing Page's pages   

             <Route path="/online_courses" element={<OnlineCourseDisplay />} />
            

             
             

           
      
        

      </Routes>
    </Router>

    </div>
  );
}

export default App;