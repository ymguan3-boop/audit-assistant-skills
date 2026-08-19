---
name: startup
description: 開工自動同步 — 說「開工」「我來了」「上次做到哪」時載入
---

當使用者說「開工」時，依序執行：
1. 確認工作目錄是否在 GDrive git repo
2. 讀 Obsidian 工作筆記的「上次做到哪」與「下一步」
3. 檢查本地 git status
4. 檢查遠端有無新 commit
5. 給結構化摘要與建議下一步

**原則**：開工只讀不寫。
