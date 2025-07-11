/**
 * Garden Pro Calculator - Main Application Logic
 * Responsible for application initialization, global state management and core functionality coordination
 */

class App {
    constructor() {
        this.version = '2.4.0';
        this.initialized = false;
        this.config = {};
        this.state = {
            currentPage: '',
            theme: 'auto',
            language: 'en'
        };
        
        // Core component instances
        this.dataManager = null;
        this.calculator = null;
        this.themeManager = null;
        
        console.log(`🌱 Garden Pro Calculator v${this.version} starting...`);
    }

    /**
     * Initialize application
     * @returns {Promise<boolean>} Whether initialization was successful
     */
    async init() {
        if (this.initialized) return true;

        try {
            console.log('🔄 Initializing application...');
            
            // Detect current page
            this.detectCurrentPage();
            
            // Initialize core components
            await this.initComponents();
            
            // Initialize UI interactions
            this.initUI();
            
            // Load user settings
            this.loadUserSettings();
            
            // Setup global error handling
            this.setupErrorHandling();
            
            this.initialized = true;
            console.log('✅ Application initialization completed');
            
            // Trigger initialization completed event
            this.dispatchEvent('app:initialized');
            
            return true;
        } catch (error) {
            console.error('❌ Application initialization failed:', error);
            this.handleError(error);
            return false;
        }
    }

    /**
     * Detect current page based on URL and DOM
     */
    detectCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        console.log('🔍 Detecting current page:', { path, filename });
        
        if (filename === 'calculator.html' || path.includes('calculator')) {
            this.state.currentPage = 'calculator';
        } else if (filename === 'crops.html' || path.includes('crops')) {
            this.state.currentPage = 'crops';
        } else if (filename === 'pets.html' || path.includes('pets')) {
            this.state.currentPage = 'pets';
        } else if (filename === 'eggs.html' || path.includes('eggs')) {
            this.state.currentPage = 'eggs';
        } else if (filename === 'gears.html' || path.includes('gears')) {
            this.state.currentPage = 'gears';
        } else if (filename === 'mutations.html' || path.includes('mutations')) {
            this.state.currentPage = 'mutations';
        } else {
            this.state.currentPage = 'index';
        }
        
        console.log(`📍 Current page detected: ${this.state.currentPage}`);
    }

    /**
     * Initialize core components
     */
    async initComponents() {
        try {
            console.log('🔄 Initializing core components...');
            
            // Initialize data manager
            this.dataManager = new DataManager();
            console.log('📊 Data manager created, starting initialization...');
            await this.dataManager.init();
            console.log('✅ Data manager initialized successfully');
            
            // Initialize calculator (if needed)
            if (this.state.currentPage === 'calculator' || this.isCalculatorNeeded()) {
                this.calculator = new GardenCalculator();
                console.log('🧮 Calculator component initialized');
                
                // Initialize calculator page UI
                if (this.state.currentPage === 'calculator') {
                    await this.initCalculatorPage();
                }
            }
            
            // Initialize crops page UI
            if (this.state.currentPage === 'crops') {
                console.log('🌱 Initializing crops page UI...');
                await this.initCropsPage();
            }
            
            // Initialize pets page UI
            if (this.state.currentPage === 'pets') {
                console.log('🐾 Initializing pets page UI...');
                // 确保数据已加载
                console.log('🔍 Checking DataManager pets data before pets page init...');
                const pets = this.dataManager.getPets();
                console.log(`🔍 DataManager has ${pets ? pets.length : 0} pets`);
                await this.initPetsPage();
            }
            
            // Initialize eggs page UI
            if (this.state.currentPage === 'eggs') {
                console.log('🥚 Initializing eggs page UI...');
                // 确保数据已加载
                console.log('🔍 Checking DataManager eggs data before eggs page init...');
                const eggs = this.dataManager.getEggs();
                console.log(`🔍 DataManager has ${eggs ? eggs.length : 0} eggs`);
                await this.initEggsPage();
            }
            
            // Initialize gears page UI
            if (this.state.currentPage === 'gears') {
                console.log('⚙️ Initializing gears page UI...');
                // 确保数据已加载
                console.log('🔍 Checking DataManager gears data before gears page init...');
                const gears = this.dataManager.getGears();
                console.log(`🔍 DataManager has ${gears ? gears.length : 0} gears`);
                await this.initGearsPage();
            }
            
            // Always check for hero calculator on index page
            if (this.state.currentPage === 'index') {
                console.log('🎯 On index page, checking for hero calculator...');
                if (this.hasHeroCalculator()) {
                    // Ensure calculator component is initialized
                    if (!this.calculator) {
                        this.calculator = new GardenCalculator();
                        console.log('🧮 Calculator component initialized for hero calculator');
                    }
                    console.log('🎯 Hero calculator detected, initializing...');
                    await this.initHeroCalculator();
                } else {
                    console.log('❌ No hero calculator found on index page');
                }
            }
            
            // Initialize theme manager (temporarily commented out for debugging)
            try {
                this.themeManager = new ThemeManager();
                this.themeManager.init();
                console.log('🎨 Theme manager initialized successfully');
            } catch (error) {
                console.warn('⚠️ Theme manager initialization failed, continuing without it:', error);
            }
            
            console.log('✅ All core components initialized successfully');
        } catch (error) {
            console.error('❌ Component initialization failed:', error);
            throw error;
        }
    }

    /**
     * Initialize calculator page UI
     */
    async initCalculatorPage() {
        if (this.state.currentPage !== 'calculator') return;
        
        try {
            console.log('🎨 Initializing calculator page UI...');
            
            // Render crop grid
            await this.renderCropGrid();
            
            // Setup calculator interactions
            this.setupCalculatorInteractions();
            
            console.log('✅ Calculator page UI initialized');
        } catch (error) {
            console.error('❌ Calculator page initialization failed:', error);
            throw error;
        }
    }

    /**
     * Initialize hero calculator UI on index page
     */
    async initHeroCalculator() {
        try {
            console.log('🎨 Initializing hero calculator UI...');
            
            // Check if data manager is initialized
            if (!this.dataManager || !this.dataManager.isInitialized()) {
                console.warn('⚠️ Data manager not initialized, waiting...');
                await this.dataManager.init();
            }
            
            // Check if we have crop data
            const crops = this.dataManager.getCrops();
            console.log(`🔍 Found ${crops.length} crops for hero calculator`);
            
            if (crops.length === 0) {
                console.error('❌ No crops data available for hero calculator');
                return;
            }
            
            // Render hero crop grid
            await this.renderHeroCropGrid();
            
            // 🆕 Render hero mutations dynamically
            await this.renderHeroMutations();
            
            // Setup hero calculator interactions
            this.setupHeroCalculatorInteractions();
            
            // 处理URL参数，检查是否有指定的作物ID
            this.handleUrlParameters();
            
            console.log('✅ Hero calculator UI initialized successfully');
        } catch (error) {
            console.error('❌ Hero calculator initialization failed:', error);
            throw error;
        }
    }

    /**
     * 🆕 动态渲染hero mutations，严格按照mutations(new).json数据
     */
    async renderHeroMutations() {
        try {
            console.log('🌟 Rendering hero mutations from mutations(new).json...');
            
            // 获取mutations数据
            const mutationsData = this.dataManager.getMutations();
            console.log('🔍 Raw mutations data:', mutationsData);
            console.log('🔍 mutationsData type:', typeof mutationsData);
            console.log('🔍 mutationsData.byCategory exists:', !!mutationsData?.byCategory);
            console.log('🔍 mutationsData.byCategory:', mutationsData?.byCategory);
            
            // 🆕 备用方案：如果byCategory不存在，尝试直接使用raw数据
            if (!mutationsData || !mutationsData.byCategory) {
                console.warn('⚠️ byCategory not found, trying alternative approach...');
                
                // 检查是否有raw数据
                if (mutationsData && mutationsData.raw && Array.isArray(mutationsData.raw)) {
                    console.log('🔄 Using raw mutations data to build categories...');
                    const categorizedData = this.buildMutationCategories(mutationsData.raw);
                    this.renderMutationsWithData(categorizedData);
                    return;
                }
                
                // 如果都没有，使用默认数据
                console.error('❌ No mutations data available, using fallback');
                this.renderFallbackMutations();
                return;
            }
            
            // 检查具体的category数据
            console.log('🔍 Available categories:', Object.keys(mutationsData.byCategory));
            console.log('🔍 Growth Mutations:', mutationsData.byCategory['Growth Mutations']);
            console.log('🔍 Temperature Mutations:', mutationsData.byCategory['Temperature Mutations']);
            console.log('🔍 Environmental Mutations:', mutationsData.byCategory['Environmental Mutations']);
            
            // 渲染Growth Mutations
            this.renderHeroGrowthMutations(mutationsData);
            
            // 渲染Temperature Mutations  
            this.renderHeroTemperatureMutations(mutationsData);
            
            // 渲染Environmental Mutations
            this.renderHeroEnvironmentalMutations(mutationsData);
            
            console.log('✅ Hero mutations rendered successfully');
        } catch (error) {
            console.error('❌ Failed to render hero mutations:', error);
            console.error('❌ Error stack:', error.stack);
            // 🆕 出错时使用fallback
            this.renderFallbackMutations();
        }
    }

    /**
     * 🆕 从原始数据构建分类结构
     */
    buildMutationCategories(rawMutations) {
        const byCategory = {};
        
        rawMutations.forEach(mutation => {
            const category = mutation.category || 'Unknown';
            if (!byCategory[category]) {
                byCategory[category] = [];
            }
            byCategory[category].push(mutation);
        });
        
        console.log('🔄 Built categories from raw data:', Object.keys(byCategory));
        return { byCategory };
    }

    /**
     * 🆕 使用指定数据渲染mutations
     */
    renderMutationsWithData(mutationsData) {
        this.renderHeroGrowthMutations(mutationsData);
        this.renderHeroTemperatureMutations(mutationsData);
        this.renderHeroEnvironmentalMutations(mutationsData);
    }

    /**
     * 🆕 Fallback渲染方法
     */
    renderFallbackMutations() {
        console.log('🔄 Rendering fallback mutations...');
        
        // Growth Mutations fallback
        const growthContainer = document.getElementById('hero-growth-mutations');
        if (growthContainer) {
            growthContainer.innerHTML = `
                <div class="mutation-option-compact active" data-mutation="normal">
                    <span class="mutation-name">Normal</span>
                    <span class="mutation-effect">×1</span>
                </div>
                <div class="mutation-option-compact" data-mutation="gold">
                    <span class="mutation-name">Gold</span>
                    <span class="mutation-effect">×20</span>
                </div>
                <div class="mutation-option-compact" data-mutation="rainbow">
                    <span class="mutation-name">Rainbow</span>
                    <span class="mutation-effect">×50</span>
                </div>
            `;
        }
        
        // Temperature Mutations fallback
        const tempContainer = document.getElementById('hero-temperature-mutations');
        if (tempContainer) {
            tempContainer.innerHTML = `
                <div class="mutation-option-compact active" data-mutation="normal_temp">
                    <span class="mutation-name">Normal</span>
                    <span class="mutation-effect">+0×</span>
                </div>
                <div class="mutation-option-compact" data-mutation="wet">
                    <span class="mutation-name">Wet</span>
                    <span class="mutation-effect">+2×</span>
                </div>
                <div class="mutation-option-compact" data-mutation="chilled">
                    <span class="mutation-name">Chilled</span>
                    <span class="mutation-effect">+2×</span>
                </div>
                <div class="mutation-option-compact" data-mutation="frozen">
                    <span class="mutation-name">Frozen</span>
                    <span class="mutation-effect">+10×</span>
                </div>
            `;
        }
        
        // Environmental Mutations fallback
        const envContainer = document.getElementById('hero-environmental-mutations');
        if (envContainer) {
            envContainer.innerHTML = `
                <div class="mutation-option-compact" data-mutation="windstruck">
                    <span class="mutation-name">Windstruck</span>
                    <span class="mutation-effect">+2×</span>
                </div>
                <div class="mutation-option-compact" data-mutation="moonlit">
                    <span class="mutation-name">Moonlit</span>
                    <span class="mutation-effect">+2×</span>
                </div>
                <div class="mutation-option-compact" data-mutation="shocked">
                    <span class="mutation-name">Shocked</span>
                    <span class="mutation-effect">+100×</span>
                </div>
                <div class="mutation-option-compact" data-mutation="celestial">
                    <span class="mutation-name">Celestial</span>
                    <span class="mutation-effect">+120×</span>
                </div>
            `;
        }
        
        console.log('🔄 Fallback mutations rendered');
    }

    /**
     * 渲染Growth Mutations
     */
    renderHeroGrowthMutations(mutationsData) {
        const container = document.getElementById('hero-growth-mutations');
        console.log('🔍 Growth mutations container:', container);
        if (!container) {
            console.error('❌ hero-growth-mutations container not found');
            return;
        }
        
        const growthMutations = mutationsData.byCategory['Growth Mutations'] || [];
        console.log('🔍 Growth mutations data:', growthMutations);
        console.log('🔍 Growth mutations count:', growthMutations.length);
        
        let html = `
            <div class="mutation-option-compact active" data-mutation="normal">
                <span class="mutation-name">Normal</span>
                <span class="mutation-effect">×1</span>
            </div>
        `;
        
        growthMutations.forEach(mutation => {
            const mutationId = mutation.id.toLowerCase();
            console.log('🔍 Processing growth mutation:', mutation.name, 'multiplier:', mutation.sheckles_multiplier);
            html += `
                <div class="mutation-option-compact" data-mutation="${mutationId}">
                    <span class="mutation-name">${mutation.name}</span>
                    <span class="mutation-effect">×${mutation.sheckles_multiplier}</span>
                </div>
            `;
        });
        
        console.log('🔍 Generated growth HTML length:', html.length);
        container.innerHTML = html;
        console.log(`🌟 Rendered ${growthMutations.length + 1} growth mutations`);
        console.log('🔍 Container children after render:', container.children.length);
    }

    /**
     * 渲染Temperature Mutations
     */
    renderHeroTemperatureMutations(mutationsData) {
        const container = document.getElementById('hero-temperature-mutations');
        if (!container) return;
        
        const tempMutations = mutationsData.byCategory['Temperature Mutations'] || [];
        
        let html = `
            <div class="mutation-option-compact active" data-mutation="normal_temp">
                <span class="mutation-name">Normal</span>
                <span class="mutation-effect">+0×</span>
            </div>
        `;
        
        tempMutations.forEach(mutation => {
            const mutationId = mutation.id.toLowerCase();
            html += `
                <div class="mutation-option-compact" data-mutation="${mutationId}">
                    <span class="mutation-name">${mutation.name}</span>
                    <span class="mutation-effect">+${mutation.sheckles_multiplier}×</span>
                </div>
            `;
        });
        
        container.innerHTML = html;
        console.log(`🌡️ Rendered ${tempMutations.length + 1} temperature mutations`);
    }

    /**
     * 渲染Environmental Mutations
     */
    renderHeroEnvironmentalMutations(mutationsData) {
        const container = document.getElementById('hero-environmental-mutations');
        if (!container) return;
        
        const envMutations = mutationsData.byCategory['Environmental Mutations'] || [];
        
        let html = '';
        envMutations.forEach(mutation => {
            const mutationId = mutation.id.toLowerCase();
            html += `
                <div class="mutation-option-compact" data-mutation="${mutationId}">
                    <span class="mutation-name">${mutation.name}</span>
                    <span class="mutation-effect">+${mutation.sheckles_multiplier}×</span>
                </div>
            `;
        });
        
        container.innerHTML = html;
        console.log(`🌍 Rendered ${envMutations.length} environmental mutations`);
    }
    
    /**
     * 处理URL参数，用于从其他页面跳转到计算器时自动选择作物
     */
    handleUrlParameters() {
        try {
            // 检查URL中是否包含作物参数
            const hash = window.location.hash;
            if (hash && hash.includes('calculator-module')) {
                const urlParams = new URLSearchParams(hash.split('?')[1] || '');
                const cropId = urlParams.get('crop');
                
                if (cropId) {
                    console.log(`🔍 Found crop ID in URL parameters: ${cropId}`);
                    // 延迟一点执行，确保DOM已完全加载
                    setTimeout(() => {
                        this.selectHeroCrop(cropId);
                        // 滚动到计算器位置
                        document.getElementById('calculator-module')?.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                }
            }
        } catch (error) {
            console.warn('⚠️ Error handling URL parameters:', error);
        }
    }

    /**
     * Initialize crops page UI
     */
    async initCropsPage() {
        if (this.state.currentPage !== 'crops') return;
        
        try {
            console.log('🌱 Initializing crops page UI...');
            
            // Render crops in table view first (this will also setup filter options)
            await this.renderCropsPage();
            
            // Setup crops page interactions
            this.setupCropsPageInteractions();
            
            console.log('✅ Crops page UI initialized');
        } catch (error) {
            console.error('❌ Crops page initialization failed:', error);
            throw error;
        }
    }
    
    /**
     * Initialize pets page UI
     */
    async initPetsPage() {
        if (this.state.currentPage !== 'pets') return;
        
        try {
            console.log('🐾 Initializing pets page UI...');
            
            // Get pets data from data manager
            const pets = this.dataManager.getPets();
            console.log(`🔍 Got ${pets ? pets.length : 0} pets from DataManager`);
            
            // Check if pets manager exists and its status
            if (window.petsManager) {
                if (window.petsManager.isInitialized) {
                    console.log('🐾 PetsManager already initialized, skipping...');
                    return;
                } else if (window.petsManager.isInitializing) {
                    console.log('🐾 PetsManager currently initializing, waiting...');
                    // Wait for initialization to complete
                    while (window.petsManager.isInitializing) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                    console.log('🐾 PetsManager initialization completed');
                    return;
                } else {
                    console.log('🐾 PetsManager found, initializing with data...');
                    // 直接设置数据，避免等待逻辑
                    window.petsManager.pets = pets || [];
                    window.petsManager.filteredPets = [...(pets || [])];
                    console.log('🔍 Set PetsManager.pets length:', window.petsManager.pets.length);
                    console.log('🔍 Set PetsManager.filteredPets length:', window.petsManager.filteredPets.length);
                    await window.petsManager.init();
                }
            } else {
                console.log('🐾 PetsManager not found, will be initialized by pets.js');
            }
            
            console.log('✅ Pets page UI initialized');
        } catch (error) {
            console.error('❌ Pets page initialization failed:', error);
            throw error;
        }
    }
    
    /**
     * Initialize eggs page UI
     */
    async initEggsPage() {
        if (this.state.currentPage !== 'eggs') return;
        
        try {
            console.log('🥚 Initializing eggs page UI...');
            
            // Get eggs data from data manager
            const eggs = this.dataManager.getEggs();
            console.log(`🔍 Got ${eggs ? eggs.length : 0} eggs from DataManager`);
            
            // Check if eggs manager exists and its status
            if (window.eggsManager) {
                if (window.eggsManager.isInitialized) {
                    console.log('🥚 EggsManager already initialized, skipping...');
                    return;
                } else if (window.eggsManager.isInitializing) {
                    console.log('🥚 EggsManager currently initializing, waiting...');
                    // Wait for initialization to complete
                    while (window.eggsManager.isInitializing) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                    console.log('🥚 EggsManager initialization completed');
                    return;
                } else {
                    console.log('🥚 EggsManager found, initializing with data...');
                    // 直接设置数据，避免等待逻辑
                    window.eggsManager.eggs = eggs || [];
                    window.eggsManager.filteredEggs = [...(eggs || [])];
                    console.log('🔍 Set EggsManager.eggs length:', window.eggsManager.eggs.length);
                    console.log('🔍 Set EggsManager.filteredEggs length:', window.eggsManager.filteredEggs.length);
                    await window.eggsManager.init();
                }
            } else {
                console.log('🥚 EggsManager not found, waiting for initialization...');
                // Wait for initializeEggsManager function to be available
                let retries = 0;
                const maxRetries = 50;
                while (!window.initializeEggsManager && retries < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    retries++;
                }
                
                if (window.initializeEggsManager) {
                    console.log('🥚 Found initializeEggsManager, calling it with data...');
                    await window.initializeEggsManager(eggs);
                } else {
                    console.warn('⚠️ initializeEggsManager not found after waiting');
                }
            }
            
            console.log('✅ Eggs page UI initialized');
        } catch (error) {
            console.error('❌ Eggs page initialization failed:', error);
            throw error;
        }
    }

    /**
     * Initialize gears page UI
     */
    async initGearsPage() {
        if (this.state.currentPage !== 'gears') return;
        
        try {
            console.log('⚙️ Initializing gears page UI...');
            
            // Get gears data from data manager
            const gears = this.dataManager.getGears();
            console.log(`🔍 Got ${gears ? gears.length : 0} gears from DataManager`);
            
            // Check if gears manager exists and its status
            if (window.gearsManager) {
                if (window.gearsManager.isInitialized) {
                    console.log('⚙️ GearsManager already initialized, skipping...');
                    return;
                } else if (window.gearsManager.isInitializing) {
                    console.log('⚙️ GearsManager currently initializing, waiting...');
                    // Wait for initialization to complete
                    while (window.gearsManager.isInitializing) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                    console.log('⚙️ GearsManager initialization completed');
                    return;
                } else {
                    console.log('⚙️ GearsManager found, initializing with data...');
                    // 直接设置数据，避免等待逻辑
                    window.gearsManager.gears = gears || [];
                    window.gearsManager.filteredGears = [...(gears || [])];
                    console.log('🔍 Set GearsManager.gears length:', window.gearsManager.gears.length);
                    console.log('🔍 Set GearsManager.filteredGears length:', window.gearsManager.filteredGears.length);
                    await window.gearsManager.init();
                }
            } else {
                console.log('⚙️ GearsManager not found, will be initialized by gears.js');
            }
            
            console.log('✅ Gears page UI initialized');
        } catch (error) {
            console.error('❌ Gears page initialization failed:', error);
            throw error;
        }
    }

    /**
     * Setup crops page interactions
     */
    setupCropsPageInteractions() {
        try {
            console.log('🔄 Setting up crops page interactions');
            
            // Setup search input
            const searchInput = document.getElementById('crops-search');
            if (searchInput) {
                searchInput.addEventListener('input', (event) => {
                    this.filterCropsPage(event.target.value);
                });
            }
            
            // Setup filters
            // 删除category-filter相关代码
            
            const tierFilter = document.getElementById('tier-filter');
            if (tierFilter) {
                tierFilter.addEventListener('change', () => {
                    this.applyCropsFilters();
                });
            }
            
            const harvestFilter = document.getElementById('harvest-filter');
            if (harvestFilter) {
                harvestFilter.addEventListener('change', () => {
                    this.applyCropsFilters();
                });
            }
            
            const sortFilter = document.getElementById('sort-filter');
            if (sortFilter) {
                sortFilter.addEventListener('change', () => {
                    this.applyCropsFilters();
                });
            }
            
            // Setup reset filters button
            const resetFiltersBtn = document.getElementById('reset-filters');
            if (resetFiltersBtn) {
                resetFiltersBtn.addEventListener('click', () => {
                    this.resetFilters();
                });
            }
            
            // Setup modal calculate button
            const modalCalculateBtn = document.getElementById('modal-calculate-btn');
            if (modalCalculateBtn) {
                modalCalculateBtn.addEventListener('click', () => {
                    const cropId = document.getElementById('modal-crop-name').dataset.cropId;
                    if (cropId) {
                        window.location.href = `index.html#calculator-module?crop=${cropId}`;
                    } else {
                        window.location.href = 'index.html#calculator-module';
                    }
                });
            }
            
            console.log('✅ Crops page interactions setup');
        } catch (error) {
            console.error('❌ Error setting up crops page interactions:', error);
        }
    }
    
    /**
     * Filter crops page based on search query
     */
    filterCropsPage(query) {
        console.log(`🔍 Filtering crops with query: ${query}`);
        this.applyCropsFilters();
    }
    
    // View switching removed - only table view available
    
    /**
     * Setup filter options based on actual data
     */
    setupFilterOptions() {
        try {
            // Check if data manager is available
            if (!this.dataManager || !this.dataManager.isInitialized()) {
                console.warn('⚠️ DataManager not available for filter setup');
                return;
            }
            
            // Get all crops
            const crops = this.dataManager.getCrops();
            if (!crops || crops.length === 0) {
                console.warn('⚠️ No crops data available for filter setup');
                return;
            }
            
            // 删除category filter设置代码
            
            // Setup tier filter
            const tierFilter = document.getElementById('tier-filter');
            if (tierFilter && typeof this.dataManager.getUniqueRarities === 'function') {
                const rarities = this.dataManager.getUniqueRarities();
                
                // Clear existing options except the first one
                while (tierFilter.children.length > 1) {
                    tierFilter.removeChild(tierFilter.lastChild);
                }
                
                // Add options for each rarity
                rarities.forEach(rarity => {
                    const option = document.createElement('option');
                    option.value = rarity;
                    option.textContent = rarity;
                    tierFilter.appendChild(option);
                });
            }
        } catch (error) {
            console.error('❌ Error setting up filter options:', error);
        }
    }
    
    /**
     * Sort crops array based on criteria
     */
    sortCropsArray(crops, criteria) {
        console.log(`🔄 Sorting crops by: ${criteria}`);
        
        switch (criteria) {
            case 'name':
                return crops.sort((a, b) => a.name.localeCompare(b.name));
            case 'sellValue':
                return crops.sort((a, b) => (b.sellValue || b.minimum_value || 0) - (a.sellValue || a.minimum_value || 0));
            case 'buyPrice':
                return crops.sort((a, b) => (b.buyPrice || b.sheckle_price || 0) - (a.buyPrice || a.sheckle_price || 0));
            case 'profit':
                return crops.sort((a, b) => b.profit - a.profit);
            case 'rarity':
                const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical', 'Divine'];
                return crops.sort((a, b) => {
                    const aRarity = a.tier || a.rarity;
                    const bRarity = b.tier || b.rarity;
                    return rarityOrder.indexOf(aRarity) - rarityOrder.indexOf(bRarity);
                });
            default:
                return crops;
        }
    }
    
    /**
     * Reset all filters
     */
    resetFilters() {
        console.log('🔄 Resetting all filters');
        
        // Clear search input
        const searchInput = document.getElementById('crops-search');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Reset filter selects
        // 删除category-filter引用
        
        const tierFilter = document.getElementById('tier-filter');
        if (tierFilter) {
            tierFilter.value = '';
        }
        
        const harvestFilter = document.getElementById('harvest-filter');
        if (harvestFilter) {
            harvestFilter.value = '';
        }
        
        const sortFilter = document.getElementById('sort-filter');
        if (sortFilter) {
            sortFilter.value = 'name';
        }
        
        // Apply filters (which will show all crops)
        this.applyCropsFilters();
    }
    
    /**
     * Apply crops filters
     */
    applyCropsFilters() {
        console.log('🔍 Applying crops filters');
        
        try {
            // Check if data manager is available
            if (!this.dataManager || !this.dataManager.isInitialized()) {
                console.warn('⚠️ DataManager not available for filtering');
                return;
            }
            
            // Get filter values
            const searchQuery = document.getElementById('crops-search')?.value.toLowerCase() || '';
            // 删除category-filter引用
            const tierFilter = document.getElementById('tier-filter')?.value || '';
            const harvestFilter = document.getElementById('harvest-filter')?.value || '';
            const sortFilter = document.getElementById('sort-filter')?.value || 'name';
            
            // Get all crops
            let crops = this.dataManager.getCrops();
            
            if (!crops || crops.length === 0) {
                console.warn('⚠️ No crops data available for filtering');
                return;
            }
            
            // Apply search filter
            if (searchQuery) {
                crops = crops.filter(crop => 
                    crop.name.toLowerCase().includes(searchQuery) ||
                    crop.category.toLowerCase().includes(searchQuery) ||
                    crop.rarity.toLowerCase().includes(searchQuery) ||
                    (crop.description && crop.description.toLowerCase().includes(searchQuery))
                );
            }
            
            // 删除category过滤代码
            
            // Apply tier filter
            if (tierFilter) {
                crops = crops.filter(crop => (crop.tier || crop.rarity) === tierFilter);
            }
            
            // Apply harvest type filter
            if (harvestFilter) {
                if (harvestFilter === 'single') {
                    crops = crops.filter(crop => !crop.multiHarvest);
                } else if (harvestFilter === 'multi') {
                    crops = crops.filter(crop => crop.multiHarvest);
                }
            }
            
            // Apply sorting
            crops = this.sortCropsArray(crops, sortFilter);
            
            // Re-render table with filtered crops
            this.renderCropsTable(crops);
            
            // Update statistics
            this.updateCropsStatistics(crops);
            
            // Show/hide empty state
            const emptyState = document.getElementById('empty-state');
            if (crops.length === 0) {
                emptyState.style.display = 'block';
            } else {
                emptyState.style.display = 'none';
            }
        } catch (error) {
            console.error('❌ Error applying crops filters:', error);
        }
    }
    
    /**
     * Show crop details
     * @param {string} cropId - Crop ID
     */
    showCropDetails(cropId) {
        console.log(`🔍 Showing details for crop: ${cropId}`);
        
        const crop = this.dataManager.getCropById(cropId);
        if (!crop) {
            console.error(`❌ Crop not found: ${cropId}`);
            if (window.uiManager) {
                window.uiManager.showNotification('Crop not found', 'error');
            }
            return;
        }
        
        // 打开模态框
        const modal = document.getElementById('crop-detail-modal');
        if (!modal) {
            console.error('❌ Crop detail modal not found');
            return;
        }
        
        // 设置模态框内容
        document.getElementById('modal-crop-name').textContent = crop.name;
        // 设置作物ID到data-crop-id属性
        document.getElementById('modal-crop-name').dataset.cropId = cropId;
        
        document.getElementById('modal-crop-icon').textContent = crop.icon || '🌱';
        document.getElementById('modal-crop-rarity').textContent = crop.rarity;
        document.getElementById('modal-crop-rarity').className = `badge rarity ${crop.rarity.toLowerCase()}`;
        document.getElementById('modal-crop-harvest').textContent = crop.multiHarvest ? 'Multi Harvest' : 'Single Harvest';
        
        // 设置基本信息
        document.getElementById('modal-crop-category').textContent = crop.category || '-';
        document.getElementById('modal-crop-rarity-text').textContent = crop.rarity || '-';
        document.getElementById('modal-crop-harvest-text').textContent = crop.multiHarvest ? 'Multi Harvest' : 'Single Harvest';
        
        // 设置价值信息
        document.getElementById('modal-crop-buy').textContent = `💰 ${crop.buyPrice}`;
        document.getElementById('modal-crop-sell').textContent = `💰 ${crop.sellValue}`;
        
        const profit = crop.sellValue - crop.buyPrice;
        document.getElementById('modal-crop-profit').textContent = `💰 ${profit}`;
        
        const roi = crop.buyPrice > 0 ? (profit / crop.buyPrice * 100).toFixed(2) + '%' : 'N/A';
        document.getElementById('modal-crop-roi').textContent = roi;
        
        // 设置变异预览值
        const goldenValue = crop.sellValue * 20;
        const rainbowValue = crop.sellValue * 50;
        const wetValue = crop.sellValue * 2;
        const chilledValue = crop.sellValue * 2;
        
        document.getElementById('modal-golden-value').textContent = `💰 ${goldenValue}`;
        document.getElementById('modal-rainbow-value').textContent = `💰 ${rainbowValue}`;
        document.getElementById('modal-wet-value').textContent = `💰 ${wetValue}`;
        document.getElementById('modal-chilled-value').textContent = `💰 ${chilledValue}`;
        
        // 设置描述
        document.getElementById('modal-crop-description').textContent = crop.description || 'No description available.';
        
        // 显示模态框
        modal.style.display = 'flex';
        
        // 设置关闭按钮事件
        document.getElementById('modal-close').onclick = function() {
            modal.style.display = 'none';
        };
        
        document.getElementById('modal-close-btn').onclick = function() {
            modal.style.display = 'none';
        };
        
        // 点击模态框外部关闭
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }
    
    /**
     * Calculate crop
     * @param {string} cropId - Crop ID
     */
    calculateCrop(cropId) {
        console.log(`🧮 Calculating crop: ${cropId}`);
        
        // 重定向到首页计算器模块
        window.location.href = `index.html#calculator-module?crop=${cropId}`;
    }

    /**
     * Render crop grid
     */
    async renderCropGrid() {
        const cropGrid = document.getElementById('crop-grid');
        if (!cropGrid) return;

        try {
            // Get crops data
            const crops = this.dataManager.getCrops();
            
            if (crops.length === 0) {
                cropGrid.innerHTML = `
                    <div class="empty-state">
                        <span class="empty-icon">🌱</span>
                        <p>No crops available</p>
                    </div>
                `;
                return;
            }

            // Render crops
            const cropElements = crops.map(crop => this.createCropElement(crop));
            cropGrid.innerHTML = cropElements.join('');
            
            // Add click event listeners
            cropGrid.addEventListener('click', (event) => {
                const cropElement = event.target.closest('.crop-item');
                if (cropElement) {
                    this.selectCrop(cropElement.dataset.cropId);
                }
            });
            
            console.log(`✅ Rendered ${crops.length} crops`);
        } catch (error) {
            console.error('❌ Failed to render crop grid:', error);
            cropGrid.innerHTML = `
                <div class="error-state">
                    <span class="error-icon">❌</span>
                    <p>Failed to load crops</p>
                </div>
            `;
        }
    }

    /**
     * Create crop element HTML
     */
    createCropElement(crop) {
        const rarityColors = {
            'Common': '#9CA3AF',
            'Uncommon': '#10B981',
            'Rare': '#3B82F6',
            'Epic': '#8B5CF6',
            'Legendary': '#F59E0B',
            'Mythical': '#EC4899',
            'Divine': '#EF4444'
        };

        const rarityColor = rarityColors[crop.rarity] || '#9CA3AF';
        
        return `
            <div class="crop-item" data-crop-id="${crop.id}" data-rarity="${crop.rarity}">
                <div class="crop-icon" style="background-color: ${rarityColor}20; border-color: ${rarityColor};">
                    ${crop.icon}
                </div>
                <div class="crop-info">
                    <div class="crop-name">${crop.name}</div>
                    <div class="crop-rarity" style="color: ${rarityColor};">${crop.rarity}</div>
                    <div class="crop-price">💰 ${crop.sellValue}</div>
                </div>
            </div>
        `;
    }

    /**
     * Render hero crop grid (compact version)
     */
    async renderHeroCropGrid() {
        const cropGrid = document.getElementById('hero-crop-grid');
        if (!cropGrid) {
            console.error('❌ Hero crop grid element not found');
            // Try to find the element with different selectors
            const alternativeElements = {
                '.crop-grid-compact': document.querySelector('.crop-grid-compact'),
                '[id*="crop"]': document.querySelector('[id*="crop"]'),
                '.calculator-module .crop-grid-compact': document.querySelector('.calculator-module .crop-grid-compact')
            };
            console.log('🔍 Alternative element search:', alternativeElements);
            return;
        }

        try {
            console.log('🎨 Rendering hero crop grid...');
            
            // Check element visibility
            const styles = window.getComputedStyle(cropGrid);
            console.log('🎨 Crop grid styles:', {
                display: styles.display,
                visibility: styles.visibility,
                opacity: styles.opacity,
                width: styles.width,
                height: styles.height
            });
            
            // Get crops data
            const crops = this.dataManager.getCrops();
            console.log(`📊 Retrieved ${crops.length} crops from data manager`);
            
            if (crops.length === 0) {
                console.warn('⚠️ No crops data available');
                cropGrid.innerHTML = `
                    <div class="empty-state">
                        <span class="empty-icon">🌱</span>
                        <p>No crops available</p>
                    </div>
                `;
                return;
            }

            // Log first crop for debugging
            console.log('🔍 First crop data:', crops[0]);

            // Render crops (compact version)
            const cropElements = crops.map(crop => this.createHeroCropElement(crop));
            const combinedHTML = cropElements.join('');
            console.log('🔍 Generated HTML length:', combinedHTML.length);
            console.log('🔍 First crop HTML sample:', cropElements[0]);
            
            cropGrid.innerHTML = combinedHTML;
            
            // Verify the content was added
            console.log('🔍 Crop grid children after render:', cropGrid.children.length);
            
            // Add click event listeners
            cropGrid.addEventListener('click', (event) => {
                const cropElement = event.target.closest('.crop-item-compact');
                if (cropElement) {
                    this.selectHeroCrop(cropElement.dataset.cropId);
                }
            });
            
            console.log(`✅ Rendered ${crops.length} hero crops successfully`);
        } catch (error) {
            console.error('❌ Failed to render hero crop grid:', error);
            cropGrid.innerHTML = `
                <div class="error-state">
                    <span class="error-icon">❌</span>
                    <p>Failed to load crops: ${error.message}</p>
                </div>
            `;
        }
    }

    /**
     * Create hero crop element HTML (compact version)
     */
    createHeroCropElement(crop) {
        if (!crop) {
            console.error('❌ Crop data is null or undefined');
            return '<div class="crop-item-compact error">Invalid crop data</div>';
        }

        // 使用正确的字段映射，严格按照crops(new).json数据结构
        const rarity = crop.tier || crop.rarity || 'Common'; // 优先使用tier（来自crops(new).json）
        const rarityClass = `rarity-${rarity.toLowerCase()}`;
        
        // 显示最小价值作为主要价格指标（这是作物的实际价值）
        const minValue = crop.minimum_value || crop.sellValue || 0;
        const buyPrice = crop.sheckle_price || crop.buyPrice || 0;
        
        // 显示格式：最小价值（这是玩家关心的收益值）
        const displayPrice = minValue > 0 ? `💰 ${this.formatNumber(minValue)}` : 'N/A';
        
        // Debug log for first few crops
        if (crop.id === 'carrot' || crop.id === 'strawberry') {
            console.log(`🔍 Creating crop element for ${crop.name}:`, {
                id: crop.id,
                name: crop.name,
                tier: crop.tier,
                rarity: crop.rarity,
                finalRarity: rarity,
                minimum_value: crop.minimum_value,
                sheckle_price: crop.sheckle_price,
                sellValue: crop.sellValue,
                buyPrice: crop.buyPrice,
                displayPrice: displayPrice,
                icon: crop.icon,
                rarityClass: rarityClass
            });
        }
        
        return `
            <div class="crop-item-compact ${rarityClass}" data-crop-id="${crop.id}" data-rarity="${rarity.toLowerCase()}">
                <div class="crop-icon">${crop.icon}</div>
                <div class="crop-name">${crop.name}</div>
                <div class="crop-price">${displayPrice}</div>
                <div class="crop-rarity">${rarity}</div>
            </div>
        `;
    }

    /**
     * Render crops page content
     */
    async renderCropsPage() {
        try {
            // Ensure data manager is initialized
            if (!this.dataManager || !this.dataManager.isInitialized()) {
                console.log('⏳ Waiting for data manager to initialize...');
                await this.dataManager.init();
            }
            
            // Get crops data
            const crops = this.dataManager.getCrops();
            console.log(`📊 Found ${crops.length} crops for crops page`);
            
            if (crops.length === 0) {
                console.error('❌ No crops data available for crops page');
                return;
            }
            
            // Setup filter options after data is loaded
            this.setupFilterOptions();
            
            // Render crops in table view only
            await this.renderCropsTable(crops);
            
            // Update statistics
            this.updateCropsStatistics(crops);
            
            console.log('✅ Crops page rendered successfully');
        } catch (error) {
            console.error('❌ Failed to render crops page:', error);
            throw error;
        }
    }

    // Grid and list view rendering removed - only table view supported

    /**
     * Render crops in table view
     */
    async renderCropsTable(crops) {
        const cropsTableBody = document.getElementById('crops-table-body');
        if (!cropsTableBody) {
            console.warn('⚠️ Crops table body element not found');
            return;
        }
        
        try {
            const tableRows = crops.map(crop => this.createCropsTableRow(crop));
            cropsTableBody.innerHTML = tableRows.join('');
            
            console.log(`✅ Rendered ${crops.length} crops in table view`);
        } catch (error) {
            console.error('❌ Failed to render crops table:', error);
        }
    }

    // Crop card and list element creation removed - only table view supported

    /**
     * Create table row for crops
     */
    createCropsTableRow(crop) {
        const multiHarvest = crop.multiHarvest ? 'Yes' : 'No';
        const obtainable = crop.obtainable ? 'Yes' : 'No';
        
        return `
            <tr data-crop-id="${crop.id}" data-rarity="${crop.tier || crop.rarity}" data-category="${crop.category}" data-harvest="${multiHarvest}" onclick="app.showCropDetails('${crop.id}')" style="cursor: pointer;">
                <td>
                    <div class="crop-cell">
                        <span class="crop-icon small">${crop.icon}</span>
                        <span class="crop-name">${crop.name}</span>
                    </div>
                </td>
                <td>${crop.category}</td>
                <td>
                    <span class="badge rarity">${crop.tier || crop.rarity}</span>
                </td>
                <td>💰 ${crop.sheckle_price || crop.buyPrice || 'N/A'}</td>
                <td>💎 ${crop.robux_price || 'N/A'}</td>
                <td>💰 ${crop.minimum_value || crop.sellValue || 'N/A'}</td>
                <td>${multiHarvest}</td>
                <td>${obtainable}</td>
            </tr>
        `;
    }

    /**
     * Update crops statistics
     */
    updateCropsStatistics(crops) {
        const filterResults = document.getElementById('filter-results');
        const totalCrops = document.getElementById('total-crops');
        
        if (filterResults) {
            filterResults.textContent = `Showing ${crops.length} results`;
        }
        
        if (totalCrops) {
            totalCrops.textContent = `Total ${crops.length} crops`;
        }
    }

    /**
     * Select crop
     */
    selectCrop(cropId) {
        try {
            // Remove previous selection
            document.querySelectorAll('.crop-item').forEach(item => {
                item.classList.remove('selected');
            });
            
            // Select new crop
            const selectedElement = document.querySelector(`[data-crop-id="${cropId}"]`);
            if (selectedElement) {
                selectedElement.classList.add('selected');
            }
            
            // Update result display
            this.updateCalculation(cropId);
            
            console.log(`🎯 Selected crop: ${cropId}`);
        } catch (error) {
            console.error('❌ Failed to select crop:', error);
        }
    }

    /**
     * Select crop in hero calculator
     */
    selectHeroCrop(cropId) {
        // Clear previous selection
        document.querySelectorAll('.crop-item-compact').forEach(item => {
            item.classList.remove('selected');
        });

        // Select new crop
        const cropElement = document.querySelector(`[data-crop-id="${cropId}"]`);
        if (cropElement) {
            cropElement.classList.add('selected');
        }

        // Get crop data and auto-update weight parameter
        const crop = this.dataManager.getCropById(cropId);
        if (crop && crop.basic_weight) {
            const weightInput = document.getElementById('hero-weight');
            if (weightInput) {
                // Convert basic_weight from string to number and set it
                // Handle special cases like "-" or invalid values
                let basicWeight;
                if (crop.basic_weight === "-" || crop.basic_weight === "" || crop.basic_weight === null) {
                    // Use default weight for crops without specified basic_weight
                    basicWeight = 2.85;
                    console.log(`🔧 Using default weight for ${crop.name}: ${basicWeight}kg (basic_weight was "${crop.basic_weight}")`);
                } else {
                    basicWeight = parseFloat(crop.basic_weight);
                    if (isNaN(basicWeight)) {
                        // Fallback to default if parsing fails
                        basicWeight = 2.85;
                        console.log(`🔧 Using fallback weight for ${crop.name}: ${basicWeight}kg (could not parse "${crop.basic_weight}")`);
                    } else {
                        console.log(`🔧 Auto-updated weight for ${crop.name}: ${basicWeight}kg`);
                    }
                }
                weightInput.value = basicWeight;
            }
        }

        // Check if Max Mutation is enabled and apply combination if needed
        const maxMutationToggle = document.getElementById('hero-max-mutation');
        if (maxMutationToggle && maxMutationToggle.checked) {
            this.applyMaxMutationCombination(crop);
        }

        // Update calculation
        this.updateHeroCalculation(cropId);
    }

    /**
     * Update calculation
     */
    updateCalculation(cropId) {
        const crop = this.dataManager.getCropById(cropId);
        if (!crop) return;

        // Get current mutations
        const mutations = this.getCurrentMutations();
        
        // Calculate
        const result = this.calculator.calculateCropValue(crop, mutations);
        
        // Update display
        this.updateResultDisplay(result);
    }

    /**
     * Update hero calculation
     */
    updateHeroCalculation(cropId) {
        const crop = this.dataManager.getCropById(cropId);
        if (!crop) return;

        // Get Max Mutation state
        const maxMutationToggle = document.getElementById('hero-max-mutation');
        const maxMutation = maxMutationToggle ? maxMutationToggle.checked : false;

        // Get current mutations (will be ignored if maxMutation is true)
        const mutations = this.getHeroMutations();
        
        // Get parameters from UI
        const weightInput = document.getElementById('hero-weight');
        const quantityInput = document.getElementById('hero-quantity');
        const friendBoostInput = document.getElementById('hero-friend-boost-input');
        
        const weight = weightInput ? parseFloat(weightInput.value) || null : null;
        const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
        const friendBoost = friendBoostInput ? parseInt(friendBoostInput.value) || 0 : 0;
        
        // Use crop's base weight if available
        const baseWeight = crop.base_weight || 2.85; // Default base weight from UI
        
        // Calculate with Max Mutation support
        const result = this.calculator.calculateCropValue(crop, mutations, quantity, weight, baseWeight, friendBoost, maxMutation);
        
        // Update display
        this.updateHeroResultDisplay(result);
    }

    /**
     * Get current mutations from UI
     */
    getCurrentMutations() {
        const mutations = {
            growth: 'normal',
            environmental: []
        };

        // Get growth mutation
        const selectedGrowth = document.querySelector('#growth-mutations .mutation-option.active');
        if (selectedGrowth) {
            mutations.growth = selectedGrowth.dataset.mutation;
        }

        // Get environmental mutations
        const selectedEnv = document.querySelectorAll('#environmental-mutations .mutation-option.active');
        selectedEnv.forEach(env => {
            mutations.environmental.push(env.dataset.mutation);
        });

        return mutations;
    }

    /**
     * Get current mutations from hero calculator
     * Note: In Max Mutation mode, these mutations will be ignored by the calculator
     */
    getHeroMutations() {
        const mutations = {
            growth: 'normal',
            environmental: []
        };

        // Check if Max Mutation is enabled
        const maxMutationToggle = document.getElementById('hero-max-mutation');
        const maxMutation = maxMutationToggle ? maxMutationToggle.checked : false;
        
        // In Max Mutation mode, return preset combinations (though they'll be ignored in calculation)
        if (maxMutation) {
            const selectedCrop = document.querySelector('.crop-item-compact.selected');
            if (selectedCrop) {
                const cropId = selectedCrop.dataset.cropId;
                const crop = this.dataManager.getCropById(cropId);
                const combination = this.calculator.getMaxMutationCombination(crop);
                if (combination) {
                    console.log('🌟 Max Mutation mode: returning preset combination');
                    return combination.mutations;
                }
            }
        }

        // Normal mode: get mutations from UI
        // Get selected growth mutation
        const growthMutation = document.querySelector('#hero-growth-mutations .mutation-option-compact.active');
        if (growthMutation) {
            mutations.growth = growthMutation.dataset.mutation;
        }

        // 🔧 修复：收集Temperature Mutations
        const temperatureMutations = document.querySelectorAll('#hero-temperature-mutations .mutation-option-compact.active');
        temperatureMutations.forEach(mutation => {
            const mutationId = mutation.dataset.mutation;
            // 跳过normal_temp
            if (mutationId && mutationId !== 'normal_temp') {
                mutations.environmental.push(mutationId);
            }
        });

        // Get selected environmental mutations
        const environmentalMutations = document.querySelectorAll('#hero-environmental-mutations .mutation-option-compact.active');
        environmentalMutations.forEach(mutation => {
            mutations.environmental.push(mutation.dataset.mutation);
        });

        // 🔍 调试输出：显示收集到的mutations
        console.log('🧬 Collected mutations:', {
            maxMutation: maxMutation,
            growth: mutations.growth,
            environmental: mutations.environmental,
            total_environmental_count: mutations.environmental.length
        });

        return mutations;
    }

    /**
     * Update result display
     */
    updateResultDisplay(result) {
        const crop = result.crop;
        const calc = result.calculation;

        // Update crop info
        const cropIcon = document.getElementById('result-crop-icon');
        const cropName = document.getElementById('result-crop-name');
        const cropRarity = document.getElementById('result-crop-rarity');
        
        if (cropIcon) cropIcon.textContent = crop.icon;
        if (cropName) cropName.textContent = crop.name;
        if (cropRarity) cropRarity.textContent = crop.rarity;

        // Update calculation values
        const baseValue = document.getElementById('base-value');
        const growthMultiplier = document.getElementById('growth-multiplier');
        const environmentalBonus = document.getElementById('environmental-bonus');
        const finalValue = document.getElementById('final-value');
        const profitValue = document.getElementById('profit-value');
        const roiValue = document.getElementById('roi-value');

        if (baseValue) baseValue.textContent = calc.baseValue;
        if (growthMultiplier) growthMultiplier.textContent = `×${calc.mutationMultiplier}`;
        if (environmentalBonus) environmentalBonus.textContent = `+${calc.mutationBonus}×`;
        if (finalValue) finalValue.textContent = calc.finalValue;
        if (profitValue) profitValue.textContent = calc.totalProfit;
        if (roiValue) roiValue.textContent = `${calc.roi.toFixed(1)}%`;
    }

    /**
     * Update hero result display with new calculation structure
     */
    updateHeroResultDisplay(result) {
        const crop = result.crop;
        const calc = result.calculation;

        // Get result display container
        const resultDisplay = document.getElementById('hero-result-display');
        
        // Check if Max Mutation is active
        const isMaxMutation = result.maxMutation || false;
        
        // Apply or remove Max Mutation styling
        if (resultDisplay) {
            if (isMaxMutation) {
                resultDisplay.classList.add('max-mutation-active');
            } else {
                resultDisplay.classList.remove('max-mutation-active');
            }
        }

        // Update crop info
        const cropIcon = document.getElementById('hero-result-crop-icon');
        const cropName = document.getElementById('hero-result-crop-name');
        const cropRarity = document.getElementById('hero-result-crop-rarity');
        
        if (cropIcon) cropIcon.textContent = crop.icon;
        if (cropName) cropName.textContent = crop.name;
        if (cropRarity) cropRarity.textContent = crop.rarity || crop.tier;

        // Update calculation values using new structure
        const baseValue = document.getElementById('hero-base-value');
        const multiplier = document.getElementById('hero-multiplier');
        const finalValue = document.getElementById('hero-final-value');
        
        if (baseValue) baseValue.textContent = this.formatNumber(calc.baseValue);
        if (multiplier) {
            // Show the total multiplier from new calculation
            multiplier.textContent = `×${calc.totalMultiplier.toFixed(2)}`;
            
            // Apply special styling for Max Mutation multiplier
            if (isMaxMutation) {
                multiplier.classList.add('max-mutation-multiplier');
            } else {
                multiplier.classList.remove('max-mutation-multiplier');
            }
        }
        if (finalValue) finalValue.textContent = this.formatNumber(calc.finalValue);
        
        // Update additional information if elements exist
        const growthMultiplier = document.getElementById('hero-growth-multiplier');
        const envFactor = document.getElementById('hero-env-factor');
        const weightFactor = document.getElementById('hero-weight-factor');
        
        if (growthMultiplier) growthMultiplier.textContent = `×${calc.growthMultiplier}`;
        if (envFactor) envFactor.textContent = `×${calc.environmentalFactor.toFixed(2)}`;
        if (weightFactor) weightFactor.textContent = `×${calc.weightFactor.toFixed(3)}`;
        
        // Log calculation details for debugging
        console.log('🔢 Calculation Details:', {
            baseValue: calc.baseValue,
            growthMultiplier: calc.growthMultiplier,
            environmentalFactor: calc.environmentalFactor,
            weightFactor: calc.weightFactor,
            totalMultiplier: calc.totalMultiplier,
            finalValue: calc.finalValue,
            maxMutation: isMaxMutation,
            formula: calc.formula
        });
        
        // 刷新历史记录
        this.renderHeroHistoryList();
    }

    /**
     * Format large numbers for display
     * @param {number} num - Number to format
     * @returns {string} Formatted number string
     */
    formatNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        } else {
            return num.toLocaleString();
        }
    }

    /**
     * Setup calculator interactions
     */
    setupCalculatorInteractions() {
        // Setup search functionality
        const searchInput = document.getElementById('crop-search');
        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                this.filterCrops(event.target.value);
            });
        }

        // Setup mutation selections
        this.setupMutationSelection('#growth-mutations', 'single');
        this.setupMutationSelection('#environmental-mutations', 'multiple');

        // Setup action buttons
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetCalculator());
        }
    }

    /**
     * Setup hero calculator interactions
     */
    setupHeroCalculatorInteractions() {
        // Setup search functionality
        const searchInput = document.getElementById('hero-crop-search');
        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                this.filterHeroCrops(event.target.value);
            });
        }

        // Setup category filtering
        this.setupCategoryFiltering();

        // Setup mutation selections
        this.setupHeroMutationSelection('#hero-growth-mutations', 'single');
        this.setupHeroMutationSelection('#hero-temperature-mutations', 'single');
        this.setupHeroMutationSelection('#hero-environmental-mutations', 'multiple');

        // Setup parameter inputs (with delay to ensure DOM is ready)
        setTimeout(() => {
            console.log('🔧 Setting up parameter inputs...');
            this.setupParameterInputs();
        }, 200);

        // Setup action buttons
        const calculateBtn = document.getElementById('hero-calculate-btn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.recalculateHero());
        }

        const resetBtn = document.getElementById('hero-reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetHeroCalculator());
        }
    }

    /**
     * Filter crops based on search
     */
    filterCrops(query) {
        const crops = this.dataManager.searchCrops(query);
        const cropGrid = document.getElementById('crop-grid');
        if (!cropGrid) return;

        const cropElements = crops.map(crop => this.createCropElement(crop));
        cropGrid.innerHTML = cropElements.join('');
    }

    /**
     * Filter hero crops based on search query
     */
    filterHeroCrops(query) {
        const crops = document.querySelectorAll('.crop-item-compact');
        const searchTerm = query.toLowerCase();

        // Get current active category
        const activeCategory = document.querySelector('.category-btn.active');
        const currentCategory = activeCategory ? activeCategory.dataset.category : 'all';

        crops.forEach(crop => {
            const name = crop.querySelector('.crop-name').textContent.toLowerCase();
            const rarity = crop.dataset.rarity.toLowerCase();
            
            // Check if matches search
            const matchesSearch = name.includes(searchTerm) || rarity.includes(searchTerm);
            
            // Check if matches category
            const matchesCategory = currentCategory === 'all' || rarity === currentCategory;
            
            if (matchesSearch && matchesCategory) {
                crop.style.display = 'flex';
            } else {
                crop.style.display = 'none';
            }
        });
    }

    /**
     * Setup mutation selection
     */
    setupMutationSelection(selector, mode) {
        const container = document.querySelector(selector);
        if (!container) return;

        container.addEventListener('click', (event) => {
            const option = event.target.closest('.mutation-option');
            if (!option) return;

            if (mode === 'single') {
                // Single selection mode
                container.querySelectorAll('.mutation-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                option.classList.add('active');
            } else {
                // Multiple selection mode
                option.classList.toggle('active');
            }

            // Update calculation if crop is selected
            const selectedCrop = document.querySelector('.crop-item.selected');
            if (selectedCrop) {
                this.updateCalculation(selectedCrop.dataset.cropId);
            }
        });
    }

    /**
     * Setup hero mutation selection
     */
    setupHeroMutationSelection(selector, mode) {
        const container = document.querySelector(selector);
        if (!container) return;

        container.addEventListener('click', (event) => {
            const option = event.target.closest('.mutation-option-compact');
            if (!option) return;

            if (mode === 'single') {
                // Single selection mode
                container.querySelectorAll('.mutation-option-compact').forEach(opt => {
                    opt.classList.remove('active');
                });
                option.classList.add('active');
            } else {
                // Multiple selection mode
                option.classList.toggle('active');
            }

            // Auto-update calculation if crop is selected
            const selectedCrop = document.querySelector('.crop-item-compact.selected');
            if (selectedCrop) {
                this.updateHeroCalculation(selectedCrop.dataset.cropId);
            }
        });
    }

    /**
     * Setup category filtering
     */
    setupCategoryFiltering() {
        const categoryContainer = document.getElementById('category-filters');
        if (!categoryContainer) return;

        categoryContainer.addEventListener('click', (event) => {
            const categoryBtn = event.target.closest('.category-btn');
            if (!categoryBtn) return;

            // Update active state
            categoryContainer.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            categoryBtn.classList.add('active');

            // Apply filter
            const category = categoryBtn.dataset.category;
            this.filterCropsByCategory(category);
        });
    }

    /**
     * Setup parameter inputs
     */
    setupParameterInputs() {
        console.log('🔧 setupParameterInputs called');
        // Weight input
        const weightInput = document.getElementById('hero-weight');
        if (weightInput) {
            weightInput.addEventListener('input', () => {
                this.updateHeroCalculationFromParameters();
            });
        }

        // Quantity input
        const quantityInput = document.getElementById('hero-quantity');
        if (quantityInput) {
            quantityInput.addEventListener('input', () => {
                this.updateHeroCalculationFromParameters();
            });
        }

        // Setup Friend Boost with retry mechanism
        this.setupFriendBoostElements();

        // Max Mutation toggle
        const maxMutationToggle = document.getElementById('hero-max-mutation');
        const maxMutationLabel = document.querySelector('.parameter-toggle-label');
        if (maxMutationToggle && maxMutationLabel) {
            maxMutationToggle.addEventListener('change', () => {
                console.log('🔄 Max Mutation toggle changed:', maxMutationToggle.checked);
                maxMutationLabel.textContent = maxMutationToggle.checked ? 'On' : 'Off';
                this.handleMaxMutationToggle(maxMutationToggle.checked);
            });
        }
    }

    /**
     * Setup Friend Boost elements with retry mechanism
     */
    setupFriendBoostElements(retryCount = 0) {
        console.log(`🔧 setupFriendBoostElements called (attempt ${retryCount + 1})`);
        
        const friendBoostSlider = document.getElementById('hero-friend-boost');
        const friendBoostInput = document.getElementById('hero-friend-boost-input');
        
        console.log('🔍 Friend Boost Debug:', {
            slider: !!friendBoostSlider,
            input: !!friendBoostInput,
            sliderValue: friendBoostSlider?.value,
            inputValue: friendBoostInput?.value,
            attempt: retryCount + 1
        });
        
        if (friendBoostSlider && friendBoostInput) {
            console.log('✅ Friend Boost elements found, setting up events...');
            
            // Remove any existing listeners to prevent duplicates
            friendBoostSlider.removeEventListener('input', this._friendBoostSliderHandler);
            friendBoostInput.removeEventListener('input', this._friendBoostInputHandler);
            friendBoostInput.removeEventListener('blur', this._friendBoostBlurHandler);
            
            // Helper function to sync values and ensure they are multiples of 10
            const syncFriendBoost = (value, source = 'unknown') => {
                console.log(`🔄 syncFriendBoost called: value=${value}, source=${source}`);
                
                // Ensure value is a multiple of 10 between 0 and 100
                const originalValue = value;
                value = Math.max(0, Math.min(100, Math.round(value / 10) * 10));
                
                console.log(`📊 Value normalized: ${originalValue} → ${value}`);
                
                // Update both elements
                friendBoostSlider.value = value;
                friendBoostInput.value = value;
                
                console.log(`✅ Updated elements: slider=${friendBoostSlider.value}, input=${friendBoostInput.value}`);
                
                // Trigger calculation update
                this.updateHeroCalculationFromParameters();
                return value;
            };

            // Store handlers for cleanup
            this._friendBoostSliderHandler = (event) => {
                console.log('🎚️ Slider input event:', event.target.value);
                syncFriendBoost(parseInt(event.target.value) || 0, 'slider');
            };

            this._friendBoostInputHandler = (event) => {
                console.log('⌨️ Input field input event:', event.target.value);
                syncFriendBoost(parseInt(event.target.value) || 0, 'input');
            };

            this._friendBoostBlurHandler = (event) => {
                console.log('👁️ Input field blur event:', event.target.value);
                syncFriendBoost(parseInt(event.target.value) || 0, 'input-blur');
            };

            // Add event listeners
            friendBoostSlider.addEventListener('input', this._friendBoostSliderHandler);
            friendBoostInput.addEventListener('input', this._friendBoostInputHandler);
            friendBoostInput.addEventListener('blur', this._friendBoostBlurHandler);

            // Keyboard events for input field
            friendBoostInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    console.log('⏎ Enter key pressed on input field');
                    e.target.blur();
                }
            });
            
            // Test initial sync
            setTimeout(() => {
                console.log('🧪 Testing initial sync...');
                syncFriendBoost(0, 'initial');
            }, 100);
            
            console.log('✅ Friend Boost event listeners added successfully');
        } else {
            console.error('❌ Friend Boost elements not found:', {
                slider: friendBoostSlider,
                input: friendBoostInput,
                attempt: retryCount + 1
            });
            
            // Retry up to 3 times
            if (retryCount < 3) {
                setTimeout(() => {
                    console.log(`🔄 Retrying Friend Boost setup (attempt ${retryCount + 2})`);
                    this.setupFriendBoostElements(retryCount + 1);
                }, 500);
            } else {
                console.error('❌ Failed to setup Friend Boost after 3 attempts');
            }
        }
    }

    /**
     * Handle Max Mutation toggle change
     * @param {boolean} isEnabled - Whether Max Mutation is enabled
     */
    handleMaxMutationToggle(isEnabled) {
        console.log('🔄 Handling Max Mutation toggle:', isEnabled);
        
        // Apply/remove styling to parameter selector
        const parameterSelector = document.querySelector('.parameter-selector-compact');
        if (parameterSelector) {
            if (isEnabled) {
                parameterSelector.classList.add('max-mutation-active');
            } else {
                parameterSelector.classList.remove('max-mutation-active');
            }
        }
        
        if (isEnabled) {
            // Get currently selected crop
            const selectedCrop = document.querySelector('.crop-item-compact.selected');
            if (selectedCrop) {
                const cropId = selectedCrop.dataset.cropId;
                const crop = this.dataManager.getCropById(cropId);
                this.applyMaxMutationCombination(crop);
            }
        } else {
            // Reset to normal mutation selection
            this.resetMutationSelection();
        }
        
        // Update calculation
        this.updateHeroCalculationFromParameters();
    }

    /**
     * Apply max mutation combination for crop
     * @param {Object} crop - Crop object
     */
    applyMaxMutationCombination(crop) {
        if (!crop) return;
        
        // Get max mutation combination
        const combination = this.calculator.getMaxMutationCombination(crop);
        if (!combination) return;
        
        console.log('🌟 Applying max mutation combination for', crop.name, combination);
        
        // Apply growth mutation
        this.selectGrowthMutation(combination.mutations.growth);
        
        // Apply environmental mutations
        this.selectEnvironmentalMutations(combination.mutations.environmental);
    }

    /**
     * Select growth mutation in UI
     * @param {string} mutationId - Mutation ID
     */
    selectGrowthMutation(mutationId) {
        // Clear all growth mutation selections and auto-selected classes
        document.querySelectorAll('#hero-growth-mutations .mutation-option-compact').forEach(opt => {
            opt.classList.remove('active', 'auto-selected');
        });
        
        // Check if Max Mutation is enabled
        const maxMutationToggle = document.getElementById('hero-max-mutation');
        const isMaxMutation = maxMutationToggle ? maxMutationToggle.checked : false;
        
        // Select the specified mutation
        const mutationElement = document.querySelector(`#hero-growth-mutations .mutation-option-compact[data-mutation="${mutationId}"]`);
        if (mutationElement) {
            mutationElement.classList.add('active');
            
            // Add auto-selected class for Max Mutation mode
            if (isMaxMutation) {
                mutationElement.classList.add('auto-selected');
            }
            
            console.log('✅ Selected growth mutation:', mutationId, isMaxMutation ? '(auto-selected)' : '');
        } else {
            console.warn('⚠️ Growth mutation element not found:', mutationId);
        }
    }

    /**
     * Select environmental mutations in UI
     * @param {Array} mutationIds - Array of mutation IDs
     */
    selectEnvironmentalMutations(mutationIds) {
        // Clear all environmental mutation selections and auto-selected classes
        document.querySelectorAll('#hero-environmental-mutations .mutation-option-compact').forEach(opt => {
            opt.classList.remove('active', 'auto-selected');
        });
        
        // Clear temperature mutations too
        document.querySelectorAll('#hero-temperature-mutations .mutation-option-compact').forEach(opt => {
            opt.classList.remove('active', 'auto-selected');
        });
        
        // Check if Max Mutation is enabled
        const maxMutationToggle = document.getElementById('hero-max-mutation');
        const isMaxMutation = maxMutationToggle ? maxMutationToggle.checked : false;
        
        // Select specified mutations
        mutationIds.forEach(mutationId => {
            // Try environmental mutations first
            let mutationElement = document.querySelector(`#hero-environmental-mutations .mutation-option-compact[data-mutation="${mutationId}"]`);
            
            // If not found, try temperature mutations
            if (!mutationElement) {
                mutationElement = document.querySelector(`#hero-temperature-mutations .mutation-option-compact[data-mutation="${mutationId}"]`);
            }
            
            if (mutationElement) {
                mutationElement.classList.add('active');
                
                // Add auto-selected class for Max Mutation mode
                if (isMaxMutation) {
                    mutationElement.classList.add('auto-selected');
                }
                
                console.log('✅ Selected mutation:', mutationId, isMaxMutation ? '(auto-selected)' : '');
            } else {
                console.warn('⚠️ Mutation element not found:', mutationId);
            }
        });
    }

    /**
     * Reset mutation selection to normal state
     */
    resetMutationSelection() {
        console.log('🔄 Resetting mutation selection to normal state');
        
        // Reset growth mutations to normal
        document.querySelectorAll('#hero-growth-mutations .mutation-option-compact').forEach(opt => {
            opt.classList.remove('active', 'auto-selected');
        });
        document.querySelector('#hero-growth-mutations .mutation-option-compact[data-mutation="normal"]')?.classList.add('active');
        
        // Reset temperature mutations to normal
        document.querySelectorAll('#hero-temperature-mutations .mutation-option-compact').forEach(opt => {
            opt.classList.remove('active', 'auto-selected');
        });
        document.querySelector('#hero-temperature-mutations .mutation-option-compact[data-mutation="normal_temp"]')?.classList.add('active');
        
        // Reset environmental mutations (clear all)
        document.querySelectorAll('#hero-environmental-mutations .mutation-option-compact').forEach(opt => {
            opt.classList.remove('active', 'auto-selected');
        });
    }

    /**
     * Update hero calculation from parameters
     */
    updateHeroCalculationFromParameters() {
        const selectedCrop = document.querySelector('.crop-item-compact.selected');
        if (selectedCrop) {
            this.updateHeroCalculation(selectedCrop.dataset.cropId);
        }
    }

    /**
     * Filter crops by category
     */
    filterCropsByCategory(category) {
        const crops = document.querySelectorAll('.crop-item-compact');
        
        crops.forEach(crop => {
            const cropRarity = crop.dataset.rarity;
            
            if (category === 'all' || cropRarity === category) {
                crop.style.display = 'flex';
            } else {
                crop.style.display = 'none';
            }
        });
    }

    /**
     * Reset calculator
     */
    resetCalculator() {
        // Clear crop selection
        document.querySelectorAll('.crop-item').forEach(item => {
            item.classList.remove('selected');
        });

        // Reset mutations
        document.querySelectorAll('#growth-mutations .mutation-option').forEach(opt => {
            opt.classList.remove('active');
        });
        document.querySelector('#growth-mutations .mutation-option[data-mutation="normal"]')?.classList.add('active');

        document.querySelectorAll('#environmental-mutations .mutation-option').forEach(opt => {
            opt.classList.remove('active');
        });

        // Clear search
        const searchInput = document.getElementById('crop-search');
        if (searchInput) {
            searchInput.value = '';
            this.filterCrops('');
        }

        // Reset result display
        const resultDisplay = document.getElementById('result-display');
        if (resultDisplay) {
            document.getElementById('result-crop-icon').textContent = '🥕';
            document.getElementById('result-crop-name').textContent = 'Please select a crop';
            document.getElementById('result-crop-rarity').textContent = '-';
            document.getElementById('base-value').textContent = '0';
            document.getElementById('growth-multiplier').textContent = '×1';
            document.getElementById('environmental-bonus').textContent = '+0×';
            document.getElementById('final-value').textContent = '0';
            document.getElementById('profit-value').textContent = '0';
            document.getElementById('roi-value').textContent = '0%';
        }

        console.log('🔄 Calculator reset');
    }

    /**
     * Recalculate hero results
     */
    recalculateHero() {
        const selectedCrop = document.querySelector('.crop-item-compact.selected');
        if (selectedCrop) {
            this.updateHeroCalculation(selectedCrop.dataset.cropId);
        }
    }

    /**
     * Reset hero calculator
     */
    resetHeroCalculator() {
        console.log('🔄 Starting hero calculator reset...');
        
        // Clear crop selection
        document.querySelectorAll('.crop-item-compact').forEach(item => {
            item.classList.remove('selected');
        });

        // Reset Max Mutation toggle FIRST (before resetting mutations)
        const maxMutationToggle = document.getElementById('hero-max-mutation');
        const maxMutationLabel = document.querySelector('.parameter-toggle-label');
        if (maxMutationToggle && maxMutationLabel) {
            const wasChecked = maxMutationToggle.checked;
            maxMutationToggle.checked = false;
            maxMutationLabel.textContent = 'Off';
            
            // If Max Mutation was previously enabled, trigger the toggle handler to clean up
            if (wasChecked) {
                console.log('🔄 Max Mutation was enabled, triggering cleanup...');
                this.handleMaxMutationToggle(false);
            }
        }

        // Reset growth mutations (clear both active and auto-selected classes)
        document.querySelectorAll('#hero-growth-mutations .mutation-option-compact').forEach(opt => {
            opt.classList.remove('active', 'auto-selected');
        });
        document.querySelector('#hero-growth-mutations .mutation-option-compact[data-mutation="normal"]')?.classList.add('active');

        // Reset temperature mutations (clear both active and auto-selected classes)
        document.querySelectorAll('#hero-temperature-mutations .mutation-option-compact').forEach(opt => {
            opt.classList.remove('active', 'auto-selected');
        });
        document.querySelector('#hero-temperature-mutations .mutation-option-compact[data-mutation="normal_temp"]')?.classList.add('active');

        // Reset environmental mutations (clear both active and auto-selected classes)
        document.querySelectorAll('#hero-environmental-mutations .mutation-option-compact').forEach(opt => {
            opt.classList.remove('active', 'auto-selected');
        });

        // Reset parameters
        const weightInput = document.getElementById('hero-weight');
        if (weightInput) {
            weightInput.value = '2.85';
        }

        const quantityInput = document.getElementById('hero-quantity');
        if (quantityInput) {
            quantityInput.value = '1';
        }

        const friendBoostSlider = document.getElementById('hero-friend-boost');
        const friendBoostInput = document.getElementById('hero-friend-boost-input');
        if (friendBoostSlider && friendBoostInput) {
            friendBoostSlider.value = '0';
            friendBoostInput.value = '0';
        }

        // Clear Max Mutation related styling
        const parameterSelector = document.querySelector('.parameter-selector-compact');
        if (parameterSelector) {
            parameterSelector.classList.remove('max-mutation-active');
        }

        const resultDisplay = document.getElementById('hero-result-display');
        if (resultDisplay) {
            resultDisplay.classList.remove('max-mutation-active');
        }

        // Reset category filter to "All"
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('.category-btn[data-category="all"]')?.classList.add('active');

        // Clear search
        const searchInput = document.getElementById('hero-crop-search');
        if (searchInput) {
            searchInput.value = '';
            this.filterHeroCrops('');
        }

        // Reset result display
        const cropIcon = document.getElementById('hero-result-crop-icon');
        const cropName = document.getElementById('hero-result-crop-name');
        const cropRarity = document.getElementById('hero-result-crop-rarity');
        const baseValue = document.getElementById('hero-base-value');
        const multiplier = document.getElementById('hero-multiplier');
        const finalValue = document.getElementById('hero-final-value');

        if (cropIcon) cropIcon.textContent = '🥕';
        if (cropName) cropName.textContent = 'Select a crop';
        if (cropRarity) cropRarity.textContent = '-';
        if (baseValue) baseValue.textContent = '0';
        if (multiplier) {
            multiplier.textContent = '×1';
            multiplier.classList.remove('max-mutation-multiplier');
        }
        if (finalValue) finalValue.textContent = '0';

        console.log('✅ Hero calculator reset completed');
        // 末尾新增：刷新历史
        this.renderHeroHistoryList();
    }

    /**
     * Check if calculator component is needed
     */
    isCalculatorNeeded() {
        // If page has calculator-related elements, need to initialize calculator
        const hasCalculatorPreview = document.querySelector('.calculator-preview') !== null;
        const hasCropCalculator = document.querySelector('.crop-calculator') !== null;
        const hasCalculatorModule = document.querySelector('.calculator-module') !== null;
        
        console.log('🔍 Checking if calculator is needed:', {
            hasCalculatorPreview,
            hasCropCalculator,
            hasCalculatorModule,
            currentPage: this.state.currentPage
        });
        
        const isNeeded = hasCalculatorPreview || hasCropCalculator || hasCalculatorModule;
        console.log(`🧮 Calculator needed: ${isNeeded}`);
        
        return isNeeded;
    }

    /**
     * Check if hero calculator is present on page
     */
    hasHeroCalculator() {
        const calculatorModule = document.querySelector('.calculator-module');
        const cropGrid = document.getElementById('hero-crop-grid');
        const hasModule = calculatorModule !== null;
        const hasCropGrid = cropGrid !== null;
        
        console.log(`🔍 Checking for hero calculator elements:`, {
            '.calculator-module': hasModule,
            '#hero-crop-grid': hasCropGrid,
            calculatorModuleElement: calculatorModule,
            cropGridElement: cropGrid
        });
        
        if (hasModule && hasCropGrid) {
            console.log('✅ Hero calculator elements found');
            return true;
        } else {
            console.log('❌ Hero calculator elements missing:', {
                missingModule: !hasModule,
                missingCropGrid: !hasCropGrid
            });
            return false;
        }
    }

    /**
     * Initialize UI interactions
     */
    initUI() {
        // Theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.themeManager.toggleTheme();
            });
        }

        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
        }

        // Back to top button
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            this.setupBackToTop(backToTop);
        }

        // Set current page navigation highlight
        this.setActiveNavigation();
        
        // Initialize FAQ functionality
        this.initFAQ();
        
        // Initialize CTA functionality
        this.initCTA();
        
        // Initialize social share functionality
        this.initSocialShare();
        
        // Initialize hero CTA button
        this.initHeroCTA();
    }

    /**
     * Setup back to top functionality
     */
    setupBackToTop(button) {
        // Scroll listener
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
        });

        // Click to return to top
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Set current page navigation highlight
     */
    setActiveNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentPath = this.state.currentPage;
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            const linkPage = href.replace('.html', '').replace('./', '') || 'index';
            
            if (linkPage === currentPath) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Initialize FAQ functionality
     */
    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            // Set all FAQ items to active state by default to show all answers
            item.classList.add('active');
        });
    }

    /**
     * Initialize CTA functionality
     */
    initCTA() {
        const ctaStartBtn = document.getElementById('cta-start-calculating');
        const ctaExploreBtn = document.getElementById('cta-explore-database');
        
        if (ctaStartBtn) {
            ctaStartBtn.addEventListener('click', () => {
                // Scroll to calculator module
                const calculatorModule = document.getElementById('calculator-module');
                if (calculatorModule) {
                    calculatorModule.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    // If on another page, redirect to home page calculator
                    window.location.href = 'index.html#calculator-module';
                }
            });
        }
        
        if (ctaExploreBtn) {
            ctaExploreBtn.addEventListener('click', () => {
                // Navigate to crops page
                window.location.href = 'crops.html';
            });
        }
    }

    /**
     * Initialize social share functionality
     */
    initSocialShare() {
        const socialBtns = document.querySelectorAll('.social-btn');
        
        socialBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = btn.getAttribute('data-platform');
                this.shareToSocial(platform);
            });
        });
    }

    /**
     * Share to social platform
     * @param {string} platform - Social platform name
     */
    shareToSocial(platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent('GAG Calculator - Free Grow A Garden Calculator for Roblox');
        const description = encodeURIComponent('Calculate crop values, mutations, and trading profits with 99.9% accuracy. 106 crops, 43 mutations, instant results!');
        
        let shareUrl = '';
        
        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                break;
            case 'reddit':
                shareUrl = `https://reddit.com/submit?url=${url}&title=${title}`;
                break;
            case 'discord':
                // Discord doesn't have a direct share URL, so we copy to clipboard
                this.copyToClipboard(`${decodeURIComponent(title)} - ${window.location.href}`);
                this.showSocialNotification('Link copied to clipboard! Paste it in Discord.');
                return;
            default:
                console.warn('Unknown social platform:', platform);
                return;
        }
        
        if (shareUrl) {
            // Open share window
            const windowFeatures = 'width=600,height=400,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,directories=no,status=no';
            window.open(shareUrl, 'share', windowFeatures);
        }
    }

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     */
    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
            }
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
        }
    }

    /**
     * Show social share notification
     * @param {string} message - Notification message
     */
    showSocialNotification(message) {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = 'social-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
            animation: slideInUp 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Initialize hero CTA button functionality
     */
    initHeroCTA() {
        const heroCTA = document.querySelector('.hero-cta .btn');
        
        if (heroCTA) {
            heroCTA.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Scroll to calculator module
                const calculatorModule = document.getElementById('calculator-module');
                if (calculatorModule) {
                    calculatorModule.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }

    /**
     * Load user settings
     */
    loadUserSettings() {
        try {
            const savedSettings = localStorage.getItem('garden-pro-settings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                this.state = { ...this.state, ...settings };
                
                // Apply theme settings
                if (this.themeManager && settings.theme) {
                    this.themeManager.setTheme(settings.theme);
                }
            }
        } catch (error) {
            console.warn('⚠️ Failed to load user settings:', error);
        }
    }

    /**
     * Save user settings
     */
    saveUserSettings() {
        try {
            const settings = {
                theme: this.state.theme,
                language: this.state.language
            };
            localStorage.setItem('garden-pro-settings', JSON.stringify(settings));
        } catch (error) {
            console.warn('⚠️ Failed to save user settings:', error);
        }
    }

    /**
     * Setup global error handling
     */
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleError(event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled Promise rejection:', event.reason);
            this.handleError(event.reason);
        });
    }

    /**
     * Error handling
     */
    handleError(error) {
        // Error reporting and user notification logic can be added here
        console.error('Application error:', error);
        
        // Simple user notification
        if (window.uiManager && typeof window.uiManager.showNotification === 'function') {
            window.uiManager.showNotification('An error occurred, please refresh the page and try again', 'error');
        }
    }

    /**
     * Dispatch custom event
     */
    dispatchEvent(eventName, data = null) {
        const event = new CustomEvent(eventName, { detail: data });
        window.dispatchEvent(event);
    }

    /**
     * Get application state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Update application state
     */
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.saveUserSettings();
        this.dispatchEvent('app:state-changed', this.state);
    }

    /**
     * Get component instance
     */
    getComponent(name) {
        switch (name) {
            case 'dataManager':
                return this.dataManager;
            case 'calculator':
                return this.calculator;
            case 'themeManager':
                return this.themeManager;
            default:
                return null;
        }
    }

    renderHeroHistoryList() {
        const historyList = document.getElementById('hero-history-list');
        if (!historyList) return;
        const history = this.calculator.getHistory(10); // 只显示最近10条
        if (!history || history.length === 0) {
            historyList.innerHTML = `<div class='empty-state'><span class='empty-icon'>📝</span><p>No calculation history yet</p></div>`;
            return;
        }
        historyList.innerHTML = history.map(item => {
            const crop = item.crop;
            const value = item.calculation?.finalValue ?? 0;
            const icon = crop?.icon || '🌱';
            const name = crop?.name || '-';
            const rarity = crop?.rarity || '';
            const time = new Date(item.timestamp).toLocaleTimeString();
            return `<div class='history-item'>
                <div class='history-crop'><span class='history-crop-icon'>${icon}</span><span>${name}</span><span class='history-meta'>${rarity}</span></div>
                <div class='history-value'>${value}</div>
                <div class='history-meta'>${time}</div>
            </div>`;
        }).join('');
    }
}

/**
 * Theme Manager
 */
class ThemeManager {
    constructor() {
        this.themes = ['light', 'dark', 'auto'];
        this.currentTheme = 'auto';
    }

    init() {
        this.detectSystemTheme();
        this.applyTheme();
        this.setupSystemThemeListener();
    }

    detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-system-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-system-theme', 'light');
        }
    }

    setupSystemThemeListener() {
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                document.documentElement.setAttribute('data-system-theme', e.matches ? 'dark' : 'light');
                if (this.currentTheme === 'auto') {
                    this.applyTheme();
                }
            });
        }
    }

    setTheme(theme) {
        if (this.themes.includes(theme)) {
            this.currentTheme = theme;
            this.applyTheme();
            this.updateThemeIcon();
        }
    }

    toggleTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.setTheme(this.themes[nextIndex]);
        
        // Update application state
        if (window.app) {
            window.app.setState({ theme: this.currentTheme });
        }
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }

    updateThemeIcon() {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            const icons = {
                light: '☀️',
                dark: '🌙',
                auto: '🌓'
            };
            themeIcon.textContent = icons[this.currentTheme] || '🌓';
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Global application instance
let app = null;

// Global component instances for easy access
let dataManager = null;
let calculator = null;

// Initialize application after DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    app = new App();
    await app.init();
    
    // Mount app instance globally for debugging
    window.app = app;
    
    // Export component instances globally
    dataManager = app.dataManager;
    calculator = app.calculator;
    window.dataManager = dataManager;
    window.calculator = calculator;
});

// Export for use by other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App, ThemeManager };
}