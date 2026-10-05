import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, AlertCircle, Phone, User, FileText, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { placeOrder } from '../../api';
import { sound } from '../../utils/audio';

export function CartDrawer({ isOpen, onClose, onOrderPlaced }) {
  const { items, updateQuantity, removeFromCart, clearCart, itemCount, totalAmount, showNotification } = useCart();
  const { storeInfo, trackOrder } = useStore();
  const { lang, t } = useLanguage();

  const [step, setStep] = useState('cart'); // 'cart' | 'details'
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateDetails = () => {
    const errs = {};
    if (!customerName.trim()) {
      errs.name = lang === 'ta' ? 'தயவுசெய்து உங்கள் பெயரை உள்ளிடவும்' : 'Please enter your name';
    }
    const cleanPhone = phoneNumber.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = lang === 'ta' ? 'சரியான 10 இலக்க செல்போன் எண்ணை உள்ளிடவும்' : 'Please enter a valid 10-digit mobile number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateDetails()) return;
    if (items.length === 0) {
      showNotification(t('emptyCartTitle'), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName: customerName.trim(),
        phone: phoneNumber.trim(),
        note: orderNote.trim(),
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      };

      const createdOrder = await placeOrder(orderPayload);
      
      // Play celebratory sound & confetti
      sound.playSuccessChime();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Clear cart
      clearCart();
      
      // Set active tracking order
      trackOrder(createdOrder.orderNumber);

      // Transition to Tracker Modal
      onClose();
      if (onOrderPlaced) {
        onOrderPlaced(createdOrder);
      }
    } catch (err) {
      showNotification(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {step === 'cart' ? t('yourCart') : t('customerDetails')}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {step === 'cart' ? t('itemsSelected', { count: itemCount }) : t('selfPickupBadge')}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">{t('emptyCartTitle')}</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    {t('emptyCartDesc')}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors shadow-sm cursor-pointer"
                >
                  {t('startShopping')}
                </button>
              </div>
            ) : step === 'cart' ? (
              
              /* Cart Items List */
              <div className="space-y-4">
                
                {/* Pickup Reminder Banner */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    {t('noDeliveryReminder')}
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <div key={item.product.id} className="py-3 flex items-center gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 object-contain rounded-lg bg-slate-50 p-1 border border-slate-100 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {item.product.name}
                        </h5>
                        <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                          {item.product.packSize}
                        </div>
                        <div className="text-xs text-slate-700 font-bold mt-1">
                          ₹{item.product.price} × {item.quantity} = <span className="text-orange-600 font-extrabold">₹{item.product.price * item.quantity}</span>
                        </div>
                      </div>

                      {/* Quantity Selector & Remove */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 rounded bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center font-bold text-xs shadow-2xs cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-black text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs shadow-2xs ${
                              item.quantity >= item.product.stock
                                ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                : 'bg-white text-slate-700 hover:bg-slate-50 cursor-pointer'
                            }`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            ) : (

              /* Customer Details Step */
              <form id="orderForm" onSubmit={handlePlaceOrder} className="space-y-4">
                
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-600" />
                    <span>{t('collectionPoint')}</span>
                  </div>
                  <p className="text-slate-600 pl-5">{storeInfo.address}</p>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t('customerName')}</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('namePlaceholder')}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-hidden transition-all ${
                      errors.name ? 'border-rose-300 bg-rose-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-3 focus:ring-orange-100'
                    }`}
                  />
                  {errors.name && <p className="text-rose-600 text-[11px] font-semibold mt-1">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t('phoneNumber')}</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">+91</span>
                    <input
                      type="tel"
                      required
                      placeholder={t('phonePlaceholder')}
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      className={`w-full pl-11 pr-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-hidden transition-all ${
                        errors.phone ? 'border-rose-300 bg-rose-50/50' : 'border-slate-300 focus:border-orange-500 focus:ring-3 focus:ring-orange-100'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-rose-600 text-[11px] font-semibold mt-1">{errors.phone}</p>}
                  <p className="text-[11px] text-slate-400 mt-1">{t('phoneHint')}</p>
                </div>

                {/* Optional Order Note */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t('orderNote')}</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder={t('notePlaceholder')}
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-3 focus:ring-orange-100 text-sm font-medium focus:outline-hidden transition-all"
                  />
                </div>

              </form>
            )}

          </div>

          {/* Footer / Total & Action Button */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/80 space-y-3">
              
              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between font-semibold">
                  <span>{t('itemsTotal')} ({itemCount})</span>
                  <span className="text-slate-800">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between font-semibold text-emerald-700">
                  <span>{t('pickupFee')}</span>
                  <span>{t('free')}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                  <span>{t('grandTotal')}</span>
                  <span className="text-orange-600 text-lg">₹{totalAmount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              {step === 'cart' ? (
                <button
                  onClick={() => setStep('details')}
                  className="w-full bg-orange-600 hover:bg-orange-700 active:scale-98 text-white py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
                >
                  <span>{t('continue')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {t('back')}
                  </button>
                  <button
                    type="submit"
                    form="orderForm"
                    disabled={isSubmitting}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>{t('placingOrder')}</span>
                      </span>
                    ) : (
                      <span>{t('placeOrder')} (₹{totalAmount})</span>
                    )}
                  </button>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
