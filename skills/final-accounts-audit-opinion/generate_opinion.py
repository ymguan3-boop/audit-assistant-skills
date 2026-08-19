#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
總決算審核意見文稿自動生成工具 — skill 版本

用法：
  1) 擷取參考檔案文字（供分析）：
       python generate_opinion.py extract --input "<.docx 路徑>" [--output "<輸出 .txt 路徑>"]
       * 可同時給多個 --input，依序輸出

  2) 依內容 JSON 產生 WORD 文稿：
       python generate_opinion.py build --content "<content.json 路徑>" --output "<輸出 .docx 路徑>"

content.json 結構：
{
  "l1": "乙、決算審核結果",                    # 第一層標題（18pt 粗體置中）
  "l2": "貳、縣政府主管",                      # 第二層標題（18pt 粗體）
  "l3": "五、重要審核意見",                    # 第三層標題（16pt 粗體）
  "insight": "（   ）  為提高……（洞察）",      # 洞察段（14pt 粗體）
  "main": "縣政府為提高……據復：……"             # 主文段（12pt 一般）
}
"""

import os, re, sys, json, argparse
from docx import Document
from docx.shared import Pt, Emu
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

# ================================================================
#  擷取模式：讀取 .docx 段落與表格
# ================================================================

def dump_docx(path):
    d = Document(path)
    lines = []
    lines.append("=== 段落 ===")
    for i, p in enumerate(d.paragraphs):
        t = p.text.strip()
        if t:
            lines.append(f"[P{i}][{p.style.name}] {t}")
    lines.append("")
    lines.append("=== 表格 ===")
    for ti, t in enumerate(d.tables):
        lines.append(f"--- 表{ti} ---")
        for r in t.rows:
            cells = [c.text.replace("\n", " / ").strip() for c in r.cells]
            lines.append(" | ".join(cells))
    return "\n".join(lines)


def cmd_extract(args):
    for p in args.input:
        if not os.path.exists(p):
            print(f"ERR: 找不到 {p}")
            continue
        text = dump_docx(p)
        if args.output:
            out = args.output
            with open(out, "w", encoding="utf-8") as f:
                f.write(f"# 來源：{os.path.basename(p)}\n\n{text}\n")
            print(f"OK: {out}")
        else:
            print(f"======== {os.path.basename(p)} ========")
            print(text)
            print()


# ================================================================
#  產生模式：依 content.json 產生 WORD 文稿
# ================================================================

def _set_indent(p, left=None, first_line=None, hanging=None):
    pPr = p._element.get_or_add_pPr()
    ind = pPr.find(qn("w:ind"))
    if ind is None:
        ind = OxmlElement("w:ind")
        pPr.append(ind)
    if left is not None:
        ind.set(qn("w:left"), str(int(round(left))))
    if first_line is not None:
        ind.set(qn("w:firstLine"), str(int(round(first_line))))
    if hanging is not None:
        ind.set(qn("w:hanging"), str(int(round(hanging))))
    # 清除不使用的屬性
    if left is None:
        ind.attrib.pop(qn("w:left"), None)
    if first_line is None:
        ind.attrib.pop(qn("w:firstLine"), None)
    if hanging is None:
        ind.attrib.pop(qn("w:hanging"), None)


def _add_run(p, text, size_pt, bold):
    run = p.add_run(text)
    run.font.name = "標楷體"
    run._element.rPr.rFonts.set(qn("w:eastAsia"), "標楷體")
    run.font.size = Pt(size_pt)
    run.bold = bold
    return run


def build_docx(content, output_path):
    doc = Document()
    # 頁面基準：與既有文稿一致（A4 / 公文格式由後續套用樣板統一）
    body = doc.element.body
    sectPr = body.find(qn("w:sectPr"))
    if sectPr is not None:
        body.remove(sectPr)

    EXACT = WD_LINE_SPACING.EXACTLY
    LS_23 = Emu(292100)   # 23pt 固定行高
    LS_30 = Emu(381000)   # 30pt 固定行高

    # P0 第一層標題（乙、決算審核結果）— 18pt 粗體、置中、30pt 固定行高
    p0 = doc.add_paragraph()
    p0.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p0.paragraph_format.line_spacing = LS_30
    p0.paragraph_format.line_spacing_rule = EXACT
    _set_indent(p0, left=335, hanging=4)
    _add_run(p0, content.get("l1", ""), 18, True)

    # P1 第二層標題（貳、縣政府主管）— 18pt 粗體、兩端對齊、23pt、段後18pt
    p1 = doc.add_paragraph()
    p1.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p1.paragraph_format.line_spacing = LS_23
    p1.paragraph_format.line_spacing_rule = EXACT
    p1.paragraph_format.space_after = Emu(228600)
    _add_run(p1, content.get("l2", ""), 18, True)

    # P2 第三層標題（五、重要審核意見）— 16pt 粗體、23pt、首行縮排310、段前後3.6pt
    p2 = doc.add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p2.paragraph_format.line_spacing = LS_23
    p2.paragraph_format.line_spacing_rule = EXACT
    p2.paragraph_format.space_before = Emu(45720)
    p2.paragraph_format.space_after = Emu(45720)
    _set_indent(p2, first_line=310)
    _add_run(p2, content.get("l3", ""), 16, True)

    # P3 洞察段 — 14pt 粗體、23pt、首行縮排569
    p3 = doc.add_paragraph()
    p3.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p3.paragraph_format.line_spacing = LS_23
    p3.paragraph_format.line_spacing_rule = EXACT
    _set_indent(p3, first_line=569)
    _add_run(p3, content.get("insight", ""), 14, True)

    # P4 主文段 — 12pt 一般、23pt、首行縮排850、段前後3.6pt
    p4 = doc.add_paragraph()
    p4.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p4.paragraph_format.line_spacing = LS_23
    p4.paragraph_format.line_spacing_rule = EXACT
    p4.paragraph_format.space_before = Emu(45720)
    p4.paragraph_format.space_after = Emu(45720)
    _set_indent(p4, first_line=850)
    _add_run(p4, content.get("main", ""), 12, False)

    doc.save(output_path)
    print(f"文稿已成功產出：{output_path}")


def cmd_build(args):
    if not os.path.exists(args.content):
        print(f"ERR: 找不到 content.json：{args.content}")
        sys.exit(1)
    with open(args.content, "r", encoding="utf-8") as f:
        content = json.load(f)
    for key in ("l1", "l2", "l3", "insight", "main"):
        if key not in content or not str(content.get(key, "")).strip():
            print(f"ERR: content.json 缺少必要欄位：{key}")
            sys.exit(1)
    out = args.output or "總決算審核意見_重要審核意見.docx"
    build_docx(content, out)


def main():
    parser = argparse.ArgumentParser(description="總決算審核意見文稿生成工具")
    sub = parser.add_subparsers(dest="mode", required=True)

    ex = sub.add_parser("extract", help="擷取參考 .docx 文字")
    ex.add_argument("--input", action="append", required=True, help="參考檔案路徑（可多個）")
    ex.add_argument("--output", default=None, help="輸出 .txt 路徑")

    bu = sub.add_parser("build", help="產生 WORD 文稿")
    bu.add_argument("--content", required=True, help="content.json 路徑")
    bu.add_argument("--output", default=None, help="輸出 .docx 路徑")

    args = parser.parse_args()
    if args.mode == "extract":
        cmd_extract(args)
    elif args.mode == "build":
        cmd_build(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
