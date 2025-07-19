/**
 * Garden Pro Calculator - Pets Page Logic
 * Responsible for pets page functionality, data loading and display
 */

class PetsManager {
    constructor() {
        this.pets = [];
        this.filteredPets = [];
        this.currentPage = 1;
        this.itemsPerPage = 30;
        this.totalPages = 1;
        this.isInitializing = false;
        this.isInitialized = false;
        
        console.log('🐾 Pets Manager initialized');
    }

    /**
     * Initialize pets page
     */
    async init() {
        // Prevent multiple initialization
        if (this.isInitializing || this.isInitialized) {
            console.log('🐾 PetsManager already initializing/initialized, skipping...');
            return;
        }
        
        this.isInitializing = true;
        
        try {
            console.log('🔄 Initializing pets page...');
            console.log('🔍 Current pets data length:', this.pets ? this.pets.length : 0);
            console.log('🔍 Current filteredPets data length:', this.filteredPets ? this.filteredPets.length : 0);
            
            // Load pets data only if not already set
            if (!this.pets || this.pets.length === 0) {
                console.log('🔄 No pets data found, loading from DataManager...');
                await this.loadPetsData();
            } else {
                console.log(`✅ Using pre-loaded pets data (${this.pets.length} pets)`);
                console.log('🔍 Pre-loaded filteredPets length:', this.filteredPets ? this.filteredPets.length : 0);
                // Ensure filteredPets is set
                if (!this.filteredPets || this.filteredPets.length === 0) {
                    this.filteredPets = [...this.pets];
                    console.log('🔍 Set filteredPets from pets, length:', this.filteredPets.length);
                } else {
                    console.log('🔍 Using existing filteredPets, length:', this.filteredPets.length);
                }
                // Update statistics
                this.updateStatistics();
            }
            
            // Setup UI interactions
            this.setupEventListeners();
            
            // Render initial view
            this.renderPetsTable();
            
            this.isInitialized = true;
            console.log('✅ Pets page initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize pets page:', error);
        } finally {
            this.isInitializing = false;
        }
    }

    /**
     * Load pets data from data manager
     */
    async loadPetsData() {
        try {
            // 不要在这里重置filteredPets，避免覆盖预设数据
            // this.filteredPets = [];
            
            // Wait for app and data manager to be available with better checking
            let retries = 0;
            const maxRetries = 20; // 增加重试次数
            
            console.log('🔄 Starting to wait for app and data manager...');
            
            while (retries < maxRetries) {
                // 更详细的检查
                const hasApp = !!window.app;
                const hasDataManager = !!(window.app && window.app.dataManager);
                const isInitialized = !!(window.app && window.app.dataManager && window.app.dataManager.isInitialized());
                const hasPetsData = !!(window.app && window.app.dataManager && window.app.dataManager.data && window.app.dataManager.data.pets);
                
                console.log(`🔍 Check ${retries + 1}:`, {
                    hasApp,
                    hasDataManager,
                    isInitialized,
                    hasPetsData,
                    petsCount: hasPetsData ? window.app.dataManager.data.pets.length : 0
                });
                
                if (hasApp && hasDataManager && isInitialized && hasPetsData) {
                    console.log('✅ All requirements met, proceeding with data loading...');
                    break;
                }
                
                retries++;
                if (retries < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 300)); // 增加等待时间
                }
            }
            
            // Final check after waiting
            if (!window.app || !window.app.dataManager) {
                console.error('❌ App or DataManager not available after waiting');
                console.log('🔍 Final state:', {
                    app: !!window.app,
                    dataManager: !!(window.app && window.app.dataManager),
                    initialized: !!(window.app && window.app.dataManager && window.app.dataManager.isInitialized())
                });
                return;
            }
            
            if (!window.app.dataManager.isInitialized()) {
                console.error('❌ DataManager not initialized after waiting');
                return;
            }
            
            console.log('🔍 Debug: DataManager data object:', window.app.dataManager.data);
            console.log('🔍 Debug: DataManager pets array:', window.app.dataManager.data?.pets);
            
            // Get pets data from data manager
            this.pets = window.app.dataManager.getPets();
            
            console.log('🔍 Debug: getPets() returned:', this.pets);
            console.log('🔍 Debug: pets type:', typeof this.pets);
            console.log('🔍 Debug: pets is array:', Array.isArray(this.pets));
            
            if (!this.pets || this.pets.length === 0) {
                console.warn('⚠️ No pets data available');
                // Try to get pets data directly for debugging
                console.log('Debug: DataManager pets data:', window.app.dataManager.data?.pets);
                // Initialize with empty array
                this.pets = [];
                if (!this.filteredPets) this.filteredPets = [];
                return;
            }
            
            console.log(`✅ Loaded ${this.pets.length} pets`);
            
            // Initialize filtered pets with all pets only if not already set
            if (!this.filteredPets || this.filteredPets.length === 0) {
                this.filteredPets = [...this.pets];
            }
            
            console.log('🔍 Debug: filteredPets after initialization:', this.filteredPets);
            console.log('🔍 Debug: filteredPets length:', this.filteredPets.length);
            
            // Update statistics
            this.updateStatistics();
        } catch (error) {
            console.error('❌ Failed to load pets data:', error);
            // Ensure arrays are always initialized
            this.pets = [];
            if (!this.filteredPets) this.filteredPets = [];
            throw error;
        }
    }

    /**
     * Setup event listeners for UI interactions
     */
    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('pets-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
        
        // Tier filter
        const tierFilter = document.getElementById('rarity-filter');
        if (tierFilter) {
            tierFilter.addEventListener('change', () => this.applyFilters());
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
        
        // Pagination buttons
        const prevButton = document.getElementById('prev-page');
        if (prevButton) {
            prevButton.addEventListener('click', () => this.goToPreviousPage());
        }
        
        const nextButton = document.getElementById('next-page');
        if (nextButton) {
            nextButton.addEventListener('click', () => this.goToNextPage());
        }
    }

    /**
     * Handle search input
     * @param {string} query - Search query
     */
    handleSearch(query) {
        console.log(`🔍 Searching pets: ${query}`);
        
        // 当用户开始搜索时，自动重置所有筛选器
        if (query && query.trim()) {
            this.resetFiltersForSearch();
        }
        
        this.applyFilters();
    }

    /**
     * Apply all filters and sort
     */
    applyFilters() {
        try {
            // Get filter values
            const searchQuery = document.getElementById('pets-search')?.value.toLowerCase() || '';
            const tierFilter = document.getElementById('rarity-filter')?.value || '';
            const sourceFilter = document.getElementById('source-filter')?.value || '';
            const sortFilter = document.getElementById('sort-filter')?.value || 'name';
            
            console.log('🔍 Applying filters:', { searchQuery, tierFilter, sourceFilter, sortFilter });
            
            // Start with all pets
            let filtered = [...this.pets];
            
            // Apply search filter
            if (searchQuery) {
                filtered = filtered.filter(pet => 
                    pet.name.toLowerCase().includes(searchQuery) ||
                    (pet.description && pet.description.toLowerCase().includes(searchQuery)) ||
                    (pet.trait && pet.trait.toLowerCase().includes(searchQuery)) ||
                    (pet.tier && pet.tier.toLowerCase().includes(searchQuery))
                );
            }
            
            // Apply tier filter
            if (tierFilter) {
                filtered = filtered.filter(pet => pet.tier === tierFilter);
            }
            
            // Apply source filter
            if (sourceFilter) {
                filtered = filtered.filter(pet => pet.source === sourceFilter);
            }
            
            // Apply sorting
            filtered = this.sortPets(filtered, sortFilter);
            
            // Update filtered pets
            this.filteredPets = filtered;
            
            // 重置到第一页
            this.currentPage = 1;
            
            // Render table with filtered data
            this.renderPetsTable();
            
            // Update statistics
            this.updateStatistics();
            
            // Show/hide empty state
            const emptyState = document.getElementById('empty-state');
            if (emptyState) {
                emptyState.style.display = filtered.length === 0 ? 'block' : 'none';
            }
        } catch (error) {
            console.error('❌ Error applying filters:', error);
        }
    }

    /**
     * Sort pets array
     * @param {Array} pets - Pets array to sort
     * @param {string} criteria - Sort criteria
     * @returns {Array} Sorted pets array
     */
    sortPets(pets, criteria) {
        switch (criteria) {
            case 'name':
                return [...pets].sort((a, b) => a.name.localeCompare(b.name));
            case 'rarity':
                const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical', 'Divine', 'Unknown'];
                return [...pets].sort((a, b) => {
                    const aIndex = rarityOrder.indexOf(a.tier);
                    const bIndex = rarityOrder.indexOf(b.tier);
                    return aIndex - bIndex;
                });
            case 'hatchChance':
                return [...pets].sort((a, b) => {
                    // Convert hatch chance to number for sorting
                    const aChance = parseFloat(a.hatchchance) || 0;
                    const bChance = parseFloat(b.hatchchance) || 0;
                    return bChance - aChance; // Higher chance first
                });
            case 'source':
                return [...pets].sort((a, b) => a.source.localeCompare(b.source));
            default:
                return pets;
        }
    }

    /**
     * Reset filters for search (without clearing search input)
     */
    resetFiltersForSearch() {
        console.log('🔄 Resetting filters for search...');
        
        // Reset tier filter
        const tierFilter = document.getElementById('rarity-filter');
        if (tierFilter) {
            tierFilter.value = '';
        }
        
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
        console.log('🔄 Resetting all filters');
        
        // Reset search input
        const searchInput = document.getElementById('pets-search');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Reset tier filter
        const tierFilter = document.getElementById('rarity-filter');
        if (tierFilter) {
            tierFilter.value = '';
        }
        
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
        
        // Reset filtered pets to all pets
        this.filteredPets = [...this.pets];
        
        // Render table with all pets
        this.renderPetsTable();
        
        // Update statistics
        this.updateStatistics();
        
        // Hide empty state
        const emptyState = document.getElementById('empty-state');
        if (emptyState) {
            emptyState.style.display = 'none';
        }
    }

    /**
     * Update statistics display
     */
    updateStatistics() {
        // Ensure arrays are initialized
        if (!this.pets || !Array.isArray(this.pets)) {
            this.pets = [];
        }
        if (!this.filteredPets || !Array.isArray(this.filteredPets)) {
            this.filteredPets = [];
        }
        
        const totalPetsElement = document.getElementById('total-pets');
        if (totalPetsElement) {
            totalPetsElement.textContent = `Total ${this.pets.length} pets`;
        }
        
        const filterResultsElement = document.getElementById('filter-results');
        if (filterResultsElement) {
            filterResultsElement.textContent = `Showing ${this.filteredPets.length} results`;
        }
    }

    /**
     * Render pets table
     */
    renderPetsTable() {
        console.log('🔍 Debug: renderPetsTable called');
        console.log('🔍 Debug: this.filteredPets at render time:', this.filteredPets);
        console.log('🔍 Debug: filteredPets type:', typeof this.filteredPets);
        console.log('🔍 Debug: filteredPets is array:', Array.isArray(this.filteredPets));
        
        const tableBody = document.getElementById('pets-table-body');
        if (!tableBody) {
            console.error('❌ Table body element not found');
            return;
        }
        
        // 检查表头是否存在
        const tableHead = document.querySelector('.data-table thead');
        const tableHeaders = document.querySelectorAll('.data-table th');
        console.log('🔍 Debug: Table head element found:', !!tableHead);
        console.log('🔍 Debug: Table headers count:', tableHeaders.length);
        console.log('🔍 Debug: Table headers text:', Array.from(tableHeaders).map(th => th.textContent));
        
        // Ensure filteredPets is initialized
        if (!this.filteredPets || !Array.isArray(this.filteredPets)) {
            console.warn('⚠️ filteredPets is not initialized or not an array, initializing as empty array');
            this.filteredPets = [];
        }
        
        console.log('🔍 Debug: About to process pets, count:', this.filteredPets.length);
        
        // 计算分页
        this.totalPages = Math.ceil(this.filteredPets.length / this.itemsPerPage);
        
        // 确保当前页面在有效范围内
        if (this.currentPage > this.totalPages) {
            this.currentPage = Math.max(1, this.totalPages);
        }
        
        // 获取当前页的宠物
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentPagePets = this.filteredPets.slice(startIndex, endIndex);
        
        console.log('🔍 Debug: Current page pets to display:', currentPagePets);
        console.log('🔍 Debug: Page info:', {
            currentPage: this.currentPage,
            totalPages: this.totalPages,
            itemsPerPage: this.itemsPerPage,
            totalPets: this.filteredPets.length
        });
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        // Add pet rows for current page
        currentPagePets.forEach(pet => {
            console.log('🔍 Debug: Creating row for pet:', pet);
            const row = this.createPetTableRow(pet);
            tableBody.appendChild(row);
        });
        
        // 更新分页控件
        this.updatePagination();
    }

    /**
     * Create table row for pet
     * @param {Object} pet - Pet object
     * @returns {HTMLTableRowElement} Table row element
     */
    createPetTableRow(pet) {
        console.log('🔍 Debug: Creating row for pet data:', pet);
        
        const row = document.createElement('tr');
        
        // Name cell with image and name combined
        const nameCell = document.createElement('td');
        nameCell.className = 'pet-name-cell sticky-column';
        
        // Image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'pet-image-container';
        const image = document.createElement('img');
        
        // 确保图片路径正确
        const imageName = pet.image || 'default.png';
        image.src = `./images/pets/${imageName}`;
        image.alt = pet.name || 'Unknown Pet';
        image.className = 'pet-image';
        
        // 添加更好的错误处理
        image.onerror = () => {
            console.warn(`❌ Failed to load image for ${pet.name}: ${imageName}`);
            // 尝试使用一个通用的图片或显示文字
            const placeholder = document.createElement('div');
            placeholder.className = 'pet-image-placeholder';
            placeholder.textContent = '🐾';
            placeholder.style.cssText = `
                width: 40px; 
                height: 40px; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                background: #f0f0f0; 
                border-radius: 8px; 
                font-size: 20px;
            `;
            imageContainer.replaceChild(placeholder, image);
        };
        
        // 添加加载成功的日志
        image.onload = () => {
            console.log(`✅ Successfully loaded image for ${pet.name}: ${imageName}`);
        };
        
        imageContainer.appendChild(image);
        nameCell.appendChild(imageContainer);
        
        // Name text
        const nameText = document.createElement('div');
        nameText.className = 'pet-name-text';
        nameText.textContent = pet.name || 'Unknown';
        nameCell.appendChild(nameText);
        
        row.appendChild(nameCell);
        
        // Tier cell - 使用正确的属性名
        const tierCell = document.createElement('td');
        const tierBadge = document.createElement('span');
        const tier = pet.tier || 'Unknown';
        tierBadge.className = `badge rarity ${tier.toLowerCase()}`;
        tierBadge.textContent = tier;
        tierCell.appendChild(tierBadge);
        row.appendChild(tierCell);
        
        // Trait cell - 使用trait属性
        const traitCell = document.createElement('td');
        traitCell.textContent = pet.trait || '-';
        traitCell.className = 'trait-cell';
        row.appendChild(traitCell);
        
        // Hatch Chance cell - 使用正确的属性名
        const hatchChanceCell = document.createElement('td');
        hatchChanceCell.textContent = pet.hatchchance || '-';
        hatchChanceCell.className = 'hatch-chance-cell';
        row.appendChild(hatchChanceCell);
        
        // Obtainable cell
        const obtainableCell = document.createElement('td');
        const obtainableText = pet.obtainable === true ? 'Yes' : pet.obtainable === false ? 'No' : (pet.obtainable || '-');
        obtainableCell.textContent = obtainableText;
        obtainableCell.className = 'obtainable-cell';
        
        // 添加颜色样式
        if (obtainableText === 'Yes') {
            obtainableCell.style.color = 'var(--success-color)';
            obtainableCell.style.fontWeight = '600';
        } else if (obtainableText === 'No') {
            obtainableCell.style.color = 'var(--error-color)';
            obtainableCell.style.fontWeight = '600';
        }
        
        row.appendChild(obtainableCell);
        
        console.log('🔍 Debug: Created row with cells:', {
            name: pet.name,
            tier: pet.tier,
            trait: pet.trait,
            hatchChance: pet.hatchchance,
            obtainable: pet.obtainable,
            imageName: imageName
        });
        
        return row;
    }

    /**
     * Go to previous page
     */
    goToPreviousPage() {
        console.log('🔍 Debug: goToPreviousPage called, current page:', this.currentPage);
        if (this.currentPage > 1) {
            this.currentPage--;
            console.log('🔍 Debug: Moving to page:', this.currentPage);
            this.renderPetsTable();
        } else {
            console.log('🔍 Debug: Already on first page');
        }
    }

    /**
     * Go to next page
     */
    goToNextPage() {
        console.log('🔍 Debug: goToNextPage called, current page:', this.currentPage, 'total pages:', this.totalPages);
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            console.log('🔍 Debug: Moving to page:', this.currentPage);
            this.renderPetsTable();
        } else {
            console.log('🔍 Debug: Already on last page');
        }
    }

    /**
     * Go to specific page
     * @param {number} page - Page number
     */
    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.renderPetsTable();
        }
    }

    /**
     * Update pagination controls
     */
    updatePagination() {
        // Update pagination info
        const paginationInfoElement = document.getElementById('pagination-info-text');
        if (paginationInfoElement) {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
            const endIndex = Math.min(this.currentPage * this.itemsPerPage, this.filteredPets.length);
            paginationInfoElement.textContent = `Showing ${startIndex}-${endIndex} of ${this.filteredPets.length} pets`;
        }

        // Update previous button
        const prevButton = document.getElementById('prev-page');
        if (prevButton) {
            prevButton.disabled = this.currentPage <= 1;
        }

        // Update next button
        const nextButton = document.getElementById('next-page');
        if (nextButton) {
            nextButton.disabled = this.currentPage >= this.totalPages;
        }

        // Update page numbers
        const paginationNumbers = document.getElementById('pagination-numbers');
        if (paginationNumbers) {
            paginationNumbers.innerHTML = '';
            
            // Calculate which page numbers to show
            const maxVisiblePages = 5;
            let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
            
            // Adjust start page if we're near the end
            if (endPage - startPage < maxVisiblePages - 1) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }

            // Add first page and ellipsis if needed
            if (startPage > 1) {
                this.createPageButton(paginationNumbers, 1);
                if (startPage > 2) {
                    const ellipsis = document.createElement('span');
                    ellipsis.textContent = '...';
                    ellipsis.className = 'pagination-ellipsis';
                    paginationNumbers.appendChild(ellipsis);
                }
            }

            // Add page numbers
            for (let i = startPage; i <= endPage; i++) {
                this.createPageButton(paginationNumbers, i);
            }

            // Add last page and ellipsis if needed
            if (endPage < this.totalPages) {
                if (endPage < this.totalPages - 1) {
                    const ellipsis = document.createElement('span');
                    ellipsis.textContent = '...';
                    ellipsis.className = 'pagination-ellipsis';
                    paginationNumbers.appendChild(ellipsis);
                }
                this.createPageButton(paginationNumbers, this.totalPages);
            }
        }
    }

    /**
     * Create page button
     * @param {HTMLElement} container - Container element
     * @param {number} pageNumber - Page number
     */
    createPageButton(container, pageNumber) {
        const button = document.createElement('button');
        button.textContent = pageNumber;
        button.className = `pagination-number ${pageNumber === this.currentPage ? 'active' : ''}`;
        button.addEventListener('click', () => this.goToPage(pageNumber));
        container.appendChild(button);
    }
}

// Initialize pets manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the pets page
    if (window.location.pathname.includes('pets.html') || window.location.pathname.endsWith('pets')) {
        console.log('🐾 Pets page detected, creating PetsManager');
        window.petsManager = new PetsManager();
        
        // Function to initialize pets manager
        const initializePetsManager = async () => {
            try {
                console.log('🐾 Starting PetsManager initialization...');
                await window.petsManager.init();
            } catch (error) {
                console.error('❌ Failed to initialize PetsManager:', error);
            }
        };
        
        // Wait for app to be initialized
        if (window.app && window.app.initialized) {
            console.log('🐾 App already initialized, starting PetsManager...');
            initializePetsManager();
        } else {
            console.log('🐾 Waiting for app initialization...');
            // Listen for app initialization event
            window.addEventListener('app:initialized', () => {
                console.log('🐾 App initialized event received, starting PetsManager...');
                initializePetsManager();
            });
            
            // Also check periodically in case the event was missed
            const checkAppReady = () => {
                if (window.app && window.app.initialized) {
                    console.log('🐾 App ready detected, starting PetsManager...');
                    initializePetsManager();
                } else {
                    setTimeout(checkAppReady, 500);
                }
            };
            setTimeout(checkAppReady, 1000);
        }
    }
}); 