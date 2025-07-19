/**
 * 通用固定表头功能验证脚本
 * 可以验证eggs和gears表格的固定表头功能
 */

function verifyAllStickyHeaders() {
    console.log('🔍 开始验证所有固定表头功能...');
    
    const results = {
        eggs: null,
        gears: null,
        summary: {}
    };
    
    // 检查CSS文件是否加载
    const cssFiles = Array.from(document.styleSheets).map(sheet => {
        try {
            return sheet.href;
        } catch (e) {
            return 'inline-style';
        }
    });
    
    const hasEggsStickyCSS = cssFiles.some(href => href && href.includes('eggs-sticky.css'));
    const hasGearsStickyCSS = cssFiles.some(href => href && href.includes('gears-sticky.css'));
    
    console.log('✅ CSS文件检查:');
    console.log('  - Eggs Sticky CSS:', hasEggsStickyCSS ? '已加载' : '❌ 未找到');
    console.log('  - Gears Sticky CSS:', hasGearsStickyCSS ? '已加载' : '❌ 未找到');
    
    // 验证Eggs表格
    results.eggs = verifyTableStickyHeader('eggs');
    
    // 验证Gears表格
    results.gears = verifyTableStickyHeader('gears');
    
    // 生成总结
    results.summary = {
        totalTables: 0,
        workingTables: 0,
        cssLoaded: hasEggsStickyCSS || hasGearsStickyCSS,
        screenWidth: window.innerWidth,
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        deviceType: window.innerWidth <= 480 ? '小屏手机' : window.innerWidth <= 768 ? '移动端' : '桌面端'
    };
    
    if (results.eggs) results.summary.totalTables++;
    if (results.gears) results.summary.totalTables++;
    
    if (results.eggs && results.eggs.working) results.summary.workingTables++;
    if (results.gears && results.gears.working) results.summary.workingTables++;
    
    console.log('🎉 验证总结:');
    console.log(`  - 找到表格: ${results.summary.totalTables}`);
    console.log(`  - 正常工作: ${results.summary.workingTables}`);
    console.log(`  - 设备类型: ${results.summary.deviceType}`);
    console.log(`  - 屏幕宽度: ${results.summary.screenWidth}px`);
    console.log(`  - 移动设备: ${results.summary.isMobile ? '是' : '否'}`);
    
    return results;
}

function verifyTableStickyHeader(tableType) {
    console.log(`\n🔍 验证${tableType.toUpperCase()}表格固定表头...`);
    
    const table = document.querySelector(`.${tableType}-table`);
    const thead = document.querySelector(`.${tableType}-table .data-table thead`);
    const ths = document.querySelectorAll(`.${tableType}-table .data-table thead th`);
    
    if (!table) {
        console.log(`❌ ${tableType.toUpperCase()}表格不存在`);
        return null;
    }
    
    console.log(`✅ ${tableType.toUpperCase()}表格元素检查:`);
    console.log('  - 表格容器:', table ? '存在' : '❌ 不存在');
    console.log('  - 表头:', thead ? '存在' : '❌ 不存在');
    console.log('  - 表头列数:', ths.length);
    
    const result = {
        exists: !!table,
        theadExists: !!thead,
        columnCount: ths.length,
        canScroll: false,
        working: false,
        styles: {}
    };
    
    if (table && thead) {
        // 检查CSS样式
        const tableStyles = window.getComputedStyle(table);
        const theadStyles = window.getComputedStyle(thead);
        
        result.styles = {
            tableOverflowY: tableStyles.overflowY,
            tableMaxHeight: tableStyles.maxHeight,
            theadPosition: theadStyles.position,
            theadTop: theadStyles.top,
            theadZIndex: theadStyles.zIndex
        };
        
        console.log(`✅ ${tableType.toUpperCase()}样式检查:`);
        console.log('  - 表格overflow-y:', result.styles.tableOverflowY);
        console.log('  - 表格max-height:', result.styles.tableMaxHeight);
        console.log('  - 表头position:', result.styles.theadPosition);
        console.log('  - 表头top:', result.styles.theadTop);
        console.log('  - 表头z-index:', result.styles.theadZIndex);
        
        // 检查每个th的样式
        ths.forEach((th, index) => {
            const thStyles = window.getComputedStyle(th);
            console.log(`  - 第${index + 1}列 position:`, thStyles.position);
        });
        
        // 检查是否可以滚动
        result.canScroll = table.scrollHeight > table.clientHeight;
        console.log(`✅ ${tableType.toUpperCase()}滚动测试:`, result.canScroll ? '可以滚动' : '内容未超出容器');
        
        // 判断是否正常工作
        result.working = (
            result.styles.theadPosition === 'sticky' &&
            result.styles.theadTop === '0px' &&
            parseInt(result.styles.theadZIndex) >= 10
        );
        
        console.log(`${result.working ? '✅' : '❌'} ${tableType.toUpperCase()}固定表头:`, result.working ? '正常工作' : '可能有问题');
        
        // 如果可以滚动，进行滚动测试
        if (result.canScroll) {
            console.log(`🔄 ${tableType.toUpperCase()}滚动测试中...`);
            
            // 滚动到中间位置
            table.scrollTop = table.scrollHeight / 2;
            
            setTimeout(() => {
                const rect = thead.getBoundingClientRect();
                const tableRect = table.getBoundingClientRect();
                
                console.log(`✅ ${tableType.toUpperCase()}固定位置测试:`);
                console.log('  - 表头相对视窗位置:', rect.top);
                console.log('  - 表格相对视窗位置:', tableRect.top);
                console.log('  - 表头是否固定:', Math.abs(rect.top - tableRect.top) < 5 ? '是' : '否');
                
                // 重置滚动位置
                table.scrollTop = 0;
            }, 100);
        }
    }
    
    return result;
}

// 如果在浏览器环境中，自动运行验证
if (typeof window !== 'undefined') {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', verifyAllStickyHeaders);
    } else {
        // 延迟一点时间确保CSS加载完成
        setTimeout(verifyAllStickyHeaders, 500);
    }
}

// 导出函数供手动调用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { verifyAllStickyHeaders, verifyTableStickyHeader };
}