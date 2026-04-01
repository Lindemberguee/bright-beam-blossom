
-- WhatsApp numbers for warming management
CREATE TABLE public.whatsapp_numbers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  session_name TEXT NOT NULL,
  connection_status TEXT NOT NULL DEFAULT 'disconnected',
  stage TEXT NOT NULL DEFAULT 'new',
  health_score INTEGER NOT NULL DEFAULT 100,
  daily_limit INTEGER NOT NULL DEFAULT 50,
  hourly_limit INTEGER NOT NULL DEFAULT 10,
  current_daily_sent INTEGER NOT NULL DEFAULT 0,
  current_daily_received INTEGER NOT NULL DEFAULT 0,
  current_daily_responded INTEGER NOT NULL DEFAULT 0,
  total_sent INTEGER NOT NULL DEFAULT 0,
  total_received INTEGER NOT NULL DEFAULT 0,
  total_responded INTEGER NOT NULL DEFAULT 0,
  response_rate NUMERIC NOT NULL DEFAULT 0,
  avg_response_time_seconds INTEGER,
  active_plan_id UUID,
  current_phase INTEGER NOT NULL DEFAULT 0,
  send_window_start TIME DEFAULT '08:00',
  send_window_end TIME DEFAULT '20:00',
  message_interval_seconds INTEGER NOT NULL DEFAULT 30,
  auto_pause_enabled BOOLEAN NOT NULL DEFAULT true,
  is_paused BOOLEAN NOT NULL DEFAULT false,
  pause_reason TEXT,
  connected_at TIMESTAMP WITH TIME ZONE,
  last_activity_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.whatsapp_numbers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can manage whatsapp numbers" ON public.whatsapp_numbers
  FOR ALL TO authenticated
  USING (organization_id = get_current_org_id())
  WITH CHECK (organization_id = get_current_org_id());

-- Warming plans (templates)
CREATE TABLE public.warming_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  total_duration_days INTEGER NOT NULL DEFAULT 30,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.warming_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can manage warming plans" ON public.warming_plans
  FOR ALL TO authenticated
  USING (organization_id = get_current_org_id())
  WITH CHECK (organization_id = get_current_org_id());

-- Warming phases (linked to plans)
CREATE TABLE public.warming_phases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES public.warming_plans(id) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL DEFAULT 1,
  name TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL DEFAULT 7,
  daily_limit INTEGER NOT NULL DEFAULT 50,
  hourly_limit INTEGER NOT NULL DEFAULT 10,
  message_interval_seconds INTEGER NOT NULL DEFAULT 60,
  target_stage TEXT NOT NULL DEFAULT 'warming',
  priority_contacts_only BOOLEAN NOT NULL DEFAULT false,
  min_response_rate NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(plan_id, phase_number)
);

ALTER TABLE public.warming_phases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can manage warming phases" ON public.warming_phases
  FOR ALL TO authenticated
  USING (plan_id IN (SELECT id FROM public.warming_plans WHERE organization_id = get_current_org_id()))
  WITH CHECK (plan_id IN (SELECT id FROM public.warming_plans WHERE organization_id = get_current_org_id()));

-- Number events (audit trail)
CREATE TABLE public.number_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number_id UUID NOT NULL REFERENCES public.whatsapp_numbers(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  details TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.number_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can manage number events" ON public.number_events
  FOR ALL TO authenticated
  USING (number_id IN (SELECT id FROM public.whatsapp_numbers WHERE organization_id = get_current_org_id()))
  WITH CHECK (number_id IN (SELECT id FROM public.whatsapp_numbers WHERE organization_id = get_current_org_id()));

-- Add FK for active_plan_id
ALTER TABLE public.whatsapp_numbers
  ADD CONSTRAINT whatsapp_numbers_active_plan_id_fkey
  FOREIGN KEY (active_plan_id) REFERENCES public.warming_plans(id) ON DELETE SET NULL;
