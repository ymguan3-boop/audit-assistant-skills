"""
上傳 ezbid-bidders 技能至 GitHub 倉庫
"""

import os
import base64
import json
import requests
from pathlib import Path

# GitHub 設定
REPO = "ymguan3-boop/audit-assistant-skills"
BRANCH = "main"
SKILL_DIR = Path(__file__).parent

# GitHub API 設定
GITHUB_API = "https://api.github.com"

def get_github_token():
    """取得 GitHub token"""
    # 從 gh CLI 設定讀取 token
    config_path = Path.home() / "AppData/Roaming/GitHub CLI/hosts.yml"
    if config_path.exists():
        with open(config_path, 'r') as f:
            for line in f:
                if 'oauth_token:' in line:
                    return line.split('oauth_token:')[1].strip()
    return None

def upload_file(file_path, repo_path, token):
    """上傳檔案至 GitHub"""
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    # 讀取檔案內容
    with open(file_path, 'rb') as f:
        content = base64.b64encode(f.read()).decode('utf-8')
    
    # 檢查檔案是否已存在
    check_url = f"{GITHUB_API}/repos/{REPO}/contents/{repo_path}"
    check_resp = requests.get(check_url, headers=headers)
    
    data = {
        "message": f"Add ezbid-bidders skill: {repo_path}",
        "content": content,
        "branch": BRANCH
    }
    
    # 如果檔案已存在，需要提供 SHA
    if check_resp.status_code == 200:
        existing = check_resp.json()
        data["sha"] = existing["sha"]
    
    # 上傳檔案
    put_url = f"{GITHUB_API}/repos/{REPO}/contents/{repo_path}"
    resp = requests.put(put_url, headers=headers, json=data)
    
    if resp.status_code in [200, 201]:
        print(f"[OK] 上傳成功: {repo_path}")
        return True
    else:
        print(f"[FAIL] 上傳失敗: {repo_path} - {resp.status_code}")
        print(resp.text)
        return False

def main():
    token = get_github_token()
    if not token:
        print("無法取得 GitHub token")
        return
    
    print(f"上傳 ezbid-bidders 技能至 {REPO}")
    print("=" * 50)
    
    # 要上傳的檔案
    files = [
        ("SKILL.md", "skills/ezbid-bidders/SKILL.md"),
        ("README.md", "skills/ezbid-bidders/README.md"),
        ("fetch_bidders.py", "skills/ezbid-bidders/fetch_bidders.py"),
        ("requirements.txt", "skills/ezbid-bidders/requirements.txt"),
    ]
    
    success_count = 0
    for local_name, repo_path in files:
        local_path = SKILL_DIR / local_name
        if local_path.exists():
            if upload_file(local_path, repo_path, token):
                success_count += 1
        else:
            print(f"[WARN] 檔案不存在: {local_path}")
    
    print("=" * 50)
    print(f"完成！成功上傳 {success_count}/{len(files)} 個檔案")
    print(f"倉庫位址: https://github.com/{REPO}/tree/main/skills/ezbid-bidders")

if __name__ == "__main__":
    main()
