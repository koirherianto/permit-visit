<script lang="ts">
  import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
  } from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { CheckCircle, Circle } from "phosphor-svelte"; // ikon status
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  const { permit, guests, approvals, pendisposisi } = data;

  // 🌿 transform ke bentuk timeline
  const steps = [
    { label: "Diajukan oleh " + permit.nama_pic, done: true },
    { label: "Disetujui oleh HSE", done: approvals.length >= 1 },
    { label: "Disetujui oleh GA", done: approvals.length >= 2 },
    { label: "Disetujui oleh Security", done: approvals.length >= 3 },
  ];

  const status =
    approvals.length === 0
      ? "Menunggu Approval HSE"
      : approvals.length === 1
        ? "Menunggu Approval GA"
        : approvals.length === 2
          ? "Menunggu Approval Security"
          : "Sudah Disetujui Semua";
</script>

<main class="container mx-auto px-4 py-12">
  <Card class="max-w-3xl mx-auto shadow-sm">
    <CardHeader>
      <CardTitle>Progres Persetujuan Kunjungan</CardTitle>
    </CardHeader>

    <CardContent class="space-y-8">
      <!-- INFO DASAR -->
      <section class="space-y-1">
        <p><strong>Instansi:</strong> {permit.instansi}</p>
        <p><strong>Agenda:</strong> {permit.agenda}</p>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Token:</strong> {permit.token}</p>
        <p><strong>Nama PIC:</strong> {permit.nama_pic}</p>
        <p>
          <strong>Keterangan Tambahan:</strong>
          {permit.keterangan_tambahan}
        </p>
        <p>
          <strong>Pengajuan Dibuat:</strong>
          {new Date(permit.created_at).toLocaleString()}
        </p>
        <p>
          <strong>Tanggal Mulai Kunjungan:</strong>
          {new Date(permit.tanggal_kunjungan).toLocaleString()}
        </p>
        <p>
          <strong>Tanggal Selesai Kunjungan:</strong>
          {new Date(permit.tanggal_berakhir).toLocaleString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </section>

      <section class="border-t pt-4">
        <h3 class="font-semibold mb-3">Tahapan Persetujuan</h3>

        <div class="relative ml-6">
          <!-- Garis vertikal -->
          <div
            class="absolute left-[8px] top-0 bottom-0 w-[2px] bg-gray-200"
          ></div>

          <ul class="space-y-6">
            {#each Object.entries(permit.progress) as [label, status]}
              <li class="relative flex items-start gap-3 pl-6">
                <!-- Titik bulat / ikon status -->
                <div class="absolute left-0 bg-white">
                  {#if status === "Selesai"}
                    <CheckCircle
                      size={20}
                      weight="fill"
                      class="text-green-500"
                    />
                  {:else if status === "Proses"}
                    <Circle size={20} weight="bold" class="text-yellow-500" />
                  {:else if status === "Ditolak"}
                    <Circle size={20} weight="bold" class="text-red-500" />
                  {:else}
                    <Circle size={20} class="text-gray-400" />
                  {/if}
                </div>

                <!-- Label -->
                <div>
                  <p class="font-medium leading-tight">
                    {#if status === "Selesai"}
                      <span class="text-green-600">{label}</span>
                    {:else if status === "Proses"}
                      <span class="text-yellow-600">{label}</span>
                    {:else if status === "Ditolak"}
                      <span class="text-red-600">{label}</span>
                    {:else}
                      <span class="text-gray-600">{label}</span>
                    {/if}
                  </p>

                  <p class="text-xs mt-0.5">
                    {#if status === "Selesai"}
                      <span class="text-green-500">✔ {status}</span>
                    {:else if status === "Proses"}
                      <span class="text-yellow-500">⏳ {status}</span>
                    {:else if status === "Ditolak"}
                      <span class="text-red-500">❌ {status}</span>
                    {:else}
                      <span class="text-gray-400">{status}</span>
                    {/if}
                  </p>
                </div>
              </li>
            {/each}
          </ul>
        </div>
      </section>

      <!-- TAMU -->
      <section class="border-t pt-4">
        <h3 class="font-semibold mb-2">Daftar Tamu</h3>
        <ul class="list-disc pl-5 text-sm">
          {#each guests as tamu}
            <li>{tamu.nama} ({tamu.no_hp})</li>
          {/each}
        </ul>
      </section>

      <!-- PENDISPOSISI -->
      {#if pendisposisi}
        <section class="border-t pt-4">
          <h3 class="font-semibold mb-2">Pendisposisi</h3>
          <p class="text-sm font-medium">{pendisposisi.employee.nama}</p>
          <p class="text-sm text-gray-500">
            {pendisposisi.department} - {pendisposisi.section}
          </p>
          <p class="text-xs text-gray-400">{pendisposisi.position}</p>
        </section>
      {/if}

      <!-- AKSI -->
      <div class="text-right pt-4">
        <Button
          variant="outline"
          onclick={() => (window.location.href = "/token")}
        >
          Cek Token Lain
        </Button>
      </div>
    </CardContent>
  </Card>
</main>
