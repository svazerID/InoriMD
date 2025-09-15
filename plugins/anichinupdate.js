//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : anime/anichinupdate
import axios from 'axios'

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  try {
    let { data } = await axios.get(`https://api.platform.web.id/anichin/update`)

    if (!data.status || !data.result.length) 
      return m.reply('Tidak ada update terbaru.')

    let caption = `📢 *Anime Terbaru (Update)*\n\n`
    for (let anime of data.result.slice(0, 10)) { // ambil 10 dulu biar ga panjang
      caption += `🎬 *${anime.title}*\n`
      caption += `📺 Tipe: ${anime.type}\n`
      caption += `📈 Status: ${anime.status}\n`
      caption += `🔗 ${anime.url}\n\n`
    }
    caption += `Gunakan *${usedPrefix}${command} more* untuk lihat lebih banyak.`

    await conn.sendMessage(m.chat, { text: caption }, { quoted: m })

  } catch (e) {
    console.log(e)
    m.reply('❌ Terjadi kesalahan saat mengambil data update.')
  }
}

handler.command = /^(aniup|anichinupdate)$/i
handler.help = ['anichinupdate']
handler.tags = ['anime']
handler.limit = true

export default handler