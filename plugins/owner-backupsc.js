import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const exec_ = promisify(exec);

const handler = async (m, { conn }) => {
   if (m.chat === "120363217994871358@g.us") { // Ensure this comparison is strict
      try {
         const zipFileName = `inori-Beta.zip`;

         m.reply("Sedang memulai proses backup. Harap tunggu...");

         // Set a delay of 1 second before starting the backup process
         setTimeout(async () => {
            const zipCommand = `zip -r ${zipFileName} * -x "node_modules/*"`;

            try {
               await exec_(zipCommand);

               // Check if the zip file was created successfully
               if (fs.existsSync(zipFileName)) {
                  // Delay 2 seconds before sending the backup file
                  setTimeout(() => {
                     const file = fs.readFileSync(zipFileName);
                     conn.sendMessage(
                        m.chat,
                        {
                           document: file,
                           mimetype: "application/zip",
                           fileName: zipFileName,
                           caption: "Backup selesai. Silakan unduh file backup.",
                        },
                        { quoted: m }
                     );

                     // Delete the zip file after 5 seconds
                     setTimeout(() => {
                        fs.unlinkSync(zipFileName);
                        m.reply("File backup telah dihapus.");
                     }, 5000);
                  }, 2000);
               } else {
                  m.reply("Gagal membuat file backup.");
               }
            } catch (execError) {
               console.error("Error during zip creation:", execError);
               m.reply("Gagal membuat file backup.");
            }
         }, 1000);
      } catch (error) {
         m.reply("Terjadi kesalahan saat melakukan backup.");
         console.error("Error in backup process:", error);
      }
   } else {
      // Send message if the user is not in the correct group
      conn.sendMessage(m.chat, {
  document: fs.readFileSync('./README.md'),
  mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  fileName: 'Inori Yuzuriha',
  fileLength: 271000000000000,
  caption: 'ada ada saja😂😂',
  contextInfo: {
    mentionedJid: [m.sender],
    isForwarded: true,
    forwardingScore: 256,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363420643650987@newsletter',
      newsletterName: `Powered By: ${global.author}`,
      serverMessageId: -1
    },
    externalAdReply: {
      showAdAttribution: false,
      title: wm,
      body: 'I Am An Automated System WhatsApp Bot That Can Help To Do Something, Search And Get Data / Information Only Through WhatsApp.',
      thumbnailUrl: 'https://kua.lat/inori',
      sourceUrl: sgc,
      mediaType: 1,
      renderLargerThumbnail: false
    }
  }
}, { quoted: m });
   }
};

handler.help = ["backupsc"];
handler.tags = ["owner"];
handler.command = ["pibackup", "backupsc"];
handler.rowner = true; // Restrict this command to the owner
handler.private = false;

export default handler;