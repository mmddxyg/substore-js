// Sub-Store 节点重命名脚本
// 规则：去 emoji → 国家映射 → 分类标签 → 统一命名

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

// 计数器
if (typeof globalThis.renameCounter === "undefined") {
  globalThis.renameCounter = {};
}

// Sub-Store 会调用这个函数
function rename(node) {
  if (!node || !node.name) return node;

  let name = removeEmoji(node.name);

  // 国家识别
  let country = "ZZ";
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
  if (!globalThis.renameCounter[key]) globalThis.renameCounter[key] = 1;
  else globalThis.renameCounter[key]++;

  // 新名字
  node.name = ${country} | ${tag} | ${String(globalThis.renameCounter[key]).padStart(2, "0")};

  return node;
}
