import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './styles/global.css';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import { WishlistProvider } from './context/WishlistContext';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import CarePage from './pages/CarePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';
import ProductPage from './pages/ProductPage';
import SearchPage from './pages/SearchPage';
import ShopPage from './pages/ShopPage';
import ContactPage from './pages/ContactPage';
function App() {
  return (
    <AuthProvider>
      <CartProvider>
         <WishlistProvider>
        <Router>
          <Routes>
            <Route path="/"          element={<HomePage />} />
            <Route path="/shop"      element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart"      element={<CartPage />} />
            <Route path="/checkout"  element={<CheckoutPage />} />
            <Route path="/login"     element={<LoginPage />} />
            <Route path="/admin"     element={<AdminPage />} />
            <Route path="/about"     element={<AboutPage />} />
            <Route path="/care"      element={<CarePage />} />
            <Route path="/orders" element={<OrdersPage />} />
           <Route path="/orders" element={<OrdersPage />} />
<Route path="*" element={<NotFoundPage />} />
<Route path="/search" element={<SearchPage />} />
<Route path="/wishlist" element={<WishlistPage />} />
<Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
