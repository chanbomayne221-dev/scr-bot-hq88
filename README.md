# HQ88 VUA TRÒ CHƠI – Telegram Bot (Railway 24/7)

Bot Telegram chạy bằng **polling** (KHÔNG dùng webhook), deploy 1-click lên Railway.

## ✅ Tính năng đã giữ nguyên 100%
- Toàn bộ commands, callback, menu, format tin nhắn, emoji.
- Game: Tài Xỉu, XX, Slot, Basketball, Jackpot.
- Hệ thống cược, tỷ lệ, VIP, referral, admin panel.
- Database SQLite (tự tạo, tự migrate).

## 🚀 Deploy lên Railway

1. Push repo này lên GitHub.
2. Vào [railway.app](https://railway.app) → **New Project → Deploy from GitHub**.
3. Vào tab **Variables**, thêm:
   - `BOT_TOKEN` – token bot lấy từ [@BotFather](https://t.me/BotFather)
   - `ADMIN_ID` – ID Telegram của bạn (số, có thể nhiều, cách bằng dấu phẩy)
   - (tuỳ chọn) `DB_PATH=/app/data/bot.sqlite`
4. Vào tab **Settings → Volumes**, mount 1 volume vào `/app/data` (để DB không mất khi redeploy).
5. Railway tự chạy:
   ```
   npm install && npm run build
   npm start
   ```

## 🖥️ Chạy local

```bash
cp .env.example .env   # điền BOT_TOKEN, ADMIN_ID
npm install
npm run build
npm start
```

## 📂 Cấu trúc

```
src/
  index.ts          # entry – đọc ENV, start polling
  bot.ts            # toàn bộ logic bot (giữ nguyên)
  lib/
    db.ts           # SQLite, tự tạo file & thư mục
    logger.ts       # logger đơn giản
    bot-instance.ts # share instance bot
assets/             # ảnh QR nạp tiền (qr_nap_tien.png)
data/               # SQLite file (tự sinh)
package.json
tsconfig.json
Procfile
railway.json
```

## 🔐 ENV hỗ trợ

| Tên              | Bắt buộc | Ghi chú                                            |
|------------------|----------|----------------------------------------------------|
| `BOT_TOKEN`      | ✅        | Cũng chấp nhận `TELEGRAM_BOT_TOKEN`                |
| `ADMIN_ID`       | ✅        | Cũng chấp nhận `ADMIN_IDS`. Ví dụ: `123,456`       |
| `DB_PATH`        | ❌        | Mặc định `./data/bot.sqlite`                       |
| `LOG_LEVEL`      | ❌        | `debug` / `info` / `warn` / `error`                |

## 🛡️ 24/7 & chống crash
- `uncaughtException` / `unhandledRejection` được log thay vì chết process.
- Railway `restartPolicy: ALWAYS` (tối đa 10 lần liên tiếp).
- Polling tự reconnect khi mạng Telegram lỗi.
- Graceful shutdown SIGINT / SIGTERM.
