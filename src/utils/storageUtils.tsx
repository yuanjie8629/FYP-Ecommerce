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

// export const addItemToCart = (data, setCart) => {
//   if (localStorage.getItem('cart')) {
//     let cart = JSON.parse(localStorage.getItem('cart'));
//     let matchedItem = cart.find((cartItem) => cartItem.id === data.id);
//     if (matchedItem) {
//       cart = cart.filter((cartItem) => cartItem.id !== matchedItem.id);
//       cart = [...cart, { ...data, quantity: matchedItem.quantity + 1 }];
//     } else {
//       cart = [...cart, { ...data, quantity: 1 }];
//     }
//     localStorage.setItem('cart', JSON.stringify(cart));
//     setCart(cart);
//   } else {
//     localStorage.setItem('cart', JSON.stringify([{ ...data, quantity: 1 }]));
//     setCart([{ ...data, quantity: 1 }]);
//   }
// };

export const addItemToCart = (data) => {
  let cart = [];
  if (getCartItem()) {
    let matchedItem = getCartItem().find((item) => item.id === data.id);
    cart = getCartItem()
      .filter((item) => item.id !== data.id)
      .map((item) => {
        return { id: item.id, quantity: item.quantity };
      });
    if (matchedItem) {
      if (data.stock < matchedItem.quantity) {
        return 'no_stock';
      }
      cart.push({ id: matchedItem.id, quantity: matchedItem.quantity + 1 });
    } else {
      cart.push({ id: data.id, quantity: 1 });
    }
  } else {
    cart.push({ id: data.id, quantity: 1 });
  }
  return cart;
};

// export const setQuantityToCart = (id, quantity) => {
//   if (localStorage.getItem('cart')) {
//     let cart = JSON.parse(localStorage.getItem('cart'));
//     let matchedItem = cart.find((cartItem) => cartItem.id === id);
//     cart = cart.filter((cartItem) => cartItem.id !== matchedItem.id);
//     if (quantity < 1) {
//       localStorage.setItem('cart', JSON.stringify(cart));
//       return;
//     }
//     cart = [...cart, { ...matchedItem, quantity: quantity }];
//     localStorage.setItem('cart', JSON.stringify(cart));
//   }
// };

export const setQuantityToCart = (data, quantity) => {
  let cart = [];
  if (getCartItem()) {
    cart = getCartItem().filter((item) => item.id !== data.id);
    if (quantity < 1) {
      localStorage.setItem('cart', JSON.stringify(cart));
      return cart;
    }
    let matchedItem = getCartItem().find((item) => item.id === data.id);
    if (data.stock < quantity) {
      cart.push({ id: data.id, quantity: data.stock });
      return cart;
    }
    cart = getCartItem()
      .filter((item) => item.id !== data.id)
      .map((item) => {
        return { id: item.id, quantity: item.quantity };
      });
    cart.push({ id: matchedItem.id, quantity: quantity });
  }
  return cart;
};

// export const removeItemFromCart = (id, remove = false) => {
//   if (localStorage.getItem('cart')) {
//     let cart = JSON.parse(localStorage.getItem('cart'));
//     let matchedItem = cart.find((cartItem) => cartItem.id === id);
//     cart = cart.filter((cartItem) => cartItem.id !== matchedItem.id);

//     if (remove) {
//       localStorage.setItem('cart', JSON.stringify(cart));
//       return;
//     }
//     if (matchedItem.quantity > 1)
//       cart = [...cart, { ...matchedItem, quantity: matchedItem.quantity - 1 }];
//     if (cart.length < 1) localStorage.removeItem('cart');
//     else localStorage.setItem('cart', JSON.stringify(cart));
//   }
// };

export const removeItemFromCart = (data) => {
  let cart = [];
  if (getCartItem()) {
    let matchedItem = getCartItem().find((item) => item.id === data.id);
    cart = getCartItem()
      .filter((item) => item.id !== data.id)
      .map((item) => {
        return { id: item.id, quantity: item.quantity };
      });

    if (matchedItem.quantity > 1) {
      cart.push({ id: matchedItem.id, quantity: matchedItem.quantity - 1 });
    } else {
      if (cart.length < 1) localStorage.removeItem('cart');
    }
  }
  return cart;
};

export const clearCart = () => localStorage.removeItem('cart');

export const refreshCart = (data) => {
  if (data.length > 0) {
    localStorage.setItem(
      'cart',
      JSON.stringify(
        data.map((item) => {
          return { id: item.id, quantity: item.quantity };
        })
      )
    );
  } else {
    localStorage.removeItem('cart');
  }
};

export const getCartItemCount = () =>
  localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart')).length
    : undefined;

export const getCartItem = () =>
  localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : undefined;
