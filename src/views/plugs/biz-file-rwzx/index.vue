<template>
  <div class="con-biz-file-rwzx" v-loading="uploadLoading">
    <el-upload
      v-if="showAddBtn"
      class="upload-demo"
      action="doUpload"
      list-type="picture-card"
      :before-upload="beforeUpload"
      :on-change="handleUploadFile"
    >
      <el-button size="mini" type="primary" icon="el-icon-upload">点击上传</el-button>
    </el-upload>
    <div class="con-file-all">
      <div class="con-file-name">
        <div
          class="file-name"
          v-for="(item, index) in nameList"
          :key="index"
          @click="handleDownload(index)"
        >
          <div class="con-tag" title="点击下载附件">
            <i class="el-icon-document"></i>
          </div>
          <div class="con-name hdty-elip" :title="item">{{item}}</div>
          <div class="con-btn" v-show="deleteFileSubItem">
            <i class="el-icon-close" title="点击删除附件" @click.stop="handleDelete(index)"></i>
          </div>
        </div>
        <div v-if="!nameList || nameList.length === 0" class="con-empty">暂无附件</div>
      </div>
    </div>
  </div>
</template>

<script>
import { hdForm, hdList } from '@/utils/util-framework';
import { uploadFile } from './api';

export default {
  name: 'Index',
  provide() {
    return {
      bizFileRwzx: this
    };
  },
  inject: [],
  mixins: [hdList, hdForm],
  components: {},
  props: {
    // 显示新增按钮
    showAddBtn: {
      type: Boolean,
      default: true
    },
    // 是否可删除大项中的子项
    deleteFileSubItem: {
      type: Boolean,
      default: true
    },
    // 当前业务类型（1：任务中心）
    currentBusinessType: {
      type: String,
      default: '1'
    },
    detailIdList: {
      type: Array,
      default: () => []
    },
    detailUrlList: {
      type: Array,
      default: () => []
    },
    detailNameList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 加载提示
      uploadLoading: false,
      // 附件id集合
      idList: this.detailIdList,
      // 附件url集合
      urlList: this.detailUrlList,
      // 附件name集合
      nameList: this.detailNameList
    };
  },
  watch: {},
  methods: {
    // 附件上传前格式和大小的验证方法
    beforeUpload(file) {
      return false;
    },
    // 上传附件
    handleUploadFile(file) {
      let _this = this;
      // 附件上传前的验证，需要与 beforeUpload 方法对应
      _this.files = file;
      // 当前页面附件名称重复验证
      if (_this.nameList.find((item) => item === file.name)) {
        _this.$message({
          showClose: true,
          customClass: 'is-fixed',
          message: '该附件已存在',
          type: 'warning'
        });
        return false;
      }
      // 附件格式验证
      let fileSufNameList = [
        'jpg',
        'png',
        'jpeg',
        'gif',
        'bmp',
        'doc',
        'docx',
        'xls',
        'xlsx',
        'pdf',
        'txt',
        'zip',
        'rar'
      ];
      let fileSufName = _this.$utilAll.getFileSufName(file.name);
      if (!fileSufNameList.find((item) => item === fileSufName)) {
        _this.$message({
          showClose: true,
          customClass: 'is-fixed',
          message:
            '上传附件只能是 jpg png jpeg gif bmp doc docx xls xlsx pdf txt zip rar格式!',
          type: 'warning'
        });
        return false;
      }
      // 附件大小验证
      if (file.size / 1024 / 1024 > 10) {
        _this.$message({
          showClose: true,
          customClass: 'is-fixed',
          message: '上传附件大小不能超过 10MB！',
          type: 'warning'
        });
        return false;
      }
      // 加载提示
      _this.uploadLoading = true;
      // 构造表单提交的数据
      let fileFormData = new FormData();
      fileFormData.append('file', file.raw);
      let form = {
        params: {
          fileType: '111111',
          busType: _this.currentBusinessType
        },
        data: fileFormData
      };
      // Lambda写法
      uploadFile(form)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            // 将上传的附件添加到附件的集合中
            _this.idList.push(data.fileId);
            _this.urlList.push(data.fileUrl);
            _this.nameList.push(data.fileName);
            // 提示
            _this.$message({
              showClose: true,
              customClass: 'is-fixed',
              message: '上传成功',
              type: 'success'
            });
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.log(error);
        })
        .finally(() => {
          _this.uploadLoading = false;
        });
    },
    // 下载
    handleDownload(index) {
      let _this = this;
      const downloadRes = async () => {
        let response = await fetch(_this.urlList[index]); // 内容转变成blob地址
        let blob = await response.blob(); // 创建隐藏的可下载链接
        let objectUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.download = _this.nameList[index];
        a.click();
        a.remove();
      };
      downloadRes();
    },
    // 删除
    handleDelete(index) {
      let _this = this;
      _this
        .$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          _this.idList.splice(index, 1);
          _this.urlList.splice(index, 1);
          _this.nameList.splice(index, 1);
          _this.$message({
            showClose: true,
            customClass: 'is-fixed',
            message: '删除成功',
            type: 'success'
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.con-biz-file-rwzx {
  width: 100%;
  height: 100%;
  position: relative;
  .con-file-all {
    width: calc(100% - 100px);
    .con-file-name {
      .file-name {
        display: flex;
        align-items: center;
        min-height: 40px;
        .con-tag {
          width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .con-name {
          flex: 1;
        }
        .con-btn {
          width: 40px;
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          .el-icon-close {
            display: none;
          }
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
    }
  }
  /*上传组件样式修改*/
  ::v-deep .upload-demo {
    position: absolute;
    right: 0;
    top: 4px;
    .el-upload {
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
