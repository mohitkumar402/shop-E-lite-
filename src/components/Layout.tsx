import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, sessionExpiry } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!sessionExpiry) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = sessionExpiry - now;
      
      if (remaining <= 0) {
        setTimeLeft('Session expired');
        logout();
        navigate('/login');
        return;
      }

      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionExpiry, logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;
  const isCanvasPage = location.pathname === '/dashboard' || location.pathname === '/admin';

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/products', label: 'Products', icon: '🛍️' },
    { path: '/cart', label: `Cart ${itemCount > 0 ? `(${itemCount})` : ''}`, icon: '🛒' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  // Admin nav item - only shown to admin users
  const adminNavItem = { path: '/admin', label: 'Admin', icon: '⚙️' };
  const displayNavItems = user?.isAdmin ? [...navItems, adminNavItem] : navItems;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-50">
      <header className="bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/50 border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent">
                  ShopElite
                </h1>
              </div>
            </div>

            <nav className="hidden md:flex space-x-2">
              {displayNavItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30'
                      : 'text-slate-600 hover:text-violet-700 hover:bg-violet-50'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-slate-700">{user?.name}</div>
                <div className="flex items-center justify-end text-xs text-emerald-600 font-medium">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                  {timeLeft}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 text-sm font-medium shadow-lg shadow-rose-500/25"
              >
                Logout
              </button>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-600 hover:text-violet-600 focus:outline-none p-2 rounded-xl hover:bg-violet-50 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute w-full bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-xl">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {displayNavItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg'
                      : 'text-slate-600 hover:text-violet-700 hover:bg-violet-50'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              
              <div className="px-4 py-3 border-t border-slate-100 mt-3">
                <div className="text-sm text-slate-600 mb-3">
                  <div className="font-medium text-slate-800">{user?.name}</div>
                  <div className="flex items-center text-xs text-emerald-600 font-medium mt-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                    Session: {timeLeft}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2.5 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 text-sm font-medium shadow-lg shadow-rose-500/25"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className={isCanvasPage ? 'w-full py-6' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
