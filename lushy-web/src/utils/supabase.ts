import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ehabinuyyasvahhxkhdw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoYWJpbnV5eWFzdmFoaHhraGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNzU5OTAsImV4cCI6MjA4NDk1MTk5MH0.vr6TOMU1zAPLwp_T79B_NXTkkaIWUc5oFozn0h26Kd4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
