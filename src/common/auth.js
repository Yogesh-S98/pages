import { useNavigate } from 'react-router-dom';

const NavigateRoute = (path) => {
  const navigate = useNavigate();
  return () => navigate(path);
};

export default NavigateRoute;