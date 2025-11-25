<template>
  <div>
    <el-input
      ref="inputRef"
      v-model="input"
      :placeholder="placeholder"
      :suffix-icon="suffixIcon"
      :disabled="disabled"
      :clearable="clearable"
      :underline="underline"
      :showAdd="showAdd"
      elip
      @focus="handleInputFocus"
      @clear="handleInputClear"
    ></el-input>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      custom-class="hdty-dialog-medium"
      append-to-body
    >
      <hd-pane>
        <div class="hdty-container hdty-flex">
          <div class="hdty-header">
            <el-form
              :inline="true"
              :model="queryData"
              :rules="rules"
              ref="queryRef"
              @submit.native.prevent
              @keyup.enter.native="handleQuery"
            >
              <el-form-item label="街路巷(小区)名称" prop="jlxMc">
                <el-input v-model="queryData.jlxMc" placeholder="请输入街路巷(小区)名称"></el-input>
              </el-form-item>
              <!--<el-form-item label="治安管理机构" prop="sjgsdwdm">-->
              <!--<hd-organ-->
              <!--prop="sjgsdwdm"-->
              <!--v-model="queryData.sjgsdwdm"-->
              <!--:filterOrg="this.$utilPublic.getUserInfo().orgId"-->
              <!--selectLevel="5"-->
              <!--:selectLastLevel="true"-->
              <!--placeholder="请选择治安管理机构"-->
              <!--&gt;</hd-organ>-->
              <!--</el-form-item>-->
            </el-form>
            <div class="hdty-btn-group">
              <el-button type="info" v-preventReClick icon="el-icon-search" @click="handleQuery">查询</el-button>
              <el-button siza="small" icon="el-icon-delete" @click="handleClear">清空</el-button>
              <!-- <el-button
                name="add"
                type="success"
                size="small"
                icon="el-icon-circle-plus-outline"
                :v-if="showAdd"
                @click="handleAdd"
              >新增</el-button>-->
            </div>
          </div>
          <div class="hdty-fit">
            <el-table
              ref="tableRef"
              row-key="companyId"
              v-loading="loading"
              :data="tableData"
              @sort-change="handleSortChange"
              border
              fit
              height="100%"
            >
              <el-table-column
                fixed
                sortable="custom"
                type="index"
                label="序号"
                :index="setIndex"
                align="center"
                width="50"
              ></el-table-column>
              <el-table-column fixed label="操作" align="center" width="100">
                <template slot-scope="scope">
                  <el-button type="primary" @click="handleChecked(scope.$index, scope.row)">选择</el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="vo.jlxMc"
                label="街路巷(小区)名称"
                sortable="custom"
                header-align="center"
                show-overflow-tooltip
                min-width="300"
              ></el-table-column>
              <el-table-column
                prop="vox.jlxLx"
                label="街路巷(小区)类型"
                sortable="custom"
                header-align="center"
                width="200"
              ></el-table-column>
              <!--<el-table-column-->
              <!--prop="vox.sjgsdwdm"-->
              <!--label="治安管理机构"-->
              <!--sortable="custom"-->
              <!--header-align="center">-->
              <!--</el-table-column>-->
            </el-table>
          </div>
          <div class="hdty-footer">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageOptions.current"
              :page-sizes="pageOptions.sizes"
              :page-size="pageOptions.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageOptions.total"
            ></el-pagination>
          </div>
        </div>
      </hd-pane>
      <span slot="footer" class="hdty-dialog-footer">
        <el-button @click="cancelForm">取 消</el-button>
      </span>
    </el-dialog>
    <!-- <streets-dic-add ref="addRef" :searchLx="searchLx" @reloadForm="reloadForm"></streets-dic-add> -->
  </div>
</template>

<script>
import { hdComponent, hdList, hdMethod } from '@/utils/util-framework';
import { listPage } from './api';
// import StreetsDicAdd from "@/views/police-network/ybss/streetsdic/StreetsDicAdd";

export default {
  name: 'index',
  components: {
    // StreetsDicAdd
  },
  mixins: [hdComponent, hdList, hdMethod],
  props: {
    prop: String,
    value: {
      type: [Number, String, Array],
      default: ''
    },
    // 返回内容的类型
    resultType: {
      type: [Number, String, Array],
      default: 'idAndName'
    },
    // 过滤机构
    orgId: {
      type: [Number, String, Array],
      default: ''
    },
    // 水印
    placeholder: {
      type: String,
      default: '请选择街路巷(小区)'
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 清空
    clearable: {
      type: Boolean,
      default: true
    },
    // 显示边框
    underline: {
      type: Boolean,
      default: true
    },
    // 绑定值文本
    modelText: {
      type: [String, Array],
      default: ''
    },
    // 会话标题
    title: {
      type: String,
      default: '选择街路巷(小区)'
    },
    // 地址类型 41 街路巷 42小区 43住宅院 44自然村
    searchLx: {
      type: Array,
      default: []
    },
    // 输入框图标
    suffixIcon: {
      type: String,
      default: 'el-icon-more'
    },
    showAdd: {
      type: Boolean,
      default: false
    },
    isSimple: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      // 显示Dialog
      visible: false,
      // 绑定值
      input: this.modelText,
      // 查询
      queryData: {
        jlxMc: '',
        zxbs: '0',
        jlxLx: [],
        isSimple: ''
      },
      // 查询条件
      factorData: {
        jlxMcFilterFactor: 'like'
      },
      // 验证
      rules: {},
      // 表格数据
      tableData: [],
      loading: false
    };
  },
  watch: {
    value: {
      handler(val) {
        if (!val || val.length < 1) {
          this.input = '';
        }
        this.pageOptions.current = 1;
      },
      immediate: true
    },
    modelText: {
      handler(val) {
        this.input = val;
      },
      immediate: true
    },
    visible: {
      handler(val) {
        if (!val) {
          this.resetForm();
        }
      },
      immediate: true
    }
  },
  methods: {
    // input获得焦点
    handleInputFocus() {
      let _this = this;
      _this.visible = true;
      _this.queryData.jlxLx = _this.searchLx;
      _this.queryData.isSimple = _this.isSimple;
      _this.loadList();
    },
    // 获取数据列表
    loadList() {
      let _this = this;
      _this.loading = true;
      // 参数
      let dataParams = {
        sjgsdwdm: _this.orgId,
        ..._this.queryData,
        ..._this.factorData,
        ..._this.pageOptions
      };
      listPage(dataParams)
        .then((response) => {
          //响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.pageOptions.total = data.total;
            _this.tableData = data.records;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.loading = false;
          _this.$refs.tableRef.doLayout();
        });
    },
    // 查询
    handleQuery() {
      let _this = this;
      _this.$refs.queryRef.validate((valid) => {
        if (valid) {
          _this.pageOptions.current = 1;
          _this.loadList();
        }
      });
    },
    // 清空
    handleClear() {
      this.$refs.queryRef.resetFields();
    },
    // input清空
    handleInputClear() {
      this.$emit('input', '');
      this.$emit('update:modelText', '');
      this.$emit('currentChanged', []);
      this.triggerValidate();
    },
    // 单选
    handleChecked(index, row) {
      this.visible = false;
      if (this.resultType === 'id') {
        // 值为 dm，显示为 dm
        this.input = row.vo.jlxBm;
        this.$emit('input', row.vo.jlxBm);
        this.$emit('update:modelText', row.vo.jlxBm);
      } else if (this.resultType === 'idAndName') {
        // 值为 dm，显示为 name
        this.input = row.vo.jlxMc;
        this.$emit('input', row.vo.jlxBm); //触发 input 事件，并传入新值
        this.$emit('update:modelText', row.vo.jlxMc);
      } else if (this.resultType === 'name') {
        // 值为 name，显示为 name
        this.input = row.vo.jlxMc;
        this.$emit('input', row.vo.jlxMc); //触发 input 事件，并传入新值
        this.$emit('update:modelText', row.vo.jlxMc);
      }
      this.$emit('currentChanged', row.vo);
      this.triggerValidate();
    },
    // 取消
    cancelForm() {
      this.visible = false;
    },
    // 触发校验
    triggerValidate() {
      let validateElement = this.queryComponentParent('ElForm', this);
      let validateFieldElement = this.queryComponentParent('ElFormItem', this);
      this.$nextTick(() => {
        validateElement.validateField(validateFieldElement.prop);
      });
    },
    // 重置
    resetForm() {
      this.pageOptions = {
        current: 1,
        sizes: [10, 20, 50, 100],
        size: 10,
        total: 0
      };
      this.queryData.jlxMc = '';
    },
    // 新增
    handleAdd() {
      // this.$refs.addRef.visible = true;
      // this.$refs.addRef.beforeLoadForm();
    },
    reloadForm() {
      this.resetForm();
      this.loadList();
    }
  }
};
</script>

<style scoped>
</style>
