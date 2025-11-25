export const getAge = strAge => {
  let returnAge,
    strBirthdayArr = strAge,
    birthYear = strBirthdayArr.substr(0, 4),
    birthMonth = strBirthdayArr.substr(4, 2),
    birthDay = strBirthdayArr.substr(6, 2),
    d = new Date(),
    nowYear = d.getFullYear(),
    nowMonth = d.getMonth() + 1,
    nowDay = d.getDate();

  birthMonth = Number(birthMonth);
  birthDay = Number(birthDay);
  if (nowYear === birthYear) {
    returnAge = 0; //同年 则为0周岁
  } else {
    let ageDiff = nowYear - birthYear; //年之差
    if (ageDiff > 0) {
      if (nowMonth === birthMonth) {
        let dayDiff = nowDay - birthDay; //日之差
        if (dayDiff < 0) {
          returnAge = ageDiff - 1;
        } else {
          returnAge = ageDiff;
        }
      } else {
        let monthDiff = nowMonth - birthMonth; //月之差
        if (monthDiff < 0) {
          returnAge = ageDiff - 1;
        } else {
          returnAge = ageDiff;
        }
      }
    } else {
      returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
    }
  }
  return returnAge; //返回周岁年龄
};
