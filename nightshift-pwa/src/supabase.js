import { createClient } from '@supabase/supabase-js'
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
console.log('Supabase URL:', url ? url.substring(0,30)+'...' : 'ONTBREEKT')
console.log('Supabase KEY:', key ? key.substring(0,20)+'...' : 'ONTBREEKT')
export const supabase = (url && key) ? createClient(url, key) : null

export const db = {
  async upsertPlayer(roomCode, player) {
    if (!supabase) { console.error('Supabase niet beschikbaar'); return }
    const { error } = await supabase.from('ns_players').upsert({
      id: player.id, room_code: roomCode, name: player.name,
      score: player.score || 0, last_seen: new Date().toISOString()
    })
    if (error) console.error('upsertPlayer fout:', error.message)
  },
  async getPlayers(roomCode) {
    if (!supabase) return []
    const cutoff = new Date(Date.now() - 30000).toISOString()
    const { data, error } = await supabase.from('ns_players')
      .select('*').eq('room_code', roomCode).gte('last_seen', cutoff)
    if (error) console.error('getPlayers fout:', error.message)
    return (data || []).map(p => ({ id: p.id, name: p.name, score: p.score }))
  },
  async saveState(roomCode, state) {
    if (!supabase) { console.error('Supabase niet beschikbaar'); return }
    const { error } = await supabase.from('ns_rooms').upsert({
      code: roomCode, state, updated_at: new Date().toISOString()
    })
    if (error) console.error('saveState fout:', error.message)
    else console.log('State opgeslagen voor kamer:', roomCode)
  },
  async getState(roomCode) {
    if (!supabase) return null
    const { data, error } = await supabase.from('ns_rooms')
      .select('state, updated_at').eq('code', roomCode).single()
    if (error && error.code !== 'PGRST116') console.error('getState fout:', error.message)
    return data
  },
  async deleteRoom(roomCode) {
    if (!supabase) return
    await supabase.from('ns_rooms').delete().eq('code', roomCode)
    await supabase.from('ns_players').delete().eq('room_code', roomCode)
  }
}
