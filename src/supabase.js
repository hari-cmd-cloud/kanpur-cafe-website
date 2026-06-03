import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://edprheroujfoddxkluio.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcHJoZXJvdWpmb2RkeGtsdWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0OTkzOTksImV4cCI6MjA5NjA3NTM5OX0.uWNe-Ipd_p5w0f8L1lwKLhFNvSDPfBnjT5_HW8m80_s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
