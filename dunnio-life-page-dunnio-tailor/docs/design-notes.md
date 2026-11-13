# Quy tắc thiết kế — Dunnio Life

| Trước | Sau | Lý do |
| --- | --- | --- |
| Masonry ưu tiên lấp khoảng trống | Nhóm màu trang phục, rồi Dọc → Ngang → Vuông | Dễ tìm và so sánh outfit cùng màu |
| Tên ảnh kỹ thuật | dunnio-life-outfit-{color}-{orientation}-{order}.webp | Dễ quản lý, truy ngược |
| Thiếu mô tả | Alt, chủ thể, màu, kích thước | Tìm kiếm, tiếp cận và biên tập |
| Không có công cụ khám phá | Chip màu, tìm kiếm, bộ lọc, lưu ảnh, đếm | Giảm thời gian tìm cảm hứng |
| Thumbnail bị crop theo style nguồn | Lưới contain, lightbox toàn ảnh | Giữ trọn trang phục |
| Tiêu đề Gallery chung | Tiêu đề riêng cho mỗi bộ sưu tập | Định vị nội dung rõ ràng |

## Quy tắc phân loại

1. Dùng màu áo khoác / trang phục phần thân trên của nhân vật chính.
2. Ảnh cưới ưu tiên chú rể, không lấy màu váy cô dâu hoặc trung bình cả đoàn.
3. Ảnh nhóm không rõ chủ thể được ghi chú trong CSV để chủ sở hữu có thể hiệu chỉnh.
4. Navy / xanh dương / xanh lá / olive và trắng / kem / be là các nhóm riêng. Ánh sáng có thể ảnh hưởng sắc độ.
5. Khung hình tính từ kích thước ảnh lớn, không dùng thumbnail crop: rộng > cao là ngang, cao > rộng là dọc, bằng nhau là vuông.
6. Giữ order, originalName và ID ổn định để truy ngược đúng ảnh.
7. Thứ tự mặc định: bảng màu cố định, rồi dọc/ngang/vuông, rồi thứ tự nguồn. Các tùy chọn sắp xếp đổi thứ tự nhóm màu, không trộn lại thành masonry.

## Thị giác và tương tác

Giữ logo, Afacad và Garamond của Dunnio. Nền ngà, mực xanh đậm, đường chia mảnh, khoảng trắng và tiêu đề serif. Không thêm review hoặc cam kết thương mại chưa có nguồn. Hero dùng ảnh hiện có; nội dung chính phân nhóm bên dưới.

Mobile dùng lưới hai cột, chip màu cuộn ngang, menu dialog. Có focus, trạng thái pressed, reduced motion. Ảnh yêu thích lưu tại trình duyệt theo từng bộ sưu tập. URL có bộ lọc khi chạy HTTP; #photo=<id> mở ảnh trực tiếp.

## Ranh giới bản tham chiếu

Giữ CSS, crop thumbnail, header/footer và trình tự nguồn. JavaScript Drupal/Fancybox thay bằng JavaScript độc lập để chạy local, với các thao tác gallery tương ứng. Newsletter mô phỏng có xác thực email; chức năng backend mở website gốc. Đây là bản tham chiếu frontend, không phải bản sao hệ thống Drupal. Nút “Xem bản cải tiến” thêm để đối chiếu.

## Bảo trì

Chỉnh metadata tại assets/image-data.js, đồng bộ CSV/JSON. Giữ ID khi đổi màu hoặc tên ảnh. original/ là mốc tham chiếu. Script và snapshot tái tạo nằm trong audit-notes ở local cạnh hai dự án.

Hướng dẫn tham khảo: ui-ux-pro-max-skill và emilkowalski/skills/skills/emil-design-eng trong bộ skill người dùng cung cấp.


English is the default interface language for both the original reference and proposed design, including filters, image captions, accessibility labels and viewer messages. Image files use English color and orientation names; original source names and URLs are retained for provenance.
