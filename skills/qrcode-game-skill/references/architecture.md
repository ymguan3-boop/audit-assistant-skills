# 架構詳解（Architecture Deep-Dive）

本文件深入說明 QR Code 互動遊戲的資料流、狀態機與遮罩裁切原理，供開發時參考。

---

## 1. 資料流（完整時序）

### 建立房間（Host）
```
大螢幕 init()
  ├─ roomId = 'pic-' + Math.random().toString(36).substring(2,8).toLowerCase()
  ├─ generateQR()
  │    ├─ basePath = location.pathname.replace(/\/?[^/]*$/, '/')
  │    ├─ mobileUrl = location.origin + basePath + 'mobile.html?room=' + roomId
  │    └─ new QRCode(container, { text: mobileUrl, width:160, height:160, correctLevel: M })
  └─ setupAbly()
       ├─ ably = new Ably.Realtime({ key, clientId: 'host-xxx', transportParams:{maxMessageSize:500000} })
       ├─ connection.on('connected')  → 狀態「等待玩家加入」
       ├─ channel = ably.channels.get('pictionary-' + roomId)
       ├─ channel.subscribe('drawing') → handleDrawing + publish('ack',{id})
       ├─ channel.presence.enter('host')
       ├─ presence.subscribe('enter'/'leave') → updatePresence()
       └─ presence.get((err,members)) → 統計非 host 人數
```

### 玩家加入（Player）
```
手機 mobile.html?room=pic-xxxxxx
  ├─ roomId = URLSearchParams.get('room')
  ├─ connectAbly(room)
  │    ├─ ably = new Ably.Realtime({ key, clientId: 'player-xxx', transportParams:{maxMessageSize:500000} })
  │    ├─ connection.on('connected') → channel = ably.channels.get('pictionary-'+room)
  │    │                              → channel.subscribe('ack') → 顯示「已送出！」
  │    │                              → channel.presence.enter('player')
  │    └─ pagehide/beforeunload → presence.leave() + ably.close()
  ├─ 繪圖（pointerdown/move/up，lineCap round，undo history 上限 20）
  └─ submitDrawing() → canvas.toDataURL('image/png') → channel.publish('drawing', data, cb)
```

### 大螢幕接收（Host）
```
handleDrawing(message)
  ├─ card = createCard(id, message.data)          // img.src = Base64 PNG
  ├─ galleryGrid.insertBefore(card, firstChild)
  ├─ setTimeout(30s) → opacity 0 + 500ms 後 remove
  ├─ 超過 6 張 → 移除最舊
  ├─ callGemini(apiKey, data)                     // 非同步
  │    └─ POST generateContent → parseGeminiResponse → setAiResult
  └─ channel.publish('ack', { id: message.id })
```

---

## 2. 狀態機（大螢幕連線狀態）

| 狀態 | 觸發 | 顯示 |
|------|------|------|
| `offline` | connection 'failed' / 'closed' / Key 未設定 | 紅點 + 「連線失敗」 |
| `ready` | connection 'connected' 或 presence 0 人 | 青點 + 「等待玩家加入」 |
| `online` | presence 有玩家 | 綠點 + 「N 位玩家連線中」 |

`setStatus(mode, text)` 統一改 `className = 'status-badge ' + mode` 與 label 文字。

---

## 3. 畫廊規則（30 秒 / 6 幅）

- **30 秒自動消失**：
  ```js
  setTimeout(function(){
    if (card.parentNode) {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.8)';
      card.style.transition = 'all 0.5s ease';
      setTimeout(function(){ if (card.parentNode) card.remove(); updateCount(); }, 500);
    }
  }, 30000);
  ```
- **6 幅上限**：`galleryGrid.querySelectorAll('.drawing-card')` 超過 6 → 移除最後一張（最舊）。
- 每張卡片進場用 CSS `@keyframes fadeUp`（opacity + translateY）淡入。

---

## 4. Gemini AI 呼叫

### 請求
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=<API_KEY>
Content-Type: application/json
{
  "contents": [{
    "parts": [
      { "text": "<系統提示詞：幽默主持人，猜答案+評分+100字點評，指定格式>" },
      { "inline_data": { "mime_type": "image/png", "data": "<Base64 無 data: 前綴>" } }
    ]
  }]
}
```

### 回應解析
- 取 `data.candidates[0].content.parts[0].text`。
- 正規式抽「答案」「評分」「點評」：
  - 評分：`text.match(/[評分|分數][：:]?\s*(\d+)/)`，clamp 到 1~100。
  - 答案：`text.match(/[答案][：:]?\s*(.+?)(?:\n|$)/)`。
  - 點評：過濾掉答案/評分/單字行後剩餘行 join。
- 所有文字寫入 DOM 前先 `escapeHtml`（用 `document.createElement('div')` + `createTextNode`）。

---

## 5. 遮罩裁切原理（車型輪廓為例）

手機端把玩家繪圖限制在指定形狀（如車輛輪廓）內：

1. 載入 `car-silhouette.svg` 或同尺寸透明底 PNG 當遮罩。
2. 建立離屏 canvas 繪製遮罩，逐一讀取像素 Alpha：
   - `ctx.getImageData(x, y, 1, 1).data[3]` 為 0（透明）→ 該像素位於輪廓外。
3. 玩家繪圖 pixel 級判斷：輪廓外像素不繪製（或直接清除），只保留輪廓內筆觸。
4. 最後 `canvas.toDataURL('image/png')` 送出，背景去背。

> 這讓「畫一輛車」變成「在車框內彩繪」，是 S 型馬路展演系統的核心互動。

---

## 6. GSAP 動畫（沿 S 型路徑）

- 載入 `gsap.min.js` + `MotionPathPlugin`，註冊 `gsap.registerPlugin(MotionPathPlugin)`。
- 定義 SVG 路徑（S 型馬路），用 MotionPath 讓車輛 `x/y/rotate` 沿路徑行駛。
- 動畫結束後**必須 GC**：
  ```js
  tween.kill();                 // gsap.kill()
  element.remove();             // 移除 DOM
  ```
  10~12 秒為一個生命週期，防止長時間展演記憶體洩漏。

---

## 7. 安全性與錯誤處理（必守）

- 所有 PeerJS/Ably 非同步事件必須有 `try/catch` 與錯誤回呼（`publish(err)`、`connection.on('failed')`）。
- Gemini API Key 存 `localStorage`，不寫入原始碼（除 Ably Key 因需兩端共用）。
- 不 commit 任何 `PASTE_` 佔位金鑰；上線前檢查 `ABLY_KEY.indexOf('PASTE_') === 0` 的防呆。
