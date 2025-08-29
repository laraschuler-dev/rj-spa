// App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CreateDonationPost from './pages/posts/CreateDonationPost';
import AuthInitializer from './components/AuthInitializer';
import CustomToastContainer from './components/ui/CustomToastContainer';
import { PrivateRoute } from './components/PrivateRoute';
import CreateComplaintPost from './pages/posts/CreateComplaintPost';
import CreateCampaignPost from './pages/posts/CreateCampaignPost';
import CreateHelpRequestPost from './pages/posts/CreateHelpRequestPost';
import CreateVolunteerPost from './pages/posts/CreateVolunteerPost';
import CreateCoursePost from './pages/posts/CreateCoursePost';
import CreateJobPost from './pages/posts/CreateJobPost';
import CreateEventPost from './pages/posts/CreateEventPost';
import CreateGeneralPost from './pages/posts/CreateGeneralPost';
import Contact from './components/Contact';
import Feed from './pages/Feed';
import ProfileView from './pages/ProfileView';
import ProfileEdit from './pages/ProfileEdit';
import AccountSettings from './pages/AccountSettings';
import PostDetailsPage from './pages/PostDetailsPage';

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
              <Route path="/posts/donation" element={<CreateDonationPost />} />
              <Route
                path="/posts/complaint"
                element={<CreateComplaintPost />}
              />
              <Route path="/posts/campaign" element={<CreateCampaignPost />} />
              <Route path="/posts/help" element={<CreateHelpRequestPost />} />
              <Route
                path="/posts/volunteer"
                element={<CreateVolunteerPost />}
              />
              <Route path="/posts/course" element={<CreateCoursePost />} />
              <Route path="/posts/job" element={<CreateJobPost />} />
              <Route path="/posts/event" element={<CreateEventPost />} />
              <Route path="/posts/general" element={<CreateGeneralPost />} />
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
