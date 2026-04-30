import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './features/public/Home';
import Login from './features/auth/Login';
import Register from './features/auth/Register';



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

