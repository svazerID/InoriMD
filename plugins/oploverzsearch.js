//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : anime/oploverzsearch
import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🔍 Contoh penggunaan:\n${usedPrefix + command} one piece`)

  try {
    let { data } = await axios.get(`https://api.platform.web.id/oploverz-search?search=${encodeURIComponent(text)}`)
    if (!Array.isArray(data) || data.length === 0) return m.reply('❌ Tidak ditemukan hasil.')

    let list = data.map((anime, idx) => {
      return `*${idx+1}. ${anime.title}*\n🗓️ ${anime.date}\n🔗 ${anime.link}`
    }).join('\n\n')

    await conn.sendMessage(m.chat, {
      text: `🎥 *Hasil pencarian Oploverz untuk:* ${text}\n\n${list}`,
      contextInfo: {
        externalAdReply: {
          title: `Oploverz Search: ${text}`,
          body: `${data.length} hasil ditemukan`,
          thumbnailUrl: data[0].thumbnail,
          sourceUrl: data[0].link,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('❌ Terjadi kesalahan saat mengambil data.')
  }
}

export default handler

handler.help = ['oploverzsearch <query>']
handler.tags = ['anime']
handler.command = /^oploverzsearch$/i