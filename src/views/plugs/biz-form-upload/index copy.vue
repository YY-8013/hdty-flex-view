<template>
  <div>
    <el-upload
      :action="action"
      :headers="headers"
      list-type="picture-card"
      :multiple="true"
      :limit="limit"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :file-list="fileList"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <!-- 图片预览 -->
    <div class="hidden" style="display:none;">
      <viewer>
        <img :src="dialogImageUrl" ref="viewerImgRef" />
      </viewer>
    </div>
  </div>
</template>

<script>
import { fileUpload } from './api'; // 自定义的上传API

export default {
  name: 'BizUploadUrl',
  props: {
    value: {
      type: [String, Array],
      default: () => []
    },
    prop: String,
    // 上传图片类型
    acceptType: {
      type: [String, Array],
      default() {
        return ['jpeg', 'png'];
      }
    },
    // 上传图片大小（单位MB，0代表不限制）
    acceptSize: {
      type: [Number, String],
      default: 10
    },
    action: {
      type: String,
      default: () => appEnv.baseURL + '/web/dwxxWwbhInfo/fileUpload'
    },
    limit: {
      type: [Number, String],
      default: 10
    },
    uploadApi: {
      type: Function,
      default: fileUpload
    },
    // 业务类型
    busType: {
      type: String,
      default: '41'
    }
  },
  data() {
    return {
      headers: {
        Authorization: this.$utilLogin.getUserToken()
      },
      fileList: [], // 当前文件列表
      addIdList: [], // 新增文件ID列表
      delIdList: [], // 删除文件ID列表
      dialogImageUrl: '',
      srcList: [],
      uploading: false
    };
  },
  watch: {},
  methods: {
    // 处理文件删除
    handleRemove(file, fileList) {
      if (file && file.id) {
        this.delIdList.push(file.id); // 假设 fileId 存在于 response.data 中
      }
      this.fileList = fileList;
      this.emitUpdate(); // 通知父组件
    },
    // 处理文件预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.srcList = this.fileList.map((item) => item.url); // 更新预览列表
      this.showImagePreview();
    },
    // 显示图片预览
    showImagePreview() {
      console.log('预览');

      this.$nextTick(() => {
        if (this.$refs.viewerImgRef) {
          console.log('预览123');

          this.$refs.viewerImgRef.click();
        }
      });
    },
    // 自定义文件上传逻辑
    beforeUpload(file) {
      console.log('file', file);
      // 1. 进行文件类型和大小的校验
      let isAccept = false;
      let acceptType = Array.isArray(this.acceptType)
        ? this.acceptType
        : [this.acceptType];
      acceptType.forEach((e) => {
        isAccept =
          isAccept || file.type === this.$utilFile.assetTypeToAcceptType(e);
      });

      const isSize =
        !Number(this.acceptSize) ||
        file.size / 1024 / 1024 < Number(this.acceptSize);

      if (!isAccept) {
        this.$message({
          showClose: true,
          message:
            '上传图片只能是 ' +
            this.$utilStr.arrayJoin(acceptType, '/').toUpperCase() +
            ' 格式',
          type: 'error',
          offset: 76
        });
        return false;
      }
      if (!isSize) {
        this.$message({
          showClose: true,
          message: '上传图片大小不能超过' + this.acceptSize + 'MB',
          type: 'error',
          offset: 76
        });
        return false;
      }

      // 2. 校验通过，手动进行文件上传
      this.fileSubmit(file);

      // 阻止默认的上传行为
      return false;
    },
    // 手动提交文件上传
    fileSubmit(file) {
      let fileFormData = new FormData();
      fileFormData.append('doc', file);

      let form = {
        params: {
          busType: this.busType
        },
        data: fileFormData
      };

      this.uploading = true;
      this.uploadApi(form) // 使用自定义的上传方法
        .then((response) => {
          // 响应成功回调
          let { success, msg, data } = response.data;
          if (success) {
            this.$message({
              showClose: true,
              customClass: 'is-fixed',
              message: msg,
              type: 'success'
            });
            // 将返回的文件 ID 添加到 addIdList
            // 使用 URL.createObjectURL 生成本地预览 URL
            const fileUrl = URL.createObjectURL(file);

            this.addIdList.push(data.docId);
            this.fileList.push({
              name: file.name,
              url: fileUrl,
              id: data.docId
            });

            // 通知父组件
            this.emitUpdate();
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
          this.$message({
            showClose: true,
            message: '文件上传失败',
            type: 'error',
            offset: 76
          });
        })
        .finally(() => {
          this.uploading = false;
        });
    },
    // 通知父组件更新数据
    emitUpdate() {
      this.$emit('update', {
        addIdList: this.addIdList,
        fileList: this.fileList,
        delIdList: this.delIdList
      });
      let currentIds = this.fileList.map((item) => item.id);
      this.$emit('input', currentIds);
    },
    reset() {
      this.fileList = [];
      this.delIdList = [];
      this.addIdList = [];
    }
  }
};
</script>

<style scoped>
</style>
