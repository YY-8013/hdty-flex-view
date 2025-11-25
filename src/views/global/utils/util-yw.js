/**
 * 从文件表数据中提取文件ID列表和文件对象列表
 * @param {Object} fileTableData 文件表数据对象
 * @returns {Object} 包含oldIds和oldFileList的对象
 */
const extractFileData = fileTableData => {
  let oldIds = [];
  let oldFileList = [];

  if (
    fileTableData &&
    fileTableData.length > 0 &&
    fileTableData[0].idList &&
    fileTableData[0].nameList &&
    fileTableData[0].urlList
  ) {
    fileTableData[0].idList.forEach((fileId, fileIndex) => {
      oldIds.push(fileId);
      let fileObj = {
        id: fileId,
        name: fileTableData[0].nameList[fileIndex],
        url: fileTableData[0].urlList[fileIndex]
      };
      oldFileList.push(fileObj);
    });
  }

  return {
    oldIds,
    oldFileList
  };
};

export default {
  // 从文件表数据中提取文件ID列表和文件对象列表
  extractFileData
};
