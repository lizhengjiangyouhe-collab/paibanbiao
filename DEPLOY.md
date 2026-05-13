# 部署指南

## 上传到GitHub

### 1. 创建GitHub仓库
1. 登录GitHub
2. 点击"New repository"
3. 输入仓库名称（如：schedule-manager）
4. 设置为Public或Private
5. 点击"Create repository"

### 2. 初始化Git仓库
```bash
cd g:\TRAE项目组\排班表
git init
git add index.html sw.js manifest.json tubiao.png README.md DEPLOY.md .gitignore
git commit -m "Initial commit: 档期管家 v3.1.0"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

### 3. 启用GitHub Pages
1. 进入GitHub仓库
2. 点击"Settings"
3. 找到"Pages"选项
4. 在"Build and deployment"下：
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
5. 点击"Save"
6. 等待几分钟，页面就可以访问了

## 添加到iPhone主屏幕

1. 在Safari浏览器中打开GitHub Pages的网址
2. 点击底部的分享按钮（方框带箭头）
3. 向下滑动找到"添加到主屏幕"
4. 点击"添加"
5. 现在您的主屏幕上就会显示"档期管家"应用了！

## 访问地址

GitHub Pages地址通常是：
```
https://你的用户名.github.io/仓库名/
```

## 常见问题

### 页面显示不正常？
- 确保index.html在根目录
- 检查文件名大小写正确
- 等待GitHub Pages部署完成（通常几分钟）

### 图标不显示？
- 确保tubiao.png在根目录
- 重新添加到主屏幕

### 数据丢失？
- 数据存储在LocalStorage
- v3.0.0+版本有数据保险箱保护，更新不会丢失数据
- 建议定期使用"📤 导出数据"功能备份
- 需要恢复时使用"📥 导入数据"功能

### 离线使用？
- v3.0.0+支持PWA离线模式
- 第一次需要联网加载
- 之后可以离线使用
- 有网时会自动检查更新

### 需要更新版本？
1. 修改代码并推送到GitHub
2. GitHub Pages会自动部署
3. 用户刷新页面即可获取新版本
4. 数据会自动保留（v3.0.0+）
