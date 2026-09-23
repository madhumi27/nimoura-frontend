import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  // Key is unique per user email
  const getKey = () => user ? `nimoura_wishlist_${user.email}` : null;

  // Load wishlist when user changes (login/logout/switch)
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(getKey());
      setWishlist(saved ? JSON.parse(saved) : []);
    } else {
      // No user logged in → clear wishlist
      setWishlist([]);
    }
  }, [user]);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(getKey(), JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const addToWishlist = (product) => {
    setWishlist(prev => {
      if (prev.find(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist(prev => prev.filter(p => p.id !== id));
  };

  const isWishlisted = (id) => wishlist.some(p => p.id === id);

  const toggleWishlist = (product) => {
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);