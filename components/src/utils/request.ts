import axios from "axios";
// import { getToken } from "@/utils/auth";
import router from '@/routes/index'
// axios.defaults.withCredentials = true

/**
 * 正在进行中的请求列表
 */
const reqList: string[] = [];

/**
 * 阻止重复请求
 * @param {array} reqList - 请求缓存列表
 * @param {string} url - 当前请求地址
 * @param {function} cancel - 请求中断函数
 * @param {string} errorMessage - 请求中断时需要显示的错误信息
 */
const stopRepeatRequest = function(reqList: string[], url: string, cancel: (msg: any) => void, errorMessage: string) {
  const errorMsg = errorMessage || ''
  for (let i = 0; i < reqList.length; i++) {
    if (reqList[i] === process.env.VUE_APP_BASE_URL + url) {
      cancel(errorMsg)
      return
    }
  }
  if (url === 'http://upload.qiniup.com') {
    return;
  }
  reqList.push(process.env.VUE_APP_BASE_URL + url)
}

/**
 * 允许某个请求可以继续进行
 * @param {array} reqList 全部请求列表
 * @param {string} url 请求地址
 */
const allowRequest = function(reqList: string[], url: string) {
  for (let i = 0; i < reqList.length; i++) {
    if (reqList[i] === url) {
      reqList.splice(i, 1)
      break
    }
  }
}

const service = axios.create({
  timeout: 10000,
});
const whiteList: string[] = [];

// Request interceptors
// 设置允许后台 自动写入cookie
// service.defaults.withCredentials = true
service.interceptors.request.use(
  (config: any) => {
    // console.log('请求拦截器', config);
    let cancel: any
    // 设置cancelToken对象
    config.cancelToken = new axios.CancelToken(function(c: any) {
      cancel = c
    })
    // 阻止重复请求。当上个请求未完成时，相同的请求不会进行
    stopRepeatRequest(reqList, config.url, cancel, `${config.url} 请求已存在`)


    // 判断是否存储有ac这个参数，有的话就传
    const ac: string | null = localStorage.getItem('ac')
    if (ac) {
      config.headers['access-token'] = ac;
      // config.headers['access-token'] = 'fsaf5af465a4f56as4f65as4f';
    }
    config.headers['plat-form'] = 'pf_system';
    // console.log(config.headers);
    if (config.headers['Content-Type']) {
      if (config.headers['Content-Type'].includes('application/json')) {
        config.transformRequest = [(data: any) => {
          console.log('JSON:', data);
          return JSON.stringify(data)
        }]
        // console.log('更改后的JSON：', config.transformRequest);
      } else {
        config.transformRequest = [(data: any) => {
          return data
        }]
      }
    }
    return config;
  },
  (error: any) => {
    // Handle request error here
    Promise.reject(error);
  },
);

// Response interceptors
service.interceptors.response.use(
  (response: any) => {
    // console.log('请求的返回：', response);
    // console.log('当前的已请求列表', reqList);
    // 增加延迟，相同请求不得在短时间内重复发送
    // setTimeout(() => {
    allowRequest(reqList, response.config.url)
    // }, 1000)


    // console.log('成功的返回路径')
    if (response.data.errorCode === '100605') {
      // token过期
      // console.log('删除本地存储信息')
      console.log('token过期');
      localStorage.removeItem('ac');
      localStorage.removeItem('userInfo');
      router.replace('/login');
      return Promise.reject(response.data);
    } else {
      return Promise.resolve(response.data);
    }
  },

  (error: any) => {
    // 判断传过来的错误

    console.log('响应错误', error)
    return Promise.reject({ errors: error });
  },
);

service.defaults.transformRequest = [(data) => {
  let ret = ''
  for (const it in data) {
    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
  }
  return ret.substring(0, ret.length - 1)
}]


interface Ioptions {
  method: string;
  url: string;
  data: object | undefined | null | string;
  params?: object | string | undefined | null;
  baseURL: string | undefined;
  headers: any | null;
}

function request(method: string): any {
  return async (url: string, data: any = {}, opt?: {}) => {
    if (method === 'GET') {
      url += '?'
      for (const item in data) {
        url += encodeURIComponent(item) + '=' + encodeURIComponent(data[item]) + '&'
      }
      url = url.substring(0, url.length - 1)
    }
    let options: Ioptions = {
      method,
      url,
      data,
      baseURL: process.env.VUE_APP_BASE_URL,
      headers: {
        // "content-type": "application/json",
        // "content-type": "application/x-www-form-urlencoded",
        // "access-token": `${getToken()}`,
        "Cache-Control": "no-cache"
      },
    };
    options = opt ? { ...options, ...opt } : options;
    // console.log('请求配置', options);
    return await service(options)
      .then(res => {
        return res;
      })
      .catch(err => {
        const { errors } = err;
        const errorsKey = errors && Object.keys(errors)[0];
        console.log('错误返回的：', errors, errorsKey, err);
        if (errors && errorsKey) {
          err.msg = errors[errorsKey];
        }
        if (err.constructor === Object) {
          err.msg = err.msg
            ? err.msg
            : err.message
              ? err.message
              : "网络请求出错";
        }
        if (!whiteList.includes(options.url)) {
          // alert(err.msg);
        }
        return err;
      });
  };
}

export const GET = request("GET");
export const POST = request("POST");
export const PUT = request("PUT");
export const DELETE = request("DELETE");

export default service;
