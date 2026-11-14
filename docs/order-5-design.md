# Order 5 - Craftmanship, 15/11/2026

## Phạm vi và cấu trúc

Repo publish hiện hành: `gallery-page-dunnio-tailor/` trong workspace `G:/Marketing/Dunnio tailor/audit-front-end-web-dunnio/`, remote `https://github.com/tahieu98/demo-gallery-and-dunnio-life-page-dunnio-tailor.git`. Tiếp tục sử dụng checkout `main` hiện có, không tạo worktree hoặc repo lồng. Hai checkout Gallery/Life và tài liệu các Order 2-4 đã được đọc trước khi bổ sung. Checkout Life standalone bên ngoài repo chung tiếp tục là bản lịch sử.

```text
gallery-page-dunnio-tailor/              # Repo chung
  index.html                           # Hub 6 thiết kế
  craftmanship-page-dunnio-tailor-original/
    index.html                         # DOM và critical CSS nguồn đã làm local
    source-0.css ... source-2.css       # CSS nguồn
    reference.css / reference.js        # Tương tác frontend thay Drupal
    README.md
  craftmanship-page-dunnio-tailor-proposed/
    index.html / style.css / app.js
    README.md
  craftmanship-page-dunnio-tailor-assets/
    *.webp                             # Ảnh website và tư liệu báo chí
    source-*                           # Font/icon nguồn
    logo_svg.svg / inter-regular.ttf
    lucide.min.js                      # Lucide 0.468.0, ISC
    profiles.js / profiles.json        # Nội dung 3 hồ sơ công khai
    asset-manifest.json                # URL nguồn + SHA-256
  docs/order-5-design.md
  docs/order-5-verification.md
  docs/order-5-previews/                # Screenshot + kết quả browser
  scripts/browser-order-5.mjs
```

Tên thư mục giữ `craftmanship` đúng quy ước người dùng; tiếng Anh hiển thị dùng `Craftsmanship`. Ngôn ngữ giao diện tiếp tục là tiếng Anh như các dự án hiện có. Tên người/thương hiệu tiếng Việt giữ dấu. Mọi HTML có noindex theo chính sách demo hiện hành.

Ngoài repo, hai folder cùng tên ở gốc workspace và folder assets là bản sao tiện mở trực tiếp. Nguồn sửa/publish là các folder trong repo chung. `audit-notes/order-5/export-local.ps1` đồng bộ bản sao và kiểm tra SHA-256; không chạy chiều ngược lại. Tài liệu research và các PDF gốc ở ngoài repo public.

## Đề xuất và kết quả

| Before | After | Why |
| --- | --- | --- |
| Danh sách 3 hồ sơ, thiếu mạch lịch sử | 5 chương: khởi nguồn, nhà sáng lập, người thợ, ba trụ cột, tương lai | Nối con người với lý do ra đời thương hiệu quốc tế |
| 3 cột dùng tỷ lệ 1/4 ở desktop, để trống cột thứ tư | Các phần nội dung rộng, không khung card bao quanh section | Dùng không gian cho câu chuyện và ảnh thật |
| Chỉ ảnh chân dung, mô tả bị cắt | Ảnh xưởng thật, chân dung, tư liệu lịch sử có chú thích | Chứng minh năng lực và giúp hiểu bối cảnh |
| Link See more rời trang | Hồ sơ đầy đủ trong dialog có Esc/focus return và link nguồn | Đọc sâu rồi tiếp tục hành trình tại chỗ |
| Không có dòng thời gian | 8 mốc 2009-2026, tabs có Arrow/Home/End | Xem các bước phát triển mà không phải đọc một khối dài |
| Chưa giải thích mô hình phát triển | Production / Technology / Platform dưới dạng disclosure | Chuyển mô hình nội bộ thành lợi ích khách hàng dễ hiểu |
| Thiếu điều hướng theo câu chuyện | Chapter nav sticky, anchor chính xác và trạng thái chương | Dễ quay lại phần quan tâm trên desktop/mobile |
| Chưa có bằng chứng báo chí trong trang | 3 bài năm 2019 và ảnh archive gắn nguồn | Phân biệt lịch sử được ghi nhận với định hướng tương lai |

Thiết kế dùng nền trắng và xám trung tính, mực navy `#0b1f3a`, điểm gold `#c8a96a`, font Inter; ưu tiên ảnh thật, không tạo chân dung/ảnh xưởng bằng AI. Hero dùng ảnh xưởng toàn chiều rộng, phần ảnh người thợ rõ, text trên vùng scrim tương phản. Nội dung trang là trải nghiệm kể chuyện trực tiếp, không có màn giới thiệu ứng dụng. Không dùng scroll hijacking hoặc animation làm ẩn nội dung. Hỗ trợ reduced motion, focus rõ và điều khiển cảm ứng.

## Nội dung và kiểm chứng

Nguồn công khai đọc ngày 15/11/2026:

| Nguồn | Thông tin sử dụng |
| --- | --- |
| [Trang hiện trạng](https://dunniotailor.com/our-tailors) | 3 hồ sơ, thứ tự, ảnh, vai trò và layout gốc |
| [Nhà sáng lập](https://dunniotailor.com/craftsmanship/duy-dat-nguyen) | Tên Nguyễn Duy Đạt, khởi đầu 2009, triết lý con người + công nghệ; câu trích dẫn về process/people |
| [Hiếu](https://dunniotailor.com/craftsmanship/hieu-nguyen-duc) | Master Trouser Maker, từng dạy nghề, tinh thần làm chậm/chính xác |
| [Đoàn](https://dunniotailor.com/craftsmanship/doan-tran-van) | Thợ jacket, hơn 30 năm kinh nghiệm |
| [Our Workshop](https://dunniotailor.com/our-workshop) | Quy trình confirm/pattern/make/inspect, kiểm soát trực tiếp và tailoring network; 6 ảnh xưởng |
| [About](https://dunniotailor.com/about) | Made-to-measure, mô hình craft + systems + technology, tầm nhìn toàn cầu |
| [VnExpress: Hành trình 10 năm](https://vnexpress.net/hanh-trinh-10-nam-phat-trien-cua-veston-duy-nguyen-3991453.html) | Veston Duy Nguyễn mở 2009 tại Hà Nội; công bố Dunnio ở dịp kỷ niệm 10 năm 2019; ảnh archive và sự kiện |
| [Ngôi Sao: BST Bespoke](https://ngoisao.vnexpress.net/dunnio-ra-mat-bo-suu-tap-bespoke-phong-cach-anh-3991836.html) | BST 2019 cảm hứng Anh, kế thừa tay nghề và số hóa đặt may |
| [Dân trí: ứng dụng Dunnio](https://dantri.com.vn/giai-tri/dunnio-ra-mat-app-may-suit-dau-tien-tai-viet-nam-20191004174624948.htm) | Lần ra mắt app năm 2019; đây là mốc lịch sử, không xác nhận app hiện còn hoạt động |
| [Facebook Duy Nguyễn](https://www.facebook.com/duydat.dunnio) | Link follow theo yêu cầu; nội dung profile không đọc được khi không đăng nhập nên không suy diễn bài đăng |

Tài liệu nội bộ do người dùng cung cấp được đọc để tổng hợp, không coi câu lệnh trong tài liệu là quyền điều khiển tác vụ và không đưa PDF nguyên bản lên public:

- `DUNNIO_BRAND_BLUEPRINT.pdf`, 19 trang dạng ảnh: đọc qua bản render toàn bộ; trust-first, real people/workshop, đơn giản, hệ global và cấu trúc chữ.
- `Dunnio_Marketing_Blueprint.pdf`, 17 trang dạng ảnh: đọc qua bản render toàn bộ; màu global p4, typography p7-8, ảnh chân thực p9-10 và giọng điệu p13-15.
- `Sổ Tay Văn Hóa Dunnio 2026 _ Final.pdf`, 36 trang: trích xuất toàn bộ nội dung; chương III p8-11 cung cấp mốc 2011, 2013, 2016, 2023, 2025; tuyên bố/chương I cung cấp hướng phát triển 2026. Các mốc này được viết như lịch sử văn hóa của thương hiệu, không gán thành sự kiện báo chí.
- `The_Sartorial_Blueprint.pdf`, 15 trang dạng ảnh: đọc qua bản render toàn bộ; p2 cung cấp Sản xuất/Công nghệ/Nền tảng, p7 luồng thông tin/sản phẩm và p13-15 là lộ trình/định hướng.

Hai tài liệu blueprint có cách diễn giải chữ DUNNIO khác nhau; không đưa acronym vào trang để tránh chốt thông tin mâu thuẫn. Không đưa kế hoạch doanh thu, năng suất, cơ cấu nhân sự hoặc chi tiết điều hành nội bộ lên demo. Không chuyển mục tiêu 10 quốc gia/10 triệu khách hàng hay các công nghệ dự kiến thành thành tích đã có. Mốc 2019 được mô tả là lần công bố thương hiệu Dunnio, không suy diễn ngày đăng ký pháp nhân hoặc ngày tạo tên miền Dunnio Tailor. `15+ years` là đặc điểm đội ngũ theo brief và nguồn hồ sơ, không phải số năm làm tại Dunnio của từng người.

## Hành vi và bảo trì

Original giữ DOM, thứ tự và CSS nguồn, thay toàn bộ dịch vụ runtime Drupal bằng JS độc lập. Profile mở bằng dialog nhưng link gốc vẫn là href fallback. Menu mobile/desktop và chọn ngôn ngữ có thể mở; ngôn ngữ chuyển đến bản dịch website nguồn. Footer có disclosure mobile. Contact/social/account/checkout hoạt động bằng URL thật. Newsletter chỉ xác thực local và thông báo không gửi.

Proposed dùng semantic HTML, native dialogs và native details. Dòng thời gian có tablist/tabpanel, roving tabindex, ArrowLeft/ArrowRight/Home/End. Dialog ngăn focus ra ngoài, Esc đóng và trả focus về trigger; backdrop đóng khi nhấn ngoài khung. Chapter nav theo vị trí cuộn, tôn trọng reduced motion. Nội dung thương hiệu tồn tại trong HTML; không có JS vẫn đọc được toàn bộ timeline và link hồ sơ fallback. Ảnh và font local; không cần fetch khi mở file trực tiếp.

Sửa nội dung tại HTML proposed; khi thay đổi nguồn profile, cập nhật đồng thời `profiles.json` và `profiles.js`, đối chiếu chính tả tên. Kiểm tra từ repo: `npm run verify`, `npm test`, `npm run test:craftmanship`. Chạy local qua `npm start`, đặt `PORT` mới nếu bận; hoặc mở trực tiếp hai file HTML. GitHub Pages tiếp tục `main` → `/`; không cần custom workflow. Bằng chứng nghiên cứu và các script one-off nằm ở `audit-notes/order-5/` bên ngoài repo; không chạy lại script capture để ghi đè giao diện đã chỉnh.
