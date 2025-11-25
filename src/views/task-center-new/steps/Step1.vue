<template>
  <div class="con-single-step" v-loading="formDataLoading || objDataLoading">
    <!--表单选择-->
    <div class="con-area">
      <div class="area-head">
        <div class="head">
          <i class="el-icon-document"></i>
          表单选择
        </div>
        <div class="head-sub">
          <el-radio-group v-model="ishaveItem" size="mini">
            <el-radio label="1">有表单</el-radio>
            <el-radio label="0">无表单</el-radio>
          </el-radio-group>
        </div>
        <div class="con-head-right" v-show="ishaveItem === '1'">
          <el-button type="success" size="mini" @click="handleSelectForm">选择表单</el-button>
        </div>
      </div>
      <div class="area-body">
        <el-card class="con-card box-card" style="padding-bottom: 0;">
          <!--v-if：“有表单”；2024-07-25ldm修改，创建了无表单的表单，所以，选择‘无表单’也需要显示表单-->
          <div class="body">
            <el-table
              class="new-table"
              :data="formTableData"
              empty-text="暂无数据"
              row-key="id"
              ref="formTableRef"
              border
            >
              <!-- <el-table-column
                fixed
                sortable="custom"
                type="index"
                label="序号"
                :index="setIndex"
                align="center"
                width="60"
              ></el-table-column>-->
              <el-table-column label="预览" align="center" width="50">
                <template slot-scope="scope">
                  <el-link
                    :underline="false"
                    type="primary"
                    @click="handlePreview(scope.$index, scope.row)"
                  >预览</el-link>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="vo.formTitle"
                label="表单名称"
                align="center"
                min-width="160"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="vox.formType"
                label="表单类型"
                align="center"
                width="100"
              >
                <template slot-scope="scope">
                  <div
                    :class="scope.row.vo.formType === '1' ? 'text-color-5' : 'text-color-2'"
                  >{{scope.row.vox.formType}}</div>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="vo.createUsername"
                label="创建人"
                align="center"
                width="120"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="vox.createTime"
                label="创建时间"
                align="center"
                width="180"
              ></el-table-column>
            </el-table>
          </div>
          <!--          &lt;!&ndash;v-if：“无表单”&ndash;&gt;-->
          <!--          <div class="body" v-if="ishaveItem === '0'">-->
          <!--            <div class="con-empty-form">-->
          <!--              <span style>暂无表单</span>-->
          <!--            </div>-->
          <!--          </div>-->
        </el-card>
      </div>
    </div>

    <!--任务对象 v-if：“有表单”才显示以下内容-->
    <div class="con-area con-area-warning">
      <div class="area-head">
        <div class="head">
          <i class="el-icon-document"></i>
          任务对象
        </div>
        <!--v-if：“选择了表单”才显示以下内容-->
        <div class="head-sub" v-if="formTableData.length > 0">
          <el-radio-group v-model="ishaveObject" size="mini">
            <el-radio label="1">有任务对象</el-radio>
            <el-radio
              :disabled="isMustObject"
              label="0"
              :title="isMustObject? '当前标准件必须填写任务对象':''"
            >无任务对象</el-radio>
          </el-radio-group>
        </div>
        <!--v-if：“选择了表单”才显示以下内容-->
        <div
          class="con-head-right"
          style="display: flex;align-items: center;"
          v-if="formTableData.length > 0 && ishaveObject === '1'"
        >
          <el-checkbox v-model="isautoBoolean">是否已自动匹配指派对象</el-checkbox>
        </div>
      </div>
      <div class="area-body">
        <!--v-if：“选择了表单”才显示以下内容-->
        <el-card
          class="con-card box-card"
          style="padding-bottom: 0;"
          v-if="formTableData.length > 0"
        >
          <div slot="header" class="clearfix">
            <div class="base">
              <i class="el-icon-user-solid"></i>
              {{formTableData[0].vo.formTitle}}
            </div>
            <div class="con-head-right" v-show="ishaveObject === '1'">
              <el-button
                :disabled="!rwNformObjectList || rwNformObjectList.length === 0 "
                type="info"
                size="mini"
                v-if="formTableData[0].vo.formType === '1' && showDataExtractBtn"
                @click="handleExtractData"
              >数据抽取</el-button>
              <el-button
                v-show="false"
                :disabled="!rwNformObjectList || rwNformObjectList.length === 0"
                type="success"
                size="mini"
                @click="handleAddField"
              >添加字段</el-button>
              <el-button
                :disabled="!isManual || !rwNformObjectList || rwNformObjectList.length === 0"
                type="primary"
                size="mini"
                :title="isManual ? '': '当前标准件不支持手动添加数据，仅支持数据抽取'"
                @click="handleAddRow"
              >添加数据</el-button>
              <el-button
                :disabled=" !rwNformObjectList || rwNformObjectList.length === 0 || objTableData.length === 0"
                type="danger"
                size="mini"
                @click="handleClearData"
              >全部删除</el-button>
              <el-dropdown trigger="hover">
                <el-button
                  type="warning"
                  size="mini"
                  :title="isManual ? '': '当前标准件不支持手动添加数据，仅支持数据抽取'"
                  :disabled="!isManual || !rwNformObjectList || rwNformObjectList.length === 0"
                >导入</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-button
                    type="success"
                    size="mini"
                    icon="el-icon-download"
                    :loading="downloading"
                    @click="handleDownload"
                  >下载模板</el-button>
                  <hd-button-upload
                    ref="uploadRef"
                    type="warning"
                    size="mini"
                    :loading="uploading"
                    v-model="importData.file"
                    @currentChanged="handleImport"
                  >导入数据</hd-button-upload>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="body hdty-scroll" style="max-height: 450px;" v-show="ishaveObject === '1'">
            <!--表格-->
            <dynamic-table ref="DynamicTableRef"></dynamic-table>
            <!--空数据提示-->
            <div
              class="con-empty-task-table"
              v-show="isManual && rwNformObjectList && rwNformObjectList.length > 0"
            >
              <a href="javascript:;" @click="handleAddRow">
                <i class="el-icon-circle-plus-outline"></i>
                <span style="margin-left: 8px;">点击此处添加数据</span>
              </a>
            </div>
            <el-pagination
              background
              layout="sizes, total, ->, prev, pager, next, jumper"
              :current-page="pageOptions.current"
              :page-sizes="pageOptions.sizes"
              :page-size="pageOptions.size"
              :total="pageOptions.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
          <div class="body" v-show="ishaveObject === '0'">
            <div class="con-empty-task-object">
              <span style>暂无任务对象</span>
            </div>
          </div>
        </el-card>
        <!--v-else：“未选择表单”才显示以下内容-->
        <el-card class="con-card box-card" style="padding-bottom: 0;" v-else>
          <div class="con-empty-form">
            <span style>暂未选择表单</span>
          </div>
        </el-card>
      </div>
    </div>

    <!--选择表单-->
    <new-task-form-select ref="formSelectRef" @currentChange="handleSelectFormBack"></new-task-form-select>
    <!--预览表单-->
    <new-task-form-preview ref="perviewRef"></new-task-form-preview>
    <!--抽取数据-->
    <new-task-object-extract ref="extractRef" @currentChange="handleExtractDataBack"></new-task-object-extract>
  </div>
</template>

<script>
import { hdList, hdForm } from '@/utils/util-framework';
import {
  getFormDetail,
  excelRwObjectImport,
  rwWbdExcelImport,
  rwTrendsExcelImport,
  getFormPage
} from './../api';
import DynamicTable from './../taskobject/DynamicTable';
import NewTaskFormSelect from './../common/NewTaskFormSelect';
import NewTaskFormPreview from './../common/NewTaskFormPreview';
import NewTaskObjectExtract from './../common/NewTaskObjectExtract';
// 前端导出工具
import XLSX from 'xlsx';

export default {
  name: 'Step1',
  provide() {
    return {
      Step1: this,
      ParentPage: this
    };
  },
  inject: ['NewTaskCenterDisAdd'],
  mixins: [hdList, hdForm],
  components: {
    DynamicTable,
    NewTaskFormSelect,
    NewTaskFormPreview,
    NewTaskObjectExtract
  },
  data() {
    return {
      // 有无表单
      ishaveItem: '1',
      // 有无任务对象
      ishaveObject: '1',
      // 自动匹配
      isautoBoolean: false,

      // 表单加载
      formDataLoading: false,
      // 表单名称列表
      formTableData: [],
      // 表单详情
      formId: '',
      rwForm: {},
      rwFormItemConfigList: [],
      rwFormItemList: [],
      rwNformObjectList: [], // 任务对象列名列表
      // 导入
      importData: {
        file: null
      },
      // 导入模板信息
      // importTemplate: appEnv.importTemplate.mdjfpcRwObjectImport,
      // importWbdTemplate: appEnv.importTemplate.wbdRwObjectImport,
      // 数据处理加载
      objDataLoading: false,
      pageOptions: {
        current: 1,
        sizes: [5, 10, 20, 50, 100],
        size: 5,
        total: 0
      },
      // 任务对象列表
      objTableData: [], // 整体数据
      // 当前table显示的数据
      tableData: [],
      // 选中行
      multipleSelection: [],
      // 当前标准件是否需要必填任务对象
      isMustObject: false,
      // 当前标准件是否可以手动下发
      isManual: true,
      // 是否展示数据抽取操作按钮
      showDataExtractBtn: false
    };
  },
  watch: {
    ishaveItem: {
      handler(val) {
        // 如果没有表单，则默认无任务对象
        if (val === '0') {
          this.ishaveObject = '1';
          // 获取无表单的表单数据
          this.handleNoForm();
        } else {
          this.ishaveObject = '1';
          this.formTableData = [];
        }
      },
      immediate: true
    },
    ishaveObject: {
      handler(val) {
        // 如果没有任务对象，则默认不进行自动匹配
        if (val === '0') {
          this.isautoBoolean = false;
        }
      },
      immediate: true
    }
  },
  methods: {
    // 选择表单
    handleSelectForm() {
      this.$refs.formSelectRef.visible = true;
      this.$refs.formSelectRef.beforeLoadForm();
    },
    // 选择表单-回调
    handleSelectFormBack(val) {
      let _this = this;

      // 由于是动态表格，所以要手动控制下表格重新渲染，否则不变
      if (_this.$refs.DynamicTableRef) {
        _this.$refs.DynamicTableRef.showTable = false;
        _this.$nextTick(() => {
          _this.$refs.DynamicTableRef.showTable = true;
        });
      }
      // 重新选择了表单，则需要将旧的任务对象删除
      _this.objTableData = [];
      _this.pageOptions.current = 1;
      _this.loadList();

      // 重新选择了表单，如果数据抽取页面之前填过值，则需要进行清空重置
      if (_this.$refs.extractRef) {
        _this.$refs.extractRef.resetForm();
      }

      _this.formTableData = [JSON.parse(JSON.stringify(val))];
      // 需要调用下表单详情，获取有没有表单对象等
      _this.formDataLoading = true;
      // 参数
      let dataParams = {
        id: _this.formTableData[0].vo.formId
      };
      _this.formId = _this.formTableData[0].vo.formId;
      // Lambda写法
      getFormDetail(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            // 赋值表单详情数据
            _this.rwForm = data.rwForm || {};
            _this.rwFormItemConfigList = data.rwFormItemConfigList || [];
            _this.rwFormItemList = data.rwFormItemList || [];
            _this.rwNformObjectList = data.rwNformObjectList || [];
            _this.isMustObject = !!(data.rwForm.isMustObject === '1');
            _this.ishaveObject = '1';

            // 判断当前表单是否可以手动添加数据（添加数据、导入）
            _this.isManual = !!(data.rwForm.isManual === '1');

            _this.showDataExtractBtn = !!data.rwForm.etlTableName;
            // 如果该表单配置了数据抽取列名，则该表单可抽取，将表单配置里的默认参数和自定义参数进行整理，动态渲染
            if (_this.showDataExtractBtn) {
              console.log('_this.rwForm', JSON.parse(_this.rwForm.formConfig));
              let formConfig = JSON.parse(_this.rwForm.formConfig);
              let customParams = formConfig.customParams;
              let defaultParams = formConfig.defaultParams;
              console.log('defaultParams', defaultParams);
              console.log('customParams', customParams);
              _this.$refs.extractRef.defaultParams = defaultParams;
              _this.$refs.extractRef.customParams = customParams;
              // _this.$refs.extractRef.beforeLoadForm();
            }
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.formDataLoading = false;
        });
    },
    // 预览表单
    handlePreview(index, row) {
      this.$refs.perviewRef.visible = true;
      this.$refs.perviewRef.row = row;
      this.$refs.perviewRef.beforeLoadForm();
    },

    // 抽取数据并导入
    handleExtractData() {
      this.$refs.extractRef.visible = true;
      this.$refs.extractRef.row = {
        formId: this.formTableData[0].vo.formId,
        etlType: this.formTableData[0].vo.etlType,
        etlYwlb: this.rwForm.etlYwlb
      };
      this.$refs.extractRef.beforeLoadForm();
    },
    //  抽取数据并导入-回调
    handleExtractDataBack(data) {
      // 这里做下数据的过滤，用新进来的数据和旧数据进行比对
      let addData = JSON.parse(JSON.stringify(data)).map((item) => {
        this.$set(item, 'id', this.$utilStr.uuid(32));
        return item;
      });

      // 初始化统计计数器
      let totalExtracted = addData.length;
      let totalImported = 0;
      let totalDuplicated = 0;

      // 过滤掉已经存在于现有数据中的项（根据 'wybs' 字段进行比较）
      let filteredData = addData.filter((newItem) => {
        if (!newItem.wybs) {
          // 如果新数据项没有 'wybs' 字段，直接保留并计入导入计数
          totalImported++;
          return true;
        }
        // 如果新数据项有 'wybs' 字段，检查是否存在于现有数据中
        const isDuplicate = this.objTableData.some(
          (existingItem) => existingItem.wybs === newItem.wybs
        );
        if (isDuplicate) {
          totalDuplicated++;
          return false;
        } else {
          totalImported++;
          return true;
        }
      });

      // 显示统计提示信息
      this.$message({
        showClose: true,
        customClass: 'extract-msg',
        duration: 2000,
        dangerouslyUseHTMLString: true,
        iconClass: 'message-icon',
        type: 'success',
        message: `
      <div class="extract-content">
      <div class="total-result">抽取结果</div>
        <div class="total-extracted">抽取： <span class="count">【${totalExtracted}】</span>条</div>
        <div class="total-imported">导入： <span class="count">【${totalImported}】</span>条</div>
        <div class="total-duplicated">重复： <span class="count">【${totalDuplicated}】</span>条</div>
      </div>
    `
      });

      this.objTableData = filteredData.concat(this.objTableData);
      this.pageOptions.current = 1;
      this.loadList();
    },

    // 添加字段
    handleAddField() {
      this.$message({
        showClose: true,
        customClass: 'is-fixed',
        message: '正在建设中...',
        type: 'success'
      });
    },
    // 编辑字段
    handleEditField() {
      this.$message({
        showClose: true,
        customClass: 'is-fixed',
        message: '正在建设中...',
        type: 'success'
      });
    },
    // 删除字段
    handleDeleteField() {
      this.$message({
        showClose: true,
        customClass: 'is-fixed',
        message: '正在建设中...',
        type: 'success'
      });
    },
    // 添加数据
    handleAddRow() {
      let objItem = {
        id: this.$utilStr.uuid(32)
      };
      this.objTableData.unshift(objItem);
      this.pageOptions.current = 1;
      this.loadList();
    },
    // 全部删除
    handleClearData() {
      let _this = this;
      _this
        .$confirm('确定要把任务对象全部删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          _this.objTableData = [];
          _this.pageOptions.current = 1;
          _this.loadList();
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        });
    },
    // 删除数据
    handleDeleteRow(index, val) {
      let pIndex = this.objTableData.findIndex((item) => item.id === val.id);
      let isLast = pIndex === this.objTableData.length - 1;
      this.objTableData.splice(pIndex, 1);
      if (index === 0 && isLast) {
        this.pageOptions.current =
          this.pageOptions.current - 1 > 0 ? this.pageOptions.current - 1 : 1;
      }
      this.loadList();
    },
    // 动态表格数据处理 - 更新table可展示的数据
    loadList() {
      let _this = this;
      _this.pageOptions.total = _this.objTableData.length;
      _this.tableData = _this.paginateArray();
      // _this.$nextTick(() => {
      //   if (
      //     _this.$refs.DynamicTableRef &&
      //     _this.$refs.DynamicTableRef.$refs.tableRef
      //   )
      //     _this.$refs.DynamicTableRef.$refs.tableRef.doLayout();
      // });
    },
    // 分页查询
    paginateArray() {
      const startIndex = (this.pageOptions.current - 1) * this.pageOptions.size;
      const endIndex = startIndex + this.pageOptions.size;

      return this.objTableData.slice(startIndex, endIndex);
    },

    // 下载模板
    handleDownload() {
      /*      this.$message({
        showClose: true,
        customClass: 'is-fixed',
        message: '正在建设中...',
        type: 'success'
      });*/
      // let _this = this;
      // _this.downloading = true;
      // if("000" === this.formId){
      //   this.$utilFile.downloadFile(
      //     this.importWbdTemplate.url,
      //     this.importWbdTemplate.value.replace(/(^\s*)|(\s*$)/g, '')
      //   );
      // }else{
      //   this.$utilFile.downloadFile(
      //     this.importTemplate.url,
      //     this.importTemplate.value.replace(/(^\s*)|(\s*$)/g, '')
      //   );
      // }
      // _this.downloading = false;
      let _this = this;
      _this.downloading = true;
      // 模板数据
      const data = [
        _this.rwNformObjectList
          .filter((e) => e.isShow === '1')
          .map((item) => {
            return item.label;
          })
      ];
      // 创建工作簿和工作表
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      // 生成Excel文件
      XLSX.writeFile(wb, _this.formTableData[0].vo.formTitle + '模板.xlsx');
      _this.downloading = false;
    },
    // 导入模板
    handleImport() {
      let _this = this;
      _this.uploading = true;
      _this.loading = true;
      _this.loadingText = '正在导入请稍等';
      // 参数
      let formData = new FormData();
      formData.append('file', _this.importData.file);
      formData.append('formId', _this.formTableData[0].vo.formId);
      // 遍历数组对象，并添加到FormData中
      _this.rwNformObjectList.forEach((item, index) => {
        formData.append(`rwNformObjectList[${index}].prop`, item.prop);
        formData.append(`rwNformObjectList[${index}].label`, item.label);
      });
      // 动态导入
      rwTrendsExcelImport(formData)
        .then((response) => {
          // 有错误数据，后端返回了excel，则下载
          if (response.headers['content-disposition']) {
            _this.download(response);
          }
          let { success, data } = response.data;
          if (success) {
            _this.handleExtractDataBack(data);
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.uploading = false;
          _this.loading = false;
          _this.loadingText = '请稍等';
        });
      // //无表单导入
      // if("000" ===    _this.formId){
      //   // Lambda写法
      //   rwWbdExcelImport(formData)
      //     .then((response) => {
      //       // 有错误数据，后端返回了excel，则下载
      //       if (response.headers['content-disposition']) {
      //         _this.download(response);
      //       }
      //       let { success, data } = response.data;
      //       if (success) {
      //         _this.handleExtractDataBack(data);
      //         _this.$message({
      //           showClose: true,
      //           customClass: 'is-fixed',
      //           message: '导入成功',
      //           type: 'success'
      //         });
      //       }
      //     })
      //     .catch((error) => {
      //       // 响应错误回调
      //       console.error(error);
      //     })
      //     .finally(() => {
      //       _this.uploading = false;
      //       _this.loading = false;
      //       _this.loadingText = '请稍等';
      //     });
      // }
      // else{
      //   // Lambda写法
      //   excelRwObjectImport(formData)
      //     .then((response) => {
      //       // 有错误数据，后端返回了excel，则下载
      //       if (response.headers['content-disposition']) {
      //         _this.download(response);
      //       }
      //       let { success, data } = response.data;
      //       if (success) {
      //         _this.handleExtractDataBack(data);
      //         _this.$message({
      //           showClose: true,
      //           customClass: 'is-fixed',
      //           message: '导入成功',
      //           type: 'success'
      //         });
      //       }
      //     })
      //     .catch((error) => {
      //       // 响应错误回调
      //       console.error(error);
      //     })
      //     .finally(() => {
      //       _this.uploading = false;
      //       _this.loading = false;
      //       _this.loadingText = '请稍等';
      //     });
      // }
    },

    // 重置
    resetForm() {
      this.ishaveItem = '1';
      this.ishaveObject = '1';
      this.isManual = true;
      this.isMustObject = false;
      this.isautoBoolean = false;
      this.formTableData = [];
      this.rwForm = {};
      this.rwFormItemConfigList = [];
      this.rwFormItemList = [];
      this.rwNformObjectList = [];
      this.objTableData = [];
      this.pageOptions.current = 1;
      this.loadList();
      this.multipleSelection = [];
    },
    // 获取无表单的表单数据
    handleNoForm() {
      let _this = this;
      _this.formId = '000';
      _this.formDataLoading = true;
      // 参数
      let dataParams = {
        formId: '000',
        current: 1,
        size: 10
      };
      // Lambda写法
      getFormPage(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.formTableData = data.records;
            _this.handleSelectFormBack(data.records[0]);
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.formDataLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.con-single-step {
  width: 100%;
  height: 100%;
  .con-empty-form {
    color: #878d99;
    text-align: center;
    font-size: 16px;
  }
  .con-empty-task-table {
    color: #878d99;
    border-bottom: 1px solid #cfd6e4;
    border-left: 1px solid #cfd6e4;
    border-right: 1px solid #cfd6e4;
    height: 40px;
    a {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 15px;
      &:hover {
        color: #409eff;
      }
    }
  }
  .con-empty-task-object {
    color: #878d99;
    text-align: center;
    font-size: 16px;
  }

  .new-table-obj {
    ::v-deep .el-table__header {
      th {
        padding: 0 !important;
        .header-commo {
          padding: 0 !important;
        }
        .con-dynamic-table-head {
          width: 100%;
          height: 100%;
          min-height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          line-height: inherit;
          position: relative;
          .con-dynamic-table-head-operate {
            position: absolute;
            right: 0;
            height: 40px;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            a {
              height: 20px;
            }
          }
        }
      }
    }
    ::v-deep .el-table__body {
      // 输入框
      .el-input__inner {
        background-color: #fff;
        border-color: #cfd6e4;
      }
      .con-dynamic-table-data {
        position: relative;
        &.required {
          &:before {
            content: '*';
            position: absolute;
            left: -7px;
            color: #ff0b00;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.extract-msg {
  min-width: 200px;
  top: 30% !important;
  padding: 4px 16px;
  background-color: rgb(238, 250, 251) !important;
  &.el-message.is-closable .el-message__content {
    padding-right: 0;
  }
  .extract-content {
    width: 168px;
  }
  .el-message__closeBtn {
    position: absolute;
    top: 16px;
    right: 10px;
  }
  .total-result {
    margin-bottom: 10px;
    padding: 6px 0;
    font-size: 16px;
    // font-weight: bold;
    letter-spacing: 2px;
    color: #575151;
    border-bottom: 1px solid #cdc8c8;
  }
  .total-extracted {
    color: #3292e4;
    margin-bottom: 15px;
  }

  .total-imported {
    color: #5fb878;
    margin-bottom: 15px;
  }
  .total-duplicated {
    margin-bottom: 10px;
    color: #ff0b00;
  }
  .count {
    font-weight: bold;
  }
}
</style>
