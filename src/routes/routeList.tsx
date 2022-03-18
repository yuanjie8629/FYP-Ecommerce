import Home from '@pages/Home';
import NotFound from '@pages/NotFound/NotFound';
import ItemDetails from '@pages/Item/ItemDetails';
import SearchItem from '@pages/Item/SearchItem';
import Cart from '@pages/Cart';
import Login from '@pages/Login';
import Register from '@pages/Register';
import ForgotPass from '@pages/Login/ForgotPass';
import CheckEmail from '@pages/Login/CheckEmail';
import AboutUs from '@pages/AboutUs';
import ContactUs from '@pages/ContactUs';

const routeList: {
  label: string;
  path: string;
  component?: JSX.Element;
}[] = [
  {
    label: 'notFound',
    path: '/404',
    component: <NotFound />,
  },
  {
    label: 'home',
    path: '/home',
    component: <Home />,
  },
  {
    label: 'login',
    path: '/login',
    component: <Login />,
  },
  {
    label: 'forgotPass',
    path: '/forgotPass',
    component: <ForgotPass />,
  },
  {
    label: 'checkEmail',
    path: '/checkEmail',
    component: <CheckEmail />,
  },
  {
    label: 'register',
    path: '/register',
    component: <Register />,
  },
  {
    label: 'item',
    path: '/item/:id',
    component: <ItemDetails />,
  },
  {
    label: 'searchItem',
    path: '/item/search',
    component: <SearchItem />,
  },
  {
    label: 'cart',
    path: '/cart',
    component: <Cart />,
  },
  {
    label: 'about',
    path: '/about',
    component: <AboutUs />,
  },
  {
    label: 'contact',
    path: '/contact',
    component: <ContactUs />,
  },
  {
    label: 'logout',
    path: '/home',
  },
  {
    label: 'root',
    path: '/',
  },
];

export default routeList;
