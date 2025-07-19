/**
 * 验证固定表头功能的脚本
 * 可以在浏览器控制台中运行
 */

function verifyStickyHeader() {
    console.log('🔍 开始验证固定表头功能...');
    
    // 检查CSS文件是否加载
    const cssFiles = Array.from(document.styleSheets).map(sheet => {
        try {
            return sheet.href;
        } catch (e) {
            return 'inline-style';
        }
    });
    
    const hasStickyCSS = cssFiles.some(href => href && href.includes('eggs-sticky.css'));
    console.log('✅ CSS文件检查:', hasStickyCSS ? '已加载' : '❌ 未找到');
    
    // 检查表格元素
    const table = document.querySelector('.eggs-table');
    const thead = document.querySelector('.eggs-table .data-table thead');
    const ths = document.querySelectorAll('.eggs-table .data-table thead th');
    
    console.log('✅ 表格元素检查:');
    console.log('  - 表格容器:', table ? '存在' : '❌ 不存在');
    console.log('  - 表头:', thead ? '存在' : '❌ 不存在');
    console.log('  - 表头列数:', ths.length);
    
    if (table && thead) {
        // 检查CSS样式
        const tableStyles = window.getComputedStyle(table);
        const theadStyles = window.getComputedStyle(thead);
        
        console.log('✅ 样式检查:');
        console.log('  - 表格overflow-y:', tableStyles.overflowY);
        console.log('  - 表格max-height:', tableStyles.maxHeight);
        console.log('  - 表头position:', theadStyles.position);
        console.log('  - 表头top:', theadStyles.top);
        console.log('  - 表头z-index:', theadStyles.zIndex);
        
        // 检查每个th的样式
        ths.forEach((th, index) => {
            const thStyles = window.getComputedStyle(th);
            console.log(`  - 第${index + 1}列 position:`, thStyles.position);
        });
        
        // 模拟滚动测试
        if (table.scrollHeight > table.clientHeight) {
            console.log('✅ 滚动测试: 表格内容超出容器，可以滚动');
            
            // 滚动到中间位置
            table.scrollTop = table.scrollHeight / 2;
            
            setTimeout(() => {
                const rect = thead.getBoundingClientRect();
                const tableRect = table.getBoundingClientRect();
                
                console.log('✅ 固定位置测试:');
                console.log('  - 表头相对视窗位置:', rect.top);
                console.log('  - 表格相对视窗位置:', tableRect.top);
                console.log('  - 表头是否固定:', Math.abs(rect.top - tableRect.top) < 5 ? '是' : '否');
                
                // 重置滚动位置
                table.scrollTop = 0;
            }, 100);
        } else {
            console.log('⚠️  滚动测试: 表格内容未超出容器，无法测试滚动');
        }
    }
    
    // 检查响应式
    const screenWidth = window.innerWidth;
    console.log('✅ 响应式检查:');
    console.log('  - 屏幕宽度:', screenWidth + 'px');
    console.log('  - 设备类型:', screenWidth <= 480 ? '小屏手机' : screenWidth <= 768 ? '移动端' : '桌面端');
    
    // 检查移动端特性
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log('  - 移动设备:', isMobile ? '是' : '否');
    console.log('  - 触摸支持:', 'ontouchstart' in window ? '是' : '否');
    
    console.log('🎉 验证完成！');
    
    return {
        cssLoaded: hasStickyCSS,
        tableExists: !!table,
        theadExists: !!thead,
        columnCount: ths.length,
        canScroll: table ? table.scrollHeight > table.clientHeight : false,
        screenWidth: screenWidth,
        isMobile: isMobile
    };
}

// 如果在浏览器环境中，自动运行验证
if (typeof window !== 'undefined') {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', verifyStickyHeader);
    } else {
        verifyStickyHeader();
    }
}

// 导出函数供手动调用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = verifyStickyHeader;
}