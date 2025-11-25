export const validateIdCard = value => {
  value = value.toUpperCase();
  if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(value))) {
    return false;
  }
  let len;
  let re;
  len = value.length;
  if (len === 15) {
    re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
    let arrSplit = value.match(re);
    let dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
    let bGoodDay;
    bGoodDay = (dtmBirth.getYear() === Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) === Number(arrSplit[3])) && (dtmBirth.getDate() === Number(arrSplit[4]));
    if (!bGoodDay) {
      return false;
    } else {
      let arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      let arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
      let nTemp = 0;
      let i;
      value = value.substr(0, 6) + '19' + value.substr(6, value.length - 6);
      for (i = 0; i < 17; i++) {
        nTemp += value.substr(i, 1) * arrInt[i];
      }
      value += arrCh[nTemp % 11];
      return true;
    }
  }
  if (len === 18) {
    re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
    let arrSplit = value.match(re);
    let dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
    let bGoodDay;
    bGoodDay = (dtmBirth.getFullYear() === Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) === Number(arrSplit[3])) && (dtmBirth.getDate() === Number(arrSplit[4]));
    if (!bGoodDay) {
      return false;
    } else {
      let valnum;
      let arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      let arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
      let nTemp = 0;
      let i;
      for (i = 0; i < 17; i++) {
        nTemp += value.substr(i, 1) * arrInt[i];
      }
      valnum = arrCh[nTemp % 11];
      return valnum === value.substr(17, 1);
    }
  }
  return false;
};
