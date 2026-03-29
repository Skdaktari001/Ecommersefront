import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import { toast } from 'react-toastify';
import {
  DollarSign,
  Package,
  Users,
  TrendingUp,
  ShoppingCart,
  RefreshCw,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { backendUrl } from '../App';

const AdminDashboard = ({ token }) => {
    const [stats, setStats] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [userAnalytics, setUserAnalytics] = useState(null);
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('month');

    const fetchDashboardData = async (showLoader = true) => {
        if (showLoader) setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const [statsRes, salesRes, productsRes, usersRes, activitiesRes] = await Promise.all([
                axios.get(`${backendUrl}api/dashboard/stats`, { headers }),
                axios.get(`${backendUrl}api/dashboard/sales?period=${period}`, { headers }),
                axios.get(`${backendUrl}api/dashboard/top-products`, { headers }),
                axios.get(`${backendUrl}api/dashboard/users`, { headers }),
                axios.get(`${backendUrl}api/dashboard/recent-activities`, { headers })
            ]);

            if (statsRes.data.success) setStats(statsRes.data.stats);
            if (salesRes.data.success) setSalesData(salesRes.data.analytics || []);
            if (productsRes.data.success) setTopProducts(productsRes.data.products || []);
            if (usersRes.data.success) setUserAnalytics(usersRes.data);
            if (activitiesRes.data.success) setRecentActivities(activitiesRes.data.activities || []);
        } catch (error) {
            console.error('Dashboard data error:', error);
            toast.error('Failed to load dashboard data');
            setSalesData([]);
            setTopProducts([]);
            setRecentActivities([]);
        } finally {
            if (showLoader) setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchDashboardData(true);
            const intervalId = setInterval(() => fetchDashboardData(false), 60000);
            return () => clearInterval(intervalId);
        }
    }, [token, period]);

    const COLORS = ['#D4AF37', '#1a1a1a', '#6B7280', '#B8963E', '#9CA3AF'];

    const orderStatusData = stats?.orderStatus
        ? Object.entries(stats.orderStatus).map(([key, value]) => ({ name: key, value }))
        : [];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-5">
                    <div className="relative w-14 h-14">
                        <div className="absolute inset-0 rounded-2xl border-2 border-[#D4AF37]/20"></div>
                        <div className="absolute inset-0 rounded-2xl border-t-2 border-[#D4AF37] animate-spin"></div>
                    </div>
                    <p className="text-[10px] font-bold tracking-[0.35em] text-neutral-400 uppercase">Loading Dashboard</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <p className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-1">Overview</p>
                    <h1 className="text-2xl font-black tracking-tight text-neutral-900">Dashboard</h1>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="w-full sm:w-40 appearance-none bg-white border border-neutral-200 px-4 py-2.5 pr-9 rounded-xl text-[12px] font-semibold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 cursor-pointer"
                        >
                            <option value="day">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                        </select>
                        <Clock size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    </div>

                    <button
                        onClick={fetchDashboardData}
                        className="p-2.5 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-all"
                        title="Refresh"
                    >
                        <RefreshCw size={15} className="text-neutral-500" />
                    </button>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Revenue"
                    value={`$${stats?.totals?.revenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`}
                    change={stats?.today?.revenue > 0 ? `+$${Number(stats.today.revenue).toFixed(2)} today` : null}
                    icon={DollarSign}
                    trend="up"
                    accent="#D4AF37"
                />
                <StatCard
                    title="Total Orders"
                    value={stats?.totals?.orders || 0}
                    change={stats?.today?.orders > 0 ? `+${stats.today.orders} today` : null}
                    icon={ShoppingCart}
                    trend="up"
                    accent="#1a1a1a"
                />
                <StatCard
                    title="Customers"
                    value={stats?.totals?.users || 0}
                    change={stats?.today?.newUsers > 0 ? `+${stats.today.newUsers} new` : null}
                    icon={Users}
                    trend="up"
                    accent="#D4AF37"
                />
                <StatCard
                    title="Avg. Order Value"
                    value={`$${Number(stats?.totals?.averageOrderValue || 0).toFixed(2)}`}
                    icon={TrendingUp}
                    trend="neutral"
                    accent="#1a1a1a"
                />
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 p-7">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-400 uppercase">Revenue</p>
                            <h3 className="text-base font-black text-neutral-900 mt-0.5">Growth Overview</h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-400">
                            <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                            Revenue
                        </div>
                    </div>

                    <div className="h-72">
                        {salesData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={salesData}>
                                    <defs>
                                        <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.12} />
                                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} dy={8} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} dx={-8} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', fontSize: '12px' }}
                                        cursor={{ stroke: '#D4AF37', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2.5} fill="url(#goldGrad)" animationDuration={1500} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState label="No sales data available" />
                        )}
                    </div>
                </div>

                {/* Order Status Pie */}
                <div className="bg-white rounded-2xl border border-neutral-100 p-7">
                    <div className="mb-6">
                        <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-400 uppercase">Orders</p>
                        <h3 className="text-base font-black text-neutral-900 mt-0.5">Status Mix</h3>
                    </div>

                    <div className="h-72">
                        {orderStatusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={orderStatusData}
                                        innerRadius={65}
                                        outerRadius={90}
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="none"
                                        animationDuration={1500}
                                    >
                                        {orderStatusData.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', fontSize: '12px' }} />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        formatter={(value) => (
                                            <span style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                {value}
                                            </span>
                                        )}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState label="No order data available" />
                        )}
                    </div>
                </div>
            </div>

            {/* ── Bottom Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Top Products */}
                <div className="bg-white rounded-2xl border border-neutral-100 p-7">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-400 uppercase">Products</p>
                            <h3 className="text-base font-black text-neutral-900 mt-0.5">Bestsellers</h3>
                        </div>
                        <button className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest hover:text-[#D4AF37] transition-colors">
                            View All
                        </button>
                    </div>

                    <div className="space-y-3">
                        {topProducts.length > 0 ? (
                            topProducts.slice(0, 5).map((product, index) => (
                                <div key={product.productId || index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50 transition-colors group">
                                    <span className="text-[11px] font-black text-neutral-300 w-4 shrink-0">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <img
                                        src={product.images?.[0] || 'https://placehold.co/40'}
                                        alt={product.name}
                                        className="w-10 h-10 object-cover rounded-xl border border-neutral-100"
                                        onError={(e) => { e.target.src = 'https://placehold.co/40'; }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-bold text-neutral-800 truncate">{product.name || 'Product'}</p>
                                        <p className="text-[11px] text-neutral-400 truncate">{product.category || 'Uncategorised'}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-[13px] font-black text-neutral-900">${Number(product.totalRevenue || 0).toFixed(2)}</p>
                                        <p className="text-[11px] text-neutral-400">{product.totalSold || 0} sold</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <EmptyState label="No product data available" />
                        )}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-2xl border border-neutral-100 p-7">
                    <div className="mb-6">
                        <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-400 uppercase">Live Feed</p>
                        <h3 className="text-base font-black text-neutral-900 mt-0.5">Recent Activity</h3>
                    </div>

                    <div className="space-y-1 max-h-[340px] overflow-y-auto pr-1">
                        {recentActivities.length > 0 ? (
                            recentActivities.slice(0, 8).map((activity, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm
                                        ${activity.type === 'order' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' :
                                          activity.type === 'signup' ? 'bg-neutral-100 text-neutral-600' :
                                          'bg-neutral-100 text-neutral-500'}`}
                                    >
                                        {activity.type === 'order' ? '📦' : activity.type === 'signup' ? '👤' : '📝'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-bold text-neutral-800 truncate">{activity.title || 'Activity'}</p>
                                        <p className="text-[11px] text-neutral-400 truncate">{activity.description || ''}</p>
                                        <p className="text-[10px] text-neutral-300 mt-0.5">
                                            {activity.date ? new Date(activity.date).toLocaleString() : 'Just now'}
                                        </p>
                                    </div>
                                    {activity.amount && (
                                        <span className="text-[12px] font-black text-neutral-900 shrink-0">
                                            ${Number(activity.amount).toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <EmptyState label="No recent activity" />
                        )}
                    </div>
                </div>
            </div>

            {/* ── Order Status Summary ── */}
            {stats?.orderStatus && Object.keys(stats.orderStatus).length > 0 && (
                <div className="bg-white rounded-2xl border border-neutral-100 p-7">
                    <div className="mb-6">
                        <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-400 uppercase">Breakdown</p>
                        <h3 className="text-base font-black text-neutral-900 mt-0.5">Order Status Summary</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(stats.orderStatus).map(([status, count]) => (
                            <div key={status} className="p-5 rounded-xl border border-neutral-100 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all text-center group">
                                <div className="text-2xl font-black text-neutral-900 group-hover:text-[#D4AF37] transition-colors">{count}</div>
                                <div className="text-[11px] font-semibold text-neutral-400 capitalize mt-1">{status.replace('_', ' ')}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── User Analytics ── */}
            {userAnalytics?.analytics && (
                <div className="bg-white rounded-2xl border border-neutral-100 p-7">
                    <div className="mb-6">
                        <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-400 uppercase">Accounts</p>
                        <h3 className="text-base font-black text-neutral-900 mt-0.5">User Analytics</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                            { label: 'Total Users', value: userAnalytics.analytics.total || 0 },
                            { label: 'Administrators', value: userAnalytics.analytics.admins || 0 },
                            { label: 'Regular Users', value: userAnalytics.analytics.regular || 0 },
                        ].map(({ label, value }) => (
                            <div key={label} className="p-5 rounded-xl border border-neutral-100 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all text-center group">
                                <div className="text-2xl font-black text-neutral-900 group-hover:text-[#D4AF37] transition-colors">{value}</div>
                                <div className="text-[11px] font-semibold text-neutral-400 mt-1">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

/* ── Sub-components ── */

const StatCard = ({ title, value, change, icon: Icon, trend, accent }) => (
    <div className="bg-white border border-neutral-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-neutral-100 hover:-translate-y-0.5 transition-all group">
        <div className="flex items-start justify-between">
            <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400">{title}</p>
                <p className="text-2xl font-black text-neutral-900 tracking-tight">{value}</p>
                {change && (
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border
                        ${trend === 'up' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          trend === 'down' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                          'bg-neutral-50 text-neutral-500 border-neutral-100'}`}
                    >
                        {trend === 'up' ? <ArrowUpRight size={10} /> : trend === 'down' ? <ArrowDownRight size={10} /> : null}
                        {change}
                    </div>
                )}
            </div>
            <div
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 border"
                style={{
                    background: `${accent}10`,
                    borderColor: `${accent}20`,
                    color: accent
                }}
            >
                <Icon size={18} strokeWidth={2} />
            </div>
        </div>
    </div>
);

const EmptyState = ({ label }) => (
    <div className="h-full flex items-center justify-center">
        <p className="text-[11px] font-semibold text-neutral-300 uppercase tracking-widest">{label}</p>
    </div>
);

export default AdminDashboard;