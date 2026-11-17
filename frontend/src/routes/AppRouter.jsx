import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';
import OrderConfirmation from '../pages/OrderConfirmation';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminProductCreate from '../pages/admin/AdminProductCreate';
import AdminProductEdit from '../pages/admin/AdminProductEdit';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminOrderDetail from '../pages/admin/AdminOrderDetail';
import AuthProvider from '../context/AuthProvider';
import CartProvider from '../context/CartProvider';
import Layout from '../components/layout/Layout';
import AdminLayout from '../components/admin/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Opta por el comportamiento de React Router v7 (evita las advertencias de "future flags" en consola).
const ROUTER_FUTURE = { v7_startTransition: true, v7_relativeSplatPath: true };

function AppRouter() {
  return (
    <BrowserRouter future={ROUTER_FUTURE}>
      {/* CartProvider va afuera: AuthProvider vacía el carrito al cerrar la sesión. */}
      <CartProvider>
        <AuthProvider>
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
                <Route path="/orders/:id" element={<OrderConfirmation />} />
              </Route>
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/new" element={<AdminProductCreate />} />
                  <Route
                    path="products/:id/edit"
                    element={<AdminProductEdit />}
                  />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="orders/:id" element={<AdminOrderDetail />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default AppRouter;
