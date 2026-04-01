
-- Organizations (multi-tenant)
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Organization members
CREATE TABLE public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'operator' CHECK (role IN ('owner','admin','manager','operator','analyst')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  current_organization_id UUID REFERENCES public.organizations(id),
  status TEXT NOT NULL DEFAULT 'online' CHECK (status IN ('online','offline','away')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contacts (scoped to org)
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  company TEXT,
  avatar_url TEXT,
  tags TEXT[] DEFAULT '{}',
  score INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'lead' CHECK (status IN ('active','inactive','lead','customer')),
  source TEXT DEFAULT 'manual',
  assigned_to UUID REFERENCES auth.users(id),
  notes TEXT,
  custom_fields JSONB DEFAULT '{}',
  last_interaction TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Conversations
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  channel TEXT NOT NULL DEFAULT 'whatsapp' CHECK (channel IN ('whatsapp','webchat','instagram','email','messenger')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','pending','resolved','closed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  assigned_to UUID REFERENCES auth.users(id),
  department TEXT,
  tags TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT false,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text','image','audio','document','internal_note','system')),
  sender_type TEXT NOT NULL CHECK (sender_type IN ('contact','agent','bot','system')),
  sender_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent','delivered','read','failed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  org_id UUID;
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );

  -- Create default org
  INSERT INTO public.organizations (name, slug)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)) || '''s Workspace',
    NEW.id::text
  )
  RETURNING id INTO org_id;

  -- Add as owner
  INSERT INTO public.organization_members (organization_id, user_id, role)
  VALUES (org_id, NEW.id, 'owner');

  -- Set current org
  UPDATE public.profiles SET current_organization_id = org_id WHERE id = NEW.id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper function: get user's current org
CREATE OR REPLACE FUNCTION public.get_current_org_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT current_organization_id FROM public.profiles WHERE id = auth.uid()
$$;

-- RLS: Organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view their orgs" ON public.organizations
  FOR SELECT TO authenticated
  USING (id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()));
CREATE POLICY "Owners can update their org" ON public.organizations
  FOR UPDATE TO authenticated
  USING (id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid() AND role = 'owner'));

-- RLS: Organization members
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view org members" ON public.organization_members
  FOR SELECT TO authenticated
  USING (organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()));
CREATE POLICY "Admins can manage members" ON public.organization_members
  FOR ALL TO authenticated
  USING (organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid() AND role IN ('owner','admin')));

-- RLS: Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Org members can view profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (id IN (
    SELECT om2.user_id FROM public.organization_members om1
    JOIN public.organization_members om2 ON om1.organization_id = om2.organization_id
    WHERE om1.user_id = auth.uid()
  ));

-- RLS: Contacts
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org members can view contacts" ON public.contacts
  FOR SELECT TO authenticated
  USING (organization_id = public.get_current_org_id());
CREATE POLICY "Org members can insert contacts" ON public.contacts
  FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.get_current_org_id());
CREATE POLICY "Org members can update contacts" ON public.contacts
  FOR UPDATE TO authenticated
  USING (organization_id = public.get_current_org_id());
CREATE POLICY "Org members can delete contacts" ON public.contacts
  FOR DELETE TO authenticated
  USING (organization_id = public.get_current_org_id());

-- RLS: Conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org members can view conversations" ON public.conversations
  FOR SELECT TO authenticated
  USING (organization_id = public.get_current_org_id());
CREATE POLICY "Org members can manage conversations" ON public.conversations
  FOR ALL TO authenticated
  USING (organization_id = public.get_current_org_id());

-- RLS: Messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org members can view messages" ON public.messages
  FOR SELECT TO authenticated
  USING (conversation_id IN (
    SELECT id FROM public.conversations WHERE organization_id = public.get_current_org_id()
  ));
CREATE POLICY "Org members can send messages" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (conversation_id IN (
    SELECT id FROM public.conversations WHERE organization_id = public.get_current_org_id()
  ));

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
