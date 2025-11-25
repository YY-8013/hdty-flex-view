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
              @keyup.enter.native="handleQuery"
            >
              <hd-component :model="factorData" ref="componentRef">
                <hd-expand>
                  <!--<hd-expand-header>-->
                  <el-form-item label="街路巷(小区)名称" prop="jlxxqmcQc">
                    <el-input v-model="queryData.jlxxqmcQc" placeholder="请输入街路巷(小区)名称"></el-input>
                  </el-form-item>
                  <el-form-item
                    label="管辖机构"
                    prop="sjgsdwdm"
                    v-if="$utilPublic.getUserOrgLevel() <= 5"
                  >
                    <hd-organ
                      v-model="queryData.sjgsdwdm"
                      :model-text.sync="sjgsdwdmName"
                      :filterOrg="currentFilterOrg"
                      placeholder="请选择管辖机构"
                    ></hd-organ>
                  </el-form-item>
                  <el-form-item label="街路巷(小区)类型" prop="dzyslxdm" v-if="showJlxlx">
                    <hd-dict-select
                      v-model="queryData.dzyslxdm"
                      :dictCode="$global.dictType.addressType"
                      multiple
                      :currentValue="queryData.dzyslxdm"
                      :visible-option="['41','42','43','44','45']"
                      showMultiButton
                      filterable
                      placeholder="请选择查询条件"
                    ></hd-dict-select>
                  </el-form-item>
                  <!--</hd-expand-header>-->
                  <!--<hd-expand-body>-->
                  <!--</hd-expand-body>-->
                </hd-expand>
              </hd-component>
            </el-form>
            <div class="hdty-btn-group">
              <el-button type="info" v-preventReClick icon="el-icon-search" @click="handleQuery">查询</el-button>
              <el-button siza="small" icon="el-icon-delete" @click="handleClear">清空</el-button>
              <!-- <el-button
                v-if="showAddBtn"
                type="success"
                icon="el-icon-circle-plus-outline"
                @click="handleAdd"
              >新增</el-button>-->
            </div>
          </div>
          <div class="hdty-fit">
            <el-table
              ref="tableRef"
              row-key="vo.dzbm"
              v-loading="triggerLoading"
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
              <el-table-column label="操作" align="center" width="80">
                <template slot-scope="scope">
                  <el-button type="primary" @click="handleChecked(scope.$index, scope.row)">选择</el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="vo.jlxxqmcQc"
                label="街路巷(小区)全称"
                sortable="custom"
                header-align="center"
                show-overflow-tooltip
                min-width="500"
              ></el-table-column>
              <el-table-column
                prop="vox.dzyslxdm"
                label="街路巷(小区)类型"
                sortable="custom"
                header-align="center"
                min-width="200"
              ></el-table-column>
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
          <!-- <bzdz-jlxxqxx-add ref="addRef"></bzdz-jlxxqxx-add> -->
        </div>
      </hd-pane>
      <span slot="footer" class="hdty-dialog-footer">
        <el-button @click="cancelForm">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { hdComponent, hdForm, hdList, hdMethod } from '@/utils/util-framework';
import { listPage } from './api';
// import BzdzJlxxqxxAdd from "../../police-network/ybss/jlxxqxx/BzdzJlxxqxxAdd.vue";

export default {
  name: 'index',
  provide() {
    return {
      hdList: this
    };
  },
  components: {
    // BzdzJlxxqxxAdd
  },
  mixins: [hdComponent, hdList, hdForm, hdMethod],
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
    // 输入框图标
    suffixIcon: {
      type: String,
      default: 'el-icon-more'
    },
    // 显示新增按钮
    showAddBtn: {
      type: Boolean,
      default: true
    },
    // 默认查询机构
    currentSjgsdwdm: {
      type: String,
      default: ''
    },
    // 默认查询机构名称
    currentSjgsdwdmName: {
      type: String,
      default: ''
    },
    // 查询条件机构过滤
    currentFilterOrg: {
      type: String,
      default: ''
    },
    // 街路巷类型
    jlxlx: {
      type: String,
      default: ''
    },
    // 显示街路巷类型
    showJlxlx: {
      type: Boolean,
      default: true
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
        zxbs: '0',
        jlxxqmcQc: '',
        dzyslxdm: [],
        sjgsdwdm: ''
      },
      // 查询条件
      factorData: {
        jlxxqmcQcFilterFactor: 'like'
      },
      // 验证
      rules: {},
      // 默认查询机构名称
      sjgsdwdmName: '',
      // 表格数据
      tableData: [],
      triggerLoading: false
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
    },
    currentSjgsdwdm: {
      handler(val) {
        if (val) {
          this.queryData.sjgsdwdm = val;
        }
      },
      immediate: true
    },
    currentSjgsdwdmName: {
      handler(val) {
        if (val) {
          this.sjgsdwdmName = val;
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
      _this.$emit('currentOpening', _this);
      _this.loadList();
    },
    // 获取数据列表
    loadList() {
      let _this = this;
      _this.triggerLoading = true;
      if (_this.jlxlx) {
        _this.queryData.dzyslxdm = [_this.jlxlx];
      }
      // 参数
      let dataParams = {
        ssxqbm: _this.orgId,
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
          _this.triggerLoading = false;
        });
    },
    handleAdd() {
      // this.$refs.addRef.visible = true;
      // this.$refs.addRef.beforeLoadForm();
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
      this.$refs.componentRef.resetFields();
      if (this.currentSjgsdwdm) this.queryData.sjgsdwdm = this.currentSjgsdwdm;
      if (this.currentSjgsdwdmName)
        this.sjgsdwdmName = this.currentSjgsdwdmName;
    },
    // input清空
    handleInputClear() {
      this.$emit('input', '');
      this.$emit('update:modelText', '');
      this.$emit('currentChanged', []);
      this.triggerValidateField();
    },
    // 单选
    handleChecked(index, row) {
      this.visible = false;
      if (this.resultType === 'id') {
        // 值为 dm，显示为 dm
        this.input = row.vo.dzbm;
        this.$emit('input', row.vo.dzbm);
        this.$emit('update:modelText', row.vo.dzbm);
      } else if (this.resultType === 'idAndName') {
        // 值为 dm，显示为 name
        this.input = row.vo.jlxxqmc;
        this.$emit('input', row.vo.dzbm); //触发 input 事件，并传入新值
        this.$emit('update:modelText', row.vo.jlxxqmc);
      } else if (this.resultType === 'name') {
        // 值为 name，显示为 name
        this.input = row.vo.jlxxqmc;
        this.$emit('input', row.vo.jlxxqmc); //触发 input 事件，并传入新值
        this.$emit('update:modelText', row.vo.jlxxqmc);
      } else if (this.resultType === 'idAndQcName') {
        // 值为 dm，显示为 name
        this.input = row.vo.jlxxqmcQc;
        this.$emit('input', row.vo.dzbm); //触发 input 事件，并传入新值
        this.$emit('update:modelText', row.vo.jlxxqmcQc);
      }
      row.vo.jwh = row.vox.sssqjcwhDzbm;
      row.vo.xzjd = row.vox.ssxzjdDzbm;
      this.$emit('currentChanged', row.vo);
      this.triggerValidateField();
    },
    // 取消
    cancelForm() {
      this.visible = false;
    },
    // 重置
    resetForm() {
      this.pageOptions = {
        current: 1,
        sizes: [10, 20, 50, 100],
        size: 10,
        total: 0
      };
      this.queryData.jlxxqmc = '';
    }
  }
};
</script>

<style scoped>
</style>
