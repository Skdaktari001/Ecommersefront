import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle,
  Search,
  RefreshCw,
  ChevronDown,
  Phone
} from 'lucide-react';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAllOrders = async (showLoader = false) => {
    if (!token) return;
    if (showLoader) setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}api/order/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Fetch orders error:', error);
      toast.error('Failed to sync orders');
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    try {
      const response = await axios.put(
        `${backendUrl}api/order/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(`Order marked as ${newStatus}`);
        await fetchAllOrders();
      }
    } catch {
      toast.error('Status update failed');
    }
  };

  useEffect(() => {
    fetchAllOrders(true);
    const intervalId = setInterval(() => fetchAllOrders(false), 20000);
    return () => clearInterval(intervalId);
  }, [token]);

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.address?.firstName + ' ' + order.address?.lastName).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'shipped':   return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'paid':      return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'pending':   return 'bg-neutral-100 text-neutral-600 border-neutral-300';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-200';
      default:          return 'bg-neutral-100 text-neutral-600 border-neutral-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <CheckCircle2 size={12} />;
      case 'shipped':   return <Truck size={12} />;
      case 'pending':   return <Clock size={12} />;
      case 'cancelled': return <XCircle size={12} />;
      default:          return <Package size={12} />;
    }
  };

  return (
    <div className="max-w-6xl px-4 py-8">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-1">Fulfillment</p>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#D4AF37]/40"
              style={{ background: 'rgba(212,175,55,0.1)' }}
            >
              <Package size={18} style={{ color: '#D4AF37' }} />
            </div>
            Orders
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-[12px] font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25 focus:border-[#D4AF37]/60 transition-all w-72"
            />
          </div>
          <button
            onClick={() => fetchAllOrders(true)}
            className="p-2.5 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 hover:border-neutral-400 transition-all text-neutral-600"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── Loading State ── */}
      {loading && orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-xl border-2 border-[#D4AF37]/20"></div>
            <div className="absolute inset-0 rounded-xl border-t-2 border-[#D4AF37] animate-spin"></div>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">Loading Orders...</p>
        </div>

      /* ── Empty State ── */
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border-2 border-dashed border-neutral-200">
          <div className="w-14 h-14 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-4">
            <Package size={24} className="text-neutral-400" />
          </div>
          <h3 className="text-[14px] font-black text-neutral-900 mb-1">No Orders Found</h3>
          <p className="text-[12px] text-neutral-500 font-medium">Your order queue is currently empty.</p>
        </div>

      /* ── Orders List ── */
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden transition-all hover:border-[#D4AF37]/40 hover:shadow-lg group"
            >
              <div className="p-6 md:p-7">
                <div className="flex flex-col lg:flex-row gap-8">

                  {/* ── Items Column ── */}
                  <div className="flex-1 min-w-0">

                    {/* Order ID + Date */}
                    <div className="flex items-center gap-4 mb-6 pb-5 border-b border-neutral-200">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#D4AF37]/30 shrink-0"
                        style={{ background: 'rgba(212,175,55,0.08)' }}
                      >
                        <Package size={16} style={{ color: '#D4AF37' }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-0.5">Order ID</p>
                        <p className="text-[14px] font-black text-neutral-900">#{order.id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold text-neutral-600 bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-lg shrink-0">
                        <Calendar size={11} style={{ color: '#D4AF37' }} />
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-neutral-100 border border-neutral-200 p-3 rounded-xl">
                          <div className="text-[13px] font-bold text-neutral-900 min-w-0 flex-1 truncate">
                            {item.product?.name || 'Product'}
                          </div>
                          <div className="text-[10px] font-black text-neutral-600 uppercase tracking-widest bg-white border border-neutral-200 px-2.5 py-1 rounded-lg shrink-0">
                            Qty: {item.quantity}
                          </div>
                          <div className="text-[13px] font-black text-neutral-900 shrink-0">
                            {currency}{Number(item.price).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Customer Column ── */}
                  <div className="lg:w-[30%] lg:border-l lg:border-neutral-200 lg:pl-7 space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <User size={13} style={{ color: '#D4AF37' }} />
                        <h4 className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Customer</h4>
                      </div>
                      {order.address && (
                        <div className="space-y-2">
                          <p className="text-[13px] font-black text-neutral-900">
                            {order.address.firstName} {order.address.lastName}
                          </p>
                          <div className="flex items-start gap-2 text-[12px] text-neutral-600 font-medium leading-relaxed">
                            <MapPin size={12} className="mt-0.5 shrink-0 text-neutral-500" />
                            <span>{order.address.street}, {order.address.city}, {order.address.state} {order.address.zipcode}</span>
                          </div>
                          {order.address.phone && (
                            <div className="flex items-center gap-2 text-[12px] text-neutral-700 font-semibold">
                              <Phone size={12} className="text-neutral-500" />
                              {order.address.phone}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-5 border-t border-neutral-200">
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <CreditCard size={11} className="text-neutral-500" />
                          <h4 className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Payment</h4>
                        </div>
                        <p className="text-[12px] font-black text-neutral-900 uppercase">{order.paymentMethod}</p>
                        <p className={`text-[10px] font-black mt-1 ${order.isPaid ? 'text-emerald-600' : 'text-neutral-500'}`}>
                          {order.isPaid ? 'Verified' : 'Pending'}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <DollarSign size={11} className="text-neutral-500" />
                          <h4 className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Total</h4>
                        </div>
                        <p className="text-[15px] font-black text-neutral-900">
                          {currency}{Number(order.totalAmount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ── Status Column ── */}
                  <div className="lg:w-[22%] lg:border-l lg:border-neutral-200 lg:pl-7 flex flex-col justify-center gap-4">
                    <div>
                      <div className="flex items-center gap-1.5 mb-3">
                        <Clock size={13} className="text-neutral-500" />
                        <h4 className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Status</h4>
                      </div>

                      <div className={`
                        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black 
                        uppercase tracking-widest border mb-4
                        ${getStatusStyles(order.status)}
                      `}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>

                      <div className="relative">
                        <select
                          onChange={(event) => statusHandler(event, order.id)}
                          value={order.status}
                          className="w-full appearance-none bg-neutral-100 border border-neutral-300 px-4 py-2.5 rounded-xl text-[12px] font-bold text-neutral-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/25 focus:border-[#D4AF37]/60 transition-all cursor-pointer pr-9"
                        >
                          <option value="pending">Mark as Pending</option>
                          <option value="paid">Mark as Paid</option>
                          <option value="shipped">Mark as Shipped</option>
                          <option value="delivered">Mark as Delivered</option>
                          <option value="cancelled">Mark as Cancelled</option>
                        </select>
                        <ChevronDown
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
                          size={13}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;