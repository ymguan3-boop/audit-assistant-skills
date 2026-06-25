# audit-assistant-skills

審計輔助應用技能倉庫 — 提供 opencode 技能，輔助審計人員快速查詢政府開放資料。

## 技能列表

### lvrlandmoigov — 內政部不動產交易實價登錄查詢

透過內政部不動產交易實價查詢服務網（lvr.land.moi.gov.tw）及第三方整合平台，快速取得：

| 功能 | 說明 |
|------|------|
| 預售屋查詢 | 依縣市/行政區查詢預售屋交易紀錄，含建案名稱、總價、單價、坪數、房型 |
| 買賣行情 | 成屋買賣交易之區域均價、單價區間 |
| 特定建案 | 查詢特定建案之所有交易明細 |
| 路段行情 | 依路段查詢周邊成交行情 |

**使用方式**：在 opencode 中說「實價登錄」「查房價」「lvrlandmoigov」即可載入技能。

**資料來源**：[內政部不動產交易實價查詢服務網](https://lvr.land.moi.gov.tw)、[opendata.vip](https://www.opendata.vip/tool/landmoi)

### （更多技能開發中）

## 安裝方式

將 skills 目錄下的技能複製至 opencode 設定目錄：

```bash
# 技能存放位置
%USERPROFILE%\.config\opencode\skills\lvrlandmoigov\SKILL.md

# 在 opencode.json 中註冊權限
"permission": {
  "skill": {
    "lvrlandmoigov": "allow"
  }
}
```

## 相關工具

- [opencode](https://opencode.ai) — AI 輔助程式開發工具
- [內政部不動產交易實價查詢服務網](https://lvr.land.moi.gov.tw) — 官方實價登錄系統
