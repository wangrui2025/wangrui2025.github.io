"""
OpenAlex API 获取学术引用数据

迁移自 Google Scholar 爬虫，使用更可靠的 OpenAlex API。
OpenAlex 是完全开放的学术数据平台，提供引用数、h-index、i10-index 等指标。
"""

import requests
import json
import os
import sys
import tempfile
import logging
from datetime import datetime, timezone

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

STATS_PATH = 'astro/src/content/scholar/stats.json'
SHIELDS_PATH = 'gs_data_shieldsio.json'

# OpenAlex API 基础 URL
OPENALEX_API = 'https://api.openalex.org'


def atomic_write_json(filepath, data):
    """原子性写入 JSON 文件，防止数据损坏。"""
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


def update_stats_json(citations: int, h_index: int, i10_index: int, cites_per_year: dict = None):
    """更新 stats.json 中的引用数据，保留其他字段。"""
    data = {}
    if os.path.exists(STATS_PATH):
        try:
            with open(STATS_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
                logger.info(f"读取现有数据: {STATS_PATH}")
        except (json.JSONDecodeError, IOError) as e:
            logger.warning(f"读取 {STATS_PATH} 失败: {e}，将使用空数据")

    # 保留原有字段（scholar_id 改为 openalex_id）
    preserved_fields = ['name', 'affiliation', 'email_domain', 'homepage', 'interests', 'url_picture']

    # 数据验证
    if citations < 0 or h_index < 0 or i10_index < 0:
        raise ValueError("引用数据不能为负数")

    data.update({
        "openalex_id": data.get("openalex_id"),  # 保留现有 ID
        "citedby": citations,
        "hindex": h_index,
        "i10index": i10_index,
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S.%f"),
    })

    # 更新年度引用数据（如果提供）
    if cites_per_year:
        data["cites_per_year"] = cites_per_year

    atomic_write_json(STATS_PATH, data)
    logger.info(f"已更新 {STATS_PATH}")


def write_shields(citations: int):
    """写入 shields.io 数据。"""
    shields_data = {
        "schemaVersion": 1,
        "label": "citations",
        "message": str(citations),
        "color": "4285F4",
        "namedLogo": "google scholar",
        "cacheSeconds": 3600
    }
    atomic_write_json(SHIELDS_PATH, shields_data)
    logger.info(f"已更新 shields 数据: {citations}")


class OpenAlexError(Exception):
    """OpenAlex API 相关错误基类。"""
    pass


class OpenAlexNotFoundError(OpenAlexError):
    """作者未找到。"""
    pass


class OpenAlexRateLimitError(OpenAlexError):
    """请求频率超限。"""
    pass


def fetch_author_by_openalex_id(author_id: str) -> dict:
    """
    通过 OpenAlex ID 获取作者数据。

    Args:
        author_id: OpenAlex 作者 ID (如 "A123456789")

    Returns:
        作者数据字典
    """
    # 确保 ID 格式正确
    if not author_id.startswith('A'):
        author_id = author_id.strip()

    url = f"{OPENALEX_API}/authors/{author_id}"
    logger.info(f"请求 OpenAlex API: {url}")

    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (compatible; AcademicHomepageBot/1.0)',
        'Accept': 'application/json',
    })

    try:
        response = session.get(url, timeout=30)
        logger.info(f"响应状态: {response.status_code}")

        if response.status_code == 404:
            raise OpenAlexNotFoundError(f"未找到 OpenAlex 作者 ID: {author_id}")
        elif response.status_code == 429:
            raise OpenAlexRateLimitError("OpenAlex API 频率超限，请稍后重试")
        elif response.status_code != 200:
            raise OpenAlexError(f"OpenAlex API 错误: {response.status_code}")

        return response.json()

    except requests.exceptions.Timeout:
        logger.error("请求超时")
        raise OpenAlexError("OpenAlex API 请求超时")
    except requests.exceptions.ConnectionError as e:
        logger.error(f"连接错误: {e}")
        raise OpenAlexError(f"连接错误: {e}")


def search_author_by_name(name: str, affiliation: str = None) -> dict | None:
    """
    通过姓名和机构搜索作者。

    Args:
        name: 作者姓名
        affiliation: 机构名称（可选）

    Returns:
        作者数据字典或 None
    """
    search_query = f"{name}"
    if affiliation:
        search_query += f" {affiliation}"

    url = f"{OPENALEX_API}/authors?search={requests.utils.quote(search_query)}"
    logger.info(f"搜索作者: {search_query}")

    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (compatible; AcademicHomepageBot/1.0)',
        'Accept': 'application/json',
    })

    try:
        response = session.get(url, timeout=30)
        if response.status_code != 200:
            logger.warning(f"搜索失败: {response.status_code}")
            return None

        data = response.json()
        results = data.get('results', [])
        if not results:
            logger.warning(f"未找到作者: {name}")
            return None

        # 返回第一个匹配结果
        return results[0]

    except Exception as e:
        logger.warning(f"搜索异常: {e}")
        return None


def get_citations_by_year(author_id: str) -> dict:
    """
    获取作者每年的引用数据。

    Args:
        author_id: OpenAlex 作者 ID

    Returns:
        每年的引用数字典 {"2024": 10, "2025": 15}
    """
    url = f"{OPENALEX_API}/authors/{author_id}/counts-by-year"
    logger.info(f"获取年度引用: {url}")

    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (compatible; AcademicHomepageBot/1.0)',
        'Accept': 'application/json',
    })

    try:
        response = session.get(url, timeout=30)
        if response.status_code != 200:
            logger.warning(f"获取年度引用失败: {response.status_code}")
            return {}

        data = response.json()
        cites_per_year = {}
        for item in data:
            year = str(item.get('year', 0))
            count = item.get('cited_by_count', 0)
            if year.isdigit() and int(year) >= 2010:  # 只保留 2010 年后的数据
                cites_per_year[year] = count

        return cites_per_year

    except Exception as e:
        logger.warning(f"获取年度引用异常: {e}")
        return {}


def fetch_scholar_data(author_identifier: str) -> bool:
    """
    从 OpenAlex 获取学术引用数据。

    Args:
        author_identifier: OpenAlex 作者 ID (如 "A123456789") 或姓名

    Returns:
        是否成功
    """
    logger.info(f"开始获取 OpenAlex 数据: {author_identifier}")

    try:
        # 尝试直接用 OpenAlex ID 获取
        if author_identifier.startswith('A') and len(author_identifier) > 5:
            author_data = fetch_author_by_openalex_id(author_identifier)
        else:
            # 回退到姓名搜索
            logger.info("非 OpenAlex ID 格式，尝试姓名搜索")
            author_data = search_author_by_name(author_identifier)
            if not author_data:
                raise OpenAlexNotFoundError(f"未找到作者: {author_identifier}")

        # 提取数据
        openalex_id = author_data.get('id', '').split('/')[-1]  # 提取 A123456789 格式
        citations = author_data.get('cited_by_count', 0)
        summary_stats = author_data.get('summary_stats', {})
        h_index = summary_stats.get('h_index', 0)
        i10_index = summary_stats.get('i10_index', 0)

        logger.info(f"提取数据: 引用数={citations}, h-index={h_index}, i10-index={i10_index}")

        # 获取年度引用数据
        cites_per_year = get_citations_by_year(openalex_id)

        # 写入 shields 数据
        write_shields(citations)

        # 更新 stats.json
        update_stats_json(citations, h_index, i10_index, cites_per_year)

        logger.info(f"获取成功！引用数: {citations}, h-index: {h_index}, i10-index: {i10_index}")
        return True

    except OpenAlexError:
        raise
    except Exception as e:
        logger.exception("未知错误")
        raise OpenAlexError(f"未知错误: {type(e).__name__}: {e}") from e


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


if __name__ == "__main__":
    # 支持两种环境变量：OPENALEX_AUTHOR_ID（优先）或向后兼容的 GOOGLE_SCHOLAR_ID
    author_id = os.getenv('OPENALEX_AUTHOR_ID') or os.getenv('GOOGLE_SCHOLAR_ID')

    if not author_id:
        logger.error("未找到环境变量 OPENALEX_AUTHOR_ID (或 GOOGLE_SCHOLAR_ID)")
        logger.error("请在 GitHub Secrets 中设置 OPENALEX_AUTHOR_ID")
        logger.info("获取 OpenAlex ID 方法: 在 https://openalex.org 搜索你的姓名，复制 URL 中的 ID (格式如 A123456789)")
        sys.exit(1)

    try:
        success = fetch_scholar_data(author_id)
        sys.exit(0 if success else 1)
    except OpenAlexError as e:
        logger.error(f"获取失败: {e}")
        write_fallback_shields()
        sys.exit(1)
