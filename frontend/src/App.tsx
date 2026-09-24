/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LoginView } from './components/auth/LoginView';
import { DashboardView } from './components/dashboard/DashboardView';
import { StudentsView } from './components/students/StudentsView';
import { ParentsView } from './components/parents/ParentsView';
import { ClassesView } from './components/classes/ClassesView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { AttendanceHistoryView } from './components/attendance/AttendanceHistoryView';
import { FeesView } from './components/fees/FeesView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { StudentFormModal } from './components/students/StudentFormModal';
import { CollectFeeModal } from './components/fees/CollectFeeModal';
import { ReceiptModal } from './components/common/ReceiptModal';
import { ToastContainer } from './components/common/ToastContainer';

const MainAppContent: React.FC = () => {
  const { user, currentScreen, setCurrentScreen } = useSchool();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global modals
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [collectFeeStudentId, setCollectFeeStudentId] = useState<string | null>(null);
  const [isCollectFeeModalOpen, setIsCollectFeeModalOpen] = useState(false);

  // If user is not logged in, render the login view
  if (!user) {
    return (
      <>
        <LoginView />
        <ToastContainer />
      </>
    );
  }

  const handleOpenCollectFee = (studentId?: string) => {
    setCollectFeeStudentId(studentId || null);
    setIsCollectFeeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col antialiased text-[#0F172A]">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Frame */}
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all">
        {/* Top Header */}
        <Header onMobileMenuToggle={() => setIsMobileSidebarOpen(true)} />

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentScreen === 'dashboard' && (
            <DashboardView
              onAddStudentClick={() => setIsAddStudentModalOpen(true)}
              onRecordFeeClick={handleOpenCollectFee}
            />
          )}

          {currentScreen === 'students' && (
            <StudentsView onCollectFee={handleOpenCollectFee} />
          )}

          {currentScreen === 'parents' && <ParentsView />}

          {currentScreen === 'classes' && <ClassesView />}

          {currentScreen === 'attendance' && <AttendanceView />}

          {currentScreen === 'attendance_history' && (
            <AttendanceHistoryView
              onBackToRegister={() => setCurrentScreen('attendance')}
            />
          )}

          {currentScreen === 'fees' && (
            <FeesView onCollectFeeForStudent={handleOpenCollectFee} />
          )}

          {currentScreen === 'reports' && <ReportsView />}

          {currentScreen === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Modals & Overlays */}
      <StudentFormModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
      />

      <CollectFeeModal
        isOpen={isCollectFeeModalOpen}
        onClose={() => {
          setIsCollectFeeModalOpen(false);
          setCollectFeeStudentId(null);
        }}
        preSelectedStudentId={collectFeeStudentId}
      />

      <ReceiptModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <MainAppContent />
    </SchoolProvider>
  );
}
