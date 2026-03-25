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

      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
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
        toast.success(`Order ${newStatus}`);
        await fetchAllOrders();
      }
    } catch (error) {
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
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'shipped': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'paid': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'pending': return 'bg-slate-50 text-slate-500 border-slate-100';
      case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <CheckCircle2 size={12} />;
      case 'shipped': return <Truck size={12} />;
      case 'pending': return <Clock size={12} />;
      case 'cancelled': return <XCircle size={12} />;
      default: return <Package size={12} />;
    }
  };

  return (
    <div className="max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Orders</h1>
          <p className="text-[13px] text-slate-400 font-medium">Fulfillment and transaction log</p>
        </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" size={14} />
            <input 
              type="text" 
              placeholder="Order ID or Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-neutral-100 rounded-xl text-[12px] focus:outline-none focus:ring-4 focus:ring-black/5 transition-all w-64 shadow-sm"
            />
          </div>
          <button 
            onClick={() => fetchAllOrders(true)}
            className="p-2.5 bg-white border border-neutral-100 rounded-xl hover:bg-neutral-50 transition-all text-neutral-400 hover:text-black shadow-sm"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading && orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
          <RefreshCw className="animate-spin text-neutral-300" size={32} />
          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">Loading Orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-neutral-50 shadow-sm border-dashed">
          <div className="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center mb-6">
            <Package size={32} className="text-neutral-200" />
          </div>
          <h3 className="text-[15px] font-bold text-black mb-1">No Orders Found</h3>
          <p className="text-[13px] text-neutral-400 font-light">Your order queue is currently empty.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white rounded-[32px] border border-slate-100 shadow-sm shadow-slate-200/50 overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200/30 hover:border-indigo-100 group"
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row gap-10">
                  
                  {/* Visual Status & Items */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                        <Package size={20} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Transaction Ref</p>
                        <p className="text-[15px] font-black text-slate-900">#{order.id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-2 text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                        <Calendar size={12} />
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-neutral-50/50 p-3 rounded-2xl border border-neutral-50/50">
                          <div className="text-[13px] font-bold text-black min-w-0 flex-1 truncate">{item.product?.name || 'Vogue Item'}</div>
                          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest bg-white px-2 py-0.5 rounded border border-neutral-100">Qty: {item.quantity}</div>
                          <div className="text-[13px] font-medium text-black">{currency}{Number(item.price).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer & Shipping */}
                  <div className="lg:w-1/3 pt-6 lg:pt-0 lg:border-l lg:pl-10 border-neutral-100 space-y-8">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <User size={14} className="text-neutral-400" />
                        <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Recipient Information</h4>
                      </div>
                      {order.address && (
                        <div className="space-y-1.5">
                          <p className="text-[13px] font-bold text-black">{order.address.firstName} {order.address.lastName}</p>
                          <div className="flex items-start gap-2 text-[12px] text-neutral-500 font-light leading-relaxed">
                            <MapPin size={12} className="mt-0.5 shrink-0" />
                            <span>{order.address.street}, {order.address.city}, {order.address.state} {order.address.zipcode}</span>
                          </div>
                          {order.address.phone && (
                            <div className="flex items-center gap-2 text-[12px] text-neutral-800 font-medium mt-2">
                              <Phone size={12} className="text-neutral-400" />
                              {order.address.phone}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-neutral-50">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard size={12} className="text-neutral-400" />
                          <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Payment</h4>
                        </div>
                        <p className="text-[12px] font-bold text-black uppercase">{order.paymentMethod}</p>
                        <p className={`text-[10px] font-bold mt-1 ${order.isPaid ? 'text-green-500' : 'text-neutral-400'}`}>
                          {order.isPaid ? 'VERIFIED' : 'PENDING'}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign size={12} className="text-neutral-400" />
                          <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Total</h4>
                        </div>
                        <p className="text-[15px] font-black text-black">{currency}{Number(order.totalAmount).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Control */}
                  <div className="lg:w-1/4 lg:pl-10 flex flex-col justify-center">
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock size={14} className="text-neutral-400" />
                        <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Fulfillment Status</h4>
                      </div>
                      
                      <div className={`
                        inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all mb-6
                        ${getStatusStyles(order.status)}
                      `}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>

                      <div className="relative">
                        <select
                          onChange={(event) => statusHandler(event, order.id)}
                          value={order.status}
                          className="w-full appearance-none bg-neutral-50 border border-neutral-100 px-4 py-3 rounded-2xl text-[13px] font-bold focus:outline-none focus:bg-white focus:ring-4 focus:ring-black/5 transition-all cursor-pointer pr-10"
                        >
                          <option value="pending">Mark as Pending</option>
                          <option value="paid">Mark as Paid</option>
                          <option value="shipped">Mark as Shipped</option>
                          <option value="delivered">Mark as Delivered</option>
                          <option value="cancelled">Mark as Cancelled</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={14} />
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