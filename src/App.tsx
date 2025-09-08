// App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AuthInitializer from './components/AuthInitializer';
import CustomToastContainer from './components/ui/CustomToastContainer';
import { PrivateRoute } from './components/PrivateRoute';
import Contact from './components/Contact';
import Feed from './pages/Feed';
import ProfileView from './pages/ProfileView';
import ProfileEdit from './pages/ProfileEdit';
import AccountSettings from './pages/AccountSettings';
import CreatePostPage from './pages/posts/CreatePostPage';

const App = () => {
  return (
    <>
      <Router>
        <AuthInitializer>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/contact" element={<Contact />} />

            {/* Agrupamento das rotas privadas */}
            <Route element={<PrivateRoute />}>
              <Route path="/feed" element={<Feed />} />
              <Route
                path="posts/create/:categoryId"
                element={<CreatePostPage />}
              />
              <Route path="/profile" element={<ProfileView />} />
              <Route path="/profile/edit" element={<ProfileEdit />} />
              <Route path="/profile/edit" element={<ProfileEdit />} />
              <Route path="/account-settings" element={<AccountSettings />} />
            </Route>
          </Routes>
        </AuthInitializer>
      </Router>
      <CustomToastContainer />
    </>
  );
};

export default App;
