import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { LabLinkIcon } from './components/brand/LabLinkIcon';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const BookingsPage = lazy(() => import('./pages/BookingsPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ApprovalsPage = lazy(() => import('./pages/ApprovalsPage'));
const AllocationPage = lazy(() => import('./pages/AllocationPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

const PageLoader = () => (
  <div className="min-h-screen bg-[#0a0a09] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 rounded-[2px] bg-[#181916] border border-[#232321] flex items-center justify-center text-[#f0c45a] animate-pulse">
        <LabLinkIcon size={22} className="text-[#f0c45a]" />
      </div>
      <p className="text-xs font-mono text-[#8e8e8c]">CONNECTING TO LABLINK GRID…</p>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/approvals" element={<ApprovalsPage />} />
              <Route path="/allocation" element={<AllocationPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </Suspense>
      </AppProvider>
    </BrowserRouter>
  );
}
