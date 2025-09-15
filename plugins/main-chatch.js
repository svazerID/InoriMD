import moment from 'moment-timezone'

let linkchannel = 'https://whatsapp.com/channel/0029Vb4fjWE1yT25R7epR110'

let handler = async function (m, { conn, text, usedPrefix, command }) {
  const cooldown = 60000
  const ownerNumber = '62895615063060'
  const channelJid = '120363380343761245@newsletter'
  const forbiddenWords = /ajg|judol|kontol|memek|puki/i
  const now = Date.now()

  let user = global.db.data.users[m.sender] || {}
  const pushname = m.pushName || user.name || "Pengguna"

  if (!text) {
    return m.reply(`Pesannya mana?\n\nContoh: ${usedPrefix + command} halo`)
  }

  if (forbiddenWords.test(text)) {
    return m.reply('Pesan Anda mengandung kata-kata yang tidak diperbolehkan!')
  }

  if (m.sender !== ownerNumber && now - (user.cooldownPesansal || 0) < cooldown) {
    return m.reply('Mohon tunggu sebentar! Anda hanya dapat menggunakan fitur ini setiap 1 menit sekali.')
  }

  user.cooldownPesansal = now
  global.db.data.users[m.sender] = user

  conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
  await sleep(6000)
  conn.sendMessage(m.chat, { react: { text: '⌛', key: m.key } })

  let profilePicture
  try {
    profilePicture = await conn.profilePictureUrl(m.sender, 'image')
  } catch {
    profilePicture = 'https://files.catbox.moe/ifx2y7.png'
  }

  const messageContent = {
    text,
    contextInfo: {
      externalAdReply: {
        title: 'Channel Message',
        body: `Pesan dari: ${pushname}`,
        thumbnailUrl: profilePicture,
        mediaType: 1,
        renderLargerThumbnail: false,
        showAdAttribution: false
      }
    }
  }

  await conn.sendMessage(channelJid, messageContent, { quoted: m })
  await sleep(2000)

  m.reply(
    `Pesan Anda telah berhasil dikirim ke saluran ini:\n` +
    `${linkchannel}\n` +
    `Terima kasih telah berinteraksi dengan ${global.botname || 'Bot ini'}`
  )

  conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}

handler.help = ['chatch']
handler.tags = ['main']
handler.command = /^(chatch|chatchannel|toch)$/i

export default handler

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}