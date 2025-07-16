/**
 * Garden Pro Calculator - Calculator Core
 * Responsible for crop value calculation and mutation effect calculation
 */

// Max Mutation预设组合常量
const MAX_MUTATION_COMBINATIONS = {
    universal: {
        multiplier: 52900,
        mutations: {
            growth: 'rainbow',
            environmental: [
                'shocked', 'frozen', 'windstruck', 'choc', 'moonlit', 
                'disco', 'celestial', 'bloodlit', 'zombified', 'plasma', 
                'pollinated', 'honeyglazed', 'voidtouched', 'heavenly', 
                'cooked', 'molten', 'galactic', 'alien', 'sundried', 
                'twisted', 'paradisal', 'aurora'
            ]
        }
    },
    sunflower: {
        multiplier: 60350,
        mutations: {
            growth: 'rainbow',
            environmental: [
                'shocked', 'frozen', 'windstruck', 'choc', 'moonlit', 
                'disco', 'celestial', 'bloodlit', 'zombified', 'plasma', 
                'pollinated', 'honeyglazed', 'voidtouched', 'heavenly', 
                'cooked', 'molten', 'galactic', 'alien', 'sundried', 
                'twisted', 'paradisal', 'aurora', 'dawnbound'
            ]
        }
    }
};

class GardenCalculator {
    constructor() {
        this.calculations = [];
        this.maxHistory = 50;
    }

    /**
     * Get max mutation combination for crop
     * @param {Object} crop - Crop object
     * @returns {Object} Max mutation combination
     */
    getMaxMutationCombination(crop) {
        if (!crop) return null;
        
        // Check if crop is sunflower (case insensitive)
        const isSunflower = crop.name && crop.name.toLowerCase().includes('sunflower');
        
        return isSunflower ? MAX_MUTATION_COMBINATIONS.sunflower : MAX_MUTATION_COMBINATIONS.universal;
    }

    /**
     * Calculate crop value according to official formula
     * @param {Object} crop - Crop object
     * @param {Object} mutations - Mutation configuration
     * @param {number} quantity - Quantity
     * @param {number} weight - Current weight in kg (optional)
     * @param {number} baseWeight - Base weight in kg (optional)
     * @param {number} friendBoost - Friend boost percentage (0-100, optional)
     * @param {boolean} maxMutation - Whether to use max mutation mode (optional)
     * @returns {Object} Calculation result
     */
    calculateCropValue(crop, mutations = {}, quantity = 1, weight = null, baseWeight = null, friendBoost = 0, maxMutation = false) {
        if (!crop) {
            throw new Error('Crop data cannot be empty');
        }

        // Basic value calculation
        const baseValue = crop.sellValue || crop.minimum_value || 0;
        const baseCost = crop.buyPrice || crop.sheckle_price || 0;
        const baseProfit = baseValue - baseCost;
        
        // Use provided weight or crop's base weight
        const currentWeight = weight !== null ? weight : (crop.base_weight || null);
        const cropBaseWeight = baseWeight !== null ? baseWeight : (crop.base_weight || null);

        // Apply mutation effects using the official formula
        const mutationResult = this.applyMutations(baseValue, mutations, currentWeight, cropBaseWeight, friendBoost, maxMutation, crop);
        
        // Final calculation
        const finalValue = mutationResult.finalValue * quantity;
        const totalCost = baseCost * quantity;
        const totalProfit = finalValue - totalCost;
        const roi = totalCost > 0 ? (totalProfit / totalCost * 100) : 0;

        const result = {
            crop: crop,
            quantity: quantity,
            mutations: mutations,
            weight: currentWeight,
            baseWeight: cropBaseWeight,
            maxMutation: maxMutation,
            calculation: {
                baseValue: baseValue,
                baseCost: baseCost,
                baseProfit: baseProfit,
                // New calculation results following official formula
                growthMultiplier: mutationResult.growthMultiplier,
                environmentalFactor: mutationResult.environmentalFactor,
                weightFactor: mutationResult.weightFactor,
                mutationSum: mutationResult.mutationSum,
                mutationCount: mutationResult.mutationCount,
                totalMultiplier: mutationResult.totalMultiplier,
                valueAfterEnvironmental: mutationResult.valueAfterEnvironmental,
                valueAfterGrowth: mutationResult.valueAfterGrowth,
                finalValue: finalValue,
                totalCost: totalCost,
                totalProfit: totalProfit,
                roi: roi,
                breakdown: mutationResult.breakdown,
                formula: mutationResult.formula
            },
            timestamp: Date.now(),
            id: Utils.generateId()
        };

        // Add to history
        this.addToHistory(result);

        return result;
    }

    /**
     * Apply mutation effects according to official formula:
     * Normal Mode: Total Price = Base Value × (1 + ΣMutations - Number of Mutations) × Growth Mutation × (Weight/Base Weight)² × (1 + Friend Boost%)
     * Max Mutation Mode: Total Price = Base Value × (1 + Friend Boost%) × Max Mutation
     * 
     * @param {number} baseValue - Base value
     * @param {Object} mutations - Mutation configuration
     * @param {number} weight - Current weight in kg (optional)
     * @param {number} baseWeight - Base weight in kg (optional)
     * @param {number} friendBoost - Friend boost percentage (0-100, optional)
     * @param {boolean} maxMutation - Whether to use max mutation mode (optional)
     * @param {Object} crop - Crop object (needed for max mutation mode)
     * @returns {Object} Mutation calculation result
     */
    applyMutations(baseValue, mutations, weight = null, baseWeight = null, friendBoost = 0, maxMutation = false, crop = null) {
        const breakdown = [];
        
        // Max Mutation Mode
        if (maxMutation && crop) {
            const maxCombination = this.getMaxMutationCombination(crop);
            const maxMultiplier = maxCombination ? maxCombination.multiplier : 1;
            
            // Friend Boost factor
            const friendBoostFactor = 1 + (friendBoost / 100);
            if (friendBoost > 0) {
                breakdown.push({
                    type: 'friend',
                    name: 'Friend Boost',
                    effect: `+${friendBoost}%`,
                    value: friendBoostFactor,
                    description: `Friendship bonus: ${friendBoost}%`,
                    icon: '👥',
                    color: '#F59E0B'
                });
            }

            // Max Mutation factor
            breakdown.push({
                type: 'max_mutation',
                name: 'Max Mutation',
                effect: `×${maxMultiplier}`,
                value: maxMultiplier,
                description: `Max mutation multiplier for ${crop.name}`,
                icon: '⭐',
                color: '#EF4444'
            });

            const finalValue = baseValue * friendBoostFactor * maxMultiplier;

            return {
                baseValue: baseValue,
                growthMultiplier: 1,
                environmentalFactor: 1,
                weightFactor: 1,
                friendBoostFactor: friendBoostFactor,
                maxMutationMultiplier: maxMultiplier,
                mutationSum: 0,
                mutationCount: 0,
                totalMultiplier: friendBoostFactor * maxMultiplier,
                valueAfterEnvironmental: baseValue,
                valueAfterGrowth: baseValue,
                valueAfterWeight: baseValue,
                finalValue: finalValue,
                breakdown: breakdown,
                formula: {
                    description: 'Max Mutation Mode: Total Price = Base Value × (1 + Friend Boost%) × Max Mutation',
                    baseValue: baseValue,
                    friendBoostPart: friendBoost > 0 ? `×(1 + ${friendBoost}%) = ×${friendBoostFactor}` : '×1 (no friend boost)',
                    maxMutationPart: `×${maxMultiplier} (max mutation)`,
                    result: finalValue
                }
            };
        }

        // Normal Mode - Original logic
        // Step 1: Calculate Growth Mutation multiplier (mutually exclusive)
        let growthMultiplier = 1;
        if (mutations.growth && mutations.growth !== 'normal') {
            const growthMutation = dataManager.getMutationById(mutations.growth) || 
                                 dataManager.getMutationById(mutations.growth.charAt(0).toUpperCase() + mutations.growth.slice(1));
            if (growthMutation) {
                growthMultiplier = growthMutation.sheckles_multiplier || 1;
                breakdown.push({
                    type: 'growth',
                    name: growthMutation.name,
                    effect: `×${growthMultiplier}`,
                    value: growthMultiplier,
                    description: growthMutation.obtainment || '',
                    icon: '🌟',
                    color: '#F59E0B'
                });
            }
        }

        // Step 2: Calculate Environmental Mutations sum and count
        let mutationSum = 0;
        let mutationCount = 0;
        
        if (mutations.environmental && Array.isArray(mutations.environmental)) {
            mutations.environmental.forEach(mutationId => {
                const mutation = dataManager.getMutationById(mutationId) || 
                               dataManager.getMutationById(mutationId.charAt(0).toUpperCase() + mutationId.slice(1));
                if (mutation) {
                    const multiplier = mutation.sheckles_multiplier || 1;
                    mutationSum += multiplier;
                    mutationCount++;
                    
                    breakdown.push({
                        type: 'environmental',
                        name: mutation.name,
                        effect: `+${multiplier}`,
                        value: multiplier,
                        description: mutation.obtainment || '',
                        icon: this.getMutationIcon(mutation.category),
                        color: this.getMutationColor(mutation.category)
                    });
                }
            });
        }

        // Step 3: Calculate Environmental factor (1 + ΣMutations - Number of Mutations)
        const environmentalFactor = 1 + mutationSum - mutationCount;
        
        // Step 4: Calculate Weight factor (Weight/Base Weight)²
        let weightFactor = 1;
        if (weight !== null && baseWeight !== null && baseWeight > 0) {
            weightFactor = Math.pow(weight / baseWeight, 2);
        }

        // Step 5: Calculate Friend Boost factor
        const friendBoostFactor = 1 + (friendBoost / 100);
        if (friendBoost > 0) {
            breakdown.push({
                type: 'friend',
                name: 'Friend Boost',
                effect: `+${friendBoost}%`,
                value: friendBoostFactor,
                description: `Friendship bonus: ${friendBoost}%`,
                icon: '👥',
                color: '#F59E0B'
            });
        }

        // Step 6: Apply the official formula
        // Total Price = Base Value × Environmental Factor × Growth Multiplier × Weight Factor × Friend Boost Factor
        const finalValue = baseValue * environmentalFactor * growthMultiplier * weightFactor * friendBoostFactor;

        // Calculate intermediate values for display
        const valueAfterEnv = baseValue * environmentalFactor;
        const valueAfterGrowth = valueAfterEnv * growthMultiplier;
        const valueAfterWeight = valueAfterGrowth * weightFactor;

        return {
            baseValue: baseValue,
            growthMultiplier: growthMultiplier,
            environmentalFactor: environmentalFactor,
            weightFactor: weightFactor,
            friendBoostFactor: friendBoostFactor,
            mutationSum: mutationSum,
            mutationCount: mutationCount,
            totalMultiplier: environmentalFactor * growthMultiplier * weightFactor * friendBoostFactor,
            valueAfterEnvironmental: valueAfterEnv,
            valueAfterGrowth: valueAfterGrowth,
            valueAfterWeight: valueAfterWeight,
            finalValue: finalValue,
            breakdown: breakdown,
            formula: {
                description: 'Total Price = Base Value × (1 + ΣMutations - Count) × Growth × Weight² × Friend Boost',
                baseValue: baseValue,
                environmentalPart: `(1 + ${mutationSum} - ${mutationCount}) = ${environmentalFactor}`,
                growthPart: `×${growthMultiplier}`,
                weightPart: weight && baseWeight ? `×(${weight}/${baseWeight})² = ×${weightFactor.toFixed(3)}` : '×1 (no weight)',
                friendBoostPart: friendBoost > 0 ? `×(1 + ${friendBoost}%) = ×${friendBoostFactor}` : '×1 (no friend boost)',
                result: finalValue
            }
        };
    }

    /**
     * 反推重量：根据目标价值、作物、变异、好友加成等，计算所需重量
     * @param {Object} crop - 作物对象
     * @param {Object} mutations - 变异配置
     * @param {number} targetValue - 目标价值
     * @param {number} baseWeight - 基础重量（可选）
     * @param {number} friendBoost - 好友加成百分比（可选）
     * @param {boolean} maxMutation - 是否最大变异模式（可选）
     * @returns {Object} 结果对象 { requiredWeight, details }
     */
    calculateWeightForTargetValue(crop, mutations = {}, targetValue, baseWeight = null, friendBoost = 0, maxMutation = false) {
        if (!crop || !targetValue || targetValue <= 0) {
            throw new Error('作物和目标价值必须有效');
        }
        const baseValue = crop.sellValue || crop.minimum_value || 0;
        const cropBaseWeight = baseWeight !== null ? baseWeight : (crop.base_weight || null);
        if (!baseValue || !cropBaseWeight) {
            throw new Error('作物基础价值或基础重量无效');
        }
        // 复用applyMutations获取倍数
        const mutationResult = this.applyMutations(baseValue, mutations, cropBaseWeight, cropBaseWeight, friendBoost, maxMutation, crop);
        // 计算总倍数（去除weight影响）
        let multiplier = mutationResult.environmentalFactor * mutationResult.growthMultiplier * mutationResult.friendBoostFactor;
        if (maxMutation && mutationResult.maxMutationMultiplier) {
            multiplier = mutationResult.friendBoostFactor * mutationResult.maxMutationMultiplier;
        }
        // 反推重量
        const requiredWeight = cropBaseWeight * Math.sqrt(targetValue / (baseValue * multiplier));
        // 计算weight ratio
        const weightRatio = requiredWeight / cropBaseWeight;
        // 结果详情
        const details = {
            cropName: crop.name,
            targetValue,
            baseValue,
            baseWeight: cropBaseWeight,
            multiplier,
            weightRatio,
            mutationResult
        };
        return { requiredWeight, details };
    }

    /**
     * Get mutation icon based on category
     * @param {string} category - Mutation category
     * @returns {string} Icon emoji
     */
    getMutationIcon(category) {
        const iconMap = {
            'Growth Mutations': '🌟',
            'Environmental Mutations': '🌍',
            'Temperature Mutations': '🌡️'
        };
        return iconMap[category] || '💫';
    }

    /**
     * Get mutation color based on category
     * @param {string} category - Mutation category
     * @returns {string} Color hex code
     */
    getMutationColor(category) {
        const colorMap = {
            'Growth Mutations': '#F59E0B',
            'Environmental Mutations': '#10B981',
            'Temperature Mutations': '#06B6D4'
        };
        return colorMap[category] || '#8B5CF6';
    }

    /**
     * Validate mutation combinations according to official rules
     * @param {Object} mutations - Mutation configuration
     * @returns {Object} Validation result with corrected mutations
     */
    validateMutations(mutations) {
        const validatedMutations = {
            growth: mutations.growth,
            environmental: [...(mutations.environmental || [])]
        };
        
        const warnings = [];
        const conflicts = [];

        // Rule 1: Only one growth mutation (Golden or Rainbow)
        if (validatedMutations.growth) {
            const growthMutation = dataManager.getMutationById(validatedMutations.growth);
            if (!growthMutation || growthMutation.category !== 'Growth Mutations') {
                warnings.push(`Invalid growth mutation: ${validatedMutations.growth}`);
                validatedMutations.growth = 'normal';
            }
        }

        // Environmental mutation conflict resolution
        const environmentalIds = validatedMutations.environmental.map(id => id.toLowerCase());
        
        // Rule 2 & 5: Chilled, Wet, Drenched, Frozen conflicts (and Sandy, Clay)
        const temperatureGroup = ['chilled', 'wet', 'drenched', 'frozen'];
        const temperaturePresent = environmentalIds.filter(id => temperatureGroup.includes(id));
        if (temperaturePresent.length > 1) {
            // Priority: Frozen > Drenched > Chilled > Wet
            const priority = ['frozen', 'drenched', 'chilled', 'wet'];
            const kept = priority.find(p => temperaturePresent.includes(p));
            const removed = temperaturePresent.filter(t => t !== kept);
            
            conflicts.push({
                type: 'temperature_conflict',
                kept: kept,
                removed: removed,
                rule: 'Only one temperature mutation allowed'
            });
            
            // Remove conflicts from environmental mutations
            validatedMutations.environmental = validatedMutations.environmental.filter(id => 
                !removed.includes(id.toLowerCase())
            );
        }

        // Rule 3: Burnt or Cooked conflict
        const cookingGroup = ['burnt', 'cooked'];
        const cookingPresent = environmentalIds.filter(id => cookingGroup.includes(id));
        if (cookingPresent.length > 1) {
            // Cooked replaces Burnt
            conflicts.push({
                type: 'cooking_conflict',
                kept: 'cooked',
                removed: ['burnt'],
                rule: 'Cooked replaces Burnt'
            });
            
            // Remove burnt, keep cooked
            validatedMutations.environmental = validatedMutations.environmental.filter(id => 
                id.toLowerCase() !== 'burnt'
            );
        }

        // Rule 4: Verdant, Sundried, Paradisal conflict
        const verdantGroup = ['verdant', 'sundried', 'paradisal'];
        const verdantPresent = environmentalIds.filter(id => verdantGroup.includes(id));
        if (verdantPresent.length > 1) {
            // Priority: Paradisal > Sundried > Verdant
            const priority = ['paradisal', 'sundried', 'verdant'];
            const kept = priority.find(p => verdantPresent.includes(p));
            const removed = verdantPresent.filter(v => v !== kept);
            
            conflicts.push({
                type: 'verdant_conflict',
                kept: kept,
                removed: removed,
                rule: 'Only one verdant-type mutation allowed'
            });
            
            validatedMutations.environmental = validatedMutations.environmental.filter(id => 
                !removed.includes(id.toLowerCase())
            );
        }

        // Rule 6: Ceramic, Burnt, Fried, Cooked, Molten, Clay conflict
        const ceramicGroup = ['ceramic', 'burnt', 'fried', 'cooked', 'molten', 'clay'];
        const ceramicPresent = environmentalIds.filter(id => ceramicGroup.includes(id));
        if (ceramicPresent.length > 1) {
            // Priority: Ceramic > Molten > Cooked > Fried > Clay > Burnt
            const priority = ['ceramic', 'molten', 'cooked', 'fried', 'clay', 'burnt'];
            const kept = priority.find(p => ceramicPresent.includes(p));
            const removed = ceramicPresent.filter(c => c !== kept);
            
            conflicts.push({
                type: 'ceramic_conflict',
                kept: kept,
                removed: removed,
                rule: 'Only one ceramic-type mutation allowed'
            });
            
            validatedMutations.environmental = validatedMutations.environmental.filter(id => 
                !removed.includes(id.toLowerCase())
            );
        }

        // Rule 8: Amber progression (AncientAmber > OldAmber > Amber)
        const amberGroup = ['amber', 'oldamber', 'ancientamber'];
        const amberPresent = environmentalIds.filter(id => amberGroup.includes(id));
        if (amberPresent.length > 1) {
            // Keep highest tier only
            const priority = ['ancientamber', 'oldamber', 'amber'];
            const kept = priority.find(p => amberPresent.includes(p));
            const removed = amberPresent.filter(a => a !== kept);
            
            conflicts.push({
                type: 'amber_conflict',
                kept: kept,
                removed: removed,
                rule: 'Higher tier amber replaces lower tier'
            });
            
            validatedMutations.environmental = validatedMutations.environmental.filter(id => 
                !removed.includes(id.toLowerCase())
            );
        }

        return {
            validatedMutations: validatedMutations,
            warnings: warnings,
            conflicts: conflicts,
            hasConflicts: conflicts.length > 0 || warnings.length > 0
        };
    }

    /**
     * Calculate crop value with mutation validation
     * @param {Object} crop - Crop object
     * @param {Object} mutations - Mutation configuration
     * @param {number} quantity - Quantity
     * @param {number} weight - Current weight in kg (optional)
     * @param {number} baseWeight - Base weight in kg (optional)
     * @param {number} friendBoost - Friend boost percentage (0-100, optional)
     * @param {boolean} maxMutation - Whether to use max mutation mode (optional)
     * @param {boolean} validateMutations - Whether to validate mutations (default: true)
     * @returns {Object} Calculation result with validation info
     */
    calculateCropValueWithValidation(crop, mutations = {}, quantity = 1, weight = null, baseWeight = null, friendBoost = 0, maxMutation = false, validateMutations = true) {
        let finalMutations = mutations;
        let validationResult = null;

        // Validate mutations if requested (skip validation for max mutation mode)
        if (validateMutations && !maxMutation) {
            validationResult = this.validateMutations(mutations);
            finalMutations = validationResult.validatedMutations;
            
            if (validationResult.hasConflicts) {
                console.warn('🚨 Mutation conflicts detected and resolved:', validationResult);
            }
        }

        // Calculate with validated mutations
        const result = this.calculateCropValue(crop, finalMutations, quantity, weight, baseWeight, friendBoost, maxMutation);
        
        // Add validation info to result
        if (validationResult) {
            result.validation = validationResult;
        }

        return result;
    }

    /**
     * Compare multiple crops
     * @param {Array} crops - Crop configuration array
     * @returns {Object} Comparison result
     */
    compareMultipleCrops(crops) {
        if (!Array.isArray(crops) || crops.length === 0) {
            throw new Error('Crop configuration array cannot be empty');
        }

        const results = crops.map(config => {
            const crop = dataManager.getCropById(config.cropId);
            if (!crop) {
                throw new Error(`Crop not found: ${config.cropId}`);
            }
            
            return this.calculateCropValue(
                crop,
                config.mutations || {},
                config.quantity || 1
            );
        });

        // Sort and analyze
        const sortedByValue = [...results].sort((a, b) => 
            b.calculation.finalValue - a.calculation.finalValue
        );
        const sortedByProfit = [...results].sort((a, b) => 
            b.calculation.totalProfit - a.calculation.totalProfit
        );
        const sortedByROI = [...results].sort((a, b) => 
            b.calculation.roi - a.calculation.roi
        );

        // Statistics
        const totalValue = results.reduce((sum, r) => sum + r.calculation.finalValue, 0);
        const totalCost = results.reduce((sum, r) => sum + r.calculation.totalCost, 0);
        const totalProfit = totalValue - totalCost;
        const avgROI = results.length > 0 ? 
            results.reduce((sum, r) => sum + r.calculation.roi, 0) / results.length : 0;

        const comparison = {
            results: results,
            rankings: {
                byValue: sortedByValue,
                byProfit: sortedByProfit,
                byROI: sortedByROI
            },
            summary: {
                totalValue: totalValue,
                totalCost: totalCost,
                totalProfit: totalProfit,
                avgROI: avgROI,
                bestValue: sortedByValue[0] || null,
                bestProfit: sortedByProfit[0] || null,
                bestROI: sortedByROI[0] || null
            },
            timestamp: Date.now(),
            id: Utils.generateId()
        };

        // Add to history
        this.addToHistory(comparison);

        return comparison;
    }

    /**
     * Calculate investment return analysis
     * @param {Object} crop - Crop object
     * @param {Object} mutations - Mutation configuration
     * @param {number} budget - Budget
     * @returns {Object} Investment analysis result
     */
    calculateInvestmentAnalysis(crop, mutations = {}, budget = 1000) {
        if (!crop || budget <= 0) {
            throw new Error('Invalid crop or budget');
        }

        const unitCost = crop.buyPrice || 0;
        if (unitCost <= 0) {
            throw new Error('Crop cost must be greater than 0');
        }

        const maxQuantity = Math.floor(budget / unitCost);
        const actualCost = maxQuantity * unitCost;
        const remainingBudget = budget - actualCost;

        // Calculate returns
        const result = this.calculateCropValue(crop, mutations, maxQuantity);
        
        // Risk assessment
        const riskLevel = this.assessRiskLevel(crop, mutations);
        
        // Time analysis (if applicable)
        const timeAnalysis = this.calculateTimeAnalysis(crop, maxQuantity);

        // Recommendation
        const recommendation = this.generateRecommendation(result, riskLevel);

        return {
            input: {
                crop: crop,
                mutations: mutations,
                budget: budget
            },
            investment: {
                maxQuantity: maxQuantity,
                actualCost: actualCost,
                remainingBudget: remainingBudget,
                unitCost: unitCost
            },
            returns: result.calculation,
            risk: riskLevel,
            time: timeAnalysis,
            recommendation: recommendation,
            timestamp: Date.now(),
            id: Utils.generateId()
        };
    }

    /**
     * Assess risk level
     * @param {Object} crop - Crop object
     * @param {Object} mutations - Mutation configuration
     * @returns {Object} Risk assessment
     */
    assessRiskLevel(crop, mutations) {
        let riskScore = 0;
        const factors = [];

        // Base risk based on crop rarity
        const rarityRisk = {
            'Common': 1,
            'Uncommon': 2,
            'Rare': 3,
            'Epic': 4,
            'Legendary': 5,
            'Mythical': 6,
            'Divine': 7
        };
        
        const baseRisk = rarityRisk[crop.rarity] || 1;
        riskScore += baseRisk;
        factors.push({
            factor: 'Crop Rarity',
            impact: baseRisk,
            description: `${crop.rarity} crops have inherent risk level ${baseRisk}`
        });

        // Mutation risk
        if (mutations.growth && mutations.growth !== 'normal') {
            const mutationRisk = mutations.growth === 'rainbow' ? 3 : 2;
            riskScore += mutationRisk;
            factors.push({
                factor: 'Growth Mutation',
                impact: mutationRisk,
                description: `${mutations.growth} mutation adds ${mutationRisk} risk points`
            });
        }

        // Multi-harvest vs single harvest
        if (crop.multiHarvest) {
            riskScore -= 1; // Multi-harvest reduces risk
            factors.push({
                factor: 'Multi-Harvest',
                impact: -1,
                description: 'Multi-harvest crops reduce investment risk'
            });
        }

        // Cost factor
        const costFactor = crop.buyPrice > 1000000 ? 2 : crop.buyPrice > 100000 ? 1 : 0;
        riskScore += costFactor;
        if (costFactor > 0) {
            factors.push({
                factor: 'High Cost',
                impact: costFactor,
                description: `High cost crops (${crop.buyPrice}) increase risk`
            });
        }

        // Determine risk level
        let level, color, description;
        if (riskScore <= 2) {
            level = 'Low';
            color = '#10B981';
            description = 'Safe investment with stable returns';
        } else if (riskScore <= 4) {
            level = 'Medium';
            color = '#F59E0B';
            description = 'Moderate risk with good potential returns';
        } else if (riskScore <= 6) {
            level = 'High';
            color = '#EF4444';
            description = 'High risk investment, suitable for experienced players';
        } else {
            level = 'Very High';
            color = '#DC2626';
            description = 'Extremely risky, only for high-risk tolerance players';
        }

        return {
            score: riskScore,
            level: level,
            color: color,
            description: description,
            factors: factors
        };
    }

    /**
     * Calculate time analysis
     * @param {Object} crop - Crop object
     * @param {number} quantity - Quantity
     * @returns {Object} Time analysis
     */
    calculateTimeAnalysis(crop, quantity) {
        const growthTime = this.getGrowthTime(crop);
        
        if (!growthTime) {
            return {
                growthTime: null,
                totalTime: null,
                description: 'Growth time data not available'
            };
        }

        const totalTime = crop.multiHarvest ? 
            growthTime + (quantity - 1) * (growthTime * 0.5) : // Assume subsequent harvests are faster
            growthTime;

        return {
            growthTime: growthTime,
            totalTime: totalTime,
            multiHarvest: crop.multiHarvest,
            description: crop.multiHarvest ? 
                `Initial growth: ${growthTime}min, subsequent harvests faster` :
                `Single harvest in ${growthTime} minutes`
        };
    }

    /**
     * Get crop growth time (placeholder - would come from game data)
     * @param {Object} crop - Crop object
     * @returns {number|null} Growth time in minutes
     */
    getGrowthTime(crop) {
        // This would typically come from game data
        const growthTimes = {
            'Common': 30,
            'Uncommon': 60,
            'Rare': 120,
            'Epic': 240,
            'Legendary': 480,
            'Mythical': 960,
            'Divine': 1440
        };
        
        return growthTimes[crop.rarity] || null;
    }

    /**
     * Generate recommendation
     * @param {Object} result - Calculation result
     * @param {Object} riskLevel - Risk assessment
     * @returns {Object} Recommendation
     */
    generateRecommendation(result, riskLevel) {
        const roi = result.calculation.roi;
        const profit = result.calculation.totalProfit;
        
        let rating, suggestion, reasoning;
        
        if (roi >= 200 && riskLevel.level === 'Low') {
            rating = 'Excellent';
            suggestion = 'Highly recommended investment';
            reasoning = 'High returns with low risk make this an ideal choice';
        } else if (roi >= 100 && riskLevel.level !== 'Very High') {
            rating = 'Good';
            suggestion = 'Recommended for most players';
            reasoning = 'Good return potential with manageable risk';
        } else if (roi >= 50) {
            rating = 'Fair';
            suggestion = 'Consider based on your risk tolerance';
            reasoning = 'Moderate returns, evaluate risk carefully';
        } else if (roi >= 0) {
            rating = 'Poor';
            suggestion = 'Not recommended unless for collection';
            reasoning = 'Low or minimal returns, high opportunity cost';
        } else {
            rating = 'Very Poor';
            suggestion = 'Avoid this investment';
            reasoning = 'Negative returns, guaranteed loss';
        }

        return {
            rating: rating,
            suggestion: suggestion,
            reasoning: reasoning,
            details: {
                roi: roi,
                profit: profit,
                riskLevel: riskLevel.level
            }
        };
    }

    /**
     * Add calculation to history
     * @param {Object} calculation - Calculation result
     */
    addToHistory(calculation) {
        this.calculations.unshift(calculation);
        
        // Limit history size
        if (this.calculations.length > this.maxHistory) {
            this.calculations = this.calculations.slice(0, this.maxHistory);
        }
        
        // Save to localStorage
        this.saveHistory();
    }

    /**
     * Get calculation history
     * @param {number|null} limit - Maximum number of results to return
     * @returns {Array} History array
     */
    getHistory(limit = null) {
        return limit ? this.calculations.slice(0, limit) : [...this.calculations];
    }

    /**
     * Clear calculation history
     */
    clearHistory() {
        this.calculations = [];
        this.saveHistory();
    }

    /**
     * Get calculation by ID
     * @param {string} id - Calculation ID
     * @returns {Object|null} Calculation result
     */
    getHistoryById(id) {
        return this.calculations.find(calc => calc.id === id) || null;
    }

    /**
     * Remove calculation from history by ID
     * @param {string} id - Calculation ID
     * @returns {boolean} Whether removal was successful
     */
    removeHistoryById(id) {
        const index = this.calculations.findIndex(calc => calc.id === id);
        if (index !== -1) {
            this.calculations.splice(index, 1);
            this.saveHistory();
            return true;
        }
        return false;
    }

    /**
     * Save history to localStorage
     */
    saveHistory() {
        try {
            localStorage.setItem('garden-calculator-history', JSON.stringify(this.calculations));
        } catch (error) {
            console.warn('Failed to save calculation history:', error);
        }
    }

    /**
     * Load history from localStorage
     */
    loadHistory() {
        try {
            const saved = localStorage.getItem('garden-calculator-history');
            if (saved) {
                this.calculations = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Failed to load calculation history:', error);
            this.calculations = [];
        }
    }

    /**
     * Export calculation result
     * @param {Object} result - Calculation result
     * @param {string} format - Export format ('json', 'text')
     * @returns {string} Exported data
     */
    exportResult(result, format = 'json') {
        if (format === 'json') {
            return JSON.stringify(result, null, 2);
        } else if (format === 'text') {
            return this.formatResultAsText(result);
        } else {
            throw new Error(`Unsupported export format: ${format}`);
        }
    }

    /**
     * Format result as text
     * @param {Object} result - Calculation result
     * @returns {string} Formatted text
     */
    formatResultAsText(result) {
        const calc = result.calculation;
        const crop = result.crop;
        
        let text = `Garden Pro Calculator - Calculation Result\n`;
        text += `=====================================\n\n`;
        text += `Crop: ${crop.name} (${crop.rarity})\n`;
        text += `Quantity: ${result.quantity}\n\n`;
        text += `Cost Analysis:\n`;
        text += `- Unit Cost: ${calc.baseCost}\n`;
        text += `- Total Cost: ${calc.totalCost}\n\n`;
        text += `Value Analysis:\n`;
        text += `- Base Value: ${calc.baseValue}\n`;
        text += `- Mutation Multiplier: x${calc.mutationMultiplier}\n`;
        text += `- Mutation Bonus: +${calc.mutationBonus}x\n`;
        text += `- Final Value: ${calc.finalValue}\n\n`;
        text += `Profit Analysis:\n`;
        text += `- Total Profit: ${calc.totalProfit}\n`;
        text += `- ROI: ${calc.roi.toFixed(2)}%\n\n`;
        text += `Generated: ${new Date(result.timestamp).toLocaleString()}\n`;
        
        return text;
    }

    /**
     * Get calculator statistics
     * @returns {Object} Statistics
     */
    getStats() {
        return {
            totalCalculations: this.calculations.length,
            maxHistory: this.maxHistory,
            averageROI: this.calculations.length > 0 ? 
                this.calculations.reduce((sum, calc) => sum + calc.calculation.roi, 0) / this.calculations.length : 0
        };
    }
}

// 创建全局计算器实例
window.calculator = new GardenCalculator();