---
name: ocr-scanned-files
description: 掃描件批次 OCR 轉換 — 使用 PaddleOCR（GitHub 星星數最高之開源 OCR，82,109★）對無文字層之掃描 PDF/圖片批次辨識並產出 Markdown 檔，支援斷點續跑。說「批次 OCR」「掃描件轉文字」「OCR 掃描」「ocr-scanned-files」時載入
---

# 掃描件批次 OCR 轉換技能

使用 **PaddleOCR 3.7**（GitHub 星星數最高之開源多語言 OCR，Apache-2.0）對「資料處理紀錄.json」中標記為「掃描件」的 PDF/圖片批次執行 OCR，產出含 frontmatter 的 Markdown 檔並更新處理紀錄，支援斷點續跑與單檔錯誤容錯。

## 觸發方式

使用者說「批次 OCR」「掃描件轉文字」「OCR 掃描」「ocr-scanned-files」時載入本技能。

## 前置作業（一次性）

### 1. 安裝 PaddleOCR

```powershell
pip install paddlepaddle paddleocr
```

> **重要**：以官方 PyPI 安裝（pip 安裝時自動驗證 SHA256 完整性）。此為 `https://github.com/PaddlePaddle/PaddleOCR`（82,109★）官方發行套件。

### 2. 確認無病毒（首次使用必做）

因 Windows Defender 可能被企業防毒停用，系統若安裝 Trend Micro Apex One 等防毒，採以下流程確認：

1. 確認防毒產品存在：`Get-CimInstance Win32_Service | Where-Object { $_.Name -eq 'ntrtscan' }`（Trend Micro Apex One 即時掃描服務）
2. 以該防毒掃描 PaddleOCR 安裝目錄：`& "C:\Program Files (x86)\Trend Micro\Security Agent\TSC64.EXE" "C:\Program Files\Python312\Lib\site-packages\paddleocr" /HD`（exit=0 表無病毒）
3. 檢查隔離區：`Get-ChildItem "...\SUSPECT\Backup"` 應無新偵測檔
4. 掃描套件內可執行檔：確認無 `.exe/.bat/.vbs/.ps1` 等可疑檔
5. 若無任何防毒引擎，可嘗試啟用 Defender：`Start-Service WinDefend` 後用 `MpCmdRun.exe -Scan -ScanType 3 -File <路徑>`

### 3. 確認處理紀錄存在

技能依賴專案資料夾中的 `資料處理紀錄.json`（由 `convert_project_to_md.py` 產生，掃描件狀態為 `掃描件`）。

## 使用方式

### 方法一：直接執行腳本（推薦）

```powershell
# 完整批次 OCR（處理所有掃描件，斷點續跑）
python "C:\Users\ymguan\.config\opencode\skills\ocr-scanned-files\ocr_scanned_files.py"

# 指定專案資料夾
python ocr_scanned_files.py --project "D:\...\專案資料夾"

# 僅處理前 N 個（測試）
python ocr_scanned_files.py --limit 2
```

### 方法二：後台長時間執行（大量檔案）

```powershell
$out = "C:\Users\ymguan\AppData\Local\Temp\opencode\ocr_batch.log"
$err = "C:\Users\ymguan\AppData\Local\Temp\opencode\ocr_batch.err.log"
$code = @"
import subprocess
cmd = [r'C:\Program Files\Python312\python.exe', r'<技能目錄>\ocr_scanned_files.py']
with open(r'$out','w',encoding='utf-8') as fo, open(r'$err','w',encoding='utf-8') as fe:
    subprocess.Popen(cmd, stdout=fo, stderr=fe, creationflags=0x00000008)
print('started')
"@
$code | Out-File -FilePath "C:\Users\ymguan\AppData\Local\Temp\opencode\launch_ocr.py" -Encoding utf8
python "C:\Users\ymguan\AppData\Local\Temp\opencode\launch_ocr.py"
```

> 腳本每完成一檔即時寫入處理紀錄，中斷後重新執行即自動續跑（已轉換者跳過）。

## 腳本行為

| 項目 | 說明 |
|------|------|
| 掃描對象 | 處理紀錄中 `status=掃描件` 且副檔名為 PDF/PNG/JPG/JPEG/BMP/TIFF 之檔案 |
| OCR 引擎 | PaddleOCR 3.7，PP-OCRv5 mobile 偵測+辨識模型（較快） |
| 效能 | 每檔約 1~4 分鐘（視頁數），100 檔約 2~4 小時 |
| 輸出 | 含 frontmatter 之 MD，依內容分類歸檔至 `資料處理/1.基本資料分析` 或 `2.法規或函示` |
| 檔名 | `<原名>_OCR.md`（重名自動加 _1、_2） |
| 紀錄更新 | status→已轉換、output 路徑、message 含耗時 |
| 錯誤容錯 | 單檔失敗不中斷，記錄失敗訊息後續可重跑 |
| 斷點續跑 | 每檔處理後即時存檔，可安全中斷/重啟 |

## 注意事項

1. **必須 `enable_mkldnn=False`**：PaddleOCR 3.7 + paddlepaddle 3.3 在 CPU 使用 mkldnn/oneDNN 推理會報 `ConvertPirAttribute2RuntimeAttribute not support` 錯誤，需關閉（腳本已內建）
2. **手寫文字辨識度有限**：簽名、手寫註記等會以 `?` 呈現，需人工校對；印刷文字辨識良好
3. 掃描品質差的文件辨識率較低，OCR 結果僅作初稿，重要文件需人工覆核
4. 前次以 `enable_mkldnn=True` 或 medium 模型執行之檔案，重跑時會因已轉換而跳過，如需改用新設定可先於處理紀錄中將該筆 status 改回 `掃描件`
5. 首次執行會自動下載模型檔（約數百 MB）至 `C:\Users\ymguan\.paddlex\official_models`
6. 處理完畢後應檢查產出 MD 品質，並提醒使用者 OCR 誤差需人工校對

## 依賴

- Python 3.10+
- paddlepaddle、paddleocr（3.7+）
- 輸出歸檔依賴 `D:\opencode_0519\2ndbrain\convert_all_to_md.py`（VAULT_PATH 等常數）