import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { User, Target, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  
  // Default fallback values if goals aren't set yet
  const defaultGoals = user?.goals || { calories: 2000, water: 2.5, sleep: 8 };
  
  const [formData, setFormData] = useState({
    age: user?.age || '',
    weight: user?.weight || '',
    height: user?.height || '',
    goals: {
      calories: defaultGoals.calories,
      water: defaultGoals.water,
      sleep: defaultGoals.sleep
    }
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile(formData);
      toast.success('Profile and Goals updated successfully! 🎉');
      setIsEditing(false);
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile & Goals</h1>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-gray-800 dark:text-white font-medium transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hoverable className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center space-x-6 mb-8">
            <div className="bg-primary-100 p-4 rounded-full text-primary-600 shadow-inner">
              <User className="h-12 w-12" />
            </div>
            <div>
              <h2 className="text-2xl font-bold dark:text-white">{user.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 border-b dark:border-gray-700 pb-2">Body Metrics</h3>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age (yrs)</label>
                <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight (kg)</label>
                <input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Height (cm)</label>
                <input type="number" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} className="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Age</p>
                <p className="text-xl font-bold text-primary-600">{user.age || '--'}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Weight</p>
                <p className="text-xl font-bold text-primary-600">{user.weight || '--'} kg</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Height</p>
                <p className="text-xl font-bold text-primary-600">{user.height || '--'} cm</p>
              </div>
            </div>
          )}
        </Card>

        <Card hoverable className="h-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-100 dark:border-indigo-900/50">
          <div className="flex items-center space-x-3 mb-6 border-b border-indigo-200 dark:border-indigo-800 pb-4">
            <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Target size={24} />
            </div>
            <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-100">Daily Goals</h2>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Calories (kcal)</label>
                <input type="number" value={formData.goals.calories} onChange={e => setFormData({...formData, goals: {...formData.goals, calories: e.target.value}})} className="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Water (Liters)</label>
                <input type="number" step="0.1" value={formData.goals.water} onChange={e => setFormData({...formData, goals: {...formData.goals, water: e.target.value}})} className="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Sleep (Hours)</label>
                <input type="number" step="0.5" value={formData.goals.sleep} onChange={e => setFormData({...formData, goals: {...formData.goals, sleep: e.target.value}})} className="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-indigo-100 dark:border-gray-700 flex justify-between items-center">
                <span className="font-medium text-gray-700 dark:text-gray-300">🔥 Calories</span>
                <span className="text-xl font-bold text-orange-500">{user.goals?.calories || 2000} kcal</span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-indigo-100 dark:border-gray-700 flex justify-between items-center">
                <span className="font-medium text-gray-700 dark:text-gray-300">💧 Water</span>
                <span className="text-xl font-bold text-cyan-500">{user.goals?.water || 2.5} L</span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-indigo-100 dark:border-gray-700 flex justify-between items-center">
                <span className="font-medium text-gray-700 dark:text-gray-300">🌙 Sleep</span>
                <span className="text-xl font-bold text-indigo-500">{user.goals?.sleep || 8} hrs</span>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="mt-8">
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
              >
                <Save size={18} />
                <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Profile;
