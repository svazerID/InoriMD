export async function before(m, {conn, isAdmin, isBotAdmin, isOwner, isROwner}) {
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup) return !1;
  if (!m.message) return !0;
  if (m.text.includes('p') || m.text.includes('P') || m.text.includes('oi') || m.text.includes('hai') || m.text.includes('pi')) return !0;
  const chat = global.db.data.chats[m.chat];
  const bot = global.db.data.settings[this.user.jid] || {};
if (m.chat === '120363380343761245@newsletter') return !0
  if (bot.antiPrivate && !isOwner && !isROwner) {
    await m.reply(`🚩 *Akses Bot Ke Private Chat Di Tolak,*\n\nHalo @${m.sender.split`@`[0]}, Owner saya telah menonaktifkan bot Private Chat yang akan memblokir Anda, jika Anda ingin menggunakan bot, saya mengundang Anda untuk bergabung dengan grup bot utama.\n\nhttps://chat.whatsapp.com/L5OUiV1WF5EJLU2fDjR62C`, false, {mentions: [m.sender]});
    await this.updateBlockStatus(m.chat, 'block');
  }
  return !1;
}