import React, { useState, createContext } from 'react';

export const CartContext = createContext(null);

export const Provider = (props) => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState<number>();

  return (
    <CartContext.Provider value={[cart, setCart, totalPrice, setTotalPrice]}>
      {props.children}
    </CartContext.Provider>
  );
};
