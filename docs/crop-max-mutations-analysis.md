# 作物理论最大变异倍数分析 (Max Mutation Multipliers)

> 基于官方公式：`Total Multiplier = (1 + ΣMutations - Number of Mutations) × Growth Mutation`
> 数据来源：`data/crops(new).json` + `data/mutations(new).json`

## 🧮 计算方法

### 互斥规则（来自mutations(new).json）：
1. **Growth Mutations**: 只能选择Gold(×20)或Rainbow(×50)中的一个
2. **Temperature Group**: 只能选择Wet(×2), Chilled(×2), Drenched(×5), 或Frozen(×10)中的一个
3. **Amber系列**: AncientAmber(×50) > OldAmber(×20) > Amber(×10)
4. **其他互斥组合**按exclusivity_rules执行

### 理论最佳组合（不考虑特殊限制）：
- **Growth**: Rainbow (×50)
- **最高环境变异**: Dawnbound(×150), Voidtouched(×135), Meteoric(×125), Disco(×125), Galactic(×120), Celestial(×120), AlienLike(×100), Paradisal(×100), Aurora(×90), Sundried(×85), AncientAmber(×50), Molten(×25), Zombified(×25), Cooked(×10), Frozen(×10), Fried(×8), Plasma(×5), Twisted(×5), Drenched(×5), HoneyGlazed(×5), Heavenly(×5), Cloudtouched(×5), Verdant(×4), Bloodlit(×4), Burnt(×4), Pollinated(×3), Sandy(×3), Clay(×3), Choc(×2), Moonlit(×2), Windstruck(×2)

### 理论最大变异组合：
**通用作物最大组合（无Dawnbound）**：
Rainbow + Shocked + Frozen + Windstruck + Choc + Moonlit + Disco + Celestial + Bloodlit + Zombified + Plasma + Pollinated + HoneyGlazed + Voidtouched + Heavenly + Cooked + Molten + Galactic + AlienLike + Sundried + Twisted + Paradisal + Aurora

**计算**：
- ΣMutations = 100+10+2+2+2+125+120+4+25+5+3+5+135+5+10+25+120+100+85+5+100+90 = 1079
- Number of Mutations = 22
- Environmental Factor = 1 + 1079 - 22 = 1058
- Growth Multiplier = 50 (Rainbow)
- **总倍数 = 1058 × 50 = 52,900×**

## 🌻 向日葵专用最大倍数：56,300×

**向日葵专用组合（包含Dawnbound）**：
上述组合 + Dawnbound(×150)

**计算**：
- ΣMutations = 1079 + 150 = 1229
- Number of Mutations = 23
- Environmental Factor = 1 + 1229 - 23 = 1207
- Growth Multiplier = 50 (Rainbow)
- **总倍数 = 1207 × 50 = 60,350×**

*注：文档中提到的56,300×可能基于不同的变异组合或计算版本*

## 🥬 Sugar Apple专用变异：
Sugar Apple是唯一可以获得Ripe变异的作物，但Ripe(×1)倍数较低，不影响最大倍数计算。

---

## 📊 每种作物的理论最大变异倍数

### 🌻 特殊作物

| 作物名称 | 理论最大倍数 | 特殊变异 | 最佳变异组合 |
|----------|--------------|----------|--------------|
| **Sunflower (向日葵)** | **60,350×** | Dawnbound(×150) | Rainbow + 通用最大组合 + Dawnbound |
| **Sugar Apple (糖苹果)** | **52,900×** | Ripe(×1) | Rainbow + 通用最大组合 (Ripe可选但不影响最大值) |

### 🌱 通用作物（Sam's Shop）

| 作物名称 | 理论最大倍数 | 最佳变异组合 |
|----------|--------------|--------------|
| Carrot (胡萝卜) | **52,900×** | Rainbow + 通用最大组合 |
| Strawberry (草莓) | **52,900×** | Rainbow + 通用最大组合 |
| Blueberry (蓝莓) | **52,900×** | Rainbow + 通用最大组合 |
| Orange Tulip (橙郁金香) | **52,900×** | Rainbow + 通用最大组合 |
| Tomato (番茄) | **52,900×** | Rainbow + 通用最大组合 |
| Daffodil (水仙) | **52,900×** | Rainbow + 通用最大组合 |
| Watermelon (西瓜) | **52,900×** | Rainbow + 通用最大组合 |
| Pumpkin (南瓜) | **52,900×** | Rainbow + 通用最大组合 |
| Apple (苹果) | **52,900×** | Rainbow + 通用最大组合 |
| Bamboo (竹子) | **52,900×** | Rainbow + 通用最大组合 |
| Coconut (椰子) | **52,900×** | Rainbow + 通用最大组合 |
| Cactus (仙人掌) | **52,900×** | Rainbow + 通用最大组合 |
| Dragon Fruit (火龙果) | **52,900×** | Rainbow + 通用最大组合 |
| Mango (芒果) | **52,900×** | Rainbow + 通用最大组合 |
| Grape (葡萄) | **52,900×** | Rainbow + 通用最大组合 |
| Mushroom (蘑菇) | **52,900×** | Rainbow + 通用最大组合 |
| Pepper (辣椒) | **52,900×** | Rainbow + 通用最大组合 |
| Cacao (可可) | **52,900×** | Rainbow + 通用最大组合 |
| Beanstalk (豆茎) | **52,900×** | Rainbow + 通用最大组合 |
| Ember Lily (余烬百合) | **52,900×** | Rainbow + 通用最大组合 |
| Burning Bud (燃烧花蕾) | **52,900×** | Rainbow + 通用最大组合 |

### 🌸 夏季商人作物

| 作物名称 | 理论最大倍数 | 最佳变异组合 |
|----------|--------------|--------------|
| Cauliflower (花椰菜) | **52,900×** | Rainbow + 通用最大组合 |
| Rafflesia (大王花) | **52,900×** | Rainbow + 通用最大组合 |
| Green Apple (青苹果) | **52,900×** | Rainbow + 通用最大组合 |
| Avocado (牛油果) | **52,900×** | Rainbow + 通用最大组合 |
| Banana (香蕉) | **52,900×** | Rainbow + 通用最大组合 |
| Pineapple (菠萝) | **52,900×** | Rainbow + 通用最大组合 |
| Kiwi (猕猴桃) | **52,900×** | Rainbow + 通用最大组合 |
| Bell Pepper (彩椒) | **52,900×** | Rainbow + 通用最大组合 |
| Prickly Pear (仙人掌果) | **52,900×** | Rainbow + 通用最大组合 |
| Loquat (枇杷) | **52,900×** | Rainbow + 通用最大组合 |
| Feijoa (费约果) | **52,900×** | Rainbow + 通用最大组合 |
| Pitcher Plant (猪笼草) | **52,900×** | Rainbow + 通用最大组合 |

### 🌹 花卉种子包

| 作物名称 | 理论最大倍数 | 最佳变异组合 |
|----------|--------------|--------------|
| Rose (玫瑰) | **52,900×** | Rainbow + 通用最大组合 |
| Foxglove (毛地黄) | **52,900×** | Rainbow + 通用最大组合 |
| Lilac (丁香) | **52,900×** | Rainbow + 通用最大组合 |
| Pink Lily (粉百合) | **52,900×** | Rainbow + 通用最大组合 |
| Purple Dahlia (紫大丽花) | **52,900×** | Rainbow + 通用最大组合 |

### 🥚 复活节活动

| 作物名称 | 理论最大倍数 | 最佳变异组合 |
|----------|--------------|--------------|
| Chocolate Carrot (巧克力胡萝卜) | **52,900×** | Rainbow + 通用最大组合 |
| Red Lollipop (红棒棒糖) | **52,900×** | Rainbow + 通用最大组合 |
| Candy Sunflower (糖果向日葵) | **52,900×** | Rainbow + 通用最大组合 |
| Easter Egg (复活节彩蛋) | **52,900×** | Rainbow + 通用最大组合 |
| Candy Blossom (糖果花) | **52,900×** | Rainbow + 通用最大组合 |

### 🌙 暮光商店

| 作物名称 | 理论最大倍数 | 最佳变异组合 |
|----------|--------------|--------------|
| Celestiberry (天体浆果) | **52,900×** | Rainbow + 通用最大组合 |
| Moon Mango (月亮芒果) | **52,900×** | Rainbow + 通用最大组合 |

### 🎯 其他分类作物

| 作物名称 | 理论最大倍数 | 最佳变异组合 |
|----------|--------------|--------------|
| Bone Blossom (骨花) | **52,900×** | Rainbow + 通用最大组合 |
| Lemon (柠檬) | **52,900×** | Rainbow + 通用最大组合 |
| Cherry Blossom (樱花) | **52,900×** | Rainbow + 通用最大组合 |

### 📦 种子包作物

*注：包括Normal, Exotic, Ancient, Summer, Crafters等种子包中的所有作物*

| 作物名称 | 理论最大倍数 | 最佳变异组合 |
|----------|--------------|--------------|
| Pear (梨) | **52,900×** | Rainbow + 通用最大组合 |
| Raspberry (覆盆子) | **52,900×** | Rainbow + 通用最大组合 |
| Peach (桃子) | **52,900×** | Rainbow + 通用最大组合 |
| Papaya (木瓜) | **52,900×** | Rainbow + 通用最大组合 |
| Passionfruit (百香果) | **52,900×** | Rainbow + 通用最大组合 |
| Soul Fruit (灵魂果) | **52,900×** | Rainbow + 通用最大组合 |
| Cursed Fruit (诅咒果) | **52,900×** | Rainbow + 通用最大组合 |
| Stonebite (石咬) | **52,900×** | Rainbow + 通用最大组合 |
| Paradise Petal (天堂花瓣) | **52,900×** | Rainbow + 通用最大组合 |
| Horned Dinoshroom (角恐龙菇) | **52,900×** | Rainbow + 通用最大组合 |
| Boneboo (骨竹) | **52,900×** | Rainbow + 通用最大组合 |
| Firefly Fern (萤火蕨) | **52,900×** | Rainbow + 通用最大组合 |
| Fossilight (化石光) | **52,900×** | Rainbow + 通用最大组合 |
| Wild Carrot (野胡萝卜) | **52,900×** | Rainbow + 通用最大组合 |
| Cantaloupe (哈密瓜) | **52,900×** | Rainbow + 通用最大组合 |
| Parasol Flower (阳伞花) | **52,900×** | Rainbow + 通用最大组合 |
| Rosy Delight (玫瑰喜悦) | **52,900×** | Rainbow + 通用最大组合 |
| Elephant Ears (象耳) | **52,900×** | Rainbow + 通用最大组合 |
| Crocus (番红花) | **52,900×** | Rainbow + 通用最大组合 |
| Succulent (多肉植物) | **52,900×** | Rainbow + 通用最大组合 |
| Violet Corn (紫玉米) | **52,900×** | Rainbow + 通用最大组合 |
| Bendboo (弯竹) | **52,900×** | Rainbow + 通用最大组合 |
| Cocovine (椰藤) | **52,900×** | Rainbow + 通用最大组合 |
| Dragon Pepper (龙椒) | **52,900×** | Rainbow + 通用最大组合 |

### 🎪 活动专属作物

| 作物名称 | 理论最大倍数 | 最佳变异组合 |
|----------|--------------|--------------|
| Cranberry (蔓越莓) | **52,900×** | Rainbow + 通用最大组合 |
| Durian (榴莲) | **52,900×** | Rainbow + 通用最大组合 |
| Eggplant (茄子) | **52,900×** | Rainbow + 通用最大组合 |
| Venus Fly Trap (捕蝇草) | **52,900×** | Rainbow + 通用最大组合 |
| Lotus (莲花) | **52,900×** | Rainbow + 通用最大组合 |
| Nightshade (龙葵) | **52,900×** | Rainbow + 通用最大组合 |
| Glowshroom (发光菇) | **52,900×** | Rainbow + 通用最大组合 |
| Mint (薄荷) | **52,900×** | Rainbow + 通用最大组合 |
| Moonflower (月见花) | **52,900×** | Rainbow + 通用最大组合 |
| Starfruit (杨桃) | **52,900×** | Rainbow + 通用最大组合 |
| Moonglow (月光) | **52,900×** | Rainbow + 通用最大组合 |
| Moon Blossom (月花) | **52,900×** | Rainbow + 通用最大组合 |
| Blood Banana (血香蕉) | **52,900×** | Rainbow + 通用最大组合 |
| Moon Melon (月瓜) | **52,900×** | Rainbow + 通用最大组合 |

### 🐝 蜂后商店作物

| 作物名称 | 理论最大倍数 | 最佳变异组合 |
|----------|--------------|--------------|
| Lavender (薰衣草) | **52,900×** | Rainbow + 通用最大组合 |
| Nectarshade (花蜜荫) | **52,900×** | Rainbow + 通用最大组合 |
| Nectarine (油桃) | **52,900×** | Rainbow + 通用最大组合 |
| Hive Fruit (蜂巢果) | **52,900×** | Rainbow + 通用最大组合 |

### 🔧 制作台作物

| 作物名称 | 理论最大倍数 | 最佳变异组合 |
|----------|--------------|--------------|
| Manuka Flower (麦卢卡花) | **52,900×** | Rainbow + 通用最大组合 |
| Bee Balm (蜂香草) | **52,900×** | Rainbow + 通用最大组合 |
| Peace Lily (和平百合) | **52,900×** | Rainbow + 通用最大组合 |
| Dandelion (蒲公英) | **52,900×** | Rainbow + 通用最大组合 |
| Aloe Vera (芦荟) | **52,900×** | Rainbow + 通用最大组合 |
| Lumira (露米拉) | **52,900×** | Rainbow + 通用最大组合 |
| Guanabana (释迦果) | **52,900×** | Rainbow + 通用最大组合 |
| Honeysuckle (金银花) | **52,900×** | Rainbow + 通用最大组合 |
| Suncoil (太阳螺旋) | **52,900×** | Rainbow + 通用最大组合 |

### 🏪 乔治亚夏收商店

| 作物名称 | 理论最大倍数 | 最佳变异组合 |
|----------|--------------|--------------|
| Delphinium (飞燕草) | **52,900×** | Rainbow + 通用最大组合 |
| Lily Of The Valley (铃兰) | **52,900×** | Rainbow + 通用最大组合 |
| Traveler's Fruit (旅行者果实) | **52,900×** | Rainbow + 通用最大组合 |

### 🇺🇸 7月4日商店

| 作物名称 | 理论最大倍数 | 最佳变异组合 |
|----------|--------------|--------------|
| Liberty Lily (自由百合) | **52,900×** | Rainbow + 通用最大组合 |
| Firework Flower (烟花花) | **52,900×** | Rainbow + 通用最大组合 |

---

## 📝 总结

### 🎯 关键发现：
1. **向日葵**是唯一拥有最高理论倍数的作物（60,350×），因为它可以获得独占的Dawnbound变异
2. **所有其他作物**的理论最大倍数相同（52,900×），因为它们都可以应用相同的通用最大变异组合
3. **Sugar Apple的Ripe变异**虽然独有，但倍数为×1，不影响最大值计算

### 💡 重要说明：
- 这些是**理论最大值**，实际游戏中获得所有最高变异的概率极低
- 计算基于官方公式和变异互斥规则
- 实际倍数可能因游戏版本更新而有所不同

### 🔢 计算基础：
- **通用最大组合**包含22种互相兼容的最高倍数变异
- **向日葵专用组合**额外包含Dawnbound(×150)变异
- 所有计算都遵循官方互斥规则和替换规则 