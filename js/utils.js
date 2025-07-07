/**
 * Garden Pro Calculator - Utility Functions Library
 * Contains common utility functions and helper methods
 */

// ===== Data Processing Tools =====

/**
 * Format number as currency
 * @param {number} value - Numeric value
 * @param {string} currency - Currency symbol (default: '')
 * @returns {string} Formatted string
 */
function formatCurrency(value, currency = '') {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return currency + value.toLocaleString();
}

/**
 * Format percentage
 * @param {number} value - Numeric value
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage string
 */
function formatPercentage(value, decimals = 1) {
    if (typeof value !== 'number' || isNaN(value)) return '0%';
    return value.toFixed(decimals) + '%';
}

/**
 * Safely parse JSON
 * @param {string} jsonString - JSON string
 * @param {*} defaultValue - Default value
 * @returns {*} Parsed object or default value
 */
function safeJSONParse(jsonString, defaultValue = null) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.warn('JSON parsing failed:', error);
        return defaultValue;
    }
}

/**
 * Deep clone object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone(obj[key]);
            }
        }
        return cloned;
    }
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Whether to execute immediately
 * @returns {Function} Debounced function
 */
function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== DOM Manipulation Tools =====

/**
 * Safely get DOM element
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (optional)
 * @returns {Element|null} DOM element or null
 */
function $(selector, parent = document) {
    try {
        return parent.querySelector(selector);
    } catch (error) {
        console.warn('Selector error:', selector, error);
        return null;
    }
}

/**
 * Safely get all matching DOM elements
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (optional)
 * @returns {NodeList} List of DOM elements
 */
function $$(selector, parent = document) {
    try {
        return parent.querySelectorAll(selector);
    } catch (error) {
        console.warn('Selector error:', selector, error);
        return [];
    }
}

/**
 * Create DOM element
 * @param {string} tag - Tag name
 * @param {Object} attributes - Attributes object
 * @param {string|Element|Array} children - Child elements
 * @returns {Element} Created DOM element
 */
function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.keys(attributes).forEach(key => {
        if (key === 'className') {
            element.className = attributes[key];
        } else if (key === 'style' && typeof attributes[key] === 'object') {
            Object.assign(element.style, attributes[key]);
        } else if (key.startsWith('data-')) {
            element.setAttribute(key, attributes[key]);
        } else {
            element[key] = attributes[key];
        }
    });
    
    // Add child elements
    if (typeof children === 'string') {
        element.textContent = children;
    } else if (children instanceof Element) {
        element.appendChild(children);
    } else if (Array.isArray(children)) {
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Element) {
                element.appendChild(child);
            }
        });
    }
    
    return element;
}

/**
 * Add event listener (supports event delegation)
 * @param {Element|string} target - Target element or selector
 * @param {string} event - Event type
 * @param {Function} handler - Event handler function
 * @param {string} delegateSelector - Delegate selector (optional)
 */
function addEvent(target, event, handler, delegateSelector = null) {
    const element = typeof target === 'string' ? $(target) : target;
    if (!element) return;
    
    if (delegateSelector) {
        element.addEventListener(event, (e) => {
            if (e.target.matches(delegateSelector)) {
                handler.call(e.target, e);
            }
        });
    } else {
        element.addEventListener(event, handler);
    }
}

/**
 * Remove event listener
 * @param {Element|string} target - Target element or selector
 * @param {string} event - Event type
 * @param {Function} handler - Event handler function
 */
function removeEvent(target, event, handler) {
    const element = typeof target === 'string' ? $(target) : target;
    if (!element) return;
    
    element.removeEventListener(event, handler);
}

// ===== Local Storage Tools =====

/**
 * Set local storage data
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Whether storage was successful
 */
function setLocalStorage(key, value) {
    try {
        const serialized = JSON.stringify(value);
        localStorage.setItem(key, serialized);
        return true;
    } catch (error) {
        console.warn('Failed to set local storage:', error);
        return false;
    }
}

/**
 * Get local storage data
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value
 * @returns {*} Stored value or default value
 */
function getLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn('Failed to get local storage:', error);
        return defaultValue;
    }
}

/**
 * Remove local storage data
 * @param {string} key - Storage key
 * @returns {boolean} Whether removal was successful
 */
function removeLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.warn('Failed to remove local storage:', error);
        return false;
    }
}

/**
 * Clear local storage data
 * @param {string} prefix - Key prefix (optional)
 * @returns {boolean} Whether clearing was successful
 */
function clearLocalStorage(prefix = null) {
    try {
        if (prefix) {
            // Clear only keys with specified prefix
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(prefix)) {
                    localStorage.removeItem(key);
                }
            });
        } else {
            // Clear all local storage
            localStorage.clear();
        }
        return true;
    } catch (error) {
        console.warn('Failed to clear local storage:', error);
        return false;
    }
}

// ===== Array Processing Tools =====

/**
 * Sort array by field
 * @param {Array} array - Array to sort
 * @param {string} field - Field name to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted array
 */
function sortByField(array, field, order = 'asc') {
    return array.sort((a, b) => {
        const valueA = a[field];
        const valueB = b[field];
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === 'asc' 
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        }
        
        if (order === 'asc') {
            return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        } else {
            return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        }
    });
}

/**
 * Filter array by conditions
 * @param {Array} array - Array to filter
 * @param {Object} filters - Filter conditions object
 * @returns {Array} Filtered array
 */
function filterByConditions(array, filters) {
    return array.filter(item => {
        return Object.keys(filters).every(key => {
            const filterValue = filters[key];
            const itemValue = item[key];
            
            if (Array.isArray(filterValue)) {
                return filterValue.includes(itemValue);
            }
            
            if (typeof filterValue === 'object' && filterValue !== null) {
                const { min, max } = filterValue;
                return (!min || itemValue >= min) && (!max || itemValue <= max);
            }
            
            return itemValue === filterValue;
        });
    });
}

/**
 * Search in array
 * @param {Array} array - Array to search
 * @param {string} query - Search query
 * @param {Array} fields - Fields to search in (default: ['name'])
 * @returns {Array} Search results
 */
function searchInArray(array, query, fields = ['name']) {
    if (!query) return array;
    
    const lowerQuery = query.toLowerCase();
    return array.filter(item => {
        return fields.some(field => {
            const value = item[field];
            return value && value.toString().toLowerCase().includes(lowerQuery);
        });
    });
}

// ===== String Processing Tools =====

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalize(str) {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert to camelCase
 * @param {string} str - String to convert
 * @returns {string} camelCase string
 */
function toCamelCase(str) {
    return str.replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''));
}

/**
 * Convert to kebab-case
 * @param {string} str - String to convert
 * @returns {string} kebab-case string
 */
function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}

/**
 * Generate random ID
 * @param {number} length - ID length (default: 8)
 * @returns {string} Random ID
 */
function generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// ===== Date Processing Tools =====

/**
 * Format date
 * @param {number|Date} timestamp - Timestamp or Date object
 * @param {string} format - Format string (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns {string} Formatted date string
 */
function formatDate(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
    if (!(date instanceof Date) || isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}

/**
 * Get relative time
 * @param {number|Date} timestamp - Timestamp or Date object
 * @returns {string} Relative time string
 */
function getRelativeTime(timestamp) {
    const now = new Date();
    const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin} minutes ago`;
    if (diffHour < 24) return `${diffHour} hours ago`;
    if (diffDay < 30) return `${diffDay} days ago`;
    
    return formatDate(date, 'YYYY-MM-DD');
}

// ===== Validation Tools =====

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} Whether email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Check if value is within range
 * @param {number} value - Value to check
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} Whether value is within range
 */
function isInRange(value, min, max) {
    return value >= min && value <= max;
}

/**
 * Validate string length
 * @param {string} str - String to validate
 * @param {number} minLength - Minimum length (default: 0)
 * @param {number} maxLength - Maximum length (default: Infinity)
 * @returns {boolean} Whether string length is valid
 */
function isValidLength(str, minLength = 0, maxLength = Infinity) {
    if (typeof str !== 'string') return false;
    return str.length >= minLength && str.length <= maxLength;
}

// ===== Performance Tools =====

/**
 * Simple performance measurement
 * @param {Function} fn - Function to measure
 * @param {string} label - Label for measurement (optional)
 * @returns {*} Function result
 */
function measurePerformance(fn, label = 'Function') {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${label} execution time: ${(end - start).toFixed(2)}ms`);
    return result;
}

// ===== Export for use in other modules =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatCurrency,
        formatPercentage,
        safeJSONParse,
        deepClone,
        debounce,
        throttle,
        $,
        $$,
        createElement,
        addEvent,
        removeEvent,
        setLocalStorage,
        getLocalStorage,
        removeLocalStorage,
        clearLocalStorage,
        sortByField,
        filterByConditions,
        searchInArray,
        capitalize,
        toCamelCase,
        toKebabCase,
        generateId,
        formatDate,
        getRelativeTime,
        isValidEmail,
        isInRange,
        isValidLength,
        measurePerformance
    };
}

// ===== Global Utils object for browser environment =====
if (typeof window !== 'undefined') {
    window.Utils = {
        formatCurrency,
        formatPercentage,
        safeJSONParse,
        deepClone,
        debounce,
        throttle,
        $,
        $$,
        createElement,
        addEvent,
        removeEvent,
        setLocalStorage,
        getLocalStorage,
        removeLocalStorage,
        clearLocalStorage,
        sortByField,
        filterByConditions,
        searchInArray,
        capitalize,
        toCamelCase,
        toKebabCase,
        generateId,
        formatDate,
        getRelativeTime,
        isValidEmail,
        isInRange,
        isValidLength,
        measurePerformance
    };
}