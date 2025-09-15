//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : searching/twitterstalk
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} Duda_saants`

  try {
    let apiUrl = `https://api.platform.web.id/twitter-stalk?username=${encodeURIComponent(text)}`
    let res = await fetch(apiUrl)
    if (!res.ok) throw await res.text()
    let data = await res.json()

    if (!data.name) return m.reply('❌ Akun Twitter tidak ditemukan atau private.')

    let caption = `*🐦 Twitter Stalk*\n\n`
    caption += `👤 Name: ${data.name}\n`
    caption += `🔖 Username: @${data.screen_name}\n`
    caption += `📝 Bio: ${data.description || '-'}\n`
    caption += `✅ Verified: ${data.user_is_blue_verified ? '✔️ Blue' : '❌ Not Blue'}\n\n`

    caption += `*📰 Latest Tweets:*\n`
    caption += data.tweets.slice(0, 5).map((v, i) => 
      `${i+1}. ${v.full_text}\n❤️ ${v.favorite_count} 🔁 ${v.retweet_count} 💬 ${v.reply_count} 👁 ${v.view_count}`
    ).join('\n\n')

    await conn.sendMessage(m.chat, {
      image: { url: data.profile_image_url_https },
      caption
    }, { quoted: m })
  } catch (e) {
    console.error('Error:', e)
    m.reply('🚨 Error: ' + (e.message || e))
  }
}


handler.help = ['twitterstalk']
handler.tags = ['stalk']
handler.command = /^(twitterstalk|xstalk)$/i

handler.register = true
handler.limit = true

export default handler
