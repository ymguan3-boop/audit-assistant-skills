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

### 6. audit-secondbrain — 審計第二大腦（Obsidian + Claude Code 知識管理系統）

建置審計專屬的 AI 第二大腦，自動批次轉換查核文件、生成調查計畫與工作底稿。

| 功能 | 說明 |
|------|------|
| 批次轉換 | docx/xlsx/pdf/圖片 → markdown，自動分類歸檔 |
| 調查計畫生成 | 含相關法規及連結（自動 PCode 查詢）、調閱資料清單、缺失評估問卷 |
| 工作底稿生成 | 四階段標準化結構（標題、依據、查核事實、擬議處理意見） |
| 知識重整 | 每週自動執行 Karpathy 式七步驟知識重整 |
| 法規查詢 | get_pcode.py 自動查詢全國法規資料庫 PCode |

**如何使用**：在 opencode 中說「第二大腦」「審計第二大腦」「audit-secondbrain」

**完整指南**：`skills/audit-secondbrain/審計第二大腦設定指南Obsidian_(安裝及調查計畫與工作底稿生成).md`（1286 行，15 階段完整操作步驟，可直接餵給 Claude Code 執行）

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
    "audit-secondbrain": "allow"
  }
}
```

## 相關連結

- [opencode](https://opencode.ai) — AI 輔助程式開發工具
- [內政部不動產交易實價查詢服務網](https://lvr.land.moi.gov.tw)
- [政府電子採購網](https://web.pcc.gov.tw)
- [司法院裁判書查詢](https://judgment.judicial.gov.tw)
- [公共工程雲端服務網](https://pcic.pcc.gov.tw)
