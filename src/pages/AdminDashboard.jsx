// pages/AdminDashboard.jsx
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
  Plus,
  RefreshCw,
  Activity,
  UserPlus,
  Clock,
  ArrowUpRight,
  ArrowDownRight
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

    // Fetch dashboard data
    const fetchDashboardData = async (showLoader = true) => {
        if (showLoader) setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch all dashboard data in parallel
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
            // Set default empty data to prevent chart errors
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
            const intervalId = setInterval(() => {
                fetchDashboardData(false);
            }, 60000);
            return () => clearInterval(intervalId);
        }
    }, [token, period]);

    // Color palette
    const COLORS = ['#4F46E5', '#F59E0B', '#10B981', '#6366F1', '#94A3B8'];

    // Prepare chart data with defaults
    const orderStatusData = stats?.orderStatus
        ? Object.entries(stats.orderStatus).map(([key, value]) => ({ name: key, value }))
        : [];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-2xl border-4 border-indigo-50 animate-pulse"></div>
                    <div className="absolute inset-0 rounded-2xl border-t-4 border-indigo-600 animate-spin"></div>
                  </div>
                  <p className="text-[11px] font-bold tracking-[0.3em] text-slate-400 uppercase animate-pulse">Syncing Analytics</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-1">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900">Statistics</h1>
                  <p className="text-[13px] text-slate-400 font-medium">Real-time performance metrics</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative group flex-1 sm:flex-none">
                      <select
                          value={period}
                          onChange={(e) => setPeriod(e.target.value)}
                          className="w-full sm:w-40 appearance-none bg-white border border-neutral-200 px-4 py-2.5 pr-10 rounded-xl text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-black/5 transition-all cursor-pointer"
                      >
                          <option value="day">Today</option>
                          <option value="week">This Week</option>
                          <option value="month">This Month</option>
                          <option value="year">This Year</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                        <Clock size={16} />
                      </div>
                    </div>
                    <button
                        onClick={fetchDashboardData}
                        className="p-2.5 bg-white border border-neutral-200 text-black rounded-xl hover:bg-neutral-50 transition-all shadow-sm"
                        title="Refresh Data"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {/* Stats Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Revenue"
                    value={`$${stats?.totals?.revenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`}
                    change={stats?.today?.revenue > 0 ? `+$${Number(stats.today.revenue).toFixed(2)}` : null}
                    icon={DollarSign}
                    trend="up"
                />
                <StatCard
                    title="Orders"
                    value={stats?.totals?.orders || 0}
                    change={stats?.today?.orders > 0 ? `+${stats.today.orders}` : null}
                    icon={ShoppingCart}
                    trend="up"
                />
                <StatCard
                    title="Customers"
                    value={stats?.totals?.users || 0}
                    change={stats?.today?.newUsers > 0 ? `+${stats.today.newUsers}` : null}
                    icon={Users}
                    trend="up"
                />
                <StatCard
                    title="Avg Order"
                    value={`$${Number(stats?.totals?.averageOrderValue || 0).toFixed(2)}`}
                    icon={TrendingUp}
                    trend="neutral"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart (Large) */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm shadow-black/5">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-sm font-semibold text-black uppercase tracking-wider">Revenue Growth</h3>
                        <p className="text-xs text-neutral-400 font-light mt-1">Transaction volume over selected period</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5 font-medium text-neutral-600">
                          <div className="w-2 h-2 rounded-full bg-black"></div>
                          Revenue
                        </div>
                      </div>
                    </div>

                    <div className="h-80 min-h-[320px] relative">
                        {salesData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} aspect={2} debounce={100}>
                                <AreaChart data={salesData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis
                                      dataKey="period"
                                      axisLine={false}
                                      tickLine={false}
                                      tick={{fontSize: 11, fill: '#9CA3AF'}}
                                      dy={10}
                                    />
                                    <YAxis
                                      axisLine={false}
                                      tickLine={false}
                                      tick={{fontSize: 11, fill: '#9CA3AF'}}
                                      dx={-10}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                          borderRadius: '12px',
                                          border: 'none',
                                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                          fontSize: '12px'
                                        }}
                                        cursor={{ stroke: '#000000', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#4F46E5"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRev)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-xs font-light text-neutral-400 italic">
                                Syncing sales metrics...
                            </div>
                        )}
                    </div>
                </div>

                {/* Distribution Chart (Small) */}
                <div className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm shadow-black/5">
                    <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-8">Status mix</h3>
                    <div className="h-80 relative">
                        {orderStatusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} aspect={1} debounce={100}>
                                <PieChart>
                                    <Pie
                                        data={orderStatusData}
                                        innerRadius={70}
                                        outerRadius={95}
                                        paddingAngle={5}
                                        dataKey="value"
                                        animationDuration={2000}
                                        stroke="none"
                                    >
                                        {orderStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                                    />
                                    <Legend
                                      verticalAlign="bottom"
                                      height={36}
                                      iconType="circle"
                                      formatter={(value) => <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-widest">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-xs font-light text-neutral-400 italic">
                                Categorizing orders...
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Grid: Products & Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Products */}
                <div className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm shadow-black/5">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-sm font-semibold text-black uppercase tracking-wider">Bestsellers</h3>
                      <button className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest hover:text-black transition-colors">View All</button>
                    </div>
                    <div className="space-y-6">
                        {topProducts.length > 0 ? (
                            topProducts.slice(0, 5).map((product, index) => (
                                <div key={product.productId || index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-gray-500">#{index + 1}</span>
                                        <img
                                            src={product.images?.[0] || 'https://placehold.co/40'}
                                            alt={product.name}
                                            className="w-10 h-10 object-cover rounded"
                                            onError={(e) => {
                                                e.target.src = 'https://placehold.co/40';
                                            }}
                                        />
                                        <div>
                                            <p className="font-medium text-sm">{product.name || 'Product'}</p>
                                            <p className="text-xs text-gray-500">{product.category || 'Category'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">${Number(product.totalRevenue || 0).toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">{product.totalSold || 0} sold</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No product data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {recentActivities.length > 0 ? (
                            recentActivities.slice(0, 8).map((activity, index) => (
                                <div key={index} className="flex items-start space-x-3 p-2 border-b last:border-b-0">
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                                        ${activity.type === 'order' ? 'bg-blue-100 text-blue-600' :
                                            activity.type === 'signup' ? 'bg-green-100 text-green-600' :
                                                'bg-purple-100 text-purple-600'}
                                    `}>
                                        {activity.type === 'order' ? '📦' :
                                            activity.type === 'signup' ? '👤' : '📝'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{activity.title || 'Activity'}</p>
                                        <p className="text-xs text-gray-600 truncate">{activity.description || 'Description'}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {activity.date ? new Date(activity.date).toLocaleString() : 'Just now'}
                                        </p>
                                    </div>
                                    {activity.amount && (
                                        <span className="font-semibold text-sm flex-shrink-0">
                                            ${Number(activity.amount).toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No recent activities
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Order Status Summary */}
            {stats?.orderStatus && Object.keys(stats.orderStatus).length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Order Status Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(stats.orderStatus).map(([status, count]) => (
                            <div key={status} className="text-center p-4 border rounded-lg hover:bg-gray-50">
                                <div className="text-2xl font-bold text-blue-600">{count}</div>
                                <div className="text-gray-600 capitalize">{status.replace('_', ' ')}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* User Analytics */}
            {userAnalytics?.analytics && (
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">User Analytics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg hover:bg-gray-50">
                            <div className="text-2xl font-bold">{userAnalytics.analytics.total || 0}</div>
                            <div className="text-gray-600">Total Users</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg hover:bg-gray-50">
                            <div className="text-2xl font-bold">{userAnalytics.analytics.admins || 0}</div>
                            <div className="text-gray-600">Admins</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg hover:bg-gray-50">
                            <div className="text-2xl font-bold">{userAnalytics.analytics.regular || 0}</div>
                            <div className="text-gray-600">Regular Users</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Stat Card Component
const StatCard = ({ title, value, change, icon: Icon, trend }) => {
    return (
        <div className="p-6 bg-white border border-slate-100 rounded-3xl transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 group">
            <div className="flex justify-between items-start">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{title}</p>
                    </div>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
                    {change && (
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                        trend === 'up' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        trend === 'down' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                        'bg-slate-50 text-slate-500 border-slate-100'
                      }`}>
                        {trend === 'up' ? <ArrowUpRight size={10} /> : trend === 'down' ? <ArrowDownRight size={10} /> : null}
                        {change}
                      </div>
                    )}
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100 group-hover:border-indigo-500">
                    <Icon size={20} strokeWidth={2.5} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;