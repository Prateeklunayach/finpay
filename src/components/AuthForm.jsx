import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AuthForm = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    upiId: '',
    accountNumber: '',
    ifscCode: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (isLogin) {
      if (!formData.username || !formData.password) {
        throw new Error('Username and password are required');
      }
    } else {
      if (!formData.username || !formData.password || !formData.name || 
          !formData.email || !formData.upiId || !formData.accountNumber || !formData.ifscCode) {
        throw new Error('All fields are required for registration');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      validateForm();

      // Try different URL formats, starting with localhost
      const urls = [
        'http://localhost:5004',
      ];

      let lastError = null;
      for (const baseUrl of urls) {
        try {
          const endpoint = isLogin 
            ? `${baseUrl}/api/merchants/login`
            : `${baseUrl}/api/merchants/register`;

          console.log('Trying endpoint:', endpoint);
          console.log('Request data:', isLogin 
            ? { username: formData.username, password: formData.password }
            : formData
          );

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(isLogin 
              ? { username: formData.username, password: formData.password }
              : formData
            ),
          });

          console.log('Response status:', response.status);
          console.log('Response headers:', response.headers);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response text:', errorText);
            let errorData;
            try {
              errorData = JSON.parse(errorText);
            } catch (e) {
              errorData = { message: errorText };
            }

            // Handle specific error cases
            if (errorData.error === 'secretOrPrivateKey must have a value') {
              throw new Error('Server configuration error. Please try again later or contact support.');
            } else if (response.status === 500) {
              throw new Error('Server error. Please try again later.');
            } else if (response.status === 401) {
              throw new Error('Invalid username or password.');
            } else {
              throw new Error(errorData.message || `Authentication failed with status ${response.status}`);
            }
          }

          const data = await response.json();
          console.log('Auth response:', data);

          if (data.message === 'Login successful' || data.success) {
            if (isLogin) {
              // Store the actual token from the server
              localStorage.setItem('token', data.token);
              localStorage.setItem('user', JSON.stringify(data.merchant));
              onAuth(data.merchant);
            } else {
              // For registration, create a mock token and store user data
              const mockToken = `mock_token_${data.merchantId}`;
              localStorage.setItem('token', mockToken);
              localStorage.setItem('user', JSON.stringify({
                id: data.merchantId,
                username: formData.username,
                name: formData.name,
                email: formData.email,
                upiId: formData.upiId,
                accountNumber: formData.accountNumber,
                ifscCode: formData.ifscCode
              }));
              onAuth({
                id: data.merchantId,
                username: formData.username,
                name: formData.name,
                email: formData.email,
                upiId: formData.upiId,
                accountNumber: formData.accountNumber,
                ifscCode: formData.ifscCode
              });
            }
            return; // Success, exit the loop
          } else {
            throw new Error(data.message || 'Authentication failed');
          }
        } catch (err) {
          console.error(`Error with URL ${baseUrl}:`, err);
          lastError = err;
          // Continue to next URL
        }
      }

      // If we get here, all URLs failed
      throw lastError || new Error('All connection attempts failed. Please check if the server is running.');
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="name" className="sr-only">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="upiId" className="sr-only">UPI ID</label>
                  <input
                    id="upiId"
                    name="upiId"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="UPI ID"
                    value={formData.upiId}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="accountNumber" className="sr-only">Account Number</label>
                  <input
                    id="accountNumber"
                    name="accountNumber"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Account Number"
                    value={formData.accountNumber}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="ifscCode" className="sr-only">IFSC Code</label>
                  <input
                    id="ifscCode"
                    name="ifscCode"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="IFSC Code"
                    value={formData.ifscCode}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                isLogin ? 'Sign in' : 'Create account'
              )}
            </motion.button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 hover:text-indigo-500"
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm; 