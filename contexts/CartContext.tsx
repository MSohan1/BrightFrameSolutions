import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase'; // Import supabase for database operations
import { useAuth } from './AuthContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  shippingCost: number;
  couponDiscount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'APPLY_COUPON'; payload: { code: string; discount: number } }
  | { type: 'CLEAR_COUPON' }
  | { type: 'CLEAR_CART' };


interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyCoupon: (code: string) => Promise<void>;
  clearCoupon: () => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getUniqueProductCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
      case 'APPLY_COUPON':
        return {
          ...state,
          couponCode: action.payload.code,
          couponDiscount: action.payload.discount
        };
        case 'CLEAR_COUPON':
          return {
            ...state,
            couponCode: null,
            couponDiscount: 0
          };
      
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        couponCode: null,
        couponDiscount: 0
      };
    default:
      return state;
  }
};

//const DOLLAR_TO_INR = 75; // Conversion rate from Dollar to Rupee

const initialState: CartState = {
  items: [],
  couponCode: null,
  shippingCost: 100.00, // Convert shipping cost to Rupees
  couponDiscount: 0
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  // Load cart from localStorage and clear on sign out
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const cartItems = JSON.parse(savedCart) || [];
        if (Array.isArray(cartItems)) {
          cartItems.forEach((item: CartItem) => {
            dispatch({ type: 'ADD_ITEM', payload: item });
          });
        }
      }
    };

    loadCart();

    // Clear cart on sign out
    const handleSignOut = () => {
      dispatch({ type: 'CLEAR_CART' });
      localStorage.removeItem('cart');
    };

    // Listen for sign out events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        handleSignOut();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    const saveCart = () => {
      localStorage.setItem('cart', JSON.stringify(state.items));
    };

    saveCart();
  }, [state]);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
     // toast.success('Item added to cart'); 
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    toast.success('Item removed from cart', {
      position: 'top-center',
      style: {
        marginTop: '50px', // Adjust this value to position it further down
      }
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity > 0) {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  
  const applyCoupon = async (code: string) => {
    if (!user) {
      toast.error('Please sign in to use coupons');
      return;
    }

    try {
      // First, get the coupon details
      const { data: coupon, error: couponError } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code)
        .eq('active', true)
        .single();

      if (couponError || !coupon) {
        throw new Error('Invalid coupon code');
      }

      // Check how many times the user has used this coupon
      const { data: uses, error: usesError } = await supabase
        .from('coupon_uses')
        .select('*')
        .eq('coupon_id', coupon.id)
        .eq('user_id', user.id);

      if (usesError) {
        throw new Error('Error checking coupon usage');
      }

      if (uses && uses.length >= coupon.max_uses_per_user) {
        throw new Error(`This coupon can only be used ${coupon.max_uses_per_user} times per user`);
      }

      dispatch({ 
        type: 'APPLY_COUPON', 
        payload: { 
          code: coupon.code, 
          discount: coupon.discount_percentage 
        } 
      });
      toast.success('Coupon applied successfully');
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error(error instanceof Error ? error.message : 'Error applying coupon');
    }
  };

  const clearCoupon = () => {
    dispatch({ type: 'CLEAR_COUPON' });
  };





  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getSubtotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0); // Convert subtotal to Rupees
  };








  const getDiscount = () => {
    const subtotal = getSubtotal();
    let discount = 0;
    const totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
    if (totalQuantity >= 1000) {
      discount += subtotal * 0.25;
    }
    if (state.couponCode && state.couponDiscount > 0) {
      discount += (subtotal * state.couponDiscount) / 100;
    }

    return discount;
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const discount = getDiscount();
    const gst = subtotal * 0.18; // Calculate GST
    return subtotal - discount + gst + state.shippingCost; // Include GST in total
  };

  const getUniqueProductCount = () => {
    return state.items.length;
  };

  return (

    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        applyCoupon,
        clearCoupon,
        clearCart,
        getSubtotal,
        getDiscount,
        getTotal,
        getUniqueProductCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
