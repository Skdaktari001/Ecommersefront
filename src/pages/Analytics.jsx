import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { 
  BarChart3, TrendingUp, Users, 
  ArrowUpRight, ArrowDownRight, Calendar, 
  Download, Activity, Zap, Loader2
} from 'lucide-react';

const Analytics = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [barData, setBarData] = useState([]);
  const [months, setMonths] = useState([]);
  const [secondaryStats, setSecondaryStats] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);

        const statsRes = await axios.get(`${backendUrl}api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const salesRes = await axios.get(`${backendUrl}api/dashboard/sales?period=year`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (statsRes.data.success) {
          const s = statsRes.data.stats;

          setStats([
            { label: 'Revenue', value: `$${(s.totals.revenue / 1000).toFixed(1)}k`, growth: '+12.5%', icon: TrendingUp, positive: true },
            { label: 'Users', value: s.totals.users.toLocaleString(), growth: '+3.2%', icon: Users, positive: true },
            { label: 'Avg Order', value: `$${s.totals.averageOrderValue}`, growth: '+5.4%', icon: Zap, positive: true },
            { label: 'Orders', value: s.totals.orders.toLocaleString(), growth: '+1.1%', icon: Activity, positive: true },
          ]);

          setSecondaryStats([
            { label: 'Today', value: `$${s.today.revenue}`, sub: 'Revenue today', icon: Activity },
            { label: 'This Week', value: `$${s.thisWeek.revenue}`, sub: 'Last 7 days', icon: Users },
            { label: 'This Month', value: `$${s.thisMonth.revenue}`, sub: 'Last 30 days', icon: TrendingUp },
          ]);
        }

        if (salesRes.data.success) {
          const analytics = salesRes.data.analytics;
          setBarData(analytics.map(item => item.revenue));
          setMonths(analytics.map(item => item.period));
        }

      } catch (error) {
        console.error(error);
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchAnalyticsData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-xl border-2 border-[#D4AF37]/20"></div>
          <div className="absolute inset-0 rounded-xl border-t-2 border-[#D4AF37] animate-spin"></div>
        </div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
          Loading Analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl px-4 py-8">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-1">
            Insights
          </p>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#D4AF37]/40"
              style={{ background: 'rgba(212,175,55,0.1)' }}>
              <BarChart3 size={18} style={{ color: '#D4AF37' }} />
            </div>
            Analytics
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 rounded-xl text-[11px] font-bold text-neutral-700">
            <Calendar size={13} style={{ color: '#D4AF37' }} />
            12 Months
          </div>
          <button className="p-2.5 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50">
            <Download size={14} />
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i}
            className="bg-white border border-neutral-200 p-5 rounded-2xl hover:border-[#D4AF37]/40 hover:shadow-lg transition-all">

            <div className="flex justify-between items-center mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-[#D4AF37]/30"
                style={{ background: 'rgba(212,175,55,0.08)' }}>
                <stat.icon size={16} style={{ color: '#D4AF37' }} />
              </div>

              <div className={`text-[10px] font-bold px-2 py-1 rounded-lg border flex items-center gap-1
                ${stat.positive
                  ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                  : 'text-red-500 bg-red-50 border-red-200'
                }`}>
                {stat.positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {stat.growth}
              </div>
            </div>

            <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">
              {stat.label}
            </p>
            <h3 className="text-xl font-black text-neutral-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* ── Chart ── */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-8">
        <div className="flex justify-between mb-6">
          <div>
            <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">
              Revenue
            </p>
            <h3 className="text-lg font-black text-neutral-900">
              Monthly Performance
            </h3>
          </div>
        </div>

        <div className="flex items-end gap-2 h-56">
          {barData.map((val, i) => {
            const max = Math.max(...barData, 1);
            const height = (val / max) * 100;

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-lg"
                  style={{
                    height: `${height * 2}px`,
                    background: val === max
                      ? '#D4AF37'
                      : 'rgba(212,175,55,0.2)'
                  }}
                />
                <span className="text-[9px] font-bold text-neutral-400">
                  {months[i]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Secondary Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {secondaryStats.map(({ label, value, sub, icon: Icon }) => (
          <div key={label}
            className="bg-white border border-neutral-200 p-6 rounded-2xl hover:border-[#D4AF37]/40 hover:shadow-lg transition-all">

            <div className="flex justify-between mb-4">
              <p className="text-[10px] font-bold uppercase text-neutral-500 tracking-widest">
                {label}
              </p>
              <Icon size={14} style={{ color: '#D4AF37' }} />
            </div>

            <h3 className="text-xl font-black text-neutral-900">{value}</h3>
            <p className="text-[11px] text-neutral-400 font-medium mt-1">{sub}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Analytics;