# Sky · 个人网站

零依赖的静态站点，包含两个独立页面：

| 目录 | 页面 | 线上路径 | 定位 |
|---|---|---|---|
| `showcase/index.html` | **作品集** | `http://124.223.55.175/` | 公开，展示自研产品，持续添加 |
| `me/index.html` | **个人主页 / 简历** | `http://124.223.55.175/me/` | 偏私密，不从公开页链接 |

> 另有 `Sky 工具箱` 项目独立部署在服务器 `/home/code/sky-tool`，线上 `http://124.223.55.175/sky-tool/`，不在本仓库内。

## 🚀 部署工作流（GitHub 中转）

本地改 → 推送 GitHub → 服务器拉取即生效。Caddy 直接服务仓库目录，静态文件无需重启。

```bash
# 1) 本地：提交并推送
git add -A && git commit -m "..." && git push

# 2) 服务器：拉取最新（仓库在 /home/code/sky-personal）
cd /home/code/sky-personal && bash deploy.sh
```

- 服务器仓库位置：`/home/code/sky-personal`
- Caddy 配置：`deploy/Caddyfile`（版本化参考；改动后需手动同步到 `/etc/caddy/Caddyfile` 并 reload，见 `deploy.sh` 提示）
- 简历 `me/resume.pdf` 含隐私、不入库，单独放在服务器上，`git pull` 不会动它

## ✏️ 新增一个产品（作品集）

在 `showcase/index.html` 的 `.work-grid` 里复制一张卡片，改内容、把 `href` 换成真实地址即可：

```html
<a class="work linked" href="/你的产品路径/">
  <div class="work-top">
    <div class="work-icon ic-2">🧰</div>
    <span class="badge live">在线</span>   <!-- 或 badge dev 开发中 -->
  </div>
  <h3>产品名</h3>
  <p class="desc">一句话描述。</p>
  <div class="tags"><span class="tag">标签</span></div>
  <span class="work-cta">立即体验 →</span>
</a>
```

主题色：改 `:root` 里的 `--accent`（默认朱红 `#d4502e`）。深浅色模式跟随系统，也可右上角手动切换。

## 🎨 设计参考

- [Awwwards · Portfolio](https://www.awwwards.com/websites/portfolio/)
- [Muzli · 100 Best Designer Portfolios](https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/)
- [emmabostian/developer-portfolios](https://github.com/emmabostian/developer-portfolios)
