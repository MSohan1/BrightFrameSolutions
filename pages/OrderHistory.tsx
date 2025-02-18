import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  order_items: OrderItem[];
}

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (*)
          `)
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;
        setOrders(ordersData || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      
      {orders.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>No orders found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-3">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{products.find(p => p.id === item.product_id)?.name || 'Product'}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₹{item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">₹{order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Use the same products array from Products.tsx
const products = [
  {
    id: "1",
    name: "Sushi Platter Display",
    price: 129.99,
  },
  {
    id: "2",
    name: "Chocolate Cake Display",
    price: 89.99,
  },
  {
    id: "3",
    name: "Burger Combo Display",
    price: 149.99,
  },
  {
    id: "4",
    name: "American Breakfast Display",
    price: 179.99,
  }
];

export default OrderHistory;