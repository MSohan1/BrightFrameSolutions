import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Pencil, Trash2, Plus, Package, Users, ShoppingBag, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface User {
  id: string;
  email: string;
  profile: {
    first_name: string;
    last_name: string;
    phone: string;
    address: string;
  };
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  user: {
    email: string;
    profile: {
      first_name: string;
      last_name: string;
    };
  };
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'users' | 'orders' | 'messages'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setProducts(data || []);
      } else if (activeTab === 'users') {
        const { data, error } = await supabase
          .from('profiles')
          .select('*, user:auth.users(email)')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setUsers(data || []);
      } else if (activeTab === 'orders') {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            user:profiles!orders_user_id_fkey(
              first_name,
              last_name,
              email
            )
          `)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setOrders(data || []);
      } else if (activeTab === 'messages') {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setMessages(data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(editingProduct)
          .eq('id', editingProduct.id);
        if (error) throw error;
        toast.success('Product updated successfully');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([editingProduct]);
        if (error) throw error;
        toast.success('Product added successfully');
      }
      setEditingProduct(null);
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Product deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      if (error) throw error;
      toast.success('Order status updated successfully');
      fetchData();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleUpdateMessageStatus = async (messageId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', messageId);
      if (error) throw error;
      toast.success('Message status updated successfully');
      fetchData();
    } catch (error) {
      console.error('Error updating message status:', error);
      toast.error('Failed to update message status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center px-4 py-2 rounded-md ${
            activeTab === 'products' ? 'bg-red-600 text-white' : 'bg-gray-100'
          }`}
        >
          <Package className="h-5 w-5 mr-2" />
          Products
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center px-4 py-2 rounded-md ${
            activeTab === 'users' ? 'bg-red-600 text-white' : 'bg-gray-100'
          }`}
        >
          <Users className="h-5 w-5 mr-2" />
          Users
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center px-4 py-2 rounded-md ${
            activeTab === 'orders' ? 'bg-red-600 text-white' : 'bg-gray-100'
          }`}
        >
          <ShoppingBag className="h-5 w-5 mr-2" />
          Orders
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center px-4 py-2 rounded-md ${
            activeTab === 'messages' ? 'bg-red-600 text-white' : 'bg-gray-100'
          }`}
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          Messages
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          {activeTab === 'products' && (
            <div>
              <button
                onClick={() => setEditingProduct({ id: '', name: '', description: '', price: 0, category: '', image: '' })}
                className="mb-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Product
              </button>

              {editingProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <h2 className="text-xl font-bold mb-4">
                      {editingProduct.id ? 'Edit Product' : 'Add Product'}
                    </h2>
                    <form onSubmit={handleProductSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          value={editingProduct.name}
                          onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          value={editingProduct.description}
                          onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                          rows={3}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                          type="number"
                          value={editingProduct.price}
                          onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                          value={editingProduct.category}
                          onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                          required
                        >
                          <option value="">Select category</option>
                          <option value="japanese">Japanese Cuisine</option>
                          <option value="desserts">Desserts</option>
                          <option value="fastfood">Fast Food</option>
                          <option value="breakfast">Breakfast</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input
                          type="url"
                          value={editingProduct.image}
                          onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                          required
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="px-4 py-2 border rounded-md hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map(product => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.profile.first_name} {user.profile.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.profile.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{user.profile.address}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">#{order.id.slice(0, 8)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.user.profile.first_name} {order.user.profile.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{order.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${order.total_amount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="text-sm rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {messages.map(message => (
                    <tr key={message.id} className="group hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{message.name}</div>
                        <div className="text-sm text-gray-500">{message.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{message.subject}</div>
                        <div className="text-sm text-gray-500 group-hover:block hidden">{message.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(message.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={message.status}
                          onChange={(e) => handleUpdateMessageStatus(message.id, e.target.value)}
                          className={`text-sm rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 ${
                            message.status === 'new' ? 'bg-yellow-50' :
                            message.status === 'read' ? 'bg-blue-50' :
                            message.status === 'replied' ? 'bg-green-50' : ''
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Admin;