const handler = async (m, { conn, text }) => {
  try {
    // Validasi input
    if (!text) {
      return conn.reply(m.chat, '🚫 Silakan masukkan detail fitur yang ingin dibuat atau yang error.', m);
    }

    // Membersihkan input dari potensi XSS
    const cleanText = text.replace(/[<>]/g, '').trim();
    if (cleanText.length < 5) {
      return conn.reply(m.chat, '🚫 Detail fitur terlalu pendek, minimal 5 karakter.', m);
    }

    // Format pesan report
    const message = `*[REPORT FITUR]*\n\n` +
                   `Pengguna: @${m.sender.split('@')[0]}\n` +
                   `Waktu: ${new Date().toLocaleString('id-ID')}\n` +
                   `Fitur/Issue: ${cleanText}`;

    // Daftar admin (gunakan array untuk multiple admin)
    const admins = [
      '6283129667247@s.whatsapp.net',
      '62895615063060@s.whatsapp.net'
    ];

    // Kirim pesan ke semua admin
    for (const adminJid of admins) {
      await conn.sendMessage(adminJid, {
        text: message,
        mentions: [m.sender]
      });
    }

    // Kirim konfirmasi ke pengguna
    await conn.reply(m.chat, 
      '✅ Laporan telah dikirim ke pemilik bot.\n' +
      'Catatan: Laporan yang tidak serius tidak akan ditanggapi.',
      m
    );

  } catch (error) {
    console.error('Error in report handler:', error);
    await conn.reply(m.chat, '❌ Terjadi kesalahan saat mengirim laporan. Silakan coba lagi nanti.', m);
  }
};

// Metadata handler
handler.help = ['report <detail fitur/issue>'];
handler.tags = ['info'];
handler.command = /^(report|request)$/i;
handler.limit = true; // Membatasi penggunaan command
handler.cooldown = 300000; // Cooldown 5 menit (dalam ms)

// Hanya izinkan di grup atau private chat, bukan di broadcast
handler.group = false;
handler.private = false;
handler.botAdmin = false;

export default handler;