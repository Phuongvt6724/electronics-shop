export function formatVNDPrice(price) {
  return price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}
