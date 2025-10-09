import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const tokenBaru = url.searchParams.get('token');

    return { 
        tokenBaru: tokenBaru 
    };
};


export const actions = {
  default: async ({ request, fetch }) => {
    const formData = await request.formData();
    const token = formData.get('token')?.toString().trim();

    if (!token) {
      return fail(400, { error: 'Token wajib diisi.' });
    }

    const apiUrl = env.PUBLIC_API_URL;

    try {
      const response = await fetch(`${apiUrl}/permit-visits/${token}`);

      if (response.status === 404) {
        // Token tidak ditemukan
        return fail(404, { error: 'Token tidak ditemukan. Periksa kembali token Anda.' });
      }

      if (!response.ok) {
        // Error selain 404
        return fail(500, { error: 'Gagal menghubungi server. Coba lagi nanti.' });
      }

      const data = await response.json();
      console.log(data.data, data.data.guests, data.data.approvals);

    } catch (err) {
      console.error('Error fetch token:', err);
      return fail(500, { error: 'Terjadi kesalahan server internal.' });
    }

    throw redirect(302, `/token/${token}`);
  },
} satisfies Actions;