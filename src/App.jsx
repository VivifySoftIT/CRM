import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DashboardLayout from './components/DashboardLayout'

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

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
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
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
