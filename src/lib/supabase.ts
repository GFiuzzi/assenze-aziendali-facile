
import { createClient } from '@supabase/supabase-js';

// Usa il dominio attuale per le richieste API
const getSupabaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'calendario.idrolab.local') {
      return `http://calendario.idrolab.local:8000`;
    }
  }
  return import.meta.env.VITE_SUPABASE_URL || 'http://localhost:8000';
};

const supabaseUrl = getSupabaseUrl();
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

export const supabase = createClient(supabaseUrl, supabaseKey);
