const routeRedirectList: {
  path: string;
  redirect: string;
}[] = [
  { path: '*', redirect: '/404' },
  { path: '/', redirect: '/home' },
];

export default routeRedirectList;
