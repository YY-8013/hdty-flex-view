<template>
  <div class="con-biz-file-detail" v-loading="uploadLoading">
    <div class="file-list">
      <div
        class="file-item"
        v-for="(item, index) in fileList"
        :key="index"
        @click="handleDownload(item)"
      >
        <div class="download-tag" title="点击下载附件">
          <i class="el-icon-document"></i>
        </div>
        <div class="con-name hdty-elip" :title="item.fileName">{{item.fileName || item.name}}</div>
      </div>
      <div v-if="!fileList || fileList.length === 0" class="con-empty">暂无附件</div>
    </div>
  </div>
</template>

<script>
import { hdForm, hdList } from '@/utils/util-framework';

export default {
  name: 'BizFileList',
  provide() {
    return {
      bizFileList: this
    };
  },
  inject: [],
  mixins: [hdList, hdForm],
  components: {},
  props: {
    fileList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 加载提示
      uploadLoading: false
    };
  },
  watch: {},
  methods: {
    // 附件上传前格式和大小的验证方法
    beforeUpload(file) {
      return false;
    },
    // 下载
    handleDownload(file) {
      let _this = this;
      const downloadRes = async () => {
        let response = await fetch(file.fileUrl || file.url); // 内容转变成blob地址
        let blob = await response.blob(); // 创建隐藏的可下载链接
        let objectUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.download = file.fileName || file.name;
        a.click();
        a.remove();
      };
      downloadRes();
    }
  }
};
</script>

<style lang="scss" scoped>
.con-biz-file-detail {
  width: 100%;
  height: 100%;
  position: relative;
  .file-list {
    display: flex;
    flex-direction: column;
  }
  .file-item {
    display: flex;
    align-items: center;
    min-height: 40px;
    .download-tag {
      flex: 0 0 30px;
      display: flex;
      align-items: center;
    }
    .con-name {
      flex: 1;
    }
    &:hover {
      background-color: #f5f7fa;
      border-radius: 8px;
      .con-name {
        color: #409eff;
        cursor: pointer;
      }
      .con-btn {
        cursor: pointer;
        .el-icon-close {
          display: block;
        }
      }
    }
  }
  .con-empty {
    color: #878d99;
    height: 40px;
    line-height: 40px;
  }
  /*上传组件样式修改*/
  .upload-demo {
    position: absolute;
    right: 0;
    top: 4px;
    ::v-deep .el-upload {
      width: auto;
      height: 0;
      line-height: 0;
      background: none;
      border: none;
      .el-button {
        padding: 5px 8px;
        display: flex;
        align-items: center;
        i {
          color: #ffffff;
          font-size: 18px;
        }
      }
    }
  }
}
</style>
