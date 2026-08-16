# 个人学术主页

这是一个纯静态单页网站，无需安装依赖或运行构建命令，可直接部署到 GitHub Pages。

## 修改内容

在 `index.html` 中搜索以下占位内容并替换：

- `你的名字` / `YourName`
- `Your University`
- `hello@example.com`
- `github.com/ychq1314`
- `your-wechat-id`
- 专业、研究方向、简介、兴趣与教育经历

头像区域目前使用抽象字母占位。需要换成照片时，可将图片放在同一目录，并把 `.portrait-placeholder` 内的内容替换为 `<img>`；建议图片使用竖版比例。

## GitHub Pages 部署

1. 将本目录内全部文件上传到 GitHub 仓库。
2. 进入仓库的 **Settings → Pages**。
3. 在 **Build and deployment** 中选择 **Deploy from a branch**。
4. 选择 `main` 分支和 `/ (root)` 目录后保存。

站点只使用 HTML、CSS 与 JavaScript，不依赖后端服务。
