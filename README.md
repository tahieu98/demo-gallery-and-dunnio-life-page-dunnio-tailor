# Style Gallery — Dunnio Tailor

Bộ demo HTML/CSS/JavaScript gồm **bản gốc tham chiếu** và **bản đề xuất cải tiến**. Thu thập ngày 12/11/2026 (Asia/Bangkok), lấy đủ ảnh từ tất cả các trang phân trang.

## Xem trên thiết bị

Mở `index.html` trực tiếp để chọn phiên bản. Hoặc dùng Node.js:

```sh
npm start
```

Không cần npm install. Trên Windows có thể nhấp đúp `start-local.cmd`; dừng bằng Ctrl+C.

- Chọn phiên bản: http://127.0.0.1:4173/gallery-page-dunnio-tailor/
- Bản gốc: http://127.0.0.1:4173/gallery-page-dunnio-tailor/original/index.html
- Bản cải tiến: http://127.0.0.1:4173/gallery-page-dunnio-tailor/improved/index.html

Đặt hai repo cạnh nhau với tên thư mục `gallery-page-dunnio-tailor` và `dunnio-life-page-dunnio-tailor` để chuyển giữa hai bộ sưu tập khi chạy local. Cổng mặc định 4173; có thể đặt biến PORT.

## Cấu trúc

| Thư mục / file | Nội dung |
| --- | --- |
| original/ | DOM và CSS tham chiếu, masonry, tải thêm ảnh |
| improved/ | Bản cải tiến: nhóm màu và khung hình |
| assets/images/ | WebP đổi tên theo màu trang phục và khung hình |
| assets/reference-thumbnails/ | Thumbnail gốc giữ đúng crop nguồn |
| assets/site/ | Logo, font, icon lưu local |
| assets/image-data.js | Metadata chạy được cả file:// và HTTP |
| assets/lightbox.* | Trình xem ảnh dùng chung |
| docs/image-catalog.csv | Tên trước/sau, chủ thể, màu, kích thước, URL nguồn |
| docs/image-manifest.json | Metadata dùng để tích hợp |
| docs/design-notes.md | Quy tắc phân loại và quyết định UX/UI |
| docs/verification.md | Kết quả kiểm tra |
| scripts/verify.mjs | Kiểm tra dữ liệu và tài nguyên |

## Chức năng

Bản gốc giữ header, breadcrumb, footer, thứ tự ảnh, crop thumbnail và masonry responsive. Hiện 25 ảnh đầu, tự nạp phần còn lại khi cuộn hoặc nhấn See more. Menu, thông tin liên hệ và liên kết về website nguồn hoạt động.

Bản cải tiến có lọc màu, lọc ảnh dọc/ngang/vuông, tìm có dấu hoặc không dấu, sắp xếp nhóm, đếm kết quả, xóa bộ lọc, trạng thái rỗng, lưu ảnh yêu thích trên trình duyệt và URL giữ bộ lọc.

Cả hai bản có xem ảnh lớn, trước/sau, phím mũi tên, Home/End, Esc, zoom, fullscreen khi trình duyệt cho phép, slideshow, thumbnail, tải ảnh và sao chép liên kết đến ảnh. Dialog native khóa focus và trả focus về ảnh vừa mở khi đóng.

**Phạm vi:** các trang thương mại, đăng nhập, checkout, liên hệ thực tế mở website Dunnio. Newsletter chỉ kiểm tra email và thông báo rõ không gửi đăng ký. Bộ chọn ngôn ngữ mở bản dịch trang nguồn trực tuyến. Không sao chép backend Drupal, đơn hàng hoặc dịch vụ dịch máy. Bộ sưu tập dùng hoàn toàn tài nguyên local, không có tracker.

## Dữ liệu ảnh

28 ảnh / 11 màu. Ảnh ngang: 10, Ảnh dọc: 17, Ảnh vuông: 1.

Ảnh cưới lấy trang phục chú rể; ảnh đông người ghi chú chủ thể trong CSV. Phân loại màu bằng xem ảnh, không lấy màu nền. Kích thước gốc giữ trong metadata. WebP tối đa 1920 px, không upscale. Bản cải tiến dùng object-fit: contain trong lưới và giữ tỉ lệ gốc trong lightbox. Ảnh nguồn nhỏ không được tự phục hồi chi tiết.

Ví dụ: `gallery-outfit-black-landscape-001.webp`. Hai phiên bản dùng chung bộ ảnh để tiết kiệm dung lượng.

## Kiểm tra

```sh
npm run verify
node --check improved/app.js
node --check original/reference.js
node --check assets/lightbox.js
```

## GitHub và chi phí

Repo giữ riêng tư, Actions tắt, Pages không bật. Source lưu bằng Git, không upload artifact, không dùng Git LFS. Bốn trang ở hai repo dùng khoảng 25 MiB mã và tài nguyên, không cần runner hay CI. GitHub Free không cung cấp Pages cho repo private; nếu cần URL công khai sau này, chọn static hosting hoặc cân nhắc visibility/plan riêng.

Nguồn: https://dunniotailor.com/gallery.html . Hình ảnh, font, logo và CSS tham chiếu thuộc website nguồn; demo phục vụ đối chiếu thiết kế.


English is the default interface language for both the original reference and proposed design, including filters, image captions, accessibility labels and viewer messages. Image files use English color and orientation names; original source names and URLs are retained for provenance.
