import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import CustomToastContainer from './components/ui/CustomToastContainer';
import AuthInitializer from './components/AuthInitializer';

const App = () => {
  return (
    <>
      <Router>
        <AuthInitializer>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </AuthInitializer>
      </Router>
      <CustomToastContainer />
    </>
  );
};

export default App;
