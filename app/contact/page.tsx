'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast.error('Failed to send message');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-4xl font-bold mb-4 text-center">Contact Us</h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
        Have a question or feedback? We'd love to hear from you!
      </p>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={6}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Your message..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
        <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-3xl mb-2">📧</div>
          <h3 className="font-semibold mb-1">Email</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">support@smarttoolshub.com</p>
        </div>
        <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-3xl mb-2">⏱️</div>
          <h3 className="font-semibold mb-1">Response Time</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Within 24 hours</p>
        </div>
        <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-3xl mb-2">💬</div>
          <h3 className="font-semibold mb-1">Feedback</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">We value your input</p>
        </div>
      </div>
    </div>
  );
}
