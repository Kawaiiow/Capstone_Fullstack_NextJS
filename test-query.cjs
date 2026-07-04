const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testing query 1: original failing query...');
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        id,
        user_id,
        profiles:user_id ( role )
      `)
      .limit(1);
    console.log('Query 1 Success:', data);
    if (error) console.error('Query 1 Error Details:', error);
  } catch (err) {
    console.error('Query 1 Exception:', err);
  }

  console.log('\nTesting query 2: using profiles!user_id ...');
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        id,
        user_id,
        profiles!user_id ( role )
      `)
      .limit(1);
    console.log('Query 2 Success:', data);
    if (error) console.error('Query 2 Error Details:', error);
  } catch (err) {
    console.error('Query 2 Exception:', err);
  }

  console.log('\nTesting query 3: using profiles (role) ...');
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        id,
        user_id,
        profiles ( role )
      `)
      .limit(1);
    console.log('Query 3 Success:', data);
    if (error) console.error('Query 3 Error Details:', error);
  } catch (err) {
    console.error('Query 3 Exception:', err);
  }
}

test();
