<script lang="ts">
  // Import component LandFilter
  import LandFilter from '../components/LandFilter.svelte';

  // State để nhận dữ liệu từ filter
  let filteredLands: any[] = [];
  let currentFilters: any = {};

  // Hàm xử lý khi filter thay đổi
  function handleFilter(event: any): void {
    filteredLands = event.detail.data;
    currentFilters = event.detail.filters;
    
    console.log('Dữ liệu đã lọc:', filteredLands);
    console.log('Bộ lọc hiện tại:', currentFilters);
  }
</script>

<main>
  <div class="container">
    <h1>Danh sách đất đai</h1>
    
    <!-- Component Filter -->
    <LandFilter on:filter={handleFilter} />
    
    <!-- Hiển thị kết quả -->
    <div class="results-container">
      {#if filteredLands.length > 0}
        <div class="land-grid">
          {#each filteredLands as land}
            <div class="land-card">
              <h3 class="land-title">{land.title}</h3>
              <div class="land-info">
                <p><strong>Giá:</strong> {land.price} tỷ VND</p>
                <p><strong>Diện tích:</strong> {land.size} m²</p>
                <p><strong>Địa chỉ:</strong> {land.address}</p>
                <p><strong>Loại:</strong> {land.type}</p>
                <p><strong>Hướng:</strong> {land.direction}</p>
                <p><strong>Pháp lý:</strong> {land.juridical}</p>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="no-results">
          <p>Không tìm thấy kết quả phù hợp với bộ lọc của bạn.</p>
        </div>
      {/if}
    </div>
  </div>
</main>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
  }

  .results-container {
    margin-top: 20px;
  }

  .land-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .land-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .land-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .land-title {
    color: #007bff;
    margin: 0 0 15px 0;
    font-size: 18px;
    font-weight: 600;
  }

  .land-info p {
    margin: 8px 0;
    color: #666;
    font-size: 14px;
  }

  .land-info strong {
    color: #333;
  }

  .no-results {
    text-align: center;
    padding: 40px;
    color: #666;
    background: #f8f9fa;
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    .land-grid {
      grid-template-columns: 1fr;
    }
  }
</style>