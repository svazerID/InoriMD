import { exec } from "child_process";
import { promisify } from "util";
const execPromise = promisify(exec);

const handler = async (m, { args, usedPrefix, command }) => {
  if (args.length < 2) {
    return m.reply(`*• Contoh:* ${usedPrefix + command} ./plugins fetch`);
  }

  const folder = args[0];
  const keyword = args.slice(1).join(" ");

  const shellCmd = `find ${folder} -type f -exec grep -i -l "${keyword}" {} +`;

  m.reply(`*Searching in:* \`${folder}\`\n*Keyword:* \`${keyword}\`\n_Processing..._`);
  try {
    const { stdout, stderr } = await execPromise(shellCmd);
    if (stderr) throw new Error(stderr);

    const files = stdout.trim().split("\n").filter(Boolean);
    if (!files.length) {
      return m.reply("*Tidak ditemukan file yang cocok.*");
    }

    const resultMsg = `*• Folder:* \`${folder}\`\n*• Keyword:* \`${keyword}\`\n\n` +
      files.map((file, i) => `*${i + 1}.* \`${file}\``).join("\n") +
      `\n\n*• Total:* ${files.length} file(s)`;

    m.reply(resultMsg);
  } catch (e) {
    m.reply("❌ Terjadi error:\n```" + e.message + "```");
  }
};

handler.help = ["findtext <folder> <keyword>"];
handler.tags = ["owner"];
handler.command = /^findtext$/i;
handler.owner = true;

export default handler;