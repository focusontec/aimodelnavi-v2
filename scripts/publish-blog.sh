#!/bin/bash
#
# publish-blog.sh — 一键发布中文博客到 AI Models Navi
#
# 用法：
#   ./scripts/publish-blog.sh <中文markdown文件>
#
# 前置条件：
#   - gh CLI 已登录（gh auth login）
#   - GitHub 仓库已配置 LLM_API_KEY secret
#
# 工作流程：
#   读取中文 Markdown → 调用 GitHub Actions → 自动翻译成日文 → 发布到网站

set -euo pipefail

REPO="focusontec/aimodelnavi"
WORKFLOW="publish-blog.yml"

# ── 参数检查 ──

if [ $# -lt 1 ]; then
  echo "用法: $0 <中文markdown文件>"
  echo ""
  echo "示例: $0 ~/articles/my-post.md"
  echo ""
  echo "Markdown 文件格式："
  echo "  ---"
  echo "  title: \"文章标题\""
  echo "  tag: \"Anthropic\"        # 可选，默认 解説"
  echo "  excerpt: \"摘要\"         # 可选，不填则 LLM 生成"
  echo "  ---"
  echo "  正文内容..."
  exit 1
fi

FILE="$1"
AUTO_YES=false

# Check for --yes flag
for arg in "$@"; do
  if [ "$arg" = "--yes" ] || [ "$arg" = "-y" ]; then
    AUTO_YES=true
  fi
done

if [ ! -f "$FILE" ]; then
  echo "错误：文件不存在 — $FILE"
  exit 1
fi

# ── 检查 gh 登录状态 ──

if ! gh auth status &>/dev/null; then
  echo "错误：gh CLI 未登录，请先运行 gh auth login"
  exit 1
fi

# ── 解析 frontmatter ──

TITLE=""
TAG="解説"
EXCERPT=""
BODY=""

# 提取 frontmatter 和正文
IN_FRONTMATTER=false
FRONTMATTER_DONE=false
LINE_NUM=0

while IFS= read -r line || [ -n "$line" ]; do
  LINE_NUM=$((LINE_NUM + 1))

  if [ "$LINE_NUM" -eq 1 ] && [[ "$line" == "---" ]]; then
    IN_FRONTMATTER=true
    continue
  fi

  if [ "$IN_FRONTMATTER" = true ] && [[ "$line" == "---" ]]; then
    IN_FRONTMATTER=false
    FRONTMATTER_DONE=true
    continue
  fi

  if [ "$IN_FRONTMATTER" = true ]; then
    # 解析 YAML frontmatter
    if [[ "$line" =~ ^title:\ *\"(.+)\" ]]; then
      TITLE="${BASH_REMATCH[1]}"
    elif [[ "$line" =~ ^title:\ *(.+) ]]; then
      TITLE="${BASH_REMATCH[1]}"
    elif [[ "$line" =~ ^tag:\ *\"(.+)\" ]]; then
      TAG="${BASH_REMATCH[1]}"
    elif [[ "$line" =~ ^tag:\ *(.+) ]]; then
      TAG="${BASH_REMATCH[1]}"
    elif [[ "$line" =~ ^excerpt:\ *\"(.+)\" ]]; then
      EXCERPT="${BASH_REMATCH[1]}"
    elif [[ "$line" =~ ^excerpt:\ *(.+) ]]; then
      EXCERPT="${BASH_REMATCH[1]}"
    fi
  else
    # 正文部分
    if [ -n "$BODY" ]; then
      BODY="${BODY}"$'\n'"${line}"
    else
      BODY="$line"
    fi
  fi
done < "$FILE"

# 去掉正文开头的空行
BODY=$(echo "$BODY" | sed '/./,$!d')

# ── 验证 ──

if [ -z "$TITLE" ]; then
  echo "错误：Markdown 文件缺少 title 字段"
  echo "请在 frontmatter 中添加: title: \"文章标题\""
  exit 1
fi

if [ -z "$BODY" ]; then
  echo "错误：文件正文为空"
  exit 1
fi

BODY_LEN=${#BODY}

# ── 提取外部图片 URL（仅限图片文件或已知图床） ──

# 第一步：提取所有 markdown 图片 URL
ALL_IMAGE_URLS=$(echo "$BODY" | grep -oP '!\[[^\]]*\]\(https?://[^)]+\)' | grep -oP 'https?://[^)]+' || true)

# 第二步：过滤出真正的图片 URL
# - 包含图片扩展名：.jpg, .jpeg, .png, .gif, .webp, .svg, .avif
# - 或来自已知图床域名：images.unsplash.com, pbs.twimg.com, imgur.com, cloudinary.com
IMAGE_URLS=""
while IFS= read -r url; do
  [ -z "$url" ] && continue
  # 检查是否是图片扩展名或已知图床
  if echo "$url" | grep -qiE '\.(jpg|jpeg|png|gif|webp|svg|avif)(\?|$)|images\.unsplash\.com|pbs\.twimg\.com|imgur\.com|cloudinary\.com|cdn\.openai\.com|storage\.googleapis\.com'; then
    if [ -n "$IMAGE_URLS" ]; then
      IMAGE_URLS="${IMAGE_URLS}"$'\n'"${url}"
    else
      IMAGE_URLS="$url"
    fi
  fi
done <<< "$ALL_IMAGE_URLS"

IMAGE_COUNT=0
if [ -n "$IMAGE_URLS" ]; then
  IMAGE_COUNT=$(echo "$IMAGE_URLS" | wc -l | tr -d ' ')
fi

# 报告被跳过的非图片 URL
if [ -n "$ALL_IMAGE_URLS" ]; then
  ALL_COUNT=$(echo "$ALL_IMAGE_URLS" | wc -l | tr -d ' ')
  SKIPPED=$((ALL_COUNT - IMAGE_COUNT))
  if [ "$SKIPPED" -gt 0 ]; then
    echo "  注意: 跳过 $SKIPPED 个非图片 URL（网页链接）"
  fi
fi

echo "═══════════════════════════════════════"
echo "  发布博客到 AI Models Navi"
echo "═══════════════════════════════════════"
echo ""
echo "  标题: $TITLE"
echo "  标签: $TAG"
echo "  摘要: ${EXCERPT:-(自动生成)}"
echo "  正文: $BODY_LEN 字符"
echo "  图片: $IMAGE_COUNT 张外部图片"
echo ""

# ── 确认发布 ──

if [ "$AUTO_YES" = false ]; then
  read -p "确认发布？(y/N) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "已取消"
    exit 0
  fi
fi

# ── 触发 GitHub Actions ──

echo ""
echo "  正在触发 GitHub Actions..."

# 构造图片 URL JSON 数组
if [ "$IMAGE_COUNT" -gt 0 ]; then
  IMAGE_URLS_JSON=$(echo "$IMAGE_URLS" | jq -R -s 'split("\n") | map(select(length > 0))')
else
  IMAGE_URLS_JSON="[]"
fi

# 构造 JSON payload（jq 处理转义，避免 shell 特殊字符问题）
PAYLOAD=$(jq -n \
  --arg title "$TITLE" \
  --arg tag "$TAG" \
  --arg excerpt "$EXCERPT" \
  --arg content "$BODY" \
  --argjson images "$IMAGE_URLS_JSON" \
  '{
    ref: "main",
    inputs: {
      title: $title,
      tag: $tag,
      excerpt: $excerpt,
      content: $content,
      images: ($images | join(","))
    }
  }')

# 使用 gh api 发送请求（gh 自带认证，无需额外 token）
RESPONSE=$(gh api \
  --method POST \
  -H "Accept: application/vnd.github.v3+json" \
  "/repos/$REPO/actions/workflows/$WORKFLOW/dispatches" \
  --input - <<< "$PAYLOAD" \
  2>&1) && HTTP_CODE=204 || HTTP_CODE=$?

if [ "$HTTP_CODE" = "204" ] || [[ "$RESPONSE" == *"204"* ]]; then
  echo "  ✓ 已触发！"
  echo ""
  echo "  GitHub Actions 正在处理："
  echo "  1. 调用 LLM 将中文翻译成日文"
  if [ "$IMAGE_COUNT" -gt 0 ]; then
    echo "  2. 下载 $IMAGE_COUNT 张图片到 public/images/blog/"
    echo "  3. 保存到 src/content/blog/"
  else
    echo "  2. 保存到 src/content/blog/"
  fi
  echo "  自动 commit + push → Vercel 自动部署"
  echo ""
  echo "  查看进度："
  echo "  https://github.com/$REPO/actions/workflows/$WORKFLOW"
  echo ""
  echo "  通常 1-3 分钟完成部署。"
else
  echo "  ✗ 触发失败"
  echo "  $RESPONSE"
  echo "  请检查 gh auth status 和仓库权限"
  exit 1
fi
