
-- Flows table
CREATE TABLE public.flows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  folder TEXT,
  trigger_type TEXT DEFAULT 'manual',
  settings JSONB DEFAULT '{}'::jsonb,
  execution_count INTEGER DEFAULT 0,
  success_rate NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.flows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can manage flows" ON public.flows
  FOR ALL TO authenticated
  USING (organization_id = get_current_org_id())
  WITH CHECK (organization_id = get_current_org_id());

-- Flow nodes table
CREATE TABLE public.flow_nodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flow_id UUID NOT NULL REFERENCES public.flows(id) ON DELETE CASCADE,
  node_id TEXT NOT NULL,
  type TEXT NOT NULL,
  position_x NUMERIC NOT NULL DEFAULT 0,
  position_y NUMERIC NOT NULL DEFAULT 0,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.flow_nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can manage flow nodes" ON public.flow_nodes
  FOR ALL TO authenticated
  USING (flow_id IN (SELECT id FROM public.flows WHERE organization_id = get_current_org_id()))
  WITH CHECK (flow_id IN (SELECT id FROM public.flows WHERE organization_id = get_current_org_id()));

-- Flow edges table
CREATE TABLE public.flow_edges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flow_id UUID NOT NULL REFERENCES public.flows(id) ON DELETE CASCADE,
  edge_id TEXT NOT NULL,
  source_node TEXT NOT NULL,
  target_node TEXT NOT NULL,
  source_handle TEXT,
  label TEXT,
  animated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.flow_edges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can manage flow edges" ON public.flow_edges
  FOR ALL TO authenticated
  USING (flow_id IN (SELECT id FROM public.flows WHERE organization_id = get_current_org_id()))
  WITH CHECK (flow_id IN (SELECT id FROM public.flows WHERE organization_id = get_current_org_id()));
