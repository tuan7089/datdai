<script lang="ts">
  import { listKhach, listDat } from '../lib/sheet';
import { setCache } from '../lib/localcache';

export async function syncKhachHangFromSheet() {
  // const data = await listKhach('KhachHang!A2:D');
  // setCache('KhachList', data);
}

export async function syncDanhSachDatFromSheet() {
  const data = await listDat();
  setCache('DatList', data);
  alert("Lấy dữ liệu thành công")
}


  let appVersion: string = "1.0.0";
  function clearData() {
    if (confirm("Bạn có chắc muốn xóa toàn bộ dữ liệu đã lưu trên máy?")) {
      localStorage.clear();
      alert("Đã xóa dữ liệu cache.");
    }
  }
</script>

<div class="p-4 pb-20">
  <h1 class="text-xl font-bold mb-4">Cài đặt</h1>
  <ul class="space-y-3">
    <li>
      <button
        on:click={clearData}
        class="text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center border"
      >
        <img width="30" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABd0lEQVR4nO2WsU6EQBCG5z1sjYX3AhasYqml5gpNeAOls1KSszC5J7DRxtIYX8prNfGaAwnwG1bRHMJyBJZdL/Mnf8UU/7ezMwsRi8ViFYKgCQShwVP6x+FhBAL+/iF8dwbfxUCe4Wz3oEeAQcND+tx96RMAJkwMUFKLIe1k0iUGEAzQTQwgGKCb1h4g87bRRw2ZAEjuAsRRiPT6tLYmvTpGHC6QPNzYBZDk4eP4yzUQRfiiTgVBQwJk3mgpmHS4QBqMf8MH48qazBuZB5ABL4/+BvzuRPnkf75NTuzogBoikmHbhIfJLVQJ0TI8TL8DEqJ86rk/opXCwzhAfufrABQrFjYAVA5sxWBbCZBWbpuaIW6AoKEBVKtStWJhA8B6PGS3F42rstyJ9D6wowNLEA17voBQhQf/Tiu0yg7vw6RLDCAYoJsgaK4dwKF3fQAOPQ/QgSedAFtw6FVj+Dfs0aY2AAmxQxtw6LHn6zTPT157eBaLRdbpE3eQb6N7yFfqAAAAAElFTkSuQmCC" alt="delete-forever">
        <span>Xoá dữ liệu ở máy</span>
      </button>
    </li>
    <li>
      <button
        on:click={syncDanhSachDatFromSheet}
        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
      >
        <svg
          class="fill-current w-4 h-4 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          ><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg
        >
        <span>Tải dữ liệu đất về</span>
      </button>
    </li>
    <li class="bg-white rounded-lg shadow p-4">
      📱 Phiên bản: <strong>{appVersion}</strong>
    </li>
  </ul>
</div>
