import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RequestMoneyForm = ({ onClose, onRequest, balance }) => {
  const [amount, setAmount] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Get user data and token from localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');

      console.log('Stored user data:', userData);
      console.log('Stored token:', token);

      if (!userData || !token) {
        throw new Error('Please log in again. Your session has expired.');
      }

      // Validate amount
      if (amount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      // Show fingerprint authentication dialog
      setIsAuthenticating(true);
      
      try {
        // Here you would integrate with your actual fingerprint authentication API
        // For now, we'll simulate the fingerprint authentication with a delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // After successful fingerprint authentication, proceed with payment
        const requestBody = {
          amount: parseFloat(amount),
          merchantId: userData.id,
          fingerprintData: 'authenticated', // This should be replaced with actual fingerprint data
          type: 'payment'
        };

        console.log('Sending payment request with data:', requestBody);

        // Use Replit URL
        const baseUrl = 'https://da18cb3d-90d8-4e21-b63e-19d719f06fcf-00-321o5acwph97q.sisko.replit.dev:3001';
        const endpoint = `${baseUrl}/api/payment/initiate`;

        console.log('Sending request to:', endpoint);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to initiate payment');
        }

        const data = await response.json();
        console.log('Payment initiation response:', data);

        if (data.success) {
          setSuccessMessage('Payment request initiated successfully!');
          setAmount('');
          onRequest({
            amount: parseFloat(amount),
            merchantId: userData.id,
            timestamp: new Date().toISOString(),
            status: 'completed',
            type: 'request'
          });
          onClose();
        } else {
          throw new Error(data.message || 'Failed to initiate payment');
        }
      } catch (authError) {
        throw new Error('Fingerprint authentication failed. Please try again.');
      } finally {
        setIsAuthenticating(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Request Money</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount (₹)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter amount"
              required
              min="0.01"
              step="0.01"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="text-green-600 text-sm">
              {successMessage}
            </div>
          )}

          <div className="flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || isAuthenticating}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                (isLoading || isAuthenticating)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isAuthenticating ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying Fingerprint...
                </div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Pay with Fingerprint
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RequestMoneyForm; 