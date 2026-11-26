# Phrase Notes

Ứng dụng ghi chú Anh–Việt chạy trên trình duyệt, lưu tài liệu trong IndexedDB của máy.

## Chạy local

```sh
npm install
npm run dev
```

Mở http://127.0.0.1:5173. Dùng cùng địa chỉ và trình duyệt để mở lại tài liệu; dữ liệu của `localhost` và `127.0.0.1` là hai vùng lưu trữ riêng. Sau khi cài dependencies, ứng dụng không cần tài nguyên mạng. Dùng Xuất JSON để sao lưu.

`npm run build` kiểm tra TypeScript và tạo bản build; `npm test` chạy kiểm thử.

## Phạm vi hiện tại

Hỗ trợ tạo tài liệu, chọn và tô cụm từ, tối đa ba ghi chú theo vị trí, tìm cụm bằng bàn phím, dịch, lưu tự động, xử lý xung đột và nhập/xuất JSON. Ghi chú ngắn được đặt gần cụm từ; khi không đủ chỗ, nội dung đầy đủ vẫn có trong bảng bên. Việc xếp nhãn nâng cao, sửa nguồn trước vùng tô đầu tiên và kiểm thử trình duyệt/cảm ứng chưa hoàn tất.

## Đánh giá bằng Gemini

Tạo API key Gemini, đặt `GEMINI_API_KEY` trong môi trường máy chủ (hoặc tệp `.env.local` không được chia sẻ), sau đó chạy lại `npm run dev`. Chọn **Đánh giá với Gemini** trong tài liệu để gửi văn bản gốc và các cụm đã tô cùng ghi chú đến Google. Kết quả được lưu cùng tài liệu; cụm chưa có nghĩa nhận gợi ý. Gemini có thể sai, nên hãy kiểm tra lại nhận xét. Trên Site, cấu hình `GEMINI_API_KEY` như một secret trên hosting trước khi triển khai. Tính năng cần kết nối Internet và có thể phát sinh phí API.

## Thiết lập Firebase

1. Tạo một Firebase project, đăng ký ứng dụng Web và tạo Cloud Firestore.
2. Bật Google trong Authentication → Sign-in method; thêm tên miền chạy ứng dụng vào Authentication → Settings → Authorized domains.
3. Sao chép `.env.example` thành `.env.local` và điền bốn giá trị `VITE_FIREBASE_*` từ cấu hình Firebase Web. Không đưa service account hoặc private key vào ứng dụng.
4. Áp dụng nội dung `firestore.rules` trong Firestore → Rules trước khi sử dụng. Mỗi tài khoản chỉ được đọc và ghi tài liệu của chính mình.
5. Chạy `npm install` và `npm run dev`, đăng nhập bằng Google. Ở thư viện, chọn **Chuyển tài liệu từ trình duyệt này** để sao chép dữ liệu IndexedDB cũ lên tài khoản; dữ liệu gốc không bị xóa. Dữ liệu trên origin khác cần được xuất JSON rồi nhập lại.

Firestore cần kết nối mạng để lưu transaction. Chưa tự động chuyển dữ liệu từ Site thử nghiệm hoặc từ trình duyệt/origin khác.

## Shadowing

Mở tài liệu rồi chọn **Luyện shadowing** để tạo bài luyện từ chính các câu tiếng Anh trong tài liệu; Gemini dịch từng câu sang tiếng Việt. Bài được lưu trong Firestore theo tài liệu và tài khoản. Mở bài để nghe từng câu hoặc lần lượt, thay đổi tốc độ/giọng, ẩn nghĩa và tự ghi âm. Giọng mẫu dùng giọng tổng hợp trên thiết bị; bản ghi âm nằm trong phiên, không được đồng bộ. Micro cần HTTPS hoặc localhost.

Trong **Cài đặt Gemini**, người dùng có thể lưu nhiều API key, đặt tên và chọn key đang dùng. Nếu gọi lỗi, chọn key khác và thử lại; ứng dụng không tự động thử lại. Các key được lưu trong trình duyệt trên thiết bị của mình. Key không đồng bộ giữa các thiết bị và có thể được đọc bởi người có quyền truy cập trình duyệt; chỉ dùng thiết bị tin cậy. Khi gửi yêu cầu, key đi qua máy chủ ứng dụng tới Gemini. Trước khi dùng bài shadowing, cập nhật Firestore Rules theo `firestore.rules` để cho phép tài khoản truy cập bộ sưu tập shadowing của chính mình. Cần chạy máy chủ ứng dụng cho `/api/shadowing`; bản static preview Vite không cung cấp API này. Hosting cần HTTPS và có endpoint Worker tương ứng.

### Audio Gemini cho Shadowing

Thêm `VITE_FIREBASE_STORAGE_BUCKET` vào `.env.local` hoặc `.env` bằng tên bucket trong Firebase Console, bật Cloud Storage for Firebase, và áp dụng `storage.rules` cùng `firestore.rules` trước khi tạo bài. Khởi động lại server sau khi đổi cấu hình. Gemini tạo một file WAV cho toàn bộ tài liệu bằng model TTS và giọng Orus (có hướng dẫn phát âm Mỹ); file được lưu ở Storage của tài khoản. Mốc đầu/cuối câu được ước lượng theo độ dài văn bản và khoảng lặng, có thể chỉnh thủ công khi luyện. Mỗi tài liệu hỗ trợ tối đa 6.000 ký tự khi tạo audio. Nội dung tạo sinh có thể khác biệt về giọng và phát âm. Việc gọi Gemini TTS và sử dụng Storage có thể phát sinh chi phí hoặc cần gói thanh toán phù hợp. Bài cũ dùng giọng thiết bị cần tạo lại để có audio Gemini. API key và nội dung được gửi tới Google khi tạo bài.
