//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : info/mlnews
import axios from 'axios'
import moment from 'moment-timezone'

let handler = async (m, { conn }) => {
  try {
    let { data } = await axios.get(`https://api.platform.web.id/newsml`)

    if (!data.status || !Array.isArray(data.result) || data.result.length === 0)
      return m.reply('Tidak ada berita Mobile Legends terbaru.')

    let berita = data.result[Math.floor(Math.random() * data.result.length)]
    let tanggal = moment(berita.date).tz('Asia/Jakarta').format('DD MMMM YYYY')

    let teks = `📰 *${berita.title || 'No Title'}*\n`
    teks += `✍️ ${berita.author}\n`
    teks += `📅 ${tanggal}\n\n`
    teks += `${berita.caption ? berita.caption.slice(0, 300) + '...' : ''}\n`
    teks += `🔗 ${berita.link}`

    await conn.sendMessage(m.chat, {
      image: { url: berita.thumbnail || berita.avatar },
      caption: teks
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    m.reply('❌ Gagal mengambil data berita Mobile Legends.')
  }
}

handler.command = /^(mlnews|newsml)$/i
handler.help = ['mlnews']
handler.tags = ['internet']
handler.limit = true

export default handler