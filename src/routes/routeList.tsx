import Home from '@pages/Home';
import NotFound from '@pages/NotFound/NotFound';
import ItemDetails from '@pages/Item/ItemDetails';
import SearchItem from '@pages/Item/SearchItem';
import Cart from '@pages/Cart';
import AboutUs from '@pages/AboutUs';
import ContactUs from '@pages/ContactUs';
import AccountInfo from '@pages/Account/AccountInfo';
import AddressBook from '@pages/Account/AddressBook';
import PosReg from '@pages/PosReg';
import Checkout from '@pages/Checkout';
import PaymentSuccess from '@pages/Payment/PaymentSuccess';
import PaymentCancel from '@pages/Payment/PaymentCancel';
import OrderSearch from '@pages/Order/OrderSearch';
import OrderHistory from '@pages/Order/OrderHistory';
import OrderDetails from '@pages/Order/OrderDetails';
import ResetPass from '@pages/Login/ResetPass';

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
    label: 'checkout',
    path: '/checkout',
    component: <Checkout />,
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
    label: 'posReg',
    path: '/position/registration',
    component: <PosReg />,
    protected: false,
  },
  {
    label: 'paymentSuccess',
    path: '/payment/success',
    component: <PaymentSuccess />,
    protected: false,
  },
  {
    label: 'paymentCancel',
    path: '/payment/cancel',
    component: <PaymentCancel />,
    protected: false,
  },
  {
    label: 'orderHistory',
    path: '/order/history',
    component: <OrderHistory />,
    protected: true,
  },
  {
    label: 'orderSearch',
    path: '/order/search',
    component: <OrderSearch />,
    protected: false,
  },
  {
    label: 'orderDetails',
    path: '/order/:id',
    component: <OrderDetails />,
    protected: false,
  },
  {
    label: 'resetPass',
    path: '/pass_reset',
    protected: false,
    component: <ResetPass />,
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
