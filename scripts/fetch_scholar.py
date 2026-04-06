"""
Semantic Scholar API 获取学术引用数据

通过 arxiv ID 查询论文引用数，避免 OpenAlex 作者消歧问题。
"""

import requests
import json
import os
import sys
import tempfile
import logging
import time
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

# Semantic Scholar Graph API
S2_API = 'https://api.semanticscholar.org/graph/v1'

# 你的论文 arxiv ID 列表
PAPERS = [
    '2512.10252',  # GDKVM - ICCV 2025
    '2603.26188',  # OSA - CVPR 2026
]


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


def fetch_paper_citations(arxiv_id: str, retries: int = 3) -> dict:
    """
    通过 arxiv ID 获取论文引用数。

    Args:
        arxiv_id: arxiv ID (如 "2512.10252")
        retries: 重试次数

    Returns:
        包含 title, citations, authors 的字典
    """
    url = f"{S2_API}/paper/arXiv:{arxiv_id}"
    params = {'fields': 'title,citationCount,authors'}
    logger.info(f"请求 Semantic Scholar: arxiv:{arxiv_id}")

    for attempt in range(retries):
        try:
            response = requests.get(url, params=params, timeout=30)
            if response.status_code == 404:
                logger.warning(f"未找到论文: arxiv:{arxiv_id}")
                return None
            if response.status_code == 429:
                wait_time = (attempt + 1) * 5  # 5, 10, 15 秒退避
                logger.warning(f"请求过于频繁 (429)，等待 {wait_time} 秒后重试...")
                time.sleep(wait_time)
                continue
            response.raise_for_status()

            data = response.json()
            return {
                'arxiv_id': arxiv_id,
                'title': data.get('title', ''),
                'citations': data.get('citationCount', 0),
                'authors': [a['name'] for a in data.get('authors', [])],
            }
        except requests.exceptions.Timeout:
            logger.error(f"请求超时: arxiv:{arxiv_id}")
            return None
        except requests.exceptions.RequestException as e:
            logger.error(f"请求失败: {e}")
            return None

    logger.error(f"重试 {retries} 次后仍失败: arxiv:{arxiv_id}")
    return None


def fetch_all_citations() -> tuple[int, dict]:
    """
    获取所有论文的引用数据。

    Returns:
        (总引用数, 每篇论文详情字典)
    """
    total_citations = 0
    papers_detail = {}

    for arxiv_id in PAPERS:
        paper = fetch_paper_citations(arxiv_id)
        if paper:
            total_citations += paper['citations']
            papers_detail[arxiv_id] = paper
            logger.info(f"  {paper['title'][:50]}... -> {paper['citations']} citations")
        else:
            papers_detail[arxiv_id] = {'arxiv_id': arxiv_id, 'citations': 0, 'title': 'Unknown'}

    return total_citations, papers_detail


def update_stats_json(total_citations: int, papers_detail: dict):
    """更新 stats.json 中的引用数据。"""
    data = {}
    if os.path.exists(STATS_PATH):
        try:
            with open(STATS_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            logger.warning(f"读取 {STATS_PATH} 失败: {e}")

    # 保留原有字段
    preserved = ['name', 'affiliation', 'email_domain', 'homepage', 'interests', 'url_picture', 'scholar_id']
    preserved_data = {k: v for k, v in data.items() if k in preserved}

    # 计算 h-index (简化版: min(论文数, 引用数))
    # 由于论文很少且引用很低，h-index 和 i10-index 意义不大
    num_papers = len(papers_detail)
    h_index = min(num_papers, total_citations) if total_citations > 0 else 0
    i10_index = 1 if total_citations >= 10 else 0

    data = {
        **preserved_data,
        'citedby': total_citations,
        'hindex': h_index,
        'i10index': i10_index,
        'updated': datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S.%f"),
        'papers': papers_detail,
    }

    atomic_write_json(STATS_PATH, data)
    logger.info(f"已更新 {STATS_PATH}: total_citations={total_citations}")


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


def main():
    """主函数。"""
    logger.info("开始获取论文引用数据 (Semantic Scholar)")

    total_citations, papers_detail = fetch_all_citations()

    if total_citations == 0 and not any(p.get('title') != 'Unknown' for p in papers_detail.values()):
        logger.error("未能获取任何论文数据")
        write_shields(0)
        # 即使获取失败也写一个空数据
        update_stats_json(0, papers_detail)
        sys.exit(1)

    write_shields(total_citations)
    update_stats_json(total_citations, papers_detail)

    logger.info(f"完成！总引用数: {total_citations}")
    sys.exit(0)


if __name__ == "__main__":
    main()
