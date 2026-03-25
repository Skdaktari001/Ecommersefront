import React from 'react';
import { 
  Settings as SettingsIcon, Shield, Bell, Eye, 
  Globe, Database, Zap, Lock, HardDrive, 
  Save, RotateCcw, ChevronRight, Share2, 
  Terminal, Cpu
} from 'lucide-react';

const Settings = ({ token }) => {
  const sections = [
    {
      title: 'Global Configuration',
      icon: Cpu,
      description: 'System-wide parameters and core performance limits.',
      items: [
        { label: 'Cloud Synchronization', status: 'Optimal', type: 'toggle', active: true },
        { label: 'Neural Engine Delta', status: 'Priority', type: 'select', value: 'High' },
        { label: 'Debug Protocol', status: 'Restricted', type: 'toggle', active: false },
      ]
    },
    {
      title: 'Security & Access',
      icon: Shield,
      description: 'Authority levels and encryption standards.',
      items: [
        { label: '2FA Protocol', status: 'Mandatory', type: 'toggle', active: true },
        { label: 'Auth Token Lifecycle', status: '72h', type: 'select', value: '72 Hours' },
        { label: 'IP Lockdown', status: 'Active', type: 'toggle', active: true },
      ]
    },
    {
      title: 'Visual Architecture',
      icon: Eye,
      description: 'Interface aesthetics and rendering modes.',
      items: [
        { label: 'High-Contrast Mode', status: 'Standard', type: 'toggle', active: true },
        { label: 'Micro-animations', status: 'Fluid', type: 'toggle', active: true },
        { label: 'Typography Scale', status: 'Balanced', type: 'select', value: 'Enterprise' },
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <SettingsIcon className="text-white" size={24} />
            </div>
            Parameters
          </h1>
          <p className="text-[13px] text-slate-400 font-medium tracking-wide uppercase">Core System Configuration</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="px-8 py-3.5 bg-white border border-slate-200 rounded-[20px] text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-indigo-600 hover:border-indigo-100 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
            Reset Defaults
          </button>
          <button className="px-8 py-3.5 bg-slate-900 text-white rounded-[20px] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all flex items-center gap-3 shadow-xl shadow-slate-900/10 active:scale-95 border border-slate-800 hover:border-indigo-500">
            <Save size={16} />
            Commit Matrix
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {sections.map((section, sidx) => (
          <div key={sidx} className="group/section">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 rounded-[24px] bg-slate-900 flex items-center justify-center text-indigo-400 group-hover/section:bg-indigo-600 group-hover/section:text-white transition-all duration-700 shadow-xl shadow-slate-200 border border-slate-800 group-hover/section:border-indigo-500">
                <section.icon size={24} />
              </div>
              <div>
                <h2 className="text-[18px] font-black text-slate-900 tracking-tight">{section.title}</h2>
                <p className="text-[12px] text-slate-400 font-medium">{section.description}</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/40 divide-y divide-slate-50">
              {section.items.map((item, iidx) => (
                <div key={iidx} className="p-8 md:p-10 flex items-center justify-between hover:bg-slate-50/50 transition-all group/item">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-black text-slate-800 tracking-tight group-hover/item:text-indigo-600 transition-colors uppercase tracking-widest text-[11px]">{item.label}</span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.25em] mt-1.5">{item.status}</span>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {item.type === 'toggle' ? (
                      <button className={`w-14 h-7 rounded-full relative transition-all duration-500 shadow-inner ${item.active ? 'bg-indigo-600 shadow-indigo-600/20' : 'bg-slate-200'}`}>
                        <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-500 shadow-md ${item.active ? 'left-8' : 'left-1'}`}></div>
                      </button>
                    ) : (
                      <div className="group/select relative">
                        <button className="flex items-center gap-3 text-[11px] font-black text-slate-900 pr-3 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 hover:bg-white hover:border-indigo-100 transition-all">
                          {item.value}
                          <ChevronRight size={14} className="rotate-90 text-indigo-400" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Control Card */}
      <div className="mt-20 p-12 bg-slate-900 rounded-[48px] text-white relative overflow-hidden group shadow-2xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex-1 space-y-4">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/20">
                  <Terminal className="text-rose-400" size={24} />
                </div>
                <h3 className="text-2xl font-black tracking-tight uppercase tracking-widest text-sm">Security Level 05 Authorization</h3>
             </div>
             <p className="text-slate-400 text-[15px] leading-relaxed font-medium max-w-xl">
               Restricted parameters detected. Modifications to core routing, encrypted channels, and database integrity are reserved for Root Administrators.
             </p>
          </div>
          <button className="px-10 py-5 bg-indigo-600 text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.25em] hover:bg-indigo-700 hover:-translate-y-1 transition-all shadow-xl shadow-indigo-600/20 border border-indigo-500 active:translate-y-0">
             Launch Command Console
          </button>
        </div>
        
        {/* Animated Background Decor */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600 opacity-[0.05] rounded-full group-hover:scale-150 transition-transform duration-1000 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent -rotate-12 group-hover:rotate-12 transition-transform duration-1000"></div>
      </div>
    </div>
  );
};

export default Settings;