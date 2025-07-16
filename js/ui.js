/**
 * Garden Pro Calculator - UI Interaction Management
 * Responsible for interface interactions, notification system, modals, form processing and other UI functions
 */

class UIManager {
    constructor() {
        this.notifications = [];
        this.modals = new Map();
        this.activeModal = null;
        this.animations = new Map();
        
        console.log('🎨 UI Manager initialized');
    }

    /**
     * Initialize UI Manager
     */
    init() {
        this.setupGlobalEventListeners();
        this.initComponents();
        this.setupKeyboardShortcuts();
        this.initValueToWeightModule(); // 新增
    }

    /**
     * 初始化 Value to Weight 反推重量模块
     */
    initValueToWeightModule() {
        const input = document.getElementById('target-value-input');
        const btn = document.getElementById('calculate-weight-btn');
        const resultDiv = document.getElementById('value-to-weight-result');
        if (!input || !btn || !resultDiv) return;

        // 计算并渲染结果
        const calculateAndRender = () => {
            const targetValue = parseFloat(input.value);
            if (!targetValue || targetValue <= 0) {
                resultDiv.innerHTML = '<div class="calc-row-compact" style="color:#FFD700;">Please enter a valid target value.</div>';
                return;
            }
            try {
                // 获取当前作物、变异、加成参数（与主计算器保持一致）
                const crop = window.selectedCrop || null;
                const mutations = window.selectedMutations || {};
                const friendBoost = typeof window.selectedFriendBoost === 'number' ? window.selectedFriendBoost : 0;
                const maxMutation = !!window.selectedMaxMutation;
                if (!crop) {
                    resultDiv.innerHTML = '<div class="calc-row-compact" style="color:#FFD700;">Please select a crop first.</div>';
                    return;
                }
                // 计算
                const { requiredWeight, details } = window.calculator.calculateWeightForTargetValue(
                    crop, mutations, targetValue, null, friendBoost, maxMutation
                );
                // 渲染结果
                resultDiv.innerHTML = `
                    <div class="calc-row-compact final-value" style="font-size:1.2em;">
                        <span class="calc-label">Required Weight:</span>
                        <span class="calc-value-large">${requiredWeight.toFixed(2)} kg</span>
                    </div>
                    <div class="calc-row-compact"><span class="calc-label">Crop:</span><span class="calc-value">${details.cropName}</span></div>
                    <div class="calc-row-compact"><span class="calc-label">Target Value:</span><span class="calc-value">${details.targetValue.toLocaleString()} Sheckles</span></div>
                    <div class="calc-row-compact"><span class="calc-label">Base Weight:</span><span class="calc-value">${details.baseWeight} kg</span></div>
                    <div class="calc-row-compact"><span class="calc-label">Weight Ratio:</span><span class="calc-value">${details.weightRatio.toFixed(2)}x</span></div>
                    <div class="calc-row-compact"><span class="calc-label">Total Multiplier:</span><span class="calc-value">${details.multiplier.toFixed(2)}x</span></div>
                `;
            } catch (e) {
                resultDiv.innerHTML = `<div class='calc-row-compact' style='color:#FFD700;'>${e.message}</div>`;
            }
        };
        // 按钮点击
        btn.addEventListener('click', calculateAndRender);
        // 回车触发
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') calculateAndRender();
        });
    }

    /**
     * Setup global event listeners
     */
    setupGlobalEventListeners() {
        // Listen for application state changes
        window.addEventListener('app:state-changed', (event) => {
            this.handleStateChange(event.detail);
        });

        // Listen for window resize
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));

        // Listen for keyboard events
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardEvent(event);
        });

        // Listen for click events (for closing modals, etc.)
        document.addEventListener('click', (event) => {
            this.handleGlobalClick(event);
        });
    }

    /**
     * Initialize UI components
     */
    initComponents() {
        this.initNotificationContainer();
        // this.initLoadingOverlay(); // 移除未使用的loading overlay
        this.setupFormValidation();
        this.setupAnimations();
    }

    /**
     * Create notification container
     */
    initNotificationContainer() {
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
    }

    /**
     * Create loading overlay
     */
    initLoadingOverlay() {
        if (!document.getElementById('loading-overlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p class="loading-text">Loading...</p>
                </div>
            `;
            document.body.appendChild(overlay);
        }
    }

    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, warning, info)
     * @param {number} duration - Display duration (milliseconds)
     * @returns {string} Notification ID
     */
    showNotification(message, type = 'info', duration = 5000) {
        const id = Utils.generateId();
        const notification = {
            id,
            message,
            type,
            timestamp: Date.now()
        };

        this.notifications.push(notification);
        this.renderNotification(notification);

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                this.removeNotification(id);
            }, duration);
        }

        return id;
    }

    /**
     * Render notification
     * @param {Object} notification - Notification object
     */
    renderNotification(notification) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const element = document.createElement('div');
        element.className = `notification notification-${notification.type}`;
        element.dataset.id = notification.id;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        element.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icons[notification.type] || icons.info}</span>
                <span class="notification-message">${notification.message}</span>
                <button class="notification-close" onclick="uiManager.removeNotification('${notification.id}')">&times;</button>
            </div>
        `;

        container.appendChild(element);

        // Add entrance animation
        setTimeout(() => {
            element.classList.add('notification-show');
        }, 10);
    }

    /**
     * Remove notification
     * @param {string} id - Notification ID
     */
    removeNotification(id) {
        const element = document.querySelector(`[data-id="${id}"]`);
        if (element) {
            element.classList.add('notification-hide');
            setTimeout(() => {
                element.remove();
            }, 300);
        }

        this.notifications = this.notifications.filter(n => n.id !== id);
    }

    /**
     * Clear all notifications
     */
    clearNotifications() {
        this.notifications.forEach(notification => {
            this.removeNotification(notification.id);
        });
    }

    /**
     * Show modal
     * @param {string} id - Modal ID
     * @param {Object} options - Modal options
     */
    showModal(id, options = {}) {
        const modal = this.createModal(id, options);
        this.modals.set(id, modal);
        this.activeModal = id;

        document.body.appendChild(modal);
        document.body.classList.add('modal-open');

        // Add show animation
        setTimeout(() => {
            modal.classList.add('modal-show');
        }, 10);

        // Focus management
        const firstFocusable = modal.querySelector('input, button, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }

        return modal;
    }

    /**
     * Create modal
     * @param {string} id - Modal ID
     * @param {Object} options - Modal options
     * @returns {HTMLElement} Modal element
     */
    createModal(id, options) {
        const modal = document.createElement('div');
        modal.id = id;
        modal.className = 'modal';
        modal.dataset.modalId = id;

        const defaultOptions = {
            title: 'Modal',
            content: '',
            closable: true,
            size: 'medium',
            backdrop: true
        };

        const config = { ...defaultOptions, ...options };

        modal.innerHTML = `
            <div class="modal-overlay" ${config.backdrop ? 'onclick="uiManager.hideModal(\'' + id + '\')"' : ''}></div>
            <div class="modal-content modal-${config.size}">
                <div class="modal-header">
                    <h3 class="modal-title">${config.title}</h3>
                    ${config.closable ? '<button class="modal-close" onclick="uiManager.hideModal(\'' + id + '\')">&times;</button>' : ''}
                </div>
                <div class="modal-body">
                    ${config.content}
                </div>
                ${config.footer ? '<div class="modal-footer">' + config.footer + '</div>' : ''}
            </div>
        `;

        return modal;
    }

    /**
     * Hide modal
     * @param {string} id - Modal ID
     */
    hideModal(id) {
        const modal = this.modals.get(id);
        if (!modal) return;

        modal.classList.add('modal-hide');
        
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            this.modals.delete(id);
            document.body.classList.remove('modal-open');
            
            if (this.activeModal === id) {
                this.activeModal = null;
            }
        }, 300);
    }

    /**
     * Handle modal actions
     * @param {string} modalId - Modal ID
     * @param {string} action - Action type
     * @param {Event} event - Event object
     */
    handleModalAction(modalId, action, event) {
        const modal = this.modals.get(modalId);
        if (!modal) return;

        switch (action) {
            case 'close':
                this.hideModal(modalId);
                break;
            case 'confirm':
                // Trigger custom confirm event
                modal.dispatchEvent(new CustomEvent('modal:confirm', { detail: { modalId, event } }));
                break;
            // Add more actions as needed
        }
    }

    /**
     * Show loading overlay
     * @param {string} message - Loading message
     */
    showLoading(message = 'Loading...') {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            const textElement = overlay.querySelector('.loading-text');
            if (textElement) {
                textElement.textContent = message;
            }
            overlay.classList.add('loading-show');
        }
    }

    /**
     * Hide loading overlay
     */
    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('loading-show');
        }
    }

    /**
     * Setup form validation
     */
    setupFormValidation() {
        document.addEventListener('submit', (event) => {
            const form = event.target;
            if (form.tagName !== 'FORM') return;

            // Check if form has validation enabled
            if (form.hasAttribute('data-validate')) {
                event.preventDefault();
                
                if (this.validateForm(form)) {
                    // Form is valid, trigger custom submit event
                    form.dispatchEvent(new CustomEvent('form:valid-submit', { 
                        detail: { form, originalEvent: event } 
                    }));
                }
            }
        });

        // Real-time field validation
        document.addEventListener('blur', (event) => {
            const field = event.target;
            if (field.hasAttribute('data-validate-field')) {
                this.validateField(field);
            }
        }, true);
    }

    /**
     * Validate form
     * @param {HTMLFormElement} form - Form element
     * @returns {boolean} Whether form is valid
     */
    validateForm(form) {
        const fields = form.querySelectorAll('[data-validate-field]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Validate field
     * @param {HTMLElement} field - Form field element
     * @returns {boolean} Whether field is valid
     */
    validateField(field) {
        const rules = field.getAttribute('data-validate-field').split('|');
        const value = field.value.trim();
        
        for (const rule of rules) {
            const [ruleName, ruleValue] = rule.split(':');
            
            switch (ruleName) {
                case 'required':
                    if (!value) {
                        this.showFieldError(field, 'This field is required');
                        return false;
                    }
                    break;
                    
                case 'min':
                    if (value.length < parseInt(ruleValue)) {
                        this.showFieldError(field, `Minimum ${ruleValue} characters required`);
                        return false;
                    }
                    break;
                    
                case 'max':
                    if (value.length > parseInt(ruleValue)) {
                        this.showFieldError(field, `Maximum ${ruleValue} characters allowed`);
                        return false;
                    }
                    break;
                    
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (value && !emailRegex.test(value)) {
                        this.showFieldError(field, 'Please enter a valid email address');
                        return false;
                    }
                    break;
                    
                case 'number':
                    if (value && isNaN(value)) {
                        this.showFieldError(field, 'Please enter a valid number');
                        return false;
                    }
                    break;
                    
                case 'min-number':
                    const minValue = parseFloat(ruleValue);
                    if (value && parseFloat(value) < minValue) {
                        this.showFieldError(field, `Value must be at least ${minValue}`);
                        return false;
                    }
                    break;
            }
        }

        this.clearFieldError(field);
        return true;
    }

    /**
     * Show field error
     * @param {HTMLElement} field - Form field element
     * @param {string} message - Error message
     */
    showFieldError(field, message) {
        // Remove existing error
        this.clearFieldError(field);
        
        // Add error class
        field.classList.add('field-error');
        
        // Create error element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error-message';
        errorElement.textContent = message;
        errorElement.setAttribute('data-error-for', field.name || field.id);
        
        // Insert error message
        if (field.parentNode) {
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
    }

    /**
     * Clear field error
     * @param {HTMLElement} field - Form field element
     */
    clearFieldError(field) {
        field.classList.remove('field-error');
        
        const errorElement = field.parentNode?.querySelector(`[data-error-for="${field.name || field.id}"]`);
        if (errorElement) {
            errorElement.remove();
        }
    }

    /**
     * Setup animations
     */
    setupAnimations() {
        this.setupScrollAnimations();
        this.setupHoverAnimations();
    }

    /**
     * Setup scroll animations
     */
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                } else {
                    entry.target.classList.remove('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements with scroll animation
        document.querySelectorAll('[data-scroll-animation]').forEach(element => {
            observer.observe(element);
        });
    }

    /**
     * Setup hover animations
     */
    setupHoverAnimations() {
        document.querySelectorAll('[data-hover-animation]').forEach(element => {
            element.addEventListener('mouseenter', () => {
                const animation = element.getAttribute('data-hover-animation');
                element.classList.add(`hover-${animation}`);
            });

            element.addEventListener('mouseleave', () => {
                const animation = element.getAttribute('data-hover-animation');
                element.classList.remove(`hover-${animation}`);
            });
        });
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        const shortcuts = {
            'Escape': () => {
                if (this.activeModal) {
                    this.hideModal(this.activeModal);
                }
            },
            'ctrl+k': (event) => {
                event.preventDefault();
                this.focusSearchInput();
            },
            'ctrl+/': (event) => {
                event.preventDefault();
                this.showShortcutHelp();
            }
        };

        this.shortcuts = shortcuts;
    }

    /**
     * Handle keyboard events
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyboardEvent(event) {
        const key = event.key;
        const combo = [
            event.ctrlKey && 'ctrl',
            event.altKey && 'alt',
            event.shiftKey && 'shift',
            key.toLowerCase()
        ].filter(Boolean).join('+');

        if (this.shortcuts[combo]) {
            this.shortcuts[combo](event);
        } else if (this.shortcuts[key]) {
            this.shortcuts[key](event);
        }
    }

    /**
     * Handle state changes
     * @param {Object} state - Application state
     */
    handleStateChange(state) {
        // Update UI based on state changes
        console.log('State changed:', state);
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Handle responsive adjustments
        this.updateViewportClasses();
    }

    /**
     * Handle global clicks
     * @param {MouseEvent} event - Click event
     */
    handleGlobalClick(event) {
        // Handle clicks outside of modals, dropdowns, etc.
    }

    /**
     * Focus search input
     */
    focusSearchInput() {
        const searchInputs = [
            document.getElementById('crop-search'),
            document.getElementById('pets-search'),
            document.querySelector('.search-input')
        ].filter(Boolean);

        if (searchInputs.length > 0) {
            searchInputs[0].focus();
            searchInputs[0].select();
        }
    }

    /**
     * Scroll to element
     * @param {HTMLElement|string} target - Target element or selector
     * @param {Object} options - Scroll options
     */
    scrollToElement(target, options = {}) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return;

        const defaultOptions = {
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        };

        element.scrollIntoView({ ...defaultOptions, ...options });
    }

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} Whether copy was successful
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('Copied to clipboard', 'success', 2000);
            return true;
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            this.showNotification('Failed to copy to clipboard', 'error', 3000);
            return false;
        }
    }

    /**
     * Update viewport classes
     */
    updateViewportClasses() {
        const width = window.innerWidth;
        const body = document.body;
        
        // Remove existing viewport classes
        body.classList.remove('viewport-mobile', 'viewport-tablet', 'viewport-desktop');
        
        // Add appropriate viewport class
        if (width < 768) {
            body.classList.add('viewport-mobile');
        } else if (width < 1024) {
            body.classList.add('viewport-tablet');
        } else {
            body.classList.add('viewport-desktop');
        }
    }

    /**
     * Show shortcut help
     */
    showShortcutHelp() {
        const helpContent = `
            <div class="shortcut-help">
                <h4>Keyboard Shortcuts</h4>
                <div class="shortcut-list">
                    <div class="shortcut-item">
                        <kbd>Esc</kbd>
                        <span>Close modal</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>K</kbd>
                        <span>Focus search</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>/</kbd>
                        <span>Show this help</span>
                    </div>
                </div>
            </div>
        `;

        this.showModal('shortcut-help', {
            title: 'Keyboard Shortcuts',
            content: helpContent,
            size: 'small'
        });
    }
}

// Global UI manager instance
let uiManager = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    uiManager = new UIManager();
    uiManager.init();
    
    // Make globally available
    window.uiManager = uiManager;
});

// Export for use by other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UIManager };
}