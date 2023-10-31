import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xbyetxafudilavdwhfzl.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseClient = createClient(supabaseUrl, supabaseKey as string, {
  auth: { persistSession: false }
});

export default supabaseClient;
