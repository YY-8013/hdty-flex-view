<template>
  <div class="hdty-cutter">
    <div
      class="hdty-cutter-wrapper"
      :style="activeWrapperStyle">
      <vue-cropper
        ref="cropperRef"
        :img="currentValue"
        :mode="fit"
        :maxImgSize="maxImgSize"
        :original="original"
        :outputType="outputType"
        :outputSize="outputQuality"
        :autoCrop="autoCrop"
        :fixedNumber="fixedNumber"
        :autoCropWidth="autoCropWidth"
        :autoCropHeight="autoCropHeight"
        :info="info"
        :infoTrue="infoTrue"
        :fixed="fixed"
        :fixedBox="fixedBox"
        :centerBox="centerBox"
        :canMoveBox="canMoveBox"
        :canMove="canMove"
        :canScale="canScale"
        :full="full"
        :high="high"
        :enlarge="enlarge"
        @realTime="handleRealTime">
      </vue-cropper>
      <div v-if="activeValueEmpty" class="hdty-cutter-empty">
        <el-button
          type="primary"
          fixed
          @click="handleSelect">
          选择图片
        </el-button>
        <span class="hdty-cutter-text">
          支持{{ activeAcceptTypeText }}格式的图片，大小不超过{{ acceptSize }}M
        </span>
      </div>
    </div>
    <div class="hdty-cutter-tool">
      <div class="hdty-btn-container">
        <button
          type="button"
          :disabled="activeDisabled"
          class="hdty-btn hdty-btn-primary"
          :class="{ 'hdty-btn-disabled': activeDisabled }"
          @click="handleReselect">
          重新选择
        </button>
        <button
          type="button"
          :disabled="activeDisabled"
          class="hdty-btn"
          :class="{ 'hdty-btn-disabled': activeDisabled }"
          @click="handleClearSelect">
          清除选择
        </button>
        <button
          type="button"
          title="重置"
          :disabled="activeDisabled"
          class="hdty-btn hdty-btn-primary"
          :class="{ 'hdty-btn-disabled': activeDisabled }"
          @click="handleReset">
          <i class="icon-refresh">
          </i>
        </button>
      </div>
      <div class="hdty-btn-container">
        <div class="hdty-btn-group">
          <button
            type="button"
            title="裁剪"
            :disabled="activeDisabled"
            class="hdty-btn hdty-btn-primary"
            :class="{ 'hdty-btn-disabled': activeDisabled }"
            @click="handleCropper">
            <i class="el-icon-crop"></i>
          </button>
          <button
            type="button"
            title="保存"
            :disabled="activeDisabled"
            class="hdty-btn hdty-btn-primary"
            :class="{ 'hdty-btn-disabled': activeDisabled }"
            @click="handleDownload">
            <i class="el-icon-download"></i>
          </button>
        </div>
        <div class="hdty-btn-group">
          <button
            type="button"
            title="放大"
            :disabled="activeDisabled"
            class="hdty-btn hdty-btn-primary"
            :class="{ 'hdty-btn-disabled': activeDisabled }"
            @click="handleScaleBigger">
            <i class="el-icon-zoom-in">
            </i>
          </button>
          <button
            type="button"
            title="缩小"
            :disabled="activeDisabled"
            class="hdty-btn hdty-btn-primary"
            :class="{ 'hdty-btn-disabled': activeDisabled }"
            @click="handleScaleSmaller">
            <i class="el-icon-zoom-out">
            </i>
          </button>
        </div>
        <div class="hdty-btn-group">
          <button
            type="button"
            title="向左旋转"
            :disabled="activeDisabled"
            class="hdty-btn hdty-btn-primary"
            :class="{ 'hdty-btn-disabled': activeDisabled }"
            @click="handleRotateLeft">
            <i class="icon-rotate-left">
            </i>
          </button>
          <button
            type="button"
            title="向右旋转"
            :disabled="activeDisabled"
            class="hdty-btn hdty-btn-primary"
            :class="{ 'hdty-btn-disabled': activeDisabled }"
            @click="handleRotateRight">
            <i class="icon-rotate-right">
            </i>
          </button>
        </div>
      </div>
      <ul v-if="!activeDisabled" class="hdty-cutter-preview">
        <li
          v-for="(item, index) in previewData.style"
          :key="index"
          class="hdty-preview-item"
          :style="item.style">
          <div :style="item.scaleStyle">
            <img :src="previewData.url" :style="previewData.img">
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { VueCropper } from 'vue-cropper';
  export default {
    name: "index",
    provide() {
      return {
        hdCutter: this
      };
    },
    components: {
      VueCropper
    },
    props: {
      // 绑定值
      value: {
        type: [String, Object, File],
        default: ''
      },
      // 上传图片名称
      acceptName: {
        type: String,
        default: ''
      },
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
        default: 3
      },
      // 上传图片对齐方式（contain / cover / 100px / 100% auto）
      fit: {
        type: String,
        default: 'contain'
      },
      // 上传图片的最大宽度和高度限制
      maxImgSize: {
        type: Number,
        default: 3000
      },
      // 上传图片是否默认按照原图大小比例渲染
      original: {
        type: Boolean,
        default: false
      },
      // 裁剪输出的数据对象（file / base64 / blob）
      outputModel: {
        type: String,
        default: 'file'
      },
      // 裁剪输出图片的类型
      outputType: {
        type: String,
        default: 'png'
      },
      // 裁剪输出图片的质量（0 到 1 的区间）
      outputQuality: {
        type: Number,
        default: 1
      },
      // 是否按照原图大小比例输出截图
      full: {
        type: Boolean,
        default: true
      },
      // 是否生成截图框
      autoCrop: {
        type: Boolean,
        default: true
      },
      // 截图框的默认宽高比例
      fixedNumber: {
        type: Array,
        default() {
          return [1, 1];
        }
      },
      // 截图框宽度
      autoCropWidth: {
        type: Number
      },
      // 截图框高度
      autoCropHeight: {
        type: Number
      },
      // 是否显示截图框大小信息
      info: {
        type: Boolean,
        default: true
      },
      // 截图框大小信息是否显示图片真实宽高（其中，full属性为true才能显示真实宽高；original属性为true只会显示屏幕可见截图框区域的宽高）
      infoTrue: {
        type: Boolean,
        default: true
      },
      // 是否固定截图框宽高比例
      fixed: {
        type: Boolean,
        default: false
      },
      // 是否固定截图框大小
      fixedBox: {
        type: Boolean,
        default: false
      },
      // 是否限制截图框在图片里面
      centerBox: {
        type: Boolean,
        default: true
      },
      // 是否允许拖动截图框
      canMoveBox: {
        type: Boolean,
        default: true
      },
      // 是否允许拖动图片
      canMove: {
        type: Boolean,
        default: true
      },
      // 是否允许滚轮缩放图片
      canScale: {
        type: Boolean,
        default: true
      },
      // 是否按照dpr输出适合屏幕的高清截图
      high: {
        type: Boolean,
        default: false
      },
      // 输出截图根据截图框大小比例缩放的倍数（太大会卡死）
      enlarge: {
        type: Number,
        default: 1
      },
      // 宽度
      width: {
        type: [Number, String],
        default: null
      },
      // 高度
      height: {
        type: [Number, String],
        default: null
      }
    },
    data() {
      return {
        // 绑定值
        currentValue: this.value,
        // 预览
        previewData: {},
        // 当前上传图片名称
        filename: this.acceptName,
      }
    },
    computed: {
      activeValueEmpty() {
        // return this.$utilStr.isEmpty(this.currentValue);
        return this.$utilStr.isEmpty(this.previewData.url);
      },
      activeAcceptTypeText() {
        let acceptType = [];
        if(Array.isArray(this.acceptType)) {
          acceptType = this.acceptType;
        }else {
          acceptType.push(this.acceptType);
        }
        return this.$utilStr.arrayJoin(acceptType, '、').toLowerCase();
      },
      activeDisabled() {
        return this.$utilStr.isEmpty(this.previewData.url);
      },
      activeWrapperStyle() {
        let style = {
          width: this.$utilElem.pixelsFtt(this.width),
          height: this.$utilElem.pixelsFtt(this.height)
        };
        return this.$utilStr.clearObjUndef(style);
      }
    },
    watch: {
      value: {
        handler(val) {
          this.previewData = {};
          if(val instanceof File) {
            this.currentValue = URL.createObjectURL(val);
          } else {
            this.currentValue = val;
          }
        },
        immediate: false
      }
    },
    methods: {
      // 选择图片
      handleSelect() {
        this.$upload({
          acceptType: this.acceptType,
          acceptSize: this.acceptSize,
          callback: (file, filename) => {
            let url = URL.createObjectURL(file);
            this.filename = filename;
            this.$emit('input', url);
            if (this.outputModel === 'file') {
              this.$emit('currentChanged', file, this.filename);
            } else if(this.outputModel === 'base64') {
              this.$utilFile.fileToBase64(file, base64 => {
                this.$emit('currentChanged', base64, this.filename);
              });
            } else {
              this.$utilFile.fileToBase64(file, base64 => {
                let blob = this.$utilFile.base64ToBlob(base64);
                this.$emit('currentChanged', blob, this.filename);
              });
            }
          }
        });
      },
      // 重新选择
      handleReselect() {
        this.handleSelect();
      },
      // 清除选择
      handleClearSelect() {
        this.currentValue = '';
        this.previewData = {};
      },
      // 提交
      submit() {
        this.$refs.cropperRef.getCropBlob(blob => {
          let url = URL.createObjectURL(blob);
          this.$emit('input', url);
          if (this.outputModel === 'file') {
            this.$utilFile.fileToBase64(blob, base64 => {
              let file = this.$utilFile.base64ToFile(base64, this.filename);
              this.$emit('currentChanged', file, this.filename);
              this.$emit('currentComplete', file, this.filename, url);
              this.clearCrop();
            });
          } else if(this.outputModel === 'base64') {
            this.$utilFile.fileToBase64(blob, base64 => {
              this.$emit('currentChanged', base64, this.filename);
              this.$emit('currentComplete', base64, this.filename, url);
              this.clearCrop();
            });
          } else {
            this.$emit('currentChanged', blob, this.filename);
            this.$emit('currentComplete', blob, this.filename, url);
            this.clearCrop();
          }
        });
      },
      // 清除截图框
      clearCrop() {
        this.$refs.cropperRef.clearCrop();
      },
      // 重置
      handleReset() {
        this.$refs.cropperRef.refresh();
      },
      // 裁剪
      handleCropper() {
        this.$refs.cropperRef.getCropBlob(blob => {
          let url = URL.createObjectURL(blob);
          this.$emit('input', url);
          if (this.outputModel === 'file') {
            this.$utilFile.fileToBase64(blob, base64 => {
              let file = this.$utilFile.base64ToFile(base64, this.filename);
              this.$emit('currentChanged', file, this.filename);
            });
          } else if(this.outputModel === 'base64') {
            this.$utilFile.fileToBase64(blob, base64 => {
              this.$emit('currentChanged', base64, this.filename);
            });
          } else {
            this.$emit('currentChanged', blob, this.filename);
          }
        });
      },
      // 保存
      handleDownload() {
        this.$refs.cropperRef.getCropBlob(blob => {
          this.$utilFile.downloadBlob(blob, this.filename);
        });
      },
      // 放大
      handleScaleBigger() {
        this.$refs.cropperRef.changeScale(+1);
      },
      // 缩小
      handleScaleSmaller() {
        this.$refs.cropperRef.changeScale(-1);
      },
      // 向左旋转
      handleRotateLeft() {
        this.$refs.cropperRef.rotateLeft();
      },
      // 向右旋转
      handleRotateRight() {
        this.$refs.cropperRef.rotateRight()
      },
      // 实时预览
      handleRealTime(val) {
        if(val && val.url && val.h > 0) {
          val.style = {};
          let previewSize = {
            medium: 96,
            small: 56,
            mini: 32
          };
          Object.keys(previewSize).forEach(k => {
            let scale = previewSize[k] / val.h;
            let style = {
              width: `${val.w * scale}px`,
              height: `${previewSize[k]}px`
            };
            let scaleStyle = {
              ...val.div,
              transformOrigin: `0 0`,
              transform: `scale(${scale}, ${scale}`
            };
            val.style[k] = {};
            val.style[k].style = style;
            val.style[k].scaleStyle = scaleStyle;
          });
          this.previewData = val;
        }
      }
    }
  }
</script>

<style scoped>

</style>
