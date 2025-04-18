import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PaymentForm = ({ onPaymentSuccess, balance }) => {
  const [amount, setAmount] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [fingerprintData, setFingerprintData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate amount
      const paymentAmount = parseFloat(amount);
      if (isNaN(paymentAmount) || paymentAmount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      if (paymentAmount > balance) {
        throw new Error('Insufficient balance');
      }

      // Validate merchant ID
      if (!merchantId.trim()) {
        throw new Error('Please enter a merchant ID');
      }

      // Validate fingerprint data
      if (!fingerprintData.trim()) {
        throw new Error('Fingerprint authentication required');
      }

      // Send payment initiation request
      const response = await fetch('https://7f232dcf-3548-4d4c-993c-b03b7c310acc-00-lallfd7bfikh.sisko.replit.dev/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentAmount,
          merchantId: merchantId.trim(),
          fingerprintData: fingerprintData.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment initiation failed');
      }

      const data = await response.json();
      
      if (data.success) {
        onPaymentSuccess(paymentAmount);
        setAmount('');
        setMerchantId('');
        setFingerprintData('');
      } else {
        throw new Error(data.message || 'Payment failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Make a Payment</h2>
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

        <div>
          <label htmlFor="merchantId" className="block text-sm font-medium text-gray-700">
            Merchant ID
          </label>
          <input
            type="text"
            id="merchantId"
            value={merchantId}
            onChange={(e) => setMerchantId(e.target.value)}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Enter merchant ID"
            required
          />
        </div>

        <div>
          <label htmlFor="fingerprintData" className="block text-sm font-medium text-gray-700">
            Fingerprint Data
          </label>
          <input
            type="text"
            id="fingerprintData"
            value={fingerprintData}
            onChange={(e) => setFingerprintData(e.target.value)}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Enter fingerprint data"
            required
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </motion.button>
      </form>
    </div>
  );
};

export default PaymentForm; 