export async function before(m) {
    let user = db.data.users[m.sender]
    let chat = db.data.chats[m.chat]

    if ((m.chat.endsWith('broadcast') || m.fromMe) && !m.message && !chat.isBanned) return
    if (!m.message || user.banned) return // Deteksi semua jenis pesan, bukan hanya teks

    this.spam = this.spam || {}

    if (!(m.sender in this.spam)) {
        this.spam[m.sender] = {
            jid: m.sender,
            count: 0,
            lastspam: 0
        }
    }

    const nowTimestamp = m.messageTimestamp.toNumber()
    const userSpam = this.spam[m.sender]

    userSpam.count++

    if (nowTimestamp - userSpam.lastspam < 6) { // spam dalam waktu 6 detik
        if (userSpam.count >= 6) {
            user.banned = true
            m.reply('*🚩 Spam detected. Kamu kena cooldown 1 detik.*')
            const cooldown = 10000 * 1
            const now = Date.now()
            if (now < user.lastBanned) user.lastBanned += cooldown
            else user.lastBanned = now + cooldown
        }
    } else {
        // reset hitungan spam jika sudah lewat dari 6 detik
        userSpam.count = 1
        userSpam.lastspam = nowTimestamp
    }
}