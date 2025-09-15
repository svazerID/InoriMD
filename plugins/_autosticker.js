let handler = async function (m, { args }) {
  const chat = global.db.data.chats[m.chat] || {};
  const arg = (args[0] || '').toLowerCase();

  if (arg === 'on') {
    chat.autosticker = true;
    m.reply('✅ *Autosticker* telah *diaktifkan* di chat ini.');
  } else if (arg === 'off') {
    chat.autosticker = false;
    m.reply('❌ *Autosticker* telah *dinonaktifkan* di chat ini.');
  } else {
    m.reply('Format salah!\nContoh: *.autosticker on* atau *.autosticker off*');
  }

  global.db.data.chats[m.chat] = chat;
};
handler.command = ['autosticker'];
handler.tags = ['sticker'];
handler.help = ['autosticker [on/off]'];
handler.register = true;

export default handler;