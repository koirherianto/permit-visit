<script lang="ts">
  import type { PageProps } from "./$types";
  import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
  } from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";

  let { data }: PageProps = $props();

  // Svelte 5 runes
  let namaPemohon = $state("");
  let instansiPemohon = $state("");
  let keperluanPemohon = $state("");
  let tanggalDiinginkan = $state(""); // type="date"

  // Nomor WA PIC tujuan (tetap)
  const PHONE_TARGET = data.nomerHrd;

  function buildWhatsAppUrl() {
    // Buang karakter non-digit
    const to = PHONE_TARGET.replace(/\D/g, "");
    const base = `https://wa.me/${to}`;

    const text = [
      "Halo, saya ingin membuat janji kunjungan.",
      "",
      `Nama Pemohon: ${namaPemohon || "[Nama Pemohon]"}`,
      `Perusahaan/Instansi: ${instansiPemohon || "[Perusahaan/Instansi]"}`,
      `Keperluan: ${keperluanPemohon || "[Keperluan]"}`,
      `Pada Tanggal: ${tanggalDiinginkan || "[Tanggal]"}`,
      "",
      "Pesan ini dibuat dari formulir visit kunjungan online, pengguna tidak memiliki surat resmi ataupun janji.",
    ].join("\n");

    return `${base}?text=${encodeURIComponent(text)}`;
  }
</script>

<!-- Hero ringkas -->
<section class="container mx-auto px-4 py-10">
  <h1 class="text-2xl md:text-3xl font-bold">Buat Janji Terlebih Dahulu</h1>
  <p class="text-muted-foreground mt-2">
    Untuk melanjutkan pengajuan kunjungan, Anda perlu memiliki janji terlebih
    dahulu dengan HRD.
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
          <Label for="namaPemohon">Nama Pemohon</Label>
          <Input
            id="namaPemohon"
            bind:value={namaPemohon}
            placeholder="Contoh: Bapak Andi"
            maxlength={255}
          />
        </div>
        <div class="grid gap-2">
          <Label for="instansiPemohon">Perusahaan/Instansi Pemohon</Label>
          <Input
            id="instansiPemohon"
            bind:value={instansiPemohon}
            placeholder="Contoh: PT ABC"
            maxlength={255}
          />
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label for="keperluanPemohon">Keperluan Pemohon</Label>
          <Input
            id="keperluanPemohon"
            bind:value={keperluanPemohon}
            placeholder="Contoh: Menawarkan Jasa ..."
            maxlength={255}
          />
        </div>
        <div class="grid gap-2">
          <Label for="tanggalDiinginkan">Pada Tanggal</Label>
          <Input
            id="tanggalDiinginkan"
            bind:value={tanggalDiinginkan}
            type="text"
            inputmode="text"
            placeholder="Contoh: 15 Agustus 2027"
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
        Tip: Klik tombol Susun Pesan WhatsApp akan terbuka dengan draft pesan
        dan Anda bisa memilih kontak secara manual.
      </div>
    </CardContent>
  </Card>
</main>
