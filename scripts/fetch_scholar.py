import requests
import json
import os
import sys
import tempfile
import logging
from datetime import datetime, timezone
from bs4 import BeautifulSoup
from urllib3.util.retry import Retry
from requests.adapters import HTTPAdapter

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

STATS_PATH = 'astro/src/content/scholar/stats.json'
SHIELDS_PATH = 'gs_data_shieldsio.json'


def atomic_write_json(filepath, data):
    """原子性地写入 JSON 文件，防止数据损坏。"""
    os.makedirs(os.path.dirname(filepath) if os.path.dirname(filepath) else '.', exist_ok=True)
    fd, temp_path = tempfile.mkstemp(dir=os.path.dirname(filepath) or '.', suffix='.tmp')
    try:
        with os.fdopen(fd, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write('\n')
        os.replace(temp_path, filepath)
        logger.info(f"原子写入成功: {filepath}")
    except Exception:
        os.unlink(temp_path)
        raise


def update_stats_json(citations, h_index, i10_index):
    """更新 stats.json 中的引用数据，保留其他字段。"""
    data = {}
    if os.path.exists(STATS_PATH):
        try:
            with open(STATS_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
                logger.info(f"读取现有数据: {STATS_PATH}")
        except (json.JSONDecodeError, IOError) as e:
            logger.warning(f"读取 {STATS_PATH} 失败: {e}，将使用空数据")

    # 数据验证
    try:
        citations_int = int(str(citations).replace(',', '')) if str(citations).replace(',', '').isdigit() else citations
        h_index_int = int(str(h_index).replace(',', '')) if str(h_index).replace(',', '').isdigit() else h_index
        i10_index_int = int(str(i10_index).replace(',', '')) if str(i10_index).replace(',', '').isdigit() else i10_index
    except ValueError as e:
        raise ValueError(f"数据格式错误: {e}") from e

    # 合理性验证
    for name, val in [("citations", citations_int), ("h_index", h_index_int), ("i10_index", i10_index_int)]:
        if isinstance(val, int) and val < 0:
            raise ValueError(f"{name} 为负数: {val}")
        if isinstance(val, int) and val > 1000000:
            logger.warning(f"{name} 数值异常大: {val}，请检查")

    data.update({
        "citedby": citations_int,
        "hindex": h_index_int,
        "i10index": i10_index_int,
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S.%f"),
    })

    atomic_write_json(STATS_PATH, data)
    logger.info(f"已更新 {STATS_PATH}")


def write_fallback_shields():
    """写入 fallback shields 数据。"""
    fallback_data = {
        "schemaVersion": 1,
        "label": "citations",
        "message": "error",
        "color": "grey"
    }
    try:
        atomic_write_json(SHIELDS_PATH, fallback_data)
    except Exception as e:
        logger.warning(f"写入 fallback shields 失败: {e}")


class ScholarError(Exception):
    """Google Scholar 抓取相关错误基类。"""
    pass


class ScholarParseError(ScholarError):
    """页面解析错误。"""
    pass


class ScholarNetworkError(ScholarError):
    """网络请求错误。"""
    pass


class ScholarValidationError(ScholarError):
    """数据验证错误。"""
    pass


def fetch_scholar_data(scholar_id):
    """
    抓取 Google Scholar 数据。

    Returns:
        bool: 是否成功
    Raises:
        ScholarError: 各种抓取错误
    """
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

    logger.info(f"开始抓取 Google Scholar 数据: scholar_id={scholar_id}")
    logger.info(f"请求 URL: {url}")

    try:
        response = session.get(url, headers=headers, timeout=15)
        logger.info(f"收到响应: status={response.status_code}, len={len(response.text)}")
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        # 检查是否遇到验证码
        if soup.find('form', {'id': 'captcha-form'}) or 'captcha' in response.text.lower():
            raise ScholarNetworkError("触发 Google Scholar 验证码，请稍后重试")

        stats = [td.text.strip() for td in soup.select('td.gsc_rsb_std')]
        if not stats:
            # 尝试其他选择器
            stats = [td.text.strip() for td in soup.select('.gsc_rsb_std')]
            if not stats:
                # 记录部分 HTML 供调试
                preview = response.text[:2000].replace('\n', ' ')
                logger.error(f"解析失败，HTML 预览: {preview}")
                raise ScholarParseError("未能从页面解析到数据，可能页面结构已变更")

        logger.info(f"解析到原始数据: {stats}")

        # 验证数据格式
        raw_values = stats[:5:2]
        if not all(s.replace(',', '').isdigit() for s in raw_values):
            raise ScholarParseError(f"解析的数据格式异常: {raw_values}")

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

        atomic_write_json(SHIELDS_PATH, shields_data)
        update_stats_json(citations, h_index, i10_index)

        logger.info(f"抓取成功！引用数: {citations}, h-index: {h_index}, i10-index: {i10_index}")
        return True

    except requests.exceptions.Timeout:
        logger.error("请求超时，Google Scholar 响应过慢")
        raise ScholarNetworkError("请求超时，Google Scholar 响应过慢")
    except requests.exceptions.ConnectionError as e:
        logger.error(f"连接错误: {e}")
        raise ScholarNetworkError(f"连接错误: {e}")
    except requests.exceptions.HTTPError as e:
        logger.error(f"HTTP 错误: {e}")
        if e.response.status_code == 429:
            raise ScholarNetworkError("请求过于频繁 (429)，请降低抓取频率")
        raise ScholarNetworkError(f"HTTP 错误: {e}")
    except (ScholarError, ValueError):
        raise
    except Exception as e:
        logger.exception("未知错误")
        raise ScholarError(f"未知错误: {type(e).__name__}: {e}") from e


if __name__ == "__main__":
    SID = os.getenv('GOOGLE_SCHOLAR_ID')
    if not SID:
        logger.error("未找到环境变量 GOOGLE_SCHOLAR_ID")
        sys.exit(1)
    try:
        success = fetch_scholar_data(SID)
        sys.exit(0 if success else 1)
    except ScholarError as e:
        logger.error(f"抓取失败: {e}")
        write_fallback_shields()
        sys.exit(1)
