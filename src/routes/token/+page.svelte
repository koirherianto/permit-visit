<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
  } from "$lib/components/ui/card/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { enhance } from "$app/forms";
  import type { PageProps } from "./$types";
  import { Copy } from "phosphor-svelte";
  let { data, form }: PageProps = $props();

  const isNewToken = !!data.tokenBaru;
  let token = $state(data.tokenBaru || "");
  let copied = $state(false);

  async function salinToken() {
    if (token.trim() === "") return;
    await navigator.clipboard.writeText(token);
    copied = true;
    alert("Token disalin ke clipboard!");
    setTimeout(() => (copied = false), 1500);
  }
</script>

<main class="container mx-auto px-4 py-16 flex flex-col items-center">
  <Card class="max-w-md w-full shadow-sm">
    <CardHeader>
      <CardTitle>Masukkan Token Kunjungan</CardTitle>
    </CardHeader>
    <CardContent>
      <form method="POST" use:enhance class="grid gap-4">
        <div class="grid gap-2">
          <Label for="token">Token</Label>
          <Input
            id="token"
            name="token"
            bind:value={token}
            placeholder="Masukkan token (contoh: ABC123)"
            maxlength={11}
            required
          />
        </div>

        <!-- Pesan Error -->
        {#if form?.error}
          <div
            class="bg-red-50 border border-red-200 text-red-600 rounded-md px-3 py-2 text-sm"
          >
            {form.error}
          </div>
        {/if}
        <Button type="submit" class="w-full mt-4">Lihat Progres</Button>
        {#if isNewToken}
          <Button
            type="button"
            variant="outline"
            class="w-full mt-1 flex items-center justify-center gap-2"
            onclick={salinToken}
          >
            <Copy size={18} />
            {#if copied}
              ✅ Token Disalin
            {:else}
              Salin Token
            {/if}
          </Button>
        {/if}
      </form>
    </CardContent>
  </Card>
</main>
