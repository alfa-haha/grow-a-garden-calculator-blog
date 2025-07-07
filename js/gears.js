/**
 * Garden Pro Calculator - Gears Page Logic
 * Responsible for gears page functionality, data loading and display
 */

class GearsManager {
    constructor() {
        this.gears = [];
        this.filteredGears = [];
        this.isInitializing = false;
        this.isInitialized = false;
        
        console.log('⚙️ Gears Manager initialized');
    }

    /**
     * Initialize gears page
     */
    async init() {
        // Prevent multiple initialization
        if (this.isInitializing || this.isInitialized) {
            console.log('⚙️ GearsManager already initializing/initialized, skipping...');
            return;
        }
        
        this.isInitializing = true;
        
        try {
            console.log('🔄 Initializing gears page...');
            console.log('🔍 Current gears data length:', this.gears ? this.gears.length : 0);
            console.log('🔍 Current filteredGears data length:', this.filteredGears ? this.filteredGears.length : 0);
            
            // Use pre-loaded data or try to load if not available
            if (this.gears && this.gears.length > 0) {
                console.log(`✅ Using pre-loaded gears data (${this.gears.length} gears)`);
                // Ensure filteredGears is set
                if (!this.filteredGears || this.filteredGears.length === 0) {
                    this.filteredGears = [...this.gears];
                    console.log('🔍 Set filteredGears from gears, length:', this.filteredGears.length);
                }
            } else {
                console.log('🔄 No pre-loaded gears data, trying to load from DataManager...');
                await this.loadGearsData();
            }
            
            // Setup UI interactions
            this.setupEventListeners();
            
            // Update statistics and render
            this.updateStatistics();
            this.renderGearsTable();
            
            this.isInitialized = true;
            console.log('✅ Gears page initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize gears page:', error);
        } finally {
            this.isInitializing = false;
        }
    }

    /**
     * Load gears data from data manager
     */
    async loadGearsData() {
        try {
            let retries = 0;
            const maxRetries = 20;
            
            console.log('🔄 Starting to wait for app and data manager...');
            
            while (retries < maxRetries) {
                const hasApp = !!window.app;
                const hasDataManager = !!(window.app && window.app.dataManager);
                const isInitialized = !!(window.app && window.app.dataManager && window.app.dataManager.isInitialized());
                const hasGearsData = !!(window.app && window.app.dataManager && window.app.dataManager.data && window.app.dataManager.data.gears);
                
                console.log(`🔍 Check ${retries + 1}:`, {
                    hasApp,
                    hasDataManager,
                    isInitialized,
                    hasGearsData,
                    gearsCount: hasGearsData ? window.app.dataManager.data.gears.length : 0
                });
                
                if (hasApp && hasDataManager && isInitialized && hasGearsData) {
                    console.log('✅ All requirements met, proceeding with data loading...');
                    break;
                }
                
                retries++;
                if (retries < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
            }
            
            if (!window.app || !window.app.dataManager) {
                console.error('❌ App or DataManager not available after waiting');
                return;
            }
            
            if (!window.app.dataManager.isInitialized()) {
                console.error('❌ DataManager not initialized after waiting');
                return;
            }
            
            // Get gears data from data manager
            this.gears = window.app.dataManager.getGears();
            
            console.log('🔍 Debug: getGears() returned:', this.gears);
            console.log('🔍 Debug: gears type:', typeof this.gears);
            console.log('🔍 Debug: gears is array:', Array.isArray(this.gears));
            
            if (!this.gears || this.gears.length === 0) {
                console.warn('⚠️ No gears data available');
                this.gears = [];
                if (!this.filteredGears) this.filteredGears = [];
                return;
            }
            
            console.log(`✅ Loaded ${this.gears.length} gears`);
            
            // Initialize filtered gears with all gears only if not already set
            if (!this.filteredGears || this.filteredGears.length === 0) {
                this.filteredGears = [...this.gears];
            }
            
            console.log('🔍 Debug: filteredGears after initialization:', this.filteredGears);
            console.log('🔍 Debug: filteredGears length:', this.filteredGears.length);
            
            // Update statistics
            this.updateStatistics();
        } catch (error) {
            console.error('❌ Failed to load gears data:', error);
            this.gears = [];
            if (!this.filteredGears) this.filteredGears = [];
            throw error;
        }
    }

    /**
     * Setup event listeners for UI interactions
     */
    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('gears-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
        
        // Tier filter
        const tierFilter = document.getElementById('tier-filter');
        if (tierFilter) {
            tierFilter.addEventListener('change', () => this.applyFilters());
        }
        
        // Obtainable filter
        const obtainableFilter = document.getElementById('obtainable-filter');
        if (obtainableFilter) {
            obtainableFilter.addEventListener('change', () => this.applyFilters());
        }
        
        // Sort filter
        const sortFilter = document.getElementById('sort-filter');
        if (sortFilter) {
            sortFilter.addEventListener('change', () => this.applyFilters());
        }
        
        // Reset filters button
        const resetButton = document.getElementById('reset-filters');
        if (resetButton) {
            resetButton.addEventListener('click', () => this.resetFilters());
        }
        
        // Modal close button
        const modalClose = document.getElementById('modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }
        
        const modalCloseBtn = document.getElementById('modal-close-btn');
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => this.closeModal());
        }
    }

    /**
     * Handle search input
     */
    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        console.log(`🔍 Searching for: "${searchTerm}"`);
        this.currentSearchTerm = searchTerm;
        this.applyFilters();
    }

    /**
     * Apply all filters and update display
     */
    applyFilters() {
        console.log('🔧 Applying filters...');
        console.log('🔍 Base gears count:', this.gears ? this.gears.length : 0);
        
        // Start with all gears
        let filtered = [...this.gears];
        
        // Apply search filter
        if (this.currentSearchTerm) {
            filtered = filtered.filter(gear => 
                gear.name.toLowerCase().includes(this.currentSearchTerm) ||
                gear.use.toLowerCase().includes(this.currentSearchTerm)
            );
            console.log(`🔍 After search filter: ${filtered.length} gears`);
        }
        
        // Apply tier filter
        const tierFilter = document.getElementById('tier-filter');
        if (tierFilter && tierFilter.value) {
            filtered = filtered.filter(gear => gear.tier === tierFilter.value);
            console.log(`🔍 After tier filter: ${filtered.length} gears`);
        }
        
        // Apply obtainable filter
        const obtainableFilter = document.getElementById('obtainable-filter');
        if (obtainableFilter && obtainableFilter.value !== '') {
            const isObtainable = obtainableFilter.value === 'true';
            filtered = filtered.filter(gear => gear.obtainable === isObtainable);
            console.log(`🔍 After obtainable filter: ${filtered.length} gears`);
        }
        
        // Apply sorting
        const sortFilter = document.getElementById('sort-filter');
        if (sortFilter && sortFilter.value) {
            filtered = this.sortGears(filtered, sortFilter.value);
        }
        
        // Update filtered gears
        this.filteredGears = filtered;
        
        // Update display
        this.updateStatistics();
        this.renderGearsTable();
        
        console.log(`✅ Applied filters, showing ${this.filteredGears.length} gears`);
    }

    /**
     * Sort gears based on criteria
     */
    sortGears(gears, criteria) {
        const sorted = [...gears];
        
        switch (criteria) {
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'tier':
                const tierOrder = ['Common', 'Uncommon', 'Rare', 'Legendary', 'Mythical', 'Divine', 'Craftable'];
                return sorted.sort((a, b) => {
                    const aIndex = tierOrder.indexOf(a.tier);
                    const bIndex = tierOrder.indexOf(b.tier);
                    return aIndex - bIndex;
                });
            case 'price':
                return sorted.sort((a, b) => this.getGearPriceForSort(a) - this.getGearPriceForSort(b));
            case 'obtainable':
                return sorted.sort((a, b) => {
                    if (a.obtainable && !b.obtainable) return -1;
                    if (!a.obtainable && b.obtainable) return 1;
                    return a.name.localeCompare(b.name);
                });
            default:
                return sorted;
        }
    }

    /**
     * Get gear price for sorting
     */
    getGearPriceForSort(gear) {
        if (!gear.price) return 0;
        if (gear.price.sheckles) return gear.price.sheckles;
        if (gear.price.robux) return gear.price.robux * 1000000; // Convert robux to comparable value
        return 0;
    }

    /**
     * Reset all filters
     */
    resetFilters() {
        console.log('🔄 Resetting filters...');
        
        // Clear search
        const searchInput = document.getElementById('gears-search');
        if (searchInput) {
            searchInput.value = '';
        }
        this.currentSearchTerm = '';
        
        // Reset filters
        const tierFilter = document.getElementById('tier-filter');
        if (tierFilter) {
            tierFilter.value = '';
        }
        
        const obtainableFilter = document.getElementById('obtainable-filter');
        if (obtainableFilter) {
            obtainableFilter.value = '';
        }
        
        const sortFilter = document.getElementById('sort-filter');
        if (sortFilter) {
            sortFilter.value = 'name';
        }
        
        // Reapply filters (which will now show all gears)
        this.applyFilters();
        
        console.log('✅ Filters reset');
    }

    /**
     * Update statistics display
     */
    updateStatistics() {
        const filterResults = document.getElementById('filter-results');
        const totalGears = document.getElementById('total-gears');
        
        if (filterResults) {
            filterResults.textContent = `Showing ${this.filteredGears ? this.filteredGears.length : 0} results`;
        }
        
        if (totalGears) {
            totalGears.textContent = `Total ${this.gears ? this.gears.length : 0} gears`;
        }
    }

    /**
     * Render gears table
     */
    renderGearsTable() {
        const tableBody = document.getElementById('gears-table-body');
        const emptyState = document.getElementById('empty-state');
        
        if (!tableBody) {
            console.error('❌ Table body element not found');
            return;
        }
        
        // Clear existing content
        tableBody.innerHTML = '';
        
        if (!this.filteredGears || this.filteredGears.length === 0) {
            // Show empty state
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            console.log('📋 No gears to display');
            return;
        }
        
        // Hide empty state
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        
        // Generate table rows
        this.filteredGears.forEach(gear => {
            const row = this.createGearTableRow(gear);
            tableBody.appendChild(row);
        });
        
        console.log(`📋 Rendered ${this.filteredGears.length} gear rows`);
    }

    /**
     * Create a table row for a gear
     */
    createGearTableRow(gear) {
        const row = document.createElement('tr');
        row.className = 'gear-row';
        
        // Add click event to show details
        row.addEventListener('click', () => this.showGearDetails(gear));
        
        row.innerHTML = `
            <td class="gear-image-cell">
                <img src="images/gears/${gear.image}" alt="${gear.name}" class="gear-image" loading="lazy"
                     onerror="this.src='images/gears/default.png'">
            </td>
            <td class="gear-name">
                <div class="name-container">
                    <span class="name">${gear.name}</span>
                </div>
            </td>
            <td class="gear-price">
                ${this.formatPrice(gear.price)}
            </td>
            <td class="gear-tier">
                <span class="badge tier-${gear.tier.toLowerCase()}">${gear.tier}</span>
            </td>
            <td class="gear-description">
                <div class="description-text">${gear.use || 'No description available'}</div>
            </td>
            <td class="gear-obtainable">
                <span class="badge ${gear.obtainable ? 'obtainable' : 'not-obtainable'}">
                    ${gear.obtainable ? '✅ Yes' : '❌ No'}
                </span>
            </td>
        `;
        
        return row;
    }

    /**
     * Format price for display
     */
    formatPrice(price) {
        if (!price) return '<span class="price-free">Free</span>';
        
        const priceItems = [];
        
        if (price.sheckles) {
            priceItems.push(`<span class="price-sheckles">🪙 ${price.sheckles.toLocaleString()}</span>`);
        }
        
        if (price.robux) {
            priceItems.push(`<span class="price-robux">💎 ${price.robux}</span>`);
        }
        
        if (price.honey) {
            priceItems.push(`<span class="price-honey">🍯 ${price.honey}</span>`);
        }
        
        if (price.skyMerchantPrice) {
            priceItems.push(`<span class="price-sky">☁️ ${price.skyMerchantPrice.toLocaleString()}</span>`);
        }
        
        if (price.craftingMaterials) {
            priceItems.push(`<span class="price-crafting">🔨 ${price.craftingMaterials}</span>`);
        }
        
        // Add other price types as needed
        Object.keys(price).forEach(key => {
            if (!['sheckles', 'robux', 'honey', 'skyMerchantPrice', 'craftingMaterials'].includes(key)) {
                priceItems.push(`<span class="price-other">${key}: ${price[key]}</span>`);
            }
        });
        
        return priceItems.length > 0 ? priceItems.join('<br>') : '<span class="price-unknown">Unknown</span>';
    }

    /**
     * Show gear details in modal
     */
    showGearDetails(gear) {
        const modal = document.getElementById('gear-detail-modal');
        if (!modal) return;
        
        // Update modal content
        const gearName = document.getElementById('modal-gear-name');
        const gearImage = document.getElementById('modal-gear-image');
        const gearTier = document.getElementById('modal-gear-tier');
        const gearObtainable = document.getElementById('modal-gear-obtainable');
        const gearPrice = document.getElementById('modal-gear-price');
        const gearTierText = document.getElementById('modal-gear-tier-text');
        const gearStock = document.getElementById('modal-gear-stock');
        const gearObtainableText = document.getElementById('modal-gear-obtainable-text');
        const gearDescription = document.getElementById('modal-gear-description');
        
        if (gearName) gearName.textContent = gear.name;
        if (gearImage) {
            gearImage.src = `images/gears/${gear.image}`;
            gearImage.alt = gear.name;
            gearImage.onerror = function() { this.src = 'images/gears/default.png'; };
        }
        if (gearTier) {
            gearTier.textContent = gear.tier;
            gearTier.className = `badge tier-${gear.tier.toLowerCase()}`;
        }
        if (gearObtainable) {
            gearObtainable.textContent = gear.obtainable ? 'Obtainable' : 'Not Obtainable';
            gearObtainable.className = `badge ${gear.obtainable ? 'obtainable' : 'not-obtainable'}`;
        }
        if (gearPrice) gearPrice.innerHTML = this.formatPrice(gear.price);
        if (gearTierText) gearTierText.textContent = gear.tier;
        if (gearStock) gearStock.textContent = gear.stock || 'Unknown';
        if (gearObtainableText) gearObtainableText.textContent = gear.obtainable ? 'Yes' : 'No';
        if (gearDescription) gearDescription.textContent = gear.use || 'No description available';
        
        // Show modal
        modal.style.display = 'block';
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    /**
     * Close gear details modal
     */
    closeModal() {
        const modal = document.getElementById('gear-detail-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GearsManager;
} 