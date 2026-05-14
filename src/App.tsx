import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './features/public/Home';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import CoachesDirectory from './features/coaches/CoachesDirectory';
import CoachProfileEditPage from './features/dashboard/CoachProfileEditPage';
import CoachDetailPage from './features/coaches/CoachDetailPage';
import CreateLessonPackagePage from './features/dashboard/CreateLessonPackagePage';
import CoachDashboard from './features/dashboard/CoachDashboard';
import PublicRoute from './components/PublicRoute';
import StudentDashboard from './features/dashboard/StudentDashboard';
import UpdateLessonPackagePage from './features/dashboard/UpdateLessonPackagePage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Layout />}>

          {/* Home */}
          <Route index element={<Home />} />

          {/* Public Directory */}
          <Route path="coaches" element={<CoachesDirectory />} />

          {/* GUEST ONLY ROUTES: Logged-in users cannot enter here */}
          <Route element={<PublicRoute />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="coaches/dashboard" element={<CoachDashboard />} />
            <Route path="coaches/:id" element={<CoachDetailPage />} />
            <Route path="coaches/profile/edit" element={<CoachProfileEditPage />} />
            <Route path = "coaches/dashboard/create-package" element={<CreateLessonPackagePage />} />
            <Route path = "student/dashboard" element={<StudentDashboard />} />
            <Route path = "coaches/dashboard/update-package/:id" element={<UpdateLessonPackagePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;

