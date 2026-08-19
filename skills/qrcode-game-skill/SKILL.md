---
name: qrcode-game-skill
description: QR Code 互動遊戲系統建置 — 大螢幕展示 + 手機掃碼互動（繪畫/問答/投票/派對遊戲），使用 Ably Realtime 中繼穿透防火牆、QRCode.js 進房、Canvas 觸控繪圖、Gemini AI 主持，部署至 GitHub Pages。說「做 QR 遊戲」「QR Code 互動遊戲」「掃碼遊戲」「qrcode-game」「QR-code-GameSkill」「製作掃碼互動遊戲」時載入。
---

# QR Code 互動遊戲技能（QR-code-GameSkill）

將「AI-Pictionary 猜猜看」已驗證成功的做法，萃取成可重用的 QR Code 互動遊戲建置流程。
透過手機掃碼進入遊戲、與大螢幕即時互動，全程免後端、可穿透公司/5G 防火牆、免費部署於 GitHub Pages。

## 核心架構（成功關鍵）

```
┌─────────────────┐   QR Code 內含 ?room=pic-xxxxxx   ┌─────────────────┐
│  大螢幕 index.html │ ◀──────────────────────────────▶ │  手機 mobile.html │
│  Ably host 端      │     Ably Realtime (WSS:443)      │  Ably client 端    │
│  QRCode.js 產生 QR │   channel: pictionary-<room>     │  Canvas 觸控繪圖    │
│  Gemini AI 主持     │   presence: host / player        │  送出 Base64 PNG    │
│  畫廊展示 + 自動 GC │   message: drawing / ack          │  pagehide 主動離開   │
└─────────────────┘                                    └─────────────────┘
        │  ↑  WSS 443 直連，不需 STUN/TURN，穿透公司與電信防火牆
        ▼
   Google Gemini API（大螢幕直接呼叫，自動猜測畫作並評分）
```

**為何不選 PeerJS / 公共 MQTT（踩過的坑）：**
- PeerJS 的 signaling 與 WebRTC ICE 常被公司、校園、5G 防火牆阻擋 → 連線卡「連線中」
- 公共 MQTT broker（emqx/hivemq/mosquitto）多在 8883/非標準埠 → 同樣逾時或 403
- **Ably Realtime 走 WSS 443**，與 HTTPS 同埠，實測可穿透，免費額度每月 75 萬則訊息

## 使用流程（建置新遊戲）

1. **確認技能流程**：先用本技能判斷需求是否為「大螢幕 + 手機掃碼互動」；若是，沿用下列流程，勿自創通訊層。
2. **取得金鑰**：Ably（https://ably.com/signup）與 Gemini（https://aistudio.google.com/apikey）各申請一組免費 Key。
3. **生成骨架**：依本技能規範產出專案結構（index.html / mobile.html / js / css / vendor / .github/workflows / images）。
4. **修改需求**：調整互動工具、規則、AI 提示詞、動畫（GSAP MotionPath 沿路徑行駛等）。
5. **本機測試**：`npx serve . -l 3000` 或 `python -m http.server 3000`。
6. **部署 GitHub Pages**：推送 `main` → GitHub Actions 自動部署 → `https://<帳號>.github.io/<儲存庫>/`。

## 關鍵實作規範（違反會踩雷）

### 通訊層（Ably）
- 兩端都用同一個 `ABLY_KEY`，channel 命名 `pictionary-<room>`（room 由大螢幕隨機產生，經 QR Code 傳給手機）。
- `new Ably.Realtime({ key, clientId, transportParams: { maxMessageSize: 500000 } })`。
  - **clientId 必填**，否則 presence enter 會報 `clientId must be specified to enter a presence channel`。
  - 大螢幕用 `host-<rand>`，手機用 `player-<rand>`，presence 統計時以 clientId 排除 host。
- presence 的 `presence.get()` 必須用 **callback 簽章** `(err, members)`，Promise 寫法會收到 undefined（Ably 1.x 不支援 .then）。
- 手機端需監聽 `pagehide` + `beforeunload`，主動 `channel.presence.leave()` + `ably.close()`，否則大螢幕玩家列表不會即時清空。
- 所有 `ably.connection.on('connected'/'failed'/'suspended'/'disconnected')` 與 `publish(err)` 都要有錯誤處理。
- 圖片以 `canvas.toDataURL('image/png')` 產生 Base64，透過 `channel.publish('drawing', data)` 傳送，可加 ack 回執。
- 大螢幕收到圖後可用 **像素級 Alpha 遮罩裁切**（`images/car-silhouette.svg` 為例）只保留車輛輪廓內繪圖。

### 大螢幕（主畫面）
- 用 QRCode.js 產生 QR，內容為 `location.origin + basePath + 'mobile.html?room=' + roomId`；`basePath` 用 `location.pathname.replace(/\/?[^/]*$/, '/')` 才能部署在子路徑。
- 畫作卡片進場淡入（CSS animation fadeUp）；**30 秒後自動淡出移除**（`card.style.opacity='0'` + 500ms 後 `card.remove()`）。
- 畫廊最多 6 幅，超出時移除最舊卡片。
- 動畫跑完必須 GC：`gsap.kill()` + 移除 DOM，防止記憶體洩漏（10~12 秒規則）。

### AI 主持（Gemini）
- 模型用 `gemini-3.1-flash-lite`（免費輕量快速版；`gemini-2.5-flash` 不再提供給新用戶；`gemini-1.5-flash` 已棄用）。
- 呼叫 `https://generativelanguage.googleapis.com/v1beta/models/<MODEL>:generateContent?key=...`，POST `{ contents: [{ parts: [{ text: 提示詞 }, { inline_data: { mime_type: 'image/png', data: base64 } }] }] }`。
- 用正規表達式解析回應中的「答案 / 評分 / 點評」，並 `escapeHtml` 後寫入 DOM。

### 部署（GitHub Pages）
- 工作流範本見 `templates/deploy.yml`：push main → configure-pages → upload-pages-artifact → deploy-pages。
- **CDN 快取陷阱**：GitHub Pages 會快取 JS，改版後手機仍跑舊碼；所有 `<link>`/`<script>` 掛 `?v=N`，每次改版遞增版本號。
- 中文亂碼陷阱：**禁止用 PowerShell `Get-Content/Set-Content -Encoding UTF8` 改 HTML/JS**，會損壞中文字元。改用 opencode 的 Write/Edit 工具，或 `[System.IO.File]::WriteAllText($f, $c, (New-Object System.Text.UTF8Encoding $true))`。emoji 可用 HTML entities（如 `&#127912;`）避免編碼問題。

## 驗證方式（上線前必做）

1. 以無痕/新 profile 開大螢幕，確認狀態徽章顯示「等待玩家加入」、QR Code 正常。
2. 手機開 `mobile.html?room=<實際房號>`（可由 `window.__roomId` 取得），確認「已連線」。
3. 大螢幕玩家列表出現「1 位玩家連線中」。
4. 手機畫畫送出 → 大螢幕畫廊出現卡片 → AI 猜測結果顯示。
5. 關閉手機頁 → 大螢幕列表即時清空恢復「等待玩家加入」。
6. 畫作 30 秒後淡出；一次送 7 幅確認自動移除最舊。
7. 部署後需以新版本號 `?v=N` 強制刷新，避免測試到快取舊碼。

## 教學與範例
- `README.md` — 完整架構說明、模組對照、建置步驟、故障排除。
- `references/architecture.md` — 通訊流程、資料流、狀態機詳解。
- `references/commands.md` — 常用指令與金鑰取得方式速查。
- `templates/deploy.yml` — GitHub Pages 自動部署工作流範本。
