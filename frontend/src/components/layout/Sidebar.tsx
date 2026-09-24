import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { ActiveScreen } from '../../types';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  CalendarCheck,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose }) => {
  const { currentScreen, setCurrentScreen, user, logout } = useSchool();

  const navItems: { id: ActiveScreen; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'students', label: 'Students', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'parents', label: 'Parents', icon: <Users className="w-5 h-5" /> },
    { id: 'classes', label: 'Classes', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'attendance', label: 'Attendance', icon: <CalendarCheck className="w-5 h-5" /> },
    { id: 'fees', label: 'Fees & Payments', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  const handleNavClick = (screen: ActiveScreen) => {
    setCurrentScreen(screen);
    onMobileClose();
  };

  return (
    <>
      {/* Mobile Backdrop Scrim */}
      {isMobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 flex flex-col justify-between z-40 bg-[#0B1C30] text-slate-200 border-r border-slate-800 transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 flex flex-col h-full overflow-hidden">
          {/* Top Brand & Header */}
          <div className="flex items-center justify-between px-2 py-2 mb-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base text-white tracking-tight">SchoolERP</span>
                <span className="text-[11px] text-slate-400">Greenwood Valley</span>
              </div>
            </div>
            <button
              onClick={onMobileClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
            {navItems.map((item) => {
              const isActive =
                currentScreen === item.id ||
                (item.id === 'attendance' && currentScreen === 'attendance_history');

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Admin Profile & Logout */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center border border-blue-500/30 shrink-0">
                {user?.avatar || 'AD'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-xs text-white truncate">{user?.name || 'Administrator'}</div>
                <div className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@greenwoodschool.edu'}</div>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
