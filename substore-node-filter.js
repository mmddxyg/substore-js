// Sub-Store 节点重命名脚本
// 使用方式：将此文件上传到 GitHub，然后在 Sub-Store 里作为远程脚本引用

// 国家映射表
const countryMap = {
  "香港": "HK",
  "台湾": "TW",
  "日本": "JP",
  "韩国": "KR",
  "新加坡": "SG",
  "美国": "US",
  "英国": "UK",
  "德国": "DE",
  "法国": "FR",
  "加拿大": "CA",
  "澳大利亚": "AU",
  "俄罗斯": "RU",
  "印度": "IN",
  "泰国": "TH",
  "越南": "VN",
  "菲律宾": "PH",
  "马来西亚": "MY",
  "印尼": "ID"
};

// 分类关键词
const categories = [
  { key: "IPLC", regex: /(IPLC|I\s*PLC)/i },
  { key: "AI", regex: /(chatgpt|ai)/i },
  { key: "Media", regex: /(流媒体|奈飞|Netflix|迪士尼|Disney|HBO|Prime|HULU)/i }
];

// 去掉 emoji
function removeEmoji(str) {
  return str.replace(
    /[\u{1F300}-\u{1FAFF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
    ""
  );
}

// 入口函数
module.exports.parse = (raw, { yaml, notify }) => {
  let nodes = yaml.parse(raw).proxies || [];

  // 过滤掉无效节点
  nodes = nodes.filter(n => n && n.name);

  // 处理节点
  let result = [];
  let counter = {};

  nodes.forEach(node => {
    let name = removeEmoji(node.name);

    // 识别国家
    let country = "ZZ"; // 默认
    for (let cn in countryMap) {
      if (name.includes(cn)) {
        country = countryMap[cn];
        break;
      }
    }

    // 分类标签
    let tag = "General";
    for (let cat of categories) {
      if (cat.regex.test(name)) {
        tag = cat.key;
        break;
      }
    }

    // 计数器
    const key = ${country}|${tag};
    if (!counter[key]) counter[key] = 1;
    else counter[key]++;

    // 新名字
    node.name = ${country} | ${tag} | ${String(counter[key]).padStart(2, "0")};
    result.push(node);
  });

  return yaml.stringify({ proxies: result });
};
