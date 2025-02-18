import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (error) throw error;

      toast.success('Message sent successfully! We\'ll get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
          <p className="text-gray-600 mb-8">
            Have questions about our products or need a custom order? 
            We're here to help! Contact us using any of the methods below.
          </p>

          <div className="space-y-6">
            <div className="flex items-start">
              <Mail className="h-6 w-6 text-red-600 mt-1" />
              <div className="ml-4">
                <h3 className="text-lg font-medium">Email</h3>
                <p className="text-gray-600">brightframesolutions@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="h-6 w-6 text-red-600 mt-1" />
              <div className="ml-4">
                <h3 className="text-lg font-medium">Phone</h3>
                <p className="text-gray-600">(+91) 95 4242 7942</p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="h-6 w-6 text-red-600 mt-1" />
              <div className="ml-4">
                <h3 className="text-lg font-medium">Address</h3>
                <p className="text-gray-600">
                No 17-156/1 Sirla hills colony,<br />
                meerpet badlapur hyderabad 500097.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;