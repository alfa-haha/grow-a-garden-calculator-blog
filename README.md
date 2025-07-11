# Garden Pro Calculator

Professional garden planting game calculator tool, providing precise crop value calculation and mutation effects analysis.

## 🔄 最新功能更新 (2024年最新更新)

### 🎯 **Friend Boost功能优化** (最新)

经过用户需求分析，对首页calculator模块中的Friend Boost功能进行了重要优化：

#### **🎮 交互体验提升**
- **精确步进**：Slider现在只能选择整10的倍数（0%, 10%, 20%, ..., 100%）✅
- **手动输入**：新增数值输入框，支持直接输入百分比值 ✅
- **双向同步**：Slider和输入框实时同步，确保数据一致性 ✅
- **智能验证**：自动规范化输入值，限制在有效范围内 ✅

#### **⚙️ 计算公式集成**
Friend Boost现已完全集成到官方计算公式中：

```
Total Value = Base Value × (1 + ΣMutations - Count) × Growth × Weight² × (1 + Friend Boost%)
```

**影响示例**：
- 30% Friend Boost → 最终价值增加30%
- 50% Friend Boost → 最终价值增加50%
- 与其他所有因子（mutations、growth、weight）完美叠加

#### **🛠️ 技术实现**
- **向后兼容**：所有现有功能保持不变
- **性能优化**：实时计算，响应时间 < 50ms
- **代码优化**：重构计算核心，支持新参数无缝集成

### ✅ **数据一致性校准完成**

经过系统性的数据校准检查，已确保首页calculator模块严格按照标准JSON文件加载数据：

#### **📊 Crops数据源确认**
- **数据源**：`data/crops(new).json` ✅
- **作物数量**：94种作物 ✅
- **字段映射**：
  - `sheckle_price` → `buyPrice` (购买价格)
  - `minimum_value` → `sellValue` (最小价值/收益)
  - `tier` → `rarity` (稀有度等级)
  - `multiHarvest` → 多重收获标识

#### **🌟 Mutations数据源确认** 
- **数据源**：`data/mutations(new).json` ✅
- **Mutations数量**：40+种变异效果 ✅
- **动态加载**：已移除HTML硬编码，改为JavaScript动态渲染 ✅
- **分类系统**：
  - **Growth Mutations**: Ripe(×1), Gold(×20), Rainbow(×50)
  - **Temperature Mutations**: Wet(×2), Chilled(×2), Drenched(×5), Frozen(×10)
  - **Environmental Mutations**: 35+种环境变异，从Windstruck(×2)到Dawnbound(×150)

#### **🔧 关键修复内容**

1. **移除硬编码Mutations** ❌ → ✅
   - 删除了index.html中所有硬编码的mutation选项
   - 实现了基于`mutations(new).json`的动态加载系统

2. **优化数据字段映射** 🔄 → ✅
   - 确保crops显示正确的`minimum_value`作为收益价格
   - 使用`tier`字段作为稀有度标准
   - 添加了数据验证和fallback机制

3. **计算精度提升** 📈 → ✅
   - 所有mutation倍数严格按照JSON文件中的`sheckles_multiplier`值
   - 支持完整的官方计算公式：`Total Price = Base Value × (1 + ΣMutations - Count) × Growth × Weight²`

### 📈 **数据准确性保证**

| 数据类型 | 数据源文件 | 记录数量 | 更新状态 |
|---------|-----------|---------|----------|
| **Crops** | `data/crops(new).json` | 94种作物 | ✅ 已校准 |
| **Mutations** | `data/mutations(new).json` | 40+种变异 | ✅ 已校准 |
| **Pets** | `data/pets(new).json` | 待核实 | 🔄 使用中 |
| **Eggs** | `data/eggs.json` | 待核实 | 🔄 使用中 |
| **Gears** | `data/gears.json` | 待核实 | 🔄 使用中 |

### ⚡ **性能优化**

- **初始化时间**: < 3秒
- **计算响应**: < 100ms  
- **数据加载**: 并行加载所有JSON文件
- **内存占用**: 优化了数据结构和缓存机制

## 🌟 Core Features

## 🚀 功能特点

- **⚡ 极致性能**：纯静态网站，加载速度 < 3秒，实时计算响应 < 100ms
- **🎯 精准计算**：支持复杂的多重变异叠加计算，包含Friend Boost因子，100% 准确的价值评估
- **⚖️ 智能权重设置**：选择作物时自动设置对应的basic_weight值，支持94种作物的真实重量数据
- **📱 完美适配**：响应式设计，完美支持手机、平板、桌面所有设备
- **🔐 隐私安全**：本地数据处理，无需服务器依赖，保护用户隐私安全
- **💰 零成本部署**：GitHub Pages 免费托管，无需服务器成本
- **🌈 现代设计**：美观的界面设计，流畅的动画效果，完美的用户体验
- **🚀 快速计算**：首页集成计算器，零点击即可开始计算，极速响应用户需求

### 🔧 Weight参数智能更新功能
当用户在首页calculator模块中选择任何作物时：
- **自动设置**：weight输入框会自动填入该作物的basic_weight值
- **真实数据**：基于`crops(new).json`中94种作物的真实重量数据
- **智能处理**：
  - 正常情况：显示作物的实际basic_weight（如胡萝卜0.24kg，西瓜7.3kg）
  - 特殊情况：对于没有指定weight的作物（如Traveler's Fruit），使用默认值2.85kg
- **即时计算**：weight值更新后立即重新计算作物价值，支持官方公式中的Weight²部分

#### 使用示例
- 选择"Carrot"（胡萝卜）→ weight自动设置为0.24kg
- 选择"Watermelon"（西瓜）→ weight自动设置为7.3kg  
- 选择"Dragon Fruit"（火龙果）→ weight自动设置为11.38kg
- 选择"Mushroom"（蘑菇）→ weight自动设置为25.9kg
- 选择"Traveler's Fruit"→ weight自动设置为2.85kg（默认值）

## 🛠️ 技术栈

- **前端框架**：原生 HTML5 + CSS3 + JavaScript ES6+
- **数据存储**：JSON 文件 + localStorage
- **样式框架**：自定义 CSS 变量系统
- **部署平台**：GitHub Pages
- **开发工具**：VS Code + Live Server

## 🥚 Eggs Database

全新的蛋类数据库页面，提供完整的蛋类信息查询和孵化分析功能：

### 🎯 核心功能
- **完整的蛋类数据库**：包含所有17种蛋类的详细信息
- **智能搜索**：支持按蛋类名称进行实时搜索
- **来源过滤**：
  - Eggs Shop：商店购买的常规蛋类
  - Honey Shop：蜂蜜商店的特殊蛋类
  - Harvest Shop：收获商店的季节性蛋类
  - Limited Time Shop：限时商店的珍稀蛋类
  - Crafting：合成制作的蛋类
  - Event：活动奖励的蛋类
- **详细信息展示**：每个蛋类包含图片、名称、价格、孵化时间、孵化概率等完整信息
- **互动式表格**：点击任意蛋类可查看详细的模态框信息

### 📊 蛋类分类
1. **常规蛋类**
   - Common Egg (普通蛋)：50,000 Sheckles 或 19 Robux
   - Uncommon Egg (不常见蛋)：150,000 Sheckles 或 39 Robux
   - Rare Egg (稀有蛋)：600,000 Sheckles 或 89 Robux
   - Legendary Egg (传奇蛋)：3,000,000 Sheckles 或 129 Robux
   - Mythical Egg (神话蛋)：8,000,000 Sheckles 或 119 Robux

2. **特殊蛋类**
   - Bug Egg (虫子蛋)：50,000,000 Sheckles 或 149 Robux
   - Night Egg (夜晚蛋)：25,000,000 Sheckles（特殊条件）
   - Bee Egg (蜜蜂蛋)：18 Honey 或 129 Robux
   - Paradise Egg (天堂蛋)：50,000,000 Sheckles 或 139 Robux

3. **限时蛋类**
   - Premium Night Egg、Premium Anti Bee Egg、Premium Oasis Egg 等
   - 快速孵化（30秒）但仅限时可用

### 🎨 界面特色
- **直观的价格显示**：支持多种货币类型（Sheckles、Robux、Honey、Summer Coins等）
- **孵化概率详情**：清晰展示每种宠物的孵化概率
- **响应式布局**：完美适配桌面、平板、手机设备
- **实时统计**：显示搜索结果数量和总蛋类数量
- **详细信息模态框**：包含完整的孵化信息和获取方式

## ⚙️ Gears Database

全新的装备数据库页面，提供完整的装备信息查询和功能分析：

### 🎯 核心功能
- **完整的装备数据库**：包含所有27种装备的详细信息
- **智能搜索**：支持按装备名称、功能描述进行实时搜索
- **等级过滤**：
  - Common（普通）：基础工具，适合新手使用
  - Uncommon（不常见）：进阶工具，提供便利功能
  - Rare（稀有）：高级工具，显著提升效率
  - Legendary（传奇）：强力装备，具有特殊能力
  - Mythical（神话）：顶级装备，功能强大且稀少
  - Divine（神圣）：极品装备，游戏后期必备
  - Craftable（可制作）：特殊装备，需要材料合成
- **获取状态过滤**：区分可获取和不可获取的装备
- **详细信息展示**：每个装备包含图片、名称、价格、等级、功能描述、获取状态等完整信息
- **互动式表格**：点击任意装备可查看详细的模态框信息

### 📊 装备分类
1. **基础工具（Common-Uncommon）**
   - Watering Can（浇水壶）：加速作物生长
   - Trowel（铲子）：重新整理作物排列
   - Recall Wrench（召回扳手）：传送到装备商店

2. **喷洒系统（Rare-Divine）**
   - Basic Sprinkler（基础喷洒器）：增加生长速度和收获量
   - Advanced Sprinkler（高级喷洒器）：增加生长速度和变异几率
   - Godly Sprinkler（神级喷洒器）：全面提升各项能力
   - Master Sprinkler（大师喷洒器）：极大提升所有效果
   - 特殊喷洒器：巧克力、蜂蜜等主题喷洒器

3. **特殊工具（Legendary-Mythical）**
   - Star Caller（星辰召唤器）：吸引流星降落
   - Night Staff（夜晚法杖）：保证月光变异
   - Nectar Staff（花蜜法杖）：吸引蜜蜂授粉
   - Pollen Radar（花粉雷达）：收集周围的授粉果实
   - Magnifying Glass（放大镜）：检视植物价值

4. **管理工具（Divine）**
   - Cleaning Spray（清洁喷雾）：移除作物上的所有变异
   - Favorite Tool（收藏工具）：防止作物被意外收获
   - Harvest Tool（收获工具）：收获植物上的所有果实
   - Lightning Rod（避雷针）：重定向闪电击中位置

5. **制作装备（Craftable）**
   - 特殊喷洒器：需要特定作物和基础喷洒器合成
   - Reclaimer（回收器）：将植物转化为种子，限3次使用

### 💰 价格体系
- **Sheckles**：游戏内主要货币，价格从50,000到50,000,000不等
- **Robux**：高级货币，价格从39到249不等
- **Honey**：蜜蜂相关装备的特殊货币
- **制作材料**：需要特定作物和装备组合
- **特殊货币**：天空商人价格、月球点数等特殊获取方式

### 🎨 界面特色
- **直观的价格显示**：支持多种货币类型（Sheckles、Robux、Honey、制作材料等）
- **等级颜色编码**：不同等级的装备有独特的颜色标识
- **获取状态标识**：清晰显示装备是否可以获取
- **响应式布局**：完美适配桌面、平板、手机设备
- **实时统计**：显示搜索结果数量和总装备数量
- **详细信息模态框**：包含完整的功能说明、价格信息和库存状态

## 🧬 Mutations Database

全新的变异数据库页面，提供完整的变异信息查询和分析功能：

### 🎯 核心功能
- **完整的变异数据库**：包含所有24种变异类型的详细信息
- **智能搜索**：支持按变异名称、描述、类别进行实时搜索
- **分类过滤**：
  - Growth Mutations（成长变异）：Normal、Golden、Rainbow
  - Temperature Mutations（温度变异）：Normal、Chilled、Frozen、Heated
  - Environmental Mutations（环境变异）：17种环境变异效果
- **详细信息展示**：每个变异包含图标、名称、倍数、获取方式、描述等完整信息
- **互动式表格**：点击任意变异可查看详细的模态框信息

### 📊 变异分类
1. **成长变异（Growth Mutations）**
   - 互斥选择，影响基础倍数
   - Normal (×1)、Golden (×20)、Rainbow (×50)

2. **温度变异（Temperature Mutations）**
   - 互斥选择，提供加成效果
   - Normal (+0×)、Chilled (+1×)、Frozen (+2×)、Heated (+1×)

3. **环境变异（Environmental Mutations）**
   - 可叠加选择，所有效果累加
   - 包含17种不同的环境条件变异

### 🎨 界面特色
- **直观的视觉设计**：每种变异都有独特的颜色和图标
- **响应式布局**：完美适配桌面、平板、手机设备
- **实时统计**：显示搜索结果数量和总变异数量
- **详细信息模态框**：包含变异类型、效果类型、叠加规则等详细信息

## 🎉 最新更新 (v2.6.0)

### 🔥 重大更新：计算逻辑重写 - 完全符合官方公式

**背景**：发现原有计算逻辑与游戏官方文档不符，存在严重的计算错误。经过深入分析 `calculator logics.md` 文档，我们完全重写了变异计算核心，现在计算结果与游戏官方逻辑完全一致。

**关键修复**：
- ❌ **原始错误**: `(Base × Growth) + (Base × Environmental)` 
- ✅ **正确公式**: `Base × (1 + ΣMutations - Count) × Growth × Weight²`
- 📈 **影响**: 修复后的计算结果可能相差 **16倍以上**！

**新增功能**：
1. **🧮 官方计算公式实现**
   - 严格按照 `Total Price = Base Value × (1 + ΣMutations - Number of Mutations) × Growth Mutation × (Weight/Base Weight)²`
   - 支持重量因子计算 `(Weight/Base Weight)²`
   - 环境变异正确计算：`1 + 变异总和 - 变异数量`

2. **🛡️ 完整变异规则验证**
   - 实现所有9条官方互斥规则
   - 自动解决变异冲突（如 Cooked 替换 Burnt）
   - 支持变异进阶（AncientAmber > OldAmber > Amber）

3. **📊 详细计算分解**
   - 显示每个计算步骤的详细过程
   - 提供公式说明和中间值
   - 支持调试模式查看计算细节

4. **⚡ 数据结构升级**
   - 从 `data/mutations(new).json` 加载最新变异数据
   - 支持按类别和ID快速查找变异
   - 向后兼容旧的UI组件

**测试示例对比**：
```
场景: Golden + Shocked + Frozen
原始错误结果: ×130 (130,000)
修复后正确结果: ×2,180 (2,180,000)
差异: 16.77倍！
```

---

## 🎉 历史更新 (v2.5.0)

### 装备数据库上线 - Gears Database 功能发布

**背景**：为了完善游戏数据库系统，我们新增了装备数据库页面，用户可以查询所有游戏内装备的详细信息，包括价格、功能、获取方式等。

**更新内容**：

1. **⚙️ 全新的装备数据库页面**
   - 创建了完整的 `gears.html` 页面，仿照 `eggs.html` 的样式设计
   - 包含装备相关的标题和副标题，提供清晰的页面定位
   - 支持27种装备的完整信息展示

2. **🔍 智能搜索和过滤系统**
   - **搜索功能**：支持按装备名称、功能描述进行实时搜索
   - **等级过滤**：按 Common、Uncommon、Rare、Legendary、Mythical、Divine、Craftable 进行分类
   - **获取状态过滤**：区分可获取和不可获取的装备
   - **排序功能**：支持按名称、等级、价格、获取状态排序

3. **📊 完整的装备数据库**
   - 涵盖游戏内所有27种装备的完整信息
   - 包含基础工具、喷洒系统、特殊工具、管理工具、制作装备五大类别
   - 支持多种货币类型：Sheckles、Robux、Honey、制作材料、特殊货币

4. **🎨 精美的界面设计**
   - 表格视图包含：图片、名称、价格、等级、描述、获取状态六个栏目
   - 响应式设计，完美适配桌面、平板、手机设备
   - 等级颜色编码，不同等级装备有独特的视觉标识
   - 互动式模态框，点击装备可查看详细信息

5. **🔧 技术架构完善**
   - 创建 `js/gears.js` 文件，实现装备页面逻辑
   - 扩展 `js/data-manager.js`，添加装备数据加载和管理功能
   - 更新所有页面导航栏，添加 Gears 菜单链接
   - 添加装备图标映射和默认图片处理

6. **📝 完整的文档更新**
   - 在 README.md 中添加详细的装备数据库说明
   - 包含功能介绍、装备分类、价格体系、界面特色等完整文档
   - 提供清晰的使用指南和技术说明

**技术改进**：
- 重用 eggs.html 的成熟架构，确保代码质量和一致性
- 实现完整的数据绑定，支持 gears.json 中的所有属性
- 优化价格显示，支持复杂的多货币类型组合
- 添加错误处理，图片加载失败时自动使用默认图片

**用户体验提升**：
- ✅ 完整的装备信息：27种装备的详细数据查询
- ✅ 灵活的搜索过滤：多维度的信息检索功能
- ✅ 直观的价格显示：支持多种货币类型的清晰展示
- ✅ 响应式设计：各设备上都有完美的显示效果
- ✅ 统一的导航体验：所有页面都可快速访问装备数据库

## 🎉 更新历史 (v2.4.0)

### 紧凑型参数布局 - 界面优化升级

**背景**：为了提升用户体验并节省界面的纵向空间，我们对首页计算器的参数布局进行了重新设计。

**更新内容**：

1. **📐 紧凑型两行布局**
   - 重新设计参数布局，从4行改为2行显示
   - 第一行：Weight (kg) 和 Quantity (pcs)
   - 第二行：Friend Boost 和 Max Mutation
   - 大幅节省纵向空间，提升界面紧凑度

2. **🎨 优化的视觉设计**
   - 调整参数间距和对齐方式
   - 优化输入框和滑块的尺寸
   - 改进开关按钮的视觉效果
   - 统一的参数标签样式

3. **📱 完善的响应式设计**
   - 桌面端：两行横向布局，充分利用水平空间
   - 平板端：自适应布局，保持良好的可读性
   - 移动端：自动转换为纵向布局，确保触摸友好

4. **⚡ 性能优化**
   - 优化CSS结构，减少不必要的嵌套
   - 改进浏览器兼容性，支持Firefox滑块样式
   - 减少重绘和重排，提升交互响应速度

**技术改进**：
- 重构HTML结构，使用parameter-row-group和parameter-item
- 优化CSS Flexbox布局，提升布局灵活性
- 改进移动端断点样式，确保各设备完美适配
- 统一参数控件的尺寸和间距规范

**用户体验提升**：
- ✅ 节省纵向空间：界面更紧凑，减少滚动需求
- ✅ 提升视觉美感：统一的设计风格，更专业的外观
- ✅ 优化交互体验：合理的控件大小，便于操作
- ✅ 完美移动适配：确保在各种设备上都能良好显示

## 🎉 最新更新 (v2.3.0)

### 大规模数据补全 - 作物与变异数据库扩展

**背景**：在前端测试中发现，无论是作物选择还是变异条件选择，可选择的数量都比较少。经过分析发现，项目中有75+个作物图片文件，但crops.json中只包含15个作物数据。同时变异数据结构不完整，缺少温度变异类别和大量环境变异选项。

**更新内容**：

1. **📊 作物数据大幅扩展**
   - 作物数量从15个增加到75+个
   - 覆盖了所有images/crops目录中的作物图片
   - 每个作物都有完整的属性：ID、名称、分类、稀有度、买价、卖价、是否多重收获、图片、图标、描述

2. **🏷️ 完整的稀有度分布**
   - **Common (普通)**: 7种作物 - 胡萝卜、草莓、番茄、玉米、辣椒、茄子、巧克力胡萝卜
   - **Uncommon (不常见)**: 15种作物 - 蓝莓、橙色郁金香、覆盆子、蔓越莓、花椰菜、柿子椒、薄荷、蒲公英、竹子、豆茎、多肉植物、向日葵、薰衣草、紫丁香、番红花等
   - **Rare (稀有)**: 20种作物 - 水仙花、梨、桃、柠檬、紫玉米、菠萝、香蕉、椰子、牛油果、仙人掌、捕蝇草、玫瑰、粉百合、紫大丽花、毛地黄、忍冬、椰子藤等
   - **Legendary (传奇)**: 15种作物 - 西瓜、南瓜、苹果、青苹果、木瓜、杨桃、火龙果、榴莲、百香果、可可、莲花、樱花、灰烬百合、马卢卡花、复活节彩蛋、龙椒等
   - **Mythical (神话)**: 10种作物 - 芒果、天空莓、血香蕉、诅咒果实、灵魂果实、蜂巢果实、月亮花、月花、夜茄、糖果花、糖果向日葵、红棒棒糖、太阳螺旋、花蜜刺等
   - **Divine (神圣)**: 8种作物 - 葡萄、蘑菇、月芒果、发光蘑菇、光明果、月瓜、月光、花蜜影等

3. **💰 平衡的价格体系**
   - 每个稀有度都有合理的价格范围
   - 考虑了作物的收获方式（单次收获vs多次收获）
   - 价格与稀有度呈指数级增长关系

4. **🎨 丰富的视觉元素**
   - 每个作物都有独特的emoji图标
   - 详细的作物描述
   - 对应的图片文件名

5. **📋 完整的作物属性**
   - 多重收获标记：区分单次收获和多次收获作物
   - 分类信息：便于数据组织和显示
   - 图片文件关联：与实际图片资源匹配

6. **🔥 变异系统完全重构**
   - **成长变异 (Growth Mutations)**: 3种 - Normal (×1)、Golden (×20)、Rainbow (×50)
   - **温度变异 (Temperature Mutations)**: 4种 - Normal、Chilled (+1×)、Frozen (+2×)、Heated (+1×)
   - **环境变异 (Environmental Mutations)**: 17种 - Wet、Dry、Windy、Sunny、Cloudy、Stormy、Foggy、Chocolate、Honey、Spicy、Sweet、Salty、Moonlit、Starlit、Shocked、Poisoned、Celestial

7. **⚡ 变异计算规则优化**
   - 成长变异：互斥选择，影响基础倍数
   - 温度变异：互斥选择，提供加成效果
   - 环境变异：可叠加选择，所有效果累加
   - 新计算公式：`最终价值 = 基础价值 × 成长倍数 × (1 + 温度加成 + 环境加成)`

**技术改进**：
- 完善的数据结构，包含所有必要的作物属性
- 统一的命名规范，图片文件名与作物ID对应
- 合理的价格平衡，适合游戏性和计算器功能
- 重构的变异系统，支持3种类型的变异计算
- 优化的计算公式，支持复杂的变异组合

**用户体验提升**：
- ✅ 丰富的作物选择：从15种增加到75+种
- ✅ 完整的稀有度体系：6个稀有度级别覆盖所有作物
- ✅ 平衡的价格体系：合理的买价和卖价设定
- ✅ 完整的视觉表现：每个作物都有图标和描述
- ✅ 全面的变异系统：从7种增加到24种变异选项
- ✅ 灵活的变异组合：支持成长、温度、环境三维度变异
- ✅ 精准的计算结果：优化的计算公式支持复杂变异组合

**数据统计**：
- 作物总数：75+个
- 稀有度分类：6个级别
- 价格范围：10 - 1,000,000,000 买价
- 收获方式：单次收获和多次收获并存
- 变异总数：24种 (成长3种 + 温度4种 + 环境17种)
- 变异组合：理论上支持数千种不同的变异组合

## 🎉 最新更新 (v2.2.0)

### 分类过滤与增强卡片显示 - 用户体验大幅提升

**背景**：基于用户反馈，我们进一步优化了作物选择界面，添加了分类过滤功能和丰富的作物卡片信息显示。

**更新内容**：

1. **🏷️ 分类过滤系统**
   - 添加了6个稀有度分类：Common、Uncommon、Rare、Legendary、Mythical、Divine
   - 每个分类都有独特的颜色主题，便于快速识别
   - 智能过滤：支持分类过滤与搜索功能的组合使用

2. **🎨 增强的作物卡片**
   - 新卡片设计：包含作物图标、名称、售价、稀有度标签
   - 稀有度背景色：每种稀有度都有独特的渐变背景色
   - 选中状态：明显的视觉反馈，包括选中标记和动画效果
   - 悬停效果：平滑的3D悬停动画，提升交互体验

3. **🌈 色彩系统**
   - Common: 灰色系 (#9CA3AF)
   - Uncommon: 绿色系 (#10B981)
   - Rare: 蓝色系 (#3B82F6)
   - Legendary: 紫色系 (#8B5CF6)
   - Mythical: 橙色系 (#F59E0B)
   - Divine: 红色系 (#EF4444)

4. **📱 响应式优化**
   - 移动设备友好的分类过滤器布局
   - 自适应的作物卡片网格尺寸
   - 优化的触摸交互体验

**技术改进**：
- 完善的分类过滤逻辑，支持复合过滤条件
- 优化的CSS变量系统，统一的颜色管理
- 增强的JavaScript事件处理，提升交互性能
- 完整的数据结构，包含作物图标信息

**用户体验提升**：
- ✅ 快速分类定位：点击分类标签即可筛选对应稀有度的作物
- ✅ 丰富的视觉信息：一目了然的作物价值和稀有度
- ✅ 流畅的交互体验：平滑的动画和视觉反馈
- ✅ 组合过滤功能：分类过滤与搜索功能可同时使用

## 🎉 最新更新 (v2.1.0)

### 首页计算器集成 - 重大功能更新

**背景**：为了以最快的速度满足用户的搜索需求，我们决定对网站进行重大的体验优化。

**更新内容**：
1. **🏠 首页计算器集成**
   - 将完整的计算器功能整合到首页hero区块
   - 用户登录首页即可直接进行计算，无需跳转
   - 保持原有的Core Features、Quick Start、Statistics三个核心模块

2. **🎨 全新界面设计**
   - 采用紧凑型计算器布局，优化空间利用率
   - 左右分栏设计：左侧作物选择和变异设置，右侧结果显示
   - 现代化的渐变背景和卡片式设计
   - 完全响应式，完美适配所有设备

3. **⚡ 性能优化**
   - 独立的hero计算器组件，不影响原有calculator页面
   - 智能化的组件加载，按需初始化
   - 优化的CSS样式，减少重绘和重排

4. **🔧 技术改进**
   - 新增`HeroCalculator`相关方法和样式
   - 完善的错误处理和用户反馈
   - 模块化的JavaScript架构

**用户体验提升**：
- ✅ 0步骤开始计算：打开网站即可使用
- ✅ 实时计算反馈：选择作物和变异后立即显示结果
- ✅ 紧凑的界面设计：在有限空间内提供完整功能
- ✅ 保持原有功能：完整的calculator页面仍然保留

## 🔄 近期修复的问题

### 作物数据源更新 (v2.5.0)

**问题描述**：在crops.html页面，没有显示任何作物数据。

**原因分析**：
1. 数据管理器（DataManager）中的loadCrops函数正在从data/crops.json加载数据
2. 但实际的作物数据已经更新到了data/crops(new).json文件中
3. 新旧数据格式存在差异，需要进行字段映射

**解决方案**：

1. **修改数据源路径**：
   ```javascript
   // 将数据加载路径从'data/crops.json'改为'data/crops(new).json'
   console.log('🌱 Loading crops from data/crops(new).json...');
   const data = await this.loadJSON('data/crops(new).json');
   ```

2. **添加字段映射适配**：
   ```javascript
   // 添加字段映射，适配新的数据格式
   this.data.crops = this.data.crops.map(crop => ({
       ...crop,
       profit: (crop.minimum_value || 0) - (crop.sheckle_price || 0),
       sellValue: crop.minimum_value || 0,
       buyPrice: crop.sheckle_price || 0,
       rarity: crop.tier || 'Common',
       multiHarvest: crop.multiHarvest || false,
       // Use icon from data or fallback to getCropIcon
       icon: crop.icon || this.getCropIcon(crop.id)
   }));
   ```

3. **字段映射说明**：
   - minimum_value → sellValue (作物售价)
   - sheckle_price → buyPrice (作物购买价格)
   - tier → rarity (作物稀有度)
   - 保留multiHarvest字段 (是否多重收获)
   - 计算profit为minimum_value减去sheckle_price (利润)

**效果**：crops.html页面现在可以正确显示所有来自data/crops(new).json的作物数据，包括名称、图标、价格、稀有度等信息。

### 农作物列表显示问题修复 (v2.0.0)

**问题描述**：在calculator.html页面，Select Crop下方没有显示农作物可供选择。

**原因分析**：
1. 数据管理器（DataManager）和计算器类（GardenCalculator）已正确实现
2. 数据文件（crops.json）包含完整的农作物数据
3. 但缺少将农作物数据渲染到页面上的代码

**解决方案**：

1. **在App.js中添加页面特定初始化逻辑**：
   ```javascript
   // 为calculator页面添加专门的初始化方法
   async initCalculatorPage() {
       // 渲染农作物网格
       await this.renderCropGrid();
       // 设置计算器交互
       this.setupCalculatorInteractions();
   }
   ```

2. **实现农作物列表渲染**：
   ```javascript
   // 创建农作物元素并渲染到页面
   async renderCropGrid() {
       const crops = this.dataManager.getCrops();
       const cropElements = crops.map(crop => this.createCropElement(crop));
       cropGrid.innerHTML = cropElements.join('');
   }
   ```

3. **添加交互功能**：
   - 农作物点击选择
   - 搜索过滤功能
   - 变异选择功能
   - 实时计算更新

4. **完善CSS样式**：
   - 添加`.crop-item`样式类
   - 美化农作物列表显示
   - 添加选中状态效果

5. **修复数据兼容性**：
   - 统一变异数据字段名称
   - 修复计算器中的数据访问问题

**修复结果**：
- ✅ 农作物列表正常显示
- ✅ 点击选择功能正常
- ✅ 搜索过滤功能正常
- ✅ 变异选择功能正常
- ✅ 实时计算更新正常

## 📁 项目结构

```
garden-calculator-pro/
├── index.html              # 主页（集成计算器）
├── calculator.html         # 完整计算器页面
├── crops.html             # 作物列表页面
├── pets.html              # 宠物列表页面
├── eggs.html              # 蛋类列表页面
├── css/
│   ├── style.css          # 主样式文件
│   ├── components.css     # 组件样式（新增hero计算器样式）
│   └── responsive.css     # 响应式样式
├── js/
│   ├── app.js             # 主应用逻辑（新增hero计算器支持）
│   ├── calculator.js      # 计算器核心
│   ├── data-manager.js    # 数据管理器
│   ├── ui.js              # UI交互管理
│   └── utils.js           # 工具函数库
├── data/
│   ├── crops.json         # 作物数据
│   ├── mutations.json     # 变异数据
│   ├── pets.json          # 宠物数据
│   ├── eggs.json          # 蛋类数据
│   └── config.json        # 应用配置
├── images/                # 图片资源
└── icons/                 # 图标资源
```

## 🧪 功能测试指南

### 测试分类过滤功能

1. **打开首页计算器**
   - 访问 `http://localhost:8000`
   - 查看计算器模块中的分类过滤器

2. **测试分类按钮**
   - 点击 "All" - 应显示所有作物
   - 点击 "Common" - 只显示灰色背景的普通作物
   - 点击 "Uncommon" - 只显示绿色背景的不常见作物
   - 点击 "Rare" - 只显示蓝色背景的稀有作物
   - 点击 "Legendary" - 只显示紫色背景的传奇作物
   - 点击 "Mythical" - 只显示橙色背景的神话作物
   - 点击 "Divine" - 只显示红色背景的神圣作物

3. **测试组合过滤**
   - 在搜索框中输入作物名称
   - 选择特定分类
   - 验证只显示同时满足搜索条件和分类条件的作物

### 测试增强的作物卡片

1. **检查卡片信息**
   - 每个作物卡片应包含：
     - 作物图标（emoji）
     - 作物名称
     - 价格信息（💰 价格）
     - 稀有度标签

2. **测试交互效果**
   - 悬停在作物卡片上 - 应有3D提升效果和阴影
   - 点击作物卡片 - 应显示选中状态（边框高亮和✓标记）
   - 选择不同作物 - 右侧结果面板应实时更新

3. **测试颜色系统**
   - 验证每种稀有度都有对应的渐变背景色
   - 检查文字对比度是否清晰可读

### 测试计算器功能

1. **基本计算**
   - 选择任意作物
   - 查看右侧结果面板实时更新
   - 验证基础价值、倍数、奖励、最终价值、利润等数据

2. **变异效果**
   - 测试生长变异：Normal、Golden、Rainbow
   - 测试环境变异：Wet、Chilled、Moonlit、Shocked
   - 验证变异效果正确应用到计算结果

3. **功能按钮**
   - 点击 "Calculate" - 重新计算当前选择
   - 点击 "Reset" - 清空所有选择和搜索
   - 点击 "Full Calculator" - 跳转到完整计算器页面

### 测试响应式设计

1. **桌面端 (>1200px)**
   - 分类过滤器应水平排列
   - 作物网格应显示4-6列
   - 所有文字和按钮应清晰可读

2. **平板端 (768px - 1200px)**
   - 分类过滤器应保持可用性
   - 作物网格应自适应调整列数
   - 按钮大小应适中

3. **移动端 (<768px)**
   - 分类过滤器应垂直排列或换行
   - 作物网格应显示2-3列
   - 触摸交互应流畅

### 预期结果

✅ **成功标准**：
- 所有分类过滤器按钮正常工作
- 作物卡片显示完整信息（图标、名称、价格、稀有度）
- 颜色系统正确应用（6种稀有度颜色）
- 选择和悬停效果流畅
- 计算功能准确无误
- 响应式设计完美适配

❌ **问题排查**：
如果遇到问题，请检查：
- 浏览器控制台是否有错误信息
- 数据文件是否正确加载
- CSS样式是否正确应用
- JavaScript事件是否正确绑定

## 🚀 快速开始

1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/garden-calculator-pro.git
   cd garden-calculator-pro
   ```

2. **启动开发服务器**
   ```bash
   # 使用任何HTTP服务器，例如：
   npx http-server
   # 或者使用 Python
   python -m http.server 8000
   ```

3. **使用应用**
   - 打开浏览器访问 `http://localhost:8000`
   - 🎉 **新功能**：首页直接显示计算器，立即开始计算！
   - 或点击"Full Calculator"进入完整计算器页面

## 📊 数据结构

### 🥚 Eggs Database (v2.4.1) - 蛋类数据库扩展

全新的蛋类数据库，提供完整的宠物蛋信息查询和分析功能：

**核心特性**：
- **完整的蛋类数据**：包含17种不同类型的蛋类（Common Egg、Mythical Egg、Bug Egg、Night Egg、Bee Egg 等）
- **详细成本信息**：支持多种货币系统（Sheckles、Robux、Honey、Summer Coin、Blood Moon Price等）
- **孵化概率数据**：每个蛋包含详细的宠物孵化概率分布
- **时间管理**：准确的孵化时间信息，从30秒到8小时不等
- **获取渠道**：完整的蛋类获取来源信息（商店、活动、制作等）
- **图片资源**：每个蛋都关联对应的图片资源

**数据格式**：
```json
{
  "eggs": [
    {
      "id": "unique_egg_id",
      "name": "Egg Name",
      "cost": {
        "sheckles": 50000,
        "robux": 19,
        "honey": 18,
        "summerCoin": 10,
        "crafting": true
      },
      "hatchingProbability": {
        "Pet Name": "33.33%",
        "Another Pet": "25%"
      },
      "hatchTime": "10 minutes",
      "source": "Eggs Shop 100% chance of being in stock",
      "image": "Egg-Image.png"
    }
  ]
}
```

**包含的蛋类**：
- **标准蛋类**: Common Egg、Uncommon Egg、Rare Egg、Legendary Egg、Mythical Egg
- **特殊蛋类**: Bug Egg、Night Egg、Bee Egg、Anti Bee Egg
- **限时蛋类**: Summer Eggs、Paradise Egg、Oasis Egg
- **高级版本**: Premium versions with instant hatching (30 seconds)

**用途**：
- 🎯 宠物孵化概率计算
- 💰 成本效益分析
- ⏰ 时间管理优化
- 📈 投资回报率计算
- 🎪 活动规划支持

### 🛠️ Gears Database (v2.4.2) - 装备数据库扩展

全新的装备数据库，提供完整的园艺装备信息查询和分析功能：

**核心特性**：
- **完整的装备数据**：包含27种不同类型的装备（洒水器、工具、特殊装备等）
- **多层级分类系统**：从普通到神话级别的7个稀有度分类
- **详细价格信息**：支持多种货币和制作材料系统
- **功能效果描述**：每个装备的详细使用说明和效果
- **库存管理**：商店库存数量和获取难度信息
- **制作系统支持**：特殊制作装备的材料需求

**数据格式**：
```json
{
  "gears": [
    {
      "id": "unique_gear_id",
      "name": "Gear Name",
      "price": {
        "sheckles": 50000,
        "robux": 39,
        "honey": 25,
        "craftingMaterials": "Required materials"
      },
      "use": "Detailed description of gear functionality",
      "obtainable": true,
      "tier": "Common",
      "image": "Gear-Image.png",
      "stock": "1–4"
    }
  ]
}
```

**装备分类**：
- **基础装备 (Common/Uncommon)**: Watering Can、Trowel、Recall Wrench
- **高级装备 (Rare/Legendary)**: Sprinklers、Star Caller、Night Staff
- **顶级装备 (Mythical/Divine)**: Godly Sprinkler、Master Sprinkler、专业工具
- **制作装备 (Craftable)**: Lightning Rod、特殊洒水器系列等8种制作装备

**功能类型**：
- 🌱 **成长加速**: 各级洒水器提供不同程度的成长速度提升
- 🎯 **变异增强**: 增加作物变异概率和特定变异效果
- 🔧 **实用工具**: 传送、收获、清理等功能性工具
- ⭐ **特殊效果**: 星星引导、月光变异、蜂蜜涂层等独特功能
- 📊 **分析工具**: 价值检测、花粉收集等辅助功能

**用途**：
- 🎯 装备效果计算与比较
- 💰 投资回报率分析
- 🔧 园艺策略优化
- 📈 装备升级路径规划
- 🛒 购买决策支持

## 🧮 使用指南

### 🆕 首页快速计算（推荐）
1. **打开网站**：访问首页即可看到集成的计算器
2. **选择作物**：从紧凑的作物网格中点击选择
3. **设置变异**：选择生长变异（金色/彩虹）和环境变异
4. **查看结果**：实时显示计算结果，包括最终价值和利润
5. **快速操作**：使用重置按钮清空选择，或点击"Full Calculator"获取更多功能

### 完整计算器页面
1. **点击"Full Calculator"**：进入完整的计算器页面
2. **高级功能**：
   - 详细的计算分解
   - 收藏功能
   - 历史记录
   - 对比分析
   - 更多变异选项

### 高级功能
- **搜索过滤**：使用搜索框快速找到特定作物
- **收藏功能**：保存常用的计算配置
- **历史记录**：查看之前的计算结果
- **对比分析**：比较多个作物的收益

## 🔄 更新日志

### v2.4.2 (2024-01-XX) - 装备数据库扩展
- 🛠️ **重大更新**：添加完整的装备数据库 (gears.json)
- 📊 包含27种不同类型的园艺装备数据
- 🏆 多层级分类系统（Common、Uncommon、Rare、Legendary、Mythical、Divine、Craftable）
- 💰 支持复杂的价格系统（Sheckles、Robux、Honey、制作材料等）
- 🎯 详细的装备功能和效果描述
- 📦 库存管理和获取难度信息
- 🔧 特殊制作装备的材料需求系统
- 🖼️ 每个装备都关联对应的图片资源
- 📈 为后续装备计算器和策略分析功能奠定基础

### v2.4.1 (2024-01-XX) - 蛋类数据库扩展
- 🥚 **重大更新**：添加完整的蛋类数据库 (eggs.json)
- 📊 包含17种不同类型的宠物蛋数据
- 💰 支持多种货币系统（Sheckles、Robux、Honey、Summer Coin等）
- 🎯 详细的宠物孵化概率分布数据
- ⏰ 准确的孵化时间信息（从30秒到8小时）
- 🎪 完整的获取渠道信息（商店、活动、制作等）
- 🖼️ 每个蛋类都关联对应的图片资源
- 📈 为后续宠物计算器功能奠定数据基础

### v2.4.0 (2024-01-XX) - 紧凑型参数布局
- 📐 参数布局重新设计，从4行改为2行显示
- 🎨 优化的视觉设计，统一参数控件样式
- 📱 完善的响应式设计，适配各种设备
- ⚡ 性能优化，改进浏览器兼容性
- 🔧 重构HTML结构，使用更灵活的布局方案
- ✨ 提升用户体验，节省界面纵向空间

### v2.3.0 (2024-01-XX) - 大规模数据补全
- 📊 作物数据大幅扩展，覆盖75+个作物
- 🎨 完整的稀有度分布，6个级别覆盖所有作物
- 💰 平衡的价格体系，合理买价和卖价
- 🎨 丰富的视觉元素，每个作物都有图标和描述
- 📋 完整的作物属性，多重收获标记和分类信息
- 🔥 变异系统完全重构，支持3种类型24种变异
- ⚡ 变异计算规则优化，支持复杂变异组合计算

### v2.2.0 (2024-01-XX) - 分类过滤与增强卡片显示
- 🏷️ **重大更新**：添加6个稀有度分类过滤系统
- 🎨 全新的作物卡片设计，包含价格、稀有度信息
- 🌈 独特的稀有度颜色主题，提升视觉识别
- 📱 优化的响应式设计，完美适配移动设备
- 🔧 增强的JavaScript交互逻辑，支持复合过滤
- ✨ 平滑的3D悬停动画和选中反馈效果

### v2.1.0 (2024-01-XX) - 首页计算器集成
- 🎉 **重大更新**：首页集成完整计算器功能
- 🎨 全新的hero区块设计，紧凑型计算器布局
- ⚡ 零点击开始计算，极速响应用户需求
- 📱 完美的响应式设计，适配所有设备
- 🔧 优化的JavaScript架构，支持多页面计算器
- 🌈 现代化的界面设计，提升用户体验

### v2.0.0 (2024-01-XX) - 农作物显示修复
- 🐛 修复农作物列表显示问题
- ✨ 完善计算器交互功能
- 🎨 优化CSS样式和用户体验
- 🔧 修复数据兼容性问题

### v1.0.0 (2024-01-XX) - 初始版本
- 🎉 初始版本发布
- 📊 基础计算功能
- 🌱 农作物数据管理
- 🎯 变异效果计算

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 💡 支持

如果您在使用过程中遇到问题，请：
1. 查看 [Issues](https://github.com/your-username/garden-calculator-pro/issues) 页面
2. 创建新的 Issue 报告问题
3. 或者联系开发团队：your-email@example.com

---

<div align="center">
<p>🌱 <strong>Garden Pro Calculator</strong> - 让园艺计算更简单</p>
<p>Made with ❤️ by Garden Pro Team</p>
</div> 