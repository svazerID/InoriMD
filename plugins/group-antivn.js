let handler = async (m, { conn, args, isAdmin, isOwner, isBotAdmin }) => {
    if (!m.isGroup) return m.reply("Fitur ini hanya dapat digunakan dalam grup.")
    if (!(isAdmin || isOwner)) return m.reply("Maaf, fitur ini hanya untuk admin grup.")
    if (!isBotAdmin) return m.reply("Bot perlu jadi admin untuk bisa menghapus voice note.")

    global.db.data.chats = global.db.data.chats || {}

    if (!global.db.data.chats[m.chat]) {
        global.db.data.chats[m.chat] = {}
    }

    if (!args[0]) return m.reply("Silakan gunakan: *.antivn on/off*")

    if (args[0].toLowerCase() === "on") {
        if (global.db.data.chats[m.chat].antivn) return m.reply("Fitur *Anti VN* sudah aktif di grup ini.")
        global.db.data.chats[m.chat].antivn = true
        return m.reply("*Anti VN* berhasil diaktifkan di grup ini.")
    } else if (args[0].toLowerCase() === "off") {
        if (!global.db.data.chats[m.chat].antivn) return m.reply("Fitur *Anti VN* sudah nonaktif di grup ini.")
        global.db.data.chats[m.chat].antivn = false
        return m.reply("*Anti VN* berhasil dinonaktifkan di grup ini.")
    } else {
        return m.reply("Mohon pilih opsi yang valid: *on/off*")
    }
}

// Middleware BEFORE hapus voice note otomatis (tanpa kick)
handler.before = async (m, { conn, isBotAdmin, isAdmin }) => {
    global.db.data.chats = global.db.data.chats || {}
    if (!global.db.data.chats[m.chat]) {
        global.db.data.chats[m.chat] = {}
    }

    if (!m.isGroup || !global.db.data.chats[m.chat].antivn) return

    if (m.mtype === 'audioMessage' && m.msg?.ptt) {
        try {
            await conn.sendMessage(m.chat, { delete: m.key })

            return conn.sendMessage(m.chat, {
                text: `@${m.sender.split("@")[0]}, voice note (VN) tidak diperbolehkan di grup ini.`,
                mentions: [m.sender]
            })
        } catch (e) {
            console.error('[AntiVN] Gagal hapus VN:', e)
        }
    }
}

handler.command = ['antivn']
handler.help = ['antivn'].map(a => a + ' *on/off*')
handler.tags = ['group']
handler.group = true
handler.admin = true

export default handler;