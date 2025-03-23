# Panel FE

一个基于 React 和 AntDesign 构建的现代化桌面风格网页应用。

## 🌟 特点

- 🖥️ **桌面风格界面**
  - 支持窗口拖拽、缩放和最大化
  - Dock 栏应用快捷启动
  - 右键菜单支持
  - 毛玻璃效果设计

- 🎨 **现代化 UI**
  - 响应式设计
  - 流畅的动画效果
  - 优雅的毛玻璃效果
  - 自适应深色/浅色模式

- 🛠️ **实用功能**
  - 实时天气信息显示
  - 社交媒体快捷链接
  - 应用管理系统
  - 系统公告展示

## 🚀 技术栈

- **框架**: React 18
- **语言**: TypeScript
- **构建工具**: Vite
- **样式解决方案**: 
  - Emotion (CSS-in-JS)
  - Ant Design 组件库
- **状态管理**: React Context
- **API 集成**:
  - 和风天气 API
  - IP 定位服务

## 📦 安装

1. 克隆项目
```bash
git clone https://github.com/ZQDesigned/panel-fe.git
cd panel-fe
```

2. 安装依赖
```bash
bun install
```

3. 环境配置
```bash
# 创建 .env 文件并添加必要的环境变量
cp .env.example .env
```

4. 启动开发服务器
```bash
bun dev
```

## 🔧 环境变量

项目需要以下环境变量：

- `VITE_QWEATHER_API_KEY`: 和风天气 API 密钥

## 🎯 使用说明

1. **应用启动**
   - 点击 Dock 栏图标启动应用
   - 支持拖拽调整窗口位置和大小
   - 双击标题栏最大化窗口

2. **窗口管理**
   - 右键点击 Dock 图标显示上下文菜单
   - 支持最小化、最大化、关闭操作
   - 可以通过 Dock 栏快速切换应用

3. **个性化设置**
   - 支持修改背景图片
   - 可自定义主题色
   - 支持调整界面布局

## 📄 许可

[MIT License](LICENSE)

## 👨‍💻 作者

- ZQDesigned
- 邮箱：zqdesigned@mail.lnyynet.com
- 博客：[https://blog.zqdesigned.city](https://blog.zqdesigned.city)

## 🙏 鸣谢

- [Ant Design](https://ant.design)
- [和风天气](https://dev.qweather.com)
- [LoliAPI](https://www.loliapi.cn)
