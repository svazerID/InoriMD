import axios from 'axios';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

// Fungsi untuk mengupload file dan mendapatkan URL
export default async (buffer, expiry = 'never') => {
  // Mendeteksi tipe file
  const type = await fileTypeFromBuffer(buffer);

  if (!type) {
    throw new Error('File type tidak terdeteksi atau tidak valid.');
  }

  const { ext, mime } = type;

  // Buat form data untuk upload
  const form = new FormData();
  form.append('file', buffer, {
    filename: `upload.${ext}`,
    contentType: mime
  });
  form.append('expiry', expiry);

  try {
    // Kirim request upload
    const { data } = await axios.post('https://api.platform.web.id/upload', form, {
      headers: {
        ...form.getHeaders(),
        // Tambahkan header tambahan jika diperlukan
        'Accept': 'application/json'
      },
      // Tambahkan timeout
      timeout: 30000
    });

    // Validasi response
    if (!data.success || !data.data?.url) {
      throw new Error(data.message || 'Upload gagal: response tidak valid');
    }

    // Kembalikan URL file
    return data.data.url;
  } catch (error) {
    // Error handling yang lebih detail
    const errorMessage = error.response?.data?.message ||
                        error.message ||
                        'Terjadi kesalahan saat mengupload file';

    console.error('Upload error:', errorMessage);
    throw new Error(errorMessage);
  }
};
