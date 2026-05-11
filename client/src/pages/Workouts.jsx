import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Dumbbell, PlusCircle, Trash2 } from 'lucide-react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [newWorkout, setNewWorkout] = useState({ exercise: '', duration: '', caloriesBurned: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await api.get('/workouts');
      setWorkouts(res.data);
    } catch (err) {
      toast.error('Failed to load workouts');
    }
  };

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post('/workouts/add', newWorkout);
      setWorkouts([res.data, ...workouts]);
      setNewWorkout({ exercise: '', duration: '', caloriesBurned: '' });
      toast.success('Workout added successfully!');
    } catch (err) {
      toast.error('Failed to add workout');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/workouts/${id}`);
      setWorkouts(workouts.filter(w => w._id !== id));
      toast.success('Workout deleted');
    } catch (err) {
      toast.error('Failed to delete workout');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fitness & Workouts</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card hoverable>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Log a Workout</h2>
            <form onSubmit={handleAddWorkout} className="space-y-4">
              <input
                type="text" placeholder="Exercise (e.g., Running)" required
                className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                value={newWorkout.exercise} onChange={e => setNewWorkout({...newWorkout, exercise: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number" placeholder="Duration (min)" required
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  value={newWorkout.duration} onChange={e => setNewWorkout({...newWorkout, duration: e.target.value})}
                />
                <input
                  type="number" placeholder="Calories Burned" required
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  value={newWorkout.caloriesBurned} onChange={e => setNewWorkout({...newWorkout, caloriesBurned: e.target.value})}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md hover:shadow-lg transition-all disabled:opacity-70"
              >
                <PlusCircle size={18} />
                <span>{isSubmitting ? 'Adding...' : 'Add Workout'}</span>
              </button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card hoverable className="h-full">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Workout History</h2>
            {workouts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500">
                <Dumbbell size={48} className="mb-4 opacity-50" />
                <p className="text-lg font-medium">No workouts logged yet</p>
                <p className="text-sm">Log your first workout to stay active!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Exercise</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Calories Burned</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {workouts.map((workout) => (
                      <tr key={workout._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(workout.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {workout.exercise}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {workout.duration} min
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-orange-500 font-semibold">
                          {workout.caloriesBurned} kcal
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleDelete(workout._id)} className="text-red-500 hover:text-red-700 transition-colors">
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

export default Workouts;
