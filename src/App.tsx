import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Chats from "./pages/Chats";
import Kanban from "./pages/Kanban";
import Contacts from "./pages/Contacts";
import Flows from "./pages/Flows";
import FlowEditor from "./pages/FlowEditor";
import Campaigns from "./pages/Campaigns";
import Warming from "./pages/Warming";
import Connections from "./pages/Connections";
import Webhooks from "./pages/Webhooks";
import Team from "./pages/Team";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Billing from "./pages/Billing";
import Audit from "./pages/Audit";
import NotFound from "./pages/NotFound";
// Settings sub-pages
import SettingsTags from "./pages/settings/SettingsTags";
import SettingsQuickReplies from "./pages/settings/SettingsQuickReplies";
import SettingsDepartments from "./pages/settings/SettingsDepartments";
import SettingsBusinessHours from "./pages/settings/SettingsBusinessHours";
import SettingsQueues from "./pages/settings/SettingsQueues";
import SettingsVariables from "./pages/settings/SettingsVariables";
import SettingsBranding from "./pages/settings/SettingsBranding";
import SettingsLocale from "./pages/settings/SettingsLocale";
import SettingsPermissions from "./pages/settings/SettingsPermissions";
import SettingsGeneral from "./pages/settings/SettingsGeneral";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chats" element={<Chats />} />
              <Route path="/kanban" element={<Kanban />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/flows" element={<Flows />} />
              <Route path="/flows/editor/:id" element={<FlowEditor />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/warming" element={<Warming />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/webhooks" element={<Webhooks />} />
              <Route path="/team" element={<Team />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/tags" element={<SettingsTags />} />
              <Route path="/settings/quick-replies" element={<SettingsQuickReplies />} />
              <Route path="/settings/departments" element={<SettingsDepartments />} />
              <Route path="/settings/business-hours" element={<SettingsBusinessHours />} />
              <Route path="/settings/queues" element={<SettingsQueues />} />
              <Route path="/settings/variables" element={<SettingsVariables />} />
              <Route path="/settings/branding" element={<SettingsBranding />} />
              <Route path="/settings/locale" element={<SettingsLocale />} />
              <Route path="/settings/permissions" element={<SettingsPermissions />} />
              <Route path="/settings/general" element={<SettingsGeneral />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/audit" element={<Audit />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
