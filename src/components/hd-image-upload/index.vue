<template>
  <el-upload
    ref="uploadRef"
    action=""
    :auto-upload="false"
    :drag="drag"
    :multiple="multiple"
    :limit="limit"
    :show-file-list="multiple"
    :file-list="fileList"
    list-type="picture-card"
    :readonly="readonly"
    :disabled="disabled"
    class="hdty-image-upload"
    :class="{
      'hdty-scroll': multiple,
      'is-multiple': multiple,
      'is-horizontal': multiple && direction === 'horizontal',
      'is-vertical': multiple && direction === 'vertical',
      'is-disabled': disabled,
      'is-drag': drag
    }"
    :style="activeWrapperStyle"
    @click.native="handleClick"
    :on-change="handleFileChange"
    :on-exceed="handleFileExceed">
    <slot
      v-if="multiple"
      slot="default">
      <div
        class="hdty-upload-empty">
        <i v-if="emptyIcon" :class="emptyIcon">
        </i>
        <span v-if="drag && !emptyText">
        将文件拖拽到此处，或<span class="hdty-main-color">点击上传</span>
      </span>
        <span v-if="emptyText" v-html="emptyText">
      </span>
        <pre v-if="emptyPre" v-html="emptyPre">
      </pre>
      </div>
    </slot>
    <slot
      v-if="multiple"
      slot="file"
      slot-scope="{ file }">
      <img
        :src="file[activeProps['url']]"
        class="hdty-upload-preview"
        :class="imageFit">
      <div class="hdty-upload-panel">
        <div
          class="hdty-upload-button el-icon-zoom-in"
          title="查看大图"
          @click="handlePreview">
          <img :large="file[activeProps['url']]" :preview="'upload_' + file[activeProps['uid']]">
        </div>
        <div
          class="hdty-upload-button icon-rotate-right"
          title="向右旋转"
          @click="handleRotate($event, file)">
        </div>
        <div
          class="hdty-upload-button el-icon-delete"
          title="清除图片"
          @click="handleRemove($event, file)">
        </div>
      </div>
    </slot>
    <img
      v-if="!multiple && !$utilStr.isEmpty(currentSrc)"
      :src="typeof(currentSrc) === 'object' && currentSrc ? currentSrc[activeProps['url']] : currentSrc"
      class="hdty-upload-preview"
      :class="imageFit">
    <div
      v-if="!multiple && !$utilStr.isEmpty(currentSrc)"
      class="hdty-upload-panel">
      <div
        class="hdty-upload-button el-icon-zoom-in"
        title="查看大图"
        @click="handlePreview">
        <img :large="typeof(currentSrc) === 'object' && currentSrc ? currentSrc[activeProps['url']] : currentSrc" :preview="'upload_' + currentUuid">
      </div>
      <div
        class="hdty-upload-button icon-rotate-right"
        title="向右旋转"
        @click="handleRotate">
      </div>
      <div
        class="hdty-upload-button el-icon-delete"
        title="清除图片"
        @click="handleRemove">
      </div>
    </div>
    <div
      v-if="!multiple && $utilStr.isEmpty(currentSrc)"
      class="hdty-upload-empty"
      :style="{ height: !activeWrapperStyle.height && '162px' }">
      <i v-if="emptyIcon" :class="emptyIcon">
      </i>
      <span v-if="drag && !emptyText">
        将文件拖拽到此处，或<span class="hdty-main-color">点击上传</span>
      </span>
      <span v-if="emptyText" v-html="emptyText">
      </span>
      <pre v-if="emptyPre" v-html="emptyPre">
      </pre>
    </div>
    <el-dialog
      v-if="cutter"
      :visible.sync="cutterVisible"
      title="图片裁剪"
      custom-class="hdty-dialog-fit"
      plain
      append-to-body
      @closed="handleCloseCutter">
      <hd-pane
        fit>
        <hd-cutter
          ref="uploadCutterRef"
          v-model="activeImageUrl"
          :accept-name="activeImageName"
          :accept-type="acceptType"
          :accept-size="acceptSize"
          :original="cutterOptions.original"
          :output-model="outputModel"
          :output-type="cutterOptions.outputType"
          :output-quality="cutterOptions.outputQuality"
          :full="cutterOptions.full"
          :fixed-number="cutterOptions.fixedNumber"
          :auto-crop-width="cutterOptions.autoCropWidth"
          :auto-crop-height="cutterOptions.autoCropHeight"
          :info="cutterOptions.info"
          :info-true="cutterOptions.infoTrue"
          :fixed="cutterOptions.fixed"
          :fixed-box="cutterOptions.fixedBox"
          :center-box="cutterOptions.centerBox"
          :can-move-box="cutterOptions.canMoveBox"
          :can-move="cutterOptions.canMove"
          :can-scale="cutterOptions.canScale"
          :enlarge="cutterOptions.enlarge">
        </hd-cutter>
        <div class="hdty-dialog-footer">
          <el-button fixed @click="handleCancelCutter">取 消</el-button>
          <el-button type="primary" fixed @click="handleCutter">确 定</el-button>
        </div>
      </hd-pane>
    </el-dialog>
  </el-upload>
</template>

<script>
  import { hdComponent, hdMethod, hdForm } from '@/utils/util-framework';
  export default {
    name: "index",
    provide() {
      return {
        hdImageUpload: this
      };
    },
    mixins: [hdComponent, hdMethod, hdForm],
    props: {
      prop: String,
      // 上传图片请求接口
      uploadApi: Function,
      // 更新图片请求接口
      updateApi: Function,
      // 删除图片请求接口
      deleteApi: Function,
      // 请求参数
      params: Object,
      // 渲染图片文件数据对象的配置选项
      props: {
        type: Object,
        default() {
          return {
            // 指定图片文件的URL地址对应图片文件数据对象中的属性值
            url: 'url',
            // 指定图片文件的唯一标识对应图片文件数据对象中的属性值
            uid: 'uid',
            // 指定图片文件的名称对应图片文件数据对象中的属性值
            name: 'name',
            // 指定图片文件对应图片文件数据对象中的属性值
            file: 'file',
            // 指定图片文件数据对象对应响应数据对象中的属性值
            response: '',
            // 指定请求参数对象是否使用formData格式
            formData: true,
          };
        }
      },
      // 绑定值
      value: {
        type: [String, Object, Array, File, FileList],
        default: ''
      },
      // 图片源（可以直接配置url字符串，也可以配置一个详细的数据对象）
      /*详细的数据对象配置示例：
      {
        url: '',  // 图片地址（属性需与props配置选项中的指定url属性值保持一致）
        uid: 0,  // 图片唯一标识（属性需与props配置选项中的指定uid属性值保持一致）
        name: '',  // 图片名称（属性需与props配置选项中的指定name属性值保持一致）
      }*/
      modelSrc: {
        type: [String, Object, Array],
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
      // 是否允许多选上传
      multiple: {
        type: Boolean,
        default: false
      },
      // 多选上传限制数量（0代表不限制）
      limit: {
        type: Number,
        default: 0
      },
      // 图片对齐方式（fill / contain / cover / none / scale-down）
      fit: {
        type: String,
        default: 'contain'
      },
      // 上传列表显示方向（horizontal / vertical）
      direction: {
        type: String,
        default: 'horizontal'
      },
      // 输出的数据对象（file / base64）
      outputModel: {
        type: String,
        default: 'file'
      },
      // 空数据时显示图标
      emptyIcon: {
        type: String,
        default: 'icon-upload'
      },
      // 空数据时显示文本（支持HTML内容）
      emptyText: {
        type: String,
        default: ''
      },
      // 空数据时显示预格式化的文本（支持HTML内容）
      emptyPre: {
        type: String,
        default: ''
      },
      // 是否允许拖拽上传
      drag: {
        type: Boolean,
        default: false
      },
      // 是否开启图片裁剪
      cutter: {
        type: Boolean,
        default: false
      },
      // 图片裁剪配置项
      cutterOptions: {
        type: Object,
        default() {
          return {
            // 上传图片是否默认按照原图大小比例渲染
            original: false,
            // 裁剪输出图片的类型
            outputType: 'png',
            // 裁剪输出图片的质量（0 到 1 的区间）
            outputQuality: 1,
            // 是否按照原图大小比例输出截图
            full: true,
            // 截图框的默认宽高比例
            fixedNumber: [1, 1],
            // 截图框宽度
            autoCropWidth: undefined,
            // 截图框高度
            autoCropHeight: undefined,
            // 是否显示截图框大小信息
            info: true,
            // 截图框大小信息是否显示图片真实宽高（其中，full属性为true才能显示真实宽高；original属性为true只会显示屏幕可见截图框区域的宽高）
            infoTrue: true,
            // 是否固定截图框宽高比例
            fixed: false,
            // 是否固定截图框大小
            fixedBox: false,
            // 是否限制截图框在图片里面
            centerBox: true,
            // 是否允许拖动截图框
            canMoveBox: true,
            // 是否允许拖动图片
            canMove: true,
            // 是否允许滚轮缩放图片
            canScale: true,
            // 输出截图根据截图框大小比例缩放的倍数（太大会卡死）
            enlarge: 1
          };
        }
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
        // 默认渲染上传文件数据对象的配置选项
        defaultProps: {
          // 指定文件URL对应上传文件数据对象中的属性值
          url: 'url',
          // 指定文件唯一标识对应上传文件数据对象中的属性值
          uid: 'uid',
          // 指定文件名称对应上传文件数据对象中的属性值
          name: 'name',
          // 指定文件对应上传文件数据对象中的属性值
          file: 'file',
          // 指定上传文件数据对象对应响应数据对象中的属性值
          response: '',
          // 指定上传请求参数对象是否使用formData格式
          formData: true,
        },
        currentValue: this.value,  // currentValue接收父组件传来的value值
        currentSrc: this.modelSrc,  // currentSrc接收父组件传来的modelSrc值
        currentFile: null,  // 当前上传文件
        currentUuid: this.$utilStr.uuid(32, 16).toLowerCase(),  // 当前图片唯一标识
        fileList: [],  // 上传的多文件列表
        parentFormItemEl: null,  // 元素的父级表单项元素
        parentColEl: null,  // 元素的父级栅格列元素
        parentRowEl: null,  // 元素的父级栅格行元素
        parentColSiblingEl: null,  // 元素的父级栅格列兄弟元素
        originHeight: null,  // 元素的原始高度
        layoutHeight: null,  // 元素的布局高度
        maxHeight: null,  // 元素的最大高度
        cutterVisible: false  // 显示图片裁剪窗体
      }
    },
    watch: {
      value: {
        handler(val, oldVal) {
          if(this.multiple) {
            if (!Array.isArray(val)) {
              if (val) {
                val = [val];
              } else {
                val = [];
              }
            }
          }
          this.currentValue = val;
          if(!this.$utilStr.isEmpty(val)) {
            if(this.$utilStr.isEmpty(this.modelSrc)) {
              this.updateModelSrc();
            }
          } else {
            if(!this.$utilStr.isEmpty(oldVal)) {
              if(this.multiple) {
                this.fileList = [];
              }
              if(!this.$utilStr.isEmpty(this.modelSrc)) {
                if(this.modelSrc === this.currentSrc) {
                  this.updateValue();
                }
              } else {
                this.currentSrc = '';
                this.setAcceptType();
              }
            }
          }
        },
        immediate: true
      },
      modelSrc: {
        handler(val) {
          if(this.multiple) {
            if (!Array.isArray(val)) {
              if (val) {
                val = [val];
              } else {
                val = [];
              }
            }
          }
          this.currentSrc = val;
          this.updateValue();
        },
        immediate: true
      },
      readonly: {
        handler() {
          this.$nextTick(() => {
            let allInputEl = this.$refs.uploadRef.$el.querySelectorAll('input');
            if(allInputEl && allInputEl.length > 0) {
              [].forEach.call(allInputEl, inputEl => {
                if(this.readonly) {
                  inputEl.setAttribute('readonly', 'readonly');
                } else {
                  inputEl.removeAttribute('readonly');
                }
              })
            }
          });
        },
        immediate: true
      }
    },
    computed: {
      activeProps() {
        return Object.assign(this.defaultProps, this.props);
      },
      imageFit() {
        if(this.fit === 'fill') {
          return 'hdty-img-fill';
        }else if(this.fit === 'contain') {
          return 'hdty-img-contain';
        }else if(this.fit === 'cover') {
          return 'hdty-img-cover';
        }else if(this.fit === 'none') {
          return 'hdty-img-none';
        }else if(this.fit === 'scale-down') {
          return 'hdty-img-scale-down';
        }
      },
      activeWrapperStyle() {
        let style = {
          width: this.$utilElem.pixelsFtt(this.width),
          height: this.$utilStr.isNum(this.maxHeight)
            ? this.$utilStr.isPercent(this.height)
              ? this.$utilElem.pixelsFtt(this.maxHeight * this.$utilStr.percentToDecimal(this.height))
              : this.$utilStr.isEmpty(this.height)
                ? this.$utilElem.pixelsFtt(this.maxHeight)
                : this.$utilElem.pixelsFtt(this.height)
            : this.$utilElem.pixelsFtt(this.height),
          maxHeight: this.$utilElem.pixelsFtt(this.maxHeight)
        };
        return this.$utilStr.clearObjUndef(style);
      },
      activeImageName() {
        if(this.currentFile) {
          return this.currentFile.name;
        }
        return '';
      },
      activeImageUrl: {
        get() {
          if(this.currentFile) {
            return URL.createObjectURL(this.currentFile);
          }
          return '';
        },
        set(val) {
          if(this.currentFile) {
            this.currentFile.url = val;
          }
        }
      }
    },
    mounted() {
      if(!this.multiple) {
        let parentFormItem = this.queryComponentParent('ElFormItem');
        if(parentFormItem) {
          this.parentFormItemEl = parentFormItem.$el;
          let parentCol = this.queryComponentParent('ElCol', parentFormItem);
          if(parentCol) {
            this.parentColEl = parentCol.$el;
            let parentRow = this.queryComponentParent('ElRow', parentCol);
            if(parentRow) {
              this.parentRowEl = parentRow.$el;
              let parentColPT = parseFloat(this.$utilElem.getStyle(this.parentColEl, 'paddingTop'));
              let parentColPB = parseFloat(this.$utilElem.getStyle(this.parentColEl, 'paddingBottom'));
              let parentColBT = parseFloat(this.$utilElem.getStyle(this.parentColEl, 'borderTop'));
              let parentColBB = parseFloat(this.$utilElem.getStyle(this.parentColEl, 'borderBottom'));
              let parentColChildren = this.parentColEl.children;
              let parentColChildrenTH = 0;
              Array.from(parentColChildren).forEach(e => {
                if(['absolute', 'fixed'].indexOf(this.$utilElem.getStyle(e, 'position')) === -1) {
                  let currentMT = parseInt(this.$utilElem.getStyle(e, 'marginTop'));
                  let currentMB = parseInt(this.$utilElem.getStyle(e, 'marginBottom'));
                  parentColChildrenTH += e.offsetHeight + currentMT + currentMB;
                }
              });
              this.originHeight = this.$el.offsetHeight;
              this.layoutHeight = parentColChildrenTH - this.originHeight + parentColPT + parentColPB + parentColBT + parentColBB;
              this.parentColSiblingEl = this.parentColEl.previousElementSibling || this.parentColEl.nextElementSibling;
              if(this.parentColSiblingEl) {
                this.$erd.listenTo(this.parentColSiblingEl, this.setMaxHeight);
              }else {
                this.$erd.listenTo(this.parentRowEl, this.addParentColSiblingResizeListener);
              }
            }
          }
        }
      }
      this.setAcceptType();
      this.$previewRefresh();
      this.setPreviewTopBar();
    },
    destroyed() {
      if(this.parentRowEl) {
        this.$erd.removeListener(this.parentRowEl, this.addParentColSiblingResizeListener);
      }
      if(this.parentColSiblingEl) {
        this.$erd.removeListener(this.parentColSiblingEl, this.setMaxHeight);
      }
    },
    methods: {
      // 添加元素的父级栅格列兄弟元素大小变化监听
      addParentColSiblingResizeListener() {
        this.parentColSiblingEl = this.parentColEl.previousElementSibling || this.parentColEl.nextElementSibling;
        if(this.parentColSiblingEl) {
          this.$erd.removeListener(this.parentRowEl, this.addParentColSiblingResizeListener);
          this.$erd.listenTo(this.parentColSiblingEl, this.setMaxHeight);
        }
      },
      // 设置最大高度
      setMaxHeight() {
        if(this.parentColSiblingEl.clientHeight > 0) {
          if(this.parentColSiblingEl.offsetHeight !== this.parentColEl.offsetHeight) {
            let maxHeight = this.parentColSiblingEl.offsetHeight - this.layoutHeight;
            if(this.originHeight <= maxHeight) {
              this.maxHeight = maxHeight;
            }
          }
        } else {
          this.maxHeight = null;
        }
      },
      // 设置input接受类型
      setAcceptType() {
        this.$nextTick(() => {
          let fileInput = this.$el.querySelector('.el-upload__input');
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
          fileInput.accept = acceptType;
        });
      },
      // 设置图片预览顶部栏
      setPreviewTopBar() {
        this.$preview.on('imageLoadComplete', (i, item) => {
          let scrollWrapEl = this.$preview.self.scrollWrap;
          let topBarEl = scrollWrapEl.querySelector('.pswp__top-bar');
          let rotateBtnEl = topBarEl.querySelector('.pswp__button--rotate');
          if(rotateBtnEl) {
            rotateBtnEl.remove();
          }
          let targetEl = topBarEl.querySelector('.pswp__button--zoom');
          rotateBtnEl = document.createElement('button');
          rotateBtnEl.title = '向右旋转';
          rotateBtnEl.className = 'pswp__button pswp__button--rotate';
          let index = 0;
          rotateBtnEl.onclick = function () {
            index++;
            item.container.lastChild.style.transform = 'rotate('+(index% 4)* 90+'deg)';
          };
          topBarEl.insertBefore(rotateBtnEl, targetEl);
          topBarEl.querySelector('.pswp__button--zoom').setAttribute('title', '放大/缩小');
          topBarEl.querySelector('.pswp__button--fs').setAttribute('title', '切换全屏');
          topBarEl.querySelector('.pswp__button--close').setAttribute('title', '关闭窗口');
          scrollWrapEl.querySelector('.pswp__button--arrow--left').setAttribute('title', '上一张');
          scrollWrapEl.querySelector('.pswp__button--arrow--right').setAttribute('title', '下一张');
        });
      },
      // 文件发生改变
      handleFileChange(file, fileList) {
        this.currentFile = file.raw;
        let isAccept = false;
        let acceptType = [];
        if(Array.isArray(this.acceptType)) {
          acceptType = this.acceptType;
        }else {
          acceptType.push(this.acceptType);
        }
        acceptType.forEach(e => {
          isAccept = isAccept || this.currentFile.type === this.$utilFile.assetTypeToAcceptType(e);
        });
        const isSize = !Number(this.acceptSize) || this.currentFile.size / 1024 / 1024 < Number(this.acceptSize);
        if (!isAccept) {
          this.$message({
            showClose: true,
            message: '上传图片只能是 ' + this.$utilStr.arrayJoin(acceptType, '/').toUpperCase() + ' 格式',
            type: 'error',
            offset: 76
          });
          if(this.multiple) {
            this.fileList = fileList;
            this.fileList.pop();
          }
          return false;
        }
        if (!isSize) {
          this.$message({
            showClose: true,
            message: '上传图片大小不能超过' + this.acceptSize + 'MB',
            type: 'error',
            offset: 76
          });
          if(this.multiple) {
            this.fileList = fileList;
            this.fileList.pop();
          }
          return false;
        }
        if(this.multiple) {
          this.fileList = fileList;
          this.fileList.pop();
        }
        if(!this.cutter) {
          this.submit();
        }else {
          this.cutterVisible = true;
        }
      },
      // 关闭裁剪面板
      handleCloseCutter() {
        this.setAcceptType();
      },
      // 取消裁剪
      handleCancelCutter() {
        this.submit();
        this.cutterVisible = false;
      },
      // 图片裁剪
      handleCutter() {
        this.$refs.uploadCutterRef.submit();
        this.$refs.uploadCutterRef.$on('currentComplete', (val, filename, url) => {
          let activeValue = val;
          let activeUrl = url;
          let activeUid = this.$utilStr.uuid(32, 16).toLowerCase();
          let activeName = this.activeImageName;
          if(this.outputModel === 'file') {
            try {
              activeValue[this.activeProps['url']] = activeUrl;
              activeValue[this.activeProps['uid']] = activeUid;
              activeValue[this.activeProps['name']] = activeName;
            } catch (e) {}
          } else if(this.outputModel === 'base64') {
            if(this.multiple || this.uploadApi) {
              let obj = {};
              obj[this.activeProps['url']] = activeValue;
              obj[this.activeProps['uid']] = activeUid;
              obj[this.activeProps['name']] = activeName;
              activeValue = obj;
            }
          }
          if(this.uploadApi) {
            let dataParams = {
              ...this.params
            };
            dataParams[this.activeProps['url']] = activeUrl;
            dataParams[this.activeProps['uid']] = activeUid;
            dataParams[this.activeProps['name']] = activeName;
            dataParams[this.activeProps['file']] = activeValue;
            if(this.activeProps['formData']) {
              dataParams = this.$utilStr.objToFormData(dataParams);
            }
            this.uploadApi(dataParams).then(response => {
              let { success, data } = response.data;
              if(success) {
                let uploadData = this.$utilStr.getValueOfDeepObj(data, this.activeProps['response']);
                if(!this.$utilStr.isEmpty(uploadData) && !this.$utilStr.isEmpty(uploadData[this.activeProps['uid']])) {
                  activeValue[this.activeProps['uid']] = uploadData[this.activeProps['uid']];
                }
                this.uploadComplete(activeUrl, activeUid, activeName, activeValue, uploadData);
              }
            }).catch(error => {
              // 响应错误回调
              console.error(error);
            });
          } else {
            this.uploadComplete(activeUrl, activeUid, activeName, activeValue);
          }
          this.$refs.uploadCutterRef.$off('currentComplete');
        });
        this.cutterVisible = false;
      },
      // 提交
      submit() {
        let activeUrl = this.activeImageUrl;
        let activeUid = this.$utilStr.uuid(32, 16).toLowerCase();
        let activeName = this.activeImageName;
        let activeValue;
        new Promise((resolve, reject) => {
          if(this.outputModel === 'file') {
            activeValue = this.currentFile;
            try {
              activeValue[this.activeProps['url']] = activeUrl;
              activeValue[this.activeProps['uid']] = activeUid;
              activeValue[this.activeProps['name']] = activeName;
            } catch (e) {}
            resolve();
          }else if(this.outputModel === 'base64') {
            this.$utilFile.fileToBase64(this.currentFile, base64 => {
              // if(this.multiple || this.uploadApi) {
                let obj = {};
                obj[this.activeProps['url']] = base64;
                obj[this.activeProps['uid']] = activeUid;
                obj[this.activeProps['name']] = activeName;
                activeValue = obj;
              // }
              resolve();
            });
          }
        }).finally(() => {
          if(this.uploadApi) {
            let dataParams = {
              ...this.params
            };
            dataParams[this.activeProps['url']] = activeUrl;
            dataParams[this.activeProps['uid']] = activeUid;
            dataParams[this.activeProps['name']] = activeName;
            dataParams[this.activeProps['file']] = activeValue;
            if(this.activeProps['formData']) {
              dataParams = this.$utilStr.objToFormData(dataParams);
            }
            this.uploadApi(dataParams).then(response => {
              let { success, data } = response.data;
              if(success) {
                let uploadData = this.$utilStr.getValueOfDeepObj(data, this.activeProps['response']);
                if(!this.$utilStr.isEmpty(uploadData) && !this.$utilStr.isEmpty(uploadData[this.activeProps['uid']])) {
                  activeValue[this.activeProps['uid']] = uploadData[this.activeProps['uid']];
                }
                this.uploadComplete(activeUrl, activeUid, activeName, activeValue, uploadData);
              }
            }).catch(error => {
              // 响应错误回调
              console.error(error);
            });
          } else {
            this.uploadComplete(activeUrl, activeUid, activeName, activeValue);
          }
        });
      },
      // 上传完成回调
      uploadComplete(url, uid, name, value, data) {
        if(this.multiple) {
          this.fileList.push(value);
          if(!this.currentSrc) {
            this.currentSrc = [];
          }
          if(!this.currentValue) {
            this.currentValue = [];
          }
          this.currentSrc.push(url);
          this.currentValue.push(value);
        } else {
          this.currentSrc = url;
          this.currentValue = value;
          this.currentUuid = uid;
        }
        this.$emit('input', this.currentValue);
        this.$emit('update:modelSrc', this.currentSrc);
        this.$emit('currentChanged', this.currentValue, name, data || value, 'upload');
        this.triggerValidateField();
        this.setAcceptType();
        this.$previewRefresh();
      },
      // 图片预览
      handlePreview(e) {
        e.stopPropagation();
      },
      // 图片旋转
      handleRotate(e, file) {
        e.stopPropagation();
        let activeValue, activeUrl, activeUid, activeName, activeType;
        if(file) {
          activeUrl = file[this.activeProps['url']];
          activeUid = file[this.activeProps['uid']];
          activeName = file[this.activeProps['name']];
          if(file.type) {
            activeType = file.type;
          }
        } else {
          activeUrl = typeof(this.currentValue) === 'object' ? this.currentValue[this.activeProps['url']] : this.currentSrc;
          activeUid = typeof(this.currentValue) === 'object' ? this.currentValue[this.activeProps['uid']] : 0;
          activeName = typeof(this.currentValue) === 'object' ? this.currentValue[this.activeProps['name']] : (this.activeImageName || this.$utilFile.appendFileExtension('', '', activeUrl));
          if(this.currentFile) {
            activeType = this.currentFile.type;
          }
        }
        let cvs = document.createElement('canvas'),
          cxt = cvs.getContext('2d'),
          img = new Image();
        // 解决跨域 Canvas 污染问题
        img.setAttribute('crossOrigin', 'anonymous');
        img.src = activeUrl;
        img.onload = () => {
          cvs.height = Number(img.width);
          cvs.width = Number(img.height);
          cxt.rotate(Math.PI/2);
          cxt.translate(0, -img.height);
          cxt.drawImage(img,0,0);
          activeUrl = cvs.toDataURL(activeType);
          if(this.outputModel === 'file') {
            activeValue = this.$utilFile.base64ToFile(activeUrl, activeName);
            try {
              activeValue[this.activeProps['url']] = activeUrl;
              activeValue[this.activeProps['uid']] = activeUid;
              if(this.activeProps['uid'] !== 'uid') {
                activeValue.uid = file ? (file.uid || new Date().getTime()) : typeof(this.currentValue) === 'object' ? (this.currentValue.uid || new Date().getTime()) : new Date().getTime();
              }
              activeValue[this.activeProps['name']] = activeName;
            } catch (e) {}
          } else if(this.outputModel === 'base64') {
            // if(this.multiple || this.uploadApi) {
              let obj = {};
              obj[this.activeProps['url']] = activeUrl;
              obj[this.activeProps['uid']] = activeUid;
              obj[this.activeProps['name']] = activeName;
              activeValue = obj;
            // }
          }
          if(this.updateApi) {
            let dataParams = {
              ...this.params
            };
            dataParams[this.activeProps['url']] = activeUrl;
            dataParams[this.activeProps['uid']] = activeUid;
            dataParams[this.activeProps['name']] = activeName;
            dataParams[this.activeProps['file']] = activeValue;
            if(this.activeProps['formData']) {
              dataParams = this.$utilStr.objToFormData(dataParams);
            }
            this.updateApi(dataParams).then(response => {
              let { success, data } = response.data;
              if(success) {
                this.updateComplete(activeUrl, activeUid, activeName, activeValue, this.$utilStr.getValueOfDeepObj(data, this.activeProps['response']));
              }
            }).catch(error => {
              // 响应错误回调
              console.error(error);
            });
          } else {
            this.updateComplete(activeUrl, activeUid, activeName, activeValue);
          }
          cvs = null;
        };
      },
      // 更新完成回调
      updateComplete(url, uid, name, value, data) {
        if(this.multiple) {
          let activeIndex = 0;
          for(let i = 0, len = this.currentValue.length; i < len; i++) {
            if(this.currentValue[i][this.activeProps['uid']] === uid) {
              activeIndex = i;
              break;
            }
          }
          this.fileList.splice(activeIndex, 1, value);
          this.currentSrc.splice(activeIndex, 1, url);
          this.currentValue.splice(activeIndex, 1, value);
        } else {
          this.currentSrc = url;
          this.currentValue = value;
        }
        this.$emit('input', this.currentValue);
        this.$emit('update:modelSrc', this.currentSrc);
        this.$emit('currentChanged', this.currentValue, name, data || value, 'update');
        this.setAcceptType();
        this.$previewRefresh();
      },
      // 图片清除
      handleRemove(e, file) {
        e.stopPropagation();
        let activeValue, activeUrl, activeUid, activeName;
        if(file) {
          activeUrl = file[this.activeProps['url']];
          activeUid = file[this.activeProps['uid']];
          activeName = file[this.activeProps['name']];
          activeValue = file;
        } else {
          activeUrl = typeof(this.currentValue) === 'object' ? this.currentValue[this.activeProps['url']] : this.currentSrc;
          activeUid = typeof(this.currentValue) === 'object' ? this.currentValue[this.activeProps['uid']] : 0;
          activeName = typeof(this.currentValue) === 'object' ? this.currentValue[this.activeProps['name']] : (this.activeImageName || this.$utilFile.appendFileExtension('', '', activeUrl));
          // if(this.multiple || this.uploadApi) {
            let obj = {};
            obj[this.activeProps['url']] = activeUrl;
            obj[this.activeProps['uid']] = activeUid;
            obj[this.activeProps['name']] = activeName;
            activeValue = obj;
          // }
        }
        if(this.deleteApi) {
          let dataParams = {
            ...this.params
          };
          dataParams[this.activeProps['uid']] = activeUid;
          this.deleteApi(dataParams).then(response => {
            let { success, data } = response.data;
            if(success) {
              this.deleteComplete(activeUrl, activeUid, activeName, activeValue, this.$utilStr.getValueOfDeepObj(data, this.activeProps['response']));
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          });
        } else {
          this.deleteComplete(activeUrl, activeUid, activeName, activeValue);
        }
      },
      // 删除完成回调
      deleteComplete(url, uid, name, value, data) {
        if(this.multiple) {
          let activeIndex = 0;
          for(let i = 0, len = this.currentValue.length; i < len; i++) {
            if(this.currentValue[i][this.activeProps['uid']] === uid) {
              activeIndex = i;
              break;
            }
          }
          this.fileList.splice(activeIndex, 1);
          this.currentSrc.splice(activeIndex, 1);
          this.currentValue.splice(activeIndex, 1);
        } else {
          this.currentSrc = '';
          if(this.outputModel === 'file') {
            this.currentValue = null;
          }else if(this.outputModel === 'base64') {
            this.currentValue = '';
          }
        }
        this.$emit('input', this.currentValue);
        this.$emit('update:modelSrc', this.currentSrc);
        this.$emit('currentChanged', this.currentValue, name, data || value, 'delete');
        this.triggerValidateField();
        this.setAcceptType();
      },
      // 更新绑定值
      updateValue() {
        if(!this.$utilStr.isEmpty(this.currentSrc) && this.$utilStr.isEmpty(this.currentValue)) {
          let activeSrc;
          if(Array.isArray(this.currentSrc)) {
            activeSrc = this.currentSrc;
          } else {
            activeSrc = [this.currentSrc];
          }
          for (let i = 0, len = activeSrc.length; i < len; i++) {
            let activeUrl = typeof(activeSrc[i]) === 'object' ? (activeSrc[i][this.activeProps['url']] || '') : activeSrc[i];
            let activeUid = typeof(activeSrc[i]) === 'object' ? (!this.$utilStr.isEmpty(activeSrc[i][this.activeProps['uid']]) ? activeSrc[i][this.activeProps['uid']] : i) : i;
            let activeName = typeof(activeSrc[i]) === 'object' ? (activeSrc[i][this.activeProps['name']] || this.$utilFile.appendFileExtension('', '', activeUrl)) : this.$utilFile.appendFileExtension('', '', activeUrl);
            let activeValue;
            new Promise((resolve, reject) => {
              if(this.$utilFile.isBase64(activeUrl)) {
                if(this.outputModel === 'file') {
                  activeValue = this.$utilFile.base64ToFile(activeUrl, activeName);
                  activeValue.url = URL.createObjectURL(activeValue);
                } else if(this.outputModel === 'base64') {
                  activeValue = activeUrl;
                }
                resolve();
              }else {
                this.$utilFile.imgToBase64(activeUrl, base64 => {
                  if(base64) {
                    if(this.outputModel === 'file') {
                      activeValue = this.$utilFile.base64ToFile(base64, activeName);
                      activeValue.url = URL.createObjectURL(activeValue);
                    } else if(this.outputModel === 'base64') {
                      activeValue = base64;
                    }
                  }
                  resolve();
                });
              }
            }).finally(() => {
              // if(typeof(activeSrc[i]) === 'object') {
                if(this.outputModel === 'file') {
                  try {
                    activeValue[this.activeProps['url']] = activeUrl;
                    activeValue[this.activeProps['uid']] = activeUid;
                    activeValue[this.activeProps['name']] = activeName;
                  } catch (e) {}
                } else if(this.outputModel === 'base64') {
                  let obj = {};
                  obj[this.activeProps['url']] = activeValue;
                  obj[this.activeProps['uid']] = activeUid;
                  obj[this.activeProps['name']] = activeName;
                  activeValue = obj;
                }
              // }
              if(this.multiple) {
                if(typeof(activeValue) === 'object') {
                  this.fileList.push(activeValue);
                } else {
                  let obj = {};
                  obj[this.activeProps['url']] = activeValue;
                  obj[this.activeProps['uid']] = activeUid;
                  obj[this.activeProps['name']] = activeName;
                  this.fileList.push(obj);
                }
                if(!this.currentValue) {
                  this.currentValue = [];
                }
                this.currentValue.push(activeValue);
              } else {
                this.currentValue = activeValue;
              }
              this.$emit('input', this.currentValue);
              this.setAcceptType();
              this.$previewRefresh();
            });
          }
        }
      },
      // 更新图片源
      updateModelSrc() {
        if(!this.$utilStr.isEmpty(this.currentValue) && this.$utilStr.isEmpty(this.currentSrc)) {
          let activeValue;
          if(Array.isArray(this.currentValue)) {
            activeValue = this.currentValue;
          } else {
            activeValue = [this.currentValue];
          }
          for (let i = 0, len = activeValue.length; i < len; i++) {
            let activeUrl = typeof(activeValue[i]) === 'object' ? (activeValue[i][this.activeProps['url']] || activeValue[i].url) : activeValue[i];
            let activeUid = typeof(activeValue[i]) === 'object' ? (!this.$utilStr.isEmpty(activeValue[i][this.activeProps['uid']]) ? activeValue[i][this.activeProps['uid']] : activeValue[i].uid) : i;
            let activeName = typeof(activeValue[i]) === 'object' ? (activeValue[i][this.activeProps['name']] || activeValue[i].name) : this.$utilFile.appendFileExtension('', '', activeUrl);
            let activeSrc = activeUrl;
            new Promise((resolve, reject) => {
              if(activeValue[i] instanceof File) {
                if(this.outputModel === 'file') {
                  resolve();
                } else if(this.outputModel === 'base64') {
                  this.$utilFile.fileToBase64(activeValue[i], base64 => {
                    activeValue[i] = base64;
                    resolve();
                  });
                }
              } else if(this.$utilFile.isBase64(activeValue[i])) {
                if(this.outputModel === 'file') {
                  activeValue[i] = this.$utilFile.base64ToFile(activeValue[i], activeName);
                  activeValue[i].url = URL.createObjectURL(activeValue[i]);
                  resolve();
                } else if(this.outputModel === 'base64') {
                  resolve();
                }
              } else {
                this.$utilFile.imgToBase64(activeSrc, base64 => {
                  if(base64) {
                    if(this.outputModel === 'file') {
                      activeValue[i] = this.$utilFile.base64ToFile(base64, activeName);
                      activeValue[i].url = URL.createObjectURL(activeValue[i]);
                    } else if(this.outputModel === 'base64') {
                      activeValue[i] = base64;
                    }
                  }
                  resolve();
                });
              }
            }).finally(() => {
              if(this.outputModel === 'file') {
                try {
                  activeValue[i][this.activeProps['url']] = activeUrl;
                  activeValue[i][this.activeProps['uid']] = activeUid;
                  activeValue[i][this.activeProps['name']] = activeName;
                } catch (e) {}
              } else if(this.outputModel === 'base64') {
                let obj = {};
                obj[this.activeProps['url']] = activeValue[i];
                obj[this.activeProps['uid']] = activeUid;
                obj[this.activeProps['name']] = activeName;
                activeValue[i] = obj;
              }
              if(this.multiple) {
                if(typeof(activeValue[i]) === 'object') {
                  this.fileList.push(activeValue[i]);
                } else {
                  let obj = {};
                  obj[this.activeProps['url']] = activeValue[i];
                  obj[this.activeProps['uid']] = activeUid;
                  obj[this.activeProps['name']] = activeName;
                  this.fileList.push(obj);
                }
                this.currentValue[i] = activeValue[i];
                if(!this.currentSrc) {
                  this.currentSrc = [];
                }
                this.currentSrc.push(activeSrc);
              } else {
                this.currentValue = activeValue[i];
                this.currentSrc = activeSrc;
              }
              this.$emit('input', this.currentValue);
              this.$emit('update:modelSrc', this.currentSrc);
              this.setAcceptType();
              this.$previewRefresh();
            });
          }
        }
      },
      // 文件超出数量限制
      handleFileExceed() {
        this.$message({
          showClose: true,
          message: '超出多选上传限制，最多上传['+this.limit+']张图片',
          type: 'error',
          offset: 76
        });
      },
      // 鼠标单击触发
      handleClick(e) {
        if(this.readonly) {
          // 阻止默认行为
          if (e.preventDefault) e.preventDefault(); else e.returnValue = false;
        }
      }
    }
  }
</script>

<style scoped>

</style>
