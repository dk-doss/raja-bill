import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Clock, PackageCheck, Check, AlertTriangle, Phone, Store, MapPin, Search, ArrowRight, Share2, Sparkles, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../../context/StoreContext';
import { fetchOrderByIdentifier, fetchOrdersByPhone, subscribeToEvents } from '../../api';
import { sound } from '../../utils/audio';

const ORDER_STATUS_STEPS = [
  { id: 'ORDER RECEIVED', label: 'Order Received', desc: 'The order has been sent to RAJA STORE.' },
  { id: 'ACCEPTED', label: 'Accepted', desc: 'The shop has accepted your order.' },
  { id: 'PREPARING', label: 'Preparing', desc: 'The shop is preparing and packing your products.' },
  { id: 'READY FOR COLLECTION', label: 'Ready for Collection', desc: '🎉 Your order is ready! Please come to RAJA STORE to collect.' },
  { id: 'COLLECTED', label: 'Collected', desc: 'The order has been collected. Thank you for shopping with us!' }
];

export function OrderTrackerModal({ isOpen, onClose, initialOrder }) {
  const { storeInfo, activeTrackingId, trackOrder } = useStore();

  const [order, setOrder] = useState(initialOrder || null);
  const [lookupQuery, setLookupQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // If initialOrder passed, set it
  useEffect(() => {
    if (initialOrder) {
      setOrder(initialOrder);
    } else if (activeTrackingId) {
      loadOrder(activeTrackingId);
    }
  }, [initialOrder, activeTrackingId]);

  // Subscribe to SSE updates so this customer sees status changes in real-time!
  useEffect(() => {
    const unsubscribe = subscribeToEvents((event) => {
      if (event.type === 'order_status_updated' && order) {
        if (event.data.id === order.id || String(event.data.orderNumber) === String(order.orderNumber)) {
          const oldStatus = order.status;
          const newStatus = event.data.status;
          setOrder(event.data);

          // Celebrate if changed to READY FOR COLLECTION!
          if (newStatus === 'READY FOR COLLECTION' && oldStatus !== 'READY FOR COLLECTION') {
            sound.playSuccessChime();
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.5 }
            });
          }
        }
      }
    });

    return () => unsubscribe();
  }, [order]);

  const loadOrder = async (identifier) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchOrderByIdentifier(identifier);
      setOrder(data);
      trackOrder(data.orderNumber);
    } catch (err) {
      // Try searching by phone
      try {
        const phoneOrders = await fetchOrdersByPhone(identifier);
        if (phoneOrders && phoneOrders.length > 0) {
          setOrder(phoneOrders[0]);
          trackOrder(phoneOrders[0].orderNumber);
        } else {
          setError('No order found with this Order Number or Phone Number.');
        }
      } catch (e2) {
        setError('No order found with this Order Number or Phone Number.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLookupSubmit = (e) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;
    loadOrder(lookupQuery.trim());
  };

  if (!isOpen) return null;

  // Determine current step index
  const currentStepIndex = order
    ? ORDER_STATUS_STEPS.findIndex(s => s.id === order.status)
    : -1;

  const isCancelled = order && order.status === 'CANCELLED';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Order Status Tracker</h3>
              <p className="text-xs text-slate-500 font-medium">Live updates from {storeInfo.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-7 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Order Lookup Bar */}
          <form onSubmit={handleLookupSubmit} className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Enter Order # (e.g. 1001) or 10-digit Phone"
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 font-medium focus:outline-hidden"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                Track
              </button>
            </div>
            {error && <p className="text-rose-600 text-xs font-semibold mt-1.5">{error}</p>}
          </form>

          {/* Active Order Display */}
          {order ? (
            <div className="space-y-6">
              
              {/* Order Number & Highlight Card */}
              <div className={`rounded-2xl p-5 border text-center ${
                order.status === 'READY FOR COLLECTION'
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-400 shadow-lg shadow-emerald-500/20'
                  : isCancelled
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 text-slate-900'
              }`}>
                
                {order.status === 'READY FOR COLLECTION' && (
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ready for Pickup Now!</span>
                  </div>
                )}

                <h4 className="text-xs font-bold uppercase tracking-wider opacity-80">
                  {order.status === 'READY FOR COLLECTION' ? 'Your Order is Ready' : 'Order Number'}
                </h4>
                <div className="text-3xl sm:text-4xl font-black tracking-tight my-1">
                  {order.orderDisplayNumber || `#${order.orderNumber}`}
                </div>
                <p className={`text-xs font-medium max-w-sm mx-auto ${order.status === 'READY FOR COLLECTION' ? 'text-white/90' : 'text-slate-600'}`}>
                  {order.status === 'READY FOR COLLECTION'
                    ? `Please come to ${storeInfo.name} counter to collect your order.`
                    : `Thank you, ${order.customerName}! Your order has been placed successfully.`}
                </p>

                <div className="mt-3 pt-3 border-t border-black/10 flex items-center justify-center gap-4 text-xs font-bold">
                  <span>Customer: {order.customerName}</span>
                  <span>•</span>
                  <span>Amount: ₹{order.totalAmount}</span>
                </div>
              </div>

              {/* Status Stepper */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Live Order Status
                </h5>

                {isCancelled ? (
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h6 className="font-bold text-rose-900 text-sm">Order Cancelled</h6>
                      <p className="text-xs text-rose-700 mt-1">
                        {order.cancelReason || 'This order was cancelled by store staff.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ORDER_STATUS_STEPS.map((step, idx) => {
                      const isCompleted = currentStepIndex > idx;
                      const isCurrent = currentStepIndex === idx;

                      return (
                        <div key={step.id} className="flex items-start gap-3.5 relative">
                          {/* Connector Line */}
                          {idx < ORDER_STATUS_STEPS.length - 1 && (
                            <div
                              className={`absolute left-4 top-8 -bottom-4 w-0.5 ${
                                currentStepIndex > idx ? 'bg-emerald-500' : 'bg-slate-200'
                              }`}
                            ></div>
                          )}

                          {/* Step Icon Indicator */}
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                              isCompleted
                                ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-50'
                                : isCurrent
                                ? 'bg-orange-600 text-white shadow-md ring-4 ring-orange-100 animate-pulse'
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-4 h-4 stroke-[3]" />
                            ) : isCurrent ? (
                              <Clock className="w-4 h-4" />
                            ) : (
                              <span>○</span>
                            )}
                          </div>

                          {/* Step Details */}
                          <div className="flex-1 pt-0.5">
                            <div className="flex items-center justify-between">
                              <h6
                                className={`text-xs sm:text-sm font-extrabold ${
                                  isCurrent
                                    ? 'text-orange-600'
                                    : isCompleted
                                    ? 'text-slate-900'
                                    : 'text-slate-400'
                                }`}
                              >
                                {step.label}
                              </h6>
                              {isCurrent && (
                                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 tracking-wider">
                                  Current Status
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-xs mt-0.5 leading-relaxed ${
                                isCurrent
                                  ? 'text-slate-700 font-medium'
                                  : isCompleted
                                  ? 'text-slate-500'
                                  : 'text-slate-400'
                              }`}
                            >
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Order Items Breakdown */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Ordered Items ({order.items?.length || 0})
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">
                    Total: ₹{order.totalAmount}
                  </span>
                </div>

                <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto">
                  {order.items?.map((item, i) => (
                    <div key={i} className="py-1.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{item.name}</span>
                        {item.packSize && (
                          <span className="text-slate-400 ml-1">({item.packSize})</span>
                        )}
                      </div>
                      <div className="font-semibold text-slate-700">
                        {item.quantity} × ₹{item.price} = <span className="font-bold text-slate-900">₹{item.subtotal}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {order.note && (
                  <div className="pt-2 border-t border-slate-200 text-xs">
                    <span className="font-bold text-slate-700">Your Note: </span>
                    <span className="text-slate-600 italic">"{order.note}"</span>
                  </div>
                )}
              </div>

              {/* Pickup Address & Contact */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h6 className="font-bold text-amber-900 text-xs sm:text-sm">
                      Collection Point: {storeInfo.name}
                    </h6>
                    <p className="text-xs text-amber-800 mt-0.5">
                      {storeInfo.address}
                    </p>
                    <p className="text-[11px] text-amber-700 mt-1 font-semibold">
                      Timings: {storeInfo.pickupTimings}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-amber-200/60 flex flex-wrap gap-2">
                  <a
                    href={`tel:${storeInfo.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Store ({storeInfo.phone})</span>
                  </a>

                  {storeInfo.whatsapp && (
                    <a
                      href={`https://wa.me/${storeInfo.whatsapp.replace(/\D/g, '')}?text=Hi%20RAJA%20STORE,%20checking%20status%20for%20order%20${encodeURIComponent(order.orderDisplayNumber)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Store</span>
                    </a>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">No Active Order Selected</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Enter your Order Number above (e.g. 1001) or 10-digit mobile number to track the live progress.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            Live auto-updating status via RAJA STORE network
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
