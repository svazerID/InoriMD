//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : searching/ytpost
import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh penggunaan:\n${usedPrefix + command} https://www.youtube.com/post/xxxx`

  let { data } = await axios.get(`https://api.platform.web.id/youtube-post?url=${encodeURIComponent(text)}`)
  if (!data?.postUrl) throw 'Post tidak ditemukan atau terjadi error.'

  let caption = `📝 *YouTube Post*
👤 Author: ${data.author} (${data.authorUrl})
🕒 Publish: ${data.publishTime}
❤️ Like: ${data.like}
💬 Text: ${data.text}
🔗 Link: ${data.postUrl}`

  await conn.sendMessage(m.chat, { text: caption }, { quoted: m })

  // jika ada gambar, kirim satu per satu
  if (data.images?.length) {
    for (let img of data.images) {
      await conn.sendMessage(m.chat, {
        image: { url: img.url },
        caption: `🖼 ${img.text || ''}`
      }, { quoted: m })
      await new Promise(resolve => setTimeout(resolve, 1500)) // delay 1.5 detik antar gambar
    }
  }
}

handler.help = ['ytpost <url>']
handler.tags = ['internet']
handler.command = /^ytpost$/i
handler.limit = true

export default handler