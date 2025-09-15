//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : anime/animedl
import axios from 'axios'

let handler = async (m, { conn, text }) => {
  if (!text) throw 'Masukkan URL episode.\nContoh: .animepisode https://nontonanime.live/one-piece-episode-1133-subtitle-indonesia/'

  let { data } = await axios.get(`https://api.platform.web.id/download?urlEpisodes=${encodeURIComponent(text)}`)
  if (!data || data.length === 0) throw 'Tidak ditemukan link download.'

  let caption = `🎬 *Link Download Episode:*\n\n` +
    data.map(d => `✅ *${d.server}*\n🔗 ${d.link}`).join('\n\n')

  await conn.reply(m.chat, caption, m)
}

handler.help = ['animedl <urlEpisode>']
handler.tags = ['anime']
handler.command = /^animedl$/i
handler.limit = true

export default handler