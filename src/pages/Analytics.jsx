import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { 
  BarChart3, TrendingUp, Users, 
  ArrowUpRight, ArrowDownRight, Calendar, 
  Download, Activity, Zap, Layout,
  Loader2
} from 'lucide-react';

const Analytics = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [barData, setBarData] = useState([]);
  const [months, setMonths] = useState([]);
  const [insights, setInsights] = useState([]);
  const [secondaryStats, setSecondaryStats] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Dashboard Overview Stats
        const statsRes = await axios.get(`${backendUrl}api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // 2. Fetch Sales Analytics (Yearly)
        const salesRes = await axios.get(`${backendUrl}api/dashboard/sales?period=year`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // 3. Fetch Inventory Analytics
        const inventoryRes = await axios.get(`${backendUrl}api/dashboard/inventory`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (statsRes.data.success) {
          const s = statsRes.data.stats;
          setStats([
            { 
              label: 'Total Revenue', 
              value: `$${(s.totals.revenue / 1000).toFixed(1)}k`, 
              growth: '+12.5%', 
              icon: TrendingUp, 
              positive: true 
            },
            { 
              label: 'Active Users', 
              value: s.totals.users.toLocaleString(), 
              growth: '+3.2%', 
              icon: Users, 
              positive: true 
            },
            { 
              label: 'Avg Order Value', 
              value: `$${s.totals.averageOrderValue}`, 
              growth: '+5.4%', 
              icon: Zap, 
              positive: true 
            },
            { 
              label: 'Total Orders', 
              value: s.totals.orders.toLocaleString(), 
              growth: '+1.1%', 
              icon: Activity, 
              positive: true 
            },
          ]);

          setSecondaryStats([
            { label: 'Today\'s Revenue', value: `$${s.today.revenue}`, sub: 'From recent orders', icon: Activity },
            { label: 'Weekly Revenue', value: `$${s.thisWeek.revenue}`, sub: 'Last 7 days', icon: Users },
            { label: 'Monthly Revenue', value: `$${s.thisMonth.revenue}`, sub: 'Last 30 days', icon: TrendingUp },
          ]);
        }

        if (salesRes.data.success) {
          const analytics = salesRes.data.analytics;
          setBarData(analytics.map(item => item.revenue));
          setMonths(analytics.map(item => item.period));
        }

        if (inventoryRes.data.success) {
          const inv = inventoryRes.data.analytics;
          setInsights([
            { label: 'Inventory Health', value: 91 },
            { label: 'Bestseller Ratio', value: Math.round((inv.bestsellers / inv.totalProducts) * 100) || 0 },
            { label: 'User Retention', value: 74 },
          ]);
        }

      } catch (error) {
        console.error('Analytics fetch error:', error);
        toast.error('Failed to synchronize analytics data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAnalyticsData();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Synchronizing Global Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-indigo-600 uppercase mb-1">Reporting</p>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-indigo-600/40 shadow-lg shadow-indigo-600/10"
              style={{ background: 'rgba(79, 70, 229, 0.1)' }}
            >
              <BarChart3 size={18} className="text-indigo-600" />
            </div>
            Business Intelligence
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-[11px] font-black text-neutral-700 uppercase tracking-widest shadow-sm">
            <Calendar size={13} className="text-indigo-600" />
            Rolling 12 Months
          </div>
          <button
            className="p-2.5 text-white rounded-xl transition-all hover:-translate-y-0.5 border border-indigo-600/40 bg-indigo-600 shadow-xl shadow-indigo-600/20"
          >
            <Download size={15} />
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white border border-neutral-200 p-6 rounded-2xl hover:border-indigo-600/40 hover:shadow-xl hover:shadow-indigo-600/5 transition-all group"
          >
            <div className="flex justify-between items-start mb-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center border border-indigo-600/30 group-hover:scale-105 transition-transform duration-300 shadow-sm"
                style={{ background: 'rgba(79, 70, 229, 0.08)', color: '#4F46E5' }}
              >
                <stat.icon size={18} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg border ${
                stat.positive
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : 'text-red-600 bg-red-50 border-red-200'
              }`}>
                {stat.positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                {stat.growth}
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-2">{stat.label}</p>
            <h3 className="text-2xl font-black text-neutral-900 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-3xl p-7 shadow-sm">
          <div className="flex justify-between items-start mb-7 pb-5 border-b border-neutral-100">
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] text-indigo-600 uppercase">Performance</p>
              <h3 className="text-lg font-black text-neutral-900 mt-0.5">Revenue Growth Overview</h3>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
              Net Revenue
            </div>
          </div>

          {/* Bar Chart */}
          <div className="h-[260px] w-full flex items-end gap-2 px-2">
            {barData.map((val, i) => {
              const maxVal = Math.max(...barData, 1);
              const heightPercentage = (val / maxVal) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
                  <div
                    className="w-full rounded-t-lg transition-all duration-700 hover:bg-indigo-600 cursor-pointer relative shadow-sm"
                    style={{
                      height: `${heightPercentage * 2.2}px`,
                      background: val === maxVal
                        ? '#4F46E5'
                        : 'rgba(79, 70, 229, 0.2)',
                      transitionDelay: `${i * 40}ms`
                    }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                      ${val.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-tighter">{months[i]}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-between">
            <p className="text-[11px] font-semibold text-neutral-600">
              Peak Month Strategy: <span className="font-black text-indigo-600 uppercase tracking-widest">{months[barData.indexOf(Math.max(...barData))]}</span>
            </p>
            <button className="text-[10px] font-black text-neutral-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
              Optimization Docs <ArrowUpRight size={10} />
            </button>
          </div>
        </div>

        {/* Insights Panel */}
        <div
          className="rounded-3xl p-8 flex flex-col justify-between border border-neutral-900 shadow-2xl relative overflow-hidden"
          style={{ background: '#0F172A' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl rounded-full"></div>
          
          <div className="relative z-10">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8 border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
              style={{ background: 'rgba(79, 70, 229, 0.15)' }}
            >
              <Zap size={22} className="text-indigo-400" />
            </div>
            <p className="text-[10px] font-bold tracking-[0.4em] text-indigo-400 uppercase mb-2">Neural Insights</p>
            <h3 className="text-2xl font-black text-white tracking-tight mb-4">Core Intelligence</h3>
            <p className="text-slate-400 text-[13px] leading-relaxed font-medium">
              Aggregating transactional matrices and user behavior tokens to generate real-time business health indices.
            </p>
          </div>

          <div className="mt-10 space-y-6 relative z-10">
            {insights.map(({ label, value }) => (
              <div
                key={label}
                className="p-5 rounded-2xl border border-white/5 backdrop-blur-sm"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] mb-3 font-black">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-indigo-400">{value}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-1000 shadow-lg shadow-indigo-500/50"
                    style={{ width: `${value}%`, background: 'linear-gradient(90deg, #4F46E5, #818CF8)' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
            <button
              className="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:bg-indigo-600 hover:text-white border border-indigo-500/20 text-indigo-400 flex items-center justify-center gap-2 group"
              style={{ background: 'rgba(79, 70, 229, 0.1)' }}
            >
              Synthesize Detailed Report <TrendingUp size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Secondary Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        {secondaryStats.map(({ label, value, sub, icon: Icon }) => (
          <div
            key={label}
            className="bg-white border border-neutral-200 rounded-3xl p-8 hover:border-indigo-600/40 hover:shadow-xl hover:shadow-indigo-600/5 transition-all group shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">{label}</p>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center border border-indigo-600/20 group-hover:scale-110 transition-transform shadow-sm"
                style={{ background: 'rgba(79, 70, 229, 0.05)', color: '#4F46E5' }}
              >
                <Icon size={16} />
              </div>
            </div>
            <p className="text-3xl font-black text-neutral-900 tracking-tight">{value}</p>
            <p className="text-[11px] text-slate-400 font-bold mt-2 uppercase tracking-widest">{sub}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Analytics;