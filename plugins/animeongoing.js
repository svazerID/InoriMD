//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : anime/animeongoing
import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    m.reply('⏳ Sedang mengambil daftar anime ongoing...')
    const { data } = await axios.get('https://api.platform.web.id/anime-ongoing')

    let teks = '*📺 Anime Ongoing Minggu Ini:*\n\n'
    const hariList = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu']

    for (let hari of hariList) {
      if (!data[hari] || data[hari].length === 0) continue
      teks += `*📅 ${hari.charAt(0).toUpperCase() + hari.slice(1)}*\n`
      data[hari].forEach((anime, idx) => {
        teks += `${idx + 1}. [${anime.title}](${anime.link})\n`
      })
      teks += '\n'
    }

    if (data.random && data.random.length) {
      teks += '*🎲 Random Rekomendasi:*\n'
      data.random.forEach((anime, idx) => {
        teks += `${idx + 1}. [${anime.title}](${anime.link})\n`
      })
    }

    await conn.sendMessage(m.chat, { text: teks, linkPreview: false }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('❌ Gagal mengambil data anime ongoing.')
  }
}


handler.help = ['animeongoing']
handler.tags = ['anime']
handler.command = /^animeongoing$/i
handler.limit = true

export default handler