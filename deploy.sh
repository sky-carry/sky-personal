#!/usr/bin/env bash
# 服务器端部署脚本：拉取最新代码即生效（Caddy 直接服务本仓库目录，静态文件无需重启）
# 用法（在服务器上仓库根目录）：bash deploy.sh
set -euo pipefail

cd "$(dirname "$0")"

echo "▶ 拉取最新代码..."
git fetch --all --prune
git reset --hard origin/master

echo "✅ 已更新到：$(git rev-parse --short HEAD)  $(git log -1 --pretty=%s)"
echo "   me/      -> http://<server>/me/"
echo "   showcase -> http://<server>/"
echo
echo "ℹ 如果改动了 deploy/Caddyfile，需要手动同步："
echo "   cp deploy/Caddyfile /etc/caddy/Caddyfile && caddy validate --config /etc/caddy/Caddyfile && systemctl reload caddy"
