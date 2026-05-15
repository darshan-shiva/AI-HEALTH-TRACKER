import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Activity, ArrowRight, Sparkles, Scale, Ruler, Calendar } from 'lucide-react';
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
    <div className="min-h-screen flex w-full bg-white dark:bg-gray-900">
      {/* Left visual section - hidden on small screens */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-600 to-indigo-800 text-white items-center justify-center">
        {/* Abstract decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-white blur-3xl mix-blend-overlay"></div>
          <div className="absolute bottom-[10%] left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-300 blur-3xl mix-blend-overlay"></div>
          <div className="absolute top-[50%] right-[30%] w-[20%] h-[20%] rounded-full bg-cyan-300 blur-2xl mix-blend-overlay animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-lg px-12">
          <div className="mb-8 inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Start Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-white">Transformation</span>
          </h1>
          <p className="text-lg text-primary-100 mb-10 leading-relaxed font-light">
            Join thousands of others who have taken control of their health with our AI-powered tracking platform.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-primary-50">
              <Sparkles className="w-5 h-5 text-cyan-300" />
              <span>Track meals & macros instantly</span>
            </div>
            <div className="flex items-center space-x-3 text-primary-50">
              <Sparkles className="w-5 h-5 text-cyan-300" />
              <span>Monitor sleep & hydration</span>
            </div>
            <div className="flex items-center space-x-3 text-primary-50">
              <Sparkles className="w-5 h-5 text-cyan-300" />
              <span>Get AI-driven personalized insights</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 relative">
        <div className="w-full max-w-md space-y-6 my-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="inline-flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900/30 rounded-2xl">
                <Activity className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Enter your details to get started
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    type="text" name="name" required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 placeholder-gray-400 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all shadow-sm"
                    placeholder="John Doe"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    type="email" name="email" required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 placeholder-gray-400 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all shadow-sm"
                    placeholder="you@example.com"
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    type="password" name="password" required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 placeholder-gray-400 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all shadow-sm"
                    placeholder="••••••••"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Demographics Row */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Age</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <input
                      type="number" name="age"
                      className="block w-full pl-8 pr-2 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 placeholder-gray-400 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all shadow-sm"
                      placeholder="Years"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Weight (kg)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <Scale className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <input
                      type="number" name="weight"
                      className="block w-full pl-8 pr-2 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 placeholder-gray-400 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all shadow-sm"
                      placeholder="kg"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Height (cm)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                      <Ruler className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <input
                      type="number" name="height"
                      className="block w-full pl-8 pr-2 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 placeholder-gray-400 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all shadow-sm"
                      placeholder="cm"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-md hover:shadow-lg disabled:opacity-70 dark:focus:ring-offset-gray-900"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Create Account
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
