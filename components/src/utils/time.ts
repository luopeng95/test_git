// 时间 格式化成 2018-12-12 12:12:00
export function timestampToTime(timestamp: any, dayMinSecFlag: boolean) {
  if (!timestamp) {
    return '';
  }
  const date = new Date(timestamp);
  // console.log(date)
  const Y = date.getFullYear() + "-";
  const M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  const D =
    date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
  const h =
    date.getHours() < 10 ? "0" + date.getHours() + ":" : date.getHours() + ":";
  const m =
    date.getMinutes() < 10
      ? "0" + date.getMinutes() + ":"
      : date.getMinutes() + ":";
  const s =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  if (!dayMinSecFlag) {
    return Y + M + D;
  }
  return Y + M + D + h + m + s;
}

// 将日期选择器选择的日期转换成Date对象
export function transData(data: string) {
  const date = new Date(data).toLocaleDateString();
  return date.replace(/[/]/g, "-");
}

// 将2020-7-20格式的日期转换成成date对象
export function transString(date: string) {
  const reg = /(\d+)/g;
  const result = date.match(reg) as string[];
  if (result.length === 3) {
    return new Date(+result[0], +result[1] - 1, +result[2]);
  }
}

// 判断开始时间与结束时间的正确与否
export function checkTime(startTime: string | undefined | number, endTime: string | undefined | number) {
  if (!startTime && !endTime) {
    return true;
  } else if (!startTime || !endTime) {
    return false;
  }

  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  // console.log('checkTime检查结果：', start, end);
  if (end - start >= 0) {
    return true;
  } else {
    return false;
  }
}

// 2020-7-21 对日期进行补0操作
export function fillZero(time: string) {
  const ary = time.split("-");
  const ary2 = ary.map((e: string) => {
    if (e.length < 2) {
      return "0" + e;
    } else {
      return e;
    }
  });
  return ary2.join("-");
}

// 将正常的时间转换成时间戳
export function transTimestamp(time: string | undefined, type?: string) {
  if (!time) {
    return "";
  }
  if (type === 's') {
    return new Date(time).getTime() / 1000;
  } else if (type === 'ms') {
    return new Date(time).getTime();
  } else {
    return new Date(time).getTime();
  }
}

/**
 * 判断开始时间和结束时间是否超过60天
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @return boolean
 */
export function checkDayInterval(startTime: string, endTime: string): boolean {
  // 只可能两个都为空或者两个都不为空
  if (!startTime && !endTime) {
    return true
  }
  console.log(startTime);
  const sTime: number = new Date(startTime).getTime();
  const eTime: number = new Date(endTime).getTime();
  const usedTime: number = eTime - sTime;
  const days: number = Math.floor(usedTime / (24 * 3600 * 1000));
  console.log('时间间隔：', days);
  return days <= 60;
}

/**
 * 以数组的形式返回本周/本月
 * @param type：是返回本周还是返回本月或者指定的多少天之前
 */
export function returnWeekAndMonth(type: string | number): any[] {
  const now = new Date(); // 当前日期
  const nowDay = now.getDate(); // 当前日
  const nowMonth = now.getMonth(); // 当前月
  const nowDayOfWeek = now.getDay(); // 今天本周的第几天
  const nowYear = now.getFullYear(); // 当前年
  if (type === 'week') {
    const weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
    const weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
    return [timestampToTime(weekStartDate, false), timestampToTime(weekEndDate, false)];
  } else if (type === 'month') {
    const monthStartDate = new Date(nowYear, nowMonth, 1).getTime();
    const monthEndDate = new Date(nowYear, nowMonth + 1, 1).getTime();
    const days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    const monthEnd = new Date(nowYear, nowMonth, days);
    return [timestampToTime(monthStartDate, false), timestampToTime(monthEnd, false)]
  } else if (typeof type === 'number') {
    const endDate = new Date(nowYear, nowMonth, nowDay - type);
    return [timestampToTime(endDate, false), timestampToTime(now, false)]
  } else {
    return []
  }
}

/**
 * @param startTime 传入的开始时间
 * @param endTime 结束时间
 * @param time 要判断的间隔时间
 * @param type 时间单位：minute，hour，day
 */
export function checkTimeInterval(startTime: string | number, endTime: string | number, time: number, type: string): boolean {
  const sTime: number = new Date(startTime).getTime();
  const eTime: number = new Date(endTime).getTime();
  const usedTime: number = eTime - sTime;
  let times: number = 0;
  if (type === 'minute') {
    times = Math.floor(usedTime / (60 * 1000));
  } else if (type === 'hour') {
    times = Math.floor(usedTime / (3600 * 1000));
  } else if (type === 'day') {
    times = Math.floor(usedTime / (24 * 3600 * 1000));
  }
  return times < time;
}

/**
 * 将单位为S的时长转换为05:20格式
 * @param duration
 */
export function transDuration(duration: number) {
  if (!duration) {
    return "";
  }
  duration /= 1000;
  const h = Math.floor((duration / (60 * 60))) < 10 ? `0${Math.floor((duration / (60 * 60)))}:` : `${Math.floor((duration / (60 * 60)))}:`;
  const m = Math.floor((duration / (60)) % 60) < 10 ? `0${Math.floor((duration / (60)) % 60)}:` : `${Math.floor((duration / (60)) % 60)}:`;
  const s = Math.floor(duration % 60) < 10 ? `0${Math.floor(duration % 60)}` : `${Math.floor(duration % 60)}`;
  console.log(h, m, s);
  return h + m + s;
}