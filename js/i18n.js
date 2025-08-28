/**
 * Internationalization (i18n) Manager
 * Handles multilingual support for the Garden Calculator
 */

class I18nManager {
    constructor() {
        this.currentLanguage = 'en';
        this.fallbackLanguage = 'en';
        this.translations = {};
        this.dataCache = {};
        this.supportedLanguages = ['en', 'zh', 'es', 'ko', 'fr', 'de', 'pt', 'ru', 'id'];
        this.initialized = false;
        
        console.log('🌐 I18nManager initialized');
    }

    /**
     * Initialize the i18n system
     * @returns {Promise<boolean>} Success status
     */
    async init() {
        try {
            // Load default language (English)
            await this.loadTranslations(this.fallbackLanguage);
            
            // Detect user's preferred language
            const userLanguage = this.detectUserLanguage();
            
            // Load user's language if different from fallback
            if (userLanguage !== this.fallbackLanguage) {
                await this.loadTranslations(userLanguage);
                this.currentLanguage = userLanguage;
            }
            
            this.initialized = true;
            console.log(`✅ I18n initialized with language: ${this.currentLanguage}`);
            
            return true;
        } catch (error) {
            console.error('❌ I18n initialization failed:', error);
            return false;
        }
    }

    /**
     * Detect user's preferred language
     * @returns {string} Language code
     */
    detectUserLanguage() {
        // 1. Check localStorage for saved preference
        const savedLanguage = localStorage.getItem('garden-calculator-language');
        if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
            return savedLanguage;
        }
        
        // 2. Check browser language
        const browserLanguage = navigator.language || navigator.userLanguage;
        const langCode = browserLanguage.split('-')[0].toLowerCase();
        
        if (this.supportedLanguages.includes(langCode)) {
            return langCode;
        }
        
        // 3. Check browser languages array
        if (navigator.languages) {
            for (const lang of navigator.languages) {
                const code = lang.split('-')[0].toLowerCase();
                if (this.supportedLanguages.includes(code)) {
                    return code;
                }
            }
        }
        
        // 4. Default to fallback language
        return this.fallbackLanguage;
    }

    /**
     * Load translations for a specific language
     * @param {string} language - Language code
     * @returns {Promise<void>}
     */
    async loadTranslations(language) {
        if (!this.supportedLanguages.includes(language)) {
            console.warn(`Unsupported language: ${language}`);
            return;
        }

        try {
            const response = await fetch(`data/translations/${language}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load translations for ${language}`);
            }
            
            const translations = await response.json();
            this.translations[language] = translations;
            
            console.log(`📄 Loaded translations for: ${language}`);
        } catch (error) {
            console.error(`❌ Failed to load translations for ${language}:`, error);
            
            // If it's not the fallback language, try to load fallback
            if (language !== this.fallbackLanguage) {
                console.log(`🔄 Falling back to ${this.fallbackLanguage}`);
                await this.loadTranslations(this.fallbackLanguage);
            }
        }
    }

    /**
     * Get translation for a key
     * @param {string} key - Translation key (e.g., 'nav.crops')
     * @param {Object} params - Parameters for interpolation
     * @returns {string} Translated text
     */
    t(key, params = {}) {
        const translation = this.getTranslation(key, this.currentLanguage) || 
                           this.getTranslation(key, this.fallbackLanguage) || 
                           key;
        
        return this.interpolate(translation, params);
    }

    /**
     * Get raw translation without fallback
     * @param {string} key - Translation key
     * @param {string} language - Language code
     * @returns {string|null} Translation or null if not found
     */
    getTranslation(key, language) {
        const langTranslations = this.translations[language];
        if (!langTranslations) {
            return null;
        }

        const keys = key.split('.');
        let value = langTranslations;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return null;
            }
        }
        
        return typeof value === 'string' ? value : null;
    }

    /**
     * Interpolate parameters into translation string
     * @param {string} text - Text with placeholders
     * @param {Object} params - Parameters to interpolate
     * @returns {string} Interpolated text
     */
    interpolate(text, params) {
        if (!params || typeof params !== 'object') {
            return text;
        }
        
        return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return key in params ? params[key] : match;
        });
    }

    /**
     * Switch to a different language
     * @param {string} language - Target language code
     * @returns {Promise<boolean>} Success status
     */
    async switchLanguage(language) {
        if (!this.supportedLanguages.includes(language)) {
            console.warn(`Unsupported language: ${language}`);
            return false;
        }

        if (language === this.currentLanguage) {
            console.log(`Already using language: ${language}`);
            return true;
        }

        try {
            // Load translations if not already loaded
            if (!this.translations[language]) {
                await this.loadTranslations(language);
            }
            
            const previousLanguage = this.currentLanguage;
            this.currentLanguage = language;
            
            // Save to localStorage
            localStorage.setItem('garden-calculator-language', language);
            
            // Update page content
            this.translatePage();
            
            // Update language indicator
            this.updateLanguageIndicator();
            
            // Trigger language change event
            this.dispatchLanguageChangeEvent(previousLanguage, language);
            
            console.log(`🔄 Language switched from ${previousLanguage} to ${language}`);
            return true;
            
        } catch (error) {
            console.error(`❌ Failed to switch to language ${language}:`, error);
            return false;
        }
    }

    /**
     * Translate all elements on the page with data-i18n attributes
     */
    translatePage() {
        if (!this.initialized) {
            console.warn('I18n not initialized, cannot translate page');
            return;
        }

        // Translate elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (translation !== key) {
                element.textContent = translation;
            }
        });

        // Translate placeholder attributes
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            
            if (translation !== key) {
                element.placeholder = translation;
            }
        });

        // Translate title attributes
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = this.t(key);
            
            if (translation !== key) {
                element.title = translation;
            }
        });

        // Translate aria-label attributes
        document.querySelectorAll('[data-i18n-aria]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria');
            const translation = this.t(key);
            
            if (translation !== key) {
                element.setAttribute('aria-label', translation);
            }
        });

        console.log(`📝 Page translated to ${this.currentLanguage}`);
    }

    /**
     * Update language indicator in the UI
     */
    updateLanguageIndicator() {
        const langText = document.querySelector('.lang-text');
        if (langText) {
            langText.textContent = this.t('common.language');
        }
        
        // Update selected state in language dropdown
        document.querySelectorAll('.lang-option').forEach(option => {
            const lang = option.getAttribute('data-lang');
            option.classList.toggle('active', lang === this.currentLanguage);
        });
    }

    /**
     * Dispatch language change event
     * @param {string} previousLanguage - Previous language code
     * @param {string} newLanguage - New language code
     */
    dispatchLanguageChangeEvent(previousLanguage, newLanguage) {
        const event = new CustomEvent('languageChanged', {
            detail: {
                previous: previousLanguage,
                current: newLanguage,
                i18n: this
            }
        });
        
        window.dispatchEvent(event);
    }

    /**
     * Get current language
     * @returns {string} Current language code
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get available languages
     * @returns {Array<string>} Array of supported language codes
     */
    getSupportedLanguages() {
        return [...this.supportedLanguages];
    }

    /**
     * Check if a language is supported
     * @param {string} language - Language code to check
     * @returns {boolean} Whether language is supported
     */
    isLanguageSupported(language) {
        return this.supportedLanguages.includes(language);
    }

    /**
     * Get language name in its own language
     * @param {string} language - Language code
     * @returns {string} Language name
     */
    getLanguageName(language) {
        const names = {
            'en': 'English',
            'zh': '中文',
            'es': 'Español',
            'ko': '한국어',
            'fr': 'Français',
            'de': 'Deutsch',
            'pt': 'Português',
            'ru': 'Русский',
            'id': 'Bahasa Indonesia'
        };
        
        return names[language] || language;
    }

    /**
     * Format number according to current language
     * @param {number} number - Number to format
     * @param {Object} options - Intl.NumberFormat options
     * @returns {string} Formatted number
     */
    formatNumber(number, options = {}) {
        try {
            const localeMap = {
                'zh': 'zh-CN',
                'es': 'es-ES',
                'ko': 'ko-KR',
                'fr': 'fr-FR',
                'de': 'de-DE',
                'pt': 'pt-PT',
                'ru': 'ru-RU',
                'id': 'id-ID',
                'en': 'en-US'
            };
            const locale = localeMap[this.currentLanguage] || 'en-US';
            return new Intl.NumberFormat(locale, options).format(number);
        } catch (error) {
            console.warn('Number formatting failed, using fallback:', error);
            return number.toLocaleString();
        }
    }

    /**
     * Format date according to current language
     * @param {Date} date - Date to format
     * @param {Object} options - Intl.DateTimeFormat options
     * @returns {string} Formatted date
     */
    formatDate(date, options = {}) {
        try {
            const localeMap = {
                'zh': 'zh-CN',
                'es': 'es-ES',
                'ko': 'ko-KR',
                'fr': 'fr-FR',
                'de': 'de-DE',
                'pt': 'pt-PT',
                'ru': 'ru-RU',
                'id': 'id-ID',
                'en': 'en-US'
            };
            const locale = localeMap[this.currentLanguage] || 'en-US';
            return new Intl.DateTimeFormat(locale, options).format(date);
        } catch (error) {
            console.warn('Date formatting failed, using fallback:', error);
            return date.toLocaleDateString();
        }
    }

    /**
     * Debug method to list all available translation keys
     * @param {string} language - Language to inspect (default: current)
     * @returns {Array<string>} Array of all translation keys
     */
    getAvailableKeys(language = this.currentLanguage) {
        const translations = this.translations[language];
        if (!translations) {
            return [];
        }
        
        const keys = [];
        
        function extractKeys(obj, prefix = '') {
            for (const key in obj) {
                const fullKey = prefix ? `${prefix}.${key}` : key;
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    extractKeys(obj[key], fullKey);
                } else {
                    keys.push(fullKey);
                }
            }
        }
        
        extractKeys(translations);
        return keys.sort();
    }
}

// Create global i18n instance
window.i18n = new I18nManager();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.i18n.init();
    });
} else {
    window.i18n.init();
}