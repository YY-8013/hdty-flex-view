/**
 * HTMLElement操作类函数
 */


// 判断元素是否为HTMLElement元素
const isHTMLElement = el => {
  let d = document.createElement('div');
  try {
    d.appendChild(el.cloneNode(true));
    return el.nodeType === 1;
  } catch(e) {
    return false;
  }
};

// 判断元素是否为HTML字符串
const isHTMLStr = str => {
  let d = document.createElement('div');
  try {
    d.innerHTML = str;
    for (let c = d.childNodes, i = c.length; i--;) {
      if (c[i].nodeType === 1) return true;
    }
    return false;
  } catch(e) {
    return false;
  }
};

// 判断是否为HTMLDom对象
const isHTMLDom = obj => {
  let d = document.createElement('div');
  try {
    d.appendChild(obj.cloneNode(true));
    return obj.nodeType === 1;
  } catch(e) {
    return obj === window || obj === document;
  }
};

// 查找元素的父级元素
const querySelectorParent = (el, selector) => {
  if(isHTMLElement(el)) {
    if(isHTMLElement(el.parentNode)) {
      let par = el.parentNode;
      if(selector) {
        let isClassName = selector && selector.substr(0, 1) === '.';
        if(isClassName) {
          while(par && (!par.className || par.className.split(' ').indexOf(selector.substr(1)) === -1)) {
            if(isHTMLElement(par.parentNode)) {
              par = par.parentNode;
            } else {
              par = null;
            }
          }
        } else {
          while(par && (!par.tagName || par.tagName !== selector.toUpperCase())) {
            if(isHTMLElement(par.parentNode)) {
              par = par.parentNode;
            } else {
              par = null;
            }
          }
        }
      }
      return par;
    }
  }
};

// 查找距离元素最近的进行过绝对定位的父级元素
const queryAbsoluteOffsetParent = el => {
  if(isHTMLElement(el)) {
    if(isHTMLElement(el.offsetParent || el.parentNode)) {
      let par = el.offsetParent || el.parentNode;
      while(par && ['absolute', 'fixed'].indexOf(getStyle(par, 'position')) === -1) {
        if(isHTMLElement(par.offsetParent || par.parentNode)) {
          par = par.offsetParent || par.parentNode;
        } else {
          par = null;
        }
      }
      return par;
    }
  }
};

// 获取元素距离屏幕的偏移量
const getOffset = el => {
  if(isHTMLElement(el)) {
    let totalLeft = null,totalTop = null,par = el.offsetParent;
    // 首先加自己本身的左偏移和上偏移
    totalLeft += el.offsetLeft;
    totalTop += el.offsetTop;
    // 只要没有找到body，我们就把父级参照物的边框和偏移也进行累加
    while(par){
      if(navigator.userAgent.indexOf('MSIE 8.0') === -1) {
        //累加父级参照物的边框
        totalLeft += par.clientLeft;
        totalTop += par.clientTop;
      }
      //累加父级参照物本身的偏移
      totalLeft += par.offsetLeft;
      totalTop += par.offsetTop;
      par = par.offsetParent;
    }
    return {
      left: totalLeft,
      top: totalTop
    }
  }
};

// 获取元素到最近的进行过绝对定位的父级元素的偏移量
const getOffsetOfAbsolute = el => {
  let currentOffset = getOffset(el);
  let absoluteOffset = getOffset(queryAbsoluteOffsetParent(el));
  if(currentOffset && absoluteOffset) {
    return {
      left: currentOffset.left - absoluteOffset.left,
      top: currentOffset.top - absoluteOffset.top
    }
  }
};

// 获取元素某项style属性的值
const getStyle = (el, attr) => {
  if(isHTMLElement(el)) {
    let currentStyle = el.currentStyle;
    // IE6~8不兼容backgroundPosition写法，识别backgroundPositionX/Y
    if(attr === 'backgroundPosition'){
      if(!+'\v1') { // 简单判断ie6~8
        return currentStyle.backgroundPositionX + ' ' + currentStyle.backgroundPositionY;
      }
    }
    if(currentStyle) {
      return attr ? currentStyle[attr] : currentStyle;
    } else {
      return attr ? document.defaultView.getComputedStyle(el,null)[attr] : document.defaultView.getComputedStyle(el,null);
    }
  }
};

// 获取文本所占屏幕宽度
const getTextScreenWidth = async (text, fontSize, fontWeight, fontFamily) => {
  if(text) {
    fontSize = fontSize || '14px';
    fontWeight = fontWeight || '400';
    fontFamily = fontFamily || 'Helvetica Neue, Helvetica, Microsoft YaHei, Arial, sans-serif';
    let cvs = document.createElement('canvas');
    let cxt = cvs.getContext('2d');
    cxt.font = fontWeight + ' ' + fontSize + ' ' + fontFamily;
    if(!document.fonts.check(cxt.font)) {
      await document.fonts.load(cxt.font);
    }
    return cxt.measureText(text).width;
  }
};

// 在目标元素后插入新元素
const insertAfter = (newEl, targetEl) => {
  let parentEl = targetEl.parentNode;
  if(parentEl.lastChild === targetEl) {
    parentEl.appendChild(newEl);
  } else {
    parentEl.insertBefore(newEl, targetEl.nextElementSibling);
  }
};

// 像素单位格式化
const pixelsFtt = (val, unit) => {
  unit = unit || 'px';
  if(!isNaN(parseFloat(val) && Number(val))) {
    return val + unit;
  } else if(!isNaN(parseFloat(val))) {
    return val;
  }
};

// 移除遮罩层
const removeMask = () => {
  [].forEach.call(document.querySelectorAll('.hdty-mask'), e => {
    e.remove();
  });
};

// 移除通知层
const removeNotify = () => {
  [].forEach.call(document.querySelectorAll('.iziToast-wrapper'), e => {
    e.remove();
  });
};

// 移除提示层
const removeMessage = () => {
  [].forEach.call(document.querySelectorAll('.el-message'), e => {
    e.remove();
  });
};

// 移除水印层
const removeWatermark = () => {
  [].forEach.call(document.querySelectorAll('#HDTY_watermark'), e => {
    e.remove();
  });
};

// 移除预接入系统层
const removeJoinsys = () => {
  [].forEach.call(document.querySelectorAll('#HDTY_joinsys'), e => {
    e.remove();
  });
};

// 清除当前登录痕迹
const clearCurrentLogin = () => {
  // 移除遮罩层
  removeMask();
  // 移除通知层
  removeNotify();
  // 移除提示层
  removeMessage();
  // 移除水印层
  removeWatermark();
  // 移除预接入系统层
  removeJoinsys();
};

export default {
  // 判断元素是否为HTMLElement元素
  isHTMLElement,
  // 判断元素是否为HTML字符串
  isHTMLStr,
  // 判断是否为HTMLDom对象
  isHTMLDom,
  // 查找元素的父级元素
  querySelectorParent,
  // 查找距离元素最近的进行过绝对定位的父级元素
  queryAbsoluteOffsetParent,
  // 获取元素距离屏幕的偏移量
  getOffset,
  // 获取元素到最近的进行过绝对定位的父级元素的偏移量
  getOffsetOfAbsolute,
  // 获取元素某项style属性的值
  getStyle,
  // 获取文本所占屏幕宽度
  getTextScreenWidth,
  // 在目标元素后插入新元素
  insertAfter,
  // 像素单位格式化
  pixelsFtt,
  // 移除遮罩层
  removeMask,
  // 移除通知层
  removeNotify,
  // 移除提示层
  removeMessage,
  // 移除水印层
  removeWatermark,
  // 移除预接入系统层
  removeJoinsys,
  // 清除当前登录痕迹
  clearCurrentLogin
}
