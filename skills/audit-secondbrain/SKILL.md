---
name: audit-secondbrain
description: 審計第二大腦安裝與知識管理 — Obsidian + OpenCode MCP Vault 設定、批次轉換與分類（/資料處理）、查核意見四層歸檔、每週知識重整。說「第二大腦」「審計第二大腦」「audit-secondbrain」「obsidian 設定」「知識重整」「/資料處理」時載入；生成調查計畫用 audit-investigation-plan，生成工作底稿或查核意見用 audit-working-paper。
---

# 審計第二大腦（安裝與知識管理）

> 完整安裝步驟見 `references/setup-guide.md`（原 1,286 行指南）。
> 本技能只負責「建置與知識管理」；產出文件由另兩支技能負責：
> - 調查計畫 → `audit-investigation-plan`
> - 工作底稿／查核意見 → `audit-working-paper`

## 什麼是審計第二大腦？

一個基於 Obsidian + OpenCode（MCP Vault）的審計專屬 AI 知識管理系統：

- ✅ 批次轉換 docx/xlsx/pdf/圖片 → markdown
- ✅ 自動分類查核報告、法規、查核意見（四層結構）
- ✅ 查核意見總整理／明細自動維護
- ✅ 每週自動知識重整
- ✅ 法規 PCode 查詢（get_pcode.py）
- ➡️ 調查計畫生成 → 見 `audit-investigation-plan`
- ➡️ 工作底稿／查核意見生成 → 見 `audit-working-paper`

## 系統架構

```
資料蒐集/  →  資料處理/  →  資料庫建置及產出/
（原始檔）    （轉MD+分類）    （調查計畫/工作底稿/分析報告）
```

## 先備條件

- Obsidian（知識庫軟體）
- Node.js、Python 3.8+
- 網路連線

## 設定流程（15 大步驟）

| 階段 | 步驟 | 說明 |
|---|---|---|
| 一 | 環境檢查 | Node.js、Pandoc、Tesseract OCR、Python 套件、Selenium |
| 二 | 認識使用者 | 職系、單位、語言偏好 |
| 三 | 安裝 Obsidian + 建立 Vault | 三層資料夾結構 |
| 四 | 連接 MCP | 安裝 mcpvault，讓 OpenCode 讀寫筆記 |
| 五 | 建立 CLAUDE.md | 工作規則（分類、批次轉換、生成原則） |
| 六 | 建立 Templates | 工作日誌、週計畫、知識庫頁面 |
| 七 | 建立知識庫初始檔案 | index.md + log.md |
| 八 | 設定 Web Clipper | 剪藏存至 `資料蒐集/` |
| 九 | 設定每週知識重整排程 | 每週日七步驟重整 |
| 十 | 建立歡迎筆記 + 驗證 | 最終驗證清單 |
| 十一 | 產出文件 | 改用 `audit-investigation-plan`、`audit-working-paper` |
| 十二 | 批次轉換既有檔案 | `/資料處理` 一鍵轉換 |

## 查核意見分類規則（四層結構）

批次轉換調查報告時，自動提取「查核意見」章節，歸檔至 `資料處理/3.查核意見/`：

| 層級 | 分類依據 | 說明 |
|---|---|---|
| 第一層 | 查核主題 | 工程品質、採購程序、財務管理、內部控制、轉運站管理等 |
| 第二層 | 意見類型 | 建議事項、查明處理事項、注意事項 |
| 第三層 | 性質 | 洞察、前瞻、監督 |
| 第四層 | 原始內容 | 標題＋全文，末尾註記「（截取自：報告名稱）」 |

提取流程：定位「查核意見」章節 → 依 `**一、**`、`**二、**` 分割 → 每項獨立 MD → 四層歸檔。

## 使用方式

| 你說的話 | 回應動作 |
|---|---|
| `/資料處理` | 批次轉換 `資料蒐集/` 原始檔為 MD 並分類 |
| 「跑一次知識重整」 | 手動觸發七步驟重整 |
| 「搜尋筆記有沒有 XXX」 | 搜尋整個 vault |
| 「幫我生成調查計畫」 | 載入 `audit-investigation-plan` |
| 「幫我生成工作底稿／查核意見」 | 載入 `audit-working-paper` |

## 詳細文件

- `references/setup-guide.md`：15 階段完整操作、get_pcode.py 程式碼、批次轉換腳本、清理摘要報告格式、常見問題（v3.2）
- `審計第二大腦開工自動同步技能.md`：開工／收工自動同步與 Git 備份
- `docs/working-paper-principle.md`（repo）：工作底稿生成原則

## 更新紀錄

| 日期 | 版本 | 內容 |
|---|---|---|
| 2026-11-08 | v4.0 | 拆分為三技能：本技能只負責安裝與知識管理；調查計畫、工作底稿／查核意見獨立為 `audit-investigation-plan`、`audit-working-paper` |
| 2026-08-26 | v3.3 | 工作底稿生成原則修訂（三者呼應、扣點計算） |
| 2026-05-20 | v3.0 | 新增 Selenium 法規 PCode 查詢工具 |
