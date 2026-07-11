# 个人作品集网站规划方案

> 风格：浅色清新风 ｜ 形式：单页滚动 ｜ 技术：纯 HTML + CSS + JS
> 目标：托管于 GitHub Pages，无需任何构建工具

---

## 一、整体架构

### 1.1 页面布局（参考截图）
```
┌────────────────────────────────────────────────────┐
│ ┌─────────┐  ┌──────────────────────────────────┐ │
│ │         │  │  📅 板块标题 (例如 Design)        │ │
│ │ Profile │  │  副标题描述                       │ │
│ │         │  │  ┌────────┐  ┌────────┐         │ │
│ │ 👤 主页 │  │  │ 卡片 1 │  │ 卡片 2 │         │ │
│ │ 💼 实习 │  │  │ 视频/  │  │ 链接/  │         │ │
│ │ 🚀 项目 │  │  │ PDF/   │  │ 图片   │         │ │
│ │ 🎨 其他 │  │  │ 图片   │  │        │         │ │
│ │ 📬 联系 │  │  └────────┘  └────────┘         │ │
│ │         │  │                                  │ │
│ └─────────┘  └──────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

### 1.2 Banner 分类（左侧导航 + 右侧锚点）
1. **Home / 主页介绍** — 个人简介、技能标签、联系方式
2. **Internship / 实习经历** — 每段经历可跳转官号
3. **Projects / 项目经历** — 含视频作品、PDF 策划案、图片
4. **Others / 其他经历** — 比赛、社团、志愿等
5. **Contact / 联系方式** — 邮箱、微信、社交链接

---

## 二、视觉规范

| 项目 | 取值 |
|------|------|
| 主背景 | `#FAFAF8`（暖白） |
| 卡片背景 | `#FFFFFF` |
| 主文字 | `#1A1A1A` |
| 副文字 | `#6B6B6B` |
| 强调色（按钮） | 玫红 `#E94560`（与参考图保持一致） |
| 边框/分隔 | `#ECECEC` |
| 圆角 | 卡片 `16px` / 按钮 `999px`（胶囊） |
| 阴影 | `0 4px 20px rgba(0,0,0,0.06)` |
| 字体 | `system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif` |
| 标题 | 大号无衬线（32–40px，加粗） |
| 导航图标 | 用 emoji 或 SVG inline 即可 |

---

## 三、文件结构

```
SharonZX-Ling.github.io/
├── index.html              # 主页面（单页 + 锚点）
├── css/
│   └── style.css           # 全局样式
├── js/
│   └── main.js             # 滚动高亮、移动端菜单
├── assets/
│   ├── images/             # 图片作品（jpg/png/webp）
│   ├── videos/             # 视频作品（mp4，建议外链B站/YT更省空间）
│   └── pdfs/               # 策划案PDF
├── README.md
└── PLAN.md
```

> **GitHub Pages 空间提示**：单仓 1GB，流量 100GB/月。建议视频外链 B 站/YouTube，PDF 可外链腾讯文档/Notion。

---

## 四、各板块内容规划

### 4.1 Home 主页
- 头像 + 一句话自我介绍
- 核心技能标签（营销策划 / 文案 / 数据分析 / 设计等）
- 教育背景

### 4.2 Internship 实习经历（**重点**）
每段实习 = 一张卡片，包含：
- 公司 logo / 名称
- 职位 / 实习时间
- 一句话成果描述
- **🔗 跳转官号按钮**（公众号/小红书/B站/官网）
- 关联作品缩略图（点击查看 PDF 或视频）

### 4.3 Projects 项目经历
- 卡片网格布局
- 作品类型徽章：`视频` / `PDF` / `图片`
- 点击弹出预览（视频播放 / PDF iframe / 图片灯箱）

### 4.4 Others 其他经历
- 比赛获奖、社团、志愿、个人兴趣
- 时间线样式（可选）

### 4.5 Contact 联系方式
- 邮箱（可点击复制）
- 微信二维码图片
- 社交平台链接

---

## 五、实施步骤

### Step 1 — 初始化仓库（已完成）
仓库 `SharonZX-Ling.github.io` 已创建，GitHub Pages 会自动识别 `main` 分支根目录。

### Step 2 — 创建文件骨架
- `index.html`
- `css/style.css`
- `js/main.js`
- `assets/images/`、`assets/pdfs/`（视频建议先不传本地，留外链位）

### Step 3 — 编写 HTML 结构
- 左侧导航 `<aside class="sidebar">`
- 右侧内容 `<main class="content">`，每板块用 `<section id="xxx">`
- 卡片组件用 `<article class="card">`

### Step 4 — 编写 CSS
- 桌面端：左侧 240px 固定 + 右侧自适应
- 移动端：左侧收起为顶部汉堡菜单
- 滚动到板块时导航项高亮

### Step 5 — JS 交互
- 平滑滚动 `scroll-behavior: smooth`
- IntersectionObserver 监听当前板块，高亮导航
- 移动端汉堡菜单切换
- 视频/PDF/图片的弹窗预览

### Step 6 — 内容填充
- 我会先用占位内容搭好结构
- 你后续把图片/PDF 放进 `assets/`，把视频外链填入即可

### Step 7 — 部署
```bash
git add .
git commit -m "feat: init personal portfolio"
git push origin main
```
等待 1–2 分钟，访问 `https://SharonZX-Ling.github.io/` 即可。

---

## 六、后续扩展（可选）

- 🌓 **深色模式切换**（右上角图标）
- 🌍 **中英双语切换**
- 📊 **访问统计**（简单加个 `countapi.xyz`）
- 💌 **留言板**（接入腾讯云 CloudBase 或 LeanCloud）
- 🎬 **视频懒加载**（IntersectionObserver + 封面图）
