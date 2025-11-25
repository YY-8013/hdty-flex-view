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
        @keyup.enter.native="handleQuery">
        <hd-component
          :model="factorData"
          ref="componentRef">
          <hd-expand>
            <hd-expand-header>
              <el-form-item label="民警姓名" prop="xm">
                <el-input v-model="queryData.xm" placeholder="请输入民警姓名"></el-input>
              </el-form-item>
              <el-form-item label="身份证号" prop="gmsfhm">
                <el-input v-model="queryData.gmsfhm" placeholder="请输入身份证号"></el-input>
              </el-form-item>
            </hd-expand-header>
            <hd-expand-body>
              <el-row>
                <el-form-item label="联系电话" prop="telephone">
                  <el-input v-model="queryData.telephone" placeholder="请输入联系电话"></el-input>
                </el-form-item>
                <el-form-item label="用 户 名" prop="username">
                  <el-input v-model="queryData.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="管辖机构" prop="orgId">
                  <hd-organ v-model="queryData.orgId" placeholder="请选择管辖机构"></hd-organ>
                </el-form-item>
                <el-form-item label="注册时间" prop="createTime">
                  <hd-date-picker
                    v-model="queryData.createTime"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="请输入开始时间"
                    end-placeholder="请输入结束时间"
                    value-format="yyyyMMddHHmmss"
                    align="right">
                  </hd-date-picker>
                </el-form-item>
              </el-row>
            </hd-expand-body>
          </hd-expand>
        </hd-component>
      </el-form>
      <div class="hdty-btn-group">
        <el-button
          type="info"
          v-preventReClick
          icon="el-icon-search"
          @click="handleQuery">
          查询
        </el-button>
        <el-button
          icon="el-icon-delete"
          @click="handleClear">
          清空
        </el-button>
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
        height="100%">
        <el-table-column
          fixed
          label="操作"
          align="center"
          width="100">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="handleChecked(scope.$index, scope.row)">
              选择
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.xm"
          label="民警姓名"
          sortable="custom"
          header-align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="vo.gmsfhm"
          label="身份证号"
          sortable="custom"
          header-align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="vo.telephone"
          label="联系电话"
          sortable="custom"
          header-align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="vo.username"
          label="用户名"
          sortable="custom"
          header-align="center"
          width="240">
        </el-table-column>
        <el-table-column
          prop="vox.orgId"
          label="管辖机构"
          sortable="custom"
          header-align="center"
          width="240">
        </el-table-column>
        <el-table-column
          prop="vo.createTime"
          label="注册时间"
          sortable="custom"
          header-align="center"
          min-width="180">
          <template slot-scope="scope">
            <span v-html="formatDatetime(scope.row.vo.createTime)"></span>
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
        :total="pageOptions.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import {hdComponent, hdForm, hdList, hdMethod} from "@/utils/util-framework";
import {getPageSelect} from './api';
export default {
  name: "BizMjSelect",
  provide() {
    return {
      BizMjSelect: this
    };
  },
  mixins: [hdComponent, hdList, hdForm, hdMethod],
  props: {
    prop: String,
  },
  data() {
    return {
      // 查询
      queryData: {
        xm: '',
        gmsfhm: '',
        telephone: '',
        username: '',
        orgId: '',
        sfglpcs: '1',
        createTime: [],
      },
      // 查询条件
      factorData: {},
      // 验证
      rules: {},
      // 表格数据
      tableData: [],
    }
  },
  mounted() {
    let _this = this;
    _this.queryData.orgId = _this.$utilPublic.getUserOrgId().substring(0,8) + '0000';
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
      getPageSelect(dataParams).then(response => {
        //响应成功回调
        let { success, data } = response.data;
        if (success) {
          _this.pageOptions.total = data.total;
          _this.tableData = data.records;
        }
      }).catch(error => {
        // 响应错误回调
        console.error(error);
      }).finally(() => {
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
    },
  }
}
</script>

<style scoped>

</style>
