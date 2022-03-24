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
