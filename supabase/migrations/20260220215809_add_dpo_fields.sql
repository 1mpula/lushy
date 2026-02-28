-- Add subscription fields to professionals table
ALTER TABLE public.professionals
ADD COLUMN IF NOT EXISTS subscription_status TEXT CHECK (subscription_status IN ('active', 'trial', 'past_due', 'suspended')) DEFAULT 'trial',
ADD COLUMN IF NOT EXISTS subscription_due_date TIMESTAMPTZ DEFAULT (NOW() + interval '30 days');

-- Update Services policies to exclude suspended professionals
DROP POLICY IF EXISTS "Active services are viewable by everyone" ON public.services;
CREATE POLICY "Active services are viewable by everyone"
    ON public.services FOR SELECT USING (
        is_active = true AND 
        professional_id IN (
            SELECT id FROM public.professionals WHERE subscription_status != 'suspended'
        )
    );
