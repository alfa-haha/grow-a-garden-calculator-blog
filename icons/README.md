# 图标资源目录

本目录用于存放Garden Pro Calculator的图标资源文件，包括favicon、应用图标、UI图标等。

## 文件组织结构

```
icons/
├── favicon.ico         # 网站图标
├── favicon-16x16.png   # 16x16 favicon
├── favicon-32x32.png   # 32x32 favicon
├── apple-touch-icon.png # Apple设备图标
├── android-chrome-192x192.png # Android Chrome图标
├── android-chrome-512x512.png # Android Chrome图标（大）
├── ui/                 # UI图标
│   ├── search.svg
│   ├── menu.svg
│   ├── close.svg
│   ├── arrow-up.svg
│   └── ...
├── actions/            # 操作图标
│   ├── calculate.svg
│   ├── save.svg
│   ├── export.svg
│   ├── compare.svg
│   └── ...
└── categories/         # 分类图标
    ├── vegetables.svg
    ├── fruits.svg
    ├── flowers.svg
    └── ...
```

## 图标规范

### Favicon规范
```html
<!-- HTML中的favicon引用 -->
<link rel="icon" type="image/x-icon" href="icons/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="icons/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon.png">
<link rel="manifest" href="manifest.json">
```

### 尺寸标准
- **favicon.ico**: 16x16, 32x32, 48x48 (多尺寸ICO文件)
- **PNG favicon**: 16x16, 32x32, 192x192, 512x512
- **Apple touch icon**: 180x180
- **UI图标**: 24x24, 32x32 (SVG首选)

## SVG图标规范

### 基本要求
- 使用SVG格式（矢量图标）
- 视窗大小: 24x24 或 32x32
- 线条粗细: 1.5px - 2px
- 填充色: 使用currentColor
- 无内联样式

### SVG模板
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="..." stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 样式指南
- **设计风格**: 简洁、现代、统一
- **线条样式**: 圆角线条，统一粗细
- **颜色方案**: 支持主题切换，使用CSS变量
- **视觉重量**: 保持视觉平衡，不过于复杂

## 图标使用

### HTML中使用
```html
<!-- 内联SVG -->
<svg class="icon icon-search" width="24" height="24">
  <use href="icons/ui/search.svg#icon"></use>
</svg>

<!-- IMG标签 -->
<img src="icons/ui/search.svg" alt="搜索" class="icon">

<!-- 背景图片 -->
<span class="icon icon-search"></span>
```

### CSS中使用
```css
/* 作为背景图片 */
.icon-search {
  background-image: url('../icons/ui/search.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 24px;
  height: 24px;
}

/* 使用CSS变量控制颜色 */
.icon {
  fill: var(--icon-color, currentColor);
  stroke: var(--icon-color, currentColor);
}

/* 主题适配 */
[data-theme="dark"] .icon {
  --icon-color: #ffffff;
}

[data-theme="light"] .icon {
  --icon-color: #333333;
}
```

### JavaScript中使用
```javascript
// 动态加载图标
function loadIcon(iconName) {
  return fetch(`icons/ui/${iconName}.svg`)
    .then(response => response.text())
    .then(svgText => {
      const div = document.createElement('div');
      div.innerHTML = svgText;
      return div.firstElementChild;
    });
}

// 使用示例
loadIcon('search').then(iconElement => {
  document.querySelector('.search-button').appendChild(iconElement);
});
```

## 图标命名规范

### 基本规则
- 使用小写字母和连字符
- 使用描述性名称
- 避免缩写，除非是通用缩写
- 保持名称简洁明确

### 命名示例
```
✅ 正确命名:
- search.svg
- menu-hamburger.svg
- arrow-left.svg
- close-circle.svg
- user-profile.svg

❌ 错误命名:
- Search.svg
- menu_hamburger.svg
- leftArrow.svg
- closeBtn.svg
- usrProfile.svg
```

## 图标优化

### 文件大小优化
1. **移除不必要的元素**: 清理隐藏图层、未使用的路径
2. **简化路径**: 减少锚点数量，优化贝塞尔曲线
3. **使用SVGO**: 自动优化SVG文件
4. **批量处理**: 使用构建工具统一优化

### SVGO配置示例
```json
{
  "plugins": [
    "removeDoctype",
    "removeXMLProcInst",
    "removeComments",
    "removeMetadata",
    "removeEditorsNSData",
    "cleanupAttrs",
    "mergeStyles",
    "inlineStyles",
    "minifyStyles",
    "cleanupNumericValues",
    "convertColors",
    "removeUselessStrokeAndFill",
    "cleanupListOfValues",
    "removeViewBox",
    "removeDimensions"
  ]
}
```

## 可访问性

### 语义化标记
```html
<!-- 装饰性图标 -->
<svg aria-hidden="true" class="icon">...</svg>

<!-- 功能性图标 -->
<svg role="img" aria-label="搜索" class="icon">...</svg>

<!-- 按钮中的图标 -->
<button aria-label="搜索">
  <svg aria-hidden="true" class="icon">...</svg>
</button>
```

### 高对比度支持
```css
/* 高对比度模式适配 */
@media (prefers-contrast: high) {
  .icon {
    --icon-color: CanvasText;
    stroke-width: 2.5px;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .icon {
    animation: none;
    transition: none;
  }
}
```

## 图标创建工具

### 推荐工具
- **Figma**: 矢量图标设计
- **Adobe Illustrator**: 专业矢量编辑
- **Inkscape**: 免费开源SVG编辑器
- **Heroicons**: 开源图标库
- **Feather Icons**: 简洁线条图标

### 创建流程
1. 使用设计工具创建图标
2. 导出为SVG格式
3. 使用SVGO优化文件
4. 测试在不同主题下的效果
5. 验证可访问性
6. 添加到图标库

## 许可证和版权

- 自制图标: MIT License
- 第三方图标: 遵循原作者许可证
- 商业使用: 请确认许可证条款
- 贡献图标: 需提供许可证声明

---

*最后更新: 2024年* 