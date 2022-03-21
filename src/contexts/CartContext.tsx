import React, { useState, createContext } from 'react';

export const CartContext = createContext(null);

export const Provider = (props) => {
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  return (
    <CartContext.Provider value={[cart, setCart, cartLoading, setCartLoading]}>
      {props.children}
    </CartContext.Provider>
  );
};
