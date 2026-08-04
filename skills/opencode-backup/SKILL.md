---
name: opencode-backup
description: 備份 opencode 設定（含 MCP 伺服器）到 GitHub 儲存庫 — 說「備份設定」「備份 MCP」「備份到 GitHub」「opencode-backup」時載入
---

# opencode 設定（含 MCP）GitHub 備份

## 用途
將本機 opencode 設定（`opencode.json` / `opencode.jsonc`，含 MCP 伺服器清單與環境變數）備份至 GitHub 儲存庫，作為設定檔版本控制與跨機還原之用。

## 目標儲存庫
- `https://github.com/ymguan3-boop/audit-assistant-skills.git`
- 備份檔存放於倉庫 `config-backup/` 目錄

## 來源設定檔
| 檔案 | 說明 |
|------|------|
| `%USERPROFILE%\.config\opencode\opencode.json` | 主要設定（含 MCP 伺服器） |
| `%USERPROFILE%\.config\opencode\opencode.jsonc` | 次要設定（若有） |
| `%USERPROFILE%\.config\opencode\skills\` | 本機技能目錄（可選） |

## 執行步驟

### Step 1 — 檢查來源設定
確認上述設定檔存在；不存在則回報使用者。

### Step 2 — 準備暫存 clone
```powershell
$tmp = "$env:TEMP\opencode\audit-assistant-skills"
git clone https://github.com/ymguan3-boop/audit-assistant-skills.git $tmp
# 若已存在則改為 git pull
```

### Step 3 — 複製設定檔
將來源設定檔複製至 `$tmp\config-backup\`。

### Step 4 — 產生備份清單 manifest
產生 `$tmp\config-backup\manifest.json`，內容含：
- `backup_at`：ISO 時間戳
- `source`：來源路徑
- `mcp_servers`：從 opencode.json 解析出的 MCP 伺服器名稱清單
- `files`：各檔案名稱與 SHA256 雜湊

### Step 5 — 安全檢查（重要）
push 前檢查設定檔內容，**不得**提交任何 API Key / Token / 密碼：
- 搜尋 `sk-`、`Bearer `、`AKIA`、`api_key`、`secret`、`password`、`token` 等模式
- 若 `mcp.*.environment` 含機敏值，以 `<REDACTED>` 取代後才提交
- 未通過檢查則中止並通知使用者

### Step 6 — 更新 README
更新 `$tmp\README.md`：
- 「技能一覽」表格補上 opencode-backup 列
- 「其他技能」區段確認存在

### Step 7 — 提交並推送
```powershell
cd $tmp
git add -A
git commit -m "config-backup: 備份 opencode 設定（含 MCP）"
git push origin main
```

### Step 8 — 回報
回報 commit hash 與備份結果。

## 注意事項
- 每次備份前先 `git pull`，避免與遠端衝突
- 機敏值一律遮蔽後才提交
- 若不需要備份 skills 目錄，可省略 Step 3 的 skills 複製
