let handler = async (m, { conn, text, usedPrefix, command, isAdmin, isOwner, isROwner }) => {
    let chat = global.db.data.chats[m.chat]

    // FILTER: Jika grup dalam mode adminOnly, tolak non-admin
    if (m.isGroup && chat?.adminOnly) {
        if (!isAdmin && !isOwner && !isROwner && !m.fromMe) {
            throw 'Bot sedang dalam mode *adminonly*. Hanya admin yang dapat menggunakan bot.'
        }
    }

    // Hanya tangani command "adminonly"
    if (command === 'adminonly') {
        if (!m.isGroup) throw 'Fitur ini hanya untuk grup!'
        switch (text) {
            case 'on': {
                if (chat.adminOnly) throw 'Mode *adminonly* sudah aktif.'
                chat.adminOnly = true
                conn.reply(m.chat, 'Mode *adminonly* diaktifkan. Hanya admin yang bisa menggunakan bot.', m)
                break
            }
            case 'off': {
                if (!chat.adminOnly) throw 'Mode *adminonly* sudah nonaktif.'
                chat.adminOnly = false
                conn.reply(m.chat, 'Mode *adminonly* dinonaktifkan. Semua member dapat menggunakan bot.', m)
                break
            }
            default: {
                m.reply(`Format salah!\n\nContoh:\n${usedPrefix + command} on\n${usedPrefix + command} off`)
            }
        }
    }
}
handler.help = ['adminonly <on/off>']
handler.tags = ['group']
handler.command = /^adminonly$/i
handler.group = true
handler.admin = true

export default handler