# 当前愿望的设计解释

这份文件解释 `wangrui2025.github.io` 作为学术兼容入口应该怎样服务整套个人主页。它不是完整主页的产品说明；完整主页的当前 Wish 由 `mykcs/personal-homepage/docs/wish/` 负责。

## L0 — 中心愿望

`wangrui2025.github.io` 的任务只有一个：

```text
有人打开旧的学术主页链接
→ 不需要理解账号迁移
→ 直接进入当前正式主页
```

只要它可靠完成这件事，就已经成功。

## L1 — 真实使用情境

### 1. 论文、简历或 GitHub Profile 留着旧链接

这些链接可能多年后仍被打开，因此不应因为托管平台变化而失效。

### 2. 访问者打开旧的语言或 CV 路由

`/zh/`、`/en/`、`/zh/cv/`、`/en/cv/` 等已知主页路由应尽量保持对应语义，直接进入正式站的对应路径。

### 3. 我继续开发主页

完整 Astro 源码、内部工程文档、DEV 工具和不需要公开的资产不属于这里。这个 Public repository 只保留兼容网关所需的最小文件。

## L2 — 当前关系

当前 canonical serving host：

```text
https://wangrui92.pages.dev
```

当前关系：

```text
https://wangrui2025.github.io
        │
        └──── direct ────→ https://wangrui92.pages.dev
```

不要恢复旧的两级链路：

```text
wangrui2025.github.io
→ mykcs.github.io
→ serving host
```

根入口直接去 canonical 根地址；已知语言/CV 路由保持对应路径；未知旧主页路径安全回到 canonical 根地址。

## L3 — Ownership 边界

- `wangrui2025/wangrui2025.github.io`：公开、redirect-only。
- `mykcs/personal-homepage`：完整主页源码与 DEV authority，可以保持 Private。
- `wangrui92.pages.dev`：当前唯一 canonical/indexable 正式主页。
- `/osa/`、`/GDKVM/`、`/sprites-gallery/` 等项目站由各自仓库负责；不要把项目源码复制进本仓库，也不要声称本仓库拥有它们。

## 拿不准时怎么判断

1. 这个改动是否让旧学术链接更可靠地到正式主页？
2. 是否无意中开始复制正式主页内容？
3. 是否把私人开发源码或内部资产带进了 Public repository？
4. 是否增加了一层没有必要的跳转？
5. 如果未来 canonical host 改变，是否只改少量 redirect 目标就能完成迁移？

具体部署状态、CI、GitHub Pages provider 细节和实时域名状态不属于 Wish；它们由可执行配置和 live evidence 负责。
