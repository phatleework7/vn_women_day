# Website Chúc Mừng 20/10 - Lâm Thanh Vy

Website chúc mừng ngày Phụ nữ Việt Nam 20/10 với hiệu ứng trái tim 3D particles.

## Tính năng

- ❤️ Trái tim 3D được tạo từ 3000+ particles màu hồng
- ✨ Hiệu ứng sao và ánh sáng lung linh
- 🔄 Text xoay tròn với lời chúc
- 🖱️ Tương tác với chuột (di chuyển chuột để xoay trái tim)
- 📱 Responsive trên mobile và desktop
- 🎨 Hiệu ứng glow và pulse đẹp mắt

## Cách sử dụng

### Mở trực tiếp
1. Mở file `index.html` bằng trình duyệt web

### Chạy với local server (khuyến nghị)
```bash
# Sử dụng Python 3
python3 -m http.server 8000

# Hoặc sử dụng Python 2
python -m SimpleHTTPServer 8000

# Hoặc sử dụng Node.js
npx serve
```

Sau đó truy cập: `http://localhost:8000`

## Công nghệ sử dụng

- **Three.js** - Tạo hiệu ứng 3D particles
- **HTML5 Canvas** - Render đồ họa
- **CSS3 Animations** - Hiệu ứng text và glow
- **Vanilla JavaScript** - Logic và tương tác

## Tùy chỉnh

### Thay đổi tên
Chỉnh sửa trong file `index.html`:
```html
<h2 class="name">Lâm Thanh Vy</h2>
```

### Thay đổi lời chúc
Chỉnh sửa trong file `script.js`, hàm `createCircularText()`:
```javascript
Chúc Vy ngày 20.10 luôn xinh đẹp thật hạnh phúc ✨
```

### Thay đổi màu trái tim
Chỉnh sửa trong file `script.js`, hàm `createHeartParticles()`:
```javascript
colors[i * 3] = 1.0;     // Red (0-1)
colors[i * 3 + 1] = 0.4; // Green (0-1)
colors[i * 3 + 2] = 0.7; // Blue (0-1)
```

## Trình duyệt hỗ trợ

- ✅ Chrome/Edge (khuyến nghị)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## License

MIT License - Free to use and modify

# vn_women_day
