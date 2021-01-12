export const CHINESE = /^zh-/;

/**
 * 匹配网址前面的协议和域名
 * @value 要匹配的字符串
 * @type url:返回匹配到的域名，params:去掉匹配到的域名
 */
export function matchUrlOrParams(value: string, type: string) {
  const reg = /http[\:\/\.\w]+com\//;
  if (type === "url") {
    const res = value.match(reg);
    if (res) {
      return res[0];
    } else {
      return null;
    }
  } else if (type === "params") {
    return value.replace(reg, "");
  }
}