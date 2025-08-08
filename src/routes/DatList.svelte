<script lang="ts">
  import { onMount } from "svelte";
  import type { Dat } from "../types";
  import { getCache } from "../lib/localcache";

  import { db } from "../lib/firebase";
  import {
    ref,
    onValue,
    increment,
    runTransaction,
    update,
  } from "firebase/database";
  import { writable } from "svelte/store";

  export const copyCounts = writable<Record<string, number>>({}); // Biến store ở svelte để đồng bộ khi thay đổi

  export function subscribeCopyCounts() {
    // 📡 Lắng nghe dữ liệu copy từ Firebase theo thời gian thực
    const copyRef = ref(db, "copyCount");
    onValue(copyRef, (snapshot) => {
      const value = snapshot.val() || {};
      copyCounts.set(value);
    });
  }

  async function resetCopyCountFromDanhsach() {
    if (!Array.isArray(danhSach) || danhSach.length === 0) {
      console.warn(
        "⚠️ Danh sách trống hoặc chưa được khởi tạo – không có gì để reset",
      );
      return;
    }
    const updates: Record<string, number> = {};

    for (const item of danhSach) {
      updates[`copyCount/${item.id}`] = 0;
    }

    try {
      await update(ref(db), updates);
      alert("Đã reset copyCount cho tất cả item trong danhsach");
    } catch (error) {
      alert("Lỗi khi reset copyCount:");
    }
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

  // Đếm giá trị và cập nhật lên firebase
  export function increaseCopyCount(id: string) {
    const itemRef = ref(db, `copyCount/${id}`);
    return runTransaction(itemRef, (current) => (current || 0) + 1);
  }

  let danhSach: Dat[] = getCache<Dat>("DatList");

  async function handleCopy(id: string, text: string) {
    const item = danhSach.find((item) => item.id === id);
    // Giả lập copy vào clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }

    await increaseCopyCount(id);
  }

  function toggleExpand(id) {
    danhSach = danhSach.map((item) =>
      item.id === id
        ? { ...item, isExpanded: item.isExpanded ? !item.isExpanded : true }
        : item,
    );
  }
</script>

<div class="bg-gray-50 min-h-screen pt-2">
  <!-- <h1 class="text-2xl font-bold text-gray-800 p-3 bg-white border-b">
    Danh sách bài viết
  </h1> -->

  <div class="space-y-2">
    {#each danhSach as item (item.id)}
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
                Giá: {item["Giá"]}
              </p>
            </div>

            <!-- Bên phải: Các nút điều khiển theo 2 hàng -->
            <div class="flex flex-col items-end space-y-1">
              <!-- Hàng trên: Nút sao chép với số lần copy -->
              <div class="flex items-center">
                <span class="text-sm text-gray-500 font-medium min-w-[20px]">
                  <!-- {item.copyCount} -->
                  {$copyCounts[item["id"]] ?? "..."}
                </span>
                <button
                  on:click={() => handleCopy(item.id, item["Mô tả chi tiết"])}
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
                      >{item["Giá"]} tỷ VNĐ</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Diện tích:</span>
                    <span class="font-medium">{item["Diện tích"]}m²</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Giá/m²:</span>
                    <span class="font-medium">{item["Giá/m²"]} triệu/m²</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Hướng:</span>
                    <span class="font-medium">{item["Hướng"]}</span>
                  </div>
                </div>

                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Đường:</span>
                    <span class="font-medium">{item["Đường"]}m</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Pháp lý:</span>
                    <span class="font-medium text-green-600"
                      >{item["Pháp lý"]}</span
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
                <h4 class="font-medium text-gray-900 mb-2">Mô tả chi tiết:</h4>
                <p class="text-gray-600 text-sm leading-relaxed">
                  {item["Mô tả chi tiết"]}
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
  </div>
</div>

<style>
  /* Custom styles nếu cần */
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
