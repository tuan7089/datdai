<script lang="ts">
  import { onMount } from "svelte";
  import LandFilter from "../components/LandFilter.svelte";
  import { db } from "../lib/firebase";
  import {
    ref,
    onValue,
    increment,
    runTransaction,
    update,
  } from "firebase/database";
  import { writable } from "svelte/store";

  // ////// ////   // // ////////////////// / ///
  //        ĐẾM SỐ LẦN COPY   + REALTIME COPY  //
  //        RESET SỐ COPY MỖI NGÀY            ///
  ////////////////////////// / ///// / ///    / /

  const copyCounts = writable<Record<string, number>>({}); // Biến store ở svelte để đồng bộ khi thay đổi

  function subscribeCopyCounts() {
    // 📡 Lắng nghe dữ liệu copy từ Firebase theo thời gian thực
    const copyRef = ref(db, "copyCount");
    onValue(copyRef, (snapshot) => {
      const value = snapshot.val() || {};
      copyCounts.set(value);
    });
  }

  async function resetCopyCountFromDanhsach() {
    if (!Array.isArray(filteredLands) || filteredLands.length === 0) {
      console.warn(
        "⚠️ Danh sách trống hoặc chưa được khởi tạo – không có gì để reset",
      );
      return;
    }
    const updates: Record<string, number> = {};

    for (const item of filteredLands) {
      updates[`copyCount/${item.id}`] = 0;
    }

    try {
      await update(ref(db), updates);
      alert("Đã reset copyCount cho tất cả item trong danhsach");
    } catch (error) {
      alert("Lỗi khi reset copyCount:");
    }
  }

  // Hàm tăng số lần copy
  async function increaseCopyCount(id: string): Promise<void> {
    const copyRef = ref(db, `copyCount/${id}`);
    await runTransaction(copyRef, (currentCount) => {
      return (currentCount || 0) + 1; // Tăng số lần copy lên 1
    });
  }

  onMount(() => {
    subscribeCopyCounts(); // PHẢI gọi hàm này

    const now = new Date();
    const today = now.toISOString().slice(0, 10); // yyyy-mm-dd
    const lastShown = localStorage.getItem("lastGreetingDate");

    if (lastShown !== today) {
      // chỉ chào 1 lần/ngày và chỉ trong khung 5h - 10h
      resetCopyCountFromDanhsach();

      alert("Chào ngày mới");
      localStorage.setItem("lastGreetingDate", today);
    }
  });

  // ////// ////   // // //////////////////
  //        FILTER                      //
  //                                    //
  ////////////////////////// / ///// / ///
  // State để nhận dữ liệu từ filter
  let filteredLands: any[] = [];
  let currentFilters: any = {};

  // Hàm xử lý khi filter thay đổi
  function handleFilter(event: any): void {
    filteredLands = event.detail.data;
    currentFilters = event.detail.filters;
  }

  // ////// ////   // // //////////////////
  //        ACTION HANDLERS             //
  //                                    //
  ////////////////////////// / ///// / ///
  // Hàm xử lý khi click vào một item
  async function handleCopy(id: string, content: string): Promise<void> {
    // Giả lập hành động copy vào clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content);
      console.log(`Đã sao chép nội dung của item ${id}`);
    } else {
      alert("Clipboard API không được hỗ trợ trên trình duyệt này.");
    }

    await increaseCopyCount(id);
  }

  // Hàm toggle expand/collapse
  function toggleExpand(id: string): void {
    filteredLands = filteredLands.map((item) =>
      item.id === id
        ? { ...item, isExpanded: item.isExpanded ? !item.isExpanded : true }
        : item,
    );
  }
</script>

<main class="bg-gray-50 pt-2">
  <!-- Component Filter -->
  <div class="space-y-2">
    {#if filteredLands.length > 0}
      {#each filteredLands as item (item.price)}
        <div
          class={`border-b border-t ${item.isExpanded ? "bg-purple-50 border-purple-300" : "bg-white border-gray-200"}`}
        >
          <!-- Phần chính -->
          <div class="p-3">
            <div class="flex justify-between items-start">
              <!-- Bên trái: Tiêu đề và phụ đề -->
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="flex-1 pr-3 min-w-0"
                on:click={() => toggleExpand(item.id)}
              >
                <h2 class="text-lg font-semibold text-gray-800 truncate">
                  {item["vị trí"]} - hi {item.id}
                </h2>
                <p class="text-gray-600 text-sm truncate">
                  Giá: {item.price} tỷ VNĐ
                </p>
              </div>

              <!-- Bên phải: Các nút điều khiển theo 2 hàng -->
              <div class="flex flex-col items-end space-y-1">
                <!-- Hàng trên: Nút sao chép với số lần copy -->
                <div class="flex items-center">
                  <span class="text-sm text-gray-500 font-medium min-w-[20px]">
                    <!-- Firebase -->
                    {$copyCounts[item["id"]] ?? "..."}
                  </span>
                  <button
                    on:click={() => handleCopy(item.id, item.detail)}
                    class="flex items-center space-x-1 px-3 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors duration-200"
                  >
                    <!-- Copy Icon -->
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"
                      ></rect>
                      <path
                        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                      ></path>
                    </svg>
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Phần chi tiết khi expand -->
          {#if item.isExpanded}
            <div id="expand-content" class="expand-content p">
              <div class="p-3">
                <!-- <h3 class="text-lg font-semibold text-gray-900 mb-3">Chi tiết lô đất</h3> -->

                <div class="grid grid-cols-2 md:grid-cols-2 gap-3 mb-4">
                  <div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Giá:</span>
                      <span class="font-medium text-green-600"
                        >{item.price} tỷ VNĐ</span
                      >
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Diện tích:</span>
                      <span class="font-medium">{item.acreage}m²</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Giá/m²:</span>
                      <span class="font-medium">{item.price_m2} triệu/m²</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Hướng:</span>
                      <span class="font-medium">{item.direction}</span>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Đường:</span>
                      <span class="font-medium">{item.way}m</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Pháp lý:</span>
                      <span class="font-medium text-green-600"
                        >{item.juridical}</span
                      >
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Liên hệ:</span>
                      <span class="font-medium">0946.958.530</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Trạng thái:</span>
                      <span
                        class="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium"
                        >Còn hàng</span
                      >
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <h4 class="font-medium text-gray-900 mb-2">
                    Mô tả chi tiết:
                  </h4>
                  <p class="text-gray-600 text-sm leading-relaxed">
                    {item.detail}
                  </p>
                </div>

                <div class="flex gap-2 flex-wrap">
                  <span
                    class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >#LôĐất</span
                  >
                  <span
                    class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                    >#BấtĐộngSản</span
                  >
                  <span
                    class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                    >#ĐầuTư</span
                  >
                  <span
                    class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >#SổĐỏ</span
                  >
                </div>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    {:else}
      <div class="no-results">
        <p>Không tìm thấy kết quả phù hợp với bộ lọc của bạn.</p>
      </div>
    {/if}
  </div>

  <!-- <div class="fixed bottom-10 left-0 w-full bg-white shadow-lg z-50">
    Nội dung ở đáy màn hình
  </div> -->

  <LandFilter on:filter={handleFilter} />
</main>

<style>
  /* Custom styles nếu cần */
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition:
      transform 0.2s,
      box-shadow 0.2s;
  }

  .land-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
