import React, { useState, useRef } from 'react';
import { Card } from '../components/ui/Card';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Bot, Sparkles, Loader2, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const AiSuggestions = () => {
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const reportRef = useRef();

  const getSuggestion = async () => {
    setLoading(true);
    setSuggestion('');
    try {
      // Gather all health data to send to the AI
      const mealsRes = await api.get('/meals');
      const workoutsRes = await api.get('/workouts');
      const sleepRes = await api.get('/sleep');
      const waterRes = await api.get('/water');

      const healthData = {
        meals: mealsRes.data,
        workouts: workoutsRes.data,
        sleep: sleepRes.data,
        water: waterRes.data
      };

      const res = await api.post('/ai/recommend', { healthData });
      setSuggestion(res.data.recommendation);
      toast.success('Recommendation generated!');
    } catch (err) {
      toast.error('Failed to get recommendation. Make sure you have logged some data first.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    const element = reportRef.current;
    const opt = {
      margin:       1,
      filename:     'AI_Health_Report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
    toast.success('Downloading your health report...');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
        <div className="p-4 bg-gradient-to-br from-primary-400 to-purple-600 rounded-2xl shadow-lg">
          <Bot size={56} className="text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400">
          Your Personal AI Coach
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-lg">
          Our AI analyzes your logged meals, workouts, sleep, and water intake to provide personalized, actionable health recommendations.
        </p>
      </div>

      <div className="flex justify-center space-x-4 pb-8">
        <button
          onClick={getSuggestion}
          disabled={loading}
          className="group flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-70 disabled:hover:-translate-y-0"
        >
          {loading ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} className="group-hover:animate-pulse" />}
          <span>{loading ? 'Analyzing your data...' : 'Generate Insights'}</span>
        </button>

        {suggestion && !loading && (
          <button
            onClick={handleDownloadPdf}
            className="flex items-center space-x-2 bg-white text-primary-600 hover:bg-gray-50 border border-primary-200 px-6 py-4 rounded-full font-bold shadow-sm hover:shadow-md transition-all"
          >
            <Download size={20} />
            <span>Download PDF</span>
          </button>
        )}
      </div>

      <Card hoverable className={`relative overflow-hidden min-h-[300px] transition-all duration-500 ${suggestion ? 'opacity-100 translate-y-0' : loading ? 'opacity-50' : 'opacity-0 translate-y-4 hidden'}`}>
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary-400 to-purple-600"></div>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 size={48} className="animate-spin text-primary-500" />
            <p className="text-lg text-gray-500 dark:text-gray-400 animate-pulse">Thinking deeply about your habits...</p>
          </div>
        ) : suggestion && (
          <div ref={reportRef} className="p-8 prose prose-primary dark:prose-invert max-w-none bg-white dark:bg-gray-800 rounded-lg">
            <h3 className="flex items-center text-xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-4 dark:border-gray-700">
              <Sparkles className="mr-2 text-primary-500" />
              AI Analysis & Health Report
            </h3>
            <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
              {suggestion}
            </div>
            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-400 text-center">
              Generated by AI Health Tracker
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AiSuggestions;
