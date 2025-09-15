async function handler(m) {
    if (!m.quoted) throw 'Reply pesan terlebih dahulu!' // pastikan ada pesan yang dibalas
    let q = await m.getQuotedObj()
    if (!q || !q.quoted) throw 'Pesan yang Anda balas tidak mengandung pesan yang dibalas!' // cek apakah ada pesan yang dikutip dalam pesan balasan
    await q.quoted.copyNForward(m.chat, true) // kirim ulang pesan yang dibalas
}
handler.command = /^q$/i

export default handler