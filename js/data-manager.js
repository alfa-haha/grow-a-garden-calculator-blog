/**
 * Garden Pro Calculator - Data Manager
 * Responsible for loading and managing crop, mutation, and pet data
 */

class DataManager {
    constructor() {
        this.data = {
            crops: [],
            mutations: {},
            pets: [],
            eggs: [],
            gears: [],
            config: {}
        };
        this.loadPromises = new Map();
        this.initialized = false;
    }

    /**
     * Initialize the data manager
     * @returns {Promise<boolean>} Whether initialization was successful
     */
    async init() {
        if (this.initialized) return true;

        try {
            console.log('🔄 Initializing data manager...');
            
            // Load all data files in parallel
            const loadTasks = [
                this.loadCrops(),
                this.loadMutations(),
                this.loadPets(),
                this.loadEggs(),
                this.loadGears(),
                this.loadConfig()
            ];

            await Promise.all(loadTasks);
            
            this.initialized = true;
            console.log('✅ Data manager initialization complete');
            return true;
        } catch (error) {
            console.error('❌ Data manager initialization failed:', error);
            this.initialized = false;
            return false;
        }
    }

    /**
     * Load JSON data file
     * @param {string} url - File URL
     * @returns {Promise<Object>} Parsed data
     */
    async loadJSON(url) {
        // Avoid loading the same file multiple times
        if (this.loadPromises.has(url)) {
            return await this.loadPromises.get(url);
        }

        const loadPromise = (async () => {
            try {
                console.log(`📥 Loading data file: ${url}`);
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                // Check response size for debugging
                const contentLength = response.headers.get('Content-Length');
                console.log(`📊 Response content length: ${contentLength} bytes`);
                
                const text = await response.text();
                console.log(`📊 Actual text length: ${text.length} characters`);
                
                const data = JSON.parse(text);
                console.log(`✅ Successfully loaded and parsed: ${url}`);
                return data;
            } catch (error) {
                console.error(`❌ Failed to load ${url}:`, error);
                throw error;
            }
        })();

        this.loadPromises.set(url, loadPromise);
        return await loadPromise;
    }

    /**
     * Load crop data
     * @returns {Promise<Array>} Array of crop data
     */
    async loadCrops() {
        try {
            console.log('🌱 Loading crops from data/crops(new).json...');
            const data = await this.loadJSON('data/crops(new).json');
            
            this.data.crops = data.crops || [];
            console.log(`📊 Found ${this.data.crops.length} crops in data file`);
            
            // Data processing and validation
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

            console.log(`✅ Successfully loaded ${this.data.crops.length} crops`);
            return this.data.crops;
        } catch (error) {
            console.error('❌ Failed to load crop data:', error);
            this.data.crops = this.getDefaultCrops();
            console.log(`🔄 Using ${this.data.crops.length} default crops as fallback`);
            return this.data.crops;
        }
    }

    /**
     * Load mutation data from new format
     * @returns {Promise<Object>} Mutation data object
     */
    async loadMutations() {
        try {
            console.log('🌟 Loading mutations from data/mutations.json...');
            const data = await this.loadJSON('data/mutations.json');
            
            // Process mutations array into structured format
            const mutationsByCategory = {};
            const mutationsById = {};
            
            if (data.mutations && Array.isArray(data.mutations)) {
                data.mutations.forEach(mutation => {
                    // Store by ID for quick lookup
                    mutationsById[mutation.id] = mutation;
                    
                    // Group by category
                    const category = mutation.category || 'Unknown';
                    if (!mutationsByCategory[category]) {
                        mutationsByCategory[category] = [];
                    }
                    mutationsByCategory[category].push(mutation);
                });
            }
            
            this.data.mutations = {
                raw: data.mutations || [],
                byCategory: mutationsByCategory,
                byId: mutationsById,
                rules: data.mutation_rules || {}
            };
            
            console.log(`🌟 Loaded ${data.mutations ? data.mutations.length : 0} mutations`);
            console.log('🌟 Categories found:', Object.keys(mutationsByCategory));
            return this.data.mutations;
        } catch (error) {
            console.error('❌ Failed to load mutation data:', error);
            this.data.mutations = this.getDefaultMutations();
            return this.data.mutations;
        }
    }

    /**
     * Load pet data
     * @returns {Promise<Array>} Array of pet data
     */
    async loadPets() {
        try {
            console.log('🐾 Starting to load pets from data/pets(new).json...');
            const data = await this.loadJSON('data/pets(new).json');
            
            console.log('🔍 Raw data loaded:', data);
            console.log('🔍 data.pets type:', typeof data.pets);
            console.log('🔍 data.pets is array:', Array.isArray(data.pets));
            console.log('🔍 data.pets length:', data.pets ? data.pets.length : 'undefined');
            
            this.data.pets = data.pets || [];
            
            console.log('🔍 Before processing, pets count:', this.data.pets.length);
            
            // Data processing
            this.data.pets = this.data.pets.map(pet => ({
                ...pet,
                icon: this.getPetIcon(pet.id)
            }));

            console.log(`🐾 Loaded ${this.data.pets.length} pets`);
            console.log('🔍 First few pets:', this.data.pets.slice(0, 3));
            return this.data.pets;
        } catch (error) {
            console.error('❌ Failed to load pet data:', error);
            this.data.pets = this.getDefaultPets();
            return this.data.pets;
        }
    }

    /**
     * Load egg data
     * @returns {Promise<Array>} Array of egg data
     */
    async loadEggs() {
        try {
            console.log('🥚 Starting to load eggs from data/eggs.json...');
            const data = await this.loadJSON('data/eggs.json');

            // 兼容两种格式：{ eggs: [...] } 或直接是数组
            let eggsArray = [];
            if (Array.isArray(data)) {
                eggsArray = data;
            } else if (Array.isArray(data.eggs)) {
                eggsArray = data.eggs;
            } else {
                eggsArray = [];
            }

            this.data.eggs = eggsArray;

            console.log('🔍 Before processing, eggs count:', this.data.eggs.length);

            // Data processing
            this.data.eggs = this.data.eggs.map(egg => ({
                ...egg,
                icon: this.getEggIcon(egg.id)
            }));

            console.log(`🥚 Loaded ${this.data.eggs.length} eggs`);
            console.log('🔍 First few eggs:', this.data.eggs.slice(0, 3));
            return this.data.eggs;
        } catch (error) {
            console.error('❌ Failed to load egg data:', error);
            this.data.eggs = this.getDefaultEggs();
            return this.data.eggs;
        }
    }

    /**
     * Load gear data
     * @returns {Promise<Array>} Array of gear data
     */
    async loadGears() {
        try {
            console.log('⚙️ Starting to load gears from data/gears.json...');
            const data = await this.loadJSON('data/gears.json');
            
            console.log('🔍 Raw gear data loaded:', data);
            console.log('🔍 data.gears type:', typeof data.gears);
            console.log('🔍 data.gears is array:', Array.isArray(data.gears));
            console.log('🔍 data.gears length:', data.gears ? data.gears.length : 'undefined');
            
            this.data.gears = data.gears || [];
            
            console.log('🔍 Before processing, gears count:', this.data.gears.length);
            
            // Data processing
            this.data.gears = this.data.gears.map(gear => ({
                ...gear,
                icon: this.getGearIcon(gear.id)
            }));

            console.log(`⚙️ Loaded ${this.data.gears.length} gears`);
            console.log('🔍 First few gears:', this.data.gears.slice(0, 3));
            return this.data.gears;
        } catch (error) {
            console.error('❌ Failed to load gear data:', error);
            this.data.gears = this.getDefaultGears();
            return this.data.gears;
        }
    }

    /**
     * Load configuration data
     * @returns {Promise<Object>} Configuration data object
     */
    async loadConfig() {
        try {
            const data = await this.loadJSON('data/config.json');
            this.data.config = data || {};
            
            console.log(`⚙️ Loaded application configuration`);
            return this.data.config;
        } catch (error) {
            console.error('❌ Failed to load configuration data:', error);
            this.data.config = this.getDefaultConfig();
            return this.data.config;
        }
    }

    /**
     * Get all crops
     * @returns {Array} Array of crop data
     */
    getCrops() {
        return this.data.crops;
    }

    /**
     * Get crop by ID
     * @param {string} id - Crop ID
     * @returns {Object|null} Crop object or null
     */
    getCropById(id) {
        return this.data.crops.find(crop => crop.id === id) || null;
    }

    /**
     * Get crops by category
     * @param {string} category - Category name
     * @returns {Array} Array of crops
     */
    getCropsByCategory(category) {
        return this.data.crops.filter(crop => crop.category === category);
    }

    /**
     * Get crops by rarity
     * @param {string} rarity - Rarity level
     * @returns {Array} Array of crops
     */
    getCropsByRarity(rarity) {
        return this.data.crops.filter(crop => crop.rarity === rarity);
    }

    /**
     * Search crops
     * @param {string} query - Search keyword
     * @returns {Array} Search results
     */
    searchCrops(query) {
        if (!query || query.trim() === '') return this.data.crops;
        
        const searchTerm = query.toLowerCase().trim();
        return this.data.crops.filter(crop => 
            crop.name.toLowerCase().includes(searchTerm) ||
            crop.category.toLowerCase().includes(searchTerm) ||
            crop.rarity.toLowerCase().includes(searchTerm) ||
            (crop.description && crop.description.toLowerCase().includes(searchTerm))
        );
    }

    /**
     * Get all unique categories
     * @returns {Array} Array of unique categories
     */
    getUniqueCategories() {
        const categories = [...new Set(this.data.crops.map(crop => crop.category))];
        return categories.sort();
    }

    /**
     * Get all unique tiers/rarities
     * @returns {Array} Array of unique tiers
     */
    getUniqueTiers() {
        const tiers = [...new Set(this.data.crops.map(crop => crop.tier || crop.rarity))];
        return tiers.sort((a, b) => {
            const order = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical', 'Divine'];
            return order.indexOf(a) - order.indexOf(b);
        });
    }

    /**
     * Get all mutation data
     * @returns {Object} Mutation data object
     */
    getMutations() {
        return this.data.mutations;
    }

    /**
     * Get mutation by ID
     * @param {string} id - Mutation ID
     * @returns {Object|null} Mutation object or null
     */
    getMutationById(id) {
        return this.data.mutations.byId?.[id] || null;
    }

    /**
     * Get mutations by category
     * @param {string} category - Category name
     * @returns {Array} Array of mutations
     */
    getMutationsByCategory(category) {
        return this.data.mutations.byCategory?.[category] || [];
    }

    /**
     * Get growth mutations (backward compatibility)
     * @returns {Object} Growth mutation object in old format
     */
    getGrowthMutations() {
        const growthMutations = this.getMutationsByCategory('Growth Mutations');
        const types = {};
        
        growthMutations.forEach(mutation => {
            types[mutation.id.toLowerCase()] = {
                id: mutation.id,
                name: mutation.name,
                multiplier: mutation.sheckles_multiplier || 1,
                description: mutation.obtainment || '',
                icon: '🌟',
                color: '#F59E0B'
            };
        });
        
        return {
            category: 'Growth Mutations',
            description: 'Growth mutations that multiply base value',
            color: '#F59E0B',
            types: types
        };
    }

    /**
     * Get environmental mutations (backward compatibility)
     * @returns {Object} Environmental mutation object in old format
     */
    getEnvironmentalMutations() {
        const envMutations = this.getMutationsByCategory('Environmental Mutations');
        const tempMutations = this.getMutationsByCategory('Temperature Mutations');
        const allEnvMutations = [...envMutations, ...tempMutations];
        
        const types = {};
        
        allEnvMutations.forEach(mutation => {
            types[mutation.id.toLowerCase()] = {
                id: mutation.id,
                name: mutation.name,
                additive: mutation.sheckles_multiplier || 1,
                bonus: mutation.sheckles_multiplier || 1,
                description: mutation.obtainment || '',
                icon: '💧',
                color: '#06B6D4'
            };
        });
        
        return {
            category: 'Environmental Mutations',
            description: 'Environmental mutations that add bonus multipliers',
            color: '#06B6D4',
            types: types
        };
    }

    /**
     * Get all pet data
     * @returns {Array} Array of pets
     */
    getPets() {
        return this.data.pets;
    }

    /**
     * Get pet by ID
     * @param {string} id - Pet ID
     * @returns {Object|null} Pet object or null
     */
    getPetById(id) {
        return this.data.pets.find(pet => pet.id === id) || null;
    }

    /**
     * Get pets by rarity
     * @param {string} rarity - Rarity level
     * @returns {Array} Array of pets
     */
    getPetsByRarity(rarity) {
        return this.data.pets.filter(pet => pet.rarity === rarity);
    }

    /**
     * Get all egg data
     * @returns {Array} Array of eggs
     */
    getEggs() {
        return this.data.eggs;
    }

    /**
     * Get egg by ID
     * @param {string} id - Egg ID
     * @returns {Object|null} Egg object or null
     */
    getEggById(id) {
        return this.data.eggs.find(egg => egg.id === id) || null;
    }

    /**
     * Get eggs by source
     * @param {string} source - Source filter
     * @returns {Array} Array of eggs
     */
    getEggsBySource(source) {
        return this.data.eggs.filter(egg => egg.source && egg.source.includes(source));
    }

    /**
     * Get all gear data
     * @returns {Array} Array of gears
     */
    getGears() {
        return this.data.gears;
    }

    /**
     * Get gear by ID
     * @param {string} id - Gear ID
     * @returns {Object|null} Gear object or null
     */
    getGearById(id) {
        return this.data.gears.find(gear => gear.id === id) || null;
    }

    /**
     * Get gears by tier
     * @param {string} tier - Tier filter
     * @returns {Array} Array of gears
     */
    getGearsByTier(tier) {
        return this.data.gears.filter(gear => gear.tier === tier);
    }

    /**
     * Get obtainable gears
     * @param {boolean} obtainable - Obtainable filter
     * @returns {Array} Array of gears
     */
    getGearsByObtainable(obtainable) {
        return this.data.gears.filter(gear => gear.obtainable === obtainable);
    }

    /**
     * Get configuration data
     * @returns {Object} Configuration object
     */
    getConfig() {
        return this.data.config;
    }

    /**
     * Get application configuration
     * @returns {Object} Application configuration
     */
    getAppConfig() {
        return this.data.config.app || {};
    }

    /**
     * Get feature configuration
     * @returns {Object} Feature configuration
     */
    getFeatureConfig() {
        return this.data.config.features || {};
    }

    /**
     * Get UI configuration
     * @returns {Object} UI configuration
     */
    getUIConfig() {
        return this.data.config.ui || {};
    }

    /**
     * Get crop icon
     * @param {string} cropId - Crop ID
     * @returns {string} Icon emoji
     */
    getCropIcon(cropId) {
        const iconMap = {
            carrot: '🥕',
            strawberry: '🍓',
            blueberry: '🫐',
            potato: '🥔',
            tomato: '🍅',
            corn: '🌽',
            wheat: '🌾',
            rice: '🍚',
            apple: '🍎',
            orange: '🍊',
            banana: '🍌',
            grape: '🍇',
            mango: '🥭',
            pineapple: '🍍',
            watermelon: '🍉'
        };
        return iconMap[cropId] || '🌱';
    }

    /**
     * Get pet icon
     * @param {string} petId - Pet ID
     * @returns {string} Icon emoji
     */
    getPetIcon(petId) {
        const iconMap = {
            golden_lab: '🐕',
            dog: '🐶',
            bunny: '🐰',
            cat: '🐱',
            pig: '🐷',
            cow: '🐄',
            chicken: '🐔',
            duck: '🦆',
            fox: '🦊',
            wolf: '🐺',
            bear: '🐻',
            panda: '🐼',
            dragon: '🐲',
            unicorn: '🦄',
            phoenix: '🔥'
        };
        return iconMap[petId] || '🐾';
    }

    /**
     * Get egg icon
     * @param {string} eggId - Egg ID
     * @returns {string} Icon emoji
     */
    getEggIcon(eggId) {
        const iconMap = {
            common_egg: '🥚',
            uncommon_egg: '🥚',
            rare_egg: '🥚',
            legendary_egg: '🥚',
            mythical_egg: '🥚',
            bug_egg: '🐛',
            exotic_bug_egg: '🐛',
            night_egg: '🌙',
            premium_night_egg: '🌙',
            bee_egg: '🐝',
            anti_bee_egg: '🐝',
            premium_anti_bee_egg: '🐝',
            paradise_egg: '🌴',
            oasis_egg: '🏜️',
            premium_oasis_egg: '🏜️'
        };
        return iconMap[eggId] || '🥚';
    }

    /**
     * Get gear icon
     * @param {string} gearId - Gear ID
     * @returns {string} Icon emoji
     */
    getGearIcon(gearId) {
        const iconMap = {
            watering_can: '🚿',
            trowel: '🔧',
            recall_wrench: '🔧',
            basic_sprinkler: '💧',
            advanced_sprinkler: '💧',
            godly_sprinkler: '💧',
            master_sprinkler: '💧',
            chocolate_sprinkler: '🍫',
            honey_sprinkler: '🍯',
            star_caller: '⭐',
            night_staff: '🌙',
            nectar_staff: '🌸',
            pollen_radar: '📡',
            lightning_rod: '⚡',
            cleaning_spray: '🧼',
            favorite_tool: '💝',
            harvest_tool: '🔨',
            friendship_pot: '🌱',
            magnifying_glass: '🔍',
            reclaimer: '♻️'
        };
        return iconMap[gearId] || '⚙️';
    }

    /**
     * Get default crop data
     * @returns {Array} Default crop array
     */
    getDefaultCrops() {
        return [
            {
                id: 'carrot',
                name: 'Carrot',
                category: 'Common',
                rarity: 'Common',
                buyPrice: 10,
                sellValue: 20,
                multiHarvest: false,
                image: 'carrot.png',
                description: 'Basic crop, perfect for beginners',
                icon: '🥕',
                profit: 10,
                roi: 100
            }
        ];
    }

    /**
     * Get default mutation data
     * @returns {Object} Default mutation object
     */
    getDefaultMutations() {
        return {
            growth: {
                category: 'Growth Mutations',
                description: 'Basic growth mutations, mutually exclusive',
                color: '#FBBF24',
                types: {
                    normal: {
                        id: 'normal',
                        name: 'Normal',
                        multiplier: 1,
                        description: 'Normal crop, no additional bonus',
                        icon: '🌱',
                        color: '#9CA3AF'
                    },
                    golden: {
                        id: 'golden',
                        name: 'Golden',
                        multiplier: 20,
                        description: 'Golden mutation, value x20',
                        icon: '🌟',
                        color: '#F59E0B'
                    },
                    rainbow: {
                        id: 'rainbow',
                        name: 'Rainbow',
                        multiplier: 50,
                        description: 'Rainbow mutation, value x50',
                        icon: '🌈',
                        color: '#8B5CF6'
                    }
                }
            },
            environmental: {
                category: 'Environmental Mutations',
                description: 'Environmental mutations, can stack',
                color: '#06B6D4',
                types: {
                    wet: {
                        id: 'wet',
                        name: 'Wet',
                        bonus: 1,
                        description: 'Wet environment, extra +1x',
                        icon: '💧',
                        color: '#06B6D4'
                    }
                }
            }
        };
    }

    /**
     * Get default pet data
     * @returns {Array} Default pet array
     */
    getDefaultPets() {
        return [
            {
                id: 'golden_lab',
                name: 'Golden Lab',
                category: 'Common',
                rarity: 'Common',
                source: 'Common Egg',
                hatchChance: '33.33%',
                description: 'Loyal Golden Lab',
                image: 'golden-lab.png',
                abilities: ['Basic Harvest Acceleration'],
                icon: '🐕'
            }
        ];
    }

    /**
     * Get default egg data
     * @returns {Array} Default egg array
     */
    getDefaultEggs() {
        return [
            {
                id: 'common_egg',
                name: 'Common Egg',
                cost: {
                    sheckles: 50000,
                    robux: 19
                },
                hatchingProbability: {
                    'Golden Lab': '33.33%',
                    'Dog': '33.33%',
                    'Bunny': '33.33%'
                },
                hatchTime: '10 minutes',
                source: 'Eggs Shop 100% chance of being in stock',
                image: 'Common-Egg.png',
                icon: '🥚'
            }
        ];
    }

    /**
     * Get default gear data
     * @returns {Array} Default gear array
     */
    getDefaultGears() {
        return [
            {
                id: 'watering_can',
                name: 'Watering Can',
                price: {
                    sheckles: 50000,
                    robux: 39
                },
                use: 'Speeds up crop growth',
                obtainable: true,
                tier: 'Common',
                image: 'Watering-Can.png',
                stock: '1–4',
                icon: '🚿'
            }
        ];
    }

    /**
     * Get default configuration data
     * @returns {Object} Default configuration object
     */
    getDefaultConfig() {
        return {
            app: {
                name: 'Garden Pro Calculator',
                version: '2.0.0',
                description: 'Professional garden cultivation game calculator tool'
            },
            features: {
                maxComparisons: 4,
                maxHistory: 50,
                maxFavorites: 20,
                autoSave: true,
                defaultTheme: 'auto'
            },
            ui: {
                themes: {
                    light: { name: 'Light Mode', icon: '☀️' },
                    dark: { name: 'Dark Mode', icon: '🌙' },
                    auto: { name: 'Auto Mode', icon: '🌗' }
                }
            }
        };
    }

    /**
     * Check if data is loaded
     * @returns {boolean} Whether initialized
     */
    isInitialized() {
        return this.initialized;
    }

    /**
     * Refresh data
     * @returns {Promise<boolean>} Whether refresh was successful
     */
    async refresh() {
        this.loadPromises.clear();
        this.initialized = false;
        return await this.init();
    }

    /**
     * Get data statistics
     * @returns {Object} Statistics object
     */
    getStats() {
        return {
            crops: this.data.crops.length,
            pets: this.data.pets.length,
            eggs: this.data.eggs.length,
            gears: this.data.gears.length,
            growthMutations: Object.keys(this.getGrowthMutations().types || {}).length,
            environmentalMutations: Object.keys(this.getEnvironmentalMutations().types || {}).length,
            initialized: this.initialized
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}