/**
 * watermark插件
 */

import $app from '@/config/app';
import $storage from '@/utils/storage';

const watermark = {};
const WID = 'HDTY_watermark';

const setWatermark = (str, delay) => {
  let wm = document.getElementById(WID);
  if(!wm) {
    if(!delay) return;
    if(!str) return;
    wm = document.createElement('div');
    wm.id = WID;
    wm.style.pointerEvents = 'none';
    wm.style.position = 'fixed';
    wm.style.left = '0';
    wm.style.right = '0';
    wm.style.top = '0';
    wm.style.bottom = '0';
    wm.style.zIndex = '100000';
    document.body.appendChild(wm);
  } else {
    if (!str) {
      wm.remove();
      return;
    }
  }
  // 创建canvas画布
  let cvs = document.createElement('canvas');
  let clientWidth = document.documentElement.clientWidth;
  let divideNum = Math.floor(clientWidth / 400);
  cvs.width = clientWidth / (divideNum>0?divideNum:1);
  cvs.height = 180;
  // 创建 context 对象
  let cxt = cvs.getContext('2d');
  cxt.rotate(-20 * Math.PI / 180);
  cxt.font = '18px 锐字钧线准黑简';
  cxt.textAlign = 'left';
  cxt.textBaseline = 'middle';
  // 创建图片对象
  let img = new Image();
  // 设置颜色
  let theme = $storage.local.get('hdty-admin-theme') || $app.themeDefault;
  if(theme) {
    if(theme.indexOf('classical-green') !== -1) {
      cxt.fillStyle = 'rgba(28, 201, 181, .3)';
      if(str) {
        img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAQCAYAAADj5tSrAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAG4SURBVHjanNTNi45hFAbw3/u8j4yPxggxUT6TSSkhU2aBtdWU8g9IKV/Fhj9A2diYHVaTUlaKkrJTbGxQU4zIx5BJRmby1Ts2Z3Q8Pe+jXPXWue/rfs/Hdc5zWmse3mpjL07jAS7hE3rxDd/9jU24gUXox0lcTvxBXMNHXMBIiWFcRyuIr5jFlHpMpGAdfEhcGztRRgIXMVXgbASA1ZFhE+Zjbdiv4zeHXuyuvD9cYCBd7I9yFzcEWYe+sMfxJnF92F5531+mKuYwgq24iQLv8CTxu5I9jsl0Xh/VZHSKmkzbOIa7uIMTiWtVKn9W4YZq/M0raqYnYwb30nkWG8KexvPEldhT42NhEWPaDZN4nM4FtoX9FmOJW1CR8k9iRU1PMj5XJNmI5WG/x4vEDWDp/wR5WZFzKI34RA1Xh7LEzy7kLJ7WBH0UEl+tcPu6+OkpG3rSCbky7uMQfuFVul+FHV38tMsGqQqsqNz9qPRoDqewspsiRdpFVbQw6N8YxpGG3o4VuNLgYBDnGvij8f8lDW/OlxiNnXMGy5IsMyHZ8Vh6o/Fd9GAzDmBLrJY8LNPRzy+RwO3fAwBnUFxLLTRd6gAAAABJRU5ErkJggg==';
      }
    }else if(theme.indexOf('police-blue') !== -1) {
      cxt.fillStyle = 'rgba(17, 148, 251, .3)';
      if(str) {
        img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAQCAYAAADj5tSrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NkEyOEE4NjJCRjY4MTFFQUFEMzlGRUJEREQ1QjMxQzYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NkEyOEE4NjNCRjY4MTFFQUFEMzlGRUJEREQ1QjMxQzYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2QTI4QTg2MEJGNjgxMUVBQUQzOUZFQkRERDVCMzFDNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2QTI4QTg2MUJGNjgxMUVBQUQzOUZFQkRERDVCMzFDNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Prcn4RsAAAHESURBVHjanJTLK0RRHMfvvXNlPPIIMVl4JlJKiDILrK2U8g9IKa9iwx+gZmNjdlhNSllZKCk7ZWWDmvLIe4iEzOTV5fur3+jndO5RvvW5nXN+Z87vd77nzLFDkfOAZVldYBLsgHnwAPLAK3izfqsWrIIcEALjYEHE+8EyuAMREHXx6QMrwObAC/gCT5ZeCZHMA7ciRgW3ApcLmKN1HHymOQGpnCs0KRNUcPuCSYt2367MH6QkDWKgh7eba0hSCQq4fQwuRYzGm5X5IVfsIq0oaARrgIq4Bvsi3ibalORe9Kt4N1Keo6mUfB0Bm2ADjImYrez8UImFNetlOJrbI5UCW6JPF6Ka20lwJGLkSqdmjWyHr6mfyIo90af5Tdy+AnERy1Ks/CnM0ZyJ1KNiSQ0o5vYNOBExsrHwP0lOFTvD4oonNDGdXPLxwydI/h9oku6yxUtKrNtnnaBrOBOP7ZLaBgPgE5yJ8TLQ4rNOwDVYRVaWKGPvyhmlNQFK/RxxxFukis6qw/pb9PYNGc42TkkWDQtQkhlDfJh/n2+YM0t2xfjNmQJFwpYUWzbKj16M/xdBUAd6QT0/LfKyJPk8n7mA9W8BBgDiq1w2QTPfWgAAAABJRU5ErkJggg==';
      }
    }else if(theme.indexOf('ocean-blue') !== -1) {
      cxt.fillStyle = 'rgba(38, 184, 206, .3)';
      if(str) {
        img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAQCAYAAADj5tSrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjNCNjcyRTRCRjY5MTFFQUE5MjY4QUQ4ODZDRjYyQ0IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjNCNjcyRTVCRjY5MTFFQUE5MjY4QUQ4ODZDRjYyQ0IiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyM0I2NzJFMkJGNjkxMUVBQTkyNjhBRDg4NkNGNjJDQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyM0I2NzJFM0JGNjkxMUVBQTkyNjhBRDg4NkNGNjJDQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmTeAeIAAAHFSURBVHjanJTLK4RRGMa/+eaTccklxGThNomUEqLMAmsrpfwDUsqt2PAHKJvZmB1Wk1JWFkpkp6xsmJpyiVyGSMhMbn08b72j1+l8R3nq93XOec+c9z3POXN8oe2437KsbjAF9sACeAAF4BW8Wb8VAmsgDwTBBFgU8QGwAu7APIg6+PSDVeDjwAv4Ak+WXkmRzAW3IkYFtwGHC4jQOjY+M5yAVMkVmpQNqrh9wWREu+9Q5g9RkkYx0MvbzTckqQZF3D4BlyJG4y3K/KAjdpFRFDSBdUBFXINDEW8XbUpyL/o1vBsp19ZUSr6Ogi2wCcZFzKfs/EiJhTXrZdma2yOVBjuiTxeiltspcCxi5EqXZo1cm6+pl8iKA9Gn+c3cvgIJEctRrPwpzNacidSjYkkdKOX2DTgVMbKx+D9JzhQ7w+KKJzUxnRzy8cMjSP7HNUn32eJlJdbjsU7AMZyJy3ZJ7YJB8AnOxXgFaPVYx+8YrCIry5Sxd+WMMpoE5V6O2OItUkVn1Wn9LXr7hg1nm6AkS4YFKMmsIT7Cvy80zJkju2L85kyDEmFLmi0b40cvxv+LAKgHfaCBnxZ5WVJ8ns9cwMa3AAMAEYFcZpXDIdUAAAAASUVORK5CYII=';
      }
    }
  }else {
    cxt.fillStyle = 'rgba(204, 204, 204, .3)';
    if(str) {
      img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAQCAYAAADj5tSrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzNCMTdFRTVCRjZGMTFFQTlCNjhGNUNDNDNBOEM3NDQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzNCMTdFRTRCRjZGMTFFQTlCNjhGNUNDNDNBOEM3NDQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmRpZDpGNTY0NDJCRDZGQkZFQTExODk5NTk5RDIyNzE2RjE5RSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGNTY0NDJCRDZGQkZFQTExODk5NTk5RDIyNzE2RjE5RSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PopDpf4AAAHESURBVHjanJTLK0RRHMfvvXNlPPIIMVl4JlJKiDILrK2U8g9IKa+iKf4AZWNjdlhNSllZKCk7ZWWDmvKIPIZIyExeDd9f/a5+Tuce5Vuf2znnd+b8fud7zhw7EokELMvqApNgFyyAB5AHXsGb9Vu1YA3kgBAYB4si3g9WwB2YA1EXnz6wCmwOvIAv8GTplRDJ0uBWxKjgVuByAfO0joPPNCcglXOFJmWCCm5fMJ5o9+3K/EFK0iAGeni7uYYklaCA2yfgUsRovFmZH3LFLjxFQSNYB1TENTgQ8TbRpiT3ol/Fu5FKO5pKydcRsAU2wZiI2crOj5RYWLNehqO5PVIpsC36dCGquZ0ExyJGrnRq1sh2+Jr6iazYF32a38TtKxAXsSzFyp/CHM2ZSD0qltSAYm7fgFMRIxsL/5PkTLEzLK54QhPTySUfP3yC5P+hJukeW7ysxLp91gm6hjNJs11SO2AAfIJzMV4GWnzWCbgGq8jKEmXsXTkjTxOg1M8RR7xFquisOqy/RW/fkOFs45RkybAAJZkxxIf59/mGObNkV4zfnClQJGxJsWWj/OjF+H8RBHWgF9Tz0yIvS5LP85kL2PgWYAAZtFwWxnjJgAAAAABJRU5ErkJggg==';
    }
  }
  // 图片加载完成
  img.onload = async () => {
    await document.fonts.load(cxt.font);
    // 绘制文字
    cxt.fillText(str, cvs.width / 20 + 28, cvs.height-14);
    cxt.globalAlpha = .2;
    // 绘制图片
    cxt.drawImage(img,cvs.width / 20,cvs.height-21);
    // 创建容器
    let div = document.createElement('div');
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.background = 'url(' + cvs.toDataURL('image/png') + ') left top repeat';
    [].forEach.call(wm.children, e => {
      e.remove();
    });
    wm.appendChild(div);
  };
};

watermark.set = str => {
  setWatermark(str, true);
  window.onresize = () => {
    setWatermark(str, false);
  }
};

export default watermark;
