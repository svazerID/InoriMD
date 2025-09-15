let handler = async (m, { isAdmin, isOwner, isROwner }) => {
    let chat = global.db.data.chats[m.chat]

    // Jika dalam grup & mode adminOnly aktif
    if (m.isGroup && chat?.adminOnly) {
        if (!isAdmin && !isOwner && !isROwner && !m.fromMe) {
            throw 'Bot sedang dalam mode *adminonly*. Hanya admin yang dapat menggunakan bot.'
        }
    }
}
export default { before: handler }