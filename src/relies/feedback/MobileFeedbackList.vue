<template>
  <div class="hdty-container hdty-flex">
    <div class="hdty-header">
      <el-form
        :model="queryData"
        :rules="rules"
        ref="queryRef"
        inline
        @submit.native.prevent
        @keyup.enter.native="handleQuery">
        <hd-component
          :model="factorData"
          ref="componentRef">
          <hd-query>
            <hd-query-fixed>
              <el-form-item label="反馈类型" prop="type">
                <hd-dict-select v-model="queryData.type"
                  :dict-code="$global.dictType.feedbackType"
                  placeholder="请选择反馈类型"
                  filterable></hd-dict-select>
              </el-form-item>
              <el-form-item label="应用版本" prop="version">
                <hd-factor-input v-model="queryData.version"
                 prop="versionFilterFactor"
                 fuzzy="between"
                 :model-control.sync="factorData.versionFilterFactor"
                 :modelControl="factorData.versionFilterFactor"
                 placeholder="请输入应用版本"
                 maxlength="10"></hd-factor-input>
              </el-form-item>
              <el-form-item label="反馈内容" prop="content">
                <hd-factor-input v-model="queryData.content"
                 prop="versionFilterFactor"
                 fuzzy="between"
                 :model-control.sync="factorData.contentFilterFactor"
                 :modelControl="factorData.contentFilterFactor"
                 placeholder="请输入反馈内容"
                 maxlength="100"></hd-factor-input>
              </el-form-item>
            </hd-query-fixed>
            <hd-query-expand>
              <el-row>
                <el-form-item label="反 馈 人" prop="createUsername">
                  <hd-factor-input v-model="queryData.createUsername"
                   prop="createUsernameFilterFactor"
                   fuzzy="between"
                   :model-control.sync="factorData.createUsernameFilterFactor"
                   :modelControl="factorData.createUsernameFilterFactor"
                   placeholder="请输入反馈人"
                   maxlength="30"></hd-factor-input>
                </el-form-item>
                <el-form-item label="反馈时间" prop="createTime">
                  <hd-date-picker type="datetimerange" v-model="queryData.createTime"></hd-date-picker>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="设备型号" prop="deviceModel">
                  <hd-factor-input v-model="queryData.deviceModel"
                   prop="deviceModelFilterFactor"
                   fuzzy="between"
                   :model-control.sync="factorData.deviceModelFilterFactor"
                   :modelControl="factorData.deviceModelFilterFactor"
                   placeholder="请输入设备型号"
                   maxlength="20"></hd-factor-input>
                </el-form-item>
                <el-form-item label="设备品牌" prop="deviceBrand">
                  <hd-factor-input v-model="queryData.deviceBrand"
                   prop="deviceBrandFilterFactor"
                   fuzzy="between"
                   :model-control.sync="factorData.deviceBrandFilterFactor"
                   :modelControl="factorData.deviceBrandFilterFactor"
                   placeholder="请输入设备品牌"
                   maxlength="10"></hd-factor-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="是否处理" prop="isDeal">
                  <hd-dict-radio v-model="queryData.isDeal" :dict-code="$global.dictType.isOrNot"></hd-dict-radio>
                </el-form-item>
                <el-form-item label="处理人" prop="dealUsername">
                  <hd-factor-input v-model="queryData.dealUsername"
                   prop="dealUsernameFilterFactor"
                   fuzzy="between"
                   :model-control.sync="factorData.dealUsernameFilterFactor"
                   :modelControl="factorData.dealUsernameFilterFactor"
                   placeholder="请输入处理人"
                   maxlength="30"></hd-factor-input>
                </el-form-item>
              </el-row>
            </hd-query-expand>
          </hd-query>
        </hd-component>
      </el-form>
      <!-- 新写法-->
      <hd-button-container>
        <hd-button
          name="query"
          type="info"
          icon="el-icon-search"
          @click="handleQuery">
          查询
        </hd-button>
        <hd-button
          icon="el-icon-delete"
          @click="handleClear">
          清空
        </hd-button>
      </hd-button-container>
    </div>
    <div class="hdty-fit">
      <el-table
        :data="tableData"
        :empty-text="emptyText"
        row-key="vo.id"
        ref="tableRef"
        v-loading="loading"
        @sort-change="handleSortChange"
        border
        fit
        height="100%">
        <el-table-column
          fixed
          sortable="custom"
          type="index"
          label="序号"
          :index="setIndex"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          fixed
          label="操作"
          align="center"
          width="150">
          <template slot-scope="scope">
            <hd-button-container>
              <hd-button
                name="detail"
                type="success"
                @click="handleDetail(scope.$index, scope.row)">
                详情
              </hd-button>
              <hd-button
                name="edit"
                type="primary"
                :title="scope.row.vo.isDeal === '1' ? '已处理' : ''"
                :disabled="scope.row.vo.isDeal === '1'"
                @click="handleEdit(scope.$index, scope.row)">
                处理
              </hd-button>
            </hd-button-container>
          </template>
        </el-table-column>
        <el-table-column
          prop="vox.type"
          label="反馈类型"
          sortable="custom"
          header-align="center"
          width="110">
        </el-table-column>
        <el-table-column
          prop="vo.version"
          label="应用版本"
          sortable="custom"
          header-align="center"
          width="130">
        </el-table-column>
        <el-table-column
          prop="vo.content"
          label="反馈内容"
          sortable="custom"
          header-align="center"
          show-overflow-tooltip
          min-width="260">
        </el-table-column>
        <el-table-column
          prop="vo.telephone"
          label="填写联系方式"
          sortable="custom"
          header-align="center"
          width="140">
        </el-table-column>
        <el-table-column
          prop="vox.isDeal"
          label="是否处理"
          sortable="custom"
          header-align="center"
          width="110">
        </el-table-column>
        <el-table-column
          prop="vo.dealUsername"
          label="处理人姓名"
          sortable="custom"
          header-align="center"
          width="130">
        </el-table-column>
        <el-table-column
          prop="vo.dealTime"
          label="处理时间"
          sortable="custom"
          header-align="center"
          width="180">
          <template slot-scope="scope">
            <i class="el-icon-time" v-if="scope.row.vo.dealTime"></i>
            {{ $utilDate.dateFtt(scope.row.vo.dealTime, 'yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.createUsername"
          label="反馈人姓名"
          sortable="custom"
          header-align="center"
          width="130">
        </el-table-column>
        <el-table-column
          prop="vo.createTime"
          label="反馈时间"
          sortable="custom"
          header-align="center"
          width="180">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            {{ $utilDate.dateFtt(scope.row.vo.createTime, 'yyyy-MM-dd HH:mm:ss') }}
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
    <mobile-feedback-detail ref="detailRef"></mobile-feedback-detail>
    <mobile-feedback-edit ref="editRef"></mobile-feedback-edit>
  </div>
</template>

<script>
import {hdList} from '@/utils/util-framework';
import {page} from '@/api/feedback';
import MobileFeedbackDetail from './MobileFeedbackDetail';
import MobileFeedbackEdit from './MobileFeedbackEdit';

export default {
  name: "MobileFeedbackList",
  provide() {
    return {
      hdList: this
    };
  },
  mixins: [hdList],
  components: {
    MobileFeedbackDetail,
    MobileFeedbackEdit
  },
  data() {
    return {
      // 查询
      queryData: {
        type: '',
        version: '',
        content: '',
        telephone: '',
        deviceModel: '',
        deviceBrand: '',
        createUsername: '',
        dealUsername: '',
        createTime: [],
        isDeal: '0',
        andor:this.$app.factorOptions.logicOpe.and
      },
      // 查询条件
      factorData: {
        versionFilterFactor:this.$app.factorOptions.matchOpe.between,
        contentFilterFactor:this.$app.factorOptions.matchOpe.between,
        telephoneFilterFactor:this.$app.factorOptions.matchOpe.between,
        deviceModelFilterFactor:this.$app.factorOptions.matchOpe.between,
        deviceBrandFilterFactor:this.$app.factorOptions.matchOpe.between,
        createUsernameFilterFactor:this.$app.factorOptions.matchOpe.between,
        dealUsernameFilterFactor:this.$app.factorOptions.matchOpe.between,
      },
      // 表格
      tableData: [],
      // 验证
      rules:{}
    }
  },
  mounted() {
    // 加载数据表格
    this.loadList();
  },
  methods: {
    // 加载数据表格
    loadList() {
      let _this = this;
      if (_this.AUTHORITY_QUERY) {
        _this.loading = true;
        // 参数
        let dataParams = {
          ..._this.factorData,
          ..._this.queryData,
          ..._this.pageOptions
        };
        // Lambda写法
        page(dataParams).then(response => {
          //响应成功回调
          let {success, data} = response.data;
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
      }
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
    // 详情
    handleDetail(index, row) {
      this.$refs.detailRef.visible = true;
      this.$refs.detailRef.row = row;
      this.$refs.detailRef.beforeLoadForm();
    },
    // 编辑
    handleEdit(index, row) {
      this.$refs.editRef.visible = true;
      this.$refs.editRef.row = row;
      this.$refs.editRef.beforeLoadForm();
    },
  }
}
</script>
