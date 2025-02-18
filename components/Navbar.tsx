import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { state, getUniqueProductCount } = useCart();
  const navigate = useNavigate();

  const cartItemCount = getUniqueProductCount();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
           { /*  <h1 className="text-2xl font-bold text-red-600">Display Fake Foods</h1> */}
              
            <div className="flex items-center justify-center">
              <img src="./src/assets/Logo.jpeg" alt="Logo" className="h-16" />
            </div>              
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-red-600">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-red-600">Products</Link>
            {/* <Link to="/fake-fruits" className="text-gray-700 hover:text-red-600">Fake Fruits</Link> */}
            <Link to="/about" className="text-gray-700 hover:text-red-600">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-red-600">Contact</Link>
            
            {user ? (
              <>
                <Link to="/order-history" className="text-gray-700 hover:text-red-600">
                  <User className="h-6 w-6" />
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-red-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/auth" className="text-gray-700 hover:text-red-600">Sign In</Link>
            )}
            
            <Link to="/cart" className="flex items-center text-gray-700 hover:text-red-600">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="ml-1 bg-red-600 text-white text-xs rounded-full px-2 py-1">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-red-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {/* <Link to="/fake-fruits" className="block px-3 py-2 text-gray-700 hover:text-red-600">Fake Fruits</Link> */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-red-600">Home</Link>
            <Link to="/products" className="block px-3 py-2 text-gray-700 hover:text-red-600">Products</Link>
            <Link to="/about" className="block px-3 py-2 text-gray-700 hover:text-red-600">About</Link>
            <Link to="/contact" className="block px-3 py-2 text-gray-700 hover:text-red-600">Contact</Link>
            
            {user ? (
              <>
                <Link to="/order-history" className="block px-3 py-2 text-gray-700 hover:text-red-600">
                  Order History
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-red-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/auth" className="block px-3 py-2 text-gray-700 hover:text-red-600">Sign In</Link>
            )}
            
            <Link to="/cart" className="flex items-center px-3 py-2 text-gray-700 hover:text-red-600">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="ml-2 bg-red-600 text-white text-xs rounded-full px-2 py-1">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
