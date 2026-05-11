import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Moon, PlusCircle, Trash2, Info } from 'lucide-react';

const Sleep = () => {
  const [sleepLogs, setSleepLogs] = useState([]);
  const [duration, setDuration] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSleep();
  }, []);

  const fetchSleep = async () => {
    try {
      const res = await api.get('/sleep');
      setSleepLogs(res.data);
    } catch (err) {
      toast.error('Failed to load sleep logs');
    }
  };

  const calculateQuality = (hours) => {
    if (!hours) return null;
    const h = parseFloat(hours);
    if (h >= 7.5 && h <= 9) return { level: 'Excellent', text: 'Optimal for full restorative sleep cycles. You feel energized, alert, and refreshed upon waking.' };
    if (h >= 7 && h < 7.5) return { level: 'Good', text: 'Sufficient for good health. Adequate daytime alertness and cognitive function.' };
    if (h >= 6 && h < 7) return { level: 'Fair', text: 'Known as "short sleep". Potential for mild daytime sleepiness, irritability, or reduced focus.' };
    return { level: 'Poor', text: 'Linked to health issues like hypertension, or may indicate underlying health problems. Result: Low energy, poor mood, reduced productivity.' };
  };

  const qualityData = calculateQuality(duration);

  const handleAddSleep = async (e) => {
    e.preventDefault();
    if (!duration || !qualityData) return;

    setIsSubmitting(true);
    try {
      const res = await api.post('/sleep/add', { duration: parseFloat(duration), quality: qualityData.level });
      setSleepLogs([res.data, ...sleepLogs]);
      setDuration('');
      toast.success('Sleep logged successfully!');
    } catch (err) {
      toast.error('Failed to add sleep log');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/sleep/${id}`);
      setSleepLogs(sleepLogs.filter(s => s._id !== id));
      toast.success('Log deleted');
    } catch (err) {
      toast.error('Failed to delete log');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sleep Tracker</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card hoverable className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
                <Moon size={48} className="text-indigo-500" />
              </div>
            </div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Log Sleep</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Rest is crucial. Track your sleep patterns.</p>
            <form onSubmit={handleAddSleep} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (hours)</label>
                <input
                  type="number" step="0.5" placeholder="e.g. 7.5" required
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-center text-lg"
                  value={duration} onChange={e => setDuration(e.target.value)}
                />
              </div>
              
              {qualityData && (
                <div className={`p-4 rounded-xl border ${
                  qualityData.level === 'Excellent' ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800' :
                  qualityData.level === 'Good' ? 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800' :
                  qualityData.level === 'Fair' ? 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800' :
                  'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800'
                }`}>
                  <div className="flex items-center space-x-2 font-bold mb-1">
                    <Info size={16} />
                    <span>{qualityData.level} Sleep Prediction</span>
                  </div>
                  <p className="text-sm opacity-90">{qualityData.text}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !duration}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all disabled:opacity-70 mt-4"
              >
                <PlusCircle size={18} />
                <span>{isSubmitting ? 'Logging...' : 'Log Sleep'}</span>
              </button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card hoverable className="h-full">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sleep History</h2>
            {sleepLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500">
                <Moon size={48} className="mb-4 opacity-50 text-indigo-400" />
                <p className="text-lg font-medium">No sleep logged yet</p>
                <p className="text-sm">Get some rest and log it here tomorrow!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quality</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {sleepLogs.map((log) => (
                      <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(log.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-indigo-500 font-bold">
                          {log.duration} hrs
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${log.quality === 'Excellent' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                              log.quality === 'Good' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                              log.quality === 'Fair' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {log.quality}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleDelete(log._id)} className="text-red-500 hover:text-red-700 transition-colors">
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

export default Sleep;
