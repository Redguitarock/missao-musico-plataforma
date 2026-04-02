import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const { data, error } = await supabase.from('mentorships').select('*').limit(1);
  console.log("Error:", error);
  if (data && data.length > 0) {
     console.log("Columns:", Object.keys(data[0]));
  } else {
     console.log("No data");
     // Try to insert a dummy to see if permissions exists
     const res2 = await supabase.from('mentorships').update({ permissions: {} }).eq('id', '00000000-0000-0000-0000-000000000000');
     console.log("Update check:", res2.error);
  }
}
check();
