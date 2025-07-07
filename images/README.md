# 图片资源目录

本目录用于存放Garden Pro Calculator的图片资源文件。

## 文件组织结构

```
images/
├── crops/          # 作物图片
│   ├── carrot.png
│   ├── tomato.png
│   └── ...
├── pets/           # 宠物图片
│   ├── cat.png
│   ├── dog.png
│   └── ...
├── mutations/      # 突变效果图片
│   ├── golden.png
│   ├── rainbow.png
│   └── ...
├── ui/             # UI界面图片
│   ├── bg-hero.jpg
│   ├── pattern.png
│   └── ...
└── screenshots/    # 项目截图
    ├── calculator.png
    ├── crops-list.png
    └── ...
```

## 命名规范

### 基本规则
- 使用小写字母和连字符
- 避免使用空格和特殊字符
- 使用描述性的文件名
- 包含合适的文件扩展名

### 示例
- ✅ 正确: `golden-carrot.png`
- ✅ 正确: `pet-cat-rare.jpg`
- ❌ 错误: `Golden Carrot.PNG`
- ❌ 错误: `pet_cat_rare.jpeg`

## 文件格式

### 推荐格式
- **PNG**: 适用于图标、透明背景图片
- **JPG/JPEG**: 适用于照片、背景图片
- **SVG**: 适用于矢量图标、简单图形
- **WebP**: 适用于现代浏览器的优化图片

### 尺寸建议
- 作物图标: 64x64px, 128x128px
- 宠物图标: 64x64px, 128x128px
- 背景图片: 1920x1080px及以下
- UI图标: 24x24px, 32x32px, 48x48px

## 优化要求

### 文件大小
- 单个图片文件 < 500KB
- 优先使用WebP格式（现代浏览器）
- 提供PNG/JPG降级方案

### 性能优化
- 使用适当的压缩率
- 提供多种尺寸的版本
- 考虑使用sprite图片合并小图标

## 版权声明

- 所有图片资源仅供学习和开发使用
- 不得用于商业用途
- 如使用第三方素材，请注明来源

## 贡献指南

### 添加新图片
1. 确保图片符合命名规范
2. 选择合适的子目录
3. 优化文件大小
4. 更新相关文档

### 图片要求
- 清晰度高，无模糊
- 背景干净，主题突出
- 风格统一，色彩协调
- 适合目标用户群体

## 使用示例

```html
<!-- 作物图片 -->
<img src="images/crops/carrot.png" alt="胡萝卜" class="crop-icon">

<!-- 宠物图片 -->
<img src="images/pets/cat.png" alt="猫咪" class="pet-icon">

<!-- 背景图片 -->
<div class="hero" style="background-image: url('images/ui/bg-hero.jpg')"></div>
```

```css
/* CSS中使用 */
.crop-carrot {
    background-image: url('../images/crops/carrot.png');
}

.hero-background {
    background-image: url('../images/ui/bg-hero.jpg');
    background-size: cover;
    background-position: center;
}
```

## 注意事项

1. **响应式设计**: 确保图片在不同设备上显示良好
2. **加载性能**: 避免加载过大的图片文件
3. **无障碍访问**: 为所有图片提供适当的alt文本
4. **版本控制**: 避免频繁更改图片文件名，影响缓存效果

---

*最后更新: 2024年* 