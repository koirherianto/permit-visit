<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import type { LayoutProps } from "./$types";

  let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
  <link rel="icon" href={data.favicon} type="image/svg+xml" />
</svelte:head>

<div class="min-h-screen flex flex-col bg-gradient-to-b from-white to-slate-50">
  <!-- HEADER -->
  <header class="w-full bg-white/90 backdrop-blur border-b">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <a href="/">
          <img src={data.logoCompany} alt={data.companyName} class="h-9 w-9" />
        </a>
        <span class="font-semibold text-slate-800">{data.companyName}</span>
      </div>
      <nav class="hidden md:flex items-center gap-6 text-sm text-slate-600">
        <a href="/token" class="hover:text-slate-900"
          >Periksa Pengajuan Kunjungan Tamu</a
        >
      </nav>
    </div>
  </header>
  {@render children?.()}

  <footer class="py-6 text-center text-sm text-slate-500">
    © 2024 - {new Date().getFullYear()}
    {data.companyName}
  </footer>
</div>
