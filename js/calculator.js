/**
 * Garden Pro Calculator - Calculator Core
 * Responsible for crop value calculation and mutation effect calculation
 */

class GardenCalculator {
    constructor() {
        this.calculations = [];
        this.maxHistory = 50;
    }

    /**
     * Calculate crop value
     * @param {Object} crop - Crop object
     * @param {Object} mutations - Mutation configuration
     * @param {number} quantity - Quantity
     * @returns {Object} Calculation result
     */
    calculateCropValue(crop, mutations = {}, quantity = 1) {
        if (!crop) {
            throw new Error('Crop data cannot be empty');
        }

        // Basic value calculation
        const baseValue = crop.sellValue || 0;
        const baseCost = crop.buyPrice || 0;
        const baseProfit = baseValue - baseCost;

        // Apply mutation effects
        const mutationResult = this.applyMutations(baseValue, mutations);
        
        // Final calculation
        const finalValue = mutationResult.finalValue * quantity;
        const totalCost = baseCost * quantity;
        const totalProfit = finalValue - totalCost;
        const roi = totalCost > 0 ? (totalProfit / totalCost * 100) : 0;

        const result = {
            crop: crop,
            quantity: quantity,
            mutations: mutations,
            calculation: {
                baseValue: baseValue,
                baseCost: baseCost,
                baseProfit: baseProfit,
                mutationMultiplier: mutationResult.totalMultiplier,
                mutationBonus: mutationResult.totalBonus,
                finalValue: finalValue,
                totalCost: totalCost,
                totalProfit: totalProfit,
                roi: roi,
                breakdown: mutationResult.breakdown
            },
            timestamp: Date.now(),
            id: Utils.generateId()
        };

        // Add to history
        this.addToHistory(result);

        return result;
    }

    /**
     * Apply mutation effects
     * @param {number} baseValue - Base value
     * @param {Object} mutations - Mutation configuration
     * @returns {Object} Mutation calculation result
     */
    applyMutations(baseValue, mutations) {
        let totalMultiplier = 1;
        let totalBonus = 0;
        const breakdown = [];

        // Handle growth mutations (multiplicative effect, mutually exclusive)
        if (mutations.growth) {
            const growthMutation = dataManager.getGrowthMutations().types?.[mutations.growth];
            if (growthMutation) {
                const multiplier = growthMutation.multiplier || 1;
                totalMultiplier *= multiplier;
                breakdown.push({
                    type: 'growth',
                    name: growthMutation.name,
                    effect: `x${multiplier}`,
                    description: growthMutation.description,
                    icon: growthMutation.icon,
                    color: growthMutation.color
                });
            }
        }

        // Handle environmental mutations (additive effect, can stack)
        if (mutations.environmental && Array.isArray(mutations.environmental)) {
            const envMutations = dataManager.getEnvironmentalMutations().types || {};
            mutations.environmental.forEach(envId => {
                const envMutation = envMutations[envId];
                if (envMutation) {
                    const bonus = envMutation.additive || envMutation.bonus || 0;
                    totalBonus += bonus;
                    breakdown.push({
                        type: 'environmental',
                        name: envMutation.name,
                        effect: `+${bonus}x`,
                        description: envMutation.description,
                        icon: envMutation.icon,
                        color: envMutation.color
                    });
                }
            });
        }

        // Calculate final value: (base value * multiplicative effect) + (base value * additive effect)
        const multipliedValue = baseValue * totalMultiplier;
        const bonusValue = baseValue * totalBonus;
        const finalValue = multipliedValue + bonusValue;

        return {
            baseValue: baseValue,
            totalMultiplier: totalMultiplier,
            totalBonus: totalBonus,
            multipliedValue: multipliedValue,
            bonusValue: bonusValue,
            finalValue: finalValue,
            breakdown: breakdown
        };
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