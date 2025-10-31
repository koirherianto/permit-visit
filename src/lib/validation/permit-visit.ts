import { z } from 'zod';

/** Normalisasi & validasi nomor HP Indonesia. */
export const indoPhone = z.preprocess((v) => {
  const s = typeof v === 'string' ? v.trim() : '';
  if (!s) return s;
  // hapus non-digit kecuali leading '+'
  const cleaned = s.replace(/(?!^\+)\D/g, '');
  // ubah +62xxxx → 0xxxx
  const normalized = cleaned.startsWith('+62') ? '0' + cleaned.slice(3) : cleaned;
  return normalized;
}, z.string()
  .regex(/^08\d+$/, 'Nomor harus diawali 08')
  .min(10, 'Nomor minimal 10 digit')
  .max(15, 'Nomor maksimal 15 digit')
);

/** Tamu dinamis */
export const guestSchema = z.object({
  nama: z.string().trim().min(2, 'Nama tamu minimal 2 karakter').max(255),
  no_hp: indoPhone
});

/** File PDF ≤ 5MB (opsional) */
export const pdfFileOptional = z
  .instanceof(File)
  .refine((f) => f.type === 'application/pdf', 'File harus PDF')
  .refine((f) => f.size <= 5 * 1024 * 1024, 'Ukuran maksimal 5MB')
  .optional();

/** Coerce boolean → '1' | '0' untuk backend */
export const boolTo01 = z.preprocess((v) => {
  if (v === undefined || v === null || v === '') return '0';
  if (typeof v === 'boolean') return v ? '1' : '0';
  const s = String(v).trim().toLowerCase();
  if (['1', 'true', 'on', 'yes'].includes(s)) return '1';
  if (['0', 'false', 'off', 'no'].includes(s)) return '0';
  return '0';
}, z.enum(['0', '1']));

/** Schema form utama (match nama field HTML) */
export const permitVisitSchema = z.object({
  instansi: z.string().trim().min(2, 'Instansi minimal 2 karakter').max(255),
  agenda: z.string().trim().min(2, 'Keperluan minimal 2 karakter').max(255),

  nama_pic: z.string().trim().min(2, 'Nama PIC minimal 2 karakter').max(255),
  no_hp_pic: indoPhone,

  // input[type=datetime-local]
  tanggal_kunjungan: z.coerce.date({ required_error: 'Tanggal & waktu masuk wajib diisi' }),
  // input[type=date]
  tanggal_berakhir: z.coerce.date({ required_error: 'Tanggal selesai wajib diisi' }),

  nama_ingin_ditemui: z.string().trim().min(2, 'Nama wajib diisi').max(255),
  jabatan_ingin_ditemui: z.string().trim().min(2, 'Jabatan/Bagian wajib diisi').max(255),

  lampiran: pdfFileOptional,

  // ⚠️ gunakan ejaan persis seperti yang kamu minta:
  has_ofiicial_latter: boolTo01,

  guests: z.array(guestSchema).default([])
}).superRefine((val, ctx) => {
  // End date tidak boleh sebelum start date (bandingkan tanggal, abaikan jam)
  const start = val.tanggal_kunjungan;
  const end = val.tanggal_berakhir;
  const startYMD = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endYMD = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  if (endYMD < startYMD) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['tanggal_berakhir'],
      message: 'Tanggal selesai tidak boleh sebelum tanggal & waktu masuk'
    });
  }

  // Jika punya surat resmi → lampiran wajib
  if (val.has_ofiicial_latter === '1' && !val.lampiran) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['lampiran'],
      message: 'Lampiran surat resmi wajib diunggah'
    });
  }
});

export type PermitVisitInput = z.infer<typeof permitVisitSchema>;

/** Extract guests[0][nama]/[no_hp] dari FormData → array {nama,no_hp} */
export function extractGuests(formData: FormData) {
  const arr: Array<{ nama?: string; no_hp?: string }> = [];
  for (const [key, value] of formData.entries()) {
    const m = key.match(/^guests\[(\d+)\]\[(nama|no_hp)\]$/);
    if (!m) continue;
    const idx = Number(m[1]);
    const field = m[2] as 'nama' | 'no_hp';
    if (!arr[idx]) arr[idx] = {};
    arr[idx][field] = typeof value === 'string' ? value : '';
  }
  return arr.filter(Boolean).map((g) => ({ nama: g.nama ?? '', no_hp: g.no_hp ?? '' }));
}

/** Format date → 'YYYY-MM-DD' */
export function fmtDateYMD(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Format date-time lokal → 'YYYY-MM-DDTHH:mm' (fix 12/24 jam antar device) */
export function fmtLocalYMDHM(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
