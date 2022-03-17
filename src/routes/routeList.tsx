import Home from "@pages/Home";
import Login from "@pages/Login/Login";
import NotFound from "@pages/NotFound/NotFound";

const routeList: {
  label: string;
  path: string;
  component?: JSX.Element;
}[] = [
  {
    label: 'notFound',
    path: '/404',
    component: <NotFound />,
  },{
    label: 'login',
    path: '/login',
    component: <Login />,
    },
    {
      label: 'home',
      path: '/home',
      component: <Home />,
    },
  
];

export default routeList;
