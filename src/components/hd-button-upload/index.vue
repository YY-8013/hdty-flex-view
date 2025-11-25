<template>
  <hd-button
    :name="name"
    :module-name="moduleName"
    :type="type"
    :icon="icon"
    :size="size"
    :loading="loading"
    :autofocus="autofocus"
    :readonly="readonly"
    :disabled="disabled"
    :plain="plain"
    :round="round"
    :circle="circle"
    :authorization="authorization"
    :authorization-defeat="authorizationDefeat"
    class="hdty-button-upload"
    @click="handleClick">
    <slot></slot>
  </hd-button>
</template>

<script>
  import { hdComponent } from '@/utils/util-framework';
  export default {
    name: "index",
    provide() {
      return {
        hdButtonUpload: this
      };
    },
    mixins: [hdComponent],
    props: {
      prop: String,
      // 指定名称
      name: {
        type: String,
        default: ''
      },
      // 模块名称
      moduleName: {
        type: String,
        default: ''
      },
      // 按钮类型（primary / success / warning / danger / info / text）
      type: {
        type: String,
        default: ''
      },
      // 绑定值
      value: {
        type: [String, Object, File],
        default: ''
      },
      // 上传文件类型
      acceptType: {
        type: [String, Array],
        default() {
          return ['xls', 'xlsx'];
        }
      },
      // 上传文件大小（单位MB，0代表不限制）
      acceptSize: {
        type: [Number, String],
        default: 3
      },
      // 输出的数据对象（file / base64）
      outputModel: {
        type: String,
        default: 'file'
      },
      // 按钮图标类名
      icon: {
        type: String,
        default: 'icon-cloud-upload'
      },
      // 按钮尺寸（medium / small / mini）
      size: {
        type: String,
        default: ''
      },
      // 是否自动唤醒文件选择对话框
      automatic: {
        type: Boolean,
        default: true
      },
      // 是否加载中状态
      loading: {
        type: Boolean,
        default: false
      },
      // 是否默认聚焦
      autofocus: {
        type: Boolean,
        default: false
      },
      // 是否只读
      readonly: {
        type: Boolean,
        default: false
      },
      // 是否禁用
      disabled: {
        type: Boolean,
        default: false
      },
      // 是否朴素按钮
      plain: {
        type: Boolean,
        default: false
      },
      // 是否圆角按钮
      round: {
        type: Boolean,
        default: false
      },
      // 是否圆形按钮
      circle: {
        type: Boolean,
        default: false
      },
      // 是否开启授权验证
      authorization: {
        type: Boolean,
        default() {
          return this.$app.btnAuthorizationEnabled;
        }
      },
      // 授权验证失败处理方式
      authorizationDefeat: {
        type: String,
        default() {
          return this.$app.btnAuthorizationDefeat;
        }
      }
    },
    data() {
      return {
        currentValue: this.value,
        currentFilename: '', // 当前上传的文件名称
        oldFilename: '',  // 上一次上传的文件名称
        cacheData: {  // 缓存数据
          oldFilename: ''
        },
        fileInputEl: null,  // 文件选择框元素
        chooserVisible: false
      }
    },
    watch: {
      value: {
        handler(val) {
          if(this.$utilStr.isEmpty(val)) {
            if(this.currentFilename) {
              this.currentFilename = '';
              this.oldFilename = this.cacheData.oldFilename;
              this.cacheData.oldFilename = this.currentFilename;
            }
          } else {
            if(!this.currentFilename) {
              if(this.currentValue && this.currentValue.name) {
                this.currentFilename = this.currentValue.name;
                this.oldFilename = this.cacheData.oldFilename;
                this.cacheData.oldFilename = this.currentFilename;
              }
            }
          }
          this.currentValue = val;
        },
        immediate: false
      },
      acceptType: {
        handler() {
          this.setAcceptType();
        },
        immediate: false
      },
      chooserVisible: {
        handler(val) {
          if(val) {
            this.open();
          }
        },
        immediate: false
      },
    },
    methods: {
      // 按钮点击
      handleClick(evt) {
        this.chooserVisible = false;
        this.$nextTick(() => {
          this.createFileChooser();
          this.$emit('click', this, evt);
        });
      },
      // 打开文件选择对话框
      open() {
        // 触发input点击事件，弹出文件选择对话框
        if(this.fileInputEl) {
          this.fileInputEl.click();
        }
      },
      // 创建文件选择对话框
      createFileChooser() {
        if (!this.fileInputEl) {
          // 创建临时input元素
          this.fileInputEl = document.createElement('input');
          // 设置input type为文件类型
          this.fileInputEl.type = 'file';
          // 允许上传多个文件
          // this.fileInputEl.multiple = true;
          this.fileInputEl.onchange = this.handleFileChange.bind(this);
          // 设置input接受类型
          this.setAcceptType();
        }
        if(this.automatic) {
          this.chooserVisible = true;
        }
      },
      // 设置input接受类型
      setAcceptType() {
        if(this.fileInputEl) {
          let acceptType = '';
          if(Array.isArray(this.acceptType)) {
            let arr = [];
            for (let e of this.acceptType) {
              let type = this.$utilFile.assetTypeToAcceptType(e);
              if(type) {
                arr.push(type)
              }
            }
            acceptType = this.$utilStr.arrayJoin(arr, ',');
          }else {
            acceptType = this.$utilFile.assetTypeToAcceptType(this.acceptType);
          }
          this.fileInputEl.accept = acceptType;
        }
      },
      // 文件选择改变
      handleFileChange() {
        let _this = this;
        let files = this.fileInputEl.files;
        let file = files[0];
        let isAccept = false;
        let acceptType = [];
        if(!Array.isArray(_this.acceptType)) {
          acceptType.push(_this.acceptType);
        }else {
          acceptType = _this.acceptType;
        }
        if(Array.isArray(acceptType)) {
          acceptType.forEach(e => {
            isAccept = isAccept || file.type === _this.$utilFile.assetTypeToAcceptType(e);
          });
        }
        const isSize = !Number(_this.acceptSize) || file.size / 1024 / 1024 < Number(_this.acceptSize);
        if (!isAccept) {
          _this.$message({
            showClose: true,
            message: '上传文件只能是 ' + _this.$utilStr.arrayJoin(acceptType, '/').toUpperCase() + ' 格式',
            type: 'error',
            offset: 76
          });
          _this.handleFileClear();
          return false;
        }
        if (!isSize) {
          _this.$message({
            showClose: true,
            message: '上传文件大小不能超过' + _this.acceptSize + 'MB',
            type: 'error',
            offset: 76
          });
          _this.handleFileClear();
          return false;
        }
        this.currentFilename = file.name;
        this.oldFilename = this.cacheData.oldFilename;
        this.cacheData.oldFilename = this.currentFilename;
        if(_this.outputModel === 'file') {
          _this.currentValue = file;
          _this.uploadComplete();
        }else if(_this.outputModel === 'base64') {
          _this.$utilFile.fileToBase64(file, base64 => {
            _this.currentValue = base64;
            _this.uploadComplete();
          })
        }
        _this.handleFileClear();
      },
      // 上传完成回调
      uploadComplete() {
        this.chooserVisible = false;
        this.$emit('input', this.currentValue);
        this.$emit('currentChanged', this.currentValue, this.currentFilename, this.oldFilename);
      },
      // 清除文件
      handleFileClear() {
        let form = document.createElement('form');
        document.body.appendChild(form);
        form.appendChild(this.fileInputEl);
        form.reset();
        document.body.removeChild(form);
      }
    }
  }
</script>

<style scoped>

</style>
