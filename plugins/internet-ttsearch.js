//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : searching/ttsearch
import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh penggunaan:\n${usedPrefix + command} preset mlbb`

  let { data } = await axios.get(`https://api.platform.web.id/tiktok-search?query=${encodeURIComponent(text)}`)
  if (!data?.video_url) throw 'Video tidak ditemukan atau terjadi error.'

  await conn.sendMessage(m.chat, {
    video: { url: data.video_url },
    caption: `🎬 *Title:* ${data.title}`
  }, { quoted: m })
}

handler.help = ['ttsearch <query>']
handler.tags = ['internet']
handler.command = /^ttsearch$/i
handler.limit = true

export default handler