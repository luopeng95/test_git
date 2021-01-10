import { timestampToTime } from './time';

// 节流
export function throttle(fn: any, wait: number = 200) {
  let timer: any = null;
  return function(this: any, ...args: any[]) {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      console.log(this, args);
      fn.apply(this, args);
      timer = null;
    }, wait);
  };
}

// 防抖
export function debounce(
  func: any,
  wait: number = 20,
  immediate: boolean = false,
) {
  let timeout: any;

  return function(this: any, ...args: any[]) {
    if (timeout) {
      clearTimeout(timeout);
    }
    if (immediate) {
      // 如果已经执行过，不再执行
      const callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) {
        func.apply(this, args);
      }
    } else {
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    }
  };
}

export function preciseStringLength(str: string) {
  // 通过unicode计算字符串的精确长度
  if (typeof str !== "string") {
    throw Error("Parameters must be a string");
  }
  return str.replace(/([^x00-xff])/g, "rr").length;
}

export function preciseSubstr(s: string, n: number) {
  // 精确截断 通过unicode来截断
  return s
    .slice(0, n)
    .replace(/([^x00-xff])/g, "$1a")
    .slice(0, n)
    .replace(/([^x00-xff])a/g, "$1");
}

export function formatSeconds(second_time: string) {
  // 时间格式化为秒数

  let time = parseInt(second_time, 10) + "秒";
  if (parseInt(second_time, 10) > 60) {
    const second = parseInt(second_time, 10) % 60;
    let min = parseInt(second_time, 10) / 60;
    time = min + "分" + second + "秒";

    if (min > 60) {
      min = (parseInt(second_time, 10) / 60) % 60;
      let hour = parseInt(second_time, 10) / 60 / 60;
      time = hour + "小时" + min + "分" + second + "秒";

      if (hour > 24) {
        hour = (parseInt(second_time, 10) / 60 / 60) % 24;
        const day = parseInt(second_time, 10) / 60 / 60 / 24;
        time = day + "天" + hour + "小时" + min + "分" + second + "秒";
      }
    }
  }

  return time;
}

// 将科学计数法转换为小数
export function toNonExponential(val: string) {
  const num = Number.parseFloat(val);
  const m: any = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  return num.toFixed(Math.max(0, (m[1] || "").length - m[2]));
}

/**
 * js缓动函数
 * @export
 * @param {Number} currentY
 * @param {Number} targetY
 */
export function scrollAnimation(currentY: number, targetY: number) {
  // 计算需要移动的距离
  const needScrollTop = targetY - currentY;
  let _currentY = currentY;
  setTimeout(() => {
    // 一次调用滑动帧数
    const dist = Math.ceil(needScrollTop / 10);
    _currentY += dist;
    window.scrollTo(0, currentY);
    if (needScrollTop > 10 || needScrollTop < -10) {
      scrollAnimation(_currentY, targetY);
    } else {
      window.scrollTo(0, targetY);
    }
  }, 1);
}

/**
 * 跳转到指定锚点
 * @export
 * @param {String} domStr ： DOM('.class' , '#id' ,'div')
 * @returns void;
 */
export function linkto(domStr: any) {
  if (!domStr) {
    return;
  }
  if (!("scrollTo" in window)) {
    location.href = domStr;
    return;
  }
  const dom = document.querySelector(domStr);
  if (
    typeof window.getComputedStyle(document.body).scrollBehavior === "undefined"
  ) {
    // 处理scrollIntoView不支持object浏览器向下兼容处理
    const targetY = dom.offsetTop;
    const currentY =
      document.documentElement.scrollTop || document.body.scrollTop;
    scrollAnimation(currentY, targetY);
    return;
  }
  if (!dom) {
    return;
  }
  dom.scrollIntoView({
    // 兼容到IE6
    behavior: "smooth",
    block: "start",
  });
}

export function filterCong(val: number) {
  return val / 10e8;
}

/**
 * @name 获取url中的转为Obj
 * @param {String} str
 * @returns get_query('?name=jiawei&age=18') => { ?name: "jiawei", age: "18" }
 */
export function get_query(str: string | undefined) {
  // url转obj
  if (!str) {
    str = location.search.substring(1);
  }
  const query_scan = str
    ? JSON.parse(
      '{"' + str.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
      function(key, value) {
        return key === "" ? value : decodeURIComponent(value);
      },
    )
    : {};
  return query_scan;
}

/**
 * @name Obj 转url
 * @param {Object} param
 * @param {String} key
 * @param {Boolean} encode
 * @returns if(param Type is Object) return "&code=111&name=jiawei"
 * @returns urlEncode('jiawei','name') => "&name=jiawei"
 * @returns urlEncode( {name:'jiawei'} ) => "&name=jiawei"
 */
export function urlEncode(param: any, key: string, encode: boolean) {
  // obj转url
  if (param == null) {
    return "";
  }
  let paramStr = "";
  const t = typeof param;
  if (t === "string" || t === "number" || t === "boolean") {
    paramStr +=
      "&" +
      key +
      "=" +
      (encode == null || encode ? encodeURIComponent(param) : param);
  } else {
    for (const i in param) {
      const k =
        key == null
          ? i
          : key + (param instanceof Array ? "[" + i + "]" : "." + i);
      paramStr += urlEncode(param[i], k, encode);
    }
  }
  return paramStr;
}

/**
 * @name 判断元素是否进入可视区域
 * @returns Boolean
 */
export function isInViewPortOfTwo(el: any) {
  const viewPortHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  const top = el.getBoundingClientRect() && el.getBoundingClientRect().top;
  return top <= viewPortHeight + 100;
}

/**
 * @name 获取浏览器设备信息
 * @returns Object
 */
export function getBrowser() {
  const UA = navigator.userAgent.toLocaleLowerCase() || "";
  const isAndroid = UA.match(/Android/i) ? true : false;
  const isQQ =
    /(iPad|iPhone|iPod).*? (IPad)?QQ\/([\d\.]+)/.test(UA) ||
    /\bV1_AND_SQI?_([\d\.]+)(.*? QQ\/([\d\.]+))?/.test(UA);
  const isIOS = UA.match(/iPhone|iPad|iPod/i) ? true : false;
  const isIpone = UA.indexOf("iphone") > -1 ? true : false;
  const isSafari = /iPhone|iPad|iPod\/([\w.]+).*(safari).*/i.test(UA);
  // 微信
  const isWx = UA.match(/micromessenger/i) ? true : false;
  // 微博
  const isWb = UA.match(/weibo/i) ? true : false;
  const isAndroidChrome =
    (UA.match(/Chrome\/([\d.]+)/) || UA.match(/CriOS\/([\d.]+)/)) &&
    isAndroid &&
    !isQQ;
  // qq空间
  const isQZ = UA.indexOf("Qzone/") !== -1;
  return {
    isAndroid,
    isQQ,
    isIOS,
    isSafari,
    isWx,
    isWb,
    isAndroidChrome,
    isQZ,
    isIpone,
  };
}

/**
 * @method strip
 * @param num
 * @param precision
 */
export function strip(num: number, precision = 12) {
  return +parseFloat(num.toPrecision(precision));
}

// 设置cookie
export function setCookie(cname: string, cvalue: any, exdays: number) {
  const d: any = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toGMTString();
  document.cookie = encodeURIComponent(cname) + "=" + encodeURIComponent(cvalue) + "; " + expires; // cookie 的键值对必须被 URL 编码
}
// 获取cookie
export function getCookie(cName: string) {
  if (document.cookie.length > 0) {
    let cStart = document.cookie.indexOf(cName + "=");
    if (cStart !== -1) {
      cStart = cStart + cName.length + 1;
      let cEnd = document.cookie.indexOf(";", cStart);
      if (cEnd === -1) {
        cEnd = document.cookie.length;
      }
      return unescape(document.cookie.substring(cStart, cEnd));
    }
  }
  return "";
}
// 删除cookie
export function delCookie(name: string) {
  const exp = new Date();
  exp.setTime(exp.getTime() - 1);
  const cval = getCookie(name);
  if (cval != null) {
    document.cookie = name + "=" + cval + ";expires=" + exp.toUTCString();
  }
}
// 清除cookie
export function clearCookie(name: string) {
  setCookie(name, "", -1);
}
// 获取页面顶部被卷起来的高度
export function getScrollTop() {
  return Math.max(
    // chrome
    document.body.scrollTop,
    // firefox/IE
    document.documentElement.scrollTop,
  );
}
// 获取页面文档的总高度
export function getDocumentHeight() {
  // 现代浏览器（IE9+和其他浏览器）和IE8的document.body.scrollHeight和document.documentElement.scrollHeight都可以
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
  );
}
// 页面浏览器视口的高度
export function getWindowHeight() {
  return document.compatMode === "CSS1Compat"
    ? document.documentElement.clientHeight
    : document.body.clientHeight;
}


// googleMap 定位
declare var google: any;
declare global {
  interface Window {
    locationResult: (permission: boolean) => void;
    requestFileResult: (permission: boolean) => void;
    requestCameraResult: (permission: boolean) => void;
    messageHandlers: {
      requestLocationPermission: () => void;
      requestFilePermission: () => void;
      requestCameraPermission: () => void;
    }
  }
}
export function googleMapLocation(store: any) {
  const geocoder = new google.maps.Geocoder();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log(position)
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        sessionStorage.setItem('latitude', position.coords.latitude.toString())
        sessionStorage.setItem('longitude', position.coords.longitude.toString())
        geocoder.geocode(
          {
            location: pos
          },
          async (results: any[], status: string) => {
            if (status === "OK") {
              await store.dispatch(
                "app/changeLocation",
                results[0].formatted_address
              )
            }
          }
        );
      },
      error => {
        // console.log(error);
        console.error(
          "code:" + error.code + " and message: " + error.message
        );
        if (error.code === 2 && getBrowser().isAndroid) {
          window.messageHandlers.requestLocationPermission()
        }
      }
    );
  } else {
    alert("Browser doesn't support Geolocation");
  }
}

export function locationPermission(store: any) {
  window.locationResult = function(permission: boolean) {
    if (permission) {
      googleMapLocation(store)
    }
  }
}

// 唤醒 fincy SDK
export function awakenFincy(fn: (fincy: any) => void) {
  try {
    const secretAuthorization = (window as any).getSecretSdk({
      appId: process.env.VUE_APP_APPID
    })
    fn(secretAuthorization)
  } catch {
    location.href = "secret.one://"
  }
}

// 获取 Android 权限
export function getAndroidPermission() {
  const isAndroid = getBrowser().isAndroid
  // 获取“读取文件”权限
  function filePermission() {
    if (isAndroid && sessionStorage.getItem('filePermission') === null) {
      window.messageHandlers.requestFilePermission()
      sessionStorage.setItem('filePermission', 'true')
    }
  }
  // 获取“读取文件”权限后的回调函数
  function filePermissionCallback(fn?: () => void) {
    if (isAndroid && !window.requestFileResult) {
      window.requestFileResult = function(permission: boolean) { // 如果用户同意授权
        if (permission && fn !== undefined) {
          fn()
        }
      }
    }
  }
  // 获取“读取相机”权限
  function cameraPermission() {
    if (isAndroid && sessionStorage.getItem('cameraPermission') === null) {
      window.messageHandlers.requestCameraPermission()
      sessionStorage.setItem('cameraPermission', 'true')
    }
  }
  // 获取“读取相机”权限后的回调函数
  function cameraPermissionCallback(fn?: () => void) {
    if (isAndroid && !window.requestCameraResult) {
      window.requestCameraResult = function(permission: boolean) { // 如果用户同意授权
        if (permission && fn !== undefined) {
          fn()
        }
      }
    }
  }
  return {
    filePermission,
    filePermissionCallback,
    cameraPermission,
    cameraPermissionCallback
  }
}

// 将对象数组形式的数据转化成双重数组形式的JSON数据
export const formatJson = (filterKeys: any, jsonData: any) =>

  jsonData.map((data: any, index: number) => filterKeys.map((key: string) => {
    // 正则匹配去除  .后面的所有文字
    const reg = /([\.]\w+)/;
    if (key === 'timestamp') {
      return timestampToTime(data[key], true);
    } else if (key === "FileIDVideo") {
      return data.response.key
    } else if (key === "视频标题") {
      return data.name.replace(reg, '');
    } else if (key === "序号") {
      return index + 1;
    } else {
      return data[key]
    }
  }))

// 转换结构函数
export function listToTree(arr: any[], pid: string | null) {
  const result: any = [];
  const treeArr = arr;
  treeArr.forEach((e, i) => {
    if (e.pid === pid) {
      // if (listToTree(treeArr, treeArr[i].id).length > 0) {
      treeArr[i].children = listToTree(treeArr, treeArr[i].id)
      // }
      result.push(treeArr[i]);
    }
  })
  return result;
}

// 使用递归的方式实现数组、对象的深拷贝
export function deepClone(source: any) {
  let target: any;
  if (typeof source === 'object') {
    target = Array.isArray(source) ? [] : {}
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] !== 'object') {
          (target as any)[key] = source[key]
        } else {
          (target as any)[key] = deepClone(source[key])
        }
      }
    }
  } else {
    target = source
  }
  return target
}