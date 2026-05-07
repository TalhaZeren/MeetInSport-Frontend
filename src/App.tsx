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




const Dashboard = () => <h1 className="text-3xl font-bold text-green-600">Secure Dashboard </h1>;
function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Layout />}>

          {/* Auth */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Public Directory */}
          <Route path="coaches" element={<CoachesDirectory />} />


          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="coaches/:id" element={<CoachDetailPage />} />
            <Route path="coaches/profile/edit" element={<CoachProfileEditPage />} />
            <Route path = "dashboard/create-package" element={<CreateLessonPackagePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;

