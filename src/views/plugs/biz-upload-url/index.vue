<template>
  <div>
    <span class="image-item" v-for="(item, index) in fileList" :key="index">
      <span v-show="!disabled" class="image-delete-icon" @click="handleDelete(item)" title="删除文件">
        <img src="./images/deleteIcon.png" alt />
      </span>
      <viewer>
        <img :src="item.url" alt style="cursor: pointer;" />
      </viewer>
    </span>

    <el-upload
      v-show="!disabled"
      v-loading="uploading"
      :action="action"
      :headers="headers"
      list-type="picture-card"
      :limit="limit"
      :accept="acceptTypeStr"
      :auto-upload="false"
      :before-upload="beforeUpload"
      :on-change="fileChange"
      :fileList="fileList"
      :show-file-list="false"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>
import { fileUpload } from './api'; // 自定义的上传API

export default {
  name: 'BizUploadUrl',
  provide() {
    return {
      BizUploadUrl: this
    };
  },
  props: {
    prop: String,
    oldFileList: {
      type: [Object, String, Array],
      default: () => []
    },
    // 请求地址
    action: {
      type: String,
      default: () => appEnv.baseURL + '/web/rwTask/fileUpload'
    },
    // 上传图片类型
    acceptType: {
      type: [String, Array],
      default() {
        return ['jpg', 'png', 'jpeg', 'gif', 'bmp'];
      }
    },
    // 上传图片大小（单位MB，0代表不限制）
    acceptSize: {
      type: [Number, String],
      default: 50
    },
    limit: {
      type: [Number],
      default: 10
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      headers: {
        Authorization: this.$utilPublic.getUserToken()
      },
      fileList: [],
      // dialogImageUrl: '',
      dialogVisible: false,

      dialogImageUrl: '',
      srcList: [],
      addIdList: [],
      uploading: false,
      // 基础地址
      baseURL: appEnv.baseURL,
      isInitialized: false
    };
  },
  computed: {
    acceptTypeStr() {
      if (Array.isArray(this.acceptType)) {
        return this.acceptType.join(',');
      } else {
        return this.acceptType;
      }
    }
  },
  watch: {
    oldFileList: {
      handler(newVal) {
        // 只在未初始化时执行
        if (!this.isInitialized) {
          if (newVal && Array.isArray(newVal)) {
            this.fileList = newVal;
          } else {
            this.fileList = [];
          }
          this.isInitialized = true; // 标志更新为 true，防止再次执行
        }
      },
      immediate: true
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.fileList = fileList.map((e) => e.response.data);
      let map = null;
      if (this.fileList.length > 0) {
        map = {
          addList: this.fileList,
          delList: [],
          oldList: []
        };
      }
      this.$emit('input', map);
    },
    // handlePictureCardPreview(file) {
    //   this.dialogImageUrl = file.url;
    //   this.dialogVisible = true;
    // },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.srcList = this.fileList.map((file) => file.url); // 更新预览列表
      this.showImagePreview();
    },
    showImagePreview() {
      let _this = this;
      _this.$nextTick(() => {
        if (_this.$refs.viewerImgRef) {
          _this.$refs.viewerImgRef.click();
        }
      });
    },
    updateFileList() {
      let map = {
        addList: this.fileList.map((file) => file.id),
        delList: [],
        oldList: []
      };
      this.$emit('update:oldFileList', this.fileList);
      this.$emit('input', map);
    },

    beforeUpload(file) {
      return false;
    },
    // 自定义文件上传逻辑
    fileChange(fileInfo) {
      let file = fileInfo.raw;
      // 1. 进行文件类型和大小的校验
      let isAccept = false;
      let acceptType = Array.isArray(this.acceptType)
        ? this.acceptType
        : [this.acceptType];

      acceptType.forEach((e) => {
        isAccept =
          isAccept ||
          file.type === this.$utilFile.assetTypeToAcceptType(e) ||
          this.$utilFile.isBmpType(e, file.type);
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
      if (appEnv.addWatermark) {
        this.handleFile(file);
      } else {
        this.fileSubmit(file);
      }

      // 阻止默认的上传行为
      return false;
    },
    // 手动提交文件上传
    handleFile(file) {
      this.addWatermark(file).then((watermarkedFile) => {
        this.fileSubmit(watermarkedFile);
      });
    },
    fileSubmit(file) {
      let formData = new FormData();
      formData.append('file', file);

      this.uploading = true;
      fileUpload(formData)
        .then((response) => {
          // 响应成功的处理逻辑保持不变...
          // 响应成功回调
          let { success, msg, data } = response.data;
          if (success) {
            this.$message({
              showClose: true,
              customClass: 'is-fixed',
              message: '文件上传成功',
              type: 'success'
            });
            // this.fileList.push(data);
            // 将返回的文件 ID 添加到 addIdList
            // 使用 URL.createObjectURL 生成本地预览 URL
            const fileUrl = URL.createObjectURL(file);
            this.fileList.push({
              name: file.name,
              url: data.fileUrl,
              id: data.fileId
            });
            this.updateFileList();
          }
        })
        .catch((error) => {
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
    // 添加水印的函数
    addWatermark(file) {
      let _this = this;
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const canvas = document.createElement('canvas');
          const img = new Image();
          img.src = event.target.result;

          img.onload = () => {
            //图片加载后再添加水印，否则可能报错
            let width = img.width;
            let height = img.height;
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d'); // 绘制2d图形
            ctx.drawImage(img, 0, 0, width, height);
            let basePx = canvas.width;
            //字体大小  照片添加水印
            let fontSize = basePx / 30; //水印文字尺寸
            ctx.shadowColor = 'rgba(0, 0, 0, 1)';
            ctx.shadowOffsetX = 3; //水印文字阴影
            ctx.shadowOffsetY = 3;
            ctx.shadowBlur = 15;
            ctx.rotate(0); //水印文字倾斜
            ctx.font = fontSize + 'px 微软雅黑';
            ctx.fillStyle = 'rgba(255, 255, 255, 1)'; //水印透明度
            let watermarkText1 =
              '采集时间：' +
              _this.$utilDate.dateFtt(new Date(), 'yyyy-MM-dd HH:mm:ss'); //水印文字内容
            let watermarkText2 =
              '采 集 人：' + _this.$utilPublic.getUserInfo().xm; //水印文字内容
            ctx.fillText(
              watermarkText1,
              width - fontSize * 17,
              height - fontSize * 2.6
            );
            ctx.fillText(
              watermarkText2,
              width - fontSize * 17,
              height - fontSize
            );
            let dataBase64 = canvas.toDataURL(file.type); // 输出压缩后的base64
            // base64转file
            const arr = dataBase64.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            const fileNew = new File(
              [new Blob([u8arr], { type: mime })],
              file.name,
              { type: file.type }
            );
            resolve(fileNew);
          };
        };
        reader.onerror = (error) => reject(error);
      });
    },
    // 移除图片
    handleDelete(file) {
      this.fileList = this.fileList.filter(
        (fileItem) => fileItem.id !== file.id
      );
      this.updateFileList();
    }
  }
};
</script>

<style lang="scss" scoped>
.image-item {
  position: relative;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  margin: 0 8px 8px 0;
  float: left;
  display: flex;
  align-items: center;
  .image-item-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    opacity: 0;
    z-index: 9;
  }
  &:hover {
    .image-item-mask {
      opacity: 1;
      background-color: rgba(255, 255, 255, 0.3);
    }

    .image-preview-icon,
    .image-delete-icon {
      display: block;
    }
  }
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.image-item:hover {
  background-color: rgba(109, 109, 109, 0.1);
}

.image-preview-icon,
.image-delete-icon {
  // display: none;
}

.image-item:hover span {
  // position: absolute;
  // display: inline-block;
  // cursor: pointer;
  // font-size: 20px;
  // color: #fff;
  // line-height: 18px;
}

.image-item:hover .image-preview-icon {
  left: 40px;
}

.image-delete-icon {
  position: absolute;
  right: 0;
  top: -2px;
  cursor: pointer;
  z-index: 10;
}

[class*='el-icon-'],
[class^='el-icon-'] {
  font-family: element-icons, serif !important;
  speak: none;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  cursor: pointer;
}

.el-icon-zoom-in:before {
  content: '\e777';
}

.el-icon-delete:before {
  content: '\e6d7';
}

.img-preview-container,
.img-preview-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

::v-deep .commonDoc {
  &.requiredDoc {
    color: #ff0b00;
    &::after {
      content: ' （必传）';
    }
  }
}
</style>
