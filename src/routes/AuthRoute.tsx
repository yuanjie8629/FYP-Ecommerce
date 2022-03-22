import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { checkURL, findRoutePath } from '@utils/routingUtils';
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

  if (
    !(
      access ||
      notProtectedRoute.includes(checkURL(location.pathname)) ||
      location.pathname === '/404'
    )
  ) {
    setCart([]);
    return (
      <Navigate to={findRoutePath('home')} state={{ from: location }} replace />
    );
  }

  return <Outlet />;
};

export default AuthRoute;
