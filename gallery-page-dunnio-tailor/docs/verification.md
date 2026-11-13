> This report records the earlier standalone verification. For current combined-site paths and hosting status, see [hosting verification](../../docs/hosting-verification.md).

# Kiểm chứng — Style Gallery

Ngày 12/11/2026, trên thiết bị hiện tại. Bản local: http://127.0.0.1:4173/gallery-page-dunnio-tailor/

## Dữ liệu và tài nguyên

- PASS: 28 ID và tên ảnh duy nhất; file WebP/thumbnail đầy đủ; dọc/ngang/vuông khớp kích thước ảnh nguồn.
- PASS: tất cả tham chiếu tài nguyên nội bộ trong HTML/CSS tồn tại; ảnh, logo, font chạy local.
- PASS: JavaScript kiểm tra cú pháp bằng node --check; không có lỗi console trên các trang đã kiểm tra.

## Trình duyệt

| Kiểm tra | Kết quả |
| --- | --- |
| Bản gốc: 25 ảnh ban đầu, tải thêm khi cuộn / See more | PASS: đủ 28 ảnh |
| Bản gốc: menu và lightbox | PASS |
| Bản gốc: newsletter | PASS: kiểm tra email; thông báo rõ demo không gửi đăng ký |
| Bản cải tiến: đếm tổng và nhóm màu/khung hình | PASS |
| Bộ lọc kết hợp và tìm kiếm | PASS |
| Desktop 1280 px | PASS: nội dung và lưới hiển thị đúng |
| Mobile 390 × 844 px | PASS: lưới hai cột, menu dialog, không tràn ngang |
| Trình xem trên mobile | PASS: dialog rộng 390 px |
| Metadata tải ảnh và đường dẫn file | PASS: file có thật, tên chứa màu và khung hình |

Trình xem dùng chung đã kiểm tra: trước/sau, giới hạn đầu/cuối, phím End/Esc, zoom, thumbnail, phát/dừng slideshow, sao chép liên kết, deep link đến ảnh và trả focus khi đóng. Với Gallery còn kiểm tra ảnh yêu thích giữ qua reload, bỏ lưu ở trạng thái chỉ xem ảnh đã lưu, tìm kiếm `den` không dấu, trạng thái rỗng và reset. Với Dunnio Life kiểm tra nhóm Hồng 3 ảnh, kết hợp portrait và tìm suit, sắp xếp màu A–Z.

**Giới hạn xác minh:** Fullscreen API bị trình duyệt kiểm thử từ chối; nút hiển thị thông báo thay thế và gallery tiếp tục hoạt động. Fullscreen chỉ hoạt động khi môi trường trình duyệt cho phép. Chưa kiểm tra cử chỉ vuốt trên thiết bị cảm ứng vật lý. Không gọi dịch vụ gửi newsletter, checkout hay đăng nhập thực tế.

Ảnh kiểm chứng: [Desktop](preview-desktop.jpg), [Mobile](preview-mobile.jpg), [Bản gốc](reference-desktop.jpg). Ảnh mobile được cắt phần đầu của screenshot toàn trang để dễ xem.


## English interface validation — 12 November 2026

- PASS: English navigation, filters, captions, alt text, accessibility labels and viewer messages in both versions.
- PASS: all 78 image filenames use English outfit colors and orientations; source provenance and stable photo IDs are retained.
- PASS: Gallery color + portrait + search filters return 1 matching villa photo; saved-photo feedback and copy-link feedback use English.
- PASS: Dunnio Life pink + shirt search returns 2 photos; empty results and reset display English copy.
- PASS: original reference viewers show English captions and controls for both collections.
- PASS: desktop 1280 px and mobile 390 × 844 px have no horizontal overflow. Mobile filters have visible labels and complete selected option names.
- PASS: refreshed desktop, mobile and reference screenshots.
