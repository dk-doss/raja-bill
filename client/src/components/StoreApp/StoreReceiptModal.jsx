import React from 'react';
import { X, Printer, Store, Phone, Calendar, User, FileText, CheckCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function StoreReceiptModal({ order, isOpen, onClose }) {
  const { storeInfo } = useStore();

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Top Bar */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-slate-700" />
            <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
              Packing Slip / Order Receipt
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-8 font-mono text-slate-900 bg-white" id="printable-receipt">
          {/* Receipt Header */}
          <div className="text-center pb-4 border-b-2 border-dashed border-slate-300">
            <h2 className="text-2xl font-black tracking-tight">{storeInfo.name || 'RAJA STORE'}</h2>
            <p className="text-xs text-slate-600 mt-1">{storeInfo.address}</p>
            <p className="text-xs text-slate-600">Phone: {storeInfo.phone}</p>
            <div className="inline-block mt-2 px-2 py-0.5 border border-slate-900 text-[11px] font-bold uppercase tracking-wider">
              STORE PICKUP ONLY — NO DELIVERY
            </div>
          </div>

          {/* Order Details */}
          <div className="py-4 border-b border-dashed border-slate-300 text-xs space-y-1">
            <div className="flex justify-between font-bold text-sm">
              <span>ORDER NUMBER:</span>
              <span>{order.orderDisplayNumber || `#${order.orderNumber}`}</span>
            </div>
            <div className="flex justify-between">
              <span>DATE & TIME:</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>CUSTOMER:</span>
              <span className="font-bold">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>PHONE:</span>
              <span className="font-bold">{order.phone}</span>
            </div>
            <div className="flex justify-between">
              <span>STATUS:</span>
              <span className="font-bold uppercase">{order.status}</span>
            </div>
            {order.note && (
              <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded text-[11px]">
                <span className="font-bold">CUSTOMER NOTE: </span>
                <span>{order.note}</span>
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="py-4 border-b-2 border-dashed border-slate-300">
            <div className="flex justify-between font-bold text-xs uppercase pb-2 border-b border-slate-200">
              <span className="w-1/2">Item</span>
              <span className="w-1/6 text-center">Qty</span>
              <span className="w-1/6 text-right">Price</span>
              <span className="w-1/6 text-right">Total</span>
            </div>

            <div className="divide-y divide-slate-100 py-2">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-1.5 flex justify-between text-xs">
                  <div className="w-1/2 pr-2">
                    <p className="font-bold leading-tight">{item.name}</p>
                    {item.packSize && <p className="text-[10px] text-slate-500">{item.packSize}</p>}
                  </div>
                  <div className="w-1/6 text-center font-bold">{item.quantity}</div>
                  <div className="w-1/6 text-right">₹{item.price}</div>
                  <div className="w-1/6 text-right font-bold">₹{item.subtotal}</div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="pt-3 border-t-2 border-dashed border-slate-300 flex justify-between font-black text-base">
              <span>GRAND TOTAL:</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>

          {/* Receipt Footer */}
          <div className="pt-4 text-center text-xs text-slate-500 space-y-1">
            <p className="font-bold text-slate-800">Thank you for ordering at {storeInfo.name}!</p>
            <p className="text-[11px]">Please collect this package at the store pickup counter.</p>
            <p className="text-[10px] text-slate-400">Generated: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
