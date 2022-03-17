import routeList from '@routes/routeList';

export const findRoutePath = (label: string) => {
  let route = routeList.find((route) => route.label === label);
  return route?.path === undefined ? '404' : route.path;
};

export const findRouteLabel = (path: string) => {
  let route = routeList.find((route) => route.path === path);
  return route?.label === undefined ? '404' : route.label;
};

export const checkURL = (url: string) => {
  let splitURL = url.split('/').filter((url) => url);
  if (splitURL[splitURL.length - 1] === '') splitURL.pop();

  if (new RegExp(/\d/g).test(splitURL[splitURL.length - 1])) {
    splitURL[splitURL.length - 1] =
      splitURL[splitURL.length - 1].replace(/\d/g, '') + ':id';
  }
  return `/${splitURL.join('/')}`;
};
