import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', age: '', weight: '', height: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(formData);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Card className="w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 to-purple-500"></div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Join us to start tracking your health
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          
          <input
            type="text" name="name" required placeholder="Full Name"
            className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            onChange={handleChange}
          />
          <input
            type="email" name="email" required placeholder="Email address"
            className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            onChange={handleChange}
          />
          <input
            type="password" name="password" required placeholder="Password"
            className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            onChange={handleChange}
          />
          
          <div className="flex space-x-2">
            <input
              type="number" name="age" placeholder="Age"
              className="w-1/3 px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              onChange={handleChange}
            />
            <input
              type="number" name="weight" placeholder="Weight (kg)"
              className="w-1/3 px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              onChange={handleChange}
            />
            <input
              type="number" name="height" placeholder="Height (cm)"
              className="w-1/3 px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              onChange={handleChange}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-md hover:shadow-lg disabled:opacity-70"
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </div>
          <div className="text-sm text-center mt-4">
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Register;
