import React, { useState } from 'react';
import { Lock, User, KeyRound, ShieldAlert, Store, ArrowRight, Sparkles } from 'lucide-react';
import { loginStaff } from '../../api';
import { useStore } from '../../context/StoreContext';

export function StoreLogin({ onLoginSuccess, onCancel }) {
  const { loginStaffSession, storeInfo } = useStore();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('raja123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginStaff(username, password);
      loginStaffSession(res.token);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('raja123');
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 p-8 text-center text-white relative">
          <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-500/30">
            <Store className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black">{storeInfo.name || 'RAJA STORE'}</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">Store Owner & Staff Management Portal</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-orange-300 text-[11px] font-bold mt-3">
            <Lock className="w-3 h-3" />
            <span>Authorized Personnel Only</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Staff username"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-3 focus:ring-orange-100 text-sm font-medium focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-3 focus:ring-orange-100 text-sm font-medium focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-black text-white py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 transition-all cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>LOGIN TO STORE APP</span>
                <ArrowRight className="w-4 h-4 text-orange-400" />
              </>
            )}
          </button>

          {/* Quick Demo Credentials Assistant */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 font-semibold mb-2">
              Default Demo Login: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">admin</code> / <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">raja123</code>
            </p>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Demo Credentials</span>
            </button>
          </div>

          {onCancel && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium"
              >
                ← Return to Customer App
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
