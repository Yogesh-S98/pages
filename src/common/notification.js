import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const successNotification = (value, time = 5000) => {
    toast.success(value, {
        position: "top-right",
        autoClose: time,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
    });
}

export const errorNotification = (value, time = 5000) => {
    toast.error(value, {
        position: "top-right",
        autoClose: time,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
    });
}