import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

const Home = () => <h1 className="text-3xl font-bold">Welcome to MeetInSport</h1>;
const Login = () => <h1 className="text-3xl font-bold">Login Page</h1>;
const Register = () => <h1 className="text-3xl font-bold">Register Page</h1>;
const BrowseCoaches = () => <h1 className="text-3xl font-bold">Browse Coaches</h1>;
const Dashboard = () => <h1 className="text-3xl font-bold text-green-600">Secure Dashboard (You are logged in!)</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="coaches" element={<BrowseCoaches />} />
        
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;

