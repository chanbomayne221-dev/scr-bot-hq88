// ─── Entry point cho Railway / Production ────────────────────────────────
// Map các tên ENV phổ biến sang tên mà bot đang dùng.
// (Giữ tương thích với code cũ – không đổi logic bên trong bot.ts)
if (process.env.BOT_TOKEN && !process.env.TELEGRAM_BOT_TOKEN) {
  process.env.TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
}
if (process.env.TELEGRAM_TOKEN && !process.env.TELEGRAM_BOT_TOKEN) {
  process.env.TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_TOKEN;
}
if (process.env.ADMIN_ID && !process.env.ADMIN_IDS) {
  process.env.ADMIN_IDS = process.env.ADMIN_ID;
}

import { startBot } from "./bot";
import { logger } from "./lib/logger";

// ── Chống crash 24/7 ────────────────────────────────────────────────────
process.on("uncaughtException", (err) => {
  logger.error({ err }, "uncaughtException");
});
process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "unhandledRejection");
});

const token = process.env.TELEGRAM_BOT_TOKEN ?? process.env.BOT_TOKEN;
if (!token) {
  logger.error(
    "❌ Thiếu biến môi trường BOT_TOKEN (hoặc TELEGRAM_BOT_TOKEN). " +
      "Hãy đặt trong Railway → Variables rồi redeploy."
  );
  process.exit(1);
}

const bot = startBot();
if (!bot) {
  logger.error("Bot không khởi động được.");
  process.exit(1);
}

logger.info("🚀 Bot đang chạy 24/7 bằng polling…");

// ── Graceful shutdown ───────────────────────────────────────────────────
function shutdown(signal: string) {
  logger.info(`Nhận tín hiệu ${signal}, dừng bot…`);
  try {
    bot?.stopPolling();
  } catch {}
  process.exit(0);
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
