import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
    Package, Clock, CheckCircle2, XCircle, 
    Search, Filter, MapPin, User, ArrowLeft, Phone 
} from 'lucide-react';
import { format, parseISO, subDays } from 'date-fns';

export default function AdminOrders({ setToast }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const init = async () => {
            await cleanupOldOrders();
            await fetchOrders();
        };
        init();
    }, []);

    const cleanupOldOrders = async () => {
        try {
            const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
            
            // Delete orders that are confirmed/rejected AND older than 30 days
            const { error, count } = await supabase
                .from('orders')
                .delete({ count: 'exact' })
                .in('status', ['confirmed', 'rejected'])
                .lt('created_at', thirtyDaysAgo);

            if (error) throw error;
            
            if (count > 0) {
                console.log(`[Auto-Cleanup] Deleted ${count} orders older than 30 days.`);
            }
        } catch (error) {
            console.error('Error during auto-cleanup:', error.message);
        }
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .not('user_id', 'is', null) // Only show authenticated orders
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            setOrders(prev => prev.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            ));

            setToast(`Order ${newStatus === 'confirmed' ? 'Confirmed' : 'Rejected'} successfully!`);
            setTimeout(() => setToast(''), 3000);
        } catch (error) {
            console.error('Error updating order:', error.message);
            setToast('Failed to update order status');
            setTimeout(() => setToast(''), 3000);
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             order.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
        return matchesSearch && matchesFilter;
    });


    return (
        <div className="min-h-screen bg-[#fffcf7] p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
                            <Package className="text-brand" size={32} />
                            Order Management
                        </h1>
                        <p className="text-gray-500 mt-1">Manage and track your customer orders</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-white border border-orange-100 rounded-2xl w-full sm:w-64 focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all shadow-sm"
                            />
                        </div>
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 bg-white border border-orange-100 rounded-2xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all shadow-sm font-semibold text-gray-600"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border border-orange-50 hover:shadow-md transition-shadow group relative overflow-hidden">
                            {/* Status Indicator Bar */}
                            <div className={`absolute left-0 top-0 bottom-0 w-2 ${
                                order.status === 'confirmed' ? 'bg-green-500' : 
                                order.status === 'rejected' ? 'bg-red-500' : 'bg-orange-400'
                            }`} />

                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Order Info */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                    order.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                                                    order.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                    {order.status}
                                                </span>
                                                <span className="text-gray-400 text-sm font-medium flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {format(parseISO(order.created_at), 'MMM dd, yyyy • p')}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                                <User size={18} className="text-brand" />
                                                {order.customer_name}
                                            </h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-brand">₹{order.total_amount}</p>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Total Payment</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 bg-gray-50 p-4 rounded-3xl border border-dashed border-gray-200 mb-4 transition-colors group-hover:bg-brand/5 group-hover:border-brand/20">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <User size={16} className="text-brand/60" />
                                            <p className="text-sm font-bold">{order.customer_name}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Phone size={16} className="text-brand/60" />
                                            <p className="text-sm font-bold tracking-tight">{order.contact_number || 'No contact provided'}</p>
                                        </div>
                                        <div className="flex items-start gap-2 text-gray-600">
                                            <MapPin size={16} className="mt-0.5 flex-shrink-0 text-brand/60" />
                                            <p className="text-sm font-medium leading-relaxed">{order.address}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Items Ordered</p>
                                        <div className="flex flex-wrap gap-2">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="bg-white border border-orange-100 px-3 py-1.5 rounded-xl text-sm font-bold text-gray-700 flex items-center gap-2 shadow-sm">
                                                    <span className="w-6 h-6 bg-brand/10 text-brand rounded-full flex items-center justify-center text-[10px]">{item.qty}</span>
                                                    {item.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="lg:w-60 flex flex-col gap-3 justify-center">
                                    {order.status === 'pending' ? (
                                        <>
                                            <button 
                                                onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                                className="w-full py-4 rounded-full font-bold bg-green-500 text-white hover:bg-green-600 shadow-sm text-sm uppercase tracking-wider transition-all"
                                            >
                                                Confirm
                                            </button>
                                            <button 
                                                onClick={() => updateOrderStatus(order.id, 'rejected')}
                                                className="w-full py-4 rounded-full font-bold bg-white border-2 border-red-500 text-red-500 hover:bg-red-50 text-sm uppercase tracking-wider transition-all"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    ) : (
                                        <div className={`w-full py-4 rounded-full font-bold text-white text-sm uppercase tracking-widest text-center shadow-sm ${
                                            order.status === 'confirmed' ? 'bg-green-500' : 'bg-red-500'
                                        }`}>
                                            {order.status}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <Package className="mx-auto mb-4 text-gray-200" size={64} />
                            <h3 className="text-xl font-bold text-gray-400">No orders found</h3>
                            <p className="text-gray-400">Try adjusting your filters or search terms</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
