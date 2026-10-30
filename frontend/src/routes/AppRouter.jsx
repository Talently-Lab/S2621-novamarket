import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Admin from '../pages/Admin';
import NotFound from '../pages/NotFound';
import AuthProvider from '../context/AuthProvider';
import CartProvider from '../context/CartProvider';
import Layout from '../components/layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/checkout" element={<Checkout />} />
              </Route>
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<Admin />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRouter;
