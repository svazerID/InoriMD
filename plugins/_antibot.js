export async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (!m.isGroup) return
    let chat = global.db.data.chats[m.chat]
    let setting = global.db.data.settings[this.user.jid] || {}
    if (m.fromMe) return

    if (m.id.startsWith('BAE5') || m.id.startsWith('3EB0')) {
        if (chat.antiBot) {
            if (isBotAdmin) {
                await m.reply("Kamu Terdeteksi BOT! Kamu Akan Dikick!")
                await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.key.participant }})
                await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            } else {
                m.reply("Kamu Terdeksi BOT! \n\n_BOT Bukan Admin!_")
            }
        }
    }
}