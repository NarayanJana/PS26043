import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GitBranch, LogOut, Menu, X } from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import NotificationBell from '../components/common/NotificationBell';

export default function DashboardLayout({ navItems, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const sidebarContent = (
    <>
      <div className="h-16 flex items-center justify-between px-6 border-b border-panelLight">
        <div className="flex items-center gap-2">
          <GitBranch size={18} className="text-signal" />
          <span className="font-display font-semibold text-ink50">Setu</span>
        </div>
        <button
          className="lg:hidden text-inkMuted"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                active
                  ? 'bg-signal/10 text-signal'
                  : 'text-inkMuted hover:text-ink50 hover:bg-panelLight'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-panelLight">
        <p className="text-sm text-ink50 font-medium truncate">{user?.name}</p>
        <p className="font-mono text-xs text-inkMuted mb-4">{user?.role}</p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-inkMuted hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-ink flex">
      {/* Desktop sidebar — always visible at lg breakpoint and above */}
      <aside className="hidden lg:flex w-64 bg-panel border-r border-panelLight flex-col shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar — slides in as an overlay, closed by default */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 bg-panel border-r border-panelLight flex flex-col z-50">
            {sidebarContent}
          </aside>
        </div>
      )}

      <main className="flex-1 overflow-y-auto min-w-0">
        <div className="h-16 border-b border-panelLight flex items-center justify-between px-4 lg:px-8">
          <button
            className="lg:hidden text-inkMuted"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="hidden lg:block" />
          <NotificationBell />
        </div>
        {children}
      </main>
    </div>
  );
}