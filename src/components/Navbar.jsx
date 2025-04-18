import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Transactions', path: '/transactions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { name: 'Settings', path: '/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  return (
    <nav className="bg-white/30 backdrop-blur-sm shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <Link to="/" className="text-2xl font-bold text-gray-900">
                FinPay
              </Link>
            </motion.div>
            {user && (
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navLinks.map((link) => (
                    <motion.div
                      key={link.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to={link.path}
                        className={`${
                          location.pathname === link.path
                            ? 'bg-white/50 text-gray-900'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-white/30'
                        } px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200`}
                      >
                        <svg
                          className="h-5 w-5 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={link.icon}
                          />
                        </svg>
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {user ? (
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/50 text-gray-700 px-4 py-2 rounded-md text-sm font-medium mr-4 hover:bg-white/70 transition-colors duration-200"
                >
                  Support
                </motion.button>
                <div className="ml-3 relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="max-w-xs bg-white/50 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/30 focus:ring-gray-500"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-800 font-medium">
                          {user.name ? user.name[0].toUpperCase() : 'U'}
                        </span>
                      </div>
                    </button>
                  </motion.div>
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white/80 backdrop-blur-sm ring-1 ring-black ring-opacity-5"
                      >
                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-gray-500">{user.email}</p>
                        </div>
                        <motion.a
                          whileHover={{ scale: 1.02 }}
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-white/50"
                        >
                          Your Profile
                        </motion.a>
                        <motion.a
                          whileHover={{ scale: 1.02 }}
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-white/50"
                        >
                          Settings
                        </motion.a>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={onLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-white/50"
                        >
                          Sign out
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/'}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
              >
                Login / Sign Up
              </motion.button>
            </div>
          )}
          <div className="-mr-2 flex md:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            {user ? (
              <>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {navLinks.map((link) => (
                    <motion.div
                      key={link.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to={link.path}
                        className={`${
                          location.pathname === link.path
                            ? 'bg-white/50 text-gray-900'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-white/30'
                        } block px-3 py-2 rounded-md text-base font-medium flex items-center transition-colors duration-200`}
                      >
                        <svg
                          className="h-5 w-5 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={link.icon}
                          />
                        </svg>
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div className="pt-4 pb-3 border-t border-white/30">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-800 font-medium">
                          {user.name ? user.name[0].toUpperCase() : 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm font-medium text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      href="#"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-white/30"
                    >
                      Your Profile
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      href="#"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-white/30"
                    >
                      Settings
                    </motion.a>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={onLogout}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-white/30"
                    >
                      Sign out
                    </motion.button>
                  </div>
                </div>
              </>
            ) : (
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-colors duration-200"
                >
                  Login / Sign Up
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 