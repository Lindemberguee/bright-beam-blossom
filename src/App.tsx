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
