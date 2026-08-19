# QR-code-GameSkill

> 將「AI 猜猜看 Pictionary」**已驗證成功**的 QR Code 互動遊戲做法，萃取成可重用的 opencode 技能。

大螢幕展示 + 手機掃碼互動。透過 **Ably Realtime（WSS 443）** 中繼，可穿透公司網路與電信 5G 防火牆；全程免後端、免費部署於 **GitHub Pages**，並可用 **Gemini AI** 主持遊戲。

---

## 快速開始（60 秒）

```powershell
# 1. 安裝技能到 opencode
# 將本資料夾複製為：
#   ~/.config/opencode/skills/qrcode-game-skill/
# （SKILL.md 的 name 必須與資料夾同名，重啟 opencode 生效）

# 2. 取得兩組免費金鑰
#   Ably:   https://ably.com/signup          → API Keys 頁籤複製 Key
#   Gemini: https://aistudio.google.com/apikey → 產生 API Key

# 3. 召喚技能開始建置
#   對 opencode 說：「做 QR Code 互動遊戲」→ 技能自動載入建置流程
```

---

## 架構總覽

```
┌────────────────────────────┐        QR Code 內含          ┌────────────────────────────┐
│  大螢幕 index.html (Host)   │   ?room=pic-xxxxxx            │  手機 mobile.html (Player)  │
│  ┌──────────────────────┐  │   ◄──────────────────────►   │  ┌──────────────────────┐  │
│  │ QRCode.js 產生 QR     │  │   Ably Realtime WSS:443      │  │ Canvas 觸控繪圖       │  │
│  │ Ably presence host    │  │   channel: <game>-<room>     │  │ Ably presence player  │  │
│  │ 訂閱 drawing / 回 ack │  │                              │  │ 送出 Base64 PNG       │  │
│  │ Gemini AI 自動猜測    │  │                              │  │ pagehide 主動離開     │  │
│  │ 畫廊 + 自動 GC         │  │                              │  └──────────────────────┘  │
│  └──────────────────────┘  │                              │                            │
└────────────────────────────┘                              └────────────────────────────┘
```

### 標準模組（技能產出的專案結構）

| 檔案 | 角色 | 關鍵技術 |
|------|------|----------|
| `index.html` | 大螢幕展示 | 場景、QR 容器、玩家列表、畫廊/結果區 |
| `mobile.html` | 手機互動端 | 觸控 Canvas、工具列、送出按鈕 |
| `js/main-screen.js` | Host 邏輯 | Ably 接收、Gemini 呼叫、結果 GC |
| `js/mobile.js` | Player 邏輯 | Ably 發送、繪圖、遮罩裁切 |
| `vendor/ably.min.js` | 通訊庫 | WSS 443 中繼（穿透防火牆關鍵） |
| `vendor/qrcode.min.js` | QR 產生 | 內含進房網址與房號 |
| `vendor/gsap.min.js` + MotionPath | 動畫（選配） | 沿路徑行駛等 |
| `.github/workflows/deploy.yml` | 自動部署 | push main → GitHub Pages |
| `images/*.svg` | 遮罩圖（選配） | 像素級 Alpha 裁切 |

---

## 通訊流程（時序）

1. 大螢幕開啟 → 隨機產生 `roomId = 'pic-' + 6位亂數` → QR Code 內容為 `mobile.html?room=pic-xxxxxx`。
2. 大螢幕 `new Ably.Realtime({ key, clientId: 'host-xxx' })` → `presence.enter('host')` → 狀態「等待玩家加入」。
3. 手機掃 QR → `mobile.html?room=...` → `new Ably.Realtime({ key, clientId: 'player-xxx' })` → `presence.enter('player')`。
4. 大螢幕 `presence.subscribe('enter'/'leave')` → 更新玩家列表與連線狀態。
5. 手機畫完 → `canvas.toDataURL('image/png')` → `channel.publish('drawing', data)`。
6. 大螢幕收到 → 建立結果卡片 → 回 `channel.publish('ack', { id })` → 呼叫 Gemini 猜測並顯示。
7. 手機收到 ack → 顯示「已送出！」。
8. 手機離開（pagehide/beforeunload）→ `presence.leave()` + `ably.close()` → 大螢幕列表即時清空。
9. 結果卡片依規則自動淡出移除；超過上限時移除最舊卡片。

---

## 為何成功？（踩過的坑 → 解法）

### 通訊層選型（最重要的一課）
| 方案 | 結果 | 原因 |
|------|------|------|
| PeerJS (WebRTC P2P) | ❌ 卡「連線中」 | signaling 與 ICE 被公司/5G 防火牆阻擋 |
| 公共 MQTT (emqx/hivemq/mosquitto) | ❌ 逾時/403 | 非 443 標準埠被封 |
| **Ably Realtime (WSS 443)** | ✅ 成功 | 與 HTTPS 同埠，實測穿透 |

---

## Ably 在本技能中的角色

Ably 是手機↔大螢幕的**即時通訊層**，負責三件事：

| 功能 | 用途 |
|------|------|
| **Pub/Sub 訊息** | 手機 `channel.publish('drawing', data)` → 大螢幕 `channel.subscribe('drawing')` 收到 Base64 畫作 |
| **Presence 在線偵測** | 手機 `presence.enter('player')` → 大螢幕即時知道「N 位玩家連線中」，手機離場自動清空 |
| **ACK 回執** | 大螢幕 `publish('ack', {id})` → 手機確認「已送出」 |

關鍵是它走 **WSS 443**（與 HTTPS 同埠），能穿透公司/校園/5G 防火牆，這是選它的主因。

### 為什麼不選其他方案？

純手機操控大螢幕需要某種通訊層（瀏覽器 JS 在不同裝置上是隔離的），但不一定要 Ably。以下是完整比較：

| 方案 | 免費額度 | 需 API Key？ | 防火牆穿透 | 設定複雜度 | 連線穩定性 |
|------|---------|------------|-----------|-----------|-----------|
| **Ably** | 600 萬則/月、200 連線 | 是（免費申請） | ✅ WSS 443，實測最穩 | 低（一組 Key） | ⭐⭐⭐⭐⭐ |
| **Firebase RTDB** | 1GB 儲存、10GB/月傳輸 | 是（免費申請） | ✅ 走 443 | 中（需建專案、設 DB 規則） | ⭐⭐⭐⭐ |
| **PeerJS** | 無限制（P2P） | 否 | ❌ WebRTC ICE 常被擋 | 低 | ⭐⭐（公司/校園/5G 易卡） |
| **Supabase** | 500MB DB、5 萬月活 | 是（免費申請） | ✅ WebSocket 443 | 中（需建專案） | ⭐⭐⭐⭐ |
| **MQTT (HiveMQ)** | 100 連線、100MB/月 | 是（免費申請） | ✅ WSS 443 | 中（需處理 topic） | ⭐⭐⭐⭐ |
| **Socket.IO 自架** | 伺服器費用另計 | 否 | 取決於伺服器 | 高（需 VPS） | ⭐⭐⭐⭐⭐ |

### 結論

- **PeerJS**（免 Key）：唯一真正免設定的方案，但 WebRTC ICE 常被公司/校園/5G 防火牆阻擋，不適合公開場館部署。
- **Ably**（有 Key）：穿透力最強、設定最簡單（一組 Key 兩端共用）、免費額度對展演綽綽有餘。缺點是要申請帳號（30 秒搞定）。
- **Firebase RTDB**（有 Key）：免費額度最大、Google 生態整合好，但設定步驟較多（建專案→設 DB→改規則→拿 Key）。

**實務建議**：場景是「展演/活動」（有防火牆、需穩定）→ **Ably 是首選**（WSS 443 穿透力最可靠）。只是本機測試或私人網路 → PeerJS 就夠。需要大量儲存（保留所有玩家畫作）→ Firebase 才有優勢。

### 程式碼層（6 個關鍵）
1. **clientId 必填**：presence 需要 `clientId`，否則報 `clientId must be specified to enter a presence channel`。隨機產生 `host-`/`player-` 前綴。
2. **presence.get 用 callback**：Ably 1.x 的 `presence.get()` 用 `(err, members)` 回呼，`promise.get().then()` 會收到 `undefined` 而報錯。
3. **主動 leave**：手機監聽 `pagehide` + `beforeunload`，呼叫 `channel.presence.leave()` + `ably.close()`，否則列表不即時清空。
4. **CDN 快取**：GitHub Pages 快取 JS，改版後舊碼殘留 → 所有資源掛 `?v=N`，每次改版遞增。
5. **中文編碼**：PowerShell `Get-Content/Set-Content -Encoding UTF8` 會破壞中文 → 用 Write/Edit 工具或 `[System.IO.File]::WriteAllText`（含 BOM UTF8）。emoji 用 HTML entities。
6. **Gemini 模型**：`gemini-1.5-flash` 已棄用（404），改用 `gemini-2.5-flash`。

### 效能與記憶體
- 大螢幕結果卡片依規則自動淡出 + 移除 DOM；`setTimeout` 內再次檢查 `card.parentNode` 防止雙刪。
- 動畫（GSAP）跑完顯式 `gsap.kill()` + 移除 DOM。
- 手機復原歷史限制 20 步，避免記憶體爆量。

---

## 檔案說明

```
QR-code-GameSkill/
├── SKILL.md                    # opencode 技能主檔（模型讀取的指令）
├── README.md                   # 本檔：架構總覽 + 使用說明
├── references/
│   ├── architecture.md         # 資料流 / 狀態機 / 遮罩原理詳解
│   └── commands.md             # 常用指令與金鑰速查
└── templates/
    └── deploy.yml              # GitHub Pages 自動部署工作流
```

---

## 部署（GitHub Pages）

1. 將技能產出的前端專案推送至 GitHub 儲存庫（含 `.github/workflows/deploy.yml`）。
2. Settings → Pages → **Source: GitHub Actions**。
3. push 到 `main` 後 Actions 自動部署（約 15~20 秒）。
4. 網址 `https://<帳號>.github.io/<儲存庫>/`。

### 本機開發（無須伺服器）
```bash
npx serve . -l 3000
# 或
python -m http.server 3000
```
開啟 `http://localhost:3000` 測試。

---

## 取得金鑰

### Ably API Key
1. https://ably.com/signup 免費註冊。
2. 建立 App → **API Keys** 頁籤複製 Key。
3. 貼到 `js/main-screen.js` 與 `js/mobile.js` 的 `ABLY_KEY`。
4. 免費方案每月 600 萬則訊息（每秒 500 則、200 並行連線），足夠活動使用。

### 免費額度與上限通知

| 項目 | 免費額度 |
|------|---------|
| 訊息數 | 每月 600 萬則 |
| 訊息速率 | 每秒 500 則 |
| 並行連線 | 200 |
| 並行 channel | 200 |
| 最大訊息 | 64 KiB |
| 訊息儲存 | 1 天 |

超過上限才需付費（每百萬則訊息 $2.5）。**Ably 會主動通知**：

- **Email 通知**：使用量「接近上限」與「已超過上限」時自動寄信。
- **帳戶儀表板**：登入後 **Account → Limits** 可查目前用量與「recent limits notifications」。
- 超過多數限制**不會立刻斷線**，Ably 會繼續服務並聯絡你升級；僅計數型限制（如並行連線數）超出部分會被拒絕。

### Gemini API Key
1. https://aistudio.google.com/apikey 免費申請。
2. 大螢幕左側面板輸入 Key（存 `localStorage`）。

---

## 常見問題（FAQ）

| 症狀 | 原因 | 解法 |
|------|------|------|
| 手機一直「連線中」 | 網路封鎖 Ably？ | 用 `wss://realtime.ably.io` 測試；確認 Key 有效 |
| 大螢幕顯示 `---` | JS 錯誤（SyntaxError） | 看 console；`node --check js/*.js` |
| 改版後手機跑舊碼 | GitHub Pages CDN 快取 | 遞增 `?v=N` |
| 中文變亂碼 | 編碼工具誤用 | 用 Write/Edit；PowerShell 用 WriteAllText + BOM |
| 玩家離開列表沒消失 | 未主動 leave | 確認 pagehide/beforeunload handler |
| Gemini 回 404 | 模型已棄用 | 改用 `gemini-2.5-flash` |
| presence 報 clientId | 未設 clientId | `new Ably.Realtime({ clientId: 'player-xxx' })` |
| `presence.get().then` 出錯 | 用錯 API 簽章 | 改 `presence.get(function(err, members){})` |

---

## 授權
MIT License — 自由使用、修改、商用。
