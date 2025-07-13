/**
 * SEO Validation Tool for GAG Calculator
 * Checks structured data issues reported by Google Search Console
 */

class SEOValidator {
    constructor() {
        this.issues = [];
        this.fixes = [];
    }

    /**
     * Validate Product Schema structured data
     */
    validateProductSchema() {
        const productSchemas = document.querySelectorAll('script[type="application/ld+json"]');
        
        productSchemas.forEach((script, index) => {
            try {
                const data = JSON.parse(script.textContent);
                
                if (data['@type'] === 'Product') {
                    console.log(`🔍 Validating Product Schema #${index + 1}`);
                    
                    // Check for required fields
                    this.checkRequiredField(data, 'image', 'Product Schema', '严重问题 - 缺少image字段');
                    this.checkRequiredField(data, 'offers', 'Product Schema', '严重问题 - 缺少offers字段');
                    
                    // Check offers sub-fields
                    if (data.offers) {
                        this.checkRequiredField(data.offers, 'shippingDetails', 'Product Schema offers', '非严重问题 - 缺少shippingDetails字段');
                        this.checkRequiredField(data.offers, 'hasMerchantReturnPolicy', 'Product Schema offers', '非严重问题 - 缺少hasMerchantReturnPolicy字段');
                    }
                    
                    // Validate image URL
                    if (data.image) {
                        this.validateImageUrl(data.image, 'Product Schema');
                    }
                }
            } catch (error) {
                console.error(`❌ Error parsing JSON in script #${index + 1}:`, error);
                this.issues.push({
                    type: 'JSON Parse Error',
                    message: `Script #${index + 1} contains invalid JSON`,
                    severity: 'error'
                });
            }
        });
    }

    /**
     * Check if a required field exists
     */
    checkRequiredField(data, fieldName, context, message) {
        if (!data[fieldName]) {
            this.issues.push({
                type: 'Missing Required Field',
                context: context,
                field: fieldName,
                message: message,
                severity: fieldName === 'image' ? 'critical' : 'warning'
            });
            
            console.warn(`⚠️ ${message}`);
        } else {
            console.log(`✅ ${context} has ${fieldName} field`);
        }
    }

    /**
     * Validate image URL format
     */
    validateImageUrl(imageUrl, context) {
        if (typeof imageUrl === 'string') {
            if (!imageUrl.startsWith('http')) {
                this.issues.push({
                    type: 'Invalid Image URL',
                    context: context,
                    field: 'image',
                    message: 'Image URL should be absolute (start with http/https)',
                    severity: 'warning'
                });
                console.warn(`⚠️ ${context}: Image URL should be absolute`);
            } else {
                console.log(`✅ ${context}: Valid image URL format`);
            }
        } else if (Array.isArray(imageUrl)) {
            imageUrl.forEach((url, index) => {
                if (!url.startsWith('http')) {
                    this.issues.push({
                        type: 'Invalid Image URL',
                        context: context,
                        field: `image[${index}]`,
                        message: 'Image URL should be absolute (start with http/https)',
                        severity: 'warning'
                    });
                    console.warn(`⚠️ ${context}: Image URL[${index}] should be absolute`);
                }
            });
        }
    }

    /**
     * Generate fixes for common issues
     */
    generateFixes() {
        this.fixes = [];
        
        this.issues.forEach(issue => {
            if (issue.field === 'image' && issue.severity === 'critical') {
                this.fixes.push({
                    field: 'image',
                    fix: 'Add image field to Product Schema',
                    code: `"image": "https://growagardencalculator.blog/images/screenshots/calculator-interface.png",`
                });
            }
            
            if (issue.field === 'shippingDetails') {
                this.fixes.push({
                    field: 'shippingDetails',
                    fix: 'Add shippingDetails to offers',
                    code: `"shippingDetails": {
    "@type": "OfferShippingDetails",
    "shippingRate": {
        "@type": "MonetaryAmount",
        "value": "0",
        "currency": "USD"
    },
    "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 0,
            "unitCode": "DAY"
        },
        "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 0,
            "unitCode": "DAY"
        }
    }
}`
                });
            }
            
            if (issue.field === 'hasMerchantReturnPolicy') {
                this.fixes.push({
                    field: 'hasMerchantReturnPolicy',
                    fix: 'Add hasMerchantReturnPolicy to offers',
                    code: `"hasMerchantReturnPolicy": {
    "@type": "MerchantReturnPolicy",
    "applicableCountry": "US",
    "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
    "merchantReturnDays": 30,
    "returnMethod": "https://schema.org/ReturnByMail",
    "returnFees": "https://schema.org/FreeReturn"
}`
                });
            }
        });
    }

    /**
     * Display validation results
     */
    displayResults() {
        console.log('\n📊 SEO Validation Results:');
        console.log('========================');
        
        if (this.issues.length === 0) {
            console.log('✅ No issues found! All structured data is valid.');
            return;
        }
        
        console.log(`\n❌ Found ${this.issues.length} issues:`);
        
        const criticalIssues = this.issues.filter(issue => issue.severity === 'critical');
        const warnings = this.issues.filter(issue => issue.severity === 'warning');
        
        if (criticalIssues.length > 0) {
            console.log(`\n🚨 Critical Issues (${criticalIssues.length}):`);
            criticalIssues.forEach(issue => {
                console.log(`   • ${issue.message}`);
            });
        }
        
        if (warnings.length > 0) {
            console.log(`\n⚠️ Warnings (${warnings.length}):`);
            warnings.forEach(issue => {
                console.log(`   • ${issue.message}`);
            });
        }
        
        // Generate and display fixes
        this.generateFixes();
        if (this.fixes.length > 0) {
            console.log('\n🔧 Suggested Fixes:');
            this.fixes.forEach(fix => {
                console.log(`\n   ${fix.field}:`);
                console.log(`   ${fix.fix}`);
                console.log(`   Code: ${fix.code}`);
            });
        }
    }

    /**
     * Run complete validation
     */
    runValidation() {
        console.log('🔍 Starting SEO validation...');
        this.validateProductSchema();
        this.displayResults();
        
        // Return results for external use
        return {
            issues: this.issues,
            fixes: this.fixes,
            hasCriticalIssues: this.issues.some(issue => issue.severity === 'critical'),
            totalIssues: this.issues.length
        };
    }
}

// Auto-run validation when script loads
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        const validator = new SEOValidator();
        const results = validator.runValidation();
        
        // Store results globally for debugging
        window.seoValidationResults = results;
        
        // Display results in console
        if (results.hasCriticalIssues) {
            console.error('🚨 Critical SEO issues detected! Please fix these issues.');
        } else if (results.totalIssues > 0) {
            console.warn('⚠️ SEO warnings detected. Consider fixing these issues.');
        } else {
            console.log('✅ All SEO checks passed!');
        }
    });
}

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SEOValidator;
} 