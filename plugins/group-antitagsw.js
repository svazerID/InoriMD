let handler = async (m, { conn, args, isAdmin, isOwner }) => {
    if (!m.isGroup) return m.reply("Fitur ini hanya dapat digunakan dalam grup.")
    if (!(isAdmin || isOwner)) return m.reply("Maaf, fitur ini hanya dapat digunakan oleh admin grup.")
    
    global.db.data.chats = global.db.data.chats || {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

    if (!args[0]) return m.reply("Silakan gunakan: *.antitagsw on/off*")

    if (args[0].toLowerCase() === "on") {
        if (global.db.data.chats[m.chat].antitagsw) return m.reply("Fitur *Anti Tag Status WhatsApp* sudah aktif di grup ini.")
        global.db.data.chats[m.chat].antitagsw = true
        return m.reply("*Anti Tag Status WhatsApp* berhasil diaktifkan dalam grup ini.")
    } else if (args[0].toLowerCase() === "off") {
        if (!global.db.data.chats[m.chat].antitagsw) return m.reply("Fitur *Anti Tag Status WhatsApp* sudah nonaktif di grup ini.")
        global.db.data.chats[m.chat].antitagsw = false
        return m.reply("*Anti Tag Status WhatsApp* berhasil dinonaktifkan dalam grup ini.")
    } else {
        return m.reply("Mohon pilih opsi yang valid: *on/off*")
    }
}

handler.before = async (m, { conn, isBotAdmin, isAdmin }) => {
    global.db.data.chats = global.db.data.chats || {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

    if (!m.isGroup || !global.db.data.chats[m.chat].antitagsw) return

    const isTaggingInStatus =
        m.mtype === 'groupStatusMentionMessage' ||
        (m.quoted && m.quoted.mtype === 'groupStatusMentionMessage') ||
        (m.message && m.message.groupStatusMentionMessage) ||
        (m.message && m.message.protocolMessage && m.message.protocolMessage.type === 25)

    if (!isTaggingInStatus) return

    // Hapus pesan status mention
    await conn.sendMessage(m.chat, { delete: m.key })

    // Inisialisasi data user
    global.db.data.users = global.db.data.users || {}
    if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { warning: 0 }

    let user = global.db.data.users[m.sender]
    user.warning += 1

    let warningMsg = `*📮 Terdeteksi Menandai Grup dalam Status WhatsApp*\n\n` +
                     `@${m.sender.split("@")[0]}, mohon untuk tidak menandai grup dalam status WhatsApp.\n\n` +
                     `⚠️ Warning: ${user.warning} / 3\n` +
                     `[❗] Jika warning mencapai 3, kamu akan dikeluarkan dari grup.`

    await conn.sendMessage(m.chat, {
        text: warningMsg,
        mentions: [m.sender]
    })

    // Jika warning >= 3 dan bot admin, kick user
    if (user.warning >= 3) {
        user.warning = 0 // reset warning setelah kick
        if (isBotAdmin) {
            await conn.sendMessage(m.chat, {
                text: `@${m.sender.split("@")[0]} telah dikeluarkan dari grup karena melanggar aturan.`,
                mentions: [m.sender]
            })
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        }
    }
}

handler.command = ['antitagsw']
handler.help = ['antitagsw'].map(a => a + ' *on/off*')
handler.tags = ['group']
handler.group = true
handler.admin = true

export default handler;