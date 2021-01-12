// 将elementUI的Form表单验证需要函数放在这里
import { isPureLetter, isInter, interGreaterThanZero, interGreaterThanOrEqualZero } from "@/utils/validate";

// 验证第一次输入的密码
/**
 * 给form表单的refName是表单的ref名字
 * @param Arg:传入当前的this指向
 */
export function validatePass(Arg: any, params: any, refName: string) {
  return function inline(rule: any, value: any, callback: (params?: any) => void) {
    if (value === '') {
      callback(new Error('请输入密码'));
    } else {
      if (params.checkPassword !== '') {
        console.log(Arg.$refs);
        Arg.$refs[refName].validateField('checkPassword');
      }
      callback();
    }
  }
}

/**
 * 验证重复输入的密码是否正确
 * @param Arg :传入当前的this指向
 */
export function validatePass2(Arg: any, params: any, refName: string) {
  return function inline(rule: any, value: any, callback: (params?: any) => void) {
    console.log('再次输入密码检查')
    if (value === '') {
      callback(new Error('请再次输入密码'));
    } else if (value !== params.password) {
      callback(new Error('两次输入密码不一致!'));
    } else {
      callback();
    }
  };
}

/**
 * @param rule elementForm表单的验证规则
 * @param value 验证的值
 * @param callback 回调函数
 */
export function startTimeValidator(rule: any, value: any, callback: (params?: any) => void) {
  if (value) {
    // 判断传入的开始时间需要大于当前时间
    const time = new Date(value).getTime();
    const day = new Date().getTime();
    console.log('time：', time);
    console.log('day', day);
    if (new Date(value).getTime() < new Date().getTime()) {
      callback(new Error('开始时间需要大于当前时间!'));
    } else {
      callback();
    }
  } else {
    callback();
  }
}

/**
 * 判断form表单输入的数字需要在某个区间范围内
 * @param first 开始区间
 * @param end 结束区间
 */
export function numberRange(first: number, end: number) {
  return function inline(rule: any, value: any, callback: (params?: any) => void) {
    console.log('检查输入数字区间范围');
    if (value >= first && value <= end) {
      callback();
    } else {
      callback(new Error(`参数需要在${first}至${end}范围内`));
    }
  };
}

/**
 * 判断参数是纯字母
 * @param name 要判断的参数的名字
 */
export function pureLetter(name: string) {
  return function inline(rule: any, value: any, callback: (params?: any) => void) {
    console.log('检查纯字母');
    const res = isPureLetter(value);
    if (res) {
      callback();
    } else {
      callback(new Error(`${name}必须是纯字母`));
    }
  }
}

/**
 * 判断参数必须是纯数字
 * @param  {string} name 要判断的参数的名字
 */
export function valueIsInter(name: string) {
  return function inline(rule: any, value: any, callback: (params?: any) => void) {
    console.log('检查纯数字');
    const res = isInter(value);
    if (res) {
      callback();
    } else {
      callback(new Error(`${name}必须是数字`));
    }
  }
}

/**
 * 判断参数大于0
 * @param  {string} name 要判断的参数的名字
 */
export function valueGreaterThanZero(name: string) {
  return function inline(rule: any, value: any, callback: (params?: any) => void) {
    console.log('检查数字大于0');
    const res = interGreaterThanZero(value);
    if (res) {
      callback();
    } else {
      callback(new Error(`${name}必须大于0`));
    }
  }
}

/**
 * 判断参数大于0
 * @param  {string} name 要判断的参数的名字
 */
export function valueGreaterThanOrEqualZero(name: string) {
  return function inline(rule: any, value: any, callback: (params?: any) => void) {
    console.log('检查数字大于等于0');
    const res = interGreaterThanOrEqualZero(value);
    if (res) {
      callback();
    } else {
      callback(new Error(`${name}必须大于等于0`));
    }
  }
}