---
name: pcic-export
description: 公共工程雲端服務網（PCIC）標案資料匯出 — 自動登入機關端，設定篩選條件，匯出標案自選欄位表 Excel。說「抓 PCIC」「匯出標案」「pcic-export」「公共工程」時載入
---

# 公共工程雲端服務網（PCIC）標案資料匯出

## 功能

自動化操作 PCIC 機關端，匯出「標案自選欄位表（bidAcc001）」Excel 檔案。

| 步驟 | 說明 |
|------|------|
| 1. 開啟瀏覽器 | 用 Playwright 啟動 Chrome，導航至 PCIC |
| 2. 等待登入 | 暫停腳本，由使用者手動登入機關端 |
| 3. 導航選單 | 點擊「標案管理」→「報表查詢」→「標案自選欄位表」 |
| 4. 設定條件 | 自動將「發包預算」下拉選單設為最小值（0萬元起） |
| 5. 執行查詢 | 點擊「執行查詢」取得結果 |
| 6. 匯出 Excel | 點擊「匯出」下拉選單，選擇 EXCEL 格式下載 |

## 使用方式

### 方法一：直接執行腳本

```bash
python pcic_downloader/run_export.py
```

腳本會：
1. 開啟 Chrome 瀏覽器到 PCIC 登入頁
2. 寫入 `_status.txt` 表示 `WAITING_LOGIN`
3. 等待 `_cmd.txt` 出現 `CONTINUE` 指令
4. 使用者登入後，AI 寫入 `CONTINUE` 到 `_cmd.txt`
5. 腳本自動完成後續導航與匯出

### 方法二：AI 自動操作

在 opencode 中說「抓 PCIC」「匯出標案」，AI 會：
1. 啟動背景腳本
2. 等待使用者確認登入完成
3. 自動執行匯出流程
4. 回報下載結果

## 檔案結構

```
pcic_downloader/
├── run_export.py          # 主腳本（Playwright 自動化）
├── open_chrome.py         # 單獨開啟 Chrome（獨立進程）
└── exports/               # 下載的 Excel 檔案目錄
    ├── export_YYYYMMDD_HHMMSS.xlsx
    └── _*.png             # 各步驟截圖
```

## 狀態檔通訊

腳本與 AI 透過檔案通訊：

| 檔案 | 用途 |
|------|------|
| `_status.txt` | 腳本 → AI：目前狀態（STARTING / WAITING_LOGIN / STEP1~5 / ALL_DONE） |
| `_cmd.txt` | AI → 腳本：控制指令（CONTINUE） |
| `_run.log` | 腳本 → AI：完整執行紀錄 |

## 重要設定

- **發包預算**：預設設為最小值（0萬元起），可修改腳本中的 select 邏輯調整
- **機關**：預設為「宜蘭縣政府」，可修改腳本中的機關 select
- **URL**：`https://pcic.pcc.gov.tw/pwc-web/service/bidAta001`

## 注意事項

- 必須先安裝 Playwright：`pip install playwright && playwright install chromium`
- 使用者必須手動登入（機關端使用憑證或帳號密碼）
- 腳本以 `headless=False` 啟動瀏覽器，使用者需在視窗中操作
- 腳本透過 `Start-Process -WindowStyle Hidden` 在背景執行，不影響 AI 對話
- Excel 下載使用 `page.expect_download()` 捕獲瀏覽器下載事件

## 依賴

- Python 3.10+
- playwright
- Chromium（透過 playwright install 安裝）
