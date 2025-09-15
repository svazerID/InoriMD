import fetch from 'node-fetch';

let handler = async (m, { text, command, conn }) => {
    if (!text) return m.reply('mau cari ape?\n\nContoh: .wikipedia Sejarah Kerajaan Majapahit');

    let apiUrl = `https://api.siputzx.my.id/api/s/wikipedia?query=${encodeURIComponent(text)}`;

    let response = await fetch(apiUrl);
    let json = await response.json();
    
    conn.sendMessage(m.chat, {
        text: json.data.wiki,
        contextInfo: {
            externalAdReply: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: { newsletterJid: '120363420643650987@newsletter', newsletterName: "🔴 FOLLOW ME ON CHANNEL", },
                forwardingScore: 256,
                title: 'W I K I P E D I A',
                body: global.wm,
                thumbnailUrl: json.data.thumb,
                sourceUrl: 'https://www.wikipedia.org',
                mediaType: 1,
                showAdAttribution: true,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });
};

handler.help = ["wikipedia"];
handler.tags = ["internet"];
handler.command = /^wikipedia$/i;

export default handler;