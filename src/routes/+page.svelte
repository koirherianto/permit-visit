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

  // ⬇️ NEW: dialog components
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
  } from "$lib/components/ui/dialog/index.js";

  import type { PageProps } from "./$types";
  let { data, form }: PageProps = $props();

  // data tamu (sudah ada)
  let tamus = $state<{ nama: string; no_hp: string }[]>([]);
  function tambahTamu() {
    tamus.push({ nama: "", no_hp: "" });
  }

  // ⬇️ NEW: modal & logic
  let modalOpen = $state(true); // buka modal saat halaman load
  let hasOfficialLetter = $state<boolean | null>(null); // null = belum memilih
  let namaJanji = $state(""); // nama yang dihubungi via telp/pesan (dalam modal)
  let jabatanJanji = $state(""); // jabatan/bagian/dept (dalam modal)

  // ⬇️ NEW: ikat form utama agar bisa diisi otomatis dari modal
  let namaInginDitemui = $state("");
  let jabatanInginDitemui = $state("");

  function pilihIya() {
    hasOfficialLetter = true;
    modalOpen = false;
  }

  function pilihTidak() {
    hasOfficialLetter = false;
    // tetap di modal, lanjut step form kecilnya
  }

  function submitTanpaSurat(e: Event) {
    e.preventDefault();
    // isi otomatis field di form utama
    namaInginDitemui = namaJanji.trim();
    jabatanInginDitemui = jabatanJanji.trim();
    modalOpen = false;
  }
</script>

<!-- HERO (tetap) -->
<section class="relative overflow-hidden">
  <div
    class="absolute inset-0 bg-cover bg-center"
    style="background-image: url('/landingpage-cfk-compress.jpg');"
  ></div>
  <div class="absolute inset-0 bg-black/40"></div>
  <div
    class="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
    style="background-image: radial-gradient(circle at 20% 30%, white 0%, transparent 35%),
                               radial-gradient(circle at 80% 70%, white 0%, transparent 35%);"
  ></div>
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
      Silakan isi data kunjungan untuk keperluan administrasi di <span
        class="font-semibold">{data.companyName}</span
      >.
    </p>
  </div>
</section>

<!-- FORM -->
<main class="container mx-auto px-4 py-10 md:py-14 flex-1">
  <Card class="max-w-3xl mx-auto shadow-sm">
    <CardHeader>
      <CardTitle>Daftar Nama Kunjungan</CardTitle>
      <p class="text-sm text-muted-foreground mt-1">
        Proses pengajuan izin kunjungan mengikuti SOP perusahaan {data.companyName}.<br
        />
        Disarankan mengajukan izin kunjungan minimal 3 hari sebelum jadwal pelaksanaan.<br
        />
      </p>
    </CardHeader>
    <CardContent>
      <form
        class="grid gap-6"
        enctype="multipart/form-data"
        method="POST"
        action="?/permitVisitSave"
      >
        <!-- Instansi -->
        <div class="grid gap-2">
          <Label for="instansi">Perusahaan/Instansi</Label>
          <Input
            id="instansi"
            name="instansi"
            placeholder="Nama Perusahaan/Instansi"
            maxlength={255}
            value={form?.old?.instansi}
            required
            autofocus
          />
          {#if form?.errors?.instansi}
            <p class="text-red-500 text-sm">{form.errors.instansi[0]}</p>
          {/if}
        </div>

        <!-- Agenda -->
        <div class="grid gap-2">
          <Label for="agenda"
            >Keperluan <span class="text-red-500">*</span></Label
          >
          <Input
            id="agenda"
            name="agenda"
            placeholder="Keperluan"
            maxlength={255}
            value={form?.old?.agenda}
            required
          />
          {#if form?.errors?.agenda}
            <p class="text-red-500 text-sm">{form.errors.agenda[0]}</p>
          {/if}
        </div>

        <!-- Data Pengunjung -->
        <div class="border-t pt-3">
          <h3 class="font-semibold mb-2">Data Nama Pengunjung</h3>

          <div class="grid md:grid-cols-2 gap-4 my-2">
            <div class="grid gap-2">
              <Input
                name="nama_pic"
                id="nama_pic"
                value={form?.old?.nama_pic}
                placeholder="Nama Koordinator/PIC"
                maxlength={255}
                required
              />
              {#if form?.errors?.nama_pic}
                <p class="text-red-500 text-sm">{form.errors.nama_pic[0]}</p>
              {/if}
            </div>
            <div class="grid gap-2">
              <Input
                name="no_hp_pic"
                id="no_hp_pic"
                type="tel"
                inputmode="tel"
                value={form?.old?.no_hp_pic}
                placeholder="Nomer Whatsapp PIC (Pengiriman Notifikasi)"
                required
                maxlength={15}
              />
              {#if form?.errors?.no_hp_pic}
                <p class="text-red-500 text-sm">{form.errors.no_hp_pic[0]}</p>
              {/if}
            </div>
          </div>

          {#each tamus as tamu, i}
            <div class="grid md:grid-cols-2 gap-4 my-2">
              <div class="grid gap-2">
                <Input
                  name={`guests[${i}][nama]`}
                  id={`guests[${i}][nama]`}
                  bind:value={tamus[i].nama}
                  placeholder="Anggota Tamu"
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
                  required
                />
              </div>
            </div>
          {/each}

          <div class="mt-4">
            <Button type="button" variant="outline" onclick={tambahTamu}
              >+ Tambah Tamu Lainnya</Button
            >
          </div>
        </div>

        <span class="border-t"></span>

        <!-- Tanggal -->
        <div class="grid md:grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="tanggal_kunjungan"
              >Tanggal & Waktu Masuk <span class="text-red-500">*</span></Label
            >
            <Input
              id="tanggal_kunjungan"
              name="tanggal_kunjungan"
              type="datetime-local"
              value={form?.old?.tanggal_kunjungan}
              required
            />
            {#if form?.errors?.tanggal_kunjungan}
              <p class="text-red-500 text-sm">
                {form.errors.tanggal_kunjungan[0]}
              </p>
            {/if}
          </div>
          <div class="grid gap-2">
            <Label for="tanggal_berakhir"
              >Tanggal Selesai <span class="text-red-500">*</span></Label
            >
            <Input
              id="tanggal_berakhir"
              name="tanggal_berakhir"
              value={form?.old?.tanggal_berakhir}
              type="date"
              required
            />
            {#if form?.errors?.tanggal_berakhir}
              <p class="text-red-500 text-sm">
                {form.errors.tanggal_berakhir[0]}
              </p>
            {/if}
          </div>
        </div>

        <!-- PIC yang ingin ditemui -->
        <div class="border-t pt-3">
          <h3 class="font-semibold mb-2">PIC Yang Ingin Ditemui</h3>
          <div class="grid md:grid-cols-2 gap-4 mb-2">
            <div class="grid gap-2">
              <Label for="nama_ingin_ditemui"
                >Nama <span class="text-red-500">*</span></Label
              >
            </div>
            <div class="grid gap-2">
              <Label for="jabatan_ingin_ditemui"
                >Jabatan/Bagian/Departemen <span class="text-red-500">*</span
                ></Label
              >
            </div>
          </div>
          <div class="grid md:grid-cols-2 gap-4 my-2">
            <div class="grid gap-2">
              <Input
                name="nama_ingin_ditemui"
                id="nama_ingin_ditemui"
                placeholder="Nama"
                bind:value={namaInginDitemui}
                maxlength={255}
                required
              />
              {#if form?.errors?.nama_ingin_ditemui}
                <p class="text-red-500 text-sm">
                  {form.errors.nama_ingin_ditemui[0]}
                </p>
              {/if}
            </div>
            <div class="grid gap-2">
              <Input
                name="jabatan_ingin_ditemui"
                id="jabatan_ingin_ditemui"
                bind:value={jabatanInginDitemui}
                type="text"
                inputmode="text"
                placeholder="Manager ...."
                required
                maxlength={255}
              />
              {#if form?.errors?.nama_ingin_ditemui}
                <p class="text-red-500 text-sm">
                  {form.errors.nama_ingin_ditemui[0]}
                </p>
              {/if}
            </div>
          </div>
        </div>

        <!-- Lampiran -->

        {#if hasOfficialLetter === true}
          <input type="hidden" name="has_ofiicial_latter" value="1" />
          <div class="grid gap-2">
            <Label for="lampiran">
              Unggah Lampiran Surat Resmi (Izin Kunjungan/Surat Tugas)
              <span class="text-red-500">*</span>
            </Label>
            <p class="text-sm text-muted-foreground">Maximal 5MB PDF</p>
            <Input
              id="lampiran"
              name="lampiran"
              type="file"
              accept="application/pdf"
              required
            />
            {#if form?.errors?.lampiran}
              <p class="text-red-500 text-sm">
                {form.errors.lampiran[0]}
              </p>
            {/if}
          </div>
        {:else}
          <input type="hidden" name="has_ofiicial_latter" value="0" />
        {/if}

        <div class="pt-2">
          <Button type="submit" class="w-full md:w-auto">Kirim</Button>
        </div>
      </form>
    </CardContent>
  </Card>
</main>

<!-- ========== MODAL ON LOAD ========== -->
<Dialog bind:open={modalOpen}>
  <DialogContent
    class="sm:max-w-md [&>button:first-of-type]:hidden"
    escapeKeydownBehavior="ignore"
    onInteractOutside={(e) => {
      e.preventDefault();
    }}
  >
    {#if hasOfficialLetter === null}
      <DialogHeader>
        <DialogTitle>Apakah Anda Memiliki Permohonan Surat Resmi?</DialogTitle>
        <DialogDescription>(Izin Kunjungan / Surat Tugas)</DialogDescription>
      </DialogHeader>
      <div class="flex gap-3 justify-end">
        <Button variant="outline" onclick={pilihTidak}>Tidak</Button>
        <Button onclick={pilihIya}>Iya</Button>
      </div>
    {:else if hasOfficialLetter === false}
      <DialogHeader>
        <DialogTitle
          >Apakah sudah buat janji via telpon/pesan singkat?</DialogTitle
        >
        <DialogDescription
          >(Isi detail dibawah ini untuk kami teruskan ke PIC terkait)</DialogDescription
        >
      </DialogHeader>
      <!-- Step lanjutan jika TIDAK -->
      <form class="grid gap-4" onsubmit={submitTanpaSurat}>
        <div class="grid gap-2">
          <Label for="modal_nama"
            >Dengan Siapa <span class="text-red-500">*</span></Label
          >
          <Input
            id="modal_nama"
            bind:value={namaJanji}
            placeholder="Nama"
            required
            maxlength={255}
          />
        </div>

        <div class="grid gap-2">
          <Label for="modal_jabatan"
            >Jabatan/Bagian/Departemen <span class="text-red-500">*</span
            ></Label
          >
          <Input
            id="modal_jabatan"
            bind:value={jabatanJanji}
            placeholder="Manager ..."
            required
            maxlength={255}
          />
        </div>

        <DialogFooter class="mt-2">
          <a href="/out">
            <Button type="button" variant="ghost">Tidak Memiliki janji</Button>
          </a>
          <Button type="submit">Lanjutkan</Button>
        </DialogFooter>
      </form>
    {/if}
  </DialogContent>
</Dialog>
