import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RegisterFormData } from '../types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof RegisterFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (registerError) {
      setRegisterError('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setRegisterError('');
    
    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (success) {
        setRegisterSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setRegisterError('Email already exists. Please use a different email.');
      }
    } catch (error) {
      setRegisterError('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (registerSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full shadow-2xl shadow-emerald-500/30 mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Registration Successful!
          </h2>
          <p className="text-slate-400">
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>
      
      <div className="max-w-md w-full relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl shadow-2xl shadow-violet-500/30 mb-4">
            <span className="text-white font-bold text-2xl">E</span>
          </div>
          <h2 className="text-3xl font-bold text-white">
            Create account
          </h2>
          <p className="mt-2 text-slate-400">
            Join ShopElite today
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={`w-full px-4 py-3 bg-white/5 border ${
                  errors.name
                    ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
                    : 'border-white/10 focus:ring-violet-500 focus:border-violet-500'
                } rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-rose-400">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`w-full px-4 py-3 bg-white/5 border ${
                  errors.email
                    ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
                    : 'border-white/10 focus:ring-violet-500 focus:border-violet-500'
                } rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-rose-400">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                className={`w-full px-4 py-3 bg-white/5 border ${
                  errors.password
                    ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
                    : 'border-white/10 focus:ring-violet-500 focus:border-violet-500'
                } rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                placeholder="Create a password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-rose-400">{errors.password}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                className={`w-full px-4 py-3 bg-white/5 border ${
                  errors.confirmPassword
                    ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
                    : 'border-white/10 focus:ring-violet-500 focus:border-violet-500'
                } rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-rose-400">{errors.confirmPassword}</p>
              )}
            </div>

            {registerError && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
                <p className="text-sm text-rose-400">{registerError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-xl hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 shadow-lg shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-violet-400 hover:text-violet-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
