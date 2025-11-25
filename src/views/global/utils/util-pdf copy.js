// 导出页面为PDF格式
import html2Canvas from "html2canvas";
import JsPDF from "jspdf";

/**
 * 获取Pdf文件
 *
 * @param name
 * @param id
 * @param scale
 * @param isOpen
 * @param isDown
 * @param callback
 *
 */
const getPdfFile = (name, id, scale, isOpen, isDown, callback) => {
  let title = name || "index";
  html2Canvas(document.querySelector(`#${id}`), {
    scale: scale || 1, // 用于渲染的比例。该数值越高，越清晰，同时生成的pdf文件也越大
    useCORS: true, // 跨域加载图片
    logging: true // 可以长屏分页导出
  }).then(function(canvas) {
    let pdfWidth = canvas.width;
    let pdfHeight = canvas.height;
    let pageHeight = (pdfWidth / 592.28) * 841.89;
    let leftHeight = pdfHeight;
    let position = 0;
    let imgWidth = 595.28;
    let imgHeight = (595.28 / pdfWidth) * pdfHeight;
    let pageData = canvas.toDataURL("img/jpeg", 1.0);
    let pdf = new JsPDF("p", "pt", "a4");
    // 判断打印dom高度是否需要分页，如果需要进行分页处理
    if (leftHeight < pageHeight) {
      pdf.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
    } else {
      while (leftHeight > 0) {
        pdf.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
        leftHeight -= pageHeight;
        position -= 841.89;
        if (leftHeight > 0) {
          pdf.addPage();
        }
      }
    }
    // 打开
    if (isOpen) {
      window.open(pdf.output("bloburl"));
    }
    // 下载
    if (isDown) {
      pdf.save(title + ".pdf");
    }
    // 回调：返回PDF对象
    callback(pdf);
  });
};

export default {
  // 获取Pdf文件
  getPdfFile
};
