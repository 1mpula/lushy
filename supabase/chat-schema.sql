-- Lushy Chat System - Database Schema
-- Run this in Supabase SQL Editor after the main schema

-- ============================================
-- CONVERSATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Participants
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
    
    -- Optional: Link to a booking
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    
    -- Last message preview
    last_message TEXT,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    last_sender_id UUID,
    
    -- Unread counts
    unread_count_client INTEGER DEFAULT 0,
    unread_count_pro INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure unique conversation per client-professional pair
    UNIQUE(client_id, professional_id)
);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Conversation reference
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    
    -- Sender
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Message content (text only)
    content TEXT NOT NULL,
    
    -- Message type for future extensibility
    message_type TEXT CHECK (message_type IN ('text', 'booking_request', 'system')) DEFAULT 'text',
    
    -- Read status
    is_read BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CONVERSATIONS POLICIES
-- ============================================

-- Users can view their own conversations
DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;
CREATE POLICY "Users can view own conversations"
    ON public.conversations FOR SELECT USING (
        client_id = auth.uid() OR
        professional_id IN (
            SELECT id FROM public.professionals WHERE user_id = auth.uid()
        )
    );

-- Users can create conversations they're part of
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
CREATE POLICY "Users can create conversations"
    ON public.conversations FOR INSERT WITH CHECK (
        client_id = auth.uid() OR
        professional_id IN (
            SELECT id FROM public.professionals WHERE user_id = auth.uid()
        )
    );

-- Users can update their own conversations (for read counts)
DROP POLICY IF EXISTS "Users can update own conversations" ON public.conversations;
CREATE POLICY "Users can update own conversations"
    ON public.conversations FOR UPDATE USING (
        client_id = auth.uid() OR
        professional_id IN (
            SELECT id FROM public.professionals WHERE user_id = auth.uid()
        )
    );

-- ============================================
-- MESSAGES POLICIES
-- ============================================

-- Users can view messages in their conversations
DROP POLICY IF EXISTS "Users can view messages in own conversations" ON public.messages;
CREATE POLICY "Users can view messages in own conversations"
    ON public.messages FOR SELECT USING (
        conversation_id IN (
            SELECT id FROM public.conversations WHERE 
                client_id = auth.uid() OR
                professional_id IN (
                    SELECT id FROM public.professionals WHERE user_id = auth.uid()
                )
        )
    );

-- Users can send messages to their conversations
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
CREATE POLICY "Users can send messages"
    ON public.messages FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        conversation_id IN (
            SELECT id FROM public.conversations WHERE 
                client_id = auth.uid() OR
                professional_id IN (
                    SELECT id FROM public.professionals WHERE user_id = auth.uid()
                )
        )
    );

-- Users can update messages (mark as read)
DROP POLICY IF EXISTS "Users can update messages" ON public.messages;
CREATE POLICY "Users can update messages"
    ON public.messages FOR UPDATE USING (
        conversation_id IN (
            SELECT id FROM public.conversations WHERE 
                client_id = auth.uid() OR
                professional_id IN (
                    SELECT id FROM public.professionals WHERE user_id = auth.uid()
                )
        )
    );

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_conversations_client ON public.conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_conversations_professional ON public.conversations(professional_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON public.conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);

-- ============================================
-- FUNCTION: Update conversation on new message
-- ============================================
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
DECLARE
    conv_record RECORD;
BEGIN
    -- Get conversation details
    SELECT * INTO conv_record FROM public.conversations WHERE id = NEW.conversation_id;
    
    -- Update conversation with last message info
    UPDATE public.conversations 
    SET 
        last_message = LEFT(NEW.content, 100),
        last_message_at = NEW.created_at,
        last_sender_id = NEW.sender_id,
        updated_at = NOW(),
        -- Increment unread count for recipient
        unread_count_client = CASE 
            WHEN NEW.sender_id != conv_record.client_id THEN unread_count_client + 1 
            ELSE unread_count_client 
        END,
        unread_count_pro = CASE 
            WHEN NEW.sender_id = conv_record.client_id THEN unread_count_pro + 1 
            ELSE unread_count_pro 
        END
    WHERE id = NEW.conversation_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update conversation when message is sent
DROP TRIGGER IF EXISTS on_new_message ON public.messages;
CREATE TRIGGER on_new_message
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_on_message();

-- ============================================
-- ENABLE REALTIME
-- ============================================
-- Run these in SQL Editor:
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
