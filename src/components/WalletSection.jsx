import React, { useState } from 'react';
import { motion } from 'framer-motion';

const WalletSection = ({ balance, onAddMoney }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddMoney = async () => {
    setError('');
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const options = {
        key: 'rzp_live_cUDg7ilqB5gAy9', // Replace with your actual Razorpay key
        amount: parseFloat(amount) * 100, // Razorpay expects amount in paise
        currency: 'INR',
        name: 'FinPay',
        description: 'Add Money to Wallet',
        handler: function(response) {
          // Handle successful payment
          if (response.razorpay_payment_id) {
            onAddMoney(parseFloat(amount));
            setAmount('');
          }
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#6366F1'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError('Failed to initialize payment. Please try again.');
      console.error('Razorpay error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Wallet Balance</h2>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg p-6 mb-6"
      >
        <p className="text-white text-sm mb-2">Available Balance</p>
        <p className="text-white text-3xl font-bold">₹{balance.toFixed(2)}</p>
      </motion.div>

      <div className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Add Money
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">₹</span>
            </div>
            <input
              type="number"
              name="amount"
              id="amount"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
            />
          </div>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-600 text-sm"
          >
            {error}
          </motion.p>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          onClick={handleAddMoney}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Add Money'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default WalletSection; 