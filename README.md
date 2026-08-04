# audit-assistant-skills

審計輔助應用技能倉庫 — 提供 opencode 技能，輔助審計人員快速查詢政府開放資料及不動產交易資訊。

## 技能一覽

| 圖示 | 技能 | 用途 |
|------|------|------|
| 🔍 | pccsearch | 政府電子採購網標案查詢 |
| ⚖️ | fjudsearch | 司法院裁判書判決查詢 |
| 🏠 | lvrlandmoigov | 內政部不動產實價登錄查詢 |
| 🏗️ | pcic-export | 公共工程雲端服務網標案資料匯出（支援 `--yilan` 全額度匯出） |
| 🗺️ | qgisskill | QGIS 地圖自動化（宜蘭縣地理資訊系統） |
| 🧠 | audit-secondbrain | 審計第二大腦 Obsidian 知識管理系統 |
| 📋 | ezbid-bidders | ezbid.tw 投標廠商資料抓取（各標案投標廠商列表） |
| 📝 | audit-report-builder | 審計機關聯合稽察調查報告彙整（從調查計畫與工作底稿自動產出 Word 報告） |
| 📡 | gov-intelligence | 政府地方情資分析（每日主動巡查行政區域重要資訊，分析事件發展，辨識風險） |
| 📰 | audit-info-publish | 重要政府審計資訊撰寫（分析主題資料、搜尋官網類似案例、依格式撰寫發布稿） |
| ⚖️ | audit-judgment-draft | 採購申訴審議判斷書簽文撰寫（OCR判斷書PDF、自動產出審計機關簽辦公文） |
| 💾 | opencode-backup | opencode 設定（含 MCP 伺服器）GitHub 備份 |

---

## 技能分類

| 分類 | 技能 |
|------|------|
| 政府採購/標案 | pccsearch、pcic-export、ezbid-bidders |
| 司法/判決 | fjudsearch |
| 不動產/地政 | lvrlandmoigov、qgisskill |
| 審計作業 | audit-secondbrain、audit-report-builder、audit-judgment-draft、audit-info-publish |
| 情報分析 | gov-intelligence |
| 其他技能 | opencode-backup |

---

## 技能列表

### 1. pccsearch — 政府電子採購網（PCC）標案查詢

查詢政府採購標案，掌握廠商得標/未得標紀錄、決標金額與歷史軌跡。

| 功能 | 說明 |
|------|------|
| 統編查詢 | 輸入統一編號，查出該廠商所有參與標案 |
| 廠商名稱查詢 | 依廠商名搜尋得標/未得標紀錄 |
| 標案比價 | 同一標案不同廠商投標金額比較 |
| 歷史追蹤 | 跨年度標案歷程分析 |

**如何使用**：在 opencode 中說「搜標案」「查標案」「pccsearch」

**串接平台**：開放政府標案(pcc.mlwmlw.org)、台灣標案網(bid.twincn.com)、BidAcumen

---

### 2. fjudsearch — 司法院裁判書系統（FJUD）判決查詢

查詢司法院各級法院裁判書，追蹤廠商/個人涉訟紀錄與法律見解。

| 功能 | 說明 |
|------|------|
| 判決字號查詢 | 依年度+字號+號碼直接定位判決 |
| 當事人查詢 | 依公司名/個人姓名搜尋涉訟紀錄 |
| 支付命令查詢 | 快速篩選非訟程序案件 |
| 憲法判決查詢 | 憲法法庭最新判決與暫時處分 |

**如何使用**：在 opencode 中說「查判決」「裁判書」「fjudsearch」

**串接網站**：FJUD 裁判書查詢(judgment.judicial.gov.tw)、憲法法庭(cons.judicial.gov.tw)、法學資料檢索(law.judicial.gov.tw)

---

### 3. lvrlandmoigov — 內政部不動產交易實價登錄查詢

查詢內政部不動產交易實價登錄資料，支援預售屋、買賣、租賃三種交易類型。

| 功能 | 說明 |
|------|------|
| 預售屋查詢 | 依縣市/行政區查詢預售屋交易，含建案名稱、單價(萬/坪)、總價、坪數、房型 |
| 買賣行情 | 成屋交易區域均價、單價區間 |
| 建案查詢 | 輸入建案名稱取得所有交易明細 |
| 路段行情 | 依路段查詢周邊成交紀錄 |

**如何使用**：在 opencode 中說「實價登錄」「查房價」「lvrlandmoigov」

**資料來源**：內政部不動產交易實價查詢服務網、opendata.vip、樂居、樂屋網、永慶、信義、591

---

### 4. pcic-export — 公共工程雲端服務網（PCIC）標案資料匯出

自動化操作 PCIC 機關端，匯出「標案自選欄位表」Excel 檔案，可作為資料庫使用。

| 功能 | 說明 |
|------|------|
| 自動導航 | 點擊「標案管理」→「報表查詢」→「標案自選欄位表」 |
| 宜蘭縣全額度匯出 | `--yilan` 參數自動設定：機關=宜蘭縣政府、列印層級=含所屬機關、預算=0起 |
| 預算篩選 | 自動將「發包預算」設為最小值（0萬元起） |
| 查詢匯出 | 執行查詢後透過「匯出」下拉選單下載 EXCEL |
| 檔案通訊 | 腳本與 AI 透過 `_status.txt` / `_cmd.txt` 檔案同步 |

**便捷指令**：在 opencode 中說「匯出標案管理系統中宜蘭縣所屬機關的所有資料」

**其他使用方式**：「抓 PCIC」「匯出標案」「pcic-export」「公共工程」

**命令列**：
```bash
python run_export.py --yilan          # 宜蘭縣全額度匯出（推薦）
python run_export.py                  # 預設模式
python run_export.py --export-dir DIR # 指定匯出目錄
```

**資料來源**：公共工程雲端服務網（pcic.pcc.gov.tw）

---

### 5. qgisskill — QGIS 地圖自動化（宜蘭縣地理資訊系統）

自動建立 QGIS 專案，載入宜蘭縣界、鄉鎮市界線、OpenStreetMap 底圖與地址點位分析。

| 功能 | 說明 |
|------|------|
| 地理資料下載 | 從 g0v/twgeojson 下載台灣縣市及鄉鎮市界線，篩選宜蘭縣 |
| QGIS 專案建立 | 自動建立含 OpenStreetMap 底圖、縣界、鄉鎮市界線的 QGIS 專案 |
| 圖層樣式設定 | 縣界黑色邊框1.5mm、鄉鎮市紅色邊框1.2mm，填色透明度70% |
| 地址地理編碼 | 讀取 CSV/XLSX 地址資料，自動解析鄉鎮市、Nominatim 查詢座標、加入亂數位移避免重疊 |
| 圖層疊合 | 支援瓦斯行、儲存場所等點位圖層，依類型分類著色 |

**如何使用**：在 opencode 中說「qgisskill」「QGIS 技能」

**參考資料**：`town_coords.json`（宜蘭縣12鄉鎮中心點座標）

---

### 6. audit-secondbrain — 審計第二大腦（Obsidian + OpenCode 知識管理系統）

建置審計專屬的 AI 第二大腦，自動批次轉換查核文件、生成調查計畫與工作底稿。

| 功能 | 說明 |
|------|------|
| 批次轉換 | docx/xlsx/pdf/圖片 → markdown，自動分類歸檔 |
| 調查計畫生成 | 含相關法規及連結（自動 PCode 查詢）、調閱資料清單、缺失評估問卷 |
| 工作底稿生成 | 四階段標準化結構（標題、依據、查核事實、擬議處理意見） |
| 知識重整 | 每週自動執行 Karpathy 式七步驟知識重整 |
| 法規查詢 | get_pcode.py 自動查詢全國法規資料庫 PCode |

**如何使用**：在 opencode 中說「第二大腦」「審計第二大腦」「audit-secondbrain」

**完整指南**：`skills/audit-secondbrain/審計第二大腦設定指南Obsidian_(安裝及調查計畫與工作底稿生成).md`（1286 行，15 階段完整操作步驟，可直接餵給 OpenCode 執行）

**開工收工初始化**：`skills/audit-secondbrain/審計第二大腦開工收工初始化技能.md` — 每日開工/收工自動同步 Obsidian 第二知識大腦，含 Git 自動提交、OCR 轉換、MCP Vault 批次查詢與筆記索引更新

---

### 7. ezbid-bidders — ezbid.tw 投標廠商資料抓取

從台灣政府採購與標案情報站（ezbid.tw）抓取各標案的投標廠商列表，解析廠商名稱、是否得標、投標金額與價差。

| 功能 | 說明 |
|------|------|
| 投標廠商抓取 | 從 ezbid.tw 逐一訪問標案頁面，解析完整投標廠商列表 |
| 得標分析 | 記錄各廠商是否得標、投標金額、與底價/預算價差 |
| 批次抓取 | 支援全量抓取或限制筆數（`--limit`）、測試模式（`--test`） |
| 本地資料庫 | 資料存入 SQLite，可直接 SQL 查詢特定標案或廠商投標紀錄 |

**如何使用**：在 opencode 中說「抓投標廠商」「投標廠商資料」「ezbid-bidders」

**資料來源**：ezbid.tw（台灣政府採購與標案情報站），資料源自政府電子採購網（PCC），每日更新三次

**命令列**：
```bash
python fetch_bidders.py              # 抓取所有標案
python fetch_bidders.py --limit 10   # 僅抓取前10筆
python fetch_bidders.py --test       # 測試模式（僅抓取1筆）
python fetch_bidders.py --db PATH    # 指定資料庫路徑
```

---

### 8. audit-report-builder — 審計機關聯合稽察調查報告彙整

依審計機關聯合稽察調查報告格式，從調查計畫與工作底稿自動產出彙整報告。

| 功能 | 說明 |
|------|------|
| 格式自動化 | 依審計報告格式（壹~玖章），自動設定縮排、粗體、標楷體 16pt |
| 多來源合併 | 支援 1 份調查計畫 + 多份工作底稿，合併為完整報告 |
| 章節結構 | 查核緣起→查核依據→查核範圍→查核限制→查核重點→查核事實→查核意見→擬議處理意見→附錄 |
| 表格處理 | 自動帶入報告模板，調整表格標題與內文字型大小 |

**如何使用**：在 opencode 中說「彙整調查報告」「做報告」「audit-report」

**命令列**：
```powershell
python build_report.py --plan "調查計畫.docx" --workpapers "底稿1.docx" --workpapers "底稿2.docx" --output "報告.docx"
```

**依賴**：Python 3.10+、python-docx、pywin32（僅 .doc 格式需要）

---

### 9. gov-intelligence — 政府地方情資分析

每日主動巡查指定行政區域的重要資訊，進行深度分析並產出情資報告。

| 功能 | 說明 |
|------|------|
| 多源搜尋 | Google News、Yahoo、政府網站、社群平台、Open Data |
| 自動分類 | 政策、工程、交通、採購、法規、AI、教育、環保、財政等16類 |
| 重要程度評估 | 五星制評分（★★★★★ 重大事件 → ★☆☆☆☆ 可忽略） |
| 事件融合 | 多篇新聞屬於同一事件時自動合併 |
| 異常偵測 | 同一路段重複施工、追加預算、流標等異常模式 |
| 風險分析 | 工程、財務、法規、政治、民意、施工、AI、資安風險評估 |
| 審計觀點 | 自動思考是否值得查核、是否有浪費公帑或制度問題 |
| 可信度評分 | 官方+40、中央+30、地方+20、新聞+10、社群+5、匿名-20 |
| 未來預測 | 預測未來7天、30天、90天的事件發展 |
| 搜尋時間自訂 | 每次使用可選擇最近1天、7天、30天或自訂天數 |
| 第二大腦關聯分析 | 分析完成後可選擇與 Obsidian 既有資料進行關聯性比對與報告更新 |

**如何使用**：在 opencode 中說「情資分析」「地方情資」「查地方新聞」「gov-intelligence」

**搜尋範圍**：地方建設、公共工程、道路、橋梁、交通、停車、BOT、採購、招標、決標、地方預算、議會質詢、法規修正、都市計畫、重大建設、觀光、教育、消防、災害、河川、水利、農業、AI、數位治理、智慧城市、GIS、BIM、道路養護、社福、醫療、人口、財政、基金、環保、能源、治安、犯罪、重大事故

---

### 10. audit-info-publish — 重要政府審計資訊撰寫

依審計部官網「重要政府審計資訊」格式，自動撰寫正式發布稿。

| 功能 | 說明 |
|------|------|
| 資料分析 | OCR 掃描檔轉文字、解析案件背景、查核發現、改善成果 |
| 官網搜尋 | 前往審計部官網搜尋近2年類似案例，分析標題與內文格式 |
| 稿件撰寫 | 四段式標準結構（摘要→背景→查核發現→改善成果） |
| 格式規範 | 全形空格、機關簡稱、民國紀年、金額單位等用語自動統一 |
| 稿件存檔 | 存至使用者指定路徑，同步至第二大腦 |

**如何使用**：在 opencode 中說「寫審計資訊」「審計資訊發布」「重要政府審計資訊」「audit-info-publish」

**參考網站**：審計部重要政府審計資訊列表（https://www.audit.gov.tw/p/412-1000-103.php?Lang=zh-tw）

---

### 11. audit-judgment-draft — 採購申訴審議判斷書簽文撰寫

從採購申訴審議判斷書PDF自動OCR擷取內容，產出審計機關簽辦公文（MD格式，可直接複製貼入公文系統）。

| 功能 | 說明 |
|------|------|
| PDF OCR | 自動辨識掃描版判斷書PDF，擷取全文內容 |
| 關鍵資訊擷取 | 自動提取案號、當事人、判斷結果、判斷理由等 |
| .di描述檔解析 | 讀取XML格式來文描述檔，精確取得來文字號、主旨等 |
| 簽辦公文產出 | 依審計機關簽文格式自動產出（說明二~四、擬辦） |
| 判斷結果對應 | 依申訴駁回/有理由/不受理等結果，自動調整擬辦方向 |

**如何使用**：在 opencode 中說「寫判斷書簽」「申訴審議判斷書簽文」「judgment-draft」

**簽文格式規範**：
- 說明二：「旨案緣係……遂向工程會申訴。」
- 說明三：「經據工程會檢送旨案採購申訴審議判斷書略以：……等情。」
- 說明四：「另據……規定，……，擬函請……，並將……結果復知本室。」
- 擬辦：依說明四所簽內容分條列述
- 結語：「以上所擬，是否有當？敬請核示」

**依賴**：Python 3.10+、pdf2image、pytesseract、Tesseract OCR（`C:\Program Files\Tesseract-OCR\tesseract.exe`）

---

### 12. opencode-backup — opencode 設定（含 MCP 伺服器）GitHub 備份

備份本機 opencode 設定（`opencode.json` / `opencode.jsonc`，含 MCP 伺服器清單與環境變數）至 GitHub 儲存庫，作為設定檔版本控制與跨機還原之用。

| 功能 | 說明 |
|------|------|
| 設定備份 | 複製 `opencode.json` / `opencode.jsonc` 至 `config-backup/` |
| 備份清單 | 產生 `manifest.json`（時間戳、MCP 伺服器名稱、各檔案 SHA256） |
| 安全檢查 | push 前掃描 API Key / Token / 密碼，機敏值以 `<REDACTED>` 取代 |
| 版本控制 | Git 提交與推送，歷史版本可回溯 |
| 跨機還原 | 從 GitHub clone 回本機即可還原整份設定 |

**如何使用**：在 opencode 中說「備份設定」「備份 MCP」「備份到 GitHub」「opencode-backup」

**目標儲存庫**：`ymguan3-boop/audit-assistant-skills`，備份檔存放於 `config-backup/` 目錄

---

## 補充說明：為何 pccsearch 與 ezbid-bidders 不需登入即可爬取資料？

這兩個技能**繞過**了政府官方網站的反爬機制，但並非透過破解登入，而是利用第三方平台早已公開的彙整資料。以下詳細說明其原理與使用情境。

### 核心原因：資料源頭 vs. 第三方轉介

| 面向 | PCC 官方網站 | 第三方平台 (本技能所用) |
|------|-------------|----------------------|
| 網址 | web.pcc.gov.tw, pcic.pcc.gov.tw | pcc.mlwmlw.org, bid.twincn.com, BidAcumen, ezbid.tw |
| 防護等級 | **嚴格反爬**（Attack ID 20000051） | 無防護 |
| headless 瀏覽器 | 封鎖 | 可正常存取 |
| 是否需要機關憑證 | 需要（SSO 登入或自然人憑證） | 不需要 |
| 資料範圍 | 完整官方資料 | 部分或近乎完整（經爬蟲/開放資料取得） |
| 更新時效 | 即時 | 有延遲（ezbid.tw 每日三次） |

### 1. pccsearch — 繞過 PCC 反爬的策略

**不用登入的真正原因：**

PCC 官方網站（web.pcc.gov.tw）部署了 F5 BIG-IP ASM 應用層防火牆，headless 瀏覽器發出的請求會被攔截（Attack ID 20000051），連首頁都無法載入。因此 pccsearch **不直接碰 PCC 官網**，而是透過三個已事先抓取 PCC 開放資料的第三方平台查詢：

| 平台 | 資料獲取方式 | 免登入原因 |
|------|-------------|-----------|
| **開放政府標案** (pcc.mlwmlw.org) | 自主爬蟲抓取 PCC 每日公告 + data.gov.tw 開放資料集 | 站方已爬好，公開展示 |
| **台灣標案網** (bid.twincn.com) | 自主爬蟲抓取 PCC 決標公告 | 查詢頁面開放無牆 |
| **BidAcumen** (bidacumen.com) | 自主爬蟲 + 歷史資料彙整 | 完全公開搜尋 |

**運作流程：**
```
使用者查詢 → opencode 呼叫 pccsearch
  → websearch/webfetch 直接訪問第三方平台 URL
  → 第三方平台回傳 HTML 頁面（已含標案資料）
  → AI 解析頁面內容回報給使用者
```

**使用情境：**
- **快速查詢廠商得標紀錄** — 輸入統編或名稱，秒級回傳
- **比價分析** — 同一標案不同廠商投標金額比較
- **歷史追蹤** — 跨年度標案歷程分析
- **不適用情境**：需要 PCC 機關端專屬功能（如調閱內部簽呈、未公開底價）

**限制：**
- 第三方平台的資料可能與 PCC 官方有時間差
- 101 年前的歷史標案可能不在開放資料範圍內
- 統編查詢比名稱查詢精準（避免同名混淆）

---

### 2. ezbid-bidders — 直接爬取 ezbid.tw 公開頁面

**不用登入的真正原因：**

ezbid.tw（台灣政府採購與標案情報站）是一個**完全公開**的第三方標案資訊網站，無任何登入牆或存取限制。其資料來自 PCC 官方開放資料，每日更新三次，資料庫總量超過 556 萬筆。

ezbid.tw 的標案詳細頁面（`https://ezbid.tw/detail/{機關代碼}/{標案案號}`）**任何人都可以直接在瀏覽器中打開**，無需任何憑證。該頁面以表格呈現所有投標廠商名稱、得標狀態、投標金額等資訊。

**為何仍然需要 Playwright？**

雖然 ezbid.tw 不需要登入，但其頁面使用 JavaScript 動態渲染投標廠商表格。單純用 `requests` 只能拿到空白外殼，必須透過 Playwright 啟動 Chromium 瀏覽器來完整渲染頁面後才能解析資料。

所以 Playwright 在這裡的用途是 **「渲染 JavaScript」而非「繞過登入」**。

**運作流程：**
```
fetch_bidders.py 執行
  → 從本地資料庫取得標案清單
  → Playwright 開啟 headless Chromium
  → 逐個導航至 https://ezbid.tw/detail/{agency}/{tender_id}
  → 等待 JavaScript 渲染完成（2 秒）
  → 執行 JavaScript 解析投標廠商表格 DOM
  → 將廠商名稱、是否得標、投標金額等存入 SQLite
  → 間隔 1 秒後處理下一筆
```

**ezbid.tw 的獨特價值：**

| 平台 | 有完整投標廠商列表？ | 備註 |
|------|-------------------|------|
| **ezbid.tw** | ✅ 有 | **唯一可穩定存取完整投標列表的第三方平台** |
| bid.twincn.com | ❌ 無 | 僅有得標廠商 |
| pcc.mlwmlw.org | ❌ 無 | 僅有得標廠商 |
| PCC 官方 | ✅ 有（但被反爬阻擋） | 無法直接存取 |

**使用情境：**
- **批次抓取宜蘭縣所有標案的投標廠商名單**
- **分析特定廠商投標頻率與得標率**
- **比對同一標案各廠商投標金額與價差**
- **與「投標廠商研析」模組搭配，找出圍標/陪標異常模式**

**限制：**
- ezbid.tw 每日更新三次，資料非即時
- 每次請求間隔 1 秒，大量抓取較耗時
- 資料正確性依賴 ezbid.tw 的解析品質

---

### 3. 對比：需要登入的 pcic-export

為凸顯上述兩個技能不需登入的特殊性，可與同倉庫中的 **pcic-export** 技能對照：

| 面向 | pccsearch / ezbid-bidders | pcic-export |
|------|--------------------------|-------------|
| 目標網站 | 第三方公開平台 | **PCIC 機關端** (pcic.pcc.gov.tw) |
| 是否需要登入 | ❌ 不需要 | ✅ **需要機關憑證 + SSO** |
| 瀏覽器用途 | 渲染 JavaScript（非繞過驗證） | 自動填寫帳密、操作 Angular SPA |
| 技術複雜度 | 低（直連公開 URL） | 高（需處理 SSO、session、CSRF Token） |
| 資料特權 | 僅開放資料範圍 | 含預算、簽核等內部資料 |

**總結一句話：**
> pccsearch 和 ezbid-bidders **不登入是因為它們根本不連官方系統**，而是連線到已將官方資料公開出去的第三方平台。這不是繞過資安，而是換一條路走。

---

## 安裝方式

將 skills 目錄下的技能複製至 opencode 設定目錄：

```bash
%USERPROFILE%\.config\opencode\skills\{技能名稱}\SKILL.md
```

在 `opencode.json` 中註冊權限：

```json
"permission": {
  "skill": {
    "pccsearch": "allow",
    "fjudsearch": "allow",
    "lvrlandmoigov": "allow",
    "pcic-export": "allow",
    "qgisskill": "allow",
    "audit-secondbrain": "allow",
    "ezbid-bidders": "allow",
    "audit-report-builder": "allow",
    "gov-intelligence": "allow",
    "audit-info-publish": "allow",
    "audit-judgment-draft": "allow",
    "opencode-backup": "allow"
  }
}
```

## 相關連結

- [opencode](https://opencode.ai) — AI 輔助程式開發工具
- [內政部不動產交易實價查詢服務網](https://lvr.land.moi.gov.tw)
- [政府電子採購網](https://web.pcc.gov.tw)
- [司法院裁判書查詢](https://judgment.judicial.gov.tw)
- [公共工程雲端服務網](https://pcic.pcc.gov.tw)
- [台灣政府採購與標案情報站](https://ezbid.tw)
