import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle, Package, ArrowRight, Printer, AlertTriangle, Phone, 
  Search, MessageCircle, X, ChevronRight, User, Filter, RefreshCw, AlertCircle
} from 'lucide-react';
import { fetchOrders, updateOrderStatus, subscribeToEvents } from '../../api';
import { StoreReceiptModal } from './StoreReceiptModal';
import { useLanguage } from '../../context/LanguageContext';
import { sound } from '../../utils/audio';

export function StoreOrders() {
  const { lang, t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const STATUS_TABS = [
    { id: 'ALL', label: lang === 'ta' ? 'அனைத்து ஆர்டர்கள்' : 'All Orders' },
    { id: 'ORDER RECEIVED', label: lang === 'ta' ? 'புதியவை (New)' : 'New Received', color: 'rose' },
    { id: 'ACCEPTED', label: lang === 'ta' ? 'ஏற்கப்பட்டவை' : 'Accepted', color: 'amber' },
    { id: 'PREPARING', label: lang === 'ta' ? 'தயாராகிறது' : 'Preparing', color: 'blue' },
    { id: 'READY FOR COLLECTION', label: lang === 'ta' ? 'பெற தயார்' : 'Ready for Pickup', color: 'emerald' },
    { id: 'COLLECTED', label: lang === 'ta' ? 'முடிந்தவை' : 'Collected', color: 'slate' },
    { id: 'CANCELLED', label: lang === 'ta' ? 'ரத்து' : 'Cancelled', color: 'gray' }
  ];

  useEffect(() => {
    loadOrders();

    // Subscribe to SSE for live order updates
    const unsubscribe = subscribeToEvents((event) => {
      if (event.type === 'new_order' || event.type === 'order_status_updated') {
        loadOrders();
      }
    });

    return () => unsubscribe();
  }, [selectedStatus]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await fetchOrders({
        status: selectedStatus,
        search: searchQuery
      });
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus, note = '', reason = '') => {
    setUpdatingId(orderId);
    try {
      sound.playClick();
      await updateOrderStatus(orderId, newStatus, note, reason);
      await loadOrders();
      setCancellingOrderId(null);
      setCancelReason('');
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancelSubmit = (e) => {
    e.preventDefault();
    if (!cancellingOrderId) return;
    handleStatusChange(cancellingOrderId, 'CANCELLED', 'Cancelled by store staff', cancelReason || 'Out of stock or unavailable');
  };

  const filteredOrders = orders.filter(o => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      o.orderDisplayNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.phone.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Top Controls: Status Tabs & Search */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {STATUS_TABS.map((tab) => {
            const count = tab.id === 'ALL'
              ? orders.length
              : orders.filter(o => o.status === tab.id).length;
            const isSelected = selectedStatus === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                  isSelected ? 'bg-slate-700 text-white' : 'bg-white text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Refresh */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={lang === 'ta' ? 'ஆர்டர் எண், வாடிக்கையாளர் பெயர் அல்லது போன் எண் கொண்டு தேடுக...' : 'Search by Order #, Customer Name, or Phone...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <button
            onClick={loadOrders}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refresh orders"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Package className="w-7 h-7" />
          </div>
          <h4 className="font-bold text-slate-800 text-base">
            {lang === 'ta' ? 'ஆர்டர்கள் எதுவும் இல்லை' : 'No orders found'}
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            {selectedStatus === 'ALL'
              ? (lang === 'ta' ? 'வாடிக்கையாளர்கள் இன்னும் ஆர்டர் செய்யவில்லை.' : 'No customer orders have been placed yet.')
              : `${lang === 'ta' ? 'இந்த நிலையில் ஆர்டர்கள் இல்லை' : 'No orders currently in this status.'}`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredOrders.map((order) => {
            const isUpdating = updatingId === order.id;

            return (
              <div
                key={order.id}
                className={`bg-white rounded-3xl border transition-all duration-200 shadow-xs flex flex-col justify-between overflow-hidden ${
                  order.status === 'ORDER RECEIVED'
                    ? 'border-rose-300 ring-2 ring-rose-100'
                    : order.status === 'READY FOR COLLECTION'
                    ? 'border-emerald-300'
                    : 'border-slate-200'
                }`}
              >
                
                {/* Top Order Card Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-slate-900 tracking-tight">
                        {order.orderDisplayNumber || `#${order.orderNumber}`}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-extrabold text-xs text-slate-800 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {order.customerName}
                      </span>
                      <span className="text-slate-300">•</span>
                      <a
                        href={`tel:${order.phone}`}
                        className="text-xs text-slate-600 font-semibold hover:text-orange-600 flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-slate-400" />
                        {order.phone}
                      </a>
                    </div>
                  </div>

                  {/* Status Badge & Actions */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span
                      className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        order.status === 'ORDER RECEIVED'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                          : order.status === 'ACCEPTED'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : order.status === 'PREPARING'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : order.status === 'READY FOR COLLECTION'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : order.status === 'COLLECTED'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {t(order.status) || order.status}
                    </span>

                    <button
                      onClick={() => setSelectedReceiptOrder(order)}
                      className="text-slate-500 hover:text-slate-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      title={t('printSlip')}
                    >
                      <Printer className="w-3 h-3" />
                      <span>{t('printSlip')}</span>
                    </button>
                  </div>
                </div>

                {/* Body: Items Checklist & Note */}
                <div className="p-4 sm:p-5 space-y-3.5 flex-1">
                  
                  {/* Customer Order Note if present */}
                  {order.note && (
                    <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 text-xs text-amber-900 font-medium flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">{t('yourNote')}: </span>
                        <span>"{order.note}"</span>
                      </div>
                    </div>
                  )}

                  {/* Items list */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {t('orderedItems')} ({order.items?.length || 0})
                    </div>
                    
                    <div className="divide-y divide-slate-100 bg-slate-50/70 rounded-xl p-2.5 border border-slate-100">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="py-1.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-700 font-black text-[11px] flex items-center justify-center">
                              {item.quantity}
                            </span>
                            <div>
                              <span className="font-bold text-slate-800">{item.name}</span>
                              {item.packSize && (
                                <span className="text-[11px] text-slate-400 ml-1">({item.packSize})</span>
                              )}
                            </div>
                          </div>
                          <span className="font-extrabold text-slate-900">
                            ₹{item.subtotal}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`tel:${order.phone}`}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{t('callCustomer')}</span>
                    </a>

                    <a
                      href={`https://wa.me/91${order.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(order.customerName)},%20this%20is%20RAJA%20STORE%20regarding%20your%20Order%20${encodeURIComponent(order.orderDisplayNumber)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t('whatsappCustomer')}</span>
                    </a>
                  </div>

                </div>

                {/* Footer: Grand Total & Status Action Buttons */}
                <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">{t('grandTotal')}</span>
                    <span className="text-lg font-black text-slate-900">₹{order.totalAmount}</span>
                  </div>

                  {/* Workflow Action Buttons */}
                  <div className="flex items-center gap-2">
                    {order.status === 'ORDER RECEIVED' && (
                      <>
                        <button
                          disabled={isUpdating}
                          onClick={() => handleStatusChange(order.id, 'ACCEPTED', 'Order accepted by store staff')}
                          className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{t('acceptOrder')}</span>
                        </button>
                        <button
                          onClick={() => { setCancellingOrderId(order.id); setCancelReason(''); }}
                          className="px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          {t('cancelOrder')}
                        </button>
                      </>
                    )}

                    {order.status === 'ACCEPTED' && (
                      <>
                        <button
                          disabled={isUpdating}
                          onClick={() => handleStatusChange(order.id, 'PREPARING', 'Shop staff packing items')}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50"
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>{t('startPreparing')}</span>
                        </button>
                        <button
                          onClick={() => { setCancellingOrderId(order.id); setCancelReason(''); }}
                          className="px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          {t('cancelOrder')}
                        </button>
                      </>
                    )}

                    {order.status === 'PREPARING' && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(order.id, 'READY FOR COLLECTION', 'Order packed and on counter')}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>{t('markReady')}</span>
                      </button>
                    )}

                    {order.status === 'READY FOR COLLECTION' && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(order.id, 'COLLECTED', 'Customer collected package at store counter')}
                        className="w-full bg-slate-900 hover:bg-black text-white py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-slate-900/20 cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>{t('markCollected')}</span>
                      </button>
                    )}

                    {order.status === 'COLLECTED' && (
                      <div className="w-full py-2 text-center text-xs font-bold text-slate-500 bg-slate-200/60 rounded-xl">
                        ✓ {lang === 'ta' ? 'ஆர்டர் வெற்றிகரமாக வழங்கப்பட்டது' : 'Order Completed & Collected'}
                      </div>
                    )}

                    {order.status === 'CANCELLED' && (
                      <div className="w-full py-2 text-center text-xs font-bold text-rose-600 bg-rose-100/60 rounded-xl">
                        ✕ {lang === 'ta' ? 'ஆர்டர் ரத்து செய்யப்பட்டது' : 'Order Cancelled'} ({order.cancelReason || 'Staff cancelled'})
                      </div>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancellingOrderId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="font-extrabold text-base text-slate-900">
                {lang === 'ta' ? 'ஆர்டரை ரத்து செய்' : 'Cancel Order'}
              </h4>
            </div>

            <p className="text-xs text-slate-600">
              {lang === 'ta'
                ? 'இந்த ஆர்டரை ரத்து செய்தால், பொருட்களின் இருப்பு (stock) தானாகவே மீண்டும் சேர்க்கப்படும்.'
                : 'Cancelling this order will immediately restore product stock levels and notify the customer.'}
            </p>

            <form onSubmit={handleCancelSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'ta' ? 'ரத்து செய்வதற்கான காரணம்' : 'Reason for Cancellation'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ta' ? 'எ.கா: இருப்பு இல்லை, வாடிக்கையாளர் கோரிக்கை' : 'e.g. Out of stock, Customer requested cancellation'}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancellingOrderId(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {t('back')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-black hover:bg-rose-700 cursor-pointer"
                >
                  {lang === 'ta' ? 'உறுதி செய்' : 'Confirm Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      <StoreReceiptModal
        isOpen={Boolean(selectedReceiptOrder)}
        order={selectedReceiptOrder}
        onClose={() => setSelectedReceiptOrder(null)}
      />

    </div>
  );
}
