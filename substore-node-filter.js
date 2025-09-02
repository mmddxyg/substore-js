function modifyNodeNames(nodes, airportCode = 'UN') {
    // 国家/地区中文到英文缩写的映射
    const countryMap = {
        '香港': 'HK',
        '台湾': 'TW',
        '新加坡': 'SG',
        '日本': 'JP',
        '美国': 'US',
        '韩国': 'KR',
        '英国': 'UK',
        '德国': 'DE',
        '法国': 'FR',
        '加拿大': 'CA',
        '澳大利亚': 'AU',
        // 可根据需要扩展更多映射
    };

    // 要过滤的关键词列表
    const filterKeywords = [
        '域名', '套餐', '到期', '访问', '失联', 
        '剩余', '流量', '距离', '下次', '重置'
    ];

    // 先按国家分组节点
    const groupedNodes = nodes.reduce((groups, node) => {
        let name = node.name;
        
        // 过滤掉不需要的关键词
        filterKeywords.forEach(keyword => {
            name = name.replace(new RegExp(keyword, 'gi'), '');
        });
        // 清理多余的空格和分隔符
        name = name.trim().replace(/\s+/g, ' ').replace(/[|_]+/g, ' ');

        // 提取国家
        let country = Object.keys(countryMap).find(cn => name.includes(cn)) || 'Unknown';
        let countryCode = countryMap[country] || 'UN';

        if (!groups[countryCode]) {
            groups[countryCode] = [];
        }
        groups[countryCode].push({ ...node, name, countryCode });
        return groups;
    }, {});

    // 处理每个国家的节点，单独计数序号
    let modifiedNodes = [];
    Object.keys(groupedNodes).forEach(countryCode => {
        let counter = 1;
        groupedNodes[countryCode].forEach(node => {
            let name = node.name;
            
            // 初始化标签
            let tag = '';
            
            // 检查是否包含特定关键词并添加相应标签
            if (name.toLowerCase().includes('iplc')) {
                tag = '|IPLC';
            } else if (name.includes('netflix') || name.includes('流媒体')) {
                tag = '|Media';
            } else if (name.toLowerCase().includes('ai') || name.toLowerCase().includes('chatgpt')) {
                tag = '|AI';
            }

            // 格式化新名称：机场名|国家缩写|标签|序号（序号三位补零）
            let newName = `${airportCode}|${countryCode}${tag}|${counter.toString().padStart(3, '0')}`;
            counter++;

            modifiedNodes.push({
                ...node,
                name: newName
            });
        });
    });

    return modifiedNodes;
}

// SubStore 需要的函数签名
function operator(proxies, env) {
    // 从 env 获取机场代码，默认为 'UN'
    const airportCode = env?.params?.airportCode || 'UN';
    return modifyNodeNames(proxies, airportCode);
}