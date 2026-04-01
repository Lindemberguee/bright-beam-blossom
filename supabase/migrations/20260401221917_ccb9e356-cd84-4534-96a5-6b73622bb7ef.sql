
-- Create connections table as the central source of truth for all channels
CREATE TABLE public.connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  channel_type TEXT NOT NULL DEFAULT 'whatsapp_qr',
  status TEXT NOT NULL DEFAULT 'disconnected',
  phone TEXT,
  identifier TEXT,
  session_name TEXT,
  account_name TEXT,
  avatar_url TEXT,
  health_score INTEGER NOT NULL DEFAULT 100,
  assigned_flow_id UUID REFERENCES public.flows(id) ON DELETE SET NULL,
  assigned_queue TEXT,
  assigned_team TEXT,
  available_for_warming BOOLEAN NOT NULL DEFAULT false,
  available_for_campaigns BOOLEAN NOT NULL DEFAULT false,
  available_for_attendance BOOLEAN NOT NULL DEFAULT true,
  tags TEXT[] DEFAULT '{}'::text[],
  notes TEXT,
  session_data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  last_sync_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ,
  connected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create connection events/logs table
CREATE TABLE public.connection_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id UUID NOT NULL REFERENCES public.connections(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  details TEXT,
  user_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for connections
CREATE POLICY "Org members can manage connections"
  ON public.connections FOR ALL TO authenticated
  USING (organization_id = get_current_org_id())
  WITH CHECK (organization_id = get_current_org_id());

-- RLS policies for connection events
CREATE POLICY "Org members can manage connection events"
  ON public.connection_events FOR ALL TO authenticated
  USING (connection_id IN (SELECT id FROM public.connections WHERE organization_id = get_current_org_id()))
  WITH CHECK (connection_id IN (SELECT id FROM public.connections WHERE organization_id = get_current_org_id()));

-- Enable realtime for connections
ALTER PUBLICATION supabase_realtime ADD TABLE public.connections;
