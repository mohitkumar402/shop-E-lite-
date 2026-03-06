import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ThemeProvider>
        <ToastProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/admin" element={<Admin />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
        </ToastProvider>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
