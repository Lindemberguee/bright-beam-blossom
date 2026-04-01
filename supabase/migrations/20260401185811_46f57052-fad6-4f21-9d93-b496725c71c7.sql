-- Pipelines table
CREATE TABLE public.pipelines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pipelines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can manage pipelines" ON public.pipelines
  FOR ALL TO authenticated
  USING (organization_id = get_current_org_id())
  WITH CHECK (organization_id = get_current_org_id());

-- Pipeline columns table
CREATE TABLE public.pipeline_columns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pipeline_id UUID NOT NULL REFERENCES public.pipelines(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pipeline_columns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can manage pipeline columns" ON public.pipeline_columns
  FOR ALL TO authenticated
  USING (pipeline_id IN (SELECT id FROM public.pipelines WHERE organization_id = get_current_org_id()))
  WITH CHECK (pipeline_id IN (SELECT id FROM public.pipelines WHERE organization_id = get_current_org_id()));

-- Pipeline cards table
CREATE TABLE public.pipeline_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  column_id UUID NOT NULL REFERENCES public.pipeline_columns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  value NUMERIC DEFAULT 0,
  priority TEXT NOT NULL DEFAULT 'medium',
  assigned_to UUID,
  tags TEXT[] DEFAULT '{}',
  due_date DATE,
  position INTEGER NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pipeline_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can manage pipeline cards" ON public.pipeline_cards
  FOR ALL TO authenticated
  USING (column_id IN (
    SELECT pc.id FROM public.pipeline_columns pc
    JOIN public.pipelines p ON p.id = pc.pipeline_id
    WHERE p.organization_id = get_current_org_id()
  ))
  WITH CHECK (column_id IN (
    SELECT pc.id FROM public.pipeline_columns pc
    JOIN public.pipelines p ON p.id = pc.pipeline_id
    WHERE p.organization_id = get_current_org_id()
  ));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.pipeline_cards;