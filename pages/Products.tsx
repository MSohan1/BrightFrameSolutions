import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Filter, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const Products = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromQuery = queryParams.get('category');

  const [selectedCategory, setSelectedCategory] = useState(categoryFromQuery || 'all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({}); // Manage quantities for each product

  useEffect(() => {
    if (categoryFromQuery) {
      setSelectedCategory(categoryFromQuery);
    }
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map(product => product.category));
    return ['all', ...Array.from(uniqueCategories)];
  }, [products]);

  const filteredProducts = useMemo(
    () =>
      selectedCategory === 'all'
        ? products
        : products.filter(product => product.category === selectedCategory),
    [products, selectedCategory]
  );

  const handleQuantityChange = (id: string, value: number) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, value) }));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <Filter className="h-5 w-5 mr-2" />
          <span className="font-medium">Filter by:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="ml-4 p-2 border rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const quantity = quantities[product.id] || 1; // Default to 1 if not set
          return (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105">
              {/* Link wraps only non-interactive elements */}
              <Link to={`/products/${product.id}`} className="block">
                <div className="relative pb-[75%]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </Link>

              <div className="p-4">
  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</h3>
  <p className="text-gray-600 mb-4 line-clamp-3">{product.description}</p>
  
  <span className="text-xl font-bold text-red-600">Price  ₹{product.price.toFixed(2)}</span>

  {/* Ensure quantity input and button appear on a new line */}
  <div className="mt-2 flex flex-col items-start gap-2">
    {/* Quantity Input Field */}
    <div className="flex items-center gap-2 mt-2">
  <label className="text-sm text-gray-600">Quantity:</label>
  <input
    type="number"
    value={quantity}
    min="1"
    onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))}
    className="border rounded-md p-1 w-16"
  />
</div>

    {/* Add to Cart button */}
    <button
      onClick={() => {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity, // Include quantity in the item added to cart
        });
        toast.success(`${product.name} added to cart!`, {
          position: 'top-center',
          style: {
            marginTop: '50px', // Adjust this value to position it further down
          }
        });
      }}
      className="bg-red-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-700 transition-colors flex items-center group"
    >
      <ShoppingCart className="h-4 w-4 mr-1 transform group-hover:scale-110 transition-transform" />
      Add to Cart
    </button>
  </div>
</div>

            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No products found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default Products;
