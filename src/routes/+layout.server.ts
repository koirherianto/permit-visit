import { env } from '$env/dynamic/public';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
    if (env.PUBLIC_CC === 'CFK') {
        return {
            companyName: 'PT Cahaya Fajar Kaltim',
            logoCompany: '/cfk-logo.png',
            brandGradient: 'from-[#FFD700] via-[#F27101] to-[#E30613]' // kuning → oranye → merah
        };
    }

    return {
        companyName: 'PT. Indonesia Energi Dinamika',
        logoCompany: '/ied-logo.png',
        brandGradient: 'from-[#E30613] via-[#FFB400] to-[#FFD700]' // merah → kuning
    };
};