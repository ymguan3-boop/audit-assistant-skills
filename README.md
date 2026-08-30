# audit-assistant-skills

審計輔助用技能倉庫 — 集合 opencode 技能，協助審計人員快速查詢政府採購資料及產出審計文件。

> 更新日期: 2026-08-30
> 技能總數: 32 個

## 技能總覽

| 類別 | 技能 | 功能 |
|------|------|------|
| 審計專業 | pccsearch | 政府電子採購網標案查詢 |
| 審計專業 | fjudsearch | 司法院裁判書查詢 |
| 審計專業 | lvrlandmoigov | 內政部不動產實價登錄查詢 |
| 審計專業 | pcic-export | 公共工程雲端服務網標案資料匯出（支援 `--yilan` 參數宜蘭縣匯出） |
| 審計專業 | qgisskill | QGIS 地圖自動化（宜蘭縣地政資料系統） |
| 審計專業 | audit-secondbrain | 審計第二大腦 Obsidian 知識管理系統 |
| 審計專業 | ezbid-bidders | ezbid.tw 投標廠商資料抓取（下載各標案投標廠商名單） |
| 審計專業 | audit-report-builder | 審計報告彙整（以調查計畫及工作底稿自動產出 Word 報告） |
| 審計專業 | gov-intelligence | 政府地方情資分析（每日主動巡查縣市行政區域重要資訊，分析事件發展） |
| 審計專業 | audit-info-publish | 重要政府審計資訊撰寫（分析主題資料、搜尋審計部官網類似案例、按格式撰寫發布稿） |
| 審計專業 | audit-judgment-draft | 採購申訴審議判斷書簽文撰寫（OCR 判斷書 PDF、自動產出審計機關簽辦公文） |
| 審計專業 | final-accounts-audit-opinion | 總決算審核意見自動生成（依調查報告及核復檔案產出重要審核意見 WORD 檔） |
| 審計專業 | ocr-scanned-files | **其他技能** — 繁體中文掃描 OCR 轉換（PaddleOCR，掃描 PDF/圖片批次辨識並產出 Markdown，支援斷點續跑） |
| 審計專業 | slides-qr-remote | **其他技能** — 為 HTML 簡報加入 QR Code 手機遙控功能（聽眾以手機控制翻頁） |
| 審計專業 | opencode-backup | **其他技能** — opencode 設定（含 MCP 伺服器）GitHub 備份 |
| GIS/3D | gis3d-development-impact | GIS 3D 開發影響評估（免 API Key 公開 GIS 資料建立互動式 3D GIS 模型、生態/交通/水文/都市/環境/碳排分析） |
| 影片生成 | brand-promo-video-generator | 品牌宣傳影片產生器（資產驗證→品牌真相表→分鏡→生成→交付） |
| 影片生成 | papercraft-stop-motion-explainer | 紙藝定格動畫解說產生器（紙雕/紙藝風格教育解說影片） |
| 影片生成 | paper-collage-explainer-generator | 拼貼畫風格解說影片產生器（Vox 風紙拼貼動畫） |
| 影片生成 | 3d-animation-short-generator | 3D 動畫短片產生器（故事概念→完整 3D 動畫短片） |
| 影片生成 | minimalist-product-ad-generator | 極簡產品廣告產生器（Apple 風格極簡廣告） |
| 影片生成 | music-video-subtitle-generator | MV 字幕產生器（歌詞排版與視覺效果） |
| 影片生成 | co-op-game-intro-generator | 合作遊戲開場動畫生成器（雙人遊戲選單/開場動畫） |
| 影片生成 | handdrawn-live-video-generator | 手繪風格實景影片產生器（手繪動畫與實拍融合） |
| 3D 建模 | 3d-builder | 混合建模（Blender 精確建模 + Hunyuan3D-2 AI 生成） |
| 3D 建模 | blandercustomize | 編輯 opencode 配置與自動化 Blender 建築模型建置 |
| 簡報 | html-slide-builder | Reveal.js HTML 互動簡報生成器（教材→互動簡報→部署 GitHub Pages） |
| 簡報 | slides-qr-remote | 簡報 QR Code 手機遙控功能 |
| 互動遊戲 | qrcode-game-skill | QR Code 互動遊戲系統建置（大螢幕+手機掃碼互動） |
| 地圖 | qgisskill | QGIS 地圖自動化（安裝、下載資料、設定圖層、載入地址） |
| 專案管理 | project-init | 新專案初始化（建立基本結構） |
| 專案管理 | startup | 開工自動同步（讀取上次進度、恢復工作環境） |
| 專案管理 | shutdown | 收工自動同步（整理進度、備份成果） |
| 專案管理 | opencode-backup | opencode 設定（含 MCP）GitHub 備份 |

---

## 技能分類

| 分類 | 技能 |
|------|------|
| 政府採購/標案 | pccsearch、pcic-export、ezbid-bidders |
| 司法/判決 | fjudsearch |
| 不動產/地政 | lvrlandmoigov、qgisskill、gis3d-development-impact |
| 審計作業 | audit-secondbrain、audit-report-builder、audit-judgment-draft、audit-info-publish、final-accounts-audit-opinion |
| 情資分析 | gov-intelligence |
| GIS/3D | gis3d-development-impact、qgisskill、3d-builder、blandercustomize |
| 影片/3D/簡報/遊戲 | 見下方分類說明 |
| 其他技能 | slides-qr-remote、opencode-backup、ocr-scanned-files、project-init、startup、shutdown |

---

## 技能詳情

### 1. pccsearch — 政府電子採購網（PCC）標案查詢

查詢政府採購標案，支援廠商得標/未得標金額、決標日期、履約期限等。

| 功能 | 說明 |
|------|------|
| 標號查詢 | 輸入標案號或標號，查出該廠商所有參與標案 |
| 廠商名稱查詢 | 依廠商名稱搜尋得標/未得標標案 |
| 標案分類 | 同類標案與廠商參與狀況、金額 |
| 得標比率 | 標案數量與金額統計分析 |

**常用指令**：在 opencode 中說「搜標案」「查標案」「pccsearch」

**備援資料源**：開放標案(pcc.mlwmlw.org)、台灣標案網(bid.twincn.com)、BidAcumen

---

### 2. fjudsearch — 司法院裁判書系統（FJUD）判決查詢

查詢司法院各級法院裁判書，掌握廠商/個人涉訟案件與法律關係。

| 功能 | 說明 |
|------|------|
| 判決關鍵字查詢 | 依年份+關鍵字+案由設定條件查判決 |
| 當事人查詢 | 依公司名/個人姓名搜尋，回覆案情 |
| 裁罰紀錄查詢 | 快速整理裁罰與訴訟狀態 |
| 憲法判決查詢 | 憲法法庭最新判決與即時處理 |

**常用指令**：在 opencode 中說「查判決」「查裁判書」「fjudsearch」

**備援資料源**：FJUD 裁判書查詢(judgment.judicial.gov.tw)、憲法法庭(cons.judicial.gov.tw)、法學資料檢索(law.judicial.gov.tw)

---

### 3. lvrlandmoigov — 內政部不動產交易實價登錄查詢

查詢內政部不動產交易實價登錄資料，支援地址查詢、買賣、租賃、預售三種交易型態。

| 功能 | 說明 |
|------|------|
| 地址查詢 | 依地址/縣市鄉鎮查詢地址區段，含樓層面積、車位、總價、屋齡 |
| 買賣行情 | 依使用區域和類型查買賣區間 |
| 區段查詢 | 輸入區段名稱取得所有買賣價格 |
| 實價查詢 | 依價格查詢附近的成交價格 |

**常用指令**：在 opencode 中說「實價登錄」「查房價」「lvrlandmoigov」

**資料來源**：內政部不動產交易實價登錄查詢服務網、opendata.vip、住商、永慶、信義、台灣、591

---

### 4. pcic-export — 公共工程雲端服務網（PCIC）標案資料匯出

自動化操作 PCIC 公務系統，匯出「標案自帶資料」Excel 檔案，可供進一步資料庫使用。

| 功能 | 說明 |
|------|------|
| 自動導覽 | 點擊「標案管理」→「統計查詢」→「標案自帶資料」 |
| 宜蘭縣區塊匯出 | `--yilan` 參數自動設定：起始日期=宜蘭縣政府、每頁過濾=屬於所屬機關、金額=0 起 |
| 已定篩選 | 自動選擇「已定篩選」（包含最小值（0萬起）） |
| 查詢匯出 | 查詢結果透過「匯出」下拉按鈕下載 EXCEL |
| 檔案同步 | 輸出與 AI 透過 `_status.txt` / `_cmd.txt` 檔案同步 |

**必要指令**：在 opencode 中說「匯出標案管理系統中宜蘭縣所屬機關的所有資料」

**其他使用方式**：「抓 PCIC」「匯出標案」「pcic-export」「公共工程」

**命令列**：
```bash
python run_export.py --yilan          # 宜蘭縣區塊匯出（預設）
python run_export.py                  # 預設所有機關
python run_export.py --export-dir DIR # 指定匯出目錄
```

**資料來源**：公共工程雲端服務網（pcic.pcc.gov.tw）

---

### 5. qgisskill — QGIS 地圖自動化（宜蘭縣地政資料系統）

自動化建置 QGIS 環境，整合宜蘭縣界、鄉鎮市界、OpenStreetMap 底圖與地址點位分析。

| 功能 | 說明 |
|------|------|
| 地政資料下載 | 從 g0v/twgeojson 下載台灣各縣市界與鄉鎮市界，整理宜蘭縣 |
| QGIS 環境建置 | 自動建立含 OpenStreetMap 底圖、縣界、鄉鎮市界的 QGIS 專案 |
| 圖層樣式設定 | 縣界線寬1.5mm、鄉鎮市界線寬1.2mm、透明度設定70% |
| 地址地政套疊 | 讀取 CSV/XLSX 地址資料，自動解析鄉鎮市與 Nominatim 查詢縣市、加入編碼欄位避免亂碼 |
| 圖層匯出 | 支援配色調整、邊框及標籤點位圖層，供報告與簡報使用 |

**常用指令**：在 opencode 中說「qgisskill」「QGIS 技能」

**參考檔案**：`town_coords.json`（宜蘭縣12鄉鎮中心點座標）

---

### 5-1. gis3d-development-impact — GIS 3D 開發影響評估

針對臺灣新建大樓、住宅、公共建築、橋梁、道路等公共設施，以免 API Key、免 Token、免付費授權的公開 GIS 資料建立互動式 3D GIS 模型。

| 功能 | 說明 |
|------|------|
| 定位選點 | 支援 Google Maps 定位選點或土地地號輸入 |
| 設計解析 | 解析基本設計 PDF/圖說，自動建構現況 GIS 3D 基礎模型 |
| 人工核對 | Google Maps 人工核對驗證，驗證通過後才進行現況渲染 |
| 影響分析 | 生態/交通/水文防災/都市機能/環境/碳排六大模式擇一分析 |
| 互動網頁 | 產生互動式網頁並匯出 Excel 分析成果 |
| 公開資料 | 使用免 API Key 公開 GIS 資料，無需付費授權 |

**常用指令**：在 opencode 中說「GIS 3D」「開發影響評估」「gis3d-development-impact」

**輸出**：互動式網頁 + Excel 分析成果 + 多層距離影響評估（250m/500m/2km/5km/10km）

---

### 6. audit-secondbrain — 審計第二大腦（Obsidian + OpenCode 知識管理系統）

建構審計專業 AI 第二大腦，自動批次轉換查核資料、生成調查計畫與工作底稿。

| 功能 | 說明 |
|------|------|
| 批次轉換 | docx/xlsx/pdf/圖片 → markdown，自動分類歸檔 |
| 調查計畫生成 | 含相關法規連結（自動查 PCode）、調閱資料清單、缺失評估問卷 |
| 工作底稿生成 | 四階段標準化結構（標題、依據、查核事實、擬議處理意見） |
| 知識庫整合 | 每週自動依照 Karpathy 疊代、累積知識庫 |
| 法規查詢 | get_pcode.py 自動查詢法規資料庫 PCode |

**常用指令**：在 opencode 中說「第二大腦」「審計第二大腦」「audit-secondbrain」

**完整設定**：`skills/audit-secondbrain/審計第二大腦設定（安裝與調查計畫與工作底稿生成）.md`（1286 行，15 個步驟完整操作與進階設定）

**開工自動同步**：`skills/audit-secondbrain/審計第二大腦開工自動同步技能.md` — 每次開工/收工自動同步 Obsidian 第二大腦資料庫，含 Git 自動備份、OCR 轉換、MCP Vault 檔案查詢與知識庫歸檔機制

---

### 7. ezbid-bidders — ezbid.tw 投標廠商資料抓取

從台灣政府採購與標案情報站（ezbid.tw）下載各標案的投標廠商列表，分析廠商名稱、是否得標、金額、投標時間。

| 功能 | 說明 |
|------|------|
| 投標廠商抓取 | 從 ezbid.tw 逐一打開標案頁面，解析投標廠商列表 |
| 得標分析 | 判斷各廠商是否得標、得標金額、相對/絕對差額 |
| 批量處理 | 支援依詢價金額或搜尋條件（`--limit`）批量抓取、測試模式（`--test`） |
| 本地資料庫 | 資料存入 SQLite，可透過 SQL 查詢特定標案或廠商歷史 |

**常用指令**：在 opencode 中說「抓投標廠商」「抓投標廠商資料」「ezbid-bidders」

**資料來源**：ezbid.tw（台灣政府採購與標案情報網站），資料源自政府電子採購網（PCC），每日定時更新

**命令列**：
```bash
python fetch_bidders.py              # 抓取所有標案
python fetch_bidders.py --limit 10   # 僅處理前10筆
python fetch_bidders.py --test       # 測試模式（僅抓1筆）
python fetch_bidders.py --db PATH    # 指定資料庫路徑
```

---

### 8. audit-report-builder — 審計報告彙整（聯合稽察調查報告）

依據審計報告格式（聯合稽察調查報告），從調查計畫與工作底稿自動產出完整調查報告。

| 功能 | 說明 |
|------|------|
| 格式自動化 | 依審計報告格式（目錄多層次），自動設定章節、字型、級數 16pt |
| 多檔案彙整 | 支援 1 份調查計畫 + 多份工作底稿，彙整成完整調查報告 |
| 標準章節 | 查核敘述（查核依據→查核範圍→查核程度→查核程序→查核方法→查核事實→查核意見與建議處理意見） |
| 附錄處理 | 自動導入報告範本，調整段落與標題字型大小 |

**常用指令**：在 opencode 中說「彙整調查報告」「做報告」「audit-report」

**命令列**：
```powershell
python build_report.py --plan "調查計畫.docx" --workpapers "底稿1.docx" --workpapers "底稿2.docx" --output "報告.docx"
```

**需求**：Python 3.10+、python-docx、pywin32（若需 .doc 格式）

---

### 9. gov-intelligence — 政府地方情資分析

每日主動巡查指定的行政區域重要資訊，進行分析並產出情報簡報。

| 功能 | 說明 |
|------|------|
| 多方蒐集 | Google News、Yahoo、政府網站、新聞網站、Open Data |
| 自動分類 | 政治、工程、交通、教育、法規、AI、警察、消防、財政等16類 |
| 重要性排序 | 不同加權（熱度/新聞 重大事件 平均 普通 一般） |
| 事件融合 | 多篇新聞屬同一事件時自動合併 |
| 摘要報告 | 同一領域的事件歸納、時間軸、鄉鎮分布彙總 |
| 風險分析 | 工程、財政、法規、政治、治安、廠商、AI、環保等風險標記 |
| 審計觀點 | 自動判斷是否值得查核、是否涉及違失或高風險議題 |
| 可查性排序 | 宜蘭+40、工程+30、地震+20、新聞+10、採購+5、違建-20 |
| 未來預測 | 預測未來7天、30天、90天的事件發展 |
| 搜索時段設定 | 每次使用可選擇最近1天、7天、30天或自訂天數 |
| 第二大腦深度分析 | 分析結果可選擇與 Obsidian 第二大腦進行深層分析與補充報告 |

**常用指令**：在 opencode 中說「情資分析」「地方情資」「查地方新聞」「gov-intelligence」

**搜尋關鍵詞**：地震災害、公共工程、坡地、水利、排水、防災、BOT、採購、行政、警政、災害防救、議會質詢、法規修正、獎勵補助、重大建設、關懷、教育、健康、長照、前端、教育、採購、人口、財政、警察、消防、食品、治安、詐騙、重大事件

---

### 10. audit-info-publish — 重要政府審計資訊撰寫

依審計部網站「重要政府審計資訊」格式，自動撰寫正式發布稿。

| 功能 | 說明 |
|------|------|
| 資料分析 | OCR 掃描文件文字、分析查核事實、查核發現、改善結果 |
| 官網搜尋 | 先前在審計部官網搜尋近2年類似案例，分析題目與段落格式 |
| 稿件結構 | 四段式標準結構（摘要性標題點出查核發現與改善結果） |
| 格式規範 | 使用全形、日期簡稱、省略主語、空格、換行等用語自動統一 |
| 稿件存檔 | 存至使用者指定資料夾，同步至第二大腦 |

**常用指令**：在 opencode 中說「寫審計資訊」「審計資訊發布」「重要政府審計資訊」「audit-info-publish」

**參考頁面**：審計部重要政府審計資訊清單（https://www.audit.gov.tw/p/412-1000-103.php?Lang=zh-tw）

---

### 11. audit-judgment-draft — 採購申訴審議判斷書簽文撰寫

從採購申訴審議判斷書 PDF 自動 OCR 擷取內容，產出審計機關簽辦公文（MD格式，可自動轉寄至公文系統）。

| 功能 | 說明 |
|------|------|
| PDF OCR | 自動辨識掃描判斷書 PDF，擷取全文內容 |
| 關鍵欄位抽取 | 自動抽取案號、申訴人、判斷結果、判斷理由等 |
| .di 格式解析 | 讀取 XML 格式簽文稿，顯示各欄位順序及相關字數 |
| 簽文生成 | 依審計機關簽文格式自動生成（說明二~四、說明） |
| 判斷結果分類 | 依申訴回覆/取消/不成立結果，自動調整簽文方向 |

**常用指令**：在 opencode 中說「寫判斷書簽」「申訴審議判斷書簽文」「judgment-draft」

**簽文格式規範**：
- 說明一：「本案業於...函送貴會...，擬予簽結。」
- 說明三：「經本委員會審議決定...函復（不）接受審議...。」
- 說明四：「為利...處理，請...，並將...辦理結果回報本室。」
- 簽名：依簽會單位順序審核簽名
- 附註：「以上簽核，是否准予核示？」

**需求**：Python 3.10+、pdf2image、pytesseract、Tesseract OCR（`C:\Program Files\Tesseract-OCR\tesseract.exe`）

---

### 12. final-accounts-audit-opinion — 總決算審核意見自動生成

依調查報告及核復檔案（至少 1 份報告 + 1 份核復），自動產出「重要審核意見」WORD 檔。

| 功能 | 說明 |
|------|------|
| 檔案解析 | 自動讀取調查報告 docx 及核復 docx |
| 四段式主文 | 法規背景→查核發現→審計處理→核復結果 |
| 廠商匿名化 | 自動以甲廠商/乙廠商代稱 |
| 格式規範 | P0 18pt 置中粗體、P1 18pt 粗體、P2 16pt 粗體、P3 洞察 14pt 粗體、P4 主文 12pt |
| WORD 輸出 | 產出可直接使用的 WORD 檔 |

**常用指令**：在 opencode 中說「生成總決算審核意見」「總決算審核意見」「重要審核意見」

---

### 13. ocr-scanned-files — 繁體中文掃描 OCR 轉換

使用 **PaddleOCR 3.7**（GitHub 評分最高開源多語言 OCR、82.1k 星、Apache-2.0），對無文字層之掃描 PDF/圖片批次辨識並產出 Markdown 檔。

| 功能 | 說明 |
|------|------|
| 批次 OCR | 自動批次處理標記 `status=掃描` 的 PDF/圖片，進行 OCR |
| 自動歸檔 | 依內容關鍵字歸檔至 `資料處理/1.基本資料分析` 或 `2.法規或函示` |
| 斷點續跑 | 每次處理後即時寫入處理紀錄，若中斷重複執行可接續處理 |
| 單檔容錯 | 自動跳過無法辨識的檔案，並提供錯誤訊息標記處理進度 |
| 並行處理 | 支援 `subprocess.Popen` 多程序加速處理，同時處理多份掃描檔 |
| 防毒檢測 | 技能內建「確認防毒軟體」流程（Trend Micro TSC64 軟體或 Defender 軟體可先執行掃描檢查） |

**常用指令**：在 opencode 中說「批次 OCR」「掃描件轉文字」「OCR 掃描」「ocr-scanned-files」

**命令列**：
```powershell
python ocr_scanned_files.py                          # 全量掃描 OCR（斷點續跑）
python ocr_scanned_files.py --project "指定資料夾"    # 指定專案
python ocr_scanned_files.py --limit 2                # 僅處理前 2 頁（測試）
```

**技術備註**：PaddleOCR 3.7 + paddlepaddle 3.3；務必 **設定 `enable_mkldnn=False`**（避免 CPU oneDNN 處理錯誤 `ConvertPirAttribute2RuntimeAttribute not support`）；使用 PP-OCRv5 mobile 模型（每頁耗時 1~4 秒）；側寫簽名如識別度不足需人工確認

**需求**：Python 3.10+、paddlepaddle、paddleocr 3.7+、`convert_all_to_md.py`（批次轉換）

---

## 其他技能

### 14. slides-qr-remote — HTML 簡報 QR Code 手機遙控功能

為現有 HTML 簡報（Reveal.js / Slidev / 任何 HTML）加入「手機搖控簡報」功能：聽眾以手機掃描 QR Code 即可翻上/下一頁、跳頁控制。

| 功能 | 說明 |
|------|------|
| QR Code 生成 | 主控端嵌入動態 QR Code（黑白、150px、即時更新），掃碼後跳轉至遙控頁面（含 room、編號、頁名） |
| 即時同步 | 手機端連線後控制主控端翻頁；主控端翻頁同步回手機端 |
| 防火牆穿透 | Ably 走 WSS:443，會議室/營業場所不需開放通訊埠即可連線 |
| 連線狀態燈 | 主控端右下角顯示「🟢 已連線 / ⚪ 未連線」；10 秒自動偵測裝置在線 |
| 自動重連 | 手機端離開程式時會自動重連；另外設置 10 分鐘自動斷線 |
| 全螢幕 | 主控端全螢幕按鈕（支援 webkit/ms 前綴） |

**常用指令**：在 opencode 中說「加入QR Code 手機遙控功能」「QR 手機遙控」「slides-qr-remote」

**檔案**：
- `host-embed.html` — 主控端嵌入片（CSS + HTML + 壓縮 JS，含調整碼）
- `mobile.html` — 手機端遙控頁（高度自適應小屏手機）

**技術備註**：qrcodejs（jsdelivr）+ Ably 官方 CDN（cdn.ably.com，僅 jsdelivr 對 ably 或會 404）；頻道 `slide-remote-<roomId>`；presence clientId 主控端加 `host-` / 手機端加 `mobile-`

**注意**：無需安裝套件，CDN 動態載入。**Ably API Key** 需在 `host-embed.html` 與 `mobile.html` 各自設定（設定檔內含 `PASTE_YOUR_ABLY_KEY`）。

---

### 15. opencode-backup — opencode 設定（含 MCP 伺服器）GitHub 備份

備份本機 opencode 設定（`opencode.json` / `opencode.jsonc`，含 MCP 伺服器帳號與環境變數）到 GitHub 版本控管，作為設定故障時的復原備用。

| 功能 | 說明 |
|------|------|
| 設定備份 | 複製 `opencode.json` / `opencode.jsonc` 至 `config-backup/` |
| 備份清單 | 建立 `manifest.json`（時間戳、MCP 伺服器名稱、備份檔案 SHA256） |
| 安全檢查 | push 前檢測 API Key / Token / 密碼，將關鍵值以 `<REDACTED>` 替代 |
| 版本追蹤 | Git 記錄與版本管理，可回溯任何時間點 |
| 異機還原 | 從 GitHub clone 回後即可快速還原設定 |

**常用指令**：在 opencode 中說「備份設定」「備份 MCP」「備份到 GitHub」「opencode-backup」

**目標備份**：`ymguan3-boop/audit-assistant-skills`，備份存放於 `config-backup/` 目錄

---

### 16. project-init — 新專案初始化

| 功能 | 說明 |
|------|------|
| 專案結構 | 依專案類型建立基本目錄與設定 |

**常用指令**：在 opencode 中說「初始化專案」「project-init」

---

### 17. startup — 開工自動同步

| 功能 | 說明 |
|------|------|
| 進度恢復 | 讀取上次工作進度，恢復工作環境 |
| 同步 | 開工時自動同步最新狀態 |

**常用指令**：在 opencode 中說「開工」「我來了」「上次做到哪」「startup」

---

### 18. shutdown — 收工自動同步

| 功能 | 說明 |
|------|------|
| 進度整理 | 整理工作進度，備份工作成果 |
| 同步 | 收工時自動同步最新狀態 |

**常用指令**：在 opencode 中說「收工」「下班」「結束」「shutdown」

---

### 19. html-slide-builder — Reveal.js HTML 互動簡報生成器

| 功能 | 說明 |
|------|------|
| 教材轉換 | 從教材自動生成完整互動簡報並部署至 GitHub Pages |
| AI 背景底圖 | 自動生成背景底圖 |
| 扁平化圖標 | 取代 emoji 的扁平化圖標 |
| Firebase 即時互動 | 文字雲、單選投票（Firestore 串接） |
| 滑桿視覺化 | clip-path 揭露前後對比 |

**常用指令**：在 opencode 中說「幫我做 HTML 簡報」「做 Reveal.js 簡報」「做投影片」

---

### 20. 3d-builder — 混合建模

| 功能 | 說明 |
|------|------|
| Blender 精確建模 | 產品展示、建築/室內、數位展覽、3D 遊戲、3D 動畫 |
| Hunyuan3D-2 AI 生成 | AI 生成輔助建模 |

**常用指令**：在 opencode 中說「3D 建模」「做 3D」「建立 3D 場景」「Blender 建模」

---

### 21. blandercustomize — 編輯 opencode 配置與自動化 Blender 建築模型建置

| 功能 | 說明 |
|------|------|
| opencode 配置 | opencode.json、agents、MCP、skills、plugins、permissions |
| Blender 建築模型 | 自動化建置建築模型（室內設計） |

**常用指令**：在 opencode 中說「編輯配置」「建立建築模型」「室內設計」「設定技能」

---

### 22. qrcode-game-skill — QR Code 互動遊戲系統建置

| 功能 | 說明 |
|------|------|
| 大螢幕展示 | 大螢幕展示 + 手機掃碼互動 |
| 互動模式 | 繪畫/問答/投票/派對遊戲 |
| 技術 | Ably Realtime、QRCode.js、Canvas 觸控繪圖、Gemini AI 主持 |
| 部署 | 部署至 GitHub Pages |

**常用指令**：在 opencode 中說「做 QR 遊戲」「QR Code 互動遊戲」「掃碼遊戲」

---

### 23. twgovsearch — 政府資料搜尋

| 功能 | 說明 |
|------|------|
| PCC 標案查詢 | 政府電子採購網標案查詢 |
| FJUD 判決查詢 | 司法院裁判書查詢 |
| 整合入口 | 單一入口整合兩系統 |

**常用指令**：在 opencode 中說「搜標案」「查判決」「政府資料搜尋」

---

### 影片生成類技能

#### 24. brand-promo-video-generator — 品牌宣傳影片產生器

| 功能 | 說明 |
|------|------|
| 資產驗證 | 品牌標誌、產品圖、介面截圖、官方連結驗證 |
| 品牌真相表 | 品牌事實與資產來源整理 |
| 故事主線 | 精準節拍與鏡頭規劃 |
| 生成 | 圖像、影片、配音、音樂 |
| 交付 | 組裝與出貨前審查 |

**常用指令**：在 opencode 中說「品牌宣傳」「產品廣告」「宣傳片」

#### 25. papercraft-stop-motion-explainer — 紙藝定格動畫解說產生器

| 功能 | 說明 |
|------|------|
| 紙雕效果 | 多層次紙雕效果、定格動畫節奏、物理陰影 |
| 教育解說 | 科學、教育、一般知識解說影片 |

**常用指令**：在 opencode 中說「紙藝」「定格動畫」「紙雕解說」

#### 26. paper-collage-explainer-generator — 拼貼畫風格解說影片產生器

| 功能 | 說明 |
|------|------|
| 半色調網點 | 黑白照片剪貼、觸感音效 |
| 解說影片 | 文字/觀點轉為 Vox 風格的紙拼貼動畫 |

**常用指令**：在 opencode 中說「紙拼貼」「拼貼科普」「定格拼貼」

#### 27. 3d-animation-short-generator — 3D 動畫短片產生器

| 功能 | 說明 |
|------|------|
| Pixar 風格 | 3D 渲染、角色一致性、鏡頭連續性 |
| 完整製作 | 從故事概念到完整 3D 動畫短片 |

**常用指令**：在 opencode 中說「3D 動畫」「動畫短片」「3D 故事」

#### 28. minimalist-product-ad-generator — 極簡產品廣告產生器

| 功能 | 說明 |
|------|------|
| 極簡構圖 | 高質感光影、節奏同步編輯 |
| 廣告 | Apple 風格的極簡產品廣告 |

**常用指令**：在 opencode 中說「極簡產品廣告」「Apple 風格」「電商廣告」

#### 29. music-video-subtitle-generator — MV 字幕產生器

| 功能 | 說明 |
|------|------|
| 歌詞排版 | 節奏反應式排版、多鏡頭拼接、硬切編輯 |
| 視覺效果 | 歌詞字幕與視覺效果 |

**常用指令**：在 opencode 中說「MV」「音樂影片」「歌詞字幕」「卡點MV」

#### 30. co-op-game-intro-generator — 合作遊戲開場動畫生成器

| 功能 | 說明 |
|------|------|
| 遊戲選單 UI | 角色卡片、互動動態 |
| 開場動畫 | 雙人合作遊戲的選單/開場動畫 |

**常用指令**：在 opencode 中說「遊戲開場」「雙人遊戲」「遊戲選單」

#### 31. handdrawn-live-video-generator — 手繪風格實景影片產生器

| 功能 | 說明 |
|------|------|
| 手繪質感 | 蠟筆/粉筆質感、連續變形、延遲追蹤鏡頭 |
| 實景融合 | 手繪發光動畫與實拍空間融合 |

**常用指令**：在 opencode 中說「手繪動畫」「實拍融合」「15秒變形追逐」

---

## 附錄：關於 pccsearch 與 ezbid-bidders 是否需要登入即可查詢資料？

這兩個技能**繞過**了政府網站本身的反爬蟲限制，但並非透過破解登入，而是利用第三方網站已公開的開放資料。以下詳細說明原理與使用情境。

### 核心原理：資料來源 vs. 第三方代理

| 面向 | PCC 官方網站 | 第三方代理 (此技能所用) |
|------|-------------|----------------------|
| 來源 | web.pcc.gov.tw, pcic.pcc.gov.tw | pcc.mlwmlw.org, bid.twincn.com, BidAcumen, ezbid.tw |
| 反爬機制 | **嚴格封鎖**（Attack ID 20000051） | 無限制 |
| headless 無障礙 | 阻擋 | 可正常瀏覽 |
| 是否需要登入帳號 | 需要（SSO 登入或自然人憑證） | 不需要 |
| 資料完整性 | 官方所有數據 | 部分官方（經轉載/開放資料轉存） |
| 更新頻率 | 即時 | 延遲（ezbid.tw 每日定時） |

### 1. pccsearch — 繞過 PCC 反爬尋址

**為何不需要登入（核心原因）：**

PCC 官方網站（web.pcc.gov.tw）配置了 F5 BIG-IP ASM 應用層防火牆，headless 瀏覽器發出的請求會被攔截（Attack ID 20000051），因此無法透過瀏覽器進入。所以 pccsearch **不會直接訪問 PCC 官方**，而是透過三個已公開 PCC 開放資料的第三方網站查詢：

| 來源 | 資料獲取方式 | 免登入原因 |
|------|-------------|-----------|
| **開放標案** (pcc.mlwmlw.org) | 自主整理或使用 PCC 每日公布 + data.gov.tw 開放資料集 | 資料已公開無需登入 |
| **台灣標案網** (bid.twincn.com) | 自主整理或使用 PCC 決標公告 | 查詢介面無需登入 |
| **BidAcumen** (bidacumen.com) | 自主整理 + 歷史資料集轉存 | 介面無需登入 |

**操作流程：**
```
使用者查詢 → opencode 呼叫 pccsearch
  → websearch/webfetch 選擇適合第三方網站 URL
  → 第三方網站回傳 HTML 頁面（內含標案資料）
  → AI 解析頁面內容回覆給使用者
```

**使用情境：**
- **快速查詢廠商得標金額** → 輸入案號或名稱，快速回覆
- **同業分析** → 同一標案參與廠商得標金額
- **得標比率** → 標案數量與金額統計分析
- **進階應用** → 需要 PCC 官網專屬功能（如查詢簽約金額、決標說明書）

**限制：**
- 第三方網站資料可能與 PCC 官網有時間差
- 101 年前的超舊標案可能不在開放資料庫
- 案號查詢比名稱查詢準確（避免同名公司混淆）

---

### 2. ezbid-bidders — 直接訪問 ezbid.tw 開放頁面

**為何不需要登入（核心原因）：**

ezbid.tw（台灣政府採購與標案情報網站）是一個**免費開放**的第三方標案情報來源，無須登入帳號或保存記錄。資料來源自 PCC 官方數據，每日定時更新，資料庫總數超過 556 萬筆。

ezbid.tw 的標案詳細頁面（`https://ezbid.tw/detail/{機關代號}/{標案號碼}`）**任何人都可以在瀏覽器直接打開**，無需任何驗證。而頁面上已顯示所有投標廠商名稱、得標與否、得標金額、決標時間。

**為何需要 Playwright？**

雖然 ezbid.tw 不需要登入，但該網站大量使用 JavaScript 動態渲染投標廠商的頁面。只靠 `requests` 只能取得外殼，必須透過 Playwright 驅動 Chromium 瀏覽器執行 JavaScript 後才能解析完整資料。

所以 Playwright 在這裡的作用是 **「執行 JavaScript」而非「繞過登入」**。

**操作流程：**
```
fetch_bidders.py 啟動
  → 從本地資料庫取得標案清單
  → Playwright 開啟 headless Chromium
  → 依序導覽 https://ezbid.tw/detail/{agency}/{tender_id}
  → 等待 JavaScript 動態載入（2 秒）
  → 執行 JavaScript 解析投標廠商動態 DOM
  → 將廠商名稱、是否得標、金額、時間寫入 SQLite
  → 批次 1 秒處理下一個
```

**ezbid.tw 網域特有優勢：**

| 來源 | 可取得投標廠商名單？ | 備註 |
|------|-------------------|------|
| **ezbid.tw** | ✓ 有 | **唯一可穩定取得完整投標廠商名單的第三方網站** |
| bid.twincn.com | ✓ 無 | 僅有得標廠商 |
| pcc.mlwmlw.org | ✓ 無 | 僅有得標廠商 |
| PCC 官網 | ✓ 有（被封鎖的反爬程式） | 無法使用瀏覽器 |

**使用情境：**
- **批量抓取宜蘭縣所有標案的投標廠商名單**
- **分析特定廠商投標次數與得標率**
- **比對同一標案各廠商投標金額與差額**
- **與投標廠商關聯分析等技術比對，產出個案/異常關聯總表**

**限制：**
- ezbid.tw 每日定時更新，資料非即時
- 每筆標案抓取約 1 秒，大量標案耗時較長
- 資料準確性依據 ezbid.tw 提供的解析結果

---

### 3. 當：需要登入的 pcic-export

若需要上述兩個技能無法提供的官方功能，可改用本倉庫的 **pcic-export** 技能來：

| 面向 | pccsearch / ezbid-bidders | pcic-export |
|------|--------------------------|-------------|
| 目標網站 | 第三方公開網站 | **PCIC 官方系統** (pcic.pcc.gov.tw) |
| 是否需要登入 | ✓ 不需要 | ✓ **需要內部帳號 + SSO** |
| 瀏覽器主要用途 | 執行 JavaScript（非繞過登入） | 自動輸入帳密、操作 Angular SPA |
| 技術難度 | 低（無需處理 SSO） | 高（需處理 SSO、session、CSRF Token） |
| 資料權限 | 僅開放資料查詢 | 官方內部、簽核等級資料 |

**總結一句話：**
> pccsearch 和 ezbid-bidders **不需要登入是因由資訊源**已公開且開放於第三方網站，而非繞過登入。這不是駭入與破解，而是透過開放資料的智慧運用。

---

## 安裝方式

將 skills 目錄下的技能複製到 opencode 配置目錄：

```bash
%USERPROFILE%\.config\opencode\skills\{技能名稱}\SKILL.md
```

或於 `opencode.json` 設定技能庫路徑（全域通用）：

```json
"skills": {
  "paths": ["D:\\opencode_0519\\skills"]
}
```

於 `opencode.json` 中授權技能：

```json
"permission": {
  "skill": {
    "pccsearch": "allow",
    "fjudsearch": "allow",
    "lvrlandmoigov": "allow",
    "pcic-export": "allow",
    "qgisskill": "allow",
    "gis3d-development-impact": "allow",
    "audit-secondbrain": "allow",
    "ezbid-bidders": "allow",
    "audit-report-builder": "allow",
    "gov-intelligence": "allow",
    "audit-info-publish": "allow",
    "audit-judgment-draft": "allow",
    "final-accounts-audit-opinion": "allow",
    "ocr-scanned-files": "allow",
    "slides-qr-remote": "allow",
    "opencode-backup": "allow"
  }
}
```

## 相關資源

- [opencode](https://opencode.ai) — AI 輔助開發工具
- [內政部不動產交易實價登錄查詢服務網](https://lvr.land.moi.gov.tw)
- [政府電子採購網](https://web.pcc.gov.tw)
- [司法院裁判書查詢](https://judgment.judicial.gov.tw)
- [公共工程雲端服務網](https://pcic.pcc.gov.tw)
- [台灣政府採購與標案情報站](https://ezbid.tw)
