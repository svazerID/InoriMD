import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    // Mengambil data dari URL JSON
    const response = await fetch('https://raw.githubusercontent.com/Fiisya/Database-Json/refs/heads/main/tahlil.json');
    const json = await response.json();
    
    // Mengambil data tahlil
    const tahlilData = json.result.data;
    
    // Memilih bacaan secara acak
    const randomIndex = Math.floor(Math.random() * tahlilData.length);
    const selectedTahlil = tahlilData[randomIndex];

    // Menyiapkan pesan untuk dikirim
    const message = `
*${selectedTahlil.title}*

*Arab:* ${selectedTahlil.arabic}

*Terjemahan:* ${selectedTahlil.translation}
    `.trim();

    // Mengirimkan pesan
    await conn.sendMessage(m.chat, { text: message }, { quoted: m });
  } catch (e) {
    console.error('Error:', e);
    m.reply('🚨 Error: ' + (e.message || e));
  }
}

handler.help = ['tahlil'];
handler.tags = ['islami'];
handler.command = ['tahlil'];
handler.limit = true;

export default handler;