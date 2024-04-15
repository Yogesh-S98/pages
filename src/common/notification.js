import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const successNotification = (value) => {
    toast.success(value, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
    });
}

export const errorNotification = (value) => {
    toast.error(value, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
    });
}