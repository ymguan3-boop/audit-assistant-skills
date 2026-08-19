# 常用指令與金鑰速查

## 本機開發（無須伺服器）

```bash
# Node.js 靜態伺服器
npx serve . -l 3000

# Python
python -m http.server 3000
```

開啟 `http://localhost:3000` 測試（大螢幕）與 `http://localhost:3000/mobile.html?room=pic-test01`（手機端）。

## 部署

```bash
# 初始化並推送到 GitHub
git init
git add .
git commit -m "initial"
git branch -M main
git remote add origin https://github.com/<帳號>/<儲存庫>.git
git push -u origin main
```

1. GitHub → Settings → Pages → Source: **GitHub Actions**
2. push 到 `main` 自動部署 → `https://<帳號>.github.io/<儲存庫>/`

## 金鑰取得

| 服務 | 網址 | 用途 |
|------|------|------|
| Ably | https://ably.com/signup | WSS 443 中繼，免費 75 萬則/月 |
| Gemini | https://aistudio.google.com/apikey | AI 主持猜測，免費額度 |

Ably Key 填到兩端 `js/main-screen.js` 與 `js/mobile.js` 的 `ABLY_KEY`。
Gemini Key 由使用者在大螢幕左側面板輸入（存 localStorage）。

## 測試技巧（CDP 自動化）

用 headless Chrome + DevTools Protocol 驗證（無需人工）：

```powershell
# 啟動 headless Chrome（先停舊的）
Get-Process chrome | Stop-Process -Force
Remove-Item -LiteralPath "$env:TEMP\opencode\chrome-profile2" -Recurse -Force -ErrorAction SilentlyContinue
Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  -ArgumentList "--headless=new --remote-debugging-port=9222 --user-data-dir=$env:TEMP\opencode\chrome-profile2 --no-first-run about:blank"

# 用 node 連 CDP (ws://localhost:9222)
# 開大螢幕 → 讀取 window.__roomId → 開 mobile.html?room=... → 檢查狀態/列表
```

### 驗證清單（上線前）
- [ ] 大螢幕「等待玩家加入」+ QR Code 顯示
- [ ] 手機「已連線」徽章
- [ ] 大螢幕玩家列表「1 位玩家連線中」
- [ ] 畫作送出 → 畫廊卡片 → AI 猜測結果
- [ ] 關手機 → 列表即時清空
- [ ] 畫作 30 秒淡出 / 超過 6 幅移除最舊
- [ ] 部署後 `?v=N` 遞增，無快取舊碼

## 中文編碼安全指令

```powershell
# 安全寫法（含 BOM UTF8，不破壞中文）
$c = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)
$c = $c -replace '\?v=\d+', '?v=8'
[System.IO.File]::WriteAllText($f, $c, (New-Object System.Text.UTF8Encoding $true))

# JS 語法檢查
node --check js/main-screen.js
node --check js/mobile.js
```

## 版本號管理

每次改版後遞增所有資源的 `?v=N`：
```powershell
$files = @("index.html","mobile.html")
foreach ($f in $files) {
  $c = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)
  $c = $c -replace '\?v=\d+', '?v=<新版本號>'
  [System.IO.File]::WriteAllText($f, $c, (New-Object System.Text.UTF8Encoding $true))
}
```
