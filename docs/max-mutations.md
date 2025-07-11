Max Mutations的概念

定义
Max mutations指的是一种作物能够同时获得的最大变异数量或最高变异等级的组合。
两种理解方式
1. 变异数量上限
一个单一的果实可以同时持有多个变异。有些会合并成特殊形式（湿润+冷冻→冰冻），而其他的（如血月+电击）会简单相乘，将价值推高到基础价格的数百倍 Crops | Grow a Garden Wiki | Fandom

2. 理论最大变异组合
在某些计算器中，"Max Mutations"是一个切换选项，用于计算作物在最理想变异组合下的价值 Grow a Garden – Full Game Guide from Noob to Pro
| Best Stacked Mutations                                                                 | Max Mutation Multipliers |
|----------------------------------------------------------------------------------------|------------|
| Rainbow + Shocked + Frozen + Windstruck + Disco + Choc + Celestial + Bloodlit + Moonlit + Zombified + Plasma + Pollinated + HoneyGlazed + Voidtouched + Heavenly + Dawnbound (Sunflower only) + Cooked + Molten + Galactic + AlienLike + Sundried + Twisted + Paradisal + Aurora | 56,300x |
| Voidtouched + Heavenly + Rainbow + Shocked + Frozen + Moonlit + Disco + Celestial + Choc + Bloodlit + Plasma + Pollinated + HoneyGlazed + Zombified + Plasma | 26,800x |
| Disco + Celestial + Rainbow + Shocked + Frozen + Moonlit + Choc | 17,700x |
| Rainbow + Shocked + Frozen + Moonlit + Choc | 5.550x |
| Rainbow + Shocked + Frozen + Choc or Moonlit | 5.500x |

实际应用场景
在价值计算中的作用：
理论价值上限：告诉你一种作物在完美变异组合下的最高价值
投资决策参考：帮助判断某种作物的价值潜力
交易评估：了解作物的价值天花板

实际限制：
某些变异不能同时存在（如Rainbow和Gold只能选一个）
某些变异会合并（如Wet + Chilled = Frozen）
获得所有最高变异的概率极低

计算器中的使用
在一些计算器中，你会看到"Max Mutations Toggle"（最大变异切换）功能 Grow a Garden – Full Game Guide from Noob to Pro，这让你可以：
查看作物的理论最大价值
对比不同作物的价值潜力
制定长期投资策略

实际例子
假设胡萝卜的Max mutations包括：
Rainbow (×50)
Shocked (+99)
Frozen (+9)
Celestial (+119)
其他可兼容的变异...

最终价值 = 基础价值 × 50 × (1 + 99 + 9 + 119 + ...) × 重量²

策略意义
Max mutations帮助你：
选择投资品种：比较不同作物的价值上限
设定期望：了解某种作物的最大收益潜力
风险评估：平衡高潜力与低概率的关系

所以Max mutations本质上是一个理论价值上限的概念，用于帮助玩家了解作物的最大价值潜力。



请你将首页calculator区块中，Max Mutation这一条件参数集成到calculator的计算逻辑中。具体逻辑为：

1. 当max mutation按钮为关闭状态时，Max mutation=1；此时，Total Multiplier=(1 + ΣMutations - Number of Mutations) × Growth Mutation × (Weight/Base Weight)² × (1 + Friend Boost%) 
Total Value = Base Value × (1 + ΣMutations - Number of Mutations) × Growth Mutation × (Weight/Base Weight)² × (1 + Friend Boost%) × Max mutation

2. 当max mutation按钮为开启状态，且crop选择的是sunflower时，max mutation=60350; 此时，Total Multiplier=max mutation=60350,
Total Value = Base Value × (1 + Friend Boost%) × Max mutation

3. 当max mutation按钮为开启状态，且crop选择的非sunflower时，max mutation=52900; Total Multiplier=max mutation=52900,
Total Value = Base Value × (1 + Friend Boost%) × Max mutation

对应到实际场景中，
1. 当用户没有开启max mutation按钮时（默认即关闭状态），Total Multiplier的值为用户选择的各项mutations按照互斥叠加规则计算而来；
2. 当用户开启了max mutation按钮，且用户选择的crop为sunflower时，Total Multiplier的值为既定的60350，且此时mutations的组合为：Rainbow + Shocked + Frozen + Windstruck + Choc + Moonlit + Disco + Celestial + Bloodlit + Zombified + Plasma + Pollinated + HoneyGlazed + Voidtouched + Heavenly + Cooked + Molten + Galactic + AlienLike + Sundried + Twisted + Paradisal + Aurora + Dawnbound, 此时该组合中的每一个mutation在前端网页中都应该呈现被选中状态；
3. 当用户开启了max mutation按钮，且用户选择的crop只要不是sunflower时，Total Multiplier的值为既定的52900，且此时mutations的组合为：Rainbow + Shocked + Frozen + Windstruck + Choc + Moonlit + Disco + Celestial + Bloodlit + Zombified + Plasma + Pollinated + HoneyGlazed + Voidtouched + Heavenly + Cooked + Molten + Galactic + AlienLike + Sundried + Twisted + Paradisal + Aurora , 此时该组合中的每一个mutation在前端网页中都应该呈现被选中状态；


请你根据以上关于max mutation这一参数集成到首页calculator区块中的计算逻辑，和对应的实际场景，告诉我应该对哪些文档进行修改？
注意：先不要编写代码！！！







