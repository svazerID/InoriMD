let handler = async (m, { conn }) => {
conn.reply(m.chat, `
🚀 *Join Grup Bot WhatsApp Inori - Assistant!* 🔥
🤖 *Takina - Assistant* adalah bot WhatsApp dengan *600+ fitur* yang siap membantu kebutuhanmu!

📌 *Fitur utama:*
🎮 *Game & RPG* – berbagai permainan seru seperti tebak-tebakan, suit, slot, dan lainnya!
🔎 *Search Menu* – cari lagu, video, gambar, berita, kode pos, dan masih banyak lagi!
📂 *Tools Lengkap* – konversi file, upscaling gambar, remove background, dan lainnya!
🎵 *Downloader* – unduh video YouTube, TikTok, lagu, dan media lainnya dengan mudah!
💬 *AI & Chatbot* – ngobrol dengan AI canggih langsung dari WhatsApp!

🌟 *GRATIS & TANPA RIBET!*
Gabung sekarang dan nikmati semua fitur menariknya!

🔗 *Klik untuk join:* https://chat.whatsapp.com/JnhoVHc5X369a2si7GOXmu
🔥 *Jangan sampai ketinggalan!* 🔥
`, m)
}
handler.help = ['gcbot']
handler.tags = ['info']
handler.command = /^gcbot$/i

export default handler