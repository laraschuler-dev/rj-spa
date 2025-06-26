import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomToastContainer = () => (
  <ToastContainer
    position="top-center"
    autoClose={4000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    pauseOnHover
    draggable
    theme="colored"
    toastClassName="text-base md:text-lg font-medium rounded-lg shadow-lg"
    className="px-3 py-2"
  />
);

export default CustomToastContainer;
