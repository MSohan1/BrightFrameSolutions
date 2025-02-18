import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Bright Frame Solutions Pvt Ltd</h3>
            <p className="text-gray-300">Quality Artificial food displays for your business needs.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/products" className="text-gray-300 hover:text-white">Products</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-300">
                <li>No 17-156/1 Sirla hills colony,</li>
                <li>meerpet badlapur hyderabad 500097.</li>
                <li>Phone: (+91) 95 4242 7942</li>
                <li>Email: brightframesolutions@gmail.com</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Bright Frame Solutions Pvt Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;