# 📹 视频资源

## 推荐做法

**不要把视频文件直接放进 GitHub 仓库**，原因：
- 仓库空间限制 1GB
- 视频文件通常很大（几十MB到几GB）
- 加载速度慢

## 推荐方案

### 1. B站（推荐）
1. 把视频上传到 B 站
2. 在 `index.html` 中找到 `data-type="video"` 的位置
3. 把 `data-src` 改成 B 站视频链接，例如：
   ```html
   data-src="https://www.bilibili.com/video/BV1xxxxxxx"
   ```

### 2. YouTube
```html
data-src="https://www.youtube.com/embed/xxxxxxx"
```

### 3. 腾讯视频
```html
data-src="https://v.qq.com/iframe/preview.html?vid=xxxxxxx"
```

### 4. 本地视频（仅小视频）
如果视频很小（< 10MB），可以放进本目录，然后：
```html
data-src="assets/videos/your-video.mp4"
```
弹窗会自动用 `<video>` 标签播放。
