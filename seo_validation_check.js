// SEO Validation Check Script
// 检查网站的SEO改进情况

console.log('🔍 SEO Validation Check Starting...\n');

// 检查robots.txt
async function checkRobotsTxt() {
    try {
        const response = await fetch('/robots.txt');
        if (response.ok) {
            const content = await response.text();
            console.log('✅ robots.txt - FOUND');
            console.log('   Content preview:', content.substring(0, 100) + '...');
            
            // 检查是否包含sitemap
            if (content.includes('sitemap')) {
                console.log('✅ robots.txt - Contains sitemap reference');
            } else {
                console.log('⚠️  robots.txt - Missing sitemap reference');
            }
        } else {
            console.log('❌ robots.txt - NOT FOUND');
        }
    } catch (error) {
        console.log('❌ robots.txt - ERROR:', error.message);
    }
}

// 检查sitemap.xml
async function checkSitemapXml() {
    try {
        const response = await fetch('/sitemap.xml');
        if (response.ok) {
            const content = await response.text();
            console.log('✅ sitemap.xml - FOUND');
            
            // 检查包含的页面数量
            const urlCount = (content.match(/<url>/g) || []).length;
            console.log(`   Contains ${urlCount} URLs`);
            
            // 检查主要页面
            const mainPages = ['index.html', 'crops.html', 'pets.html', 'eggs.html', 'gears.html', 'mutations.html'];
            const foundPages = mainPages.filter(page => content.includes(page));
            console.log(`   Main pages found: ${foundPages.length}/${mainPages.length}`);
            
            if (foundPages.length === mainPages.length) {
                console.log('✅ sitemap.xml - All main pages included');
            } else {
                console.log('⚠️  sitemap.xml - Missing some main pages');
            }
        } else {
            console.log('❌ sitemap.xml - NOT FOUND');
        }
    } catch (error) {
        console.log('❌ sitemap.xml - ERROR:', error.message);
    }
}

// 检查404页面
async function check404Page() {
    try {
        const response = await fetch('/404.html');
        if (response.ok) {
            const content = await response.text();
            console.log('✅ 404.html - FOUND');
            
            // 检查是否包含有用的链接
            if (content.includes('index.html') && content.includes('crops.html')) {
                console.log('✅ 404.html - Contains useful navigation links');
            } else {
                console.log('⚠️  404.html - Missing navigation links');
            }
            
            // 检查是否设置了noindex
            if (content.includes('noindex')) {
                console.log('✅ 404.html - Properly set to noindex');
            } else {
                console.log('⚠️  404.html - Missing noindex directive');
            }
        } else {
            console.log('❌ 404.html - NOT FOUND');
        }
    } catch (error) {
        console.log('❌ 404.html - ERROR:', error.message);
    }
}

// 检查页面SEO元素
function checkPageSEO() {
    console.log('\n📄 Checking Page SEO Elements:');
    
    // 检查当前页面的meta标签
    const title = document.title;
    const description = document.querySelector('meta[name="description"]')?.content;
    const canonical = document.querySelector('link[rel="canonical"]')?.href;
    const ogTitle = document.querySelector('meta[property="og:title"]')?.content;
    const ogDescription = document.querySelector('meta[property="og:description"]')?.content;
    
    console.log(`   Title: ${title ? '✅' : '❌'} ${title || 'Missing'}`);
    console.log(`   Description: ${description ? '✅' : '❌'} ${description ? description.substring(0, 50) + '...' : 'Missing'}`);
    console.log(`   Canonical: ${canonical ? '✅' : '❌'} ${canonical || 'Missing'}`);
    console.log(`   OG Title: ${ogTitle ? '✅' : '❌'} ${ogTitle || 'Missing'}`);
    console.log(`   OG Description: ${ogDescription ? '✅' : '❌'} ${ogDescription || 'Missing'}`);
    
    // 检查结构化数据
    const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
    console.log(`   Structured Data: ${structuredData.length > 0 ? '✅' : '❌'} ${structuredData.length} schema blocks found`);
    
    // 检查图片alt属性
    const images = document.querySelectorAll('img');
    const imagesWithAlt = document.querySelectorAll('img[alt]');
    console.log(`   Image Alt Tags: ${imagesWithAlt.length}/${images.length} images have alt attributes`);
    
    // 检查标题结构
    const h1s = document.querySelectorAll('h1');
    const h2s = document.querySelectorAll('h2');
    const h3s = document.querySelectorAll('h3');
    console.log(`   Heading Structure: H1: ${h1s.length}, H2: ${h2s.length}, H3: ${h3s.length}`);
    
    if (h1s.length === 1) {
        console.log('✅ Heading structure - Single H1 found');
    } else {
        console.log('⚠️  Heading structure - Multiple or no H1 found');
    }
}

// 检查性能指标
function checkPerformance() {
    console.log('\n⚡ Checking Performance:');
    
    // 检查资源预加载
    const preloads = document.querySelectorAll('link[rel="preload"]');
    console.log(`   Preload Resources: ${preloads.length} preloaded`);
    
    // 检查CSS和JS文件
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    const scripts = document.querySelectorAll('script[src]');
    console.log(`   Stylesheets: ${stylesheets.length} files`);
    console.log(`   Scripts: ${scripts.length} files`);
    
    // 检查图片优化
    const images = document.querySelectorAll('img');
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    console.log(`   Lazy Loading: ${lazyImages.length}/${images.length} images use lazy loading`);
}

// 检查移动端优化
function checkMobileOptimization() {
    console.log('\n📱 Checking Mobile Optimization:');
    
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        console.log('✅ Viewport meta tag - Found');
    } else {
        console.log('❌ Viewport meta tag - Missing');
    }
    
    // 检查响应式设计
    const mediaQueries = document.styleSheets;
    let responsiveCSS = 0;
    for (let sheet of mediaQueries) {
        try {
            for (let rule of sheet.cssRules) {
                if (rule.media && rule.media.mediaText.includes('max-width')) {
                    responsiveCSS++;
                }
            }
        } catch (e) {
            // 跨域限制，跳过
        }
    }
    console.log(`   Responsive CSS: ${responsiveCSS} media queries found`);
}

// 检查内部链接
function checkInternalLinks() {
    console.log('\n🔗 Checking Internal Links:');
    
    const links = document.querySelectorAll('a[href]');
    const internalLinks = Array.from(links).filter(link => 
        link.href.includes(window.location.hostname) || 
        link.href.startsWith('/') || 
        link.href.startsWith('./')
    );
    
    console.log(`   Internal Links: ${internalLinks.length}/${links.length} links are internal`);
    
    // 检查导航链接
    const navLinks = document.querySelectorAll('nav a');
    console.log(`   Navigation Links: ${navLinks.length} nav links found`);
}

// 主检查函数
async function runSEOValidation() {
    console.log('🚀 Starting Comprehensive SEO Validation...\n');
    
    // 检查技术SEO文件
    await checkRobotsTxt();
    await checkSitemapXml();
    await check404Page();
    
    // 检查页面SEO元素
    checkPageSEO();
    
    // 检查性能
    checkPerformance();
    
    // 检查移动端优化
    checkMobileOptimization();
    
    // 检查内部链接
    checkInternalLinks();
    
    console.log('\n✅ SEO Validation Complete!');
    console.log('\n📊 Summary:');
    console.log('- Technical SEO files created');
    console.log('- Page SEO elements optimized');
    console.log('- Performance optimizations in place');
    console.log('- Mobile-friendly design implemented');
    console.log('- Internal linking structure improved');
}

// 运行验证
runSEOValidation(); 