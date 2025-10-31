import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { PUBLIC_API_URL, PUBLIC_CC } from '$env/static/public';

export const actions = {
  permitVisitSave: async ({ request, fetch }) => {
    const formData = await request.formData();

    // log all
    // console.log('log semua data');
    // formData.forEach((value, key) => {
    //   // console.log(key, value);
    // });

    // 🔧 Pastikan tanggal_kunjungan aman dari format 12 jam
    const tanggalKunjungan = formData.get('tanggal_kunjungan');

    if (typeof tanggalKunjungan === 'string' && tanggalKunjungan) {
      const d = new Date(tanggalKunjungan);
      const isoLocal = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      formData.set('tanggal_kunjungan', isoLocal);
    }

    const apiUrl = PUBLIC_API_URL;
	  let laravelResponse;

    try {
      console.log('Mengirim data ke API Laravel...');
      const response = await fetch(apiUrl + '/permit-visits', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      console.log('Response status:', response.status);

	  
      if (!response.ok) {
        // kalau status 422 = validasi gagal
        if (response.status === 422) {
          const errorJson = await response.json();
          console.error('Validation errors:', errorJson.errors);
          const oldSafe = serializeOld(formData);
          return fail(422, {
            errors: errorJson.errors,
            old: oldSafe, // fitur off tidak bisa menerima file
          });
        }

        const errorText = await response.text();
        console.error('Error:', errorText);
        return fail(400, { message: 'Gagal kirim ke API Laravel', error: errorText });
      }
		
		  laravelResponse = await response.json();
    } catch (err) {
      console.error('Fetch error:', err);
      return fail(500, { message: 'Internal server error', error: err });
    }

	return redirect(302, '/token?token=' + laravelResponse.data.token);
  },
};

function serializeOld(fd: FormData) {
  const out: Record<string, string> = {};
  for (const [key, value] of fd.entries()) {
    if (typeof value === 'string') {
      out[key] = value;
    } else if (value instanceof File) {
      // ❌ Jangan taruh di old[key] (tidak bisa diserialisasi & tidak bisa diprefill)
      // Optional: kalau mau, simpan metadata terpisah (bukan di old)
      // out[`__file_meta__:${key}`] = JSON.stringify({ name: value.name, size: value.size, type: value.type });
    }
  }
  return out;
}
