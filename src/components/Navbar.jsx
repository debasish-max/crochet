/* updated code for a minimal role-aware ui */
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { User, LayoutDashboard, ShoppingCart, Menu, X, Package, LogOut, ChevronDown, ShieldCheck, Plus } from "lucide-react";

export default function Navbar() {
  const { uniqueCount } = useCart();
  const { user, role } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();

  const isAdmin = role === 'admin';

  // Close menus when location changes or clicking outside
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsProfileOpen(false);
      setIsMenuOpen(false);
      
      // Attempt sign out but don't let it hang the UI
      const signOutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1000));
      
      await Promise.race([signOutPromise, timeoutPromise]);
    } catch (error) {
      console.error("Error during sign out:", error);
    } finally {
      // Manual fallback: Clear storage to ensure session is dead even if Supabase hung
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {}

      // Force clean redirect to login - this will trigger a fresh AuthContext state
      window.location.href = "/login";
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3 md:py-4">
        <Link to="/" className="group flex items-center">
          <h1 className="text-2xl md:text-3xl font-black text-brand tracking-tighter hover:scale-105 transition-transform">
            not.a.yarnie
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 font-semibold text-gray-600">
          {!isAdmin && (
            <Link 
              to="/cart" 
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${location.pathname === '/cart' ? 'bg-brand/10 text-brand' : 'hover:bg-gray-100'}`}
            >
              <ShoppingCart size={20} />
              <span>Cart</span>
              {uniqueCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white font-bold">
                  {uniqueCount}
                </span>
              )}
            </Link>
          )}

          {/* Orders Link - Visible for both but different paths */}
          {user && (
            <Link 
              to={isAdmin ? "/admin/orders" : "/orders"} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${location.pathname.includes('/orders') ? 'bg-brand/10 text-brand' : 'hover:bg-gray-100'}`}
            >
              <Package size={20} />
              <span>Orders</span>
            </Link>
          )}
          
          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center gap-2 p-1.5 pr-3 rounded-full transition-all border ${isProfileOpen ? 'border-brand bg-brand/5 ring-4 ring-brand/5' : 'border-gray-200 hover:border-brand/50 hover:bg-gray-50'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${user ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500'}`}>
                <User size={18} />
              </div>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-orange-100 rounded-2xl shadow-xl py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                {user ? (
                  <>
                    <div className="px-4 py-3 mb-1 border-b border-orange-50 bg-orange-50/30">
                      <p className="text-[10px] font-black uppercase tracking-widest text-orange-400">Account Type</p>
                      <p className="text-sm font-bold text-gray-700 capitalize">{role}</p>
                    </div>
                    {isAdmin && <DropdownItem to="/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" />}
                    {isAdmin && <DropdownItem to="/admin/products" icon={<Plus size={18} />} label="Products" />}
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <DropdownItem to="/login" icon={<User size={18} />} label="Login" />
                    <DropdownItem to="/signup" icon={<ShieldCheck size={18} />} label="Sign Up" />
                  </>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Toggle & Actions */}
        <div className="md:hidden flex items-center gap-3">
          {!isAdmin && (
            <Link to="/cart" className="relative p-2.5 rounded-xl bg-gray-50 text-gray-600">
              <ShoppingCart size={22} />
              {uniqueCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white font-bold">
                  {uniqueCount}
                </span>
              )}
            </Link>
          )}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2.5 rounded-xl transition-all ${isMenuOpen ? 'bg-brand text-white' : 'bg-gray-50 text-gray-800 hover:bg-gray-100'}`}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-orange-100 shadow-xl p-4 space-y-2 animate-in slide-in-from-top duration-200 origin-top">
          {user ? (
            <>
              {isAdmin && <MobileItem to="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" active={location.pathname === '/admin'} />}
              <MobileItem 
                to={isAdmin ? "/admin/orders" : "/orders"} 
                icon={<Package size={20} />} 
                label="Orders" 
                active={location.pathname.includes('/orders')} 
              />
              <div className="pt-2 mt-2 border-t border-orange-50">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 font-bold hover:bg-red-50 transition-colors"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <MobileItem to="/login" icon={<User size={20} />} label="Login" />
              <MobileItem to="/signup" icon={<ShieldCheck size={20} />} label="Create Account" />
            </>
          )}
          {!isAdmin && (
             <div className="border-t border-orange-50 pt-2 mt-2">
                <MobileItem to="/" icon={<LayoutDashboard size={20} />} label="Back to Shop" />
             </div>
          )}
        </div>
      )}
    </header>
  );
}

function DropdownItem({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-orange-50 hover:text-brand transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileItem({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${active ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
    >
      {icon}
      {label}
    </Link>
  );
}

