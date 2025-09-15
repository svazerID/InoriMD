//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : tools/tiktokmonet
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} alfisyahriall`

  try {
    let apiUrl = `https://api.platform.web.id/tiktok-monet?username=${encodeURIComponent(text)}`
    let res = await fetch(apiUrl)
    if (!res.ok) throw await res.text()
    let data = await res.json()

    if (!data.status) return m.reply('❌ Tidak dapat menemukan akun TikTok tersebut.')

    let caption = `*👤 TikTok Monetisasi Check*\n\n`
    caption += `📌 Username: @${data.username}\n`
    caption += `👤 Nama: ${data.fullname || '-'}\n`
    caption += `✔️ Verified: ${data.verified}\n`
    caption += `📄 Bio: ${data.bio || '-'}\n\n`
    caption += `👥 Followers: ${data.followers}\n`
    caption += `❤️ Total Likes: ${data.totalLikes}\n`
    caption += `🎬 Total Video: ${data.totalVideos}\n\n`
    caption += `💸 Est. Earnings:\n• USD: ${data.estimatedEarningsUSD}\n• IDR: ${data.estimatedEarningsIDR}`

    await conn.sendMessage(m.chat, {
      image: { url: data.avatar },
      caption
    }, { quoted: m })
  } catch (e) {
    console.error('Error:', e)
    m.reply('🚨 Error: ' + (e.message || e))
  }
}

handler.help = ['tiktokmonet <username>']
handler.tags = ['tools']
handler.command = ['tiktokmonet']
handler.limit = true

export default handler