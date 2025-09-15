//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : anime/animeupcoming
import axios from 'axios'

let handler = async (m, { conn }) => {
  let { data } = await axios.get('https://api.platform.web.id/upcoming')
  if (!Array.isArray(data) || data.length === 0) throw 'Anime upcoming tidak ditemukan.'

  let caption = `🗓️ *Anime Upcoming*`

  caption += '\n\n' + data.slice(0, 10).map((anime, i) => 
    `*${i + 1}. ${anime.title}*
📺 Type: ${anime.type}
🕒 Status: ${anime.episode}
🔗 [Link](${anime.url})`
  ).join('\n\n')

  await conn.sendMessage(m.chat, {
    image: { url: data[0].thumbnail },
    caption
  }, { quoted: m })

  // Kirim beberapa poster lagi setelah delay
  for (let i = 1; i < data.length && i < 5; i++) {
    await delay(1500)
    await conn.sendMessage(m.chat, {
      image: { url: data[i].thumbnail },
      caption: `✨ *${data[i].title}*\n📺 *${data[i].type}* - *${data[i].episode}*\n🔗 [Tonton](${data[i].url})`
    }, { quoted: m })
  }
}

handler.help = ['animeupcoming']
handler.tags = ['anime']
handler.command = /^animeupcoming$/i
handler.limit = true

export default handler

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}