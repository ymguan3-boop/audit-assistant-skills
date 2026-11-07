# gpt-media

用 Playwright 操作已登入的 ChatGPT 網頁，生成 PNG 圖片與 GIF 動畫。適合遊戲素材、圖示、頭像與封面。

## 功能

- 生成單張 PNG 或 GIF，可附參考圖。
- 批次 GIF：4 張參考圖拼成 2×2，一次產出再切成 4 個。
- 綠幕連通去背與圖示表切割。
- 自動清除 ChatGPT 留下的草稿，並防止兩個工作同時操作。

## 需求

- Node.js 18 以上
- Google Chrome
- ChatGPT 帳號（使用者自行登入）
- ffmpeg（批次 GIF 需要）

## 安裝

複製到 Claude Code 或 opencode 的技能資料夾，再安裝相依套件：

```powershell
Copy-Item -Recurse .\skills\gpt-media "$env:USERPROFILE\.claude\skills\gpt-media"
Copy-Item -Recurse .\skills\gpt-media "$env:USERPROFILE\.config\opencode\skills\gpt-media"
```

```bash
cd scripts
npm install
```

## 使用

開啟專用 Chrome，第一次請自行登入：

```bash
node scripts/gpt-media.mjs chrome
```

生成圖片或 GIF：

```bash
node scripts/gpt-media.mjs make --out out/cover.png --prompt "溫暖手繪奇幻商店的封面"
node scripts/gpt-media.mjs make --out out/hero.gif --prompt "待機眨眼的循環動畫，背景透明" --ref ref/hero.png
```

批次 GIF：

```bash
node scripts/gpt-media.mjs gif-batch --list items.json --out-dir out/gifs --size 160
```

也可以直接對 Claude 或 opencode 說：「用 GPT 幫我做這個角色的 GIF」。完整說明見 [SKILL.md](SKILL.md)。

## 注意事項

- 本技能不會輸入帳號密碼，登入由使用者自己完成。
- 上傳的圖片會傳給 OpenAI，請勿上傳機敏資料。
- 這是操作網頁的工具，ChatGPT 改版時可能需要調整選擇器。用量上限依使用者的方案而定。
- 請確認使用方式符合 OpenAI 的服務條款。
