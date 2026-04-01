import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// ── Layouts ──────────────────────────────────────────────────────────────────
import DashboardLayout from './components/DashboardLayout';
import ClientLayout    from './components/ClientLayout';
import SuperAdminLayout from './components/SuperAdminLayout';
import StaffLayout     from './components/StaffLayout';
// ── Staff Portal Pages ────────────────────────────────────────────────────────
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffTickets   from './pages/staff/StaffTickets';
import StaffTasks     from './pages/staff/StaffTasks';
import StaffMessages  from './pages/staff/StaffMessages';
import StaffDocuments from './pages/staff/StaffDocuments';
import StaffClients   from './pages/staff/StaffClients';

// ── Public Pages ─────────────────────────────────────────────────────────────
import LandingPage  from './pages/LandingPage';
import Login        from './pages/Login';
import Signup       from './pages/Signup';
import ProfilePage  from './pages/ProfilePage';

// ── CRM Dashboard Pages ───────────────────────────────────────────────────────
import Dashboard    from './pages/Dashboard';
import Leads        from './pages/modules/Leads';
import LeadDetails  from './pages/modules/LeadDetails';
import Contacts     from './pages/modules/Contacts';
import ContactDetails from './pages/modules/ContactDetails';
import Accounts     from './pages/modules/Accounts';
import AccountDetails from './pages/modules/AccountDetails';
import Deals        from './pages/modules/Deals';
import DealDetails  from './pages/modules/DealDetails';
import Tasks        from './pages/modules/Tasks';
import Meetings     from './pages/modules/Meetings';
import Calls        from './pages/modules/Calls';
import Messaging    from './pages/modules/Messaging';
import Quotes       from './pages/modules/Quotes';
import Invoices     from './pages/modules/Invoices';
import Cases        from './pages/modules/Cases';
import CaseDetails  from './pages/modules/CaseDetails';
import Solutions    from './pages/modules/Solutions';
import SolutionDetail from './pages/modules/SolutionDetail';
import SalesInbox   from './pages/modules/SalesInbox';
import Social       from './pages/modules/Social';
import Visits       from './pages/modules/Visits';
import Campaigns    from './pages/modules/Campaigns';
import CampaignDetail from './pages/modules/CampaignDetail';
import Reports      from './pages/modules/Reports';
import Feedback     from './pages/modules/Feedback';
import Analytics    from './pages/modules/Analytics';
import Automation   from './pages/modules/Automation';
import Pipeline     from './pages/modules/Pipeline';
import Staff        from './pages/modules/Staff';
import Roles        from './pages/modules/Roles';
import Portal       from './pages/modules/Portal';
import Referrals    from './pages/modules/Referrals';
import Documents    from './pages/modules/Documents';
import Revenue      from './pages/modules/Revenue';
import Contracts    from './pages/modules/Contracts';
import Subscriptions from './pages/modules/Subscriptions';
import SubscriptionPlans from './pages/modules/SubscriptionPlans';
import Companies    from './pages/modules/Companies';
import Marketing    from './pages/modules/Marketing';
import SitesAndForms from './pages/modules/SitesAndForms';
import Support      from './pages/modules/Support';
import Settings     from './pages/modules/Settings';
import Forecasting  from './pages/modules/Forecasting';
import Goals        from './pages/modules/Goals';
import SuperAdmin   from './pages/modules/SuperAdmin';

// ── Client Portal Pages ───────────────────────────────────────────────────────
import ClientDashboard  from './pages/client/ClientDashboard';
import ClientTickets    from './pages/client/ClientTickets';
import ClientBilling    from './pages/client/ClientBilling';
import ClientDocuments  from './pages/client/ClientDocuments';
import ClientMessages   from './pages/client/ClientMessages';
import ClientProfile    from './pages/client/ClientProfile';
import ClientOnboarding from './pages/client/ClientOnboarding';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>

          {/* ── Public ── */}
          <Route path="/"            element={<Navigate to="/profile" replace />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/signup"      element={<Signup />} />
          <Route path="/profile"     element={<ProfilePage />} />
          <Route path="/onboarding"  element={<ClientOnboarding />} />

          {/* ── CRM Dashboard ── */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="leads"              element={<Leads />} />
            <Route path="leads/:id"          element={<LeadDetails />} />
            <Route path="contacts"           element={<Contacts />} />
            <Route path="contacts/:id"       element={<ContactDetails />} />
            <Route path="accounts"           element={<Accounts />} />
            <Route path="accounts/:id"       element={<AccountDetails />} />
            <Route path="deals"              element={<Deals />} />
            <Route path="deals/:id"          element={<DealDetails />} />
            <Route path="tasks"              element={<Tasks />} />
            <Route path="meetings"           element={<Meetings />} />
            <Route path="calls"              element={<Calls />} />
            <Route path="messaging"          element={<Messaging />} />
            <Route path="quotes"             element={<Quotes />} />
            <Route path="invoices"           element={<Invoices />} />
            <Route path="cases"              element={<Cases />} />
            <Route path="cases/:id"          element={<CaseDetails />} />
            <Route path="solutions"          element={<Solutions />} />
            <Route path="solutions/:id"      element={<SolutionDetail />} />
            <Route path="sales-inbox"        element={<SalesInbox />} />
            <Route path="social"             element={<Social />} />
            <Route path="visits"             element={<Visits />} />
            <Route path="campaigns"          element={<Campaigns />} />
            <Route path="campaigns/:id"      element={<CampaignDetail />} />
            <Route path="reports"            element={<Reports />} />
            <Route path="feedback"           element={<Feedback />} />
            <Route path="analytics"          element={<Analytics />} />
            <Route path="automation"         element={<Automation />} />
            <Route path="pipeline"           element={<Pipeline />} />
            <Route path="staff"              element={<Staff />} />
            <Route path="roles"              element={<Roles />} />
            <Route path="portal"             element={<Portal />} />
            <Route path="referrals"          element={<Referrals />} />
            <Route path="documents"          element={<Documents />} />
            <Route path="revenue"            element={<Revenue />} />
            <Route path="contracts"          element={<Contracts />} />
            <Route path="subscriptions"      element={<Subscriptions />} />
            <Route path="subscription-plans" element={<SubscriptionPlans />} />
            <Route path="companies"          element={<Companies />} />
            <Route path="marketing"          element={<Marketing />} />
            <Route path="sites-forms"        element={<SitesAndForms />} />
            <Route path="support"            element={<Support />} />
            <Route path="settings"           element={<Settings />} />
            <Route path="forecasting"        element={<Forecasting />} />
            <Route path="goals"              element={<Goals />} />
          </Route>

          {/* ── Super Admin ── */}
          <Route path="/super-admin" element={<SuperAdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SuperAdmin />} />
            <Route path="companies" element={<SuperAdmin />} />
            <Route path="plans"     element={<SuperAdmin />} />
            <Route path="analytics" element={<SuperAdmin />} />
            <Route path="settings"  element={<SuperAdmin />} />
          </Route>


          {/* ── Staff Portal ── */}
          <Route path="/staff" element={<StaffLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="leads"        element={<Leads />} />
            <Route path="leads/:id"    element={<LeadDetails />} />
            <Route path="contacts"     element={<Contacts />} />
            <Route path="contacts/:id" element={<ContactDetails />} />
            <Route path="accounts"     element={<Accounts />} />
            <Route path="accounts/:id" element={<AccountDetails />} />
            <Route path="deals"        element={<Deals />} />
            <Route path="deals/:id"    element={<DealDetails />} />
            <Route path="tasks"        element={<StaffTasks />} />
            <Route path="meetings"     element={<Meetings />} />
            <Route path="calls"        element={<Calls />} />
            <Route path="cases"        element={<StaffTickets />} />
            <Route path="cases/:id"    element={<CaseDetails />} />
            <Route path="documents"    element={<StaffDocuments />} />
            <Route path="messaging"    element={<StaffMessages />} />
            <Route path="clients"      element={<StaffClients />} />
          </Route>

          {/* ── Client Portal ── */}
          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<Navigate to="/client/dashboard" replace />} />
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="requests"  element={<Navigate to="/client/tickets" replace />} />
            <Route path="tickets"   element={<ClientTickets />} />
            <Route path="billing"   element={<ClientBilling />} />
            <Route path="documents" element={<ClientDocuments />} />
            <Route path="messages"  element={<ClientMessages />} />
            <Route path="profile"   element={<ClientProfile />} />
          </Route>

          {/* ── Catch-all ── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
