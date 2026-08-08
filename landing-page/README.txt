PHOTOCOPY THÙY LINH — HƯỚNG DẪN SỬ DỤNG TRANG WEB
==================================================

1. MỞ WEBSITE
-------------
Giải nén thư mục, bấm đúp vào file index.html. Trang chạy ngay trên trình duyệt,
không cần cài đặt gì thêm, không cần chạy lệnh build.

Cấu trúc thư mục:
  landing-page/
    index.html
    assets/css/style.css
    assets/js/main.js
    assets/images/        (đang trống — xem IMAGE-SOURCES.txt)
    IMAGE-SOURCES.txt
    README.txt

2. ĐỔI SỐ ĐIỆN THOẠI VÀ ZALO
---------------------
Mở index.html bằng Notepad hoặc VS Code, dùng Tìm & Thay thế (Ctrl+H):
  - Thay "0382 968 318"  -> số mới, viết dạng dễ đọc (dùng cho phần hiển thị)
  - Thay "tel:0382968318" -> "tel:0" + số mới VIẾT LIỀN, không dấu cách
  - Thay "https://zalo.me/0382968318" -> link Zalo mới
  - Trong khối schema ở phần <head>, sửa "+84382968318" thành +84 + số mới bỏ số 0 đầu
Số điện thoại cũng xuất hiện trong assets/js/main.js (phần câu hỏi thường gặp và
thông báo của form) — thay tương tự.

3. ĐỔI ĐỊA CHỈ
--------------
Tìm & Thay thế trong index.html:
  - "Phố Me, Xã Tam Dương, Tỉnh Phú Thọ"
  - Và trong khối schema ở <head>: streetAddress, addressLocality, addressRegion.

4. THAY LOGO
------------
Hiện tại logo đang là ô chữ "TL" tạm thời vì chưa nhận được file logo.
Sau khi có file:
  a) Đặt logo vào assets/images/logo.png (hoặc .webp). Giữ nguyên nền trong suốt nếu có.
  b) Trong index.html, tìm 2 chỗ có nội dung >TL< (một ở thanh điều hướng, một ở footer)
     và thay cả thẻ <span ...>TL</span> bằng:
       <img src="assets/images/logo.png" alt="Logo Photocopy Thùy Linh" width="46" height="46" style="border-radius:12px">
  c) Đặt favicon: cắt logo thành ảnh vuông 512x512, lưu assets/images/favicon.png.
Logo ở thanh điều hướng đã được bọc trong thẻ <a href="#top"> nên bấm vào là về đầu trang.

5. THAY ẢNH
-----------
Trang đang dùng 3 ảnh bạn gửi, đã chuyển sang WebP và đặt trong assets/images/:
  hero-photocopy.webp, gallery-dong-gay-lo-xo.webp, gallery-ho-so-dong-quyen.webp
Muốn đổi ảnh nào, chỉ cần ghi đè file cùng tên (giữ nguyên tên là không phải sửa code).

Còn 1 khung sọc trống trong phần "Hình ảnh tại tiệm" chờ ảnh mặt tiền tiệm. Cách thay:
  - Đặt file vào assets/images/gallery-mat-tien.webp
  - Thay cả khối <div class="stripe" ...>...</div> bằng:
      <img src="assets/images/gallery-mat-tien.webp" alt="Mặt tiền tiệm Photocopy Thùy Linh ở Phố Me"
           width="600" height="800" loading="lazy" decoding="async"
           style="width:100%;height:auto;aspect-ratio:3/4;object-fit:cover;border-radius:14px;border:1px solid #DCD2C0">
  - Ảnh nằm dưới màn hình đầu dùng loading="lazy"; riêng ảnh hero dùng fetchpriority="high".
  - Luôn viết alt mô tả đúng nội dung ảnh.
Chi tiết nguồn từng ảnh và các ảnh đã bị loại: xem IMAGE-SOURCES.txt.

6. ĐƯA WEBSITE LÊN HOSTING
--------------------------
Netlify (nhanh nhất): vào app.netlify.com/drop, kéo thả cả thư mục landing-page.
Vercel: vercel.com -> Add New Project -> Deploy thư mục này.
GitHub Pages: đẩy thư mục lên một repository, vào Settings -> Pages -> chọn nhánh main.
Hosting thường (cPanel/FTP): tải toàn bộ nội dung thư mục vào public_html.

Sau khi có tên miền, mở index.html và thay chuỗi
"https://VUI-LONG-THAY-BANG-TEN-MIEN-CUA-BAN/" bằng địa chỉ thật (xuất hiện ở
thẻ canonical, Open Graph, Twitter Card và khối schema).

7. NỐI FORM VỚI GOOGLE SHEETS HOẶC API
--------------------------------------
Hiện form đang chạy CHẾ ĐỘ DEMO: kiểm tra dữ liệu nhập, báo trạng thái, chống bấm
nhiều lần — nhưng KHÔNG gửi dữ liệu đi đâu và có thông báo nói rõ điều đó.

Mở assets/js/main.js, ở gần đầu file có:

    const FORM_CONFIG = { endpoint: "", method: "POST" };

Điền URL vào endpoint là form chuyển sang gửi thật (JSON, method POST).

Cách làm với Google Sheets:
  1. Tạo Google Sheet mới, thêm hàng tiêu đề: time | name | phone | service | note
  2. Extensions -> Apps Script, dán:

     function doPost(e) {
       var data = JSON.parse(e.postData.contents);
       SpreadsheetApp.getActiveSheet().appendRow([
         new Date(), data.name, data.phone, data.service, data.note
       ]);
       return ContentService.createTextOutput(JSON.stringify({ok: true}))
              .setMimeType(ContentService.MimeType.JSON);
     }

  3. Deploy -> New deployment -> Web app
     Execute as: Me. Who has access: Anyone.
  4. Copy URL /exec dán vào endpoint ở trên.

8. TRƯỚC KHI XUẤT BẢN — VIỆC CẦN LÀM
------------------------------------
  [ ] Thay logo thật và favicon (hiện đang là ô chữ "TL" tạm thời).
  [ ] Bổ sung ảnh chụp thật mặt tiền tiệm cho khung sọc còn trống.
  [ ] Cân nhắc chụp lại ảnh tiệm bằng điện thoại để thay 3 ảnh minh hoạ hiện tại —
      ảnh thật của tiệm thuyết phục hơn hẳn.
  [ ] Rà lại danh sách dịch vụ, bỏ mục tiệm chưa làm.
  [ ] Xóa khối "Khu vực đánh giá khách hàng" hoặc thay bằng đánh giá thật —
      tuyệt đối không tự viết lời khách.
  [ ] Bổ sung giờ mở cửa (chưa có trên trang vì chưa nhận được dữ liệu).
  [ ] Bổ sung link Facebook / Google Maps nếu có (vị trí đã ghi chú sẵn trong phần Liên hệ).
  [ ] Kiểm tra lại phần "Hồ sơ đấu thầu và hoàn công" xem có đúng những việc tiệm nhận không.
  [ ] Thay tên miền placeholder trong <head>.
  [ ] Nối endpoint cho form, hoặc bỏ hẳn form nếu chỉ muốn nhận cuộc gọi.
