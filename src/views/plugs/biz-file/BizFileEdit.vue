<template>
  <el-dialog
    title="附件编辑"
    :visible.sync="visible"
    custom-class="new-form"
    append-to-body>
    <hd-pane
      fit>
      <el-form
        :model="uploadData"
        :rules="rules"
        ref="formRef"
        label-width="0">
        <!--附件信息-->
        <div class="con-area">
          <div class="area-head">
            <div class="head">
              <i class="el-icon-s-management"></i>
              附件信息
            </div>
          </div>
          <div class="area-body">
            <el-card class="con-card box-card">
              <div class="body">
                <div class="form">
                  <!--附件类型-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">附件类型</span>
                      </label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item
                            prop="fileType"
                            :rules="[{
                              required: true,
                              message: '请' + (currentShowFileType === '3' ? '输入' : '选择') + '附件类型',
                              trigger: currentShowFileType === '3' ? 'blur' : 'change'
                            }]">
                            <!--框架下拉选择组件模式-->
                            <hd-dict-select
                              v-if="currentShowFileType === '1'"
                              v-model="uploadData.fileType"
                              :model-text.sync="uploadData.fileTypeText"
                              :dict-code="currentFileTypeDictCode"
                              :ascs="['F_ORDER']"
                              :excludeKeys="currentExcludeKeys"
                              disabled
                              filterable
                              placeholder="请选择附件类型"
                              @currentChangedForText="autoGetTextByHdDictSelect">
                            </hd-dict-select>
                            <!--element原生下拉组件模式-->
                            <el-select
                              v-if="currentShowFileType === '2'"
                              v-model="uploadData.fileType"
                              ref="selectedDoc"
                              disabled
                              filterable
                              placeholder="请选择附件类型"
                              @change="autoGetTextByElSelect">
                              <el-option
                                v-for="item in currentBaseDictionary"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key">
                              </el-option>
                            </el-select>
                            <!--输入框模式-->
                            <el-input
                              v-if="currentShowFileType === '3'"
                              v-model="uploadData.fileType"
                              disabled
                              placeholder="请输入附件类型(如：常规附件、证明材料 等)"
                              maxlength="100"
                              @input="autoGetTextByElInput">
                            </el-input>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--附件内容-->
                  <div class="form-row" v-loading="uploadLoading">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span class="required">附件内容</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div">
                          <el-form-item
                            prop="urlList"
                            :rules="[{
                              required: true,
                              message: '请选择附件内容',
                              trigger: 'change'
                            }]">
                            <el-upload
                              class="upload-demo"
                              drag
                              action="doUpload"
                              list-type="picture-card"
                              :before-upload="beforeUpload"
                              :on-change="handleUploadFile">
                              <i class="el-icon-upload"></i>
                              <div class="el-upload__text">将附件拖到此处，或<em>点击上传</em></div>
                            </el-upload>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--附件列表-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">
                        <span>附件列表</span>
                      </label>
                      <div class="p-div p-divs">
                        <div class="text-div con-file-list">
                          <div style="color: #9e9e9e;" v-show="!uploadData.nameList || uploadData.nameList.length === 0">暂无附件</div>
                          <div
                            v-for="(item, index) in uploadData.nameList"
                            :key="index"
                            @click="handleDownload(index)">
                            <div class="con-file-name">
                              <div class="con-tag" title="点击下载附件">
                                <i class="el-icon-document"></i>
                              </div>
                              <div class="con-name hdty-elip" :title="item">
                                {{item}}
                              </div>
                              <div class="con-btn">
                                <i class="el-icon-circle-check"></i>
                                <i class="el-icon-close" title="点击删除附件" @click.stop="handleDelete(index)"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </el-form>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {hdList, hdForm} from "@/utils/util-framework";
  import {uploadFile} from './api';

  export default {
    name: 'BizFileEdit',
    provide() {
      return {
        BizFileEdit: this
      };
    },
    inject: ['bizFile'],
    mixins: [hdList, hdForm],
    components: {},
    props: {
      prop: String,
      // 当前业务类型（1：登记，即人员添加编辑等；2：管控，即日常管控；3：撤管；4：督办）
      currentBusinessType: {
        type: String,
        default: '4'
      },
      // 当前附件类型上传时DOM层的组件类型（1：框架下拉选择；2：element原生下拉框；3：输入框）
      currentShowFileType: {
        type: String,
        default: '3'
      },
      // 当前附件类型字典（框架下拉选择组件使用）
      currentFileTypeDictCode: {
        type: String,
        default: '397'
      },
      // 排除的字典key列表（框架下拉选择组件使用）
      currentExcludeKeys: {
        type: Array,
        default: () => {
          return []
        }
      },
      // 基础字典集合（element原生下拉框使用）
      currentBaseDictionary: {
        type: Array,
        default: () => {
          return []
        }
      },
    },
    data() {
      return {
        // 显示与隐藏
        visible: false,
        // 加载提示
        uploadLoading: false,
        // 表单信息
        uploadData: {
          // 附件类型key
          fileType: '',
          // 附件类型value
          fileTypeText: '',
          // 附件id集合
          idList: [],
          // 附件url集合
          urlList: [],
          // 附件name集合
          nameList: [],
        },
        // 验证
        rules: {},
      }
    },
    methods: {
      // 加载之前
      beforeLoadForm() {

      },
      // 获取附件类型的描述信息（框架下拉选择组件模式）
      autoGetTextByHdDictSelect(val) {
        // 获取附件类型的文字信息即字典的翻译信息
        this.uploadData.fileTypeText = val;
        // 重新选择了附件类型后，需要将附件列表清空
        this.uploadData.idList = [];
        this.uploadData.urlList = [];
        this.uploadData.nameList = [];
      },
      // 获取附件类型的描述信息（element原生下拉组件模式）
      autoGetTextByElSelect() {
        // 获取附件类型的文字信息即下拉框的value信息
        this.$nextTick(() => {
          this.uploadData.fileTypeText = this.$refs.selectedDoc.$data.selectedLabel;
        });
        // 重新选择了附件类型后，需要将附件列表清空
        this.uploadData.idList = [];
        this.uploadData.urlList = [];
        this.uploadData.nameList = [];
      },
      // 获取附件类型的描述信息（输入框模式）
      autoGetTextByElInput() {
        // 获取附件类型的文字信息即输入框的信息
        this.uploadData.fileTypeText = this.uploadData.fileType;
        // 重新选择了附件类型后，需要将附件列表清空
        this.uploadData.idList = [];
        this.uploadData.urlList = [];
        this.uploadData.nameList = [];
      },
      // 附件上传前格式和大小的验证方法
      beforeUpload(file) {
        return false;
      },
      // 上传附件
      handleUploadFile(file) {
        let _this = this;
        // 附件上传前的验证，需要与 beforeUpload 方法对应
        _this.files = file;
        // 先验证是否选择了附件类型
        _this.$refs.formRef.validateField(['fileType'], errMsg => {
          // 如果errMsg无值，则代表是正确的情况
          if (!errMsg) {
            // 当前页面附件名称重复验证
            if (_this.uploadData.nameList.find(item => item === file.name)) {
              _this.$message({
                showClose: true,
                customClass: 'is-fixed',
                message: '该附件已存在',
                type: 'warning'
              });
              return false;
            }
            // 列表上已存在的附件名称验证
            let hasSameFileName = false;
            if (_this.bizFile.fileTableData && _this.bizFile.fileTableData.length > 0) {
              _this.bizFile.fileTableData.forEach(item1 => {
                if (item1.nameList && item1.nameList.length > 0) {
                  if (item1.nameList.find(item2 => item2 === file.name)) {
                    hasSameFileName = true;
                  }
                }
              })
            }
            if (hasSameFileName) {
              _this.$message({
                showClose: true,
                customClass: 'is-fixed',
                message: '该附件已上传至附件列表',
                type: 'warning'
              });
              return false;
            }
            // 附件格式验证
            let fileSufNameList = ['jpg', 'png', 'jpeg', 'gif', 'bmp', 'doc', 'docx', 'xls', 'xlsx', 'pdf', 'txt'];
            let fileSufName = _this.$utilAll.getFileSufName(file.name);
            if (!fileSufNameList.find(item => item === fileSufName)) {
              _this.$message({
                showClose: true,
                customClass: 'is-fixed',
                message: '上传附件只能是 jpg png jpeg gif bmp doc docx xls xlsx pdf txt 格式!',
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
            // 加载提示
            _this.uploadLoading = true;
            // 构造表单提交的数据
            let fileFormData = new FormData();
            fileFormData.append('doc', file.raw);
            let form = {
              params: {
                fjlx: _this.uploadData.fileType,
                busType: _this.currentBusinessType
              },
              data: fileFormData
            };
            // Lambda写法
            uploadFile(form).then(response => {
              // 响应成功回调
              let { success, data } = response.data;
              if (success) {
                // 将上传的附件添加到附件的集合中
                _this.uploadData.idList.push(data.docId);
                _this.uploadData.urlList.push(data.docUrl);
                _this.uploadData.nameList.push(data.docName);
                // 更新隔行验证
                _this.$refs.formRef.validateField('urlList');
                _this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: '上传成功',
                  type: 'success'
                });
              }
            }).catch(error => {
              // 响应错误回调
              console.log(error);
            }).finally(() => {
              _this.uploadLoading = false;
            });
          } else {
            _this.$message({
              showClose: true,
              customClass: 'is-fixed',
              message: '请先' + (_this.currentShowFileType === '3' ? '输入' : '选择') + '附件类型',
              type: 'warning'
            });
          }
        });
      },
      // 下载
      handleDownload(index) {
        let _this = this;
        const downloadRes = async () => {
          let response = await fetch(_this.uploadData.urlList[index]); // 内容转变成blob地址
          let blob = await response.blob();  // 创建隐藏的可下载链接
          let objectUrl = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = objectUrl;
          a.download = _this.uploadData.nameList[index];
          a.click();
          a.remove();
        };
        downloadRes();
      },
      // 删除
      handleDelete(index) {
        let _this = this;
        _this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.uploadData.idList.splice(index, 1);
          _this.uploadData.urlList.splice(index, 1);
          _this.uploadData.nameList.splice(index, 1);
          _this.$message({
            showClose: true,
            customClass: 'is-fixed',
            message: '删除成功',
            type: 'success'
          });
        });
      },
      // 确定
      submitForm() {
        let _this = this;
        _this.$refs.formRef.validate((valid) => {
          if (valid) {
            _this.$emit('currentChange', _this.uploadData);
            _this.resetForm();
          }
        });
      },
      // 重置
      resetForm() {
        this.visible = false;
        this.uploadData = {
          fileType: '',
          fileTypeText: '',
          idList: [],
          urlList: [],
          nameList: [],
        };
      },
      // 取消
      cancelForm() {
        this.resetForm();
      },
    }
  }
</script>

<style lang="scss" scoped>
  /*上传组件样式修改*/
  .upload-demo {
    ::v-deep .el-upload__text {
      line-height: 0;
      margin-top: -30px;
    }
  }

  /*附件名称列表*/
  .con-file-list {
    width: 100%;
    .con-file-name {
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
        .el-icon-circle-check {
          color: #01b3c1;
        }
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
          .el-icon-circle-check {
            display: none;
          }
          .el-icon-close {
            display: block;
          }
        }
      }
    }
  }
</style>
