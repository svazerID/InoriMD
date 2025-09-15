let linkRegex = /anj(k|g)|ajn?(g|k)|anjin(g|k)|bajingan|bangsat|kontol|memek|pepek|meki|titit|tete[kk]|toket|ngewe|goblok|tolol|idiot|kentot|jembut|bego|jancok|pantek|puki|kimak|kampang|lonte|coli|pelacur|henceut|nigga|fuck|dick|bitch|tits|bastard|asshole/i

export async function before(m, { conn, isBotAdmin }) {
  try {
    if (!m.isGroup || m.fromMe || m.isBaileys) return

    let chat = global.db.data.chats[m.chat]
    if (!chat.antiToxic) return

    let isToxic = linkRegex.exec(m.text)
    if (isToxic) {
      // Hapus pesannya jika bot admin
      if (isBotAdmin) {
        await conn.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.key.participant
          }
        })
      }

      // Kirim peringatan
      await conn.sendMessage(m.chat, {
        text: `🚫 *Kata kasar terdeteksi:* Mohon jaga etika di grup ini.`,
        mentions: [m.sender]
      })
    }
  } catch (err) {
    console.error('[ANTI-TOXIC ERROR]', err)
  }
}