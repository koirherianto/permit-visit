import { PUBLIC_CC } from '$env/static/public';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
    if (PUBLIC_CC === 'CFK') {
        return {
            companyName: 'PT Cahaya Fajar Kaltim',
            logoCompany: '/cfk-logo.png',
            favicon: '/favicon-cfk.ico'
        };
    }

    return {
        companyName: 'PT. Indonesia Energi Dinamika',
        logoCompany: '/ied-logo.png',
        favicon: '/favicon-ied.ico'
    };
};