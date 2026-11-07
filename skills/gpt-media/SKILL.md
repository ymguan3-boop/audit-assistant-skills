---
name: gpt-media
description: |
  用 Playwright 操作已登入的 ChatGPT 網頁生成 PNG 圖片或 GIF 動畫，並可批次製作與綠幕去背。適用於：使用者說「用 GPT 生圖」、「用 GPT 做 GIF」、「請 ChatGPT 畫」、「批次做頭像或角色 GIF」、「把圖鑑卡片做成 Q 版動畫」，或需要遊戲素材、圖示、封面時。支援 Claude Code 與 opencode。
---

# GPT 生圖與 GIF

透過 Playwright 連到使用者已登入的 Chrome，在 ChatGPT 網頁送出需求並下載結果。PNG 或 GIF 由提示與副檔名決定。

## 安全規則

- 不輸入帳號或密碼。需要登入時，請使用者在開啟的 Chrome 視窗自己登入。
- 只上傳使用者指定或本次工作需要的圖片。圖片會傳給 OpenAI，含個資或機敏資料的檔案要先問過使用者。
- 使用專用的 Chrome 資料夾，不碰使用者平常的瀏覽器資料。用完後，資料夾要等使用者同意才刪除。
- 不要關閉使用者自己的分頁；只關閉本技能開的分頁。

## 安裝

第一次使用時，在 `scripts` 資料夾執行：

```bash
npm install
```

需要 Node.js 18 以上與 Google Chrome。批次 GIF 另需 ffmpeg，可用 `--ffmpeg` 指定路徑。

## 開始使用

```bash
node scripts/gpt-media.mjs chrome
node scripts/gpt-media.mjs status
```

第一行開啟專用 Chrome，請使用者登入一次，之後會保留登入。如果視窗看不到或點不到，請使用者在自己的終端機執行這一行，不要由背景工作開啟。第二行應顯示「已登入」。

## 生成單張

```bash
node scripts/gpt-media.mjs make --out out/cover.png --prompt "溫暖手繪奇幻商店的封面"
node scripts/gpt-media.mjs make --out out/hero.gif --prompt "這個角色待機眨眼的循環動畫，背景透明" --ref ref/hero.png
```

- `--out` 副檔名為 `.gif` 就做 GIF，其餘做圖片。
- `--ref` 可放多張，用逗號分隔。
- 長提示用 `--prompt-file prompt.txt`。
- `--timeout` 是等待秒數，預設 420。
- `--keep` 保留分頁，方便接著追問。

## 批次 GIF

一次一隻太慢。`gif-batch` 會把 4 張參考圖拼成 2×2，請 GPT 做一個 2×2 GIF，再切成 4 個，大約 3 分鐘完成 4 個，位置固定也不會對錯角色。

先準備 `items.json`：

```json
[
  { "id": "cat", "name": "小貓", "ref": "cards/cat.webp" },
  { "id": "dog", "name": "小狗", "ref": "cards/dog.webp" }
]
```

```bash
node scripts/gpt-media.mjs gif-batch --list items.json --out-dir out/gifs --size 160 --style "可愛 Q 版、手繪粗輪廓，輕輕彈動並眨眼"
```

已有的檔案會跳過，中斷後重跑即可續作。原始 GIF 在輸出資料夾的 `_raw`。

## 圖示表與去背

要一次出多個物件時，請 GPT 畫成 3×2 的表，背景指定純色亮綠色 `#00FF00`，再切開：

```bash
node scripts/key-green.mjs sheet.png out/icons --grid 3x2 --names a,b,c,d,e,f --size 320
```

GPT 的透明背景常常是畫上去的假棋盤格，不可靠，所以靜態素材優先用綠幕。提示裡要寫明物件不要用純亮綠色。

## 交付前檢查

- 把 GIF 疊在深色和淺色底上看一次，確認真的透明，沒有綠邊或棋盤格。
- 確認檔案內容和檔名相符。連續追問時 GPT 可能多回一張，內容會錯開一格。
- 確認比例。GPT 的 GIF 不一定是正方形，縮放時要保持比例。
- 同一角色的多張圖要比較大小與造型是否一致。

## 常見問題

| 狀況 | 原因與做法 |
|---|---|
| GPT 回答沒有收到圖片 | 參考圖路徑錯誤。網址式路徑常帶 `?v=...`，磁碟上沒有這個檔名，要先去掉 |
| 提示文字混在一起 | 兩個工作同時操作同一個 Chrome。一次只跑一個，本技能用鎖定檔防止 |
| 新對話出現舊文字或舊附件 | ChatGPT 會保留未送出的草稿。本技能送出前會先清空 |
| 綠色物件被去掉 | 不要用全圖色鍵，要用 `key-green.mjs` 從邊緣連通去背 |
| 高的物件被切斷 | 物件跨過格線。依物件重心分配格子，`key-green.mjs` 已處理 |
| 等不到送出鈕 | GPT 還在回覆上一則，要等回覆結束再送 |
| 連續失敗 | 先看 Chrome 畫面，可能是用量上限或需要重新登入 |
