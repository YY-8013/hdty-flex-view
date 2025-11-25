<template>
  <div class="con-biz-file">
    <el-button
      class="con-add-btn"
      v-if="showAddBtn"
      type="success"
      icon="el-icon-circle-plus-outline"
      @click="handleFileAdd">
      上传
    </el-button>
    <div class="body">
      <!--附件列表-->
      <el-table
        class="new-table"
        :data="fileTableData"
        empty-text="暂无数据"
        row-key="id"
        ref="fileTableRef"
        :cell-class-name="setCellClassName"
        border>
        <el-table-column
          sortable="custom"
          type="index"
          label="序号"
          :index="setIndex"
          align="center"
          width="60">
        </el-table-column>
        <el-table-column
          v-if="showDetailBtn || showEditBtn || showDeleteBtn"
          label="操作"
          align="center"
          width="140">
          <template slot-scope="scope">
            <el-button
              v-if="showDetailBtn"
              type="success"
              @click="handleFileDetail(scope.$index, scope.row)">
              详情
            </el-button>
            <el-button
              v-if="showEditBtn"
              type="primary"
              @click="handleFileEdit(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button
              v-if="showDeleteBtn"
              type="danger"
              @click="handleFileDelete(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="fileTypeText"
          label="附件类型"
          align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="fileList"
          label="附件内容"
          header-align="center"
          min-width="180">
          <template slot-scope="scope">
            <div class="con-file-name">
              <div
                class="file-name"
                v-for="(item, index) in scope.row.nameList"
                :key="index"
                @click="handleDownload(scope.$index, index)">
                <div class="con-tag" title="点击下载附件">
                  <i class="el-icon-document"></i>
                </div>
                <div class="con-name hdty-elip" :title="item">
                  {{item}}
                </div>
                <div class="con-btn" v-show="deleteFileSubItem">
                  <i class="el-icon-close" title="点击删除附件" @click.stop="handleDelete(scope.$index, index)"></i>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <biz-file-add
      ref="fileAddRef"
      @currentChange="handleGetFileDataAdd"
      :currentBusinessType="currentBusinessType"
      :currentShowFileType="currentShowFileType"
      :currentFileTypeDictCode="currentFileTypeDictCode"
      :currentExcludeKeys="currentExcludeKeys"
      :currentBaseDictionary="currentBaseDictionary">
    </biz-file-add>
    <biz-file-edit
      ref="fileEditRef"
      @currentChange="handleGetFileDataEdit"
      :currentBusinessType="currentBusinessType"
      :currentShowFileType="currentShowFileType"
      :currentFileTypeDictCode="currentFileTypeDictCode"
      :currentExcludeKeys="currentExcludeKeys"
      :currentBaseDictionary="currentBaseDictionary">
    </biz-file-edit>
  </div>
</template>

<script>
  import {hdList, hdForm} from "@/utils/util-framework";
  import BizFileAdd from './BizFileAdd';
  import BizFileEdit from './BizFileEdit';

  export default {
    name: 'Index',
    provide() {
      return {
        bizFile: this
      };
    },
    inject: [],
    mixins: [hdList, hdForm],
    components: {
      BizFileAdd,
      BizFileEdit,
    },
    props: {
      // 显示新增按钮
      showAddBtn: {
        type: Boolean,
        default: true,
      },
      // 显示详情按钮
      showDetailBtn: {
        type: Boolean,
        default: false,
      },
      // 显示编辑按钮
      showEditBtn: {
        type: Boolean,
        default: true,
      },
      // 显示删除按钮
      showDeleteBtn: {
        type: Boolean,
        default: true,
      },
      // 是否可删除大项中的子项
      deleteFileSubItem: {
        type: Boolean,
        default: true,
      },
      // 当前业务类型（1：登记，即人员添加编辑等；2：管控，即日常管控；3：撤管；4：督办；5：核查）
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
      // 当前附件类型key（主要为了在输入框模式下，默认添加附件类型）
      currentFileType: {
        type: [Number, String],
        default: ''
      },
      // 当前附件类型value（主要为了在输入框模式下，默认添加附件(翻译)类型）
      currentFileTypeText: {
        type: String,
        default: ''
      },
    },
    data() {
      return {
        // 附件列表
        fileTableData: [],
      }
    },
    watch: {},
    methods: {
      // 附件上传
      handleFileAdd() {
        // 主要适应：输入框的模式下，默认添加附件类型。如果有值，则不赋值，如已经添加，未提交再打开的时候，保持原有数据
        if (!this.$refs.fileAddRef.uploadData.fileType) {
          this.$refs.fileAddRef.uploadData.fileType = this.currentFileType;
          this.$refs.fileAddRef.uploadData.fileTypeText = this.currentFileTypeText;
        }
        this.$refs.fileAddRef.visible = true;
        this.$refs.fileAddRef.beforeLoadForm();
      },
      // 附件详情
      handleFileDetail(index, row) {
        let _this = this;
        _this.$message({
          showClose: true,
          customClass: 'is-fixed',
          message: '暂不支持附件预览',
          type: 'warning'
        });
      },
      // 附件编辑
      handleFileEdit(index, row) {
        this.$refs.fileEditRef.visible = true;
        this.$refs.fileEditRef.uploadData.fileType = row.fileType;
        this.$refs.fileEditRef.uploadData.fileTypeText = row.fileTypeText;
        this.$refs.fileEditRef.uploadData.idList = JSON.parse(JSON.stringify(row.idList));
        this.$refs.fileEditRef.uploadData.urlList = JSON.parse(JSON.stringify(row.urlList));
        this.$refs.fileEditRef.uploadData.nameList = JSON.parse(JSON.stringify(row.nameList));
        this.$refs.fileEditRef.beforeLoadForm();
      },
      // 附件删除
      handleFileDelete(index, row) {
        let _this = this;
        _this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.fileTableData.splice(index, 1);
          _this.$message({
            showClose: true,
            customClass: 'is-fixed',
            message: '删除成功',
            type: 'success'
          });
        });
      },
      // 获取附件信息
      handleGetFileDataAdd(val) {
        let _this = this;
        let file = JSON.parse(JSON.stringify(val));
        // 先判断附件列表中有没有该类型附件（默认没有）
        let hasNotThisFileType = true;
        // 情况1：可能新增了之前已存在的附件类型。情况2：也可能完全新增新的附件类型
        _this.fileTableData.forEach((item, index) => {
          if (item.fileType === file.fileType) {
            // 附件列表中有该类型附件
            hasNotThisFileType = false;
            // 情况1：可能新增了之前已存在的附件类型。在原来的基础上叠加附件，不再新增附件列表
            _this.fileTableData[index].idList = _this.fileTableData[index].idList.concat(file.idList);
            _this.fileTableData[index].urlList = _this.fileTableData[index].urlList.concat(file.urlList);
            _this.fileTableData[index].nameList = _this.fileTableData[index].nameList.concat(file.nameList);
          }
        });
        // 情况2：也可能完全新增新的附件类型。之前不存在的附件类型，直接新增
        if (hasNotThisFileType) {
          _this.fileTableData.push(file);
        }
        _this.fileTableData = JSON.parse(JSON.stringify(_this.fileTableData));
      },
      // 获取附件信息
      handleGetFileDataEdit(val, uploadType) {
        let _this = this;
        let file = JSON.parse(JSON.stringify(val));
        // 编辑已存在的附件
        _this.fileTableData.forEach((item, index) => {
          if (item.fileType === file.fileType) {
            // 如果有该类型的话，直接替换该位置上的附件内容
            _this.fileTableData[index] = file;
          }
        });
        _this.fileTableData = JSON.parse(JSON.stringify(_this.fileTableData));
      },
      // 单元格样式
      setCellClassName({ row, column, rowIndex, columnIndex }) {
        if (column.property === 'fileList') {
          return 'con-file-name-cell';
        }
      },
      // 附件子项下载
      handleDownload(rowIndex, index) {
        let _this = this;
        const downloadRes = async () => {
          let response = await fetch(_this.fileTableData[rowIndex].urlList[index]); // 内容转变成blob地址
          let blob = await response.blob();  // 创建隐藏的可下载链接
          let objectUrl = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = objectUrl;
          a.download = _this.fileTableData[rowIndex].nameList[index];
          a.click();
          a.remove();
        };
        downloadRes();
      },
      // 附件子项删除
      handleDelete(rowIndex, index) {
        let _this = this;
        _this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.fileTableData[rowIndex].idList.splice(index, 1);
          _this.fileTableData[rowIndex].urlList.splice(index, 1);
          _this.fileTableData[rowIndex].nameList.splice(index, 1);
          // 如果列表该项的子项都删除，则删除该大项
          if (_this.fileTableData[rowIndex].idList.length === 0) {
            _this.fileTableData.splice(rowIndex, 1);
          }
          _this.$message({
            showClose: true,
            customClass: 'is-fixed',
            message: '删除成功',
            type: 'success'
          });
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .con-biz-file {
    .con-add-btn {
      position: absolute;
      right: 0;
      top: -1px;
    }
    .el-table {
      ::v-deep .el-table__body {
        .con-file-name-cell {
          .cell {
            white-space: normal;
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
            }
          }
        }
      }
    }
  }
</style>
