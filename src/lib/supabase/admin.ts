import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseAdminConfigured = Boolean(
  supabaseUrl &&
    serviceRoleKey &&
    !supabaseUrl.includes("your-project") &&
    !serviceRoleKey.includes("placeholder")
);

export function createAdminClient() {
  if (!isSupabaseAdminConfigured) {
    return null;
  }
  return createClient(supabaseUrl!, serviceRoleKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
