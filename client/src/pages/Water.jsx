import React, { useState, useEffect, useContext } from 'react';
import { Card } from '../components/ui/Card';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Droplets, PlusCircle, Trash2, Info } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const HumanoidSilhouette = ({ percentage }) => {
  const svgPath = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 200'%3E%3Cpath d='M50,10 C58,10 65,17 65,25 C65,33 58,40 50,40 C42,40 35,33 35,25 C35,17 42,10 50,10 Z M25,50 C25,45 30,40 40,45 C45,47.5 55,47.5 60,45 C70,40 75,45 75,50 L80,100 C80,105 75,110 70,105 L65,80 L65,190 C65,195 60,200 55,200 L50,190 L45,200 C40,200 35,195 35,190 L35,80 L30,105 C25,110 20,105 20,100 L25,50 Z'/%3E%3C/svg%3E";

  return (
    <div 
      className="relative w-48 h-72 mx-auto drop-shadow-xl bg-gray-200 dark:bg-gray-700 overflow-hidden"
      style={{
        maskImage: `url("${svgPath}")`,
        WebkitMaskImage: `url("${svgPath}")`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
      }}
    >
      {/* Fill shape (water) - A rectangle that grows from the bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-cyan-400 transition-all duration-1000 ease-out"
        style={{ height: `${Math.min(100, Math.max(0, percentage))}%` }}
      >
        {/* Wave effect overlay */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-white/30 animate-pulse blur-sm rounded-t-full scale-110"></div>
      </div>
    </div>
  );
};

const Water = () => {
  const { user } = useContext(AuthContext);
  const [waterLogs, setWaterLogs] = useState([]);
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('ml');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchWater();
  }, []);

  const fetchWater = async () => {
    try {
      const res = await api.get('/water');
      setWaterLogs(res.data);
    } catch (err) {
      toast.error('Failed to load water logs');
    }
  };

  const handleAddWater = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Convert to ML if user selected Liters
    const amountInMl = unit === 'L' ? parseFloat(amount) * 1000 : parseFloat(amount);

    try {
      const res = await api.post('/water/add', { amount: amountInMl });
      setWaterLogs([res.data, ...waterLogs]);
      setAmount('');
      toast.success('Water logged successfully! 💧🎉');
    } catch (err) {
      toast.error('Failed to add water');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/water/${id}`);
      setWaterLogs(waterLogs.filter(w => w._id !== id));
      toast.success('Log deleted');
    } catch (err) {
      toast.error('Failed to delete log');
    }
  };

  // Calculate today's hydration status
  // Calculate today's hydration status
  const parsedGoalLiters = Number(user?.goals?.water);
  const dailyTargetLiters = (parsedGoalLiters > 0) ? parsedGoalLiters : 2.0;
  const dailyTargetMl = dailyTargetLiters * 1000;
  
  const todaysTotalMl = waterLogs
    .filter(w => new Date(w.date).toDateString() === new Date().toDateString())
    .reduce((sum, w) => sum + w.amount, 0);
  
  const todaysTotalLiters = (todaysTotalMl / 1000).toFixed(1);
  const percentage = (todaysTotalMl / dailyTargetMl) * 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hydration Tracker</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card hoverable className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800">
            <h2 className="text-xl font-bold text-cyan-700 dark:text-cyan-400 mb-6">Your Daily Body Hydration</h2>
            
            <HumanoidSilhouette percentage={percentage} />
            
            <div className="mt-6 space-y-2">
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                For your body you should drink <span className="font-bold text-cyan-600 dark:text-cyan-400">{dailyTargetLiters} Litres</span> minimum...
              </p>
              <p className="text-md text-gray-600 dark:text-gray-400">
                But you have drank only <span className="font-bold text-blue-600 dark:text-blue-400">{todaysTotalLiters} Litres</span>
              </p>
            </div>
          </Card>

          <Card hoverable>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Log Water</h2>
            <form onSubmit={handleAddWater} className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="number" step="0.1" placeholder="Amount" required
                  className="w-2/3 px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-center text-lg"
                  value={amount} onChange={e => setAmount(e.target.value)}
                />
                <select 
                  className="w-1/3 px-2 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-center text-lg appearance-none cursor-pointer"
                  value={unit} onChange={e => setUnit(e.target.value)}
                >
                  <option value="ml">ml</option>
                  <option value="L">Liters</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 shadow-md hover:shadow-lg transition-all disabled:opacity-70"
              >
                <PlusCircle size={18} />
                <span>{isSubmitting ? 'Logging...' : 'Add Water'}</span>
              </button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card hoverable className="bg-blue-50/50 dark:bg-gray-800/50 border border-blue-100 dark:border-gray-700">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full shrink-0">
                <Info size={24} className="text-blue-500" />
              </div>
              <div>
                <h3 className="text-md font-bold text-gray-900 dark:text-white mb-1">Did you know?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  For most average, healthy adults in a temperate climate, the recommended total daily fluid intake—including water, other beverages, and food—is approximately 15.5 cups (3.7 liters) for men and 11.5 cups (2.7 liters) for women. This guideline is meant to replace water lost through breathing, sweat, and urine.
                </p>
              </div>
            </div>
          </Card>

          <Card hoverable className="h-full">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Hydration History</h2>
            {waterLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500">
                <Droplets size={48} className="mb-4 opacity-50 text-cyan-400" />
                <p className="text-lg font-medium">No water logged yet</p>
                <p className="text-sm">Drink a glass and log it here!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {waterLogs.map((log) => (
                      <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(log.date).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-cyan-500 font-bold">
                          {log.amount >= 1000 ? `${(log.amount / 1000).toFixed(1)} L` : `${log.amount} ml`}
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

export default Water;
