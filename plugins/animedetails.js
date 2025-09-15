//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : anime/animedetails
import axios from 'axios'

let handler = async (m, { conn, text }) => {
  if (!text) throw 'Masukkan URL detail anime.\nContoh: .animedetails https://nontonanime.live/one-piece/'

  let { data } = await axios.get(`https://api.platform.web.id/details?url=${encodeURIComponent(text)}`)
  if (!data) throw 'Anime tidak ditemukan atau API error.'

  let caption = `🎬 *${data.title}*
📺 Type: ${data.type}
📡 Status: ${data.status}
🏢 Studio: ${data.studio}
📅 Season: ${data.season}
🎭 Genre: ${data.genres.join(', ')}

📝 *Sinopsis:*
${data.synopsis}

🎤 *Karakter & Seiyuu:*
${data.characters.map(c => `- ${c.charName} (${c.voiceActor})`).join('\n')}
`

  await conn.sendMessage(m.chat, {
    image: { url: data.thumbnail },
    caption
  }, { quoted: m })

  if (data.episodes && data.episodes.length) {
    let episodes = data.episodes.slice(0, 10) // hanya 10 episode terbaru
    for (let ep of episodes) {
      await delay(1500)
      await conn.sendMessage(m.chat, {
        text: `🎬 *${ep.title}*\n📅 Rilis: ${ep.dateOfRelease}\n🔗 [Tonton](${ep.link})`,
        linkPreview: true
      }, { quoted: m })
    }
  } else {
    await conn.reply(m.chat, 'Tidak ada episode yang ditemukan.', m)
  }
}

handler.help = ['animedetails <url>']
handler.tags = ['anime']
handler.command = /^animedetails$/i
handler.limit = true

export default handler

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}