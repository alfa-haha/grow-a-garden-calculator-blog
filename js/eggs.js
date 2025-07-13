/**
 * Garden Pro Calculator - Eggs Page Logic
 * Responsible for eggs page functionality, data loading and display
 */

// 立即注册 initializeEggsManager 函数，避免 DOMContentLoaded 时序问题
console.log('🔧 Registering initializeEggsManager function...');
window.initializeEggsManager = async function(eggsData = null) {
    console.log('🔄 initializeEggsManager called with data:', eggsData ? eggsData.length : 0);
    
    // Prevent multiple initialization
    if (window.eggsManager && (window.eggsManager.isInitialized || window.eggsManager.isInitializing)) {
        console.log('🥚 EggsManager already exists and is initialized/initializing, skipping...');
        return;
    }
    
    console.log('🔄 Starting eggs manager initialization...');
    
    try {
        // Create eggs manager instance
        const eggsManager = new EggsManager();
        
        // Make it globally accessible
        window.eggsManager = eggsManager;
        
        // Use provided data or try to get from app
        let eggs = eggsData;
        
        if (!eggs && window.app && window.app.dataManager) {
            console.log('✅ Getting eggs data from DataManager');
            eggs = window.app.dataManager.getEggs();
            console.log(`🔍 Got ${eggs ? eggs.length : 0} eggs from DataManager`);
        }
        
        if (eggs && eggs.length > 0) {
            // Set data directly to avoid waiting logic
            eggsManager.eggs = eggs;
            eggsManager.filteredEggs = [...eggs];
            console.log(`🔍 Set eggs data: ${eggs.length} eggs`);
            
            // Initialize eggs manager
            await eggsManager.init();
            
            console.log('✅ Eggs manager initialization complete');
        } else {
            console.error('❌ No eggs data available for initialization');
        }
    } catch (error) {
        console.error('❌ Failed to initialize eggs manager:', error);
    }
};

console.log('✅ initializeEggsManager function registered successfully');
console.log('🔍 Function type:', typeof window.initializeEggsManager);

class EggsManager {
    constructor() {
        this.eggs = [];
        this.filteredEggs = [];
        this.isInitializing = false;
        this.isInitialized = false;
        
        console.log('🥚 Eggs Manager initialized');
    }

    /**
     * Initialize eggs page
     */
    async init() {
        // Prevent multiple initialization
        if (this.isInitializing || this.isInitialized) {
            console.log('🥚 EggsManager already initializing/initialized, skipping...');
            return;
        }
        
        this.isInitializing = true;
        
        try {
            console.log('🔄 Initializing eggs page...');
            console.log('🔍 Current eggs data length:', this.eggs ? this.eggs.length : 0);
            console.log('🔍 Current filteredEggs data length:', this.filteredEggs ? this.filteredEggs.length : 0);
            
            // Use pre-loaded data or try to load if not available
            if (this.eggs && this.eggs.length > 0) {
                console.log(`✅ Using pre-loaded eggs data (${this.eggs.length} eggs)`);
                // Ensure filteredEggs is set
                if (!this.filteredEggs || this.filteredEggs.length === 0) {
                    this.filteredEggs = [...this.eggs];
                    console.log('🔍 Set filteredEggs from eggs, length:', this.filteredEggs.length);
                }
            } else {
                console.log('🔄 No pre-loaded eggs data, trying to load from DataManager...');
                await this.loadEggsData();
            }
            
            // Setup UI interactions
            this.setupEventListeners();
            
            // Update statistics and render
            this.updateStatistics();
            this.renderEggsTable();
            
            this.isInitialized = true;
            console.log('✅ Eggs page initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize eggs page:', error);
        } finally {
            this.isInitializing = false;
        }
    }

    /**
     * Load eggs data from data manager
     */
    async loadEggsData() {
        try {
            let retries = 0;
            const maxRetries = 20;
            
            console.log('🔄 Starting to wait for app and data manager...');
            
            while (retries < maxRetries) {
                const hasApp = !!window.app;
                const hasDataManager = !!(window.app && window.app.dataManager);
                const isInitialized = !!(window.app && window.app.dataManager && window.app.dataManager.isInitialized());
                const hasEggsData = !!(window.app && window.app.dataManager && window.app.dataManager.data && window.app.dataManager.data.eggs);
                
                console.log(`🔍 Check ${retries + 1}:`, {
                    hasApp,
                    hasDataManager,
                    isInitialized,
                    hasEggsData,
                    eggsCount: hasEggsData ? window.app.dataManager.data.eggs.length : 0
                });
                
                if (hasApp && hasDataManager && isInitialized && hasEggsData) {
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
            
            // Get eggs data from data manager
            this.eggs = window.app.dataManager.getEggs();
            
            console.log('🔍 Debug: getEggs() returned:', this.eggs);
            console.log('🔍 Debug: eggs type:', typeof this.eggs);
            console.log('🔍 Debug: eggs is array:', Array.isArray(this.eggs));
            
            if (!this.eggs || this.eggs.length === 0) {
                console.warn('⚠️ No eggs data available');
                this.eggs = [];
                if (!this.filteredEggs) this.filteredEggs = [];
                return;
            }
            
            console.log(`✅ Loaded ${this.eggs.length} eggs`);
            
            // Initialize filtered eggs with all eggs only if not already set
            if (!this.filteredEggs || this.filteredEggs.length === 0) {
                this.filteredEggs = [...this.eggs];
            }
            
            console.log('🔍 Debug: filteredEggs after initialization:', this.filteredEggs);
            console.log('🔍 Debug: filteredEggs length:', this.filteredEggs.length);
            
            // Update statistics
            this.updateStatistics();
        } catch (error) {
            console.error('❌ Failed to load eggs data:', error);
            this.eggs = [];
            if (!this.filteredEggs) this.filteredEggs = [];
            throw error;
        }
    }

    /**
     * Setup event listeners for UI interactions
     */
    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('eggs-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
        
        // Source filter
        const sourceFilter = document.getElementById('source-filter');
        if (sourceFilter) {
            sourceFilter.addEventListener('change', () => this.applyFilters());
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
        
        // 当用户开始搜索时，自动重置所有筛选器
        if (searchTerm) {
            this.resetFiltersForSearch();
        }
        
        this.currentSearchTerm = searchTerm;
        this.applyFilters();
    }

    /**
     * Apply all filters and update display
     */
    applyFilters() {
        console.log('🔧 Applying filters...');
        console.log('🔍 Base eggs count:', this.eggs ? this.eggs.length : 0);
        
        // Start with all eggs
        let filtered = [...this.eggs];
        
        // Apply search filter
        if (this.currentSearchTerm) {
            const searchTerm = this.currentSearchTerm.toLowerCase();
            filtered = filtered.filter(egg => 
                egg.name.toLowerCase().includes(searchTerm)
            );
            console.log(`🔍 After search filter: ${filtered.length} eggs`);
        }
        
        // Apply source filter
        const sourceFilter = document.getElementById('source-filter');
        if (sourceFilter && sourceFilter.value) {
            const sourceValue = sourceFilter.value;
            filtered = filtered.filter(egg => {
                const source = egg.source || '';
                return source.includes(sourceValue);
            });
            console.log(`🔍 After source filter (${sourceValue}): ${filtered.length} eggs`);
        }
        
        // Apply sorting
        const sortFilter = document.getElementById('sort-filter');
        if (sortFilter && sortFilter.value) {
            filtered = this.sortEggs(filtered, sortFilter.value);
            console.log(`🔍 After sorting by ${sortFilter.value}: ${filtered.length} eggs`);
        }
        
        this.filteredEggs = filtered;
        console.log(`✅ Final filtered eggs: ${this.filteredEggs.length}`);
        
        // Update display
        this.updateStatistics();
        this.renderEggsTable();
    }

    /**
     * Sort eggs by specified criteria
     */
    sortEggs(eggs, criteria) {
        return eggs.sort((a, b) => {
            switch (criteria) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'cost':
                    const aCost = this.getEggCostForSort(a);
                    const bCost = this.getEggCostForSort(b);
                    return aCost - bCost;
                case 'hatchTime':
                    const aTime = this.getHatchTimeInMinutes(a.hatchTime);
                    const bTime = this.getHatchTimeInMinutes(b.hatchTime);
                    return aTime - bTime;
                case 'source':
                    return (a.source || '').localeCompare(b.source || '');
                default:
                    return 0;
            }
        });
    }

    /**
     * Get cost for sorting (prioritize sheckles, then robux)
     */
    getEggCostForSort(egg) {
        if (egg.cost.sheckles) return egg.cost.sheckles;
        if (egg.cost.robux) return egg.cost.robux * 100000; // Convert robux to comparable value
        if (egg.cost.honey) return egg.cost.honey * 1000000; // Convert honey to comparable value
        return 999999999; // For crafting eggs, place at end
    }

    /**
     * Convert hatch time to minutes for sorting
     */
    getHatchTimeInMinutes(hatchTime) {
        if (!hatchTime) return 0;
        
        const timeStr = hatchTime.toLowerCase();
        let minutes = 0;
        
        // Parse hours
        const hoursMatch = timeStr.match(/(\d+)\s*hours?/);
        if (hoursMatch) {
            minutes += parseInt(hoursMatch[1]) * 60;
        }
        
        // Parse minutes
        const minutesMatch = timeStr.match(/(\d+)\s*minutes?/);
        if (minutesMatch) {
            minutes += parseInt(minutesMatch[1]);
        }
        
        // Parse seconds
        const secondsMatch = timeStr.match(/(\d+)\s*seconds?/);
        if (secondsMatch) {
            minutes += parseInt(secondsMatch[1]) / 60;
        }
        
        return minutes;
    }

    /**
     * Reset filters for search (without clearing search input)
     */
    resetFiltersForSearch() {
        console.log('🔄 Resetting filters for search...');
        
        // Reset source filter
        const sourceFilter = document.getElementById('source-filter');
        if (sourceFilter) {
            sourceFilter.value = '';
        }
        
        // Reset sort filter
        const sortFilter = document.getElementById('sort-filter');
        if (sortFilter) {
            sortFilter.value = 'name';
        }
        
        console.log('✅ Filters reset for search');
    }

    /**
     * Reset all filters
     */
    resetFilters() {
        console.log('🔄 Resetting filters...');
        
        // Clear search
        const searchInput = document.getElementById('eggs-search');
        if (searchInput) {
            searchInput.value = '';
        }
        this.currentSearchTerm = '';
        
        // Reset source filter
        const sourceFilter = document.getElementById('source-filter');
        if (sourceFilter) {
            sourceFilter.value = '';
        }
        
        // Reset sort filter
        const sortFilter = document.getElementById('sort-filter');
        if (sortFilter) {
            sortFilter.value = 'name';
        }
        
        // Reapply filters (which will now show all eggs)
        this.applyFilters();
        
        console.log('✅ Filters reset');
    }

    /**
     * Update filter statistics
     */
    updateStatistics() {
        const filterResults = document.getElementById('filter-results');
        const totalEggs = document.getElementById('total-eggs');
        
        if (filterResults) {
            filterResults.textContent = `Showing ${this.filteredEggs.length} results`;
        }
        
        if (totalEggs) {
            totalEggs.textContent = `Total ${this.eggs.length} eggs`;
        }
    }

    /**
     * Render eggs table
     */
    renderEggsTable() {
        console.log('🔄 Rendering eggs table...');
        const tableBody = document.getElementById('eggs-table-body');
        const emptyState = document.getElementById('empty-state');
        
        if (!tableBody) {
            console.error('❌ Table body not found');
            return;
        }
        
        // Clear current content
        tableBody.innerHTML = '';
        
        if (!this.filteredEggs || this.filteredEggs.length === 0) {
            // Show empty state
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            console.log('📭 No eggs to display');
            return;
        }
        
        // Hide empty state
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        
        // Render eggs
        this.filteredEggs.forEach(egg => {
            const row = this.createEggTableRow(egg);
            if (row) {
                tableBody.appendChild(row);
            }
        });
        
        console.log(`✅ Rendered ${this.filteredEggs.length} eggs`);
    }

    /**
     * Create table row for an egg
     */
    createEggTableRow(egg) {
        const tr = document.createElement('tr');
        tr.className = 'data-row';
        tr.setAttribute('data-egg-id', egg.id);
        
        // Add click handler for row
        tr.addEventListener('click', () => this.showEggDetails(egg));
        tr.style.cursor = 'pointer';
        
        // Image column
        const imageCell = document.createElement('td');
        const img = document.createElement('img');
        img.src = `images/eggs/${egg.image}`;
        img.alt = egg.name;
        img.className = 'egg-image';
        img.style.width = '48px';
        img.style.height = '48px';
        img.style.objectFit = 'contain';
        img.onerror = () => {
            // Use a simple placeholder when image is not found
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGVsbGlwc2UgY3g9IjI0IiBjeT0iMjgiIHJ4PSIxMiIgcnk9IjE2IiBmaWxsPSIjRjVGNUY1IiBzdHJva2U9IiNDQ0NDQ0MiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSIyNCIgeT0iMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI4IiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5FR0c8L3RleHQ+Cjwvc3ZnPgo=';
            img.style.backgroundColor = '#f8f9fa';
            img.style.border = '1px solid #dee2e6';
            img.style.borderRadius = '4px';
        };
        imageCell.appendChild(img);
        tr.appendChild(imageCell);
        
        // Name column
        const nameCell = document.createElement('td');
        nameCell.textContent = egg.name;
        nameCell.className = 'egg-name';
        tr.appendChild(nameCell);
        
        // Price column
        const priceCell = document.createElement('td');
        priceCell.innerHTML = this.formatCost(egg.cost);
        priceCell.className = 'egg-price';
        tr.appendChild(priceCell);
        
        // Hatch Time column
        const hatchTimeCell = document.createElement('td');
        hatchTimeCell.textContent = egg.hatchTime || '-';
        hatchTimeCell.className = 'egg-hatch-time';
        tr.appendChild(hatchTimeCell);
        
        // Hatching Probability column
        const probabilityCell = document.createElement('td');
        probabilityCell.innerHTML = this.formatHatchingProbability(egg.hatchingProbability);
        probabilityCell.className = 'egg-probability';
        tr.appendChild(probabilityCell);
        
        return tr;
    }

    /**
     * Format cost for display
     */
    formatCost(cost) {
        if (!cost) return '-';
        
        const parts = [];
        
        if (cost.sheckles) {
            parts.push(`${cost.sheckles.toLocaleString()} Sheckles`);
        }
        
        if (cost.robux) {
            parts.push(`${cost.robux} Robux`);
        }
        
        if (cost.honey) {
            parts.push(`${cost.honey} Honey`);
        }
        
        if (cost.summerCoin) {
            parts.push(`${cost.summerCoin} Summer Coins`);
        }
        
        if (cost.bloodMoonPrice) {
            parts.push(`${cost.bloodMoonPrice.toLocaleString()} (Blood Moon)`);
        }
        
        if (cost.twilightPrice) {
            parts.push(`${cost.twilightPrice.toLocaleString()} (Twilight)`);
        }
        
        if (cost.crafting) {
            parts.push('Crafting');
        }
        
        return parts.length > 0 ? parts.join('<br>') : '-';
    }

    /**
     * Format hatching probability for display
     */
    formatHatchingProbability(probability) {
        if (!probability) return '-';
        
        const pets = [];
        for (const [pet, chance] of Object.entries(probability)) {
            pets.push(`${pet}: ${chance}`);
        }
        
        return pets.join('<br>');
    }

    /**
     * Show egg details in modal
     */
    showEggDetails(egg) {
        console.log('🥚 Showing egg details:', egg.name);
        
        // Update modal content
        const modalEggName = document.getElementById('modal-egg-name');
        const modalEggImage = document.getElementById('modal-egg-image');
        const modalEggCost = document.getElementById('modal-egg-cost');
        const modalEggHatchTime = document.getElementById('modal-egg-hatch-time');
        const modalEggSourceText = document.getElementById('modal-egg-source-text');
        const modalEggProbability = document.getElementById('modal-egg-probability');
        
        if (modalEggName) modalEggName.textContent = egg.name;
        if (modalEggImage) {
            modalEggImage.src = `images/eggs/${egg.image}`;
            modalEggImage.alt = egg.name;
            modalEggImage.onerror = () => {
                // Use the same placeholder for modal
                modalEggImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGVsbGlwc2UgY3g9IjI0IiBjeT0iMjgiIHJ4PSIxMiIgcnk9IjE2IiBmaWxsPSIjRjVGNUY1IiBzdHJva2U9IiNDQ0NDQ0MiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSIyNCIgeT0iMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI4IiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5FR0c8L3RleHQ+Cjwvc3ZnPgo=';
                modalEggImage.style.backgroundColor = '#f8f9fa';
                modalEggImage.style.border = '1px solid #dee2e6';
                modalEggImage.style.borderRadius = '4px';
            };
        }
        if (modalEggCost) modalEggCost.innerHTML = this.formatCost(egg.cost);
        if (modalEggHatchTime) modalEggHatchTime.textContent = egg.hatchTime || '-';
        if (modalEggSourceText) modalEggSourceText.textContent = egg.source || '-';
        if (modalEggProbability) modalEggProbability.innerHTML = this.formatHatchingProbability(egg.hatchingProbability);
        
        // Show modal
        const modal = document.getElementById('egg-detail-modal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    /**
     * Close modal
     */
    closeModal() {
        const modal = document.getElementById('egg-detail-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

// Initialize eggs manager when page loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🥚 DOMContentLoaded event triggered in eggs.js');
    console.log('🔍 Current pathname:', window.location.pathname);
    
    // Check if we're on the eggs page (support both eggs.html and /eggs paths)
    const isEggsPage = window.location.pathname.includes('eggs.html') || 
                      window.location.pathname.includes('/eggs') ||
                      window.location.pathname.endsWith('/eggs');
    
    if (!isEggsPage) {
        console.log('❌ Not on eggs page, skipping initialization');
        return;
    }
    
    console.log('🥚 DOM loaded, eggs manager setup complete');
    console.log('✅ initializeEggsManager function is ready:', typeof window.initializeEggsManager);
}); 

document.addEventListener('app:initialized', async () => {
    // Check if we're on the eggs page (support both eggs.html and /eggs paths)
    const isEggsPage = window.location.pathname.includes('eggs.html') || 
                      window.location.pathname.includes('/eggs') ||
                      window.location.pathname.endsWith('/eggs');
    
    if (isEggsPage) {
        if (window.initializeEggsManager) {
            console.log('🚀 App initialized, calling initializeEggsManager...');
            // Get eggs data from app if available
            const eggs = window.app && window.app.dataManager ? window.app.dataManager.getEggs() : null;
            await window.initializeEggsManager(eggs);
        }
    }
}); 