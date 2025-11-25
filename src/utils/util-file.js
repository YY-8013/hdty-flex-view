/**
 * 文件类函数
 */

// 判断是否文件类型
const isAssetTypeAnFile = (ext) => {
  return (
    [
      // 图片文件类型
      "jpg",
      "jpe",
      "jpeg",
      "png",
      "gif",
      "jp2",
      "webp",
      "svg",
      "tif",
      "tiff",
      "bmp",
      "psd",
      "tga",
      "dwg",
      "dxf",
      "svf",
      // 文档文件类型
      "xls",
      "xlc",
      "xlm",
      "xlt",
      "xlw",
      "xlsx",
      "doc",
      "dot",
      "docx",
      "ppt",
      "pptx",
      "pot",
      "pps",
      "pdf",
      "xml",
      "json",
      "exe",
      "ai",
      "eps",
      "odt",
      "swf",
      "asf",
      "mpp",
      "dtd",
      "wdb",
      "wps",
      "xhtml",
      // 压缩文件类型
      "zip",
      "rar",
      "tar",
      "7z",
      "gz",
      "tgz",
      "bz",
      "bz2",
      "tbz",
      // 视频文件类型
      "mp4",
      "3gpp",
      "avi",
      "mov",
      "mkv",
      "wm",
      "mpg",
      "mpeg",
      "dv",
      "flv",
      // 音频文件类型
      "mp3",
      "mp2",
      "wav",
      "ac3",
      "etc",
      "ogg",
      "wma",
      "mp4a",
      "au",
      "mid",
      // 文字文件类型
      "txt",
      "htm",
      "html",
      "js",
      "css",
      "rtf",
      "rtfd",
      "csv",
      "sh",
      "php",
      "py",
      "java",
      "rb",
      "pl",
      "sql"
    ].indexOf(ext && (ext + "").replace(/^\./, "").toLowerCase()) !== -1
  );
};

// 判断是否图片类型
const isAssetTypeAnImage = (ext) => {
  return (
    [
      "jpg",
      "jpe",
      "jpeg",
      "png",
      "gif",
      "jp2",
      "webp",
      "svg",
      "tif",
      "tiff",
      "bmp",
      "psd",
      "tga",
      "dwg",
      "dxf",
      "svf"
    ].indexOf(ext && (ext + "").replace(/^\./, "").toLowerCase()) !== -1
  );
};

// 判断是否base64编码
const isBase64 = (str) => {
  return /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i.test(
    str
  );
};

// 判断是否文件路径
const isFilePath = (str) => {
  return /(^[\/\\].*)|(^([A-Za-z][A-Za-z\d\+\-\.]*:)?[\/\\])/.test(str);
};

// file转base64（同时支持blob转base64）
const fileToBase64 = (file, callback) => {
  if (file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      callback(reader.result);
    };
  } else {
    callback();
  }
};

// imgUrl转base64
const imgToBase64 = (url, callback) => {
  let cvs = document.createElement("canvas"),
    cxt = cvs.getContext("2d"),
    img = new Image();
  // 解决跨域 Canvas 污染问题
  img.setAttribute("crossOrigin", "anonymous");
  img.src = url;
  img.onload = () => {
    cvs.height = img.height;
    cvs.width = img.width;
    cxt.drawImage(img, 0, 0);
    let ext = getFileExtension(url);
    if (!isAssetTypeAnImage(ext)) {
      ext = "png";
    }
    let dataURL = cvs.toDataURL(assetTypeToAcceptType(ext));
    callback(dataURL);
    cvs = null;
  };
  img.onerror = () => {
    callback();
  };
};

// base64转blob
const base64ToBlob = (base64) => {
  if (base64) {
    let parts = base64.split(";base64,");
    let contentType = parts[0].split(":")[1];
    let raw = window.atob(parts[1]);
    let rawLength = raw.length;

    let uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }
};

// base64转file
const base64ToFile = (base64, filename, ext) => {
  if (base64) {
    let arr = base64.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    let file = new File([u8arr], appendFileExtension(filename, ext), {
      type: mime
    });
    file.uid = new Date().getTime();
    return file;
  }
};

// 文件类型转有效的接受类型
const assetTypeToAcceptType = (ext) => {
  if (ext) {
    ext = ext.replace(/^\./, "").toLowerCase();
    if (
      [
        // 图片文件类型
        "jpg",
        "jpe",
        "jpeg"
      ].indexOf(ext) !== -1
    ) {
      return "image/jpeg";
    } else if (["png", "gif", "jp2", "webp", "svg"].indexOf(ext) !== -1) {
      return "image/" + ext;
    } else if (["tif", "tiff"].indexOf(ext) !== -1) {
      return "image/tiff";
    } else if (ext === "bmp") {
      return "image/x-ms-bmp";
    } else if (ext === "psd") {
      return "image/vnd.adobe.photoshop";
    } else if (ext === "tga") {
      return "image/x-targa";
    } else if (["dwg", "dxf", "svf"].indexOf(ext) !== -1) {
      return "image/vnd." + ext;
    } else if (
      [
        // 文档文件类型
        "xls",
        "xlc",
        "xlm",
        "xlt",
        "xlw"
      ].indexOf(ext) !== -1
    ) {
      return "application/vnd.ms-excel";
    } else if (ext === "xlsx") {
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    } else if (["doc", "dot"].indexOf(ext) !== -1) {
      return "application/msword";
    } else if (ext === "docx") {
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (["ppt", "pptx", "pot", "pps"].indexOf(ext) !== -1) {
      return "application/vnd.ms-powerpoint";
    } else if (["pdf", "xml", "json"].indexOf(ext) !== -1) {
      return "application/" + ext;
    } else if (ext === "exe") {
      return "application/octet-stream";
    } else if (["ai", "eps"].indexOf(ext) !== -1) {
      return "application/postscript";
    } else if (ext === "odt") {
      return "application/vnd.oasis.opendocument.text";
    } else if (ext === "swf") {
      return "application/x-shockwave-flash";
    } else if (ext === "asf") {
      return "allpication/vnd.ms-asf";
    } else if (ext === "mpp") {
      return "application/vnd.ms-project";
    } else if (ext === "dtd") {
      return "application/xml-dtd";
    } else if (["wdb", "wps"].indexOf(ext) !== -1) {
      return "application/vnd.ms-works";
    } else if (ext === "xhtml") {
      return "application/xhtml+xml";
    } else if (ext === "zip") {
      // 压缩文件类型
      return "application/zip";
    } else if (ext === "rar") {
      return "application/octet-stream";
    } else if (ext === "tar") {
      return "application/x-tar";
    } else if (ext === "7z") {
      return "application/x-7z-compressed";
    } else if (["gz", "tgz"].indexOf(ext) !== -1) {
      return "application/x-gzip";
    } else if (["bz", "bz2", "tbz"].indexOf(ext) !== -1) {
      return "application/x-bzip2";
    } else if (
      [
        // 视频文件类型
        "mp4",
        "3gpp"
      ].indexOf(ext) !== -1
    ) {
      return "video/" + ext;
    } else if (ext === "avi") {
      return "video/x-msvideo";
    } else if (ext === "mov") {
      return "video/quicktime";
    } else if (ext === "mkv") {
      return "video/x-matroska";
    } else if (ext === "wm") {
      return "video/x-ms-wmv";
    } else if (["mpg", "mpeg"].indexOf(ext) !== -1) {
      return "video/mpeg";
    } else if (["dv", "flv"].indexOf(ext) !== -1) {
      return "video/x-" + ext;
    } else if (
      [
        // 音频文件类型
        "mp3",
        "mp2"
      ].indexOf(ext) !== -1
    ) {
      return "audio/mpeg";
    } else if (["wav", "ac3", "etc", "ogg"].indexOf(ext) !== -1) {
      return "audio/" + ext;
    } else if (ext === "wma") {
      return "audio/x-ms-wma";
    } else if (ext === "mp4a") {
      return "audio/mp4";
    } else if (ext === "au") {
      return "audio/basic";
    } else if (ext === "mid") {
      return "audio/midi";
    } else if (ext === "txt") {
      // 文字文件类型
      return "text/plain";
    } else if (["htm", "html"].indexOf(ext) !== -1) {
      return "text/html";
    } else if (ext === "js") {
      return "text/javascript";
    } else if (["css", "rtf", "rtfd", "csv"].indexOf(ext) !== -1) {
      return "text/" + ext;
    } else if (ext === "sh") {
      return "text/x-shellscript";
    } else if (ext === "php") {
      return "text/x-php";
    } else if (ext === "py") {
      return "text/x-python";
    } else if (ext === "java") {
      return "text/x-java-source";
    } else if (ext === "rb") {
      return "text/x-ruby";
    } else if (ext === "pl") {
      return "text/x-perl";
    } else if (ext === "sql") {
      return "text/x-sql";
    } else {
      return false;
    }
  }
};

const isBmpType = (ext, fileType) => {
  ext = ext.replace(/^\./, "").toLowerCase();
  return (
    ext === "bmp" && (fileType === "image/bmp" || fileType === "image/x-ms-bmp")
  );
};

// 追加文件扩展名
const appendFileExtension = (filename, ext, url) => {
  let currentName;
  let currentExt;
  if (filename) {
    if (isFilePath(filename)) {
      filename = getFilenameOfPath(filename);
    }
    filename = filename.substr(0, 255);
    let fExt = getFileExtension(filename);
    if (fExt && isAssetTypeAnFile(fExt)) {
      let fName = removeFileExtension(filename);
      if (fName) {
        currentName = fName;
      }
      currentExt = fExt;
    } else {
      currentName = filename;
    }
  }
  if (ext) {
    let index = ext.indexOf(".");
    if (index > -1 && index < ext.length - 1) {
      currentExt = ext.substring(index + 1);
    } else {
      currentExt = ext;
    }
  }
  if (!currentName || !currentExt) {
    if (url && isFilePath(url)) {
      url = getFilenameOfPath(url).substr(0, 255);
      if (!currentName) {
        let fName = removeFileExtension(url);
        if (fName) {
          currentName = fName;
        }
      }
      if (!currentExt) {
        let fExt = getFileExtension(url);
        if (fExt && isAssetTypeAnFile(fExt)) {
          currentExt = fExt;
        }
      }
    }
    if (!currentName) {
      currentName = new Date().getTime();
    }
    if (!currentExt) {
      currentExt = "png";
    }
  }
  return currentName + "." + currentExt.toLowerCase();
};

// 获取文件扩展名
const getFileExtension = (filename) => {
  if (filename) {
    if (isFilePath(filename)) {
      filename = getFilenameOfPath(filename);
    }
    let index = filename.lastIndexOf(".");
    if (index > -1 && index < filename.length - 1) {
      return filename.substr(index + 1);
    }
  }
};

// 获取文件路径下最后的文件名
const getFilenameOfPath = (path) => {
  if (path) {
    return path
      .replace(/(\?|#)[^'"]*/, "")
      .substring(path.lastIndexOf("/") + 1, path.length);
  }
};

// 获取IE浏览器版本
const getIEVersion = () => {
  let userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
  let isLessIE11 =
    userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; // 判断是否为小于IE11的浏览器
  let isEdge = userAgent.indexOf("Edge") > -1 && !isLessIE11; // 判断是否为IE的Edge浏览器
  let isIE11 =
    userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1; // 判断是否为IE11浏览器
  if (isLessIE11) {
    let IEReg = new RegExp("MSIE (\\d+\\.\\d+);");
    IEReg.test(userAgent);
    let IEVersionNum = parseFloat(RegExp["$1"]);
    if (IEVersionNum === 7) {
      return 7;
    } else if (IEVersionNum === 8) {
      return 8;
    } else if (IEVersionNum === 9) {
      return 9;
    } else if (IEVersionNum === 10) {
      return 10;
    } else {
      return 6; // IE版本<=7
    }
  } else if (isEdge) {
    return "edge"; // edge
  } else if (isIE11) {
    return 11; // IE11
  } else {
    return -1; // 不是ie浏览器
  }
};

/**
 * 截取图片的一部分
 * @param url 图片地址
 * @param newWidth 截取图片宽度
 * @param newHeight 截取图片高度
 * @param offsetX 水平方向的偏移
 * @param offsetY 垂直方向的偏移
 * @param ratio 比率
 * @param callback 回调函数
 */
const captureImage = ({
  url = null,
  newWidth = null,
  newHeight = null,
  offsetX = 0,
  offsetY = 0,
  ratio = 1,
  callback = null
}) => {
  let img = new Image();
  // 解决跨域 Canvas 污染问题
  img.setAttribute("crossOrigin", "anonymous");
  img.src = url;
  img.onload = () => {
    let toCvs = document.createElement("canvas");
    let toCxt = toCvs.getContext("2d");
    newWidth = newWidth || img.width;
    newHeight = newHeight || img.height;
    toCvs.width = newWidth;
    toCvs.height = newHeight;
    let cvs = document.createElement("canvas");
    let cxt = cvs.getContext("2d");
    cvs.width = img.width;
    cvs.height = img.height;
    cxt.drawImage(img, 0, 0);
    toCxt.drawImage(
      cvs,
      offsetX,
      offsetY,
      newWidth * ratio,
      newHeight * ratio,
      0,
      0,
      newWidth,
      newHeight
    );
    callback(toCvs.toDataURL());
  };
  img.onerror = () => {
    callback();
  };
};

// 去除文件扩展名
const removeFileExtension = (filename) => {
  if (filename) {
    let index = filename.lastIndexOf(".");
    if (index > -1 && index < filename.length - 1) {
      return filename.substring(0, index);
    }
    return filename;
  }
};

// 去除base64编码前缀
const removeBase64Prefix = (base64) => {
  if (base64) {
    return base64.replace(
      /data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,/,
      ""
    );
  }
};

// 下载URL图片
const downloadImage = (url, filename, ext) => {
  let img = new Image();
  // 解决跨域 Canvas 污染问题
  img.setAttribute("crossOrigin", "anonymous");
  img.src = url;
  img.onload = () => {
    let fName = appendFileExtension(filename, ext, url);
    let cvs = document.createElement("canvas");
    cvs.width = img.width;
    cvs.height = img.height;
    let cxt = cvs.getContext("2d");
    cxt.drawImage(img, 0, 0, img.width, img.height);
    let dataURL = cvs.toDataURL(assetTypeToAcceptType(getFileExtension(fName)));
    if (window.navigator.msSaveBlob) {
      let blob = base64ToBlob(dataURL);
      navigator.msSaveBlob(blob, fName);
    } else {
      let link = document.createElement("a");
      link.href = dataURL;
      link.download = fName;
      link.target = "_blank";
      let evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, true);
      link.dispatchEvent(evt);
    }
  };
};

// 下载base64图片
const downloadBase64 = (base64, filename, ext) => {
  if (base64) {
    let fName = appendFileExtension(filename, ext);
    let blob = base64ToBlob(base64);
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, fName);
    } else {
      let url = window.URL.createObjectURL(blob);
      let link = document.createElement("a");
      link.href = url;
      link.download = fName;
      link.target = "_blank";
      let evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, true);
      link.dispatchEvent(evt);
      window.URL.revokeObjectURL(url);
    }
  }
};

// 下载URL文件
const downloadFile = async (url, filename, ext) => {
  if (url) {
    // iOS设备不支持下载
    if (/(iP)/g.test(navigator.userAgent)) {
      alert("您的设备不支持文件下载");
      return false;
    } else {
      let fName = appendFileExtension(filename, ext, url);
      let response = await fetch(url); // 内容转变成blob地址
      let blob = await response.blob();
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, fName);
      } else {
        url = window.URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = url;
        link.download = fName;
        link.target = "_blank";
        let evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        link.dispatchEvent(evt);
        window.URL.revokeObjectURL(url);
      }
    }
  }
};

// 下载二进制流文件
const downloadBlob = (content, filename, ext) => {
  if (content) {
    let fName = appendFileExtension(filename, ext);
    let blob = new Blob([content]);
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, fName);
    } else {
      let url = window.URL.createObjectURL(blob);
      let link = document.createElement("a");
      link.href = url;
      link.download = fName;
      link.target = "_blank";
      let evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, true);
      link.dispatchEvent(evt);
      window.URL.revokeObjectURL(url);
    }
  }
};

export default {
  // 判断是否文件类型
  isAssetTypeAnFile,
  // 判断是否图片类型
  isAssetTypeAnImage,
  // 判断是否base64编码
  isBase64,
  // 判断是否文件路径
  isFilePath,
  // file转base64（同时支持blob转base64）
  fileToBase64,
  // imgUrl转base64
  imgToBase64,
  // base64转blob
  base64ToBlob,
  // base64转file
  base64ToFile,
  // 文件类型转有效的接受类型
  assetTypeToAcceptType,
  // 追加文件扩展名
  appendFileExtension,
  // 获取文件扩展名
  getFileExtension,
  // 获取文件路径下最后的文件名
  getFilenameOfPath,
  // 获取IE浏览器版本
  getIEVersion,
  // 截取图片的一部分
  captureImage,
  // 去除文件扩展名
  removeFileExtension,
  // 去除base64编码前缀
  removeBase64Prefix,
  // 下载URL图片
  downloadImage,
  // 下载base64图片
  downloadBase64,
  // 下载URL文件
  downloadFile,
  // 下载二进制流文件
  downloadBlob,
  // 判断是否为bmp文件
  isBmpType
};
