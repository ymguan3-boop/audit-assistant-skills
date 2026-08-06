---
name: slides-qr-remote
description: 為 HTML 簡報加入 QR Code 手機遙控功能 — 大螢幕顯示 QR Code 讓聽眾以手機掃碼控制投影片前後翻頁/跳頁，透過 Ably Realtime 穿透防火牆即時同步，含主控端連線狀態燈、全螢幕按鈕與閒置自動斷線機制。說「加入QR Code 手機遙控功能」「QR 手機遙控」「簡報手機遙控」「slides-qr-remote」時載入。
---

# QR Code 手機遙控簡報

將既有 HTML 簡報（Reveal.js / Slidev / 純 HTML 投影片皆可）升級為「手機可遙控」的版本：主控螢幕左上角顯示 QR Code，聽眾用手機掃碼即進入遙控頁面，可上一頁/下一頁/直接跳頁。

## 運作原理

- **QR Code**：主秀頁載入後，於最後一頁（或任一指定頁）左上角繪製 QR Code，內容為手機遙控頁 `mobile.html?room=<roomId>&total=<頁數>&slides=<頁名清單>` 的網址。
- **Ably Realtime**：主控端與手機端透過 Ably 訂閱同一個頻道 `slide-remote-<roomId>`。手機發布 `nav`（跳頁指令）與 `sync`（主控同步目前頁）訊息；透過 Ably presence 判斷對方在線狀態。
- **防火牆穿透**：Ably 走 WSS:443，一般會議場所/機關內網不需額外開埠即可連線。
- **斷線機制**：任意一端閒置逾 10 分鐘自動斷線；主控端關閉簡報時手機自動斷線。

## 使用方式

使用者在 opencode 中說：「**加入QR Code 手機遙控功能**」即觸發本技能。

### Step 1：確認簡報框架並決定翻頁 API

先檢查目標簡報檔，判斷框架與翻頁方式：

| 框架 | 跳頁 API |
|------|---------|
| Reveal.js | `Reveal.slide(index)` |
| Slidev | `nav.go(index)` |
| 純 HTML / 自訂 | 自訂函式（可能需寫 `window.location.hash` 或切換顯示區塊） |

若為自訂框架，先在簡報 `<script>` 中建立一個統一的跳頁函式供遙控呼叫：

```js
function gotoSlide(h) {
  // 依你的簡報框架實作跳頁；Reveal.js 範例：
  if (typeof Reveal !== 'undefined') { Reveal.slide(h); return; }
  // 其餘框架請自行接入
}
```

> 手機遙控習慣用 0-based 索引（第 1 頁 = 0）。請統一以此規範。

### Step 2：置入主控端嵌入片段

開啟簡報 HTML，依 `host-embed.html`（本技能資料夾內）加入三類內容：

1. **CSS**：`<style>` 中加入 `.qr-corner`（QR 卡）、`#host-conn-status`（連線狀態燈）、`.fs-btn`（全螢幕按鈕）。
2. **HTML**：在結束頁（或指定頁）的 `<section>` 中放入 QR 卡 HTML（含 `.qr-corner-label`、`#qr-corner-canvas`、`.qr-corner-rules`）；在 `<body>` 收尾處放入狀態燈 `<div id="host-conn-status">📱 手機未連線</div>` 與全螢幕按鈕。
3. **JavaScript**：在簡報主 `<script>` 內（或另外的 `<script>`）放入完整邏輯：
   - 產生每頁載入獨立的 `roomId`，並掛到 `window.__roomId` 供除錯。
   - `initAblyRemote()`：連線 Ably、訂閱 `nav` 頻道呼叫 `gotoSlide(h)`、處理 presence、10 秒定時檢查手機在線、頁面關閉 (`pagehide`) 時主動 leave、閒置 10 分鐘自動斷線。
   - `renderQRCode()`：以 qrcodejs 繪製 QR（純黑、correctLevel H、150px）。
   - 頁面載入即 `initAblyRemote()` 並 `renderQRCode()`（到達結束頁時 QR 已就緒）。

**重要**：`host-embed.html` 尾部有一段「務必依自身簡報調整」的註解與預設範例值（`PREVIEW_NAME`、頁名清單、`indexh` 結束頁索引），請替換成實際值。

### Step 3：部署手機遙控頁

將本技能資料夾內的 `mobile.html` 複製到簡報部署根目錄旁，**並與主簡報部署在同一域名下**（例如 GitHub Pages 相同資料夾）。

> 因為 QR 內容要指向手機可連到的網址，主秀若為靜態部署，記得把 `DEPLOY_BASE` 改為實際部署網址（如 `https://<user>.github.io/<repo>/`）；若直接在本機 `file://` 開啟，仍可改回以 `new URL('mobile.html', location.href)` 產生相對位址。

### Step 4：設定 Ably API Key

兩個檔案各有一行 Ably key（`key: '...'`）。若沿用預設 key 即可立即運作；若要更換，請至 [Ably 控制台](https://dashboard.ably.com) 建立 App 並取得 API 金鑰後替換（主控端與手機端需使用同一把 key）。

> **資安提醒**：此 key 為公開用 client key 之用途，若部署於公開 GitHub 頁面會公開在金鑰修改點。建議對重要場合重新建立專用金鑰，或改用 Token Auth。

### Step 5：驗證

- 開啟主簡報 → 到結束頁，左上角出現 QR Code。
- 手機掃碼 → 進入遙控頁，狀態顯示「✅ 已連線」；主秀左下角狀態燈亮起「📱 手機已連線」。
- 手機點「下一頁」→ 主秀跳至下一頁；點任一名稱 → 直接跳頁。
- 關閉主秀瀏覽器分頁 → 手機 5 秒內顯示「✖ 簡報已關閉，已斷線」。
- 兩端任一端閒置 10 分鐘 → 自動斷線。

## 技術細節

- QR 生成：`qrcodejs` → `https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js`
- Ably：官方 CDN → `https://cdn.ably.com/lib/ably.min-2.js`（**勿用 jsdelivr 的 ably 路徑，會 404**）
- QR 樣式：純黑 `#000000` 於白底、`correctLevel: H`、150×150。
- 頻道命名：`slide-remote-<roomId>`；roomId 格式建議 `'<簡報別名>-'+Math.random().toString(36).slice(2,8)`。
- presence clientId 慣例：主控端 `host-` 前綴、手機端 `mobile-` 前綴（供在線判斷與狀態燈使用）。
- 全螢幕按鈕：支援 `requestFullscreen` / `webkitRequestFullscreen` / `msRequestFullscreen` 前綴。

## 相關檔案

- `host-embed.html` — 主控端可複製的嵌入片段（CSS + HTML + 完整 JS + 調整註解）
- `mobile.html` — 手機端遙控頁完整範本（可直接複製使用）

## 依賴

- 簡報需為 HTML 格式（任選框架）
- 不需安裝任何套件；CDN 於執行期載入