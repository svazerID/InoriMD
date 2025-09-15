//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : searching/githubsearch
import axios from 'axios';

let handler = async (m, { conn, text, command }) => {
  if (!text) throw `Contoh: *.github-search ttdl*`;

  let res = await axios.get(`https://api.platform.web.id/github-search?q=${encodeURIComponent(text)}`);
  let data = res.data;

  if (!data.status || !data.results.length) return m.reply('❌ Tidak ditemukan repositori.');

  let hasil = `🔎 *Hasil pencarian GitHub: ${text}*\n\n`;
  for (let repo of data.results.slice(0, 5)) { // ambil 5 saja
    hasil += `📦 *${repo.owner}/${repo.name}*\n`;
    hasil += `📝 ${repo.description || '-'}\n`;
    hasil += `⭐ ${repo.stars} | 🍴 ${repo.forks} | 👀 ${repo.watchers} | 🐞 ${repo.issues}\n`;
    hasil += `🕑 Updated: ${repo.updated_at}\n`;
    hasil += `➡️ ${repo.clone_url}\n\n`;
  }

  m.reply(hasil.trim());
};

handler.help = ['githubsearch <query>'];
handler.tags = ['internet'];
handler.command = /^(githubsearch)$/i;
handler.limit = true

export default handler;