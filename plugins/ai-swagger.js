// Mengimpor modul axios menggunakan ESM
import axios from 'axios';

// Fungsi handler utama
const handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) {
    throw `Gunakan format:\n${usedPrefix + command} hi ada yang bisa saya bantu?`;
  }

  // Kirim reaksi menunggu
  conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

  try {
    // Prompt logika awal untuk AI
    const logic = `Mulai sekarang kamu adalah AI yang membantu saya mengembangkan REST API menggunakan Express.js dan Swagger (dokumentasi dengan jsdoc).
Setiap saya mengirimkan fungsi dan nama endpoint, fungsinya langsung digabungin aja jangan import dari path lain, dan jangan ada keterangan apapun, gunakan metode get, jika diminta gambar gunakan image url, kamu harus buatkan dokumentasinya dengan format Swagger JSDoc seperti berikut:

/**
 * @swagger
 * /nama-endpoint:
 *   get:
 *     summary: Deskripsi singkat
 *     tags: [Tag]
 *     parameters:
 *       - in: query
 *         name: param1
 *         schema:
 *           type: string
 *         required: false
 *         description: Deskripsi parameter
 *     responses:
 *       200:
 *         description: Respons berhasil
 */

import express from "express";
const router = express.Router();

router.get('/nama-endpoint', (req, res) => {
  const { param1 } = req.query;
  res.json({ hasil: \`Hasil dari \${param1}\` });
});

export default router;

Serta, tambahkan ke dalam server.js:
import namaEndpointRoutes from './routes/nama-endpoint.js';
app.use(namaEndpointRoutes);`;

    // Kirim permintaan ke API OpenAI
    const result = await openai(text, logic);
    conn.reply(m.chat, `${result}`, m);
  } catch (e) {
    console.error("Gagal memproses permintaan AI:", e);
    m.reply('⚠️ Terjadi kesalahan saat memproses permintaan.');
  }
};

export default handler;

// Metadata command
handler.help = ['swagger'];
handler.command = /^(swagger)$/i;

// Fungsi utilitas untuk mengakses OpenAI API
async function openai(userText, systemPrompt) {
  try {
    const { data } = await axios.post(
      "https://chateverywhere.app/api/chat/",
      {
        model: {
          id: "gpt-3.5-turbo-0613",
          name: "GPT-3.5",
          maxLength: 12000,
          tokenLimit: 4000,
          completionTokenLimit: 2500,
          deploymentName: "gpt-35"
        },
        messages: [
          {
            pluginId: null,
            content: userText,
            role: "user"
          }
        ],
        prompt: systemPrompt,
        temperature: 0.5
      },
      {
        headers: {
          Accept: "*/*",
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
        }
      }
    );

    return data;
  } catch (error) {
    console.error("Error while calling OpenAI API:", error.message);
    throw new Error("Gagal memanggil layanan AI");
  }
}