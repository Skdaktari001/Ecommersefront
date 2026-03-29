import React from 'react';
import { 
  BarChart3, TrendingUp, Users, 
  ArrowUpRight, ArrowDownRight, Calendar, 
  Download, Activity, Zap, Layout
} from 'lucide-react';

const Analytics = ({ token }) => {
  const stats = [
    { label: 'Total Revenue', value: '$128.4k', growth: '+12.5%', icon: TrendingUp, positive: true },
    { label: 'Active Users', value: '2,842', growth: '+3.2%', icon: Users, positive: true },
    { label: 'Profit Margin', value: '18.4%', growth: '-0.8%', icon: Zap, positive: false },
    { label: 'Conversion Rate', value: '4.2%', growth: '+1.1%', icon: Activity, positive: true },
  ];

  const barData = [40, 60, 45, 90, 65, 80, 50, 70, 85, 95, 60, 75];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const insights = [
    { label: 'Revenue Analysis', value: 88 },
    { label: 'User Retention', value: 74 },
    { label: 'Inventory Health', value: 91 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-1">Reporting</p>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#D4AF37]/40"
              style={{ background: 'rgba(212,175,55,0.1)' }}
            >
              <BarChart3 size={18} style={{ color: '#D4AF37' }} />
            </div>
            Analytics
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-[11px] font-black text-neutral-700 uppercase tracking-widest">
            <Calendar size={13} style={{ color: '#D4AF37' }} />
            Last 30 Days
          </div>
          <button
            className="p-2.5 text-white rounded-xl transition-all hover:-translate-y-0.5 border border-[#D4AF37]/40"
            style={{ background: '#D4AF37', boxShadow: '0 8px 24px rgba(212,175,55,0.25)' }}
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
            className="bg-white border border-neutral-200 p-6 rounded-2xl hover:border-[#D4AF37]/40 hover:shadow-lg transition-all group"
          >
            <div className="flex justify-between items-start mb-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#D4AF37]/30 group-hover:scale-105 transition-transform duration-300"
                style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37' }}
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
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-2xl p-7">
          <div className="flex justify-between items-start mb-7 pb-5 border-b border-neutral-200">
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-500 uppercase">Performance</p>
              <h3 className="text-base font-black text-neutral-900 mt-0.5">Growth Overview</h3>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-600">
              <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
              Revenue
            </div>
          </div>

          {/* Bar Chart */}
          <div className="h-[260px] w-full flex items-end gap-2 px-2">
            {barData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg transition-all duration-700 hover:opacity-80 cursor-pointer"
                  style={{
                    height: `${val * 2.2}px`,
                    background: val >= 85
                      ? '#D4AF37'
                      : 'rgba(212,175,55,0.2)',
                    transitionDelay: `${i * 40}ms`
                  }}
                ></div>
                <span className="text-[9px] font-bold text-neutral-500 uppercase">{months[i]}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-200 flex items-center justify-between">
            <p className="text-[11px] font-semibold text-neutral-600">
              Peak month: <span className="font-black text-neutral-900">October</span>
            </p>
            <button className="text-[10px] font-black text-neutral-600 uppercase tracking-widest hover:text-[#D4AF37] transition-colors">
              Full Report
            </button>
          </div>
        </div>

        {/* Insights Panel */}
        <div
          className="rounded-2xl p-7 flex flex-col justify-between border border-neutral-800"
          style={{ background: '#111111' }}
        >
          <div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-6 border border-[#D4AF37]/30"
              style={{ background: 'rgba(212,175,55,0.12)' }}
            >
              <Zap size={18} style={{ color: '#D4AF37' }} />
            </div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-1">AI Powered</p>
            <h3 className="text-lg font-black text-white tracking-tight mb-3">Business Insights</h3>
            <p className="text-neutral-400 text-[12px] leading-relaxed font-medium">
              Analyzing market trends and inventory data to surface predictive insights and optimization opportunities.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {insights.map(({ label, value }) => (
              <div
                key={label}
                className="p-4 rounded-xl border border-neutral-700"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div className="flex justify-between text-[10px] uppercase tracking-widest mb-2 font-black">
                  <span className="text-neutral-400">{label}</span>
                  <span style={{ color: '#D4AF37' }}>{value}%</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${value}%`, background: '#D4AF37' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-neutral-800">
            <button
              className="w-full py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all hover:-translate-y-0.5 border border-[#D4AF37]/30"
              style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}
            >
              Generate Full Report
            </button>
          </div>
        </div>
      </div>

      {/* ── Secondary Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        {[
          { label: 'Avg. Session Duration', value: '4m 32s', sub: 'Per user visit', icon: Activity },
          { label: 'Repeat Customers', value: '63%', sub: 'Of total orders', icon: Users },
          { label: 'Monthly Growth', value: '+8.4%', sub: 'vs last month', icon: TrendingUp },
        ].map(({ label, value, sub, icon: Icon }) => (
          <div
            key={label}
            className="bg-white border border-neutral-200 rounded-2xl p-6 hover:border-[#D4AF37]/40 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">{label}</p>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#D4AF37]/30 group-hover:scale-105 transition-transform"
                style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37' }}
              >
                <Icon size={14} />
              </div>
            </div>
            <p className="text-2xl font-black text-neutral-900">{value}</p>
            <p className="text-[11px] text-neutral-500 font-semibold mt-1">{sub}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Analytics;