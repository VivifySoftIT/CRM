import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import DashboardLayout from './components/DashboardLayout'
import SuperAdminLayout from './components/SuperAdminLayout'
import { ThemeProvider } from './context/ThemeContext'

// Lazy load modules for performance
const Contacts = lazy(() => import('./pages/modules/Contacts'))
const Pipeline = lazy(() => import('./pages/modules/Pipeline'))
const Marketing = lazy(() => import('./pages/modules/Marketing'))
const Support = lazy(() => import('./pages/modules/Support'))
const Analytics = lazy(() => import('./pages/modules/Analytics'))
const Quotes = lazy(() => import('./pages/modules/Quotes'))
const Documents = lazy(() => import('./pages/modules/Documents'))
const Tasks = lazy(() => import('./pages/modules/Tasks'))
const Calendar = lazy(() => import('./pages/modules/Calendar'))
const Automation = lazy(() => import('./pages/modules/Automation'))
const Portal = lazy(() => import('./pages/modules/Portal'))
const Products = lazy(() => import('./pages/modules/Products'))
const Messaging = lazy(() => import('./pages/modules/Messaging'))
const Contracts = lazy(() => import('./pages/modules/Contracts'))
const Subscriptions = lazy(() => import('./pages/modules/Subscriptions'))
const Feedback = lazy(() => import('./pages/modules/Feedback'))
const Referrals = lazy(() => import('./pages/modules/Referrals'))
const SuperAdmin = lazy(() => import('./pages/modules/SuperAdmin'))
const Companies = lazy(() => import('./pages/modules/Companies'))
const Settings = lazy(() => import('./pages/modules/Settings'))
const SuperAnalytics = lazy(() => import('./pages/modules/Analytics'))
const SystemHealth = lazy(() => import('./pages/modules/SystemHealth'))
const SubscriptionPlans = lazy(() => import('./pages/modules/SubscriptionPlans'))

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <Routes>
          {/* ROOT IS NOW THE LOGIN PAGE */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          
          {/* HOTEL ADMIN PORTAL (FOR SPECIFIC HOTEL ADMINS/STAFF) */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="contacts" replace />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="pipeline" element={<Pipeline />} />
            <Route path="marketing" element={<Marketing />} />
            <Route path="support" element={<Support />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="quotes" element={<Quotes />} />
            <Route path="documents" element={<Documents />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="automation" element={<Automation />} />
            <Route path="portal" element={<Portal />} />
            <Route path="products" element={<Products />} />
            <Route path="messaging" element={<Messaging />} />
            <Route path="contracts" element={<Contracts />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="referrals" element={<Referrals />} />
          </Route>

          {/* SUPER ADMIN PORTAL (FOR PLATFORM OWNERS) */}
          <Route path="/super-admin" element={<SuperAdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SuperAdmin />} />
            <Route path="companies" element={<Companies />} />
            <Route path="plans" element={<SubscriptionPlans />} />
            <Route path="status" element={<SystemHealth />} />
            <Route path="analytics" element={<SuperAnalytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  )
}

export default App
