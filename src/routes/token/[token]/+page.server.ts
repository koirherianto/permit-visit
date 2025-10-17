import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { PUBLIC_API_URL, PUBLIC_CC } from '$env/static/public';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const apiUrl = PUBLIC_API_URL;
  const token = params.token;

  try {
    const response = await fetch(`${apiUrl}/permit-visits/${token}`);

    if (response.status === 404) {
      throw error(404, 'Token tidak ditemukan atau sudah tidak berlaku.');
    }

    if (!response.ok) {
      throw error(500, 'Gagal mengambil data dari server.');
    }

    const json = await response.json();
    const permit = json.data;

    console.log('✅ Permit visit:', permit);
    console.log('👥 Guests:', permit.guests);

    return {
      permit,
      guests: permit.guests ?? [],
      approvals: permit.approvals ?? [],
      pendisposisi: permit.pendisposisi ?? null,
      progress: permit.progress
    };
  } catch (err) {
    console.error('❌ Error load token:', err);
    throw error(500, 'Terjadi kesalahan saat mengambil data kunjungan.');
  }
};
