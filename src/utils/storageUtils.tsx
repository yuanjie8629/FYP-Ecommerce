import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

export const getUserId = () => {
  let tkn: any = Cookies.get('access_token')
    ? jwtDecode(Cookies.get('access_token'))
    : null;
  return tkn?.user_id;
};

export const getUserEmail = () => {
  let tkn: any = Cookies.get('access_token')
    ? jwtDecode(Cookies.get('access_token'))
    : null;
  return tkn?.email;
};

export const setExp = (exp: number) => {
  window.localStorage.setItem('exp', String(exp));
};

export const getSessionExp = (): number =>
  parseInt(window.localStorage.getItem('exp'));

export const clearStorage = () => {
  window.localStorage.clear();
};

export const addStorageItem = (key: string, value: string) => {
  window.localStorage.setItem(key, value);
};

export const removeStorageItem = (key: string) => {
  window.localStorage.removeItem(key);
};

export const addItemToCart = (id, quantity) => {
  if (localStorage.getItem('cart')) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    let matchedItem = cart.find((cartItem) => cartItem.id === id);
    if (matchedItem) {
      cart = cart.filter((cartItem) => cartItem.id !== id);
      cart = [...cart, { id: id, quantity: quantity + matchedItem.quantity }];
    } else {
      cart = [...cart, { id: id, quantity: quantity }];
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  } else {
    localStorage.setItem(
      'cart',
      JSON.stringify([{ id: id, quantity: quantity }])
    );
  }
};

export const addQuantityToCart = (id, quantity) => {
  let cart = JSON.parse(localStorage.getItem('cart'));
  cart = [...cart, { id: id, quantity: quantity }];
  localStorage.setItem(cart, JSON.stringify(cart));
};
