import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh:\n${usedPrefix + command} <model> <teks>\n\n📌 Contoh:\n${usedPrefix + command} miku Halo dunia\n\nlist model:\nmiku\nnahida\ngoku\nnami\nana\neminem`;

  try {
    // Pisahkan model & teks
    let [model, ...txtArr] = text.split(" ");
    let teks = txtArr.join(" ");

    if (!teks) throw `❌ Masukkan teks setelah model!\n\nContoh:\n${usedPrefix + command} miku Halo dunia`;

    // Ambil daftar model dari API
    let listRes = await fetch(`https://api.platform.web.id/tts?text=${encodeURIComponent(teks)}`);
    let data = await listRes.json();

    if (!data || data.length === 0) {
      return m.reply('❌ Tidak ada suara tersedia untuk teks ini.');
    }

    // Cari model yg cocok (case-insensitive)
    let voice = data.find(v => v.model.toLowerCase() === model.toLowerCase());
    if (!voice) {
      let available = data.map(v => v.model).join(", ");
      return m.reply(`❌ Model "${model}" tidak ditemukan.\n\n🎙️ Pilihan yang tersedia:\n${available}`);
    }

    // Ambil URL audio
    let audioUrl = voice.oss_url;

    // Deteksi ekstensi file
    let mime = audioUrl.endsWith('.wav') ? 'audio/wav' : 'audio/mpeg';

    // Download jadi buffer
    let audioRes = await fetch(audioUrl);
    if (!audioRes.ok) throw new Error(`Gagal unduh audio: ${audioRes.statusText}`);
    let buffer = await audioRes.buffer();

    // Kirim ke chat
    await conn.sendMessage(m.chat, {
      audio: buffer,
      mimetype: 'audio/mpeg',
      fileName: `${voice.voice_name || voice.model}.${mime.split('/')[1]}`,
ptt: true
    }, { quoted: m });

  } catch (e) {
    console.error('Error:', e);
    m.reply('🚨 Error: ' + (e.message || e));
  }
}

handler.help = ['tts2 <model> <teks>']
handler.tags = ['tools']
handler.command = ['tts2']
handler.limit = true

export default handler;