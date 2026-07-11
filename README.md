---
title: Sharon Ling · 个人作品集
---

# Sharon Ling · 个人作品集

我的个人作品集网站，展示实习经历、项目作品与其他成长轨迹。

🌐 **在线访问**: <https://SharonZX-Ling.github.io/>

## 技术栈

- 纯 HTML + CSS + JavaScript（无构建工具）
- 托管于 GitHub Pages
- 单页滚动 + 锚点导航

## 目录结构

```
.
├── index.html          # 主页
├── css/style.css       # 样式
├── js/main.js          # 交互脚本
├── assets/
│   ├── images/         # 图片作品
│   ├── videos/         # 视频作品（建议外链 B 站）
│   └── pdfs/           # 策划案 PDF
├── PLAN.md             # 网站规划方案
└── README.md
```

## 本地预览

```bash
# 任意 HTTP 服务器即可，例如：
python -m http.server 8000
# 然后访问 http://localhost:8000
```

## 内容更新

1. 修改 `index.html` 中的文本内容
2. 替换 `assets/images/` 中的图片
3. 把 PDF 放入 `assets/pdfs/`
4. 视频建议使用 B 站外链（节省仓库空间）
5. `git add . && git commit -m "update" && git push`

## 部署

仓库推送到 GitHub 后，在 **Settings → Pages** 选择 `main` 分支根目录，等待 1-2 分钟即可访问。
