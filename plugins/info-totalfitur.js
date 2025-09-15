const handler = async (m, { conn: conn, text: text, usedPrefix: usedPrefix, command: command }) => {
  try {
    const counts = Object.values(plugins).flatMap((p => p.help ? p.tags : [])).filter((tag => null != tag && "" !== tag.trim())).reduce(((c, tag) => (c[tag] = (c[tag] || 0) + 1,
        c)), {}),
      tagList = Object.entries(counts).sort(((a, b) => b[1] - a[1])).map((([tag, count]) => `📁 ${(tag.charAt(0).toUpperCase() + tag.slice(1)).padEnd(13)} - ${count.toString().padStart(3)}`)).join("\n"),
      totalCommands = Object.values(counts).reduce(((a, b) => a + b), 0),
      responseText = `\`\`\`${tagList}\n\`\`\``;
    await conn.reply(m.chat, `*[ FEATURE LIST ]*\n\n${responseText}\n\n*Total fitur: ${totalCommands} Commands*`, m);
  } catch (error) {
    console.error(error), await conn.reply(m.chat, "Terjadi kesalahan dalam mengeksekusi perintah.", m);
  }
};
handler.help = ["totalfitur"], handler.tags = ["info"], handler.command = /^(feature|totalfitur)$/i;
export default handler;