import Home from '@pages/Home';
import NotFound from '@pages/NotFound/NotFound';
import ItemDetails from '@pages/Item/ItemDetails';
import SearchItem from '@pages/Item/SearchItem';

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
    label: 'item',
    path: '/item/:id',
    component: <ItemDetails />,
  },
  {
    label: 'searchItem',
    path: '/item/search',
    component: <SearchItem />,
  },
];

export default routeList;