//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : searching/githubtrending
import axios from 'axios'

let handler = async (m, { conn }) => {
  let { data } = await axios.get('https://api.platform.web.id/github-trending')
  if (!data.status || !data.result) throw 'Gagal mengambil data.'

  let text = '*📈 GitHub Trending Repositories:*\n\n'
  for (let repo of data.result) {
    text += `• *${repo.title}*\n`
    text += `  🌐 Repo: ${repo.repoLink}\n`
    text += `  📝 ${repo.description || 'Tidak ada deskripsi.'}\n`
    text += `  ⭐ Stars: ${repo.stars}\n`
    text += `  🍴 Forks: ${repo.forks}\n`
    text += `  💻 Language: ${repo.language}\n\n`
  }

  await conn.reply(m.chat, text, m)
}

handler.help = ['githubtrending']
handler.tags = ['internet']
handler.command = /^githubtrending$/i
handler.limit = true

export default handler