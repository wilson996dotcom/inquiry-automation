const { createClient } = require('@supabase/supabase-js');

// Service key bypasses row-level security, so this file must only
// ever run on the server, never in a browser or client bundle.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function insertInquiry({ name, phone, email, message }) {
  const { data, error } = await supabase
    .from('inquiries')
    .insert({ name, phone, email, message, status: 'new' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function updateCategorization(id, { category, summary }) {
  const { error } = await supabase
    .from('inquiries')
    .update({ category, ai_summary: summary, status: 'categorized' })
    .eq('id', id);

  if (error) throw error;
}

module.exports = { supabase, insertInquiry, updateCategorization };

/*
Run this once in the Supabase SQL editor to create the table:

create table inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  message text not null,
  category text,
  ai_summary text,
  status text default 'new',
  created_at timestamptz default now()
);
*/
