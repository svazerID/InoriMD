import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} <nik>`;

  try {
    const response = await fetch(`https://api.platform.web.id/nik-parse?nik=${encodeURIComponent(text)}`);
    const data = await response.json();

    if (!data.nik) throw new Error('Gagal mendapatkan data dari API!');

    const result = `
      *NIK:* ${data.nik}
      *Kelamin:* ${data.kelamin}
      *Tanggal Lahir:* ${data.lahir_lengkap}
      *Provinsi:* ${data.provinsi.nama}
      *Kabupaten/Kota:* ${data.kotakab.nama}
      *Kecamatan:* ${data.kecamatan.nama}
      *Kode Wilayah:* ${data.kode_wilayah}
      *Nomor Urut:* ${data.nomor_urut}
      *Usia:* ${data.tambahan.usia}
      *Zodiak:* ${data.tambahan.zodiak}
      *Ultah:* ${data.tambahan.ultah}
    `;

    await conn.sendMessage(m.chat, {
      text: result,
      caption: 'Berikut adalah informasi yang diperoleh dari NIK:'
    }, { quoted: m });

  } catch (e) {
    console.error('Error:', e);
    m.reply('🚨 Error: ' + (e.message || e));
  }
}

handler.help = ['nikparse <nik>'];
handler.tags = ['tools'];
handler.command = ['nikparse'];
handler.limit = true;

export default handler;