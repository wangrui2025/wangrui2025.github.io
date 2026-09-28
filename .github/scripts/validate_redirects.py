#!/usr/bin/env python3
"""Validate the public academic homepage gateway contract."""

from __future__ import annotations

import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
CANONICAL = "https://wangrui92.pages.dev"
ROUTES = {
    "index.html": "/",
    "en/index.html": "/en/",
    "zh/index.html": "/zh/",
    "en/cv/index.html": "/en/cv/",
    "zh/cv/index.html": "/zh/cv/",
    "404.html": "/",
}


class RedirectMetadata(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.refresh: str | None = None
        self.canonical: str | None = None
        self.fallback_link: str | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag == "meta" and values.get("http-equiv", "").lower() == "refresh":
            self.refresh = values.get("content")
        if tag == "link" and values.get("rel", "").lower() == "canonical":
            self.canonical = values.get("href")
        if tag == "a":
            self.fallback_link = values.get("href")


def tracked_html() -> set[str]:
    result = subprocess.run(
        ["git", "ls-files", "--", "*.html"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return {line for line in result.stdout.splitlines() if line}


def fail(message: str) -> None:
    print(f"FAIL: {message}", file=sys.stderr)
    raise SystemExit(1)


def main() -> None:
    expected_files = set(ROUTES)
    actual_files = tracked_html()
    if actual_files != expected_files:
        fail(f"tracked HTML route set differs: expected {sorted(expected_files)}, got {sorted(actual_files)}")

    for relative_path, route in ROUTES.items():
        parser = RedirectMetadata()
        parser.feed((ROOT / relative_path).read_text(encoding="utf-8"))
        target = f"{CANONICAL}{route}"
        if parser.canonical != target:
            fail(f"{relative_path}: canonical must be {target!r}; got {parser.canonical!r}")
        expected_refresh = f"0; url={target}"
        if parser.refresh != expected_refresh:
            fail(f"{relative_path}: meta refresh must be {expected_refresh!r}; got {parser.refresh!r}")
        if parser.fallback_link != target:
            fail(f"{relative_path}: fallback link must be {target!r}; got {parser.fallback_link!r}")

        source = (ROOT / relative_path).read_text(encoding="utf-8")
        if source.count("target.search = location.search;") != 1:
            fail(f"{relative_path}: JavaScript redirect must assign the incoming query to the target")
        if source.count("target.hash = location.hash;") != 1:
            fail(f"{relative_path}: JavaScript redirect must assign the incoming fragment to the target")
        expected_script_url = f"new URL('{CANONICAL}{route}')"
        if relative_path == "index.html":
            expected_script_url = f"new URL('{CANONICAL}')"
            if source.count("target.pathname = location.pathname;") != 1:
                fail("index.html: JavaScript redirect must retain the root route path")
        if source.count(expected_script_url) != 1:
            fail(f"{relative_path}: JavaScript target must start at {expected_script_url!r}")
        if "mykcs.github.io" in source:
            fail(f"{relative_path}: legacy mykcs.github.io redirect target is forbidden")

    print(f"PASS: {len(ROUTES)} tracked redirect routes match {CANONICAL}")


if __name__ == "__main__":
    main()
