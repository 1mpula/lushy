-- Lushy Booking Automation - Database Triggers
-- Run this in Supabase SQL Editor after deploying Edge Functions

-- ============================================
-- ENABLE pg_net EXTENSION (for HTTP calls from triggers)
-- ============================================
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- ============================================
-- ENABLE pg_cron EXTENSION (for scheduled reminders)
-- ============================================
-- Note: pg_cron must be enabled in Supabase Dashboard first
-- Go to: Database > Extensions > Search "pg_cron" > Enable
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- ============================================
-- FUNCTION: Notify on New Booking
-- ============================================
CREATE OR REPLACE FUNCTION notify_new_booking()
RETURNS TRIGGER AS $$
DECLARE
  project_url TEXT := 'https://ehabinuyyasvahhxkhdw.supabase.co';
  service_role_key TEXT := current_setting('app.settings.service_role_key', true);
BEGIN
  -- Call the Edge Function via HTTP
  PERFORM net.http_post(
    url := project_url || '/functions/v1/notify-new-booking',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    ),
    body := jsonb_build_object(
      'record', row_to_json(NEW)
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGER: On Booking Insert
-- ============================================
DROP TRIGGER IF EXISTS on_new_booking ON public.bookings;
CREATE TRIGGER on_new_booking
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_booking();

-- ============================================
-- CRON JOB: Hourly Reminders
-- ============================================
-- Schedule the send-reminders function to run every hour
-- Note: Replace YOUR_ANON_KEY with your actual anon key

SELECT cron.schedule(
  'lushy-send-reminders',  -- Job name
  '0 * * * *',             -- Every hour on the hour
  $$
  SELECT net.http_post(
    url := 'https://ehabinuyyasvahhxkhdw.supabase.co/functions/v1/send-reminders',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoYWJpbnV5eWFzdmFoaHhraGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNzU5OTAsImV4cCI6MjA4NDk1MTk5MH0.vr6TOMU1zAPLwp_T79B_NXTkkaIWUc5oFozn0h26Kd4"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);

-- ============================================
-- VIEW SCHEDULED JOBS
-- ============================================
-- SELECT * FROM cron.job;

-- ============================================
-- TO REMOVE THE CRON JOB (if needed)
-- ============================================
-- SELECT cron.unschedule('lushy-send-reminders');
