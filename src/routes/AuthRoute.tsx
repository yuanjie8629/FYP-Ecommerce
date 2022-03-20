import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { findRoutePath } from '@utils/routingUtils';
import Cookies from 'js-cookie';
import routeList from './routeList';
import { useContext } from 'react';
import { CartContext } from '@contexts/CartContext';

const AuthRoute = (_props) => {
  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cart, setCart] = useContext(CartContext);
  const notProtectedRoute = routeList
    .filter((route) => route.protected === false)
    .map((filteredRoute) => filteredRoute.path);
  const access = Cookies.get('access_token');
  if (!(access || notProtectedRoute.includes(location.pathname))) {
    setCart([]);
    return (
      <Navigate
        to={findRoutePath('login')}
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default AuthRoute;
