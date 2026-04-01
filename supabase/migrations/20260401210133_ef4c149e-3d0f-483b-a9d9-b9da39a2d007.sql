
-- Campaigns table
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  type TEXT NOT NULL DEFAULT 'mass',
  message_template TEXT,
  message_variables JSONB DEFAULT '[]'::jsonb,
  media_url TEXT,
  media_type TEXT,
  target_count INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  read_count INTEGER DEFAULT 0,
  response_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  filters JSONB DEFAULT '{}'::jsonb,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can manage campaigns" ON public.campaigns
  FOR ALL TO authenticated
  USING (organization_id = get_current_org_id())
  WITH CHECK (organization_id = get_current_org_id());

-- Campaign contacts (recipients)
CREATE TABLE public.campaign_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  responded_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, contact_id)
);

ALTER TABLE public.campaign_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can manage campaign contacts" ON public.campaign_contacts
  FOR ALL TO authenticated
  USING (campaign_id IN (SELECT id FROM public.campaigns WHERE organization_id = get_current_org_id()))
  WITH CHECK (campaign_id IN (SELECT id FROM public.campaigns WHERE organization_id = get_current_org_id()));

-- Contact lists (dynamic lists)
CREATE TABLE public.contact_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  filters JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_dynamic BOOLEAN NOT NULL DEFAULT true,
  contact_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can manage contact lists" ON public.contact_lists
  FOR ALL TO authenticated
  USING (organization_id = get_current_org_id())
  WITH CHECK (organization_id = get_current_org_id());

-- Static list members
CREATE TABLE public.contact_list_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id UUID NOT NULL REFERENCES public.contact_lists(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(list_id, contact_id)
);

ALTER TABLE public.contact_list_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can manage list members" ON public.contact_list_members
  FOR ALL TO authenticated
  USING (list_id IN (SELECT id FROM public.contact_lists WHERE organization_id = get_current_org_id()))
  WITH CHECK (list_id IN (SELECT id FROM public.contact_lists WHERE organization_id = get_current_org_id()));
