---
name: shutdown
description: 收工自動同步 — 說「收工」「下班」「結束」時載入
---

當使用者說「收工」時，依序執行：
1. 專案 Git 同步（commit + push，等使用者確認 commit 訊息）
2. chezmoi 同步（`~/.config/opencode/` 或共用 dotfiles 設定變動）
3. 敏感檔案提醒（API key 等）
4. Obsidian 更新（補「最近更動紀錄」）
5. 最終 checklist 回報
