---
name: twgovsearch
description: 政府資料搜尋 — 政府電子採購網（PCC）標案查詢 + 司法院裁判書系統（FJUD）判決查詢。說「搜標案」「查判決」「政府資料搜尋」時載入
---

# 政府電子採購網（PCC）搜尋方法

## 可用工具
1. **websearch** — 快速取得標案概況
2. **webfetch** — 直接抓取第三方彙整平台頁面
3. **Playwright MCP**（playwright_browser_*） — 瀏覽器直接操作 bid.twincn.com 等平台

## 關鍵第三方平台（均串接 PCC 官方資料）

| 平台 | 網址 | 特點 |
|------|------|------|
| 開放政府標案 | https://pcc.mlwmlw.org/merchants/{統編} | 快速查統編所有標案，附決標公告 XML 連結 |
| 台灣標案網 | https://bid.twincn.com/lm.aspx?q={廠商名} | 得標/未得標分類，含金額、廠商列表 |
| BidAcumen | https://bidacumen.com/s/v-{廠商名}_{統編} | 較完整歷史紀錄，11+ 筆 |
| **台灣政府採購與標案情報站** | https://ezbid.tw/ | 🔥 **最佳反爬替代方案**，有預算過濾（含5000萬以上）、工程/勞務/財物分類、完整投標廠商列表、67+ 頁歷史資料 |

## 搜尋流程

### Step 0 — 大範圍搜尋（推薦）：用 Playwright 操作 ezbid.tw
直接導航至過濾後的搜尋 URL：
```
playwright_browser_navigate https://ezbid.tw/?q={關鍵字}&cat={分類}&price_range={預算區間}
```
- 分類：`WORK`（工程）、`SERV`（勞務）、`PPTY`（財物）
- 預算區間：`huge`（5000萬以上）、`large`（1000~5000萬）、`medium`（100~1000萬）
- 🔥 **實例 — 宜蘭縣5000萬以上工程**：
  ```
  playwright_browser_navigate https://ezbid.tw/?q=宜蘭&cat=WORK&price_range=huge
  ```
- 分頁：加 `&page=2`、`&page=3` ...（ezbid.tw 通常有數十頁）
- 查看個案詳細投標廠商：點擊標案名稱連結
- 詳情頁會列出所有投標廠商、投標金額、得標/未得標狀態

### Step 1 — 用 websearch 初步搜尋
```
"冠育土木包工業" 得標 決標
"冠育土木包工業" site:bid.twincn.com
```

### Step 2 — 用 webfetch 抓取第三方平台
```
webfetch https://pcc.mlwmlw.org/merchants/{統編}
webfetch https://bid.twincn.com/c.aspx?sn={廠商sn碼}
```

### Step 3 — 用 Playwright 操作 bid.twincn.com（限精準查詢）
可直接用瀏覽器工具導航至：
```
https://bid.twincn.com/lm.aspx?q={URL編碼後的廠商名}&t=1
```
優點：可點擊查看各標案明細（得標金額、未得標廠商名單）
⚠️ 缺點：最多回傳 50 筆，無分頁，不適合大範圍搜尋

### Step 4 — 交叉比對
- **ezbid.tw** 🔥 首選 — 有預算過濾、分類過濾、完整投標廠商列表、數十頁歷史資料
- pcc.mlwmlw.org 資料較簡潔，適合快速看統編所有標案
- bid.twincn.com 有得標/未得標分類及完整金額，但僅限最近50筆
- BidAcumen 歷史資料最完整

## 反爬蟲實戰技巧（2026年驗證有效）

### PCC 官方封鎖特徵
- **web.pcc.gov.tw** 使用 Akamai CDN 防護（Attack ID 20000051）
- 即使使用 Playwright 真實瀏覽器仍會顯示 "The URL you requested has been blocked"
- headless 模式、requests/webfetch 全部被封鎖

### 最佳反爬替代方案：ezbid.tw（實測可用）
| 功能 | URL 模式 | 說明 |
|------|---------|------|
| 關鍵字搜尋 | `https://ezbid.tw/?q={關鍵字}` | 搜尋標案名稱、機關、廠商 |
| 工程類 | `https://ezbid.tw/?cat=WORK` | 另可選 SERV（勞務）、PPTY（財物） |
| 5000萬以上 | `https://ezbid.tw/?price_range=huge` | huge=5000萬以上，large=1000~5000萬 |
| **合併過濾** | `https://ezbid.tw/?q=宜蘭&cat=WORK&price_range=huge` | 🔥 最常用組合 |
| 分頁 | `&page=2` | 附加在 URL 後面 |
| 個案詳情 | `https://ezbid.tw/detail/{機關代碼}/{案號}` | 含完整投標廠商列表與金額 |

搜尋時只需用 `playwright_browser_navigate` 前往上述 URL，即可取得完整結果。

### bid.twincn.com 特性
- 有反爬但比 PCC 寬鬆，Playwright 可正常操作
- **限制**：搜尋最多回傳 50 筆結果，無分頁
- 適合精準搜尋特定廠商或關鍵字，不適合大範圍搜尋
- 個案頁面 URL：`https://bid.twincn.com/item.aspx?sn={sn碼}`

### 通用反爬策略
1. **優先順序**：ezbid.tw > bid.twincn.com > pcc.mlwmlw.org > web.pcc.gov.tw（永遠跳過）
2. **Playwright > webfetch**：有 JS 渲染的頁面一律用 Playwright
3. **搜尋範圍縮小**：先加 budget/type/location 過濾，避免一次回傳過多結果
4. **CSV 匯出編碼**：若匯出 CSV 給 Excel 開啟會亂碼，須使用 **UTF-8 with BOM** 編碼

## 注意事項
- PCC 官方網站（web.pcc.gov.tw）有嚴格反爬機制（Attack ID 20000051），永遠無法直接存取
- 請優先使用第三方彙整平台而非直接連 PCC
- 101 年前的歷史標案可能不在開放資料範圍內
- 統編查詢比廠商名稱更精準（避免同名不同廠商混淆）

---

# 司法院裁判書系統（FJUD）搜尋方法

## 可用工具
1. **websearch** — 搜尋判決字號或案情關鍵字
2. **Playwright MCP**（playwright_browser_*） — 瀏覽器操作 FJUD 系統

## 搜尋網站
- **FJUD 裁判書查詢**: https://judgment.judicial.gov.tw
- **憲法法庭**: https://cons.judicial.gov.tw
- **司法院主網**: https://www.judicial.gov.tw

## 搜尋流程

### Step 1 — 用判決字號直接搜尋
```
"115年憲判字第2號" 陳冠均
"114年度司促字第3973號"
```

### Step 2 — 用關鍵字搜尋
```
"陳冠均" "判決" site:judgment.judicial.gov.tw
"冠育土木包工業" "支付命令"
```

### Step 3 — 直接操作 FJUD 網站（Playwright）
```
playwright_browser_navigate https://judgment.judicial.gov.tw
```
然後在搜尋框輸入關鍵字（如「冠育土木包工業」）。

### Step 4 — 下載判決
FJUD 支援 PDF 下載，可用 Playwright 點擊下載按鈕取得全文。

## 注意事項
- FJUD 也有反爬機制，headless 模式可能被阻擋
- 有些舊判決或簡易判決（如支付命令）可能只有摘要
- 憲法法庭判決可從 cons.judicial.gov.tw 下載完整 PDF
- 下級審判決可透過引用字號反查

---

# 通用技巧

1. **統編是萬用 key** — PCC、公司登記、關係企業查詢都用統編串接
2. **廠商舊名稱也要查** — 冠育土木包工業原名全晟土木包工業，舊名標案也要搜
3. **地址異動追蹤** — 不同時期的標案可能用不同地址（如群英路 vs 冬山路 vs 鹿埔路）
4. **得標/未得標都要看** — 未得標案件同樣是投標行為紀錄
