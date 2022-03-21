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
import ResetPass from '@pages/Login/ResetPass';
import RegisterSuccess from '@pages/Register/RegisterSuccess';
import AccountInfo from '@pages/Account/AccountInfo';
import ChangePass from '@pages/Account/AccountInfo/ChangePass';
import AddressBook from '@pages/Account/AddressBook';

const routeList: {
  label: string;
  path: string;
  component?: JSX.Element;
  protected?: boolean;
}[] = [
  {
    label: 'notFound',
    path: '/404',
    component: <NotFound />,
    protected: false,
  },
  {
    label: 'home',
    path: '/home',
    component: <Home />,
    protected: false,
  },
  {
    label: 'login',
    path: '/login',
    component: <Login />,
    protected: false,
  },
  {
    label: 'forgotPass',
    path: '/forgot_pass',
    component: <ForgotPass />,
    protected: false,
  },
  {
    label: 'checkEmail',
    path: '/check_email',
    component: <CheckEmail />,
    protected: false,
  },
  {
    label: 'resetPass',
    path: '/pass_reset',
    component: <ResetPass />,
    protected: false,
  },
  {
    label: 'register',
    path: '/register',
    component: <Register />,
    protected: false,
  },
  {
    label: 'registerSuccess',
    path: '/register/success',
    component: <RegisterSuccess />,
    protected: false,
    },
  {
    label: 'item',
    path: '/item/:id',
    component: <ItemDetails />,
    protected: false,
  },
  {
    label: 'searchItem',
    path: '/item/search',
    component: <SearchItem />,
    protected: false,
  },
  {
    label: 'cart',
    path: '/cart',
    component: <Cart />,
    protected: false,
  },
  {
    label: 'about',
    path: '/about',
    component: <AboutUs />,
    protected: false,
  },
  {
    label: 'contact',
    path: '/contact',
    component: <ContactUs />,
    protected: false,
  },
  {
    label: 'addressBook',
    path: '/account/address',
    component: <AddressBook />,
    protected: true,
  },
  {
    label: 'accountInfo',
    path: '/account/info',
    component: <AccountInfo />,
    protected: true,
  },
  {
    label: 'changePass',
    path: '/account/change_pass',
    component: <ChangePass />,
    protected: true,
  },

  {
    label: 'logout',
    path: '/home',
    protected: false,
  },
  {
    label: 'root',
    path: '/',
    protected: false,
  },
];

export default routeList;
