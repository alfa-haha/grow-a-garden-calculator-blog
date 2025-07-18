/**
 * Garden Pro Calculator - Mutations Page Logic
 * Responsible for mutations page functionality, data loading and display
 */

class MutationsManager {
    constructor() {
        this.mutations = [];
        this.filteredMutations = [];
        this.isInitializing = false;
        this.isInitialized = false;
        
        // 添加全局调试方法
        window.debugMutations = () => {
            console.log('=== MUTATIONS DEBUG INFO ===');
            console.log('Manager initialized:', this.isInitialized);
            console.log('Mutations count:', this.mutations.length);
            console.log('Filtered count:', this.filteredMutations.length);
            console.log('First 3 mutations:', this.mutations.slice(0, 3));
            console.log('=== END DEBUG ===');
            return this.mutations;
        };
        
        // 添加强制重新加载方法
        window.reloadMutations = async () => {
            console.log('🔄 Force reloading mutations...');
            this.isInitialized = false;
            this.isInitializing = false;
            await this.init();
            return this.mutations.length;
        };
        
        console.log('🧬 Mutations Manager initialized');
        
        // Register as global variable for app.js integration
        window.mutationsManager = this;
    }

    /**
     * Initialize mutations page
     */
    async init() {
        // Prevent multiple initialization
        if (this.isInitializing || this.isInitialized) {
            console.log('🧬 MutationsManager already initializing/initialized, skipping...');
            return;
        }
        
        this.isInitializing = true;
        
        try {
            console.log('🔄 Initializing mutations page...');
            
            // Always load mutations data fresh
            await this.loadMutationsData();
            
            // Setup UI interactions
            this.setupEventListeners();
            
            // Debug page state
            this.debugPageState();
            
            // Render initial view
            this.renderMutationsTable();
            
            this.isInitialized = true;
            console.log('✅ Mutations page initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize mutations page:', error);
        } finally {
            this.isInitializing = false;
        }
    }

    /**
     * Load mutations data from data manager
     */
    async loadMutationsData() {
        try {
            console.log('🔄 Starting mutations data loading (independent mode)...');
            
            // Check if data is already loaded by app
            if (this.mutations && this.mutations.length > 0) {
                console.log('✅ Mutations data already loaded, skipping fetch');
                console.log('🔍 Using existing mutations:', this.mutations.length);
                this.filteredMutations = [...this.mutations];
                this.updateStatistics();
                return;
            }
            
            // Load mutations.json directly, avoid data-manager interference
            try {
                console.log('📥 Loading mutations data from data/mutations.json...');
                
                // Add cache-busting parameter to prevent caching issues
                const timestamp = new Date().getTime();
                const response = await fetch(`data/mutations.json?v=${timestamp}`, {
                    cache: 'no-cache',
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });
                
                console.log('🔍 Fetch response status:', response.status);
                console.log('🔍 Fetch response ok:', response.ok);
                console.log('🔍 Response headers:', [...response.headers.entries()]);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const text = await response.text();
                console.log('🔍 Raw response text length:', text.length);
                console.log('🔍 First 100 chars:', text.substring(0, 100));
                
                // Validate JSON before parsing
                if (!text || text.trim() === '') {
                    throw new Error('Empty response from server');
                }
                
                let data;
                try {
                    data = JSON.parse(text);
                } catch (jsonError) {
                    console.error('❌ JSON parsing error:', jsonError);
                    console.error('🔍 Raw text:', text);
                    throw new Error(`Invalid JSON format: ${jsonError.message}`);
                }
                
                console.log('🔍 Raw mutations data loaded successfully');
                console.log('🔍 Data type:', typeof data);
                console.log('🔍 Data keys:', Object.keys(data));
                console.log('🔍 Has mutations property:', !!data.mutations);
                console.log('🔍 Mutations type:', typeof data.mutations);
                console.log('🔍 Is mutations array:', Array.isArray(data.mutations));
                console.log('🔍 Mutations length:', data.mutations?.length);
                
                if (data.mutations && data.mutations.length > 0) {
                    console.log('🔍 First mutation:', data.mutations[0]);
                    console.log('🔍 Last mutation:', data.mutations[data.mutations.length - 1]);
                }
                
                const extractedMutations = this.extractMutationsDataNew(data);
                
                if (extractedMutations.length > 0) {
                    this.mutations = extractedMutations;
                    console.log(`✅ Successfully loaded ${this.mutations.length} mutations from mutations.json`);
                    console.log('🔍 Processed mutations sample:', this.mutations.slice(0, 2));
                } else {
                    console.error('❌ No mutations extracted from data');
                    console.error('🔍 Raw data:', data);
                    throw new Error('No mutations extracted from data');
                }
                
            } catch (error) {
                console.error('❌ Failed to load mutations.json:', error.message);
                console.error('🔍 Error details:', error);
                console.warn('🔄 Using default mutations as fallback');
                this.mutations = this.getDefaultMutations();
            }
            
            // Ensure we have mutations data
            if (!this.mutations || this.mutations.length === 0) {
                console.warn('⚠️ No mutations data available, using default fallback');
                this.mutations = this.getDefaultMutations();
            }
            
            // Ensure we have filteredMutations
            if (!this.filteredMutations || this.filteredMutations.length === 0) {
                console.log('🔍 Initializing filteredMutations from mutations array');
                this.filteredMutations = [...this.mutations];
            }
            
            console.log(`✅ Final mutations count: ${this.mutations.length}`);
            console.log('🔍 Final mutations sample:', this.mutations.slice(0, 2));
            
            // Initialize filtered mutations
            this.filteredMutations = [...this.mutations];
            
            // Update statistics
            this.updateStatistics();
            
        } catch (error) {
            console.error('❌ Critical error in mutations data loading:', error);
            console.error('🔍 Error stack:', error.stack);
            this.mutations = this.getDefaultMutations();
            this.filteredMutations = [...this.mutations];
            this.updateStatistics();
        }
    }

    /**
     * Extract mutations data from the JSON structure
     */
    extractMutationsDataNew(data) {
        const mutations = [];
        
        // Handle case where data is already an array (from app.js)
        if (Array.isArray(data)) {
            console.log('🔍 Data is already an array, processing directly');
            return this.processMutationsArray(data);
        }
        
        // Comprehensive data validation
        console.log('🔍 Analyzing mutations data structure:', {
            hasData: !!data,
            dataType: typeof data,
            dataKeys: data ? Object.keys(data) : [],
            hasMutations: !!data?.mutations,
            mutationsType: typeof data?.mutations,
            isArray: Array.isArray(data?.mutations),
            mutationsLength: data?.mutations?.length
        });
        
        // Step 1: Check if data exists
        if (!data) {
            console.error('❌ No data provided to extractMutationsDataNew');
            return mutations;
        }
        
        // Step 2: Check if mutations property exists
        if (!data.hasOwnProperty('mutations')) {
            console.error('❌ Data object does not have mutations property');
            console.error('Available properties:', Object.keys(data));
            return mutations;
        }
        
        // Step 3: Check if mutations is an array
        if (!Array.isArray(data.mutations)) {
            console.error('❌ mutations property is not an array');
            console.error('Type:', typeof data.mutations);
            console.error('Value:', data.mutations);
            return mutations;
        }
        
        // Step 4: Check if array has content
        if (data.mutations.length === 0) {
            console.warn('⚠️ mutations array is empty');
            return mutations;
        }
        
        console.log(`🔍 Starting to process ${data.mutations.length} mutations...`);
        
        return this.processMutationsArray(data.mutations);
    }

    /**
     * Process mutations array
     */
    processMutationsArray(mutationsArray) {
        const mutations = [];
        
        console.log(`🔍 Processing ${mutationsArray.length} mutations...`);
        
        // Process each mutation with error handling
        mutationsArray.forEach((mutation, index) => {
            try {
                if (!mutation || typeof mutation !== 'object') {
                    console.warn(`⚠️ Skipping invalid mutation at index ${index}:`, mutation);
                    return;
                }
                
                const mutationName = mutation.name || `Mutation_${index + 1}`;
                console.log(`🔍 Processing mutation ${index + 1}: ${mutationName}`);
                console.log(`🔍 Mutation data:`, {
                    id: mutation.id,
                    name: mutation.name,
                    category: mutation.category,
                    sheckles_multiplier: mutation.sheckles_multiplier,
                    visual_description: mutation.visual_description,
                    obtainment: mutation.obtainment
                });
                
                // Get icon and color based on category
                const icon = this.getCategoryIcon(mutation.category);
                const color = this.getCategoryColor(mutation.category);
                
                // Create processed mutation object
                const processedMutation = {
                    id: mutation.id || `mutation_${index}`,
                    name: mutationName,
                    category: mutation.category || 'Unknown',
                    multiplier: Number(mutation.sheckles_multiplier) || 0,
                    effect: `×${Number(mutation.sheckles_multiplier) || 0}`,
                    description: mutation.visual_description || 'No description available',
                    icon: icon,
                    color: color,
                    obtainment: mutation.obtainment || 'Unknown',
                    appearance: mutation.appearance || '',
                    stack_bonus: Boolean(mutation.stack_bonus)
                };
                
                console.log(`🔍 Processed mutation:`, processedMutation);
                mutations.push(processedMutation);
                
            } catch (error) {
                console.error(`❌ Error processing mutation at index ${index}:`, error);
                console.error('Mutation data:', mutation);
            }
        });
        
        console.log(`✅ Successfully processed ${mutations.length} out of ${mutationsArray.length} mutations`);
        
        if (mutations.length !== mutationsArray.length) {
            console.warn(`⚠️ Some mutations were skipped during processing`);
        }
        
        return mutations;
    }

    /**
     * Get icon based on mutation category
     */
    getCategoryIcon(category) {
        if (category.includes('Growth')) return '🌱';
        if (category.includes('Temperature')) return '🌡️';
        if (category.includes('Environmental')) return '🌍';
        return '🧬';
    }

    /**
     * Get color based on mutation category
     */
    getCategoryColor(category) {
        if (category.includes('Growth')) return '#FBBF24';
        if (category.includes('Temperature')) return '#06B6D4';
        if (category.includes('Environmental')) return '#10B981';
        return '#9CA3AF';
    }

    /**
     * Extract mutations data from the nested JSON structure
     */
    extractMutationsData(mutationsData) {
        const mutations = [];
        
        if (!mutationsData) return mutations;
        
        Object.keys(mutationsData).forEach(categoryKey => {
            const category = mutationsData[categoryKey];
            if (category.types) {
                Object.keys(category.types).forEach(typeKey => {
                    const mutation = category.types[typeKey];
                    mutations.push({
                        id: mutation.id || typeKey,
                        name: mutation.name || typeKey,
                        category: category.category || categoryKey,
                        multiplier: mutation.multiplier || mutation.additive || 0,
                        effect: mutation.multiplier ? `×${mutation.multiplier}` : `+${mutation.additive}×`,
                        description: mutation.description || 'No description available',
                        icon: mutation.icon || '🧬',
                        color: mutation.color || category.color || '#9CA3AF',
                        obtainment: this.getObtainmentMethod(categoryKey, mutation),
                        appearance: '',
                        stack_bonus: categoryKey === 'environmental'
                    });
                });
            }
        });
        
        return mutations;
    }

    /**
     * Get obtainment method based on category and mutation type
     */
    getObtainmentMethod(category, mutation) {
        switch (category) {
            case 'growth':
                if (mutation.id === 'normal') return 'Default state';
                if (mutation.id === 'golden') return 'Natural occurrence';
                if (mutation.id === 'rainbow') return 'Rare natural occurrence';
                break;
            case 'temperature':
                if (mutation.id === 'normal_temp') return 'Default state';
                if (mutation.id === 'chilled' || mutation.id === 'frozen') return 'Cold environments';
                if (mutation.id === 'heated') return 'Hot environments';
                break;
            case 'environmental':
                return 'Environmental conditions';
            default:
                return 'Natural occurrence';
        }
        return 'Natural occurrence';
    }

    /**
     * Setup event listeners for UI interactions
     */
    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('mutations-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
        
        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.applyFilters());
        }
        
        // Modal close event
        const modalClose = document.getElementById('modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }
        
        // Modal backdrop click
        const modal = document.getElementById('mutation-detail-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }

    /**
     * Handle search input
     */
    handleSearch(query) {
        // 当用户开始搜索时，自动重置所有筛选器
        if (query && query.trim()) {
            this.resetFiltersForSearch();
        }
        this.applyFilters(query);
    }

    /**
     * Reset filters for search (without clearing search input)
     */
    resetFiltersForSearch() {
        console.log('🔄 Resetting filters for search...');
        
        // Reset category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.value = '';
        }
        
        console.log('✅ Filters reset for search');
    }

    /**
     * Apply all filters and search
     */
    applyFilters(searchQuery = '') {
        try {
            if (!Array.isArray(this.mutations)) {
                console.warn('⚠️ mutations is not an array:', this.mutations);
                this.filteredMutations = [];
                this.updateStatistics();
                this.renderMutationsTable();
                return;
            }

            const categoryFilter = document.getElementById('category-filter');
            const searchInput = document.getElementById('mutations-search');
            
            const query = searchQuery || (searchInput ? searchInput.value.toLowerCase() : '');
            const selectedCategory = categoryFilter ? categoryFilter.value : '';
            
            this.filteredMutations = this.mutations.filter(mutation => {
                // Search filter
                const matchesSearch = !query || 
                    mutation.name.toLowerCase().includes(query) ||
                    mutation.description.toLowerCase().includes(query) ||
                    mutation.category.toLowerCase().includes(query);
                
                // Category filter
                const matchesCategory = !selectedCategory || mutation.category === selectedCategory;
                
                return matchesSearch && matchesCategory;
            });
            
            console.log(`🔍 Applied filters: ${this.filteredMutations.length} mutations match criteria`);
            
            // Update UI
            this.updateStatistics();
            this.renderMutationsTable();
            
        } catch (error) {
            console.error('❌ Error applying filters:', error);
        }
    }

    /**
     * Update statistics display
     */
    updateStatistics() {
        const totalMutations = this.mutations ? this.mutations.length : 0;
        const filteredCount = this.filteredMutations ? this.filteredMutations.length : 0;
        
        console.log(`📊 Updating statistics - mutations: ${totalMutations}, filtered: ${filteredCount}`);
        
        const filterResults = document.getElementById('filter-results');
        const totalMutationsEl = document.getElementById('total-mutations');
        
        console.log(`📊 Filter results element:`, filterResults);
        console.log(`📊 Total mutations element:`, totalMutationsEl);
        
        if (filterResults) {
            filterResults.textContent = `Showing ${filteredCount} results`;
            console.log(`📊 Updated filter results text: "${filterResults.textContent}"`);
        } else {
            console.warn('⚠️ filter-results element not found');
        }
        
        if (totalMutationsEl) {
            totalMutationsEl.textContent = `Total ${totalMutations} mutations`;
            console.log(`📊 Updated total mutations text: "${totalMutationsEl.textContent}"`);
        } else {
            console.warn('⚠️ total-mutations element not found');
        }
        
        console.log(`📊 Statistics updated: ${filteredCount} filtered, ${totalMutations} total`);
    }

    /**
     * Debug method to check page state
     */
    debugPageState() {
        console.log('🔍 === PAGE STATE DEBUG ===');
        console.log('🔍 Document ready state:', document.readyState);
        console.log('🔍 Mutations data loaded:', this.mutations.length);
        console.log('🔍 Filtered mutations:', this.filteredMutations.length);
        console.log('🔍 Is initialized:', this.isInitialized);
        
        // Check DOM elements
        const elements = [
            'filter-results',
            'total-mutations',
            'mutations-table-body',
            'empty-state',
            'mutations-table'
        ];
        
        elements.forEach(id => {
            const element = document.getElementById(id);
            console.log(`🔍 Element ${id}:`, element ? 'Found' : 'Not found');
        });
        
        console.log('🔍 === END DEBUG ===');
    }

    /**
     * Render mutations table
     */
    renderMutationsTable() {
        console.log('🔄 Starting to render mutations table...');
        
        const tableBody = document.getElementById('mutations-table-body');
        const emptyState = document.getElementById('empty-state');
        const mutationsTable = document.getElementById('mutations-table');
        
        if (!tableBody) {
            console.error('❌ Table body element not found');
            return;
        }
        
        // Clear existing content
        tableBody.innerHTML = '';
        
        if (!this.filteredMutations || this.filteredMutations.length === 0) {
            if (mutationsTable) mutationsTable.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }
        
        if (mutationsTable) mutationsTable.style.display = 'block';
        if (emptyState) emptyState.style.display = 'none';
        
        // Create table rows
        this.filteredMutations.forEach(mutation => {
            const row = this.createMutationTableRow(mutation);
            tableBody.appendChild(row);
        });
        
        console.log(`✅ Rendered ${this.filteredMutations.length} mutations in table`);
    }

    /**
     * Create a table row for a mutation
     */
    createMutationTableRow(mutation) {
        const row = document.createElement('tr');
        row.className = 'data-row';
        row.addEventListener('click', () => this.showMutationDetail(mutation));
        
        // Image cell - use appearance if available, otherwise use icon
        const imageContent = mutation.appearance ? 
            `<img src="images/mutations/${mutation.appearance}" alt="${mutation.name}" class="mutation-image" onerror="this.onerror=null;this.src='images/mutations/placeholder.png';">` :
            `<span class="mutation-icon" style="color: ${mutation.color}">${mutation.icon}</span>`;
        
        // 检测当前主题
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDarkMode ? '#f9fafb' : '#111827'; // 深色模式用浅色文字，浅色模式用深色文字
        
        row.innerHTML = `
            <td>
                ${imageContent}
            </td>
            <td>
                <strong style="color: ${textColor};">${mutation.name}</strong>
            </td>
            <td>
                <span class="mutation-category-badge" style="background-color: ${mutation.color}20; border: 1px solid ${mutation.color}; color: ${mutation.color}">
                    ${mutation.category.replace(' Mutations', '')}
                </span>
            </td>
            <td>
                <span class="mutation-effect" style="color: ${mutation.color}">×${mutation.multiplier}</span>
            </td>
            <td>
                <span class="obtainment-method" style="color: ${textColor};">${mutation.obtainment}</span>
            </td>
            <td>
                <span class="mutation-description" style="color: ${textColor};">${mutation.description}</span>
            </td>
        `;
        
        return row;
    }

    /**
     * Show mutation detail modal
     */
    showMutationDetail(mutation) {
        const modal = document.getElementById('mutation-detail-modal');
        const modalName = document.getElementById('modal-mutation-name');
        const modalIcon = document.getElementById('modal-mutation-icon');
        const modalCategory = document.getElementById('modal-mutation-category');
        const modalCategoryText = document.getElementById('modal-mutation-category-text');
        const modalEffectType = document.getElementById('modal-mutation-effect-type');
        const modalMultiplier = document.getElementById('modal-mutation-multiplier');
        const modalStackType = document.getElementById('modal-mutation-stack-type');
        const modalDescription = document.getElementById('modal-mutation-description');
        const modalObtainment = document.getElementById('modal-mutation-obtainment');
        
        if (modalName) modalName.textContent = mutation.name;
        if (modalIcon) {
            if (mutation.appearance) {
                modalIcon.innerHTML = `<img src="images/mutations/${mutation.appearance}" alt="${mutation.name}" style="width: 48px; height: 48px;" onerror="this.onerror=null;this.src='images/mutations/placeholder.png';">`;
            } else {
                modalIcon.textContent = mutation.icon;
                modalIcon.style.color = mutation.color;
            }
        }
        if (modalCategory) {
            modalCategory.textContent = mutation.category.replace(' Mutations', '');
            modalCategory.style.backgroundColor = mutation.color;
        }
        if (modalCategoryText) modalCategoryText.textContent = mutation.category.replace(' Mutations', '');
        if (modalEffectType) modalEffectType.textContent = this.getEffectType(mutation);
        if (modalMultiplier) modalMultiplier.textContent = `×${mutation.multiplier}`;
        if (modalStackType) modalStackType.textContent = mutation.stack_bonus ? 'Stackable' : 'Exclusive';
        if (modalDescription) modalDescription.textContent = mutation.description;
        if (modalObtainment) modalObtainment.textContent = mutation.obtainment;
        
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Get effect type for mutation
     */
    getEffectType(mutation) {
        if (mutation.category.includes('Growth')) return 'Multiplicative';
        if (mutation.category.includes('Temperature')) return 'Additive';
        if (mutation.category.includes('Environmental')) return 'Additive';
        return 'Unknown';
    }

    /**
     * Get stack type for mutation
     */
    getStackType(mutation) {
        return mutation.stack_bonus ? 'Stackable' : 'Exclusive';
    }

    /**
     * Get default mutations data as fallback
     */
    getDefaultMutations() {
        return [
            {
                id: 'normal',
                name: 'Normal',
                category: 'Growth',
                multiplier: 1,
                effect: '×1',
                description: 'Normal crop, no additional bonus',
                icon: '🌱',
                color: '#9CA3AF',
                obtainment: 'Default state',
                appearance: '',
                stack_bonus: false
            },
            {
                id: 'golden',
                name: 'Golden',
                category: 'Growth',
                multiplier: 20,
                effect: '×20',
                description: 'Golden mutation, value x20',
                icon: '🌟',
                color: '#F59E0B',
                obtainment: '1% chance to grow replacing the normal variant',
                appearance: '',
                stack_bonus: false
            },
            {
                id: 'rainbow',
                name: 'Rainbow',
                category: 'Growth',
                multiplier: 50,
                effect: '×50',
                description: 'Rainbow mutation, value x50',
                icon: '🌈',
                color: '#8B5CF6',
                obtainment: '0.1% chance to grow replacing the normal variant',
                appearance: '',
                stack_bonus: false
            }
        ];
    }

    /**
     * Close mutation detail modal
     */
    closeModal() {
        const modal = document.getElementById('mutation-detail-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
}

// Initialize mutations manager when DOM is loaded
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', async () => {
        // Only initialize if we're on the mutations page
        const currentPath = window.location.pathname;
        const isOnMutationsPage = currentPath.includes('mutations.html') || 
                                  currentPath.includes('mutations') || 
                                  currentPath.endsWith('/mutations');
        
        console.log('🔍 DOM loaded, checking if on mutations page...');
        console.log('🔍 Current path:', currentPath);
        console.log('🔍 Is on mutations page:', isOnMutationsPage);
        
        if (isOnMutationsPage) {
            console.log('🔄 DOM loaded, initializing mutations manager...');
            
            try {
                // Create global mutations manager instance
                if (!window.mutationsManager) {
                    window.mutationsManager = new MutationsManager();
                }
                
                // Check if app is already initialized and has data
                if (window.app && window.app.initialized && window.app.dataManager) {
                    console.log('✅ App already initialized, using existing data');
                    const appMutations = window.app.dataManager.getMutations();
                    if (appMutations && appMutations.raw) {
                        if (typeof window.mutationsManager.processMutationsArray === 'function') {
                            const processedMutations = window.mutationsManager.processMutationsArray(appMutations.raw);
                            window.mutationsManager.mutations = processedMutations;
                            window.mutationsManager.filteredMutations = [...processedMutations];
                            console.log('🔍 Using app data, processed mutations count:', processedMutations.length);
                        } else {
                            console.warn('⚠️ processMutationsArray method not found, using raw data');
                            window.mutationsManager.mutations = appMutations.raw;
                            window.mutationsManager.filteredMutations = [...appMutations.raw];
                        }
                    }
                }
                
                // Initialize mutations manager
                console.log('✅ Initializing mutations manager');
                await window.mutationsManager.init();
            } catch (error) {
                console.error('❌ Failed to initialize mutations manager:', error);
            }
        } else {
            console.log('🔍 Not on mutations page, skipping initialization');
        }
    });
}

// Make MutationsManager available globally
if (typeof window !== 'undefined') {
    window.MutationsManager = MutationsManager;
} 