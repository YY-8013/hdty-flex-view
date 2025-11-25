import html2canvas from "html2canvas";
import JsPDF from "jspdf";

/**
 * 导出 HTML 页面为 PDF
 * @param {string} name - 导出的 PDF 文件名
 * @param {string} id - 需要导出的 HTML 元素 ID
 * @param {number} scale - 缩放比例，默认 2
 * @param {boolean} isOpen - 是否打开 PDF 预览
 * @param {boolean} isDown - 是否直接下载 PDF
 * @param {Function} callback - 处理完成后的回调函数，返回 PDF 对象
 */
const getPdfFile = (
  name,
  id,
  scale = 2,
  isOpen = false,
  isDown = true,
  callback = () => {}
) => {
  const element = document.querySelector(`#${id}`);
  if (!element) {
    console.error("未找到目标元素");
    return;
  }

  // 获取当前DOM的高度
  let contentHeight = element.scrollHeight;
  let contentWidth = element.scrollWidth;

  const pageHeight = 841.889764; // A4 高度 (pt)
  const imgWidth = 595.27559; // A4 宽度 (pt)

  // 计算每批次的高度
  let batchHeight = pageHeight * 20; // **严格控制每批次 20 页的截图**

  let elLeftHeight = contentHeight; // 剩余的内容高度

  let currentBatchHeight = Math.min(batchHeight, elLeftHeight);

  const pdf = new JsPDF("p", "pt", "a4"); // A4 纵向

  let scrollY = 0; // 记录滚动位置

  const renderBatch = () => {
    return html2canvas(element, {
      scale,
      useCORS: true,
      y: scrollY, // 从当前滚动位置开始截图
      width: contentWidth,
      height: currentBatchHeight // **严格控制只截取 batchHeight 高度**
    }).then(canvas => {
      let pdfWidth = canvas.width;
      let pdfHeight = canvas.height;

      let currentPageHeight = (pageHeight * pdfWidth) / imgWidth;

      const imgHeight = (imgWidth / canvas.width) * canvas.height;
      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      let leftHeight = canvas.height;
      let currentPosition = 0; // **修正分页逻辑**

      while (leftHeight > 0) {
        pdf.addImage(imgData, "JPEG", 0, currentPosition, imgWidth, imgHeight);
        leftHeight -= currentPageHeight;
        currentPosition -= pageHeight;

        // **确保仅在 leftHeight 仍有内容时添加新页**
        if (leftHeight > 0) {
          pdf.addPage();
        }
      }

      scrollY += currentBatchHeight; // **严格递增 scrollY**
      elLeftHeight -= currentBatchHeight;
      currentBatchHeight = Math.min(batchHeight, elLeftHeight);

      if (scrollY < element.scrollHeight) {
        pdf.addPage();
        return renderBatch();
      }
    });
  };

  renderBatch().then(() => {
    if (isOpen) {
      window.open(pdf.output("bloburl"));
    }
    if (isDown) {
      pdf.save(name + ".pdf");
    }
    callback(pdf);
  });
};

export default {
  getPdfFile
};
