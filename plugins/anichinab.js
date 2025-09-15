//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : anime/anichinab
import axios from 'axios'

let handler = async (m, { text, conn, command, args }) => {
  let letter = args[0]?.toUpperCase() || 'B'
  let api = `https://api.platform.web.id/anichin/azlist?letter=${letter}`

  try {
    let { data } = await axios.get(api)
    if (!data.status || !data.result.length) return m.reply(`Tidak ditemukan anime dengan huruf ${letter}.`)

    let caption = `📚 *Daftar Anime A-Z: ${letter}*\n\n`
    for (let anime of data.result) {
      caption += `🎬 *${anime.title}*\n`
      caption += `📺 Tipe: ${anime.type}\n`
      caption += `📈 Status: ${anime.status}\n`
      caption += `🔗 [Lihat Anime](${anime.url})\n\n`
    }

    await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
  } catch (e) {
    console.log(e)
    m.reply('❌ Gagal mengambil data.')
  }
}

handler.command = /^(anichinab)$/i
handler.help = ['anichinab <huruf>']
handler.tags = ['anime']
handler.limit = true

export default handler