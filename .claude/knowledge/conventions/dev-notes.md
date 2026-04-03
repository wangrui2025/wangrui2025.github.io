PDF 导出：浏览器原生 window.print() 效果最好，但需要手动选"另存为 PDF"。如果想要真正一键导出，可以考虑服务端生成 PDF（如 Puppeteer/Playwright），但这需要部署服务器。

auto-push：post-commit hook 已生效，但"chore: auto-update after file change"这种通用信息仍然出现——似乎有其他地方在触发提交。我找不到确切来源，可能是 GitHub Actions 或其他 hook。建议排查一下 .github/workflows/。