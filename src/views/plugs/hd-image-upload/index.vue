<template>
  <el-upload
    class="zdry-image-upload"
    action
    :auto-upload="false"
    :show-file-list="false"
    :style="{ width: pageWidth, height: pageHeight, margin: '0 auto' }"
    :disabled="disabled"
    :on-change="handleFileChange"
  >
    <img v-if="url" :src="url" class="hdty-upload-slot" :class="imageFit" />
    <div v-else class="hdty-upload-avatar" :style="{ height: height ? 'auto' : '162px' }">
      <i class="el-icon-plus"></i>
      <h6>{{ title }}</h6>
    </div>
  </el-upload>
</template>

<script>
import { hdComponent } from '@/utils/util-framework';
import { uploadPhoto } from './api';

export default {
  name: 'index',
  provide() {
    return {
      hdImageUpload: this
    };
  },
  mixins: [hdComponent],
  props: {
    prop: String,
    // 绑定值
    value: {
      type: String,
      default: ''
    },
    // 图片地址
    src: {
      type: String,
      default: ''
    },
    // 对齐方式（fill / contain / cover / none / scale-down）
    fit: {
      type: String,
      default: 'contain'
    },
    type: {
      type: [String, Array],
      default: () => {
        return ['jpeg', 'jpe', 'png'];
      }
    },
    size: {
      type: [Number, String],
      default: 5
    },
    title: {
      type: String,
      default: ''
    },
    // 宽度
    width: {
      type: [Number, String],
      default: ''
    },
    // 高度
    height: {
      type: [Number, String],
      default: ''
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      file: this.value, // file接收父组件传来的value值
      url: this.src // url接收父组件传来的src值
    };
  },
  watch: {
    value: {
      handler(val) {
        this.file = val;
      },
      immediate: false
    },
    src: {
      handler(val) {
        this.url = val;
      },
      immediate: true
    }
  },
  computed: {
    imageFit() {
      if (this.fit === 'fill') {
        return 'hdty-img-fill';
      } else if (this.fit === 'contain') {
        return 'hdty-img-contain';
      } else if (this.fit === 'cover') {
        return 'hdty-img-cover';
      } else if (this.fit === 'none') {
        return 'hdty-img-none';
      } else if (this.fit === 'scale-down') {
        return 'hdty-img-scale-down';
      }
    },
    pageWidth() {
      if (String(this.width).indexOf('%') == -1) {
        return this.width + 'px';
      }
      return this.width;
    },
    pageHeight() {
      if (String(this.height).indexOf('%') == -1) {
        return this.height + 'px';
      }
      return this.height;
    }
  },
  methods: {
    // 文件发生改变
    handleFileChange(file) {
      let _this = this;
      let isType = false;
      let type = [];
      if (!Array.isArray(_this.type)) {
        type.push(_this.type);
      } else {
        type = _this.type;
      }
      if (Array.isArray(type)) {
        type.forEach((item) => {
          isType = isType || file.raw.type === 'image/' + item;
        });
      }
      const isSize = file.raw.size / 1024 / 1024 < Number(_this.size);
      if (!isType) {
        _this.$message({
          showClose: true,
          customClass: 'is-fixed',
          message:
            '上传图片只能是 ' +
            _this.$utilStr.splitArray(type, '/').toUpperCase() +
            ' 格式',
          type: 'error'
        });
        return false;
      }
      if (!isSize) {
        _this.$message({
          showClose: true,
          customClass: 'is-fixed',
          message: '上传区域图片大小不能超过' + _this.size + 'MB',
          type: 'error'
        });
        return false;
      }
      // 附件大小验证
      if (file.raw.size === 0) {
        _this.$message({
          showClose: true,
          customClass: 'is-fixed',
          message: '不能上传空文件',
          type: 'warning'
        });
        return false;
      }
      // 构造表单提交的数据
      let fileFormData = new FormData();
      fileFormData.append('photo', file.raw);
      // Lambda写法
      uploadPhoto(fileFormData)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.url = URL.createObjectURL(file.raw);
            _this.$emit('update:src', _this.url);
            _this.$emit('input', data.photoId);
            _this.$emit('currentChanged', data.photoId);
            _this.$nextTick(() => {
              _this.$parent.elForm.validateField(_this.$parent.prop);
            });
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
        });
    }
  }
};
</script>

<style scoped>
</style>
