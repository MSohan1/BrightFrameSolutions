import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface SignUpFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  age: string;
  city: string;
  state: string;
  country: string;
  address: string;
}

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    age: '',
    city: '',
    state: '',
    country: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic form validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!isLogin && (!formData.firstName || !formData.lastName || !formData.phone)) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        console.log('Attempting sign in...');
        await signIn(formData.email, formData.password);
        console.log('Sign in successful');
        toast.success('Successfully signed in!', {
          position: 'top-center',
          style: {
            marginTop: '50px',
          }
        });
        navigate('/');
      } else {
        console.log('Attempting sign up...');
        const { data: authData, error: authError } = await signUp(formData.email, formData.password);
        if (authError) {
          console.error('Sign up error:', authError);
          throw authError;
        }

        if (!authData.user?.id) {
          const errorMsg = 'Failed to create account. Please try again.';
          console.error(errorMsg);
          throw new Error(errorMsg);
        }

        console.log('Creating user profile...');
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              first_name: formData.firstName,
              last_name: formData.lastName,
              phone: formData.phone,
              gender: formData.gender,
              age: parseInt(formData.age),
              city: formData.city,
              state: formData.state,
              country: formData.country,
              address: formData.address
            }
          ]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw profileError;
        }

        console.log('Account created successfully');
        toast.success('Account created successfully! Please sign in.', {
          position: 'top-center',
          style: {
            marginTop: '50px',
          }
        });
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during authentication';
      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-center',
        style: {
          marginTop: '50px',
          backgroundColor: '#fef2f2',
          color: '#dc2626'
        }
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>

            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  />
                </div>


              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-red-600 hover:text-red-500"
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
