<script lang="ts">
  import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
  } from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  // contoh struktur data dari API
  data.visit = {
    instansi: "Politeknik Negeri Samarinda",
    agenda: "Studi lapangan mahasiswa",
    status: "Menunggu Approval HSE",
    steps: [
      { label: "Diajukan", done: true },
      { label: "Disetujui HSE", done: false },
      { label: "Disetujui GA", done: false },
      { label: "Disetujui Security", done: false },
    ],
  };
</script>

<main class="container mx-auto px-4 py-12">
  <Card class="max-w-3xl mx-auto shadow-sm">
    <CardHeader>
      <CardTitle>Progres Persetujuan Kunjungan</CardTitle>
    </CardHeader>

    <CardContent class="space-y-6">
      <div>
        <p><strong>Instansi:</strong> {data.visit.instansi}</p>
        <p><strong>Agenda:</strong> {data.visit.agenda}</p>
        <p><strong>Status:</strong> {data.visit.status}</p>
        <p><strong>Token:</strong> {data.token}</p>
      </div>

      <div class="border-t pt-4">
        <h3 class="font-semibold mb-3">Tahapan Persetujuan</h3>

        <ul class="space-y-2">
          {#each data.visit.steps as step, i}
            <li class="flex items-center gap-2">
              {#if step.done}
                <span class="inline-block w-3 h-3 bg-green-500 rounded-full"
                ></span>
                <span class="text-green-600">{step.label}</span>
              {:else}
                <span class="inline-block w-3 h-3 bg-gray-300 rounded-full"
                ></span>
                <span class="text-gray-600">{step.label}</span>
              {/if}
            </li>
          {/each}
        </ul>
      </div>

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
