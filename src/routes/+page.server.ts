import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { PUBLIC_API_URL, PUBLIC_CC } from '$env/static/public';

// import type { PageServerLoad } from './$types';

// export const load: PageServerLoad = async () => {};

export const actions = {
  permitVisitSave: async ({ request, fetch }) => {
    const formData = await request.formData();

    // log all
    console.log('log semua data');
    formData.forEach((value, key) => {
      console.log(key, value);
    });

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
      const response = await fetch(apiUrl + '/permit-visits', {
        method: 'POST',
        body: formData,
      });

	  
      if (!response.ok) {
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
