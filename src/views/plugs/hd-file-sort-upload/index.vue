<template>
  <el-dialog title="文件上传" :visible.sync="visible" v-if="visible" append-to-body>
    <hd-pane fit>
      <el-form :model="uploadData" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="附件名称" prop="fileType">
          <!--原生下拉组件模式-->
          <el-select
            v-if="currentShowType === '1' && !currentUseInput"
            v-model="uploadData.fileType"
            :disabled="disabledFileType"
            filterable
            underline
            placeholder="请选择附件名称"
            ref="selectedDoc"
            @change="handleGetTextSel"
          >
            <el-option
              v-for="item in baseDictionary"
              :key="item.key"
              :class="handleClassProvider(item)"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
          <!--自定义下拉组件模式-->
          <hd-dict-select
            v-if="currentShowType !== '1' && !currentUseInput"
            v-model="uploadData.fileType"
            :dictCode="$global.dictType.annexType"
            :currentValue="uploadData.fileType"
            :currentText="uploadData.fileTypeText"
            :disabled="disabledFileType"
            :ascs="['F_ORDER']"
            :excludeKeys="excludeKeys"
            filterable
            underline
            placeholder="请选择附件名称"
            @currentChangedForText="handleGetTextDic"
          ></hd-dict-select>
          <!--输入框模式-->
          <el-input
            v-if="currentUseInput"
            v-model="uploadData.fileType"
            :disabled="disabledFileType"
            underline
            placeholder="请输入附件名称"
            @input="handleGetTextInput"
          ></el-input>
        </el-form-item>
        <el-form-item label="附件内容" prop="urlList" v-loading="uploadLoading">
          <span class="image-item" v-for="(item, index) in uploadData.urlList" :key="index">
            <span class="image-preview-icon" @click="handlePreview(index)">
              <i class="el-icon-zoom-in"></i>
            </span>
            <span class="image-delete-icon" @click="handleDelete(index)">
              <i class="el-icon-delete"></i>
            </span>
            <img :src="item" alt />
          </span>
          <el-upload
            action="doUpload"
            list-type="picture-card"
            :before-upload="beforeUpload"
            :on-change="handleUploadFile"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <hd-file-preview
        ref="previewRef"
        :currentIndex="currentPreviewIndex"
        :currentUrlList="currentPreviewUrlList"
      ></hd-file-preview>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { uploadFile } from './api';
import HdFilePreview from '../../plugs/hd-file-preview';

export default {
  name: 'Index',
  components: {
    HdFilePreview
  },
  props: {
    prop: String,
    // 当前文件类型value
    currentShowType: {
      type: String,
      default: '1'
    },
    // 是否可编辑附件类型
    currentDisabledFileType: {
      type: Boolean,
      default: false
    },
    // 当前文件类型key
    currentFileType: {
      type: [Number, String],
      default: ''
    },
    // 当前文件类型value
    currentFileTypeText: {
      type: String,
      default: ''
    },
    // 当前图片url集合
    currentUrlList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 当前图片id集合
    currentIdList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 当前业务类型
    currentBusinessType: {
      type: String,
      default: ''
    },
    // 排除的字典key列表
    currentExcludeKeys: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 基础字典集合
    currentBaseDictionary: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 必填的附件
    currentRequiredDoc: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 附件名称是否使用输入模式
    currentUseInput: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 加载提示
      uploadLoading: false,
      // 控制上传组件的显示与隐藏
      visible: false,
      // 是否可以操作附件类型
      disabledFileType: this.currentDisabledFileType,
      // 表单信息
      uploadData: {
        // 文件类型key
        fileType: this.currentFileType,
        // 文件类型value
        fileTypeText: this.currentFileTypeText ? this.currentFileTypeText : '',
        // 图片url集合
        urlList: this.currentUrlList,
        // 图片id集合
        idList: this.currentIdList
      },
      // 排除的字典项
      excludeKeys: [],
      // 基础字典集合
      baseDictionary: [],
      // 必填的附件
      requiredDocs: [],
      //  必填的显示
      requiredShowWord: ' （必传）',
      // 验证
      rules: {
        fileType: [
          { required: true, message: '请选择文件类型', trigger: 'change' }
        ],
        urlList: [
          { required: true, message: '请选择图片文件', trigger: 'change' }
        ]
      },
      // 图片预览的开始索引
      currentPreviewIndex: 0,
      // 图片预览的图片集合
      currentPreviewUrlList: []
    };
  },
  watch: {
    // 通过监听visible的值的变化，进行复制和清空的操作。
    // 因为每次打开或关闭组件，只有visible的值每次都是变化的，可以监听到，可以方便的进行赋值和取值
    visible: {
      handler(val) {
        if (val) {
          this.disabledFileType = this.currentDisabledFileType;
          this.uploadData.fileType = this.currentFileType;
          this.uploadData.fileTypeText = this.currentFileTypeText;
          this.uploadData.urlList = this.currentUrlList;
          this.uploadData.idList = this.currentIdList;
          this.excludeKeys = this.currentExcludeKeys;
          this.baseDictionary = this.currentBaseDictionary;
          this.requiredDocs = this.currentRequiredDoc;
        } else {
          this.disabledFileType = false;
          this.uploadData.fileType = '';
          this.uploadData.fileTypeText = '';
          this.uploadData.urlList = [];
          this.uploadData.idList = [];
          this.excludeKeys = [];
          this.baseDictionary = [];
          this.requiredDocs = [];
        }
      },
      immediate: false,
      deep: true
    }
  },
  methods: {
    // 获取文件类型的描述信息（自定义下拉组件用）
    handleGetTextDic(val) {
      this.uploadData.fileTypeText = val;
      // 重新选择了文件类型后，需要将附件列表清空
      this.uploadData.urlList = [];
      this.uploadData.idList = [];
    },
    // 获取文件类型的描述信息（原生下拉组件用）
    handleGetTextSel() {
      this.$nextTick(() => {
        let fileTypeText = this.$refs.selectedDoc.$data.selectedLabel;

        this.uploadData.fileTypeText = fileTypeText;
      });
      // 重新选择了文件类型后，需要将附件列表清空
      this.uploadData.urlList = [];
      this.uploadData.idList = [];
    },
    // 获取文件类型的描述信息（输入框使用）
    handleGetTextInput() {
      this.uploadData.fileTypeText = this.uploadData.fileType;
      // 重新选择了文件类型后，需要将附件列表清空
      this.uploadData.urlList = [];
      this.uploadData.idList = [];
    },
    // 图片上传前格式和大小的验证方法
    beforeUpload(file) {
      return false;
    },
    // 上传图片
    async handleUploadFile(file) {
      let _this = this;
      // 图片上传前的验证，需要与 beforeUpload 方法对应
      _this.files = file;
      // 附件格式验证
      let fileSufNameList = ['jpg', 'png', 'jpeg', 'gif', 'bmp'];
      let fileSufName = _this.$utilAll.getFileSufName(file.name);
      if (!fileSufNameList.find((item) => item === fileSufName)) {
        _this.$message({
          showClose: true,
          customClass: 'is-fixed',
          message: '上传图片只能是 jpg png jpeg gif bmp 格式!',
          type: 'warning'
        });
        return false;
      }
      // 附件大小验证
      console.log('++++++++++附件大小验证：开始++++++++++');
      console.log('startSize', file.size / 1024 / 1024);
      if (file.size / 1024 / 1024 > 10) {
        _this.$message({
          showClose: true,
          customClass: 'is-fixed',
          message: '上传图片大小不能超过 10MB!',
          type: 'warning'
        });
        return false;
      }
      // 附件大小验证
      if (file.size === 0) {
        _this.$message({
          showClose: true,
          customClass: 'is-fixed',
          message: '不能上传空文件',
          type: 'warning'
        });
        return false;
      }
      // 先验证是否选择了文件类型
      _this.$refs.formRef.validateField('fileType');
      // 如果附件为图片类型
      if (file.raw.type.indexOf('image/') !== -1) {
        // 只有选择了文件类型，才可以进行文件上传
        if (_this.uploadData.fileType) {
          // 加载提示
          _this.uploadLoading = true;

          let fileTemp = {};
          // 压缩图片
          if (
            file &&
            file.raw &&
            file.raw.type &&
            file.raw.type.includes('image/')
          ) {
            fileTemp = await _this.$utilAll.imgCompress(file.raw);
          } else {
            fileTemp = file.raw;
          }
          console.log('tempSize', fileTemp.size / 1024 / 1024);

          // 构造水印
          const reader = new FileReader();
          reader.readAsDataURL(fileTemp); // file转base64
          reader.onload = (e) => {
            const canvas = document.createElement('canvas');
            const img = new Image();
            img.src = e.target.result;
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
              fileNew.uid = file.uid;
              console.log('resSize', fileNew.size / 1024 / 1024);
              console.log('==========附件大小验证：结束==========');

              // 构造表单提交的数据
              let fileFormData = new FormData();
              fileFormData.append('doc', fileNew);
              let form = {
                params: {
                  fjlx: _this.uploadData.fileType,
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
                    // 将上传的文件添加到图片的集合中
                    _this.uploadData.urlList.push(URL.createObjectURL(fileNew));
                    _this.uploadData.idList.push(data.docId);
                    // 更新隔行验证
                    _this.$refs.formRef.validateField('urlList');
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
            };
          };
        }
      }
    },
    // 预览
    handlePreview(index) {
      this.currentPreviewIndex = index;
      this.currentPreviewUrlList = this.uploadData.urlList;
      this.$refs.previewRef.visible = true;
    },
    // 删除
    handleDelete(index) {
      this.uploadData.urlList.splice(index, 1);
      this.uploadData.idList.splice(index, 1);
    },
    // 确定
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          // 回传数据（1：新增；2：编辑）
          let uploadType = _this.disabledFileType === false ? '1' : '2';
          _this.$emit('currentChange', _this.uploadData, uploadType);
          _this.resetForm();
        }
      });
    },
    // 重置
    resetForm() {
      this.visible = false;
    },
    // 取消
    cancelForm() {
      this.resetForm();
    },
    // 样式
    handleClassProvider(item) {
      let _this = this;
      let className = 'commonDoc';
      if (_this.requiredDocs && _this.requiredDocs.includes(item.value)) {
        className += ' requiredDoc';
      }
      return className;
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-upload--picture-card {
  width: 148px;
  height: 148px;
  display: inline-block;
}

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
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.image-item:hover {
  opacity: 0.5;
}

.image-preview-icon,
.image-delete-icon {
  display: none;
}

.image-item:hover span {
  position: absolute;
  display: inline-block;
  cursor: pointer;
  font-size: 20px;
  color: #fff;
  line-height: 18px;
}

.image-item:hover .image-preview-icon {
  left: 40px;
}

.image-item:hover .image-delete-icon {
  right: 40px;
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

::v-deep.commonDoc {
  &.requiredDoc {
    color: #ff0b00 !important;
    &::after {
      content: ' （必传）';
    }
  }
}
</style>
