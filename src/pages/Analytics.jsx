// pages/Analytics.jsx (if doesn't exist)
import React from 'react';
import { 
  BarChart3, TrendingUp, Users, ShoppingBag, 
  ArrowUpRight, ArrowDownRight, Calendar, 
  Filter, Download, Layout, Activity, Zap
} from 'lucide-react';

const Analytics = ({ token }) => {
  const stats = [
    { label: 'Market Velocity', value: '$128.4k', growth: '+12.5%', icon: TrendingUp, positive: true },
    { label: 'Active Nodes', value: '2,842', growth: '+3.2%', icon: Users, positive: true },
    { label: 'Protocol Yield', value: '18.4%', growth: '-0.8%', icon: Zap, positive: false },
    { label: 'Conversion Delta', value: '4.2%', growth: '+1.1%', icon: Activity, positive: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <BarChart3 className="text-white" size={24} />
            </div>
            Intelligence
          </h1>
          <p className="text-[13px] text-slate-400 font-medium tracking-wide uppercase">Real-time Performance Metrics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
            <Calendar size={14} className="text-indigo-500" />
            Last 30 Days
          </div>
          <button className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-8 rounded-[32px] hover:border-indigo-600 transition-all group shadow-xl shadow-slate-200/40">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <stat.icon size={22} />
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-black px-3 py-1 rounded-full ${
                stat.positive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
              }`}>
                {stat.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.growth}
              </div>
            </div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-300 mb-2">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Visually stunning placeholder for actual charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[40px] p-10 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Growth Projection</h3>
              <p className="text-[12px] text-slate-400 mt-1 uppercase tracking-widest">Market analysis & forecasting</p>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 hover:text-indigo-600 transition-all border border-slate-100">
                <Layout size={18} />
              </button>
            </div>
          </div>
          
          {/* Decorative Graph Placeholder */}
          <div className="h-[300px] w-full flex items-end gap-3 px-4">
               {[40, 60, 45, 90, 65, 80, 50, 70, 85, 95, 60, 75].map((val, i) => (
                 <div 
                    key={i} 
                    className="flex-1 bg-slate-50 rounded-t-2xl group-hover:bg-indigo-50 transition-all duration-1000"
                    style={{ height: `${val}%`, transitionDelay: `${i * 30}ms` }}
                 ></div>
               ))}
          </div>
          
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[4px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700">
            <div className="bg-indigo-600 text-white px-10 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl shadow-indigo-600/30">
              Protocol Syncing
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[40px] p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between border border-slate-800">
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-[24px] bg-indigo-600 flex items-center justify-center text-white mb-10 shadow-lg shadow-indigo-600/20 border border-indigo-500">
              <Zap size={28} fill="white" />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight mb-5">Enterprise Insights</h3>
            <p className="text-slate-400 text-[14px] leading-relaxed font-medium">
              Our neural engine is currently processing market deltas to provide predictive inventory management and risk optimization.
            </p>
          </div>
          
          <div className="mt-12 space-y-6 relative z-10">
            <div className="p-6 bg-white/[0.03] border border-white/[0.05] rounded-3xl backdrop-blur-md">
              <div className="flex justify-between text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-3 font-black">
                <span>Core Analysis</span>
                <span className="text-indigo-400">88%</span>
              </div>
              <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[88%] rounded-full shadow-[0_0_20px_rgba(99,102,241,0.6)]"></div>
              </div>
            </div>
          </div>

          {/* Abstract pattern decoration */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;