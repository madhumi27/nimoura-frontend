import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const exists = state.find(i => i.id === action.item.id);
      if (exists) return state.map(i => i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...state, { ...action.item, qty: 1 }];
    }
    case 'REMOVE': return state.filter(i => i.id !== action.id);
    case 'UPDATE': return state.map(i => i.id === action.id ? { ...i, qty: action.qty } : i);
    case 'CLEAR':  return [];
    default: return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(reducer, []);
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const addToCart = (item) => dispatch({ type: 'ADD', item });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE', id });
  const updateQty = (id, qty) => qty < 1 ? dispatch({ type: 'REMOVE', id }) : dispatch({ type: 'UPDATE', id, qty });
  const clearCart = () => dispatch({ type: 'CLEAR' });
  return (
    <CartContext.Provider value={{ cart, totalItems, totalPrice, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
