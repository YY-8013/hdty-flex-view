/**
 * 日期类函数
 */


// 日期时间格式化
const dateFtt = (datetime, fmt) => {
  if (datetime) {
    fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
    if (datetime instanceof Date) {
      let o = {
        'M+': datetime.getMonth() + 1,                 //月份
        'd+': datetime.getDate(),                    //日
        'H+': datetime.getHours(),                   //小时
        'm+': datetime.getMinutes(),                 //分
        's+': datetime.getSeconds(),                 //秒
        'q+': Math.floor((datetime.getMonth() + 3) / 3), //季度
        'S': datetime.getMilliseconds()             //毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr((o[k] + '').length)));
        }
      }
    } else {
      datetime = toNumber(datetime);
      let seconds = datetime.substr(12, 2);
      if(seconds) {
        fmt = fmt.replace(/ss/, seconds);
      } else {
        let match = fmt.match(/([\s\S]*)mm分/);
        if(match) {
          fmt = match[0];
        } else {
          match = fmt.match(/([\s\S]*)mm/);
          if(match) {
            fmt = match[0];
          }
        }
      }
      let minutes = datetime.substr(10, 2);
      if(minutes) {
        fmt = fmt.replace(/mm/, minutes);
      } else {
        let match = fmt.match(/([\s\S]*)HH时/);
        if(match) {
          fmt = match[0];
        } else {
          match = fmt.match(/([\s\S]*)HH/);
          if(match) {
            fmt = match[0];
          }
        }
      }
      let hours = datetime.substr(8, 2);
      if(hours) {
        fmt = fmt.replace(/HH/, hours);
      } else {
        let match = fmt.match(/([\s\S]*)dd日/);
        if(match) {
          fmt = match[0];
        } else {
          match = fmt.match(/([\s\S]*)dd/);
          if(match) {
            fmt = match[0];
          }
        }
      }
      let date = datetime.substr(6, 2);
      if(date) {
        fmt = fmt.replace(/dd/, date);
      } else {
        let match = fmt.match(/([\s\S]*)MM月/);
        if(match) {
          fmt = match[0];
        } else {
          match = fmt.match(/([\s\S]*)MM/);
          if(match) {
            fmt = match[0];
          }
        }
      }
      let month = datetime.substr(4, 2);
      if(month) {
        fmt = fmt.replace(/MM/, month);
      } else {
        let match = fmt.match(/([\s\S]*)yyyy年/);
        if(match) {
          fmt = match[0];
        } else {
          match = fmt.match(/([\s\S]*)yyyy/);
          if(match) {
            fmt = match[0];
          }
        }
      }
      let year = datetime.substr(0, 4);
      if(year) {
        fmt = fmt.replace(/yyyy/, year);
      } else {
        fmt = '';
      }
    }
    return fmt;
  }
};

// 时间格式化
const timeFtt = (time, fmt) => {
  if (time) {
    fmt = fmt || 'HH:mm:ss';
    time = toNumber(time);
    let seconds = time.substr(4, 2);
    if(seconds) {
      fmt = fmt.replace(/ss/, seconds);
    } else {
      let match = fmt.match(/([\s\S]*)mm分/);
      if(match) {
        fmt = match[0];
      } else {
        match = fmt.match(/([\s\S]*)mm/);
        if(match) {
          fmt = match[0];
        }
      }
    }
    let minutes = time.substr(2, 2);
    if(minutes) {
      fmt = fmt.replace(/mm/, minutes);
    } else {
      let match = fmt.match(/([\s\S]*)HH时/);
      if(match) {
        fmt = match[0];
      } else {
        match = fmt.match(/([\s\S]*)HH/);
        if(match) {
          fmt = match[0];
        }
      }
    }
    let hours = time.substr(0, 2);
    if(hours) {
      fmt = fmt.replace(/HH/, hours);
    } else {
      fmt = '';
    }
    return fmt;
  }
};

// 日期时间人性化格式转换
const dateHumanize = datetime => {
  datetime = toDate(datetime);
  if(datetime) {
    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let month = day * 30;
    let now = new Date().getTime();

    let dateTimeStamp = datetime.getTime();
    let diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
      return datetime.toLocaleDateString().replace(/\//g, '-');
    }
    let yearComment = diffValue / (month * 12);
    let monthComment = diffValue / month;
    let weekComment = diffValue / (7 * day);
    let dayComment = diffValue / day;
    let hourComment = diffValue / hour;
    let minComment = diffValue / minute;
    if(yearComment >= 1){
      return parseInt(yearComment+'') + '年前';
    } else if (monthComment < 4 && monthComment >= 1) {
      return parseInt(monthComment+'') + '个月前';
    } else if (weekComment >= 1) {
      return parseInt(weekComment+'') + '周前';
    } else if (dayComment >= 1) {
      return parseInt(dayComment+'') + '天前';
    } else if (hourComment >= 1) {
      return parseInt(hourComment+'') + '小时前';
    } else if (minComment >= 1) {
      return parseInt(minComment+'') + '分钟前';
    } else if(minComment < 0){
      return '还未发生'
    } else
      return '刚刚';
  }
};

// 日期时间转时间戳
const toTimestamp = datetime => {
  datetime = toDate(datetime);
  if(datetime) {
    return datetime.getTime();
  }
};

// 日期时间转数字（用以清除日期时间的格式）
const toNumber = datetime => {
  datetime = toString(datetime);
  if(datetime) {
    return (datetime + '').replace(/[^0-9]/ig, '');
  }
};

// 日期时间转YMDHMS格式（用以清除日期时间年月日时分秒前面的0）
const toYMDHMS = datetime => {
  datetime = toDate(datetime);
  if (datetime) {
    // 获取当前年
    let year = datetime.getFullYear();
    // 获取当前月
    let month = datetime.getMonth() + 1;
    // 获取当前日
    let day = datetime.getDate();
    // 获取当前小时数(0-23)
    let h = datetime.getHours();
    // 获取当前分钟数(0-59)
    let m = datetime.getMinutes();
    let s = datetime.getSeconds();
    let res = {};
    res.year = year;
    res.month = month;
    res.date = day;
    res.hour = h;
    res.minute = m;
    res.second = s;
    res.datetime = year + '' + month + '' + day + '' + h + '' + m + '' + s;
    return res;
  }
};

// 日期类型转字符串类型
const toString = datetime => {
  if(datetime) {
    if(datetime instanceof Date) {
      // 获取当前年
      let year = datetime.getFullYear();
      // 获取当前月
      let month = datetime.getMonth() + 1;
      // 获取当前日
      let day = datetime.getDate();
      let h = datetime.getHours();       // 获取当前小时数(0-23)
      let m = datetime.getMinutes();     // 获取当前分钟数(0-59)
      let s = datetime.getSeconds();
      return year + fixTensNum(month) + fixTensNum(day) + fixTensNum(h) + fixTensNum(m) + fixTensNum(s);
    } else {
      return datetime;
    }
  }
};

// 字符串类型转日期类型
const toDate = datetime => {
  if(datetime) {
    if (datetime instanceof Date) {
      return datetime;
    } else {
      datetime = new Date(dateFtt(datetime, 'yyyy/MM/dd HH:mm:ss'));
      if (!isNaN(datetime.getTime())) {
        return datetime;
      }
      console.error('无法读取未定义的属性“NaN”');
    }
  }
};

// 获取当前时间对象
const currentTime = datetime => {
  datetime = toDate(datetime || new Date());
  if(datetime) {
    let time = {};
    time.year = datetime.getFullYear();
    let month = datetime.getMonth() + 1;
    time.month = month;
    time._month = fixTensNum(month);
    let day = datetime.getDate();
    time.day = day;
    time._day = fixTensNum(day);
    let num = datetime.getDay();
    time.weekday = [7, 1, 2, 3, 4, 5, 6][num];
    time._weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][num];
    let hour = datetime.getHours();
    time.hour = hour;
    time._hour = fixTensNum(hour);
    let minute = datetime.getMinutes();
    time.minute = minute;
    time._minute = fixTensNum(minute);
    let second = datetime.getSeconds();
    time.second = second;
    time._second = fixTensNum(second);
    time.datetime = time.year + time._month + time._day + time._hour + time._minute + time._second;
    return time;
  }
};

// 获取当前日期
const getCurrentDate = datetime => {
  datetime = toDate(datetime || new Date());
  if(datetime) {
    let year = datetime.getFullYear();
    let month = datetime.getMonth() + 1;
    let day = datetime.getDate();
    return year + fixTensNum(month) + fixTensNum(day);
  }
};

// 获取当前日期时间
const getCurrentDatetime = datetime => {
  datetime = toDate(datetime || new Date());
  if(datetime) {
    let year = datetime.getFullYear();
    let month = datetime.getMonth() + 1;
    let day = datetime.getDate();
    let h = datetime.getHours();
    let m = datetime.getMinutes();
    let s = datetime.getSeconds();
    return year + fixTensNum(month) + fixTensNum(day) + fixTensNum(h) + fixTensNum(m) + fixTensNum(s);
  }
};

// 获取当前毫秒级日期时间
const getCurrentMsDatetime = datetime => {
  datetime = toDate(datetime || new Date());
  if(datetime) {
    let year = datetime.getFullYear();
    let month = datetime.getMonth() + 1;
    let day = datetime.getDate();
    let h = datetime.getHours();
    let m = datetime.getMinutes();
    let s = datetime.getSeconds();
    let ms = datetime.getMilliseconds();
    return year + fixTensNum(month) + fixTensNum(day) + fixTensNum(h) + fixTensNum(m) + fixTensNum(s) + fixHundredsNum(ms);
  }
};

// 获取今日的开始时间
const getStartDateOfToday = datetime => {
  datetime = toDate(datetime || new Date());
  if(datetime) {
    return toString(new Date(new Date(datetime.toLocaleDateString()).getTime()));
  }
};

// 获取今日的结束时间
const getEndDateOfToday = datetime => {
  datetime = toDate(datetime || new Date());
  if(datetime) {
    return toString(new Date(new Date(datetime.toLocaleDateString()).getTime() + 24* 60* 60* 1000 - 1));
  }
};

// 获取昨日的开始时间
const getStartDateOfYesterday = datetime => {
  datetime = toDate(datetime || new Date());
  if(datetime) {
    return toString(new Date(new Date(datetime.toLocaleDateString()).getTime() - 24* 60* 60* 1000));
  }
};

// 获取昨日的结束时间
const getEndDateOfYesterday = datetime => {
  datetime = toDate(datetime || new Date());
  if(datetime) {
    return toString(new Date(new Date(datetime.toLocaleDateString()).getTime() - 1));
  }
};

// 获取本周的开始时间
const getStartDateOfWeek = datetime => {
  datetime = toDate(datetime || new Date());
  if(datetime) {
    let year = datetime.getFullYear();
    let month = datetime.getMonth();
    let day = datetime.getDate();
    let weekday = [7, 1, 2, 3, 4, 5, 6][datetime.getDay()];
    return toString(new Date(year, month, day + 1 - weekday));
  }
};

// 获取本周的结束时间
const getEndDateOfWeek = datetime => {
  datetime = toDate(datetime || new Date());
  if(datetime) {
    let year = datetime.getFullYear();
    let month = datetime.getMonth();
    let day = datetime.getDate();
    let weekday = [7, 1, 2, 3, 4, 5, 6][datetime.getDay()];
    return toString(new Date(new Date(year, month, day + 7 - weekday).getTime() + 24* 60* 60* 1000 - 1));
  }
};

// 获取本月的开始时间
const getStartDateOfMonth = datetime => {
  datetime = toDate(datetime || new Date());
  if(datetime) {
    let year = datetime.getFullYear();
    let month = datetime.getMonth();
    return toString(new Date(year, month, 1));
  }
};

// 获取本月的结束时间
const getEndDateOfMonth = datetime => {
  datetime = toDate(datetime || new Date());
  if(datetime) {
    let year = datetime.getFullYear();
    let month = datetime.getMonth();
    return toString(new Date(new Date(year, month + 1, 1).getTime() - 1));
  }
};

// 获取本年的开始时间
const getStartDateOfYear = datetime => {
  datetime = toDate(datetime || new Date());
  if(datetime) {
    let year = datetime.getFullYear();
    return toString(new Date(year, 0, 1));
  }
};

// 获取本年的结束时间
const getEndDateOfYear = datetime => {
  datetime = toDate(datetime || new Date());
  if(datetime) {
    let year = datetime.getFullYear();
    return toString(new Date(new Date(year + 1, 0, 1).getTime() - 1));
  }
};

// 获取本月的天数
const getMonthDays = datetime => {
  datetime = toDate(datetime || new Date());
  if(datetime) {
    let year = datetime.getFullYear();
    let month = datetime.getMonth();
    let endDay = new Date(year, month + 1, 0);
    return endDay.getDate();
  }
};

// 获取本年的天数
const getYearDays = datetime => {
  datetime = toDate(datetime || new Date());
  if(datetime) {
    let year = datetime.getFullYear(),
      days = 0;
    for (let month = 1; month < 13; month++) {
      let endDay = new Date(year, month, 0);
      days += endDay.getDate();
    }
    return days;
  }
};

// 获取两个时间点的时间差
const getDiffOfDate = (datetime1, datetime2) => {
  if(datetime1 && datetime2) {
    return Math.abs(toTimestamp(datetime1) - toTimestamp(datetime2));
  } else if(datetime1) {
    return Math.abs(toTimestamp(datetime1) - toTimestamp(new Date()));
  }
};

// 获取两个时间点相差的天数（指定返回天数保留小数点后fix位，fix默认0）
const getDiffDaysOfDate = (datetime1, datetime2, fix) => {
  let diff = getDiffOfDate(datetime1, datetime2);
  if(diff) {
    return (diff / (24 * 60* 60 * 1000)).toFixed(fix);
  }
};

// 日期时间加减秒
const addSeconds = (datetime, seconds) => {
  if (datetime) {
    seconds = parseInt(seconds) || 1;
    let ms = seconds* 1000;
    if(datetime instanceof Date) {
      return new Date(datetime.getTime() + ms);
    }else {
      return toString(new Date(toDate(datetime).getTime() + ms));
    }
  }
};

// 日期时间加减小时
const addHours = (datetime, hours) => {
  if (datetime) {
    hours = parseInt(hours) || 1;
    let ms = hours* 60* 60* 1000;
    if(datetime instanceof Date) {
      return new Date(datetime.getTime() + ms);
    }else {
      return toString(new Date(toDate(datetime).getTime() + ms));
    }
  }
};

// 日期时间加减天
const addDays = (datetime, days) => {
  if (datetime) {
    days = parseInt(days) || 1;
    let ms = days* 24* 60* 60* 1000;
    if(datetime instanceof Date) {
      return new Date(datetime.getTime() + ms);
    }else {
      return toString(new Date(toDate(datetime).getTime() + ms));
    }
  }
};

// 日期时间加减月
const addMonths = (datetime, months) => {
  if (datetime) {
    months = parseInt(months) || 1;
    let dateType = false;
    if(!(datetime instanceof Date)) {
      dateType = true;
      datetime = toDate(datetime);
    }
    let year = datetime.getFullYear();
    let month = datetime.getMonth();
    let day = datetime.getDate();
    let h = datetime.getHours();
    let m = datetime.getMinutes();
    let s = datetime.getSeconds();
    let dt = new Date(year, month + months, day, h, m, s);
    if(dateType) {
      dt = toString(dt);
    }
    return dt;
  }
};

// 日期时间加减年
const addYears = (datetime, years) => {
  if (datetime) {
    years = parseInt(years) || 1;
    let dateType = false;
    if(!(datetime instanceof Date)) {
      dateType = true;
      datetime = toDate(datetime)
    }
    let year = datetime.getFullYear();
    let month = datetime.getMonth();
    let day = datetime.getDate();
    let h = datetime.getHours();
    let m = datetime.getMinutes();
    let s = datetime.getSeconds();
    let dt = new Date(year + years, month, day, h, m, s);
    if(dateType) {
      dt = toString(dt);
    }
    return dt;
  }
};

// 时间十位补零
const fixTensNum = num => {
  return num < 10 ? '0' + num : num + '';
};

// 时间百位补零
const fixHundredsNum = num => {
  return num < 10 ? '00' + num : num < 100 ? '0' + num : num + '';
};


export default {
  // 日期时间格式化
  dateFtt,
  // 时间格式化
  timeFtt,
  // 日期时间人性化格式转换
  dateHumanize,
  // 日期时间转时间戳
  toTimestamp,
  // 日期时间转数字（用以清除日期时间的格式）
  toNumber,
  // 日期时间转YMDHMS格式（用以清除日期时间年月日时分秒前面的0）
  toYMDHMS,
  // 日期类型转字符串类型
  toString,
  // 字符串类型转日期类型
  toDate,
  // 获取当前时间对象
  currentTime,
  // 获取当前日期
  getCurrentDate,
  // 获取当前日期时间
  getCurrentDatetime,
  // 获取当前毫秒级日期时间
  getCurrentMsDatetime,
  // 获取今日的开始时间
  getStartDateOfToday,
  // 获取今日的结束时间
  getEndDateOfToday,
  // 获取昨日的开始时间
  getStartDateOfYesterday,
  // 获取昨日的结束时间
  getEndDateOfYesterday,
  // 获取本周的开始时间
  getStartDateOfWeek,
  // 获取本周的结束时间
  getEndDateOfWeek,
  // 获取本月的开始时间
  getStartDateOfMonth,
  // 获取本月的结束时间
  getEndDateOfMonth,
  // 获取本年的开始时间
  getStartDateOfYear,
  // 获取本年的结束时间
  getEndDateOfYear,
  // 获取本月的天数
  getMonthDays,
  // 获取本年的天数
  getYearDays,
  // 获取两个时间点的时间差
  getDiffOfDate,
  // 获取两个时间点相差的天数
  getDiffDaysOfDate,
  // 日期时间加减秒
  addSeconds,
  // 日期时间加减小时
  addHours,
  // 日期时间加减天
  addDays,
  // 日期时间加减月
  addMonths,
  // 日期时间加减年
  addYears,
  // 数字十位补零
  fixTensNum,
  // 数字百位补零
  fixHundredsNum
}
