import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { PUBLIC_API_URL, PUBLIC_CC } from '$env/static/public';

// import type { PageServerLoad } from './$types';

// export const load: PageServerLoad = async () => {};

export const actions = {
	permitVisitSave: async ({ request, fetch }) => {
		// TODO log the user in
		const formData = await request.formData();
		console.log(formData)

		const apiUrl = PUBLIC_API_URL;
		console.log('API URL:', apiUrl);

		let beResponse = null;

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

			const laravelResponse = await response.json();
			console.log('✅ Laravel response:', laravelResponse.data);
			beResponse = laravelResponse.data;
			// return { success: true, data };

		} catch (err) {
			console.error('Fetch error:', err);
			return fail(500, { message: 'Internal server error', error: err });
		}


		redirect(302, '/token?token=' + beResponse.token);
	},
} satisfies Actions;