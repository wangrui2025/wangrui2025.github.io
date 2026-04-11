# Astro 开发规范

## Content Collections Loader 规则

**单文件 = 单 entry 用 `glob()`，不用 `file()`。**

| 场景 | Loader | 原因 |
|------|--------|------|
| 一个 JSON 文件 = 一条记录 | `glob({ pattern: '**/*.json' })` | `file()` 会把顶级键拆成多个 entry |
| 一个目录 = 多个 JSON 文件 | `glob({ pattern: '**/*.json' })` | 正确，每个文件一个 entry |

## CSS 作用域 (Scoped CSS)

Astro 使用 `data-astro-cid-xxx` 属性实现组件级 CSS 隔离。

**跨组件样式传递失效**：
```astro
<!-- 父组件 zh/cv.astro -->
<style>
  /* ❌ 无法匹配子组件元素，因为 CID 不同 */
  .cv-pub-entry[data-astro-cid-父组件CID] { ... }
</style>

<!-- 子组件 CvPaperItem.astro -->
<div class="cv-pub-entry" data-astro-cid-子组件CID> <!-- CID 不同，不匹配 -->
```

**正确做法**：布局类 CSS 必须写在子组件内部，或使用 `:global()` 包裹。

## 调试建议

1. **怀疑 CSS 不生效时**：立即要求用户提供截图
2. **检查 scoped 匹配**：curl 页面，搜索 `data-astro-cid`，确认选择器 CID 与元素 CID 是否一致
3. **dev server 缓存**：修改后 rebuild 通常足够，无需频繁重启
