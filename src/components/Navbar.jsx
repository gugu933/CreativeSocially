import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setIsOpen(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    navigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            }}
            className="flex items-center space-x-2"
          >
            <img src="/assets/images/logo.svg" alt="Creative Socially" className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                });
              }}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              onClick={() => handleNavigation('/products')}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Products
            </Link>
            <Link 
              to="/contact" 
              onClick={() => handleNavigation('/contact')}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
          <div className="py-4 space-y-4">
            <Link 
              to="/" 
              onClick={() => {
                setIsOpen(false);
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                });
              }}
              className="block text-gray-600 hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              onClick={() => handleNavigation('/products')}
              className="block text-gray-600 hover:text-primary transition-colors"
            >
              Products
            </Link>
            <Link 
              to="/contact" 
              onClick={() => handleNavigation('/contact')}
              className="block text-gray-600 hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 