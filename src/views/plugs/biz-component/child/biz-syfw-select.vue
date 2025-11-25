<template>
  <div class="hdty-container hdty-flex" style="min-height: 600px;">
    <div class="hdty-header">
      <el-form
        :inline="true"
        :model="queryData"
        :rules="rules"
        ref="queryRef"
        size="small"
        @submit.native.prevent
        @keyup.enter.native="handleQuery"
      >
        <hd-component :model="factorData" ref="componentRef">
          <hd-expand>
            <hd-expand-header>
              <el-form-item label="房屋状态" prop="fwzt">
                <hd-dict-radio
                  v-model="queryData.fwzt"
                  :dict-code="$global.dictType.fwzt"
                  show-all-button
                ></hd-dict-radio>
              </el-form-item>
              <el-form-item prop="andor" slot="after">
                <hd-factor-logic v-model="queryData.andor"></hd-factor-logic>
              </el-form-item>
              <el-form-item prop="sjgsdwdm" slot="after">
                <hd-organ v-model="queryData.sjgsdwdm" placeholder="高级过滤：请选择管辖机构"></hd-organ>
              </el-form-item>
            </hd-expand-header>
            <hd-expand-body>
              <el-row>
                <el-form-item label="房主姓名" prop="xm">
                  <hd-factor-input
                    prop="xmFilterFactor"
                    fuzzy="between"
                    v-model="queryData.xm"
                    :model-control.sync="factorData.xmFilterFactor"
                    placeholder="请输入房主姓名"
                  ></hd-factor-input>
                </el-form-item>
                <el-form-item label="房主身份证号" prop="gmsfhm">
                  <hd-factor-input
                    prop="gmsfhmFilterFactor"
                    fuzzy="between"
                    v-model="queryData.gmsfhm"
                    :model-control.sync="factorData.gmsfhmFilterFactor"
                    placeholder="请输入房主身份证号"
                  ></hd-factor-input>
                </el-form-item>
              </el-row>
            </hd-expand-body>
          </hd-expand>
        </hd-component>
      </el-form>
      <div class="hdty-btn-group">
        <el-button type="info" v-preventReClick icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-delete" @click="handleClear">清空</el-button>
      </div>
    </div>
    <div class="hdty-fit">
      <el-table
        ref="tableRef"
        row-key="id"
        v-loading="loading"
        :data="tableData"
        @sort-change="handleSortChange"
        border
        fit
        height="100%"
      >
        <el-table-column fixed label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleChecked(scope.$index, scope.row)">选择</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="vo.szdxz" label="房屋地址" header-align="center" width="300" fixed>
          <template slot-scope="scope">
            <span
              class="hdty-main-color"
              style="cursor: pointer"
              title="查看详情"
            >{{scope.row.vo.szdxz}}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="vo.xm"
          label="房主姓名"
          header-align="center"
          width="180"
          fixed
        ></el-table-column>
        <el-table-column prop="vo.gmsfhm" label="房主身份证号" header-align="center" width="185"></el-table-column>
        <el-table-column prop="vo.lxdh" label="房主联系电话" header-align="center" width="120"></el-table-column>
        <el-table-column
          prop="vox.fwxz"
          label="房屋性质"
          sortable="custom"
          header-align="center"
          width="130"
        ></el-table-column>
        <el-table-column
          prop="vox.fwlx"
          label="房屋类型"
          sortable="custom"
          header-align="center"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="vox.fwzt"
          label="房屋状态"
          sortable="custom"
          header-align="center"
          width="110"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="vo.czrxm"
          label="操作人"
          sortable="custom"
          header-align="center"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="vo.czsj"
          label="更新时间"
          sortable="custom"
          header-align="center"
          min-width="200"
        >
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span v-html="formatDatetime(scope.row.vo.czsj)"></span>
          </template>
        </el-table-column>
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
</template>
<script>
import { hdComponent, hdForm, hdList, hdMethod } from '@/utils/util-framework';
import { syfwpage } from './api';
export default {
  name: 'BizSyfwSelect',
  provide() {
    return {
      BizSyfwSelect: this
    };
  },
  mixins: [hdComponent, hdList, hdForm, hdMethod],
  props: {
    prop: String
  },
  data() {
    return {
      // 查询
      queryData: {
        zhhqrq: [],
        szdxz: '',
        xm: '',
        czrXm: '',
        czrGmsfhm: '',
        gmsfhm: '',
        fwyt: [],
        fwxz: [],
        fwlx: [],
        fwzt: '1',
        iszdgz: '',
        zxbs: '0',
        cjsj: [],
        czsj: [],
        zxsj: [],
        sjgsdwdm: '',
        dzbm: '',
        dzwz: '',
        andor: this.$app.factorOptions.logicOpe.and
      },
      // 查询条件
      factorData: {
        szdxzFilterFactor: this.$app.factorOptions.matchOpe.between,
        xmFilterFactor: this.$app.factorOptions.matchOpe.between,
        gmsfhmFilterFactor: '',
        czrXmFilterFactor: this.$app.factorOptions.matchOpe.between,
        czrGmsfhmFilterFactor: ''
      },
      // 验证
      rules: {},
      // 表格数据
      tableData: []
    };
  },
  mounted() {
    let _this = this;
    _this.queryData.orgId =
      _this.$utilPublic.getUserOrgId().substring(0, 8) + '0000';
    _this.loadList();
  },
  methods: {
    // 获取数据列表
    loadList() {
      let _this = this;
      _this.loading = true;
      // 参数
      let dataParams = {
        ..._this.queryData,
        ..._this.factorData,
        ..._this.pageOptions
      };
      syfwpage(dataParams)
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
          _this.$refs.tableRef.doLayout();
          _this.loading = false;
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
      this.$refs.componentRef.resetFields();
    },
    // 单选
    handleChecked(index, row) {
      this.visible = false;
      this.input = row.vo.xm;
      this.$emit('input', row.vo.id); //触发 input 事件，并传入新值
      this.$emit('update:modelText', row.vo.xm);
      this.$emit('currentChanged', row.vo);
      this.triggerValidateField();
    },
    // 取消
    cancelForm() {
      this.visible = false;
    }
  }
};
</script>

<style scoped>
</style>
