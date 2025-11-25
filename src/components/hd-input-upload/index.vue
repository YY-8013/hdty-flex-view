<template>
  <hd-input
    ref="inputRef"
    v-model="currentFilename"
    :size="size"
    :placeholder="placeholder"
    :clearable="clearable"
    :readonly="readonly || buttonTriggerOnly"
    :disabled="disabled"
    :adaptive="adaptive"
    class="hdty-input-upload"
    :class="{ 'hdty-disabled': disabled }"
    :underline="underline"
    @mouseenter.native="handleMouseenter"
    @mouseleave.native="handleMouseleave"
    @click.native="handleInputClick"
    @clear="handleInputClear(true)">
    <template slot="append">
      <hd-button
        v-html="buttonContent"
        :type="type"
        :icon="buttonIcon"
        :title="activeButtonTooltipText"
        :readonly="readonly"
        :disabled="disabled"
        @click.stop="handleClick">
      </hd-button>
    </template>
  </hd-input>
</template>

<script>
  import { hdComponent, hdForm } from '@/utils/util-framework';
  export default {
    name: "index",
    provide() {
      return {
        hdInputUpload: this
      };
    },
    mixins: [hdComponent, hdForm],
    props: {
      prop: String,
      // 按钮类型（primary / success / warning / danger / info / text）
      type: {
        type: String,
        default: 'success'
      },
      // 绑定值
      value: {
        type: [String, Object, File],
        default: ''
      },
      // 上传文件名称
      acceptName: {
        type: String,
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
      // 是否自动唤醒文件选择对话框
      automatic: {
        type: Boolean,
        default: true
      },
      // 输入框尺寸（medium / small / mini）
      size: {
        type: String,
        default: ''
      },
      // 空数据时输入框提示文本
      emptyText: {
        type: String,
        default: '未选择任何文件'
      },
      // 是否开启文字提示
      tooltip: {
        type: Boolean,
        default: true
      },
      // 文字提示内容（开启文字提示时有效，空则提示上传文件名）
      tooltipText: {
        type: String,
        default: ''
      },
      // 按钮图标
      buttonIcon: {
        type: String,
        default: ''
      },
      // 按钮内容（支持HTML内容）
      buttonContent: {
        type: String,
        default: '上传'
      },
      // 空数据时按钮提示文本
      buttonEmptyText: {
        type: String,
        default() {
          return this.emptyText;
        }
      },
      // 是否开启按钮文字提示
      buttonTooltip: {
        type: Boolean,
        default() {
          return this.tooltip;
        }
      },
      // 按钮文字提示内容（开启按钮文字提示时有效，空则提示上传文件名）
      buttonTooltipText: {
        type: String,
        default() {
          return this.tooltipText;
        }
      },
      // 水印
      placeholder: {
        type: String,
        default: '请选择文件'
      },
      // 是否只用按钮触发上传
      buttonTriggerOnly: {
        type: Boolean,
        default: false,
      },
      // 是否可清空
      clearable: {
        type: Boolean,
        default: true,
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
      // 宽度自适应（元素宽度随内容变化）
      adaptive: {
        type: Boolean,
        default: false
      },
      // 下划线风格
      underline: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        currentValue: this.value,
        currentFilename: this.acceptName, // 当前上传的文件名称
        realFilename: '', //真实的文件名称
        oldFilename: '',  // 上一次上传的文件名称
        cacheData: {  // 缓存数据
          oldFilename: ''
        },
        fileInputEl: null,  // 文件选择框元素
        inputClearEl: null,   // input清除按钮元素
        showClear: null,  // 是否显示清除按钮
        timer: null,  // 计时器
        chooserVisible: false
      }
    },
    watch: {
      value: {
        handler(val) {
          if(this.$utilStr.isEmpty(val)) {
            if(this.currentFilename) {
              if(!this.enableAcceptName) {
                this.currentFilename = '';
              }
            }
            if(this.realFilename) {
              this.realFilename = '';
              this.oldFilename = this.cacheData.oldFilename;
              this.cacheData.oldFilename = this.realFilename;
            }
          } else {
            if(!this.currentFilename) {
              if(!this.enableAcceptName) {
                if(this.currentValue && this.currentValue.name) {
                  this.currentFilename = this.currentValue.name;
                }
              }
            }
            if(!this.realFilename) {
              if(this.currentValue && this.currentValue.name) {
                this.realFilename = this.currentValue.name;
                this.oldFilename = this.cacheData.oldFilename;
                this.cacheData.oldFilename = this.realFilename;
              }
            }
          }
          this.currentValue = val;
        },
        immediate: false
      },
      acceptName: {
        handler(val) {
          this.currentFilename = val;
        },
        immediate: false
      },
      acceptType: {
        handler() {
          this.setAcceptType();
        },
        immediate: false
      },
      activeInputTooltipText: {
        handler() {
          this.setInputInnerTooltip();
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
    computed: {
      enableAcceptName() {
        return !!this.acceptName;
      },
      activeInputTooltipText() {
        if(!this.readonly && !this.disabled) {
          if(this.$utilStr.isEmpty(this.currentValue)) {
            return this.emptyText;
          } else {
            if(this.tooltip) {
              if(this.tooltipText) {
                return this.tooltipText;
              } else {
                return this.realFilename;
              }
            }
          }
        }
        return null;
      },
      activeButtonTooltipText() {
        if(!this.readonly && !this.disabled) {
          if(this.$utilStr.isEmpty(this.currentValue)) {
            return this.buttonEmptyText;
          } else {
            if(this.buttonTooltip) {
              if(this.buttonTooltipText) {
                return this.buttonTooltipText;
              } else {
                return this.realFilename;
              }
            }
          }
        }
        return null;
      },
    },
    mounted() {
      this.setInputInnerTooltip();
    },
    destroyed() {
      if(this.timer) clearTimeout(this.timer);
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
      // input点击
      handleInputClick(evt) {
        if(!this.readonly && !this.buttonTriggerOnly) {
          if(evt.target && evt.target.tagName === 'INPUT') {
            this.chooserVisible = false;
            this.$nextTick(() => {
              this.createFileChooser();
              this.$emit('focus', this, evt);
            });
            if(this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(() => {
              this.$refs.inputRef.blur();
            }, 300);
          }
        }
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
        if(!_this.enableAcceptName) {
          this.currentFilename = file.name;
          this.realFilename = this.currentFilename;
        } else {
          this.realFilename = this.$utilFile.appendFileExtension(this.currentFilename, file.name);
          file = new File([file], this.realFilename, { type: file.type });
          this.triggerValidateField();
        }
        this.oldFilename = this.cacheData.oldFilename;
        this.cacheData.oldFilename = this.realFilename;
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
        this.$emit('currentChanged', this.currentValue, this.realFilename, this.oldFilename);
      },
      // 清除文件
      handleFileClear() {
        let form = document.createElement('form');
        document.body.appendChild(form);
        form.appendChild(this.fileInputEl);
        form.reset();
        document.body.removeChild(form);
      },
      // input清空
      handleInputClear(emitEvent) {
        this.chooserVisible = false;
        this.realFilename = '';
        this.oldFilename = this.cacheData.oldFilename;
        this.cacheData.oldFilename = this.realFilename;
        if(this.outputModel === 'file') {
          this.currentValue = null;
        }else if(this.outputModel === 'base64') {
          this.currentValue = '';
        }
        this.$emit('input', this.currentValue);
        if(emitEvent) {
          this.$emit('currentChanged', this.currentValue, this.realFilename, this.oldFilename);
        }
      },
      // 设置input鼠标悬停提示
      setInputInnerTooltip() {
        let inputInnerEl = this.$refs.inputRef.$el.querySelector('.el-input__inner');
        if(inputInnerEl) {
          if(this.$utilStr.isText(this.activeInputTooltipText)) {
            inputInnerEl.setAttribute('title', this.activeInputTooltipText);
          } else {
            inputInnerEl.removeAttribute('title');
          }
        }
      },
      // input鼠标移入
      handleMouseenter() {
        let inputRef = this.$refs.inputRef;
        let inputEl = inputRef.$el;
        if(!inputRef.showClear) {
          if(inputRef.clearable
            && !inputRef.disabled
            && !this.readonly
            && inputRef.nativeInputValue
            && (inputRef.focused
              || inputRef.hovering)
            && !this.$utilStr.isEmpty(this.currentValue)) {
            this.createInputClear();
          }
        } else {
          let inputClearEl = inputEl.querySelector('.el-input__clear');
          if(this.$utilStr.isEmpty(this.currentValue)) {
            if(inputClearEl) {
              inputClearEl.remove();
              inputClearEl = null;
            }
          } else {
            if(this.enableAcceptName) {
              if(inputClearEl) {
                inputClearEl.remove();
                inputClearEl = null;
              }
              this.createInputClear();
            }
          }
        }
      },
      // input鼠标移出
      handleMouseleave() {
        if(this.inputClearEl) {
          this.inputClearEl.remove();
          this.inputClearEl = null;
        }
      },
      // 创建input清除按钮
      createInputClear() {
        let inputRef = this.$refs.inputRef;
        let inputEl = inputRef.$el;
        let inputSuffixEl = inputEl.querySelector('.el-input__suffix');
        if(!inputSuffixEl) {
          inputSuffixEl = document.createElement('span');
          inputSuffixEl.className = 'el-input__suffix';
          this.$utilElem.insertAfter(inputSuffixEl, inputEl.querySelector('.el-input__inner'));
        }
        let inputSuffixInnerEl = inputEl.querySelector('.el-input__suffix-inner');
        if(!inputSuffixInnerEl) {
          inputSuffixInnerEl = document.createElement('span');
          inputSuffixInnerEl.className = 'el-input__suffix-inner';
          inputSuffixEl.appendChild(inputSuffixInnerEl);
        }
        let inputClearEl = inputEl.querySelector('.el-input__clear');
        if(!inputClearEl) {
          inputClearEl = document.createElement('i');
          inputClearEl.className = 'el-input__icon el-icon-circle-close el-input__clear';
          if(!this.enableAcceptName) {
            inputClearEl.onclick = () => {
              inputRef.$refs.inputRef.clear();
              this.handleMouseleave();
            };
          } else {
            inputClearEl.onclick = () => {
              this.handleInputClear(true);
              this.handleMouseleave();
              this.triggerValidateField();
            };
          }
          inputSuffixInnerEl.appendChild(inputClearEl);
          inputRef.$refs.inputRef.updateIconOffset();
          this.inputClearEl = inputClearEl;
        }
      }
    }
  }
</script>

<style scoped>

</style>
