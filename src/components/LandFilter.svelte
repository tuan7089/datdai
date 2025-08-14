<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { getCache } from "../lib/localcache";

  // Event dispatcher để gửi dữ liệu filter ra component cha
  const dispatch = createEventDispatcher();

  // Filter state
  let searchText: string = "";
  let selectedPrice: string = "";
  let selectedArea: string = "";

  // Dữ liệu mẫu cho các options
  const priceRanges: any[] = [
    { value: "", label: "Tất cả mức giá" },
    { value: "0-1", label: "Dưới 1 tỷ" },
    { value: "1-3", label: "1 - 3 tỷ" },
    { value: "3-5", label: "3 - 5 tỷ" },
    { value: "5-10", label: "5 - 10 tỷ" },
    { value: "10+", label: "Trên 10 tỷ" },
  ];

  const areas: any[] = [
    { value: "", label: "Tất cả khu vực" },
    { value: "ha-noi", label: "Hà Nội" },
    { value: "ho-chi-minh", label: "TP. Hồ Chí Minh" },
    { value: "da-nang", label: "Đà Nẵng" },
  ];

  // Dữ liệu mẫu danh sách đất
  const landData = getCache("DatList");
  // const landData: any[] = [
  //   {
  //     id: 1,
  //     title: "Đất nền dự án Golden City",
  //     price: 2.5,
  //     area: "binh-duong",
  //     size: 120,
  //     address: "Đường Mỹ Phước Tân Vạn, Bến Cát, Bình Dương",
  //     type: "đất nền",
  //     direction: "Đông Nam",
  //     juridical: "Sổ đỏ",
  //   },
  // ];

  // Filtered data
  let filteredData: any[] = landData;

  // Hàm filter dữ liệu
  function filterData(): void {
    filteredData = landData.filter((land: any) => {
      // Filter theo search text
      const matchesSearch =
        searchText === "" ||
        land.address.toLowerCase().includes(searchText.toLowerCase()) ||
        land.area.toLowerCase().includes(searchText.toLowerCase());

      // Filter theo giá
      const matchesPrice =
        selectedPrice === "" || checkPriceRange(land.price, selectedPrice);

      // Filter theo khu vực
      const matchesArea = selectedArea === "" || land.area === selectedArea;

      return matchesSearch && matchesPrice && matchesArea;
    });

    // Dispatch event với dữ liệu đã filter
    dispatch("filter", {
      data: filteredData,
      filters: {
        search: searchText,
        price: selectedPrice,
        area: selectedArea,
      },
    });
  }

  // Hàm kiểm tra khoảng giá
  function checkPriceRange(price: number, range: string): boolean {
    switch (range) {
      case "0-1":
        return price < 1;
      case "1-3":
        return price >= 1 && price < 3;
      case "3-5":
        return price >= 3 && price < 5;
      case "5-10":
        return price >= 5 && price < 10;
      case "10+":
        return price >= 10;
      default:
        return true;
    }
  }

  // Reset filters
  function resetFilters(): void {
    searchText = "";
    selectedPrice = "";
    selectedArea = "";
    filteredData = landData;

    dispatch("filter", {
      data: filteredData,
      filters: {
        search: "",
        price: "",
        area: "",
      },
    });
  }

  // Reactive statements để tự động filter khi có thay đổi
  $: if (
    searchText !== undefined ||
    selectedPrice !== undefined ||
    selectedArea !== undefined
  ) {
    filterData();
  }
</script>

<div class="fixed bottom-10 left-0 w-full bg-white shadow-lg z-50">
  <div class="flex items-center gap-1 p-3">
      <!-- Search input -->
      <div class="flex-2 filter-item">
        <label for="search">{filteredData.length} / {landData.length}</label>
        <input
          id="search"
          type="text"
          bind:value={searchText}
          placeholder="Nhập từ khóa tìm kiếm..."
          class="search-input"
        />
      </div>

      <!-- Price select -->
      <div class="flex-1 filter-item">
        <label for="price">Mức giá:</label>
        <select id="price" bind:value={selectedPrice} class="filter-select">
          {#each priceRanges as priceRange}
            <option value={priceRange.value}>{priceRange.label}</option>
          {/each}
        </select>
      </div>

      <!-- Area select -->
      <div class="flex-1 filter-item">
        <label for="area">Khu vực:</label>
        <select id="area" bind:value={selectedArea} class="filter-select">
          {#each areas as area}
            <option value={area.value}>{area.label}</option>
          {/each}
        </select>
      </div>

      <!-- Reset button -->
      <div class="flex-1 filter-item">
        <label for="Reset">Reset</label>
        <button on:click={resetFilters} class="bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded flex items-center justify-center"> <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24"><path d="M22.719 12A10.719 10.719 0 0 1 1.28 12h.838a9.916 9.916 0 1 0 1.373-5H8v1H2V2h1v4.2A10.71 10.71 0 0 1 22.719 12z"/><path fill="none" d="M0 0h24v24H0z"/></svg> </button>
      </div>
  </div>
</div>

<style>
  .filter-container {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .filter-title {
    margin: 0 0 15px 0;
    color: #333;
    font-size: 18px;
    font-weight: 600;
  }

  .filter-row {
    display: flex;
    gap: 15px;
    align-items: end;
    flex-wrap: wrap;
  }

  .filter-item {
    display: flex;
    flex-direction: column;
    min-width: 150px;
  }

  .filter-item label {
    margin-bottom: 5px;
    font-weight: 500;
    color: #555;
    font-size: 14px;
  }

  .search-input,
  .filter-select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    background: white;
    transition: border-color 0.2s;
  }

  .search-input:focus,
  .filter-select:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  .search-input {
    width: 250px;
  }

  .filter-select {
    width: 180px;
  }

  .reset-btn {
    padding: 8px 16px;
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .reset-btn:hover {
    background: #5a6268;
  }

  .results-summary {
    margin-top: 15px;
    padding: 10px 0;
    color: #666;
    font-size: 14px;
    border-top: 1px solid #eee;
  }

  @media (max-width: 768px) {
    .filter-row {
      flex-direction: column;
      align-items: stretch;
    }

    .filter-item {
      min-width: auto;
    }

    .search-input,
    .filter-select {
      width: 100%;
    }
  }
</style>
