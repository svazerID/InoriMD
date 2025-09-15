//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : searching/tiktokstalk
import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh penggunaan:\n${usedPrefix + command} alfisyahriaal`

  let { data } = await axios.get(`https://api.platform.web.id/tiktokstalk?username=${encodeURIComponent(text)}`)
  if (!data?.status) throw 'User TikTok tidak ditemukan.'

  let user = data.data.user
  let stats = data.data.stats

  let caption = `👤 *TikTok Profile*
• Username: @${user.uniqueId}
• Nickname: ${user.nickname}
• Region: ${user.region}
• Verified: ${user.verified ? '✅' : '❌'}
• Bio: ${user.signature || '-'}
• Followers: ${stats.followerCount}
• Following: ${stats.followingCount}
• Likes: ${stats.heartCount}
• Videos: ${stats.videoCount}
• Friends: ${stats.friendCount}
🔗 https://tiktok.com/@${user.uniqueId}`

  await conn.sendMessage(m.chat, {
    image: { url: user.avatarLarger },
    caption
  }, { quoted: m })
}

handler.help = ['ttstalk']
handler.tags = ['stalk']
handler.command = /^(ttstalk|tiktokstalk)$/i

handler.register = true
handler.limit = true

export default handler
