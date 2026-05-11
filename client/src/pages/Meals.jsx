import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Utensils, PlusCircle, Trash2, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [newMeal, setNewMeal] = useState({ mealName: '', calories: '', protein: '', carbs: '', fats: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const res = await api.get('/meals');
      setMeals(res.data);
    } catch (err) {
      toast.error('Failed to load meals');
    }
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post('/meals/add', newMeal);
      setMeals([res.data, ...meals]);
      setNewMeal({ mealName: '', calories: '', protein: '', carbs: '', fats: '' });
      toast.success('Meal added successfully!');
    } catch (err) {
      toast.error('Failed to add meal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/meals/${id}`);
      setMeals(meals.filter(meal => meal._id !== id));
      toast.success('Meal deleted');
    } catch (err) {
      toast.error('Failed to delete meal');
    }
  };

  // Calculate today's macros
  const today = new Date().toDateString();
  const todaysMeals = meals.filter(m => new Date(m.date).toDateString() === today);
  
  const totalProtein = todaysMeals.reduce((sum, meal) => sum + (parseFloat(meal.protein) || 0), 0);
  const totalCarbs = todaysMeals.reduce((sum, meal) => sum + (parseFloat(meal.carbs) || 0), 0);
  const totalFats = todaysMeals.reduce((sum, meal) => sum + (parseFloat(meal.fats) || 0), 0);

  const macroData = [
    { name: 'Protein (g)', value: totalProtein, color: '#8b5cf6' }, // Purple
    { name: 'Carbs (g)', value: totalCarbs, color: '#3b82f6' },   // Blue
    { name: 'Fats (g)', value: totalFats, color: '#eab308' },    // Yellow
  ];

  const hasMacros = totalProtein > 0 || totalCarbs > 0 || totalFats > 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meals & Nutrition</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card hoverable>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Log a Meal</h2>
            <form onSubmit={handleAddMeal} className="space-y-4">
              <input
                type="text" placeholder="Meal Name (e.g., Chicken Salad)" required
                className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                value={newMeal.mealName} onChange={e => setNewMeal({...newMeal, mealName: e.target.value})}
              />
              <input
                type="number" placeholder="Calories" required
                className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                value={newMeal.calories} onChange={e => setNewMeal({...newMeal, calories: e.target.value})}
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number" placeholder="Protein (g)"
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                  value={newMeal.protein} onChange={e => setNewMeal({...newMeal, protein: e.target.value})}
                />
                <input
                  type="number" placeholder="Carbs (g)"
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                  value={newMeal.carbs} onChange={e => setNewMeal({...newMeal, carbs: e.target.value})}
                />
                <input
                  type="number" placeholder="Fats (g)"
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                  value={newMeal.fats} onChange={e => setNewMeal({...newMeal, fats: e.target.value})}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-md hover:shadow-lg transition-all disabled:opacity-70"
              >
                <PlusCircle size={18} />
                <span>{isSubmitting ? 'Adding...' : 'Add Meal'}</span>
              </button>
            </form>
          </Card>

          <Card hoverable className="text-center">
            <h2 className="flex items-center justify-center text-lg font-medium text-gray-900 dark:text-white mb-4 space-x-2">
              <PieChartIcon className="text-primary-500" />
              <span>Today's Macros</span>
            </h2>
            <div className="h-48 w-full flex items-center justify-center">
              {hasMacros ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroData.filter(d => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-sm text-gray-400">
                  <p>Log your meals to see your daily macro breakdown.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card hoverable className="h-full">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Meals</h2>
            {meals.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500">
                <Utensils size={48} className="mb-4 opacity-50" />
                <p className="text-lg font-medium">No meals logged yet</p>
                <p className="text-sm">Log your first meal to start tracking!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Meal</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Calories</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Macros (P/C/F)</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {meals.map((meal) => (
                      <tr key={meal._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(meal.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {meal.mealName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-primary-600 font-semibold">
                          {meal.calories} kcal
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <span className="text-purple-500 font-medium">{meal.protein || 0}g</span> / <span className="text-blue-500 font-medium">{meal.carbs || 0}g</span> / <span className="text-yellow-500 font-medium">{meal.fats || 0}g</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleDelete(meal._id)} className="text-red-500 hover:text-red-700 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Meals;
