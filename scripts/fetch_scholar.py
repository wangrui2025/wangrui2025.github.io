import requests
import json
import os
from datetime import datetime, timezone
from bs4 import BeautifulSoup
from urllib3.util.retry import Retry
from requests.adapters import HTTPAdapter

STATS_PATH = 'astro/src/content/scholar/stats.json'
SHIELDS_PATH = 'gs_data_shieldsio.json'


def update_stats_json(citations, h_index, i10_index):
    """更新 stats.json 中的引用数据，保留其他字段。"""
    data = {}
    if os.path.exists(STATS_PATH):
        try:
            with open(STATS_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"⚠️ 解析 {STATS_PATH} 失败: {e}，将覆盖写入")

    data.update({
        "citedby": int(citations) if citations.isdigit() else citations,
        "hindex": int(h_index) if str(h_index).isdigit() else h_index,
        "i10index": int(i10_index) if str(i10_index).isdigit() else i10_index,
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S.%f"),
    })

    os.makedirs(os.path.dirname(STATS_PATH), exist_ok=True)
    with open(STATS_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write('\n')

    print(f"📝 已更新 {STATS_PATH}")


def write_fallback_shields():
    if not os.path.exists(SHIELDS_PATH):
        with open(SHIELDS_PATH, 'w', encoding='utf-8') as f:
            json.dump({
                "schemaVersion": 1,
                "label": "citations",
                "message": "error",
                "color": "grey"
            }, f)


def fetch_scholar_data(scholar_id):
    url = f"https://scholar.google.com/citations?user={scholar_id}&hl=en"

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    }

    session = requests.Session()
    retries = Retry(
        total=5,
        backoff_factor=2,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET"]
    )
    session.mount('https://', HTTPAdapter(max_retries=retries))

    try:
        print(f"正在抓取 Google Scholar 数据: {scholar_id}...")
        response = session.get(url, headers=headers, timeout=15)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        stats = [td.text.strip() for td in soup.select('td.gsc_rsb_std')]
        if not stats:
            raise ValueError("未能从页面解析到数据，可能触发了验证码。")

        citations = stats[0]
        h_index = stats[2] if len(stats) > 2 else "0"
        i10_index = stats[4] if len(stats) > 4 else "0"

        shields_data = {
            "schemaVersion": 1,
            "label": "citations",
            "message": str(citations),
            "color": "4285F4",
            "namedLogo": "google scholar",
            "cacheSeconds": 3600
        }

        with open(SHIELDS_PATH, 'w', encoding='utf-8') as f:
            json.dump(shields_data, f, indent=2)
            f.write('\n')

        update_stats_json(citations, h_index, i10_index)

        print(f"✅ 抓取成功！引用数: {citations}, h-index: {h_index}, i10-index: {i10_index}")
        return True

    except Exception as e:
        print(f"❌ 抓取失败: {e}")
        write_fallback_shields()
        return False


if __name__ == "__main__":
    SID = os.getenv('GOOGLE_SCHOLAR_ID')
    if not SID:
        print("未找到环境变量 GOOGLE_SCHOLAR_ID")
    else:
        fetch_scholar_data(SID)