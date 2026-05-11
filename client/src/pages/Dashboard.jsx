import React, { useState, useEffect, useContext } from 'react';
import { Card } from '../components/ui/Card';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Activity, Flame, Droplets, Moon, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState({ calories: 0, burned: 0, water: 0, sleep: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Default goals if not set
  const goals = user?.goals || { calories: 2000, water: 2.5, sleep: 8 };

  // Calculate percentages
  const caloriesPct = Math.min(100, Math.round((summary.calories / goals.calories) * 100)) || 0;
  const waterPct = Math.min(100, Math.round((summary.water / goals.water) * 100)) || 0;
  const sleepPct = Math.min(100, Math.round((summary.sleep / goals.sleep) * 100)) || 0;

  useEffect(() => {
    fetchSummary();
    
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchSummary = async () => {
    try {
      const mealsRes = await api.get('/meals');
      const workoutsRes = await api.get('/workouts');
      const waterRes = await api.get('/water');
      const sleepRes = await api.get('/sleep');

      const today = new Date().setHours(0, 0, 0, 0);

      const todayMeals = mealsRes.data.filter(m => new Date(m.date).setHours(0, 0, 0, 0) === today);
      const totalCalories = todayMeals.reduce((acc, meal) => acc + meal.calories, 0);

      const todayWorkouts = workoutsRes.data.filter(w => new Date(w.date).setHours(0, 0, 0, 0) === today);
      const totalBurned = todayWorkouts.reduce((acc, w) => acc + w.caloriesBurned, 0);

      const todayWater = waterRes.data.filter(w => new Date(w.date).setHours(0, 0, 0, 0) === today);
      const totalWater = todayWater.reduce((acc, w) => acc + w.amount, 0) / 1000; // Assuming input is ml, convert to L

      const todaySleep = sleepRes.data.filter(s => new Date(s.date).setHours(0, 0, 0, 0) === today);
      const totalSleep = todaySleep.reduce((acc, s) => acc + s.duration, 0);

      setSummary({ calories: totalCalories, burned: totalBurned, water: totalWater, sleep: totalSleep });
      
      // Trigger confetti if all daily goals are met!
      if (totalCalories >= goals.calories && totalWater >= goals.water && totalSleep >= goals.sleep) {
        if (!localStorage.getItem('confettiShownToday_' + today)) {
          setShowConfetti(true);
          localStorage.setItem('confettiShownToday_' + today, 'true');
          setTimeout(() => setShowConfetti(false), 8000);
          toast.success('Congratulations! You hit all your daily goals! 🎉', { duration: 5000 });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const quickLogWater = async () => {
    try {
      await api.post('/water/add', { amount: 250 }); // Add 250ml
      toast.success('Quick Log: 250ml water added! 💧');
      fetchSummary();
      // Show mini confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (err) {
      toast.error('Failed to log water');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const quotes = [
    "The only bad workout is the one that didn't happen.",
    "Don't stop when you're tired. Stop when you're done.",
    "Small daily improvements are the key to staggering long-term results.",
    "Your body can stand almost anything. It’s your mind that you have to convince.",
    "Take care of your body. It’s the only place you have to live."
  ];
  const dailyQuote = quotes[new Date().getDay() % quotes.length];

  return (
    <div className="space-y-8 pb-12 relative">
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-gradient-to-r from-primary-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="z-10">
          <p className="text-primary-100 font-medium mb-1 uppercase tracking-wider text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <h1 className="text-4xl font-extrabold mb-2">{getGreeting()}, {user?.name.split(' ')[0]}! 🚀</h1>
          <p className="text-lg text-primary-50 max-w-xl italic">"{dailyQuote}"</p>
        </div>
        <div className="z-10">
          <button onClick={quickLogWater} className="bg-white text-primary-600 hover:bg-primary-50 font-bold py-3 px-6 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2">
            <Droplets size={20} />
            <span>Quick Add Water (250ml)</span>
          </button>
        </div>
      </div>

      {/* Progress Rings Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Daily Goals Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Calories Ring */}
          <Card className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-800 border border-orange-100 dark:border-gray-700">
            <div className="w-48 h-48">
              <CircularProgressbarWithChildren 
                value={caloriesPct} 
                styles={buildStyles({ pathColor: '#f97316', trailColor: 'rgba(249, 115, 22, 0.1)', strokeLinecap: 'round' })}
                strokeWidth={8}
              >
                <Activity className="h-8 w-8 text-orange-500 mb-2" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{summary.calories}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">/ {goals.calories} kcal</div>
              </CircularProgressbarWithChildren>
            </div>
            <h3 className="mt-6 text-lg font-bold text-gray-800 dark:text-white">Calories</h3>
          </Card>

          {/* Water Ring */}
          <Card className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-white to-cyan-50 dark:from-gray-800 dark:to-gray-800 border border-cyan-100 dark:border-gray-700">
            <div className="w-48 h-48">
              <CircularProgressbarWithChildren 
                value={waterPct} 
                styles={buildStyles({ pathColor: '#06b6d4', trailColor: 'rgba(6, 182, 212, 0.1)', strokeLinecap: 'round' })}
                strokeWidth={8}
              >
                <Droplets className="h-8 w-8 text-cyan-500 mb-2" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{summary.water.toFixed(1)}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">/ {goals.water} L</div>
              </CircularProgressbarWithChildren>
            </div>
            <h3 className="mt-6 text-lg font-bold text-gray-800 dark:text-white">Hydration</h3>
          </Card>

          {/* Sleep Ring */}
          <Card className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-800 border border-indigo-100 dark:border-gray-700">
            <div className="w-48 h-48">
              <CircularProgressbarWithChildren 
                value={sleepPct} 
                styles={buildStyles({ pathColor: '#6366f1', trailColor: 'rgba(99, 102, 241, 0.1)', strokeLinecap: 'round' })}
                strokeWidth={8}
              >
                <Moon className="h-8 w-8 text-indigo-500 mb-2" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{summary.sleep}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">/ {goals.sleep} hrs</div>
              </CircularProgressbarWithChildren>
            </div>
            <h3 className="mt-6 text-lg font-bold text-gray-800 dark:text-white">Sleep</h3>
          </Card>
        </div>
      </div>

      {/* Quick Actions Links */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Link to="/meals" className="group p-4 bg-orange-100 dark:bg-orange-900/40 rounded-2xl flex items-center justify-between hover:bg-orange-200 dark:hover:bg-orange-900/60 transition-colors">
          <div className="flex items-center gap-3"><Activity className="text-orange-600 dark:text-orange-400"/><span className="font-bold text-orange-900 dark:text-orange-100">Log Meal</span></div>
          <Plus className="text-orange-600 dark:text-orange-400 group-hover:scale-125 transition-transform" />
        </Link>
        <Link to="/workouts" className="group p-4 bg-red-100 dark:bg-red-900/40 rounded-2xl flex items-center justify-between hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors">
          <div className="flex items-center gap-3"><Flame className="text-red-600 dark:text-red-400"/><span className="font-bold text-red-900 dark:text-red-100">Log Workout</span></div>
          <Plus className="text-red-600 dark:text-red-400 group-hover:scale-125 transition-transform" />
        </Link>
        <Link to="/water" className="group p-4 bg-cyan-100 dark:bg-cyan-900/40 rounded-2xl flex items-center justify-between hover:bg-cyan-200 dark:hover:bg-cyan-900/60 transition-colors">
          <div className="flex items-center gap-3"><Droplets className="text-cyan-600 dark:text-cyan-400"/><span className="font-bold text-cyan-900 dark:text-cyan-100">Log Water</span></div>
          <Plus className="text-cyan-600 dark:text-cyan-400 group-hover:scale-125 transition-transform" />
        </Link>
        <Link to="/sleep" className="group p-4 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-between hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors">
          <div className="flex items-center gap-3"><Moon className="text-indigo-600 dark:text-indigo-400"/><span className="font-bold text-indigo-900 dark:text-indigo-100">Log Sleep</span></div>
          <Plus className="text-indigo-600 dark:text-indigo-400 group-hover:scale-125 transition-transform" />
        </Link>
        <Link to="/ai-suggestions" className="group p-4 bg-purple-100 dark:bg-purple-900/40 rounded-2xl flex items-center justify-between hover:bg-purple-200 dark:hover:bg-purple-900/60 transition-colors col-span-2 md:col-span-1 lg:col-span-1">
          <div className="flex items-center gap-3"><span className="text-xl">🤖</span><span className="font-bold text-purple-900 dark:text-purple-100">AI Coach</span></div>
          <ArrowRight className="text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
