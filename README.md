# audit-assistant-skills

審計輔助應用技能倉庫 — 提供 opencode 技能，輔助審計人員快速查詢政府開放資料及不動產交易資訊。

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
    "lvrlandmoigov": "allow"
  }
}
```

## 相關連結

- [opencode](https://opencode.ai) — AI 輔助程式開發工具
- [內政部不動產交易實價查詢服務網](https://lvr.land.moi.gov.tw)
- [政府電子採購網](https://web.pcc.gov.tw)
- [司法院裁判書查詢](https://judgment.judicial.gov.tw)
