import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useCart } from '../contexts/CartContext';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState<number>(1); // Quantity state
  const { addItem } = useCart(); // Access addItem from CartContext

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        // Fetch similar products based on category
        const { data: similarProducts } = await supabase
          .from('products')
          .select('*')
          .eq('category', data.category);
          
        data.relatedProducts = similarProducts; // Add similar products to the product data

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <img src={product.image} alt={product.name} className="w-[25%] h-auto mb-4" />

      <p className="text-lg mb-4">{product.description}</p>
      <span className="text-xl font-bold text-red-600">₹{product.price.toFixed(2)}</span>

      {/* Quantity Selector */}
      <div className="mt-4">
        <label htmlFor="quantity" className="mr-2">Quantity:</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          min="1"
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border rounded-md p-1 w-16"
        />
      </div>

      {/* Add to Cart Button */}
      <button 
        onClick={() => {
          addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image,
          });
          toast.success(`${product.name} added to cart!`, {
            position: 'top-center',
            style: {
              marginTop: '50px', // Adjust this value to position it further down
            }
          });
        }}

        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center mt-4"
      >
        Add to Cart
      </button>

      {/* Carousel for related products */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Related Products</h2>
        <div className="flex overflow-x-auto space-x-4">
          {product.relatedProducts && product.relatedProducts.map((relatedProduct: { id: string; image: string; name: string; price: number; }) => (
            <div key={relatedProduct.id} className="bg-white rounded-lg shadow-md p-4">
              <img src={relatedProduct.image} alt={relatedProduct.name} className="w-32 h-32 mb-2" />
              <h3 className="text-lg font-semibold">{relatedProduct.name}</h3>
              <span className="text-red-600">₹{relatedProduct.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
