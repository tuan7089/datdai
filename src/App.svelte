<script lang="ts">
  import { currentPath } from './lib/router';
  import { derived } from 'svelte/store';
  import DatList from './routes/DatList.svelte';
  import CaiDat from './routes/CaiDat.svelte';
  import Nav from './components/Nav.svelte';

  const routes: Record<string, typeof DatList> = {
    '/': DatList,
    // '/khach': KhachList,
    '/cai-dat': CaiDat
  };

  const Page = derived(currentPath, ($path) => routes[$path] ?? DatList);
</script>     


<div class="flex flex-col min-h-screen">
  <!-- Main content -->
  <main class="overflow-y-auto h-[calc(100vh-8rem)]">
    <!-- Nội dung chính của bạn ở đây -->
     <svelte:component this={$Page} />
  </main>

  <!-- Bottom navigation cố định -->
  <!-- <nav class="fixed bottom-0 left-0 right-0 h-16 bg-white border-t"></nav> -->
   <Nav />
</div>