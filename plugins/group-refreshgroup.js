let handler = async (m, { conn }) => {
  const chatId = m.chat
  const isGroup = chatId.endsWith('@g.us')

  if (!isGroup) return m.reply('Fitur ini hanya bisa digunakan di grup!')

  try {
    await conn.groupMetadata(chatId)
    m.reply('✅ Info grup berhasil disegarkan (diperbarui dari server).')
  } catch (err) {
    console.error(err)
    m.reply('❌ Gagal menyegarkan info grup.')
  }
}

handler.command = /^refreshgroup$/i
handler.tags = ['group']
handler.help = ['refreshgroup']
handler.group = true

export default handler;