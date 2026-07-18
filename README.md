# 25041644 - Nguyễn Ngọc Bảo Hoà

Portfolio học phần **Công nghệ số và AI**, được chỉnh trực tiếp từ source `web-development-portfolio`.

## Nội dung chính

- Trang chủ theo concept **Hành trình qua ngôn ngữ và khung hình**.
- Khu vực **Dự án** hiển thị đủ 6 bài tập dưới dạng card có thể bấm.
- Mỗi bài có một trang HTML riêng trong thư mục `projects/`.
- Nội dung từng bài được trình bày theo mạch của PDF gốc: chữ ở trên, ảnh liên quan ở ngay dưới.
- Bảng trong tài liệu được dựng lại bằng bảng HTML.
- Font ưu tiên `Be Vietnam Pro` và `Noto Serif`, kèm fallback an toàn cho tiếng Việt và chữ Hán.
- Workflow GitHub Pages nằm tại `.github/workflows/static.yml`.

## Chạy thử

```bash
npm ci
npm run dev
```

## Kiểm tra bản production

```bash
npm run build
npm run preview
```

## Deploy GitHub Pages

1. Push source lên nhánh `main`.
2. Vào **Settings → Pages**.
3. Chọn **GitHub Actions** tại mục Source.
4. Workflow sẽ cài dependency, build Vite và deploy thư mục `dist`.
