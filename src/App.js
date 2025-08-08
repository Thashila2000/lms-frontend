import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminHomePage from './Admin_pages/Admin_home';
import Students from './Admin_pages/Students';


function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/admin_home" element={<AdminHomePage />} />
        <Route path="/students" element={<Students />} />
      </Routes>
    </Router>

    </div>
  );
}

export default App;
