//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : searching/igstalk
import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`📸 Contoh penggunaan:\n${usedPrefix + command} cristiano`)

  try {
    let { data } = await axios.get(`https://api.platform.web.id/igstalk?username=${encodeURIComponent(text)}`)
    if (!data || !data.username) return m.reply('❌ Pengguna tidak ditemukan.')

    let caption = `👤 *Instagram Profile: @${data.username}*\n\n` +
                  `📷 Postingan: ${data.stats.posts}\n` +
                  `👥 Followers: ${data.stats.followers}\n` +
                  `🔗 Following: ${data.stats.following}\n\n` +
                  `📝 Bio:\n${data.bio}`

    await conn.sendMessage(m.chat, {
      image: { url: data.avatar },
      caption: caption,
      contextInfo: {
        externalAdReply: {
          title: `Instagram: @${data.username}`,
          body: `Followers ${data.stats.followers} | Posts ${data.stats.posts}`,
          thumbnailUrl: data.avatar,
          sourceUrl: `https://instagram.com/${data.username}`,
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('❌ Terjadi kesalahan saat mengambil data.')
  }
}

handler.help = ['igstalk']
handler.tags = ['stalk']
handler.command = /^(igstalk|instagramstalk)$/i

handler.register = true
handler.limit = true

export default handler
