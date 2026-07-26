# SharonZX-Ling.github.io 项目记忆

## 网站类型
- 个人作品集 Portfolio 网站，GitHub Pages 部署
- 用户：凌子洵 ZiXun Ling，定位：市场营销 · 内容策划 · 品牌运营

## 设计演变
- **V1**: 浅色清新风 + 左侧固定导航 + 白色卡片（用户不喜欢红色信封 Hero 版本，已回退）
- **V2 (当前)**: 电影感 Cinematic Editorial 风格，参考 Codrops IntroGridMotionTransition
  - 暗色背景 (#0C0C0C)，金色强调 (#C9A96E)
  - Playfair Display (serif) + Inter (sans-serif)
  - Hero: 4列×3行图片网格（8张图）+ 交错入场动画 + 3D hover tilt + 名字overlay
  - 浮动导航点（右侧 mix-blend-difference）
  - 滚动揭示动画（IntersectionObserver）
  - 项目详情 slide-up overlay（替代弹窗）
  - 加载遮罩带进度条
  - 电影感暗影：径向暗角 + 下方重渐变 + 降饱和/提对比/压亮度

## 内容结构
- Hero → About → Internship → Projects → Others → Contact
- Internship: Case Gallery accordion 展开式（数据驱动，internshipData 在 main.js）
- 实习3段（overview + media + links，支持 YouTube/Bilibili/本地视频/图片）
- 项目4个（视频/PDF/图片×2）
- 其他经历3条（时间线）
- 联系4种（邮箱/微信复制/小红书/B站）

## 技术栈
- 纯 HTML/CSS/JS，无构建工具
- Google Fonts CDN (Playfair Display + Inter)
- GitHub token: 见 ~/.workbuddy/MEMORY.md（push 用，勿写入本仓库文件）

## 用户偏好
- 不喜欢红色信封版 Hero，偏好卡片式或网格式
- 希望未来自行添加内容，不喜欢写死的假数据
- 喜欢电影感 + editorial + premium 的视觉风格
- 希望暗影更重更深（加强电影感）
- 名字用"凌子洵 / ZiXun Ling"，不用 Sharon Ling
