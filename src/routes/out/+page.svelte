<script lang="ts">
  import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
  } from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";

  // Svelte 5 runes
  let picName = $state("");
  let jabatan = $state("");
  let phone = $state(""); // nomor WA tujuan (opsional). Jika kosong, pakai wa.me tanpa nomor
  let agenda = $state("");

  function buildWhatsAppUrl() {
    const to = (phone || "").replace(/\D/g, ""); // sanitize
    const text = [
      "Halo, saya ingin membuat janji kunjungan.",
      "",
      `Keperluan: ${agenda || "[tulis keperluan]"}`,
      `PIC tujuan: ${picName || "[nama PIC]"}`,
      `Jabatan/Bagian: ${jabatan || "[jabatan/bagian]"}`,
      `Waktu yang diinginkan: [tanggal & jam]`,
      "",
      "Mohon konfirmasi ketersediaan waktunya. Terima kasih.",
    ].join("\n");

    const base = to ? `https://wa.me/${to}` : "https://wa.me/";
    return `${base}?text=${encodeURIComponent(text)}`;
  }
</script>

<!-- Hero ringkas -->
<section class="container mx-auto px-4 py-10">
  <h1 class="text-2xl md:text-3xl font-bold">Buat Janji Terlebih Dahulu</h1>
  <p class="text-muted-foreground mt-2">
    Untuk melanjutkan pengajuan kunjungan, Anda perlu memiliki janji terlebih
    dahulu dengan PIC terkait (via telpon atau pesan).
  </p>
</section>

<main class="container mx-auto px-4 pb-14">
  <Card class="max-w-3xl mx-auto">
    <CardHeader>
      <CardTitle>Langkah Cepat Membuat Janji</CardTitle>
    </CardHeader>
    <CardContent class="grid gap-6">
      <div class="grid md:grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label for="picName">Nama PIC</Label>
          <Input
            id="picName"
            bind:value={picName}
            placeholder="Contoh: Bapak Andi"
            maxlength={255}
          />
        </div>
        <div class="grid gap-2">
          <Label for="jabatan">Jabatan/Bagian/Departemen</Label>
          <Input
            id="jabatan"
            bind:value={jabatan}
            placeholder="Contoh: Manager Produksi"
            maxlength={255}
          />
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label for="agenda">Keperluan</Label>
          <Input
            id="agenda"
            bind:value={agenda}
            placeholder="Contoh: Kunjungan vendor / audit"
            maxlength={255}
          />
        </div>
        <div class="grid gap-2">
          <Label for="phone">No. WA PIC (628xxx)</Label>
          <Input
            id="phone"
            bind:value={phone}
            type="tel"
            inputmode="numeric"
            placeholder="628xxxxxx"
            maxlength={20}
          />
        </div>
      </div>

      <div class="flex flex-wrap gap-3">
        <a href={buildWhatsAppUrl()} target="_blank" rel="noopener">
          <Button type="button">Susun Pesan WhatsApp</Button>
        </a>
        <a href="/">
          <Button type="button" variant="outline">Kembali ke Formulir</Button>
        </a>
      </div>

      <div class="text-sm text-muted-foreground">
        Tip: Jika belum ada nomor WA PIC, kosongkan field nomor — WhatsApp akan
        terbuka dengan draft pesan dan Anda bisa memilih kontak secara manual.
      </div>
    </CardContent>
  </Card>
</main>
