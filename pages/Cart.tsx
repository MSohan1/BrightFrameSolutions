import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Minus, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';


declare global {
  interface Window {
    Razorpay: any;
  }
}
interface ShippingAddress {
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

const Cart = () => {
  const { state, removeItem, updateQuantity, getSubtotal, getDiscount, getTotal, clearCart,
     applyCoupon, clearCoupon, getUniqueProductCount } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [termsAccepted1, setTermsAccepted1] = useState(false);
  const [termsAccepted2, setTermsAccepted2] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: ''
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };
//orderId: string
// orderId: string 
  const handlePayment = async ( order_key: string ) => {
    // console.log("ORDER ID",orderId)
    const res = await initializeRazorpay();
    
    if (!res) {
      toast.error('Razorpay SDK failed to load');
      return;
    }

    // create order on server 
    const response = await fetch('http://localhost:3000/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(getTotal()), // Ensure amount is a whole number
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const order = await response.json();




    
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount , // Razorpay expects amount in paise
      currency: 'INR',
      name: 'Bright Frame Solutions pvt ltd',
      description: 'Purchase of display food items',
      order_id: order.id,
    
      handler: async (response: any) => {
        try {
          console.log("HI =======asdasdasddsasd============asdasdads");
          console.log("Order Id From RazorPay", order.id);
          console.log("Order Id From Order Table", order_key);
          
          const verifyResponse = await fetch('http://localhost:3000/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          
          // Update order status with payment details
          const { error: updateError } = await supabase
            .from('orders')
            .update({
              status: 'completed',
              payment_id: response.razorpay_payment_id,
              payment_signature: response.razorpay_signature
            })
            .eq('id', order_key);

          if (updateError)
            {
              console.log("ERRORERRORERRORERRORERRORERRORERRORERRORERRORERRORERRORERRORERROR");
              throw updateError;
              
            } 

          if (state.couponCode) {
            const { data: coupon } = await supabase
              .from('coupons')
              .select('id')
              .eq('code', state.couponCode)
              .single();

            if (coupon) {
              await supabase
                .from('coupon_uses')
                .insert({
                  coupon_id: coupon.id,
                  user_id: user?.id,
                 order_id: order_key
                });
            }
          }
         
          console.log("Order Id From RazorPay", order.id);
          console.log("Order Id From Order Table", order_key);

          console.log("razorpay payment id ",response.razorpay_payment_id);

          clearCart();
          toast.success('Payment successful! Order placed.', {
            position: 'top-center',
            style: {
              marginTop: '50px', // Adjust this value to position it further down
            }
          });
          navigate('/order-history');
        } catch (error) {
          console.error('Error updating order:', error);
          toast.error('Error processing payment. Please try again.', {
            position: 'top-center',
            style: {
              marginTop: '50px', // Adjust this value to position it further down
            }
          });
        }
      },
      prefill: {
        name: user?.email?.split('@')[0],
        email: user?.email,
      },
      theme: {
        color: '#158993'
      },
      modal: {
        ondismiss: function() {
          toast.error('Payment cancelled');
        }
      }

    };

    try {
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error('Error initializing Razorpay');
      console.error('Razorpay Error:', err);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Update user profile with shipping address
      // Get user profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: profile?.first_name || user.email?.split('@')[0] || 'User',
          last_name: profile?.last_name || '',
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          country: shippingAddress.country
        });

      if (profileError) throw profileError;
      
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            total_amount: getTotal(),
            status: 'pending'
            
          }
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = state.items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;
      const order_key = order.id;

      // Initialize Razorpay  payment order.id
      await handlePayment(order_key);
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('Failed to process order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to checkout');
      navigate('/auth');
      return;
    }

    try {
      // Check if user has address information
      const { data: profile } = await supabase
        .from('profiles')
        .select('address, city, state, country')
        .eq('id', user.id)
        .maybeSingle();

      // If no profile exists or missing address information, show address form
      if (!profile?.address || !profile?.city || !profile?.state || !profile?.country) {
        setShowAddressForm(true);
        return;
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      toast.error('Failed to check profile information. Please try again.');
      return;
    }

    setLoading(true);
    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            total_amount: getTotal(),
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = state.items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));
      console.log("============>>>>>>>>>>>>>>",order.id);
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Initialize Razorpay payment order.id
      const order_key  = order.id;
      await handlePayment(order_key);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please try again.', {
        position: 'top-center',
        style: {
          marginTop: '50px', // Adjust this value to position it further down
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.error('Please enter a coupon code');
      return;
    }
    
    await applyCoupon(couponCode);
    setCouponCode('');
  };



  if (state.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Add some items to your cart to get started!</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }
  if (showAddressForm) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
        <form onSubmit={handleAddressSubmit} className="space-y-6">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              required
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                required
                value={shippingAddress.state}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                PIN Code
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                required
                value={shippingAddress.pincode}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, pincode: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                required
                value={shippingAddress.country}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowAddressForm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Continue to Payment'}
            </button>
          </div>
        </form>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {state.items.map((item) => (
              <div key={item.id} className="flex items-center py-4 border-b last:border-b-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-grow ml-4">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">₹{item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="mx-4">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700 mt-2"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Items ({getUniqueProductCount()})</span>
                <span>₹{getSubtotal().toFixed(2)}</span>
                
              </div>
              <div className="flex justify-between">
                <span>GST 18%</span>
                <span>₹{(getSubtotal() * 0.18).toFixed(2)}</span>
                
              </div>
              
              
              {getDiscount() > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>
                  {state.couponCode && ` (${state.couponCode})`}
                  </span>
                  <span>-₹{getDiscount().toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{state.shippingCost.toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{getTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) =>  setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  {state.couponCode ? (
                    <button
                      onClick={clearCoupon}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Apply
                    </button>
                  )}

                </div>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms1"
                    checked={termsAccepted1}
                    onChange={(e) => setTermsAccepted1(e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms1" className="ml-2 text-sm text-gray-700">
                    I agree to the Terms of Service
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms2"
                    checked={termsAccepted2}
                    onChange={(e) => setTermsAccepted2(e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms2" className="ml-2 text-sm text-gray-700">
                    I agree to the Privacy Policy
                  </label>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || !termsAccepted1 || !termsAccepted2}
                className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


};

export default Cart;
