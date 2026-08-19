"""
審計第二大腦 - 掃描件批次 OCR 腳本（PaddleOCR 3.7）

功能：
  1. 讀取「資料處理紀錄.json」中 status=掃描件 的檔案。
  2. 使用 PaddleOCR 對 PDF/圖片批次 OCR，產出含 frontmatter 的 MD 檔。
  3. 更新處理紀錄（status=已轉換），支援斷點續跑與單檔錯誤容錯。

使用：
  python ocr_scanned_files.py [--project "專案資料夾絕對路徑"] [--limit N]
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from datetime import datetime
from pathlib import Path

def _resolve_vault_path() -> Path:
    """尋找 convert_all_to_md.py 所在之 vault 根目錄。"""
    env = os.environ.get("VAULT_PATH")
    if env and Path(env).is_dir():
        return Path(env)
    here = Path(__file__).resolve().parent
    for cand in (here, here.parent, here.parent.parent,
                 Path(r"D:\opencode_0519\2ndbrain")):
        if (cand / "convert_all_to_md.py").exists():
            return cand
    raise SystemExit("找不到 convert_all_to_md.py，請設定環境變數 VAULT_PATH")


VAULT_ROOT = _resolve_vault_path()
if str(VAULT_ROOT) not in sys.path:
    sys.path.insert(0, str(VAULT_ROOT))
from convert_all_to_md import (
    VAULT_PATH,
    BASIC_DIR,
    LAW_DIR,
    add_frontmatter,
    classify_document,
    safe_stem,
    unique_path,
)

DEFAULT_PROJECT = Path(
    r"D:\opencode_0519\2ndbrain\專案處理\品質稽察-「五結防潮閘門改善工程」"
)
LOG_NAME = "資料處理紀錄.json"
OCR_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".bmp", ".tiff"}


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    args = parse_args()
    project = Path(args.project)
    log = load_log(project)

    scanned = [k for k, r in log.items() if r.get("status") == "掃描件"]
    pdfs = [
        (k, r)
        for k, r in log.items()
        if r.get("status") == "掃描件"
        and Path(k).suffix.lower() in OCR_EXTENSIONS
    ]
    skip_non_pdf = len(scanned) - len(pdfs)
    print("=" * 60)
    print(f"掃描件總數：{len(scanned)}，可 OCR（PDF/圖片）：{len(pdfs)}，"
          f"非 OCR 格式（跳過）：{skip_non_pdf}")
    print("=" * 60)

    if not pdfs:
        print("沒有待處理的掃描件。")
        return

    if args.limit:
        pdfs = pdfs[: args.limit]

    if not args.no_priority:
        pdfs = sorted(pdfs, key=priority_key)

    os.environ["FLAGS_use_mkldnn"] = "false"
    from paddleocr import PaddleOCR

    ocr = PaddleOCR(
        use_doc_orientation_classify=False,
        use_doc_unwarping=False,
        use_textline_orientation=False,
        enable_mkldnn=False,
        text_detection_model_name="PP-OCRv5_mobile_det",
        text_recognition_model_name="PP-OCRv5_mobile_rec",
        cpu_threads=8,
    )
    print("PaddleOCR 初始化完成（PP-OCRv5 mobile），開始批次 OCR...\n")

    ok = fail = 0
    t_start = time.time()
    for idx, (rel, rec) in enumerate(pdfs, 1):
        src = project / rel
        t0 = time.time()
        try:
            if not src.exists():
                raise FileNotFoundError(f"檔案不存在：{src}")
            body = ocr_pdf_to_markdown(ocr, src)
            if not body.strip():
                raise ValueError("OCR 結果為空")
            category, target_dir, tags = classify_document(src, body)
            output_path = unique_path(
                target_dir / f"{safe_stem(src.stem)}_OCR.md"
            )
            content = add_frontmatter(
                title=f"{src.stem}（OCR）",
                tags=tags + ["OCR"],
                source=src,
                body=body,
            )
            output_path.write_text(content, encoding="utf-8")
            rec["status"] = "已轉換"
            rec["category"] = category
            rec["output"] = str(output_path.relative_to(VAULT_PATH))
            rec["opinion_output"] = rec.get("opinion_output", "")
            rec["message"] = f"OCR 完成，耗時 {time.time()-t0:.0f} 秒"
            rec["processed_at"] = datetime.now().isoformat(timespec="seconds")
            ok += 1
            print(f"[{idx}/{len(pdfs)}] OK  {rel} -> {rec['output']} "
                  f"({time.time()-t0:.0f}s)")
        except Exception as exc:
            rec["status"] = "掃描件"
            rec["message"] = f"OCR 失敗：{str(exc)[:150]}"
            fail += 1
            print(f"[{idx}/{len(pdfs)}] FAIL {rel}：{str(exc)[:150]}")
        save_log(project, log)

    print("-" * 60)
    print(f"完成：成功 {ok}，失敗 {fail}，總耗時 {time.time()-t_start:.0f} 秒")
    print("進度已即時寫入資料處理紀錄.json，可隨時中斷後再續跑。")


def ocr_pdf_to_markdown(ocr, path: Path) -> str:
    """對單一 PDF/圖片執行 OCR，輸出 markdown 文字。"""
    result = ocr.predict(str(path))
    pages: list[str] = []
    for page in result:
        res = page.json.get("res", {})
        texts = res.get("rec_texts") or []
        if texts:
            pages.append("\n".join(str(t) for t in texts))
    return "\n\n---\n\n".join(pages)


def priority_key(item: tuple[str, dict]) -> tuple:
    """排序鍵：小檔優先，日報表大檔排最後。回傳 (優先序, 原路徑)。"""
    rel, _rec = item
    if "日報表" in rel or "月日報" in rel:
        return (1, rel)
    return (0, rel)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="掃描件批次 OCR")
    parser.add_argument("--project", default=str(DEFAULT_PROJECT))
    parser.add_argument("--limit", type=int, default=None, help="僅處理前 N 個")
    parser.add_argument(
        "--no-priority",
        action="store_true",
        help="依原始順序處理，不做日報表大檔排後之排序",
    )
    return parser.parse_args()


def load_log(project: Path) -> dict:
    path = project / LOG_NAME
    if path.exists():
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            return data.get("files", {}) if isinstance(data, dict) else {}
        except Exception:
            return {}
    return {}


def save_log(project: Path, log: dict) -> None:
    payload = {
        "schema": 1,
        "project": str(project),
        "updated": datetime.now().isoformat(timespec="seconds"),
        "files": log,
    }
    (project / LOG_NAME).write_text(
        json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8"
    )


if __name__ == "__main__":
    main()
