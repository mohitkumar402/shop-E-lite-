import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, total, itemCount } = useCart();
  const { showToast } = useToast();

  const handleRemove = (id: number, title: string) => {
    removeFromCart(id);
    showToast(`${title.substring(0, 25)}... removed from cart`, 'info');
  };

  const handleClearCart = () => {
    clearCart();
    showToast('Cart cleared successfully', 'info');
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-6 max-w-md">
          Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/25"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Shopping Cart</h1>
          <p className="text-slate-500 mt-1">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
        </div>
        <button
          onClick={handleClearCart}
          className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6"
            >
              <div className="flex gap-4">
                {/* Image */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-50 rounded-xl p-2 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 line-clamp-2 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-lg font-bold text-violet-600 mb-4">
                    ${item.price.toFixed(2)}
                  </p>

                  {/* Quantity & Actions */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-10 text-center font-semibold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id, item.title)}
                      className="flex items-center gap-1 text-rose-500 hover:text-rose-600 text-sm font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>

                    <span className="ml-auto text-lg font-bold text-slate-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-4">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({itemCount} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax</span>
                <span>${(total * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between text-xl font-bold text-slate-800">
                  <span>Total</span>
                  <span>${(total * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/25 mb-3"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/products"
              className="block w-full py-3 px-4 text-center text-violet-600 font-medium hover:bg-violet-50 rounded-xl transition-colors"
            >
              Continue Shopping
            </Link>

            {/* Promo Code */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-700 transition-colors">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
