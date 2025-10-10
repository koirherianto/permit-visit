<script lang="ts">
  // shadcn-svelte imports
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
  } from "$lib/components/ui/card/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  let tamus = $state([{ nama: "", no_hp: "" }]);

  function tambahTamu() {
    tamus.push({ nama: "", no_hp: "" });
    $inspect(tamus);
  }
</script>

<!-- HERO (brand CFK: oranye → merah) -->
<!-- HERO -->
<section class="relative overflow-hidden">
  <!-- background image -->
  <div
    class="absolute inset-0 bg-cover bg-center"
    style="background-image: url('/landingpage-cfk-compress.jpg');"
  ></div>

  <!-- overlay gelap transparan agar teks tetap terbaca -->
  <div class="absolute inset-0 bg-black/40"></div>

  <!-- pattern halus di atasnya -->
  <div
    class="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
    style="background-image: radial-gradient(circle at 20% 30%, white 0%, transparent 35%),
                                radial-gradient(circle at 80% 70%, white 0%, transparent 35%);"
  ></div>

  <!-- content -->
  <div
    class="relative z-10 container mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center text-white"
  >
    <img
      src={data.logoCompany}
      alt={data.companyName}
      class="h-20 md:h-28 mb-6 drop-shadow-md"
    />

    <h1
      class="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg"
    >
      Formulir Kunjungan Tamu
    </h1>

    <p class="mt-4 max-w-2xl mx-auto text-base md:text-lg text-white/90">
      Silakan isi data kunjungan untuk keperluan administrasi di
      <span class="font-semibold">{data.companyName}</span>.
    </p>
  </div>
</section>

<!-- FORM -->
<main class="container mx-auto px-4 py-10 md:py-14 flex-1">
  <Card class="max-w-3xl mx-auto shadow-sm">
    <CardHeader>
      <CardTitle>Daftar Kunjungan</CardTitle>
    </CardHeader>
    <CardContent>
      <!-- Dummy UI only -->
      <form
        class="grid gap-6"
        enctype="multipart/form-data"
        method="POST"
        action="?/permitVisitSave"
      >
        <!-- Instansi -->
        <div class="grid gap-2">
          <Label for="instansi">
            Asal Instansi
            <span class="text-red-500">*</span></Label
          >
          <Input
            id="instansi"
            name="instansi"
            placeholder="Nama instansi"
            maxlength={255}
            required
          />
        </div>

        <!-- Agenda -->
        <div class="grid gap-2">
          <Label for="agenda"
            >Agenda Kunjungan
            <span class="text-red-500">*</span></Label
          >
          <Input
            id="agenda"
            name="agenda"
            placeholder="Agenda kunjungan"
            maxlength={255}
            required
          />
        </div>

        <!-- PIC -->
        <div class="grid md:grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="nama_pic"
              >Nama PIC <span class="text-red-500">*</span></Label
            >
            <Input
              id="nama_pic"
              name="nama_pic"
              placeholder="Nama penanggung jawab"
              maxlength={255}
              required
            />
          </div>
          <div class="grid gap-2">
            <Label for="no_hp_pic"
              >WhatsApp PIC (Token Notifikasi akan dikirim) <span
                class="text-red-500">*</span
              ></Label
            >
            <Input
              id="no_hp_pic"
              name="no_hp_pic"
              type="tel"
              inputmode="numeric"
              placeholder="08xxxxxxxxxx"
              maxlength={15}
              required
            />
          </div>
        </div>

        <!-- Tanggal -->
        <div class="grid md:grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="tanggal_kunjungan"
              >Tanggal Mulai Kunjungan
              <span class="text-red-500">*</span></Label
            >
            <!-- datetime -->
            <Input
              id="tanggal_kunjungan"
              name="tanggal_kunjungan"
              type="datetime-local"
              required
            />
          </div>
          <div class="grid gap-2">
            <Label for="tanggal_berakhir"
              >Tanggal Selesai Kunjungan
              <span class="text-red-500">*</span></Label
            >
            <Input
              id="tanggal_berakhir"
              name="tanggal_berakhir"
              type="date"
              required
            />
          </div>
        </div>

        <!-- Keterangan -->
        <div class="grid gap-2">
          <Label for="keterangan_tambahan">Keterangan Tambahan</Label>
          <Textarea
            id="keterangan_tambahan"
            name="keterangan_tambahan"
            placeholder="Opsional"
            maxlength={1000}
            class="min-h-[120px]"
          />
        </div>

        <!-- Agenda -->
        <div class="grid gap-2">
          <Label for="agenda"
            >Unggah Lampiran Surat Resmi Permohonan Kunjungan (max 5MB PDF)
            <span class="text-red-500">*</span></Label
          >
          <Input
            id="lampiran"
            name="lampiran"
            placeholder="Agenda kunjungan"
            type="file"
            accept="application/pdf"
            required
          />
        </div>

        <!-- Guests (dummy satu entri) -->
        <div class="border-t pt-6">
          <h3 class="font-semibold mb-4">Daftar Tamu</h3>
          <div class="grid md:grid-cols-2 gap-4 mb-2">
            <div class="grid gap-2">
              <Label for="guest_0_nama"
                >Nama Tamu <span class="text-red-500">*</span></Label
              >
            </div>
            <div class="grid gap-2">
              <Label for="guest_0_hp">No. HP Tamu</Label>
            </div>
          </div>
          {#each tamus as tamu, i}
            <div class="grid md:grid-cols-2 gap-4 my-2">
              <div class="grid gap-2">
                <Input
                  name={`guests[${i}][nama]`}
                  id={`guests[${i}][nama]`}
                  bind:value={tamus[i].nama}
                  placeholder="Nama tamu"
                  maxlength={255}
                  required
                />
              </div>
              <div class="grid gap-2">
                <Input
                  name={`guests[${i}][no_hp]`}
                  id={`guests[${i}][no_hp]`}
                  bind:value={tamus[i].no_hp}
                  type="tel"
                  inputmode="numeric"
                  placeholder="08xxxxxxxxxx"
                  maxlength={15}
                />
              </div>
            </div>
          {/each}

          <div class="mt-4">
            <Button type="button" variant="outline" onclick={tambahTamu}
              >+ Tambah Tamu</Button
            >
          </div>
        </div>

        <div class="pt-2">
          <Button type="submit" class="w-full md:w-auto">Kirim</Button>
        </div>
      </form>
    </CardContent>
  </Card>
</main>
