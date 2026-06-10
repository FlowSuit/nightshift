import { createClient } from '@supabase/supabase-js'
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
if (!url || !key) console.warn('Supabase env vars ontbreken')
export const supabase = (url && key) ? createClient(url, key) : null

// Database-based multiplayer - geen Realtime nodig
export const db = {
  // Speler registreren/updaten
  async upsertPlayer(roomCode, player) {
    if (!supabase) return
    await supabase.from('ns_players').upsert({
      id: player.id, room_code: roomCode, name: player.name,
      score: player.score || 0, last_seen: new Date().toISOString()
    })
  },
  // Alle spelers in kamer ophalen (actief in laatste 30 sec)
  async getPlayers(roomCode) {
    if (!supabase) return []
    const cutoff = new Date(Date.now() - 30000).toISOString()
    const { data } = await supabase.from('ns_players')
      .select('*').eq('room_code', roomCode).gte('last_seen', cutoff)
    return (data || []).map(p => ({ id: p.id, name: p.name, score: p.score }))
  },
  // Game state opslaan (host)
  async saveState(roomCode, state) {
    if (!supabase) return
    await supabase.from('ns_rooms').upsert({
      code: roomCode, state, updated_at: new Date().toISOString()
    })
  },
  // Game state ophalen (clients)
  async getState(roomCode) {
    if (!supabase) return null
    const { data } = await supabase.from('ns_rooms')
      .select('state, updated_at').eq('code', roomCode).single()
    return data
  },
  // Kamer verwijderen
  async deleteRoom(roomCode) {
    if (!supabase) return
    await supabase.from('ns_rooms').delete().eq('code', roomCode)
    await supabase.from('ns_players').delete().eq('room_code', roomCode)
  }
}
