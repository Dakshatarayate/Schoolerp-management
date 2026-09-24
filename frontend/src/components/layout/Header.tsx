import React, { useState, useRef, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Menu,
  Search,
  Calendar,
  Bell,
  Check,
  ChevronDown,
  User,
  Settings,
  LogOut,
  GraduationCap
} from 'lucide-react';

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const { currentScreen, setCurrentScreen, user, logout, settings, students, classes } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter students based on quick search
  const searchResults = searchQuery.trim()
    ? students
        .filter((s) =>
          `${s.firstName} ${s.lastName} ${s.studentId}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const screenTitles: Record<string, { title: string; subtitle?: string }> = {
    dashboard: { title: 'Dashboard', subtitle: "Here's what's happening in your school today." },
    students: { title: 'Students', subtitle: 'Manage student records and admissions.' },
    parents: { title: 'Parents', subtitle: 'Manage parent contact details and linked students.' },
    classes: { title: 'Classes', subtitle: 'Manage grade sections, capacities and class teachers.' },
    attendance: { title: 'Attendance', subtitle: 'Daily student attendance register.' },
    attendance_history: { title: 'Attendance History', subtitle: 'Historical attendance records.' },
    fees: { title: 'Fees & Payments', subtitle: 'Fee structures, collections and payment history.' },
    reports: { title: 'Reports', subtitle: 'Operational insights and summaries.' },
    settings: { title: 'School Settings', subtitle: 'Configure school details and academic preferences.' }
  };

  const currentMeta = screenTitles[currentScreen] || { title: 'SchoolERP' };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="p-2 -ml-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
              {currentMeta.title}
            </h1>
            {currentMeta.subtitle && (
              <p className="hidden sm:block text-xs text-slate-500 truncate max-w-xs md:max-w-md">
                {currentMeta.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Center/Right: Quick Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden md:block" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search students by name or ID..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 transition-all text-slate-800 placeholder:text-slate-400"
            />

            {/* Quick Search Results Dropdown */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50">
                <div className="p-2 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Search Results ({searchResults.length})
                </div>
                {searchResults.length === 0 ? (
                  <div className="p-4 text-xs text-slate-500 text-center">
                    No matching student records found.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {searchResults.map((s) => {
                      const cls = classes.find((c) => c.id === s.classId);
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            setCurrentScreen('students');
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="w-full p-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">
                              {s.firstName[0]}
                            </div>
                            <div>
                              <div className="font-semibold text-xs text-slate-900">
                                {s.firstName} {s.lastName}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {s.studentId}
                              </div>
                            </div>
                          </div>
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                            {cls ? `${cls.className} ${cls.section}` : 'Class'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Tools: Academic Year, Notifications & Profile */}
        <div className="flex items-center gap-3">
          {/* Academic Year Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>{settings.academicYear}</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-in zoom-in-95 duration-100">
                <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Administrative Notices</span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                    3 New
                  </span>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="font-semibold text-slate-900">Pending Fees Reminder</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      42 students have pending balances for Term 2.
                    </div>
                  </div>
                  <div className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="font-semibold text-slate-900">Attendance Logged</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Class 3A homeroom attendance synced successfully.
                    </div>
                  </div>
                  <div className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="font-semibold text-slate-900">New Admission</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Aarav Sharma added to Junior KG - Section A.
                    </div>
                  </div>
                </div>
                <div className="p-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setIsNotificationOpen(false);
                      setCurrentScreen('fees');
                    }}
                    className="text-[11px] font-semibold text-blue-600 hover:underline"
                  >
                    View Fee Collections →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

          {/* Admin User Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {user?.avatar || 'AD'}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {user?.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-slate-500">School Admin</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-in zoom-in-95 duration-100">
                <div className="p-3.5 border-b border-slate-100">
                  <div className="font-bold text-xs text-slate-900 truncate">{user?.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                  <div className="mt-1 text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                    Role: Administrator
                  </div>
                </div>

                <div className="p-1 space-y-0.5 text-xs">
                  <button
                    onClick={() => {
                      setCurrentScreen('settings');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-left"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>School Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentScreen('students');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-left"
                  >
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <span>Students Directory</span>
                  </button>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
