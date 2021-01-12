// 验证用户名
export function isValidUsername(str: string) {
  const validMap = ["admin", "editor"];
  return validMap.indexOf(str.trim()) >= 0;
}

// 判断字符串是否是https?:|mailto:|tal: 开头的
export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

// 一位数以上的小写字母
export function validateLowerCase(str: string) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

// 一位数以上的大写字母
export function validateUpperCase(str: string) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

// 邮箱验证
export function isValidateEmail(str: string) {
  const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  return reg.test(str);
}

// 6-13位数字
export function isValidatePhone(str: string) {
  const reg = /^\d{6,13}$/;
  return reg.test(str);
}

// 6位数字
export function isValidateNumber(str: string) {
  const reg = /^\d{6}$/;
  return reg.test(str);
}

// 6-18位非空白字符
export function isValidatePassword(str: string) {
  const reg = /^\S{6,18}$/;
  return reg.test(str);
}

// 4-18位数字
export function isValidateSmsCode(str: string) {
  const reg = /^\d{4,8}$/;
  return reg.test(str);
}

/**
 * 判断是否是纯字母
 * @param str :要验证的字符串
 */
export function isPureLetter(str: string) {
  const reg = /^[a-zA-Z]+$/;
  return reg.test(str);
}

/**
 * 判断纯数字
 * @param {number | string} value 要判断的字符串/数字
 */
export function isInter(value: number | string) {
  return !isNaN(+value);
}

/**
 * 数字大于0
 * @parame {string | number} value 要判断的字符串/数字
 */
export function interGreaterThanZero(value: string | number) {
  return value > 0;
}

/**
 * 数字大于等于0
 * @parame {string | number} value 要判断的字符串/数字
 */
export function interGreaterThanOrEqualZero(value: string | number) {
  return value >= 0;
}