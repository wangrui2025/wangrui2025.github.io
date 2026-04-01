import requests
import json
import os
import time
from bs4 import BeautifulSoup
from urllib3.util.retry import Retry
from requests.adapters import HTTPAdapter

def fetch_scholar_data(scholar_id):
    url = f"https://scholar.google.com/citations?user={scholar_id}&hl=en"
    
    # 模拟真实浏览器请求头
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    }

    # 配置重试逻辑
    session = requests.Session()
    retries = Retry(
        total=5,
        backoff_factor=2,  # 延迟会以 2s, 4s, 8s... 增加
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET"]
    )
    session.mount('https://', HTTPAdapter(max_retries=retries))

    try:
        print(f"正在抓取 Google Scholar 数据: {scholar_id}...")
        response = session.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 提取核心数据
        # 总引用数通常是表格中第一个 gsc_rsb_std
        stats = [td.text.strip() for td in soup.select('td.gsc_rsb_std')]
        if not stats:
            raise ValueError("未能从页面解析到数据，可能触发了验证码。")

        citations = stats[0]
        h_index = stats[2] if len(stats) > 2 else "0"
        i10_index = stats[4] if len(stats) > 4 else "0"

        # 构造 Shields.io 兼容格式
        data = {
            "schemaVersion": 1,
            "label": "citations",
            "message": str(citations),
            "color": "4285F4",
            "namedLogo": "google scholar",
            "cacheSeconds": 3600  # 告诉 Shields.io 缓存 1 小时
        }

        # 写入文件
        output_path = 'gs_data_shieldsio.json'
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        
        print(f"✅ 抓取成功！引用数: {citations}, h-index: {h_index}")
        return True

    except Exception as e:
        print(f"❌ 抓取失败: {e}")
        # 如果彻底失败，保留一个兜底 JSON，防止前端/徽章显示 404
        if not os.path.exists('gs_data_shieldsio.json'):
            with open('gs_data_shieldsio.json', 'w') as f:
                json.dump({"schemaVersion": 1, "label": "citations", "message": "error", "color": "grey"}, f)
        return False

if __name__ == "__main__":
    SID = os.getenv('GOOGLE_SCHOLAR_ID')
    if not SID:
        print("未找到环境变量 GOOGLE_SCHOLAR_ID")
    else:
        fetch_scholar_data(SID)