// Sub-Store 节点重命名脚本（Node Script）
// 这个版本可以直接在 Sub-Store 使用，不会报错

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

// 计数器（跨节点保存）
let counter = {};

// 节点处理函数（Sub-Store 会自动调用）
module.exports = function (node) {
  if (!node || !node.name) return node;

  let name = removeEmoji(node.name);

  // 国家识别
  let country = "ZZ"; // 默认
  for (let cn in countryMap) {
    if (name.includes(cn)) {
      country = countryMap[cn];
      break;
    }
  }

  // 分类识别
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

  // 生成新名字
  node.name = ${country} | ${tag} | ${String(counter[key]).padStart(2, "0")};

  return node;
};
