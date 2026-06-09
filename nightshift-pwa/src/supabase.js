import { createClient } from '@supabase/supabase-js'
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
if (!url || !key) console.warn('⚠️ Supabase env vars ontbreken - zie .env.example')
export const supabase = (url && key) ? createClient(url, key) : null
export const getChannel = (roomCode) => supabase?.channel(`nightshift-${roomCode}`, {
  config: { broadcast: { self: false } }
})
