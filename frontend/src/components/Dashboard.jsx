import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import StatCard from './StatCard';
import TrendChart from './TrendChart';
import LiveLog from './LiveLog';

// Connect to backend via Nginx proxy
const socket = io('/', { path: '/socket.io' });
const API_URL = '/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    job_count: 0,
    quote_count: 0,
    top_keywords: [],
    latest_jobs: [],
    latest_quotes: []
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial fetch
    fetchStats();

    // Socket listeners
    socket.on('connect', () => {
      addLog('Connected to Real-Time Server');
    });

    socket.on('update_event', (data) => {
      console.log('Received event:', data);
      if (data.type === 'log') {
        addLog(data.message);
      } else if (data.type === 'stats') {
        setStats(data.data);
        addLog('Statistics updated');
        setLoading(false);
      } else if (data.type === 'status') {
         if (data.status === 'running') setLoading(true);
         if (data.status === 'idle') setLoading(false);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('update_event');
    };
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`);
      if (response.data && !response.data.message) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      addLog("Error fetching initial stats");
    }
  };

  const triggerScrape = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/trigger`);
      addLog("Scraping process triggered...");
    } catch (error) {
      console.error("Error triggering scrape:", error);
      addLog("Failed to trigger scrape");
      setLoading(false);
    }
  };

  const addLog = (message) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { time, message }]);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            DevPulse Monitor
          </h1>
          <p className="text-gray-400 mt-2">Real-time Tech Trend Analysis</p>
        </div>
        <button
          onClick={triggerScrape}
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-bold shadow-lg transition-all ${
            loading
              ? 'bg-gray-700 cursor-not-allowed text-gray-400'
              : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/50'
          }`}
        >
          {loading ? 'Scraping in Progress...' : 'Trigger New Scrape'}
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Python Jobs Scraped" 
          value={stats.job_count} 
          color="border-blue-500" 
        />
        <StatCard 
          title="Quotes Extracted" 
          value={stats.quote_count} 
          color="border-green-500" 
        />
        <StatCard 
          title="Top Keyword" 
          value={stats.top_keywords.length > 0 ? stats.top_keywords[0].keyword : 'N/A'} 
          color="border-purple-500" 
        />
        <StatCard 
          title="System Status" 
          value={loading ? 'RUNNING' : 'IDLE'} 
          color={loading ? 'border-yellow-500' : 'border-gray-500'} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-8">
            <TrendChart data={stats.top_keywords} />
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4">Latest Processed Jobs</h3>
                 <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                            <tr>
                                <th className="px-6 py-3">Title</th>
                                <th className="px-6 py-3">Company</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.latest_jobs.map((job, idx) => (
                                <tr key={idx} className="border-b bg-gray-800 border-gray-700">
                                    <td className="px-6 py-4 font-medium text-white">{job.title}</td>
                                    <td className="px-6 py-4">{job.company}</td>
                                </tr>
                            ))}
                            {stats.latest_jobs.length === 0 && (
                                <tr><td colSpan="2" className="px-6 py-4 text-center">No jobs found</td></tr>
                            )}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>

        {/* Live Log Section */}
        <div className="lg:col-span-1">
          <LiveLog logs={logs} />
          
          <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
             <h3 className="text-xl font-bold text-white mb-4">Latest Wisdom</h3>
             <div className="space-y-4">
                {stats.latest_quotes.map((q, i) => (
                    <blockquote key={i} className="border-l-4 border-green-500 pl-4 italic text-gray-300">
                        "{q.text}"
                        <footer className="text-sm text-gray-500 mt-1">- {q.author}</footer>
                    </blockquote>
                ))}
                 {stats.latest_quotes.length === 0 && <p className="text-gray-500">No quotes yet.</p>}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
