# Sky · 个人网站

零依赖的静态站点，包含两个独立页面：

| 目录 | 页面 | 部署路径 | 定位 |
|---|---|---|---|
| `showcase/index.html` | **作品集** | `http://<server>/` | 公开，展示自研产品，持续添加 |
| `index.html` | **个人主页 / 简历** | `http://<server>/me/` | 偏私密，不从公开页链接 |

> 部署在 myserver（124.223.55.175），由 Caddy 提供：80 端口根路径 = 作品集，`/me` = 个人主页。
> 新增产品：在 `showcase/index.html` 里复制一个 `.work` 卡片、改内容、把 `href` 换成真实地址即可。

---

一个单文件、零依赖的精美个人主页：个人介绍 + 项目展示 + 简历 + 联系方式。

## ✨ 特性

- **零构建**：只有一个 `index.html`，双击即可打开，放到任何静态托管上即可上线
- **深浅色模式**：跟随系统，也可手动切换（右上角按钮，选择会被记住）
- **滚动浮现动画** + 响应式布局（手机 / 平板 / 桌面）
- **极简设计**：参考 2026 年优秀作品集网站趋势（大字排版、充足留白、3-5 个精选项目）

## ✏️ 如何改成你自己的内容

打开 `index.html`，搜索 `✏️` —— 所有需要替换的地方都标了这个记号：

| 位置 | 要改的内容 |
|---|---|
| Hero 区 | 名字、一句话介绍 |
| 关于我 | 个人故事三段 + Quick Facts（坐标/职位/技术栈） |
| 项目精选 | 4 个项目卡片（标题、描述、技术标签、链接），可增删 |
| 技能 | 6 张技能卡片 |
| 经历 | 时间线条目（工作 + 教育） |
| 简历 | 把你的 `resume.pdf` 放到本目录即可让下载按钮生效 |
| 联系 | 邮箱、GitHub / 掘金 / 知乎 / LinkedIn 链接 |

主题色：改 `:root` 里的 `--accent`（默认朱红 `#d4502e`）。

## 🚀 部署

任选其一：

- **GitHub Pages**：建仓库 → 推送 → Settings → Pages 选 main 分支
- **Vercel / Netlify / Cloudflare Pages**：拖拽文件夹即可
- **飞书妙搭**：在 Claude Code 里说"把这个目录部署到妙搭"即可拿到公网链接

## 🎨 设计参考

- [Awwwards · Portfolio](https://www.awwwards.com/websites/portfolio/)
- [Muzli · 100 Best Designer Portfolios](https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/)
- [emmabostian/developer-portfolios](https://github.com/emmabostian/developer-portfolios)
