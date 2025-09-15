//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : searching/soundcloud
import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh:\n${usedPrefix + command} replay`

  let { data } = await axios.get(`https://api.platform.web.id/soundcloud?q=${encodeURIComponent(text)}&limit=5`)
  if (!data.length) throw 'Tidak ditemukan hasil SoundCloud.'

  let caption = '*🎧 Hasil SoundCloud:*\n\n'
  for (let song of data) {
    caption += `*🎵 Judul:* ${song.title}
👤 *Artis:* [${song.author.name}](${song.author.url})
🕒 *Durasi:* ${song.duration}
👍 *Likes:* ${song.like_count}
▶️ *Plays:* ${song.play_count}
📅 *Rilis:* ${song.release_date}
🔗 *Link:* ${song.url}

`
  }

  await conn.reply(m.chat, caption.trim(), m)
}

handler.help = ['soundclouds <query>']
handler.tags = ['internet']
handler.command = /^soundclouds$/i
handler.limit = true

export default handler