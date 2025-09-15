//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : searching/ytstalk
import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh penggunaan:\n${usedPrefix + command} mrbeast`

  let { data } = await axios.get(`https://api.platform.web.id/ytstalk?username=${encodeURIComponent(text)}`)
  if (!data?.name) throw 'Channel tidak ditemukan.'

  let caption = `🎬 *YouTube Stalk*

👤 *Name:* ${data.name}
🔖 *Username:* ${data.username}
🆔 *Channel ID:* ${data.channelId}
👥 *Subscribers:* ${data.subscribers}
🌐 *URL:* ${data.url}

📝 *Description:*
${data.description.slice(0, 300)}${data.description.length > 300 ? '...' : ''}

🎥 *Last Videos:*
${data.videos.slice(0, 5).map((v, i) => `${i+1}. ${v}`).join('\n')}`

  await conn.sendMessage(m.chat, {
    image: { url: data.image },
    caption
  }, { quoted: m })

  // Kirim banner setelah delay biar ga ketumpuk
  await delay(2000)
  await conn.sendMessage(m.chat, {
    image: { url: data.banner },
    caption: `🎯 *Banner of ${data.name}*`
  }, { quoted: m })
}

handler.help = ['ytstalk']
handler.tags = ['stalk']
handler.command = /^(ytstalk|youtubestalk)$/i

handler.register = true
handler.limit = true

export default handler

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}