import React, { useState, createContext } from 'react';

export const CartContext = createContext(null);

export const Provider = (props) => {
  const [cart, setCart] = useState([]);
  const [cartPrice, setCartPrice] = useState<number>();

  return (
    <CartContext.Provider value={[cart, setCart, cartPrice, setCartPrice]}>
      {props.children}
    </CartContext.Provider>
  );
};
