export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
    .then(() => alert('Đã sao chép!'))
    .catch(err => alert('Lỗi khi sao chép'));
}