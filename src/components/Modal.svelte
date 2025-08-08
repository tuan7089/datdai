<script lang="ts">
  export let title: string = '';
  export let isOpen: boolean = false;
  export let onClose: () => void = () => {};
</script>

{#if isOpen}
  <div class="fixed inset-15 bg-black/40 flex items-end z-50">
    <div class="bg-white w-full rounded-t-2xl p-5 shadow-lg animate-slide-up">
      <div class="flex justify-between items-center mb-3">
        <h2 class="font-bold text-lg">{title}</h2>
        <button class="text-gray-600" on:click={onClose}>✕</button>
      </div>
      <slot />
    </div>
  </div>
{/if}

<style>
  @keyframes slide-up {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
  .animate-slide-up { animation: slide-up 0.25s ease-out; }
</style>
