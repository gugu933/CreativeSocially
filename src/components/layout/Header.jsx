import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaHome, FaShoppingBag, FaUser, FaInfoCircle, FaEnvelope, FaShoppingCart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { cartSize, openCart } = useCart();
  const [activeTabPosition, setActiveTabPosition] = useState({ left: 0, width: 0 });
  const navRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Update underline position when route changes
  useEffect(() => {
    const updateUnderlinePosition = () => {
      const nav = navRef.current;
      if (!nav) return;

      const activeLink = nav.querySelector('.text-primary');
      if (activeLink) {
        const navRect = nav.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        
        setActiveTabPosition({
          left: linkRect.left - navRect.left,
          width: linkRect.width,
        });
      }
    };

    updateUnderlinePosition();
    // Also update on window resize
    window.addEventListener('resize', updateUnderlinePosition);
    return () => window.removeEventListener('resize', updateUnderlinePosition);
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-100' : 'bg-transparent border-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center h-20">
          {/* Logo */}
          <Link to="/" onClick={scrollToTop} className="flex items-center space-x-2 lg:ml-[170px]">
            <span className="text-2xl font-bold text-primary">CreativeSocially</span>
          </Link>

          {/* Desktop Navigation */}
          <nav ref={navRef} className="hidden md:flex items-center space-x-5 relative lg:ml-12">
            {/* Animated Underline */}
            <div
              className="absolute bottom-[-4px] h-0.5 bg-primary transition-all duration-300 ease-in-out"
              style={{
                left: activeTabPosition.left,
                width: activeTabPosition.width,
              }}
            />
            
            <NavLink
              to="/"
              onClick={scrollToTop}
              className={({ isActive }) =>
                `text-lg font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              onClick={scrollToTop}
              className={({ isActive }) =>
                `text-lg font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'
                }`
              }
            >
              Products
            </NavLink>

            {/* Models Dropdown */}
            <div className="relative group">
              <button className={`text-lg font-medium transition-colors ${
                location.pathname.includes('/models') || location.pathname.includes('/become-model')
                  ? 'text-primary'
                  : 'text-gray-700 hover:text-primary'
              }`}>
                Models
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <NavLink
                  to="/models"
                  onClick={scrollToTop}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-gray-700 hover:bg-secondary-peach/20 hover:text-primary transition-colors ${
                      isActive ? 'text-primary bg-secondary-peach/10' : ''
                    }`
                  }
                >
                  Our Models
                </NavLink>
                <NavLink
                  to="/become-model"
                  onClick={scrollToTop}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-gray-700 hover:bg-secondary-peach/20 hover:text-primary transition-colors ${
                      isActive ? 'text-primary bg-secondary-peach/10' : ''
                    }`
                  }
                >
                  Become a Model
                </NavLink>
              </div>
            </div>

            <NavLink
              to="/about"
              onClick={scrollToTop}
              className={({ isActive }) =>
                `text-lg font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              onClick={scrollToTop}
              className={({ isActive }) =>
                `text-lg font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Cart Icon */}
          <div className="flex items-center space-x-4 ml-auto lg:mr-20">
            <button
              onClick={openCart}
              className="relative p-2 text-gray-600 hover:text-primary transition-colors"
            >
              <FaShoppingCart className="w-6 h-6" />
              {cartSize > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartSize}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{ height: isMenuOpen ? 'auto' : 0 }}
          className="md:hidden overflow-hidden"
        >
          <nav className="py-4 space-y-2">
            <NavLink
              to="/"
              onClick={() => {
                setIsMenuOpen(false);
                scrollToTop();
              }}
              className={({ isActive }) =>
                `block text-lg transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              onClick={() => {
                setIsMenuOpen(false);
                scrollToTop();
              }}
              className={({ isActive }) =>
                `block text-lg transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'
                }`
              }
            >
              Products
            </NavLink>
            <div className="relative group">
              <button className="block text-lg transition-colors text-gray-700 hover:text-primary">
                Models
              </button>
              <div className="absolute left-0 mt-2 w-full bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <NavLink
                  to="/models"
                  onClick={() => {
                    setIsMenuOpen(false);
                    scrollToTop();
                  }}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-gray-700 hover:bg-secondary-peach/20 hover:text-primary transition-colors ${
                      isActive ? 'text-primary bg-secondary-peach/10' : ''
                    }`
                  }
                >
                  Our Models
                </NavLink>
                <NavLink
                  to="/become-model"
                  onClick={() => {
                    setIsMenuOpen(false);
                    scrollToTop();
                  }}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-gray-700 hover:bg-secondary-peach/20 hover:text-primary transition-colors ${
                      isActive ? 'text-primary bg-secondary-peach/10' : ''
                    }`
                  }
                >
                  Become a Model
                </NavLink>
              </div>
            </div>
            <NavLink
              to="/about"
              onClick={() => {
                setIsMenuOpen(false);
                scrollToTop();
              }}
              className={({ isActive }) =>
                `block text-lg transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => {
                setIsMenuOpen(false);
                scrollToTop();
              }}
              className={({ isActive }) =>
                `block text-lg transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'
                }`
              }
            >
              Contact
            </NavLink>
          </nav>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;