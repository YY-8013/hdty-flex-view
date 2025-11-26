<template>
  <div class="hdty-container hdty-flex">
    <!-- 查询区域 -->
    <div class="hdty-header">
      <stat-query
        :query-fields="queryFields"
        @query="handleQuery"
        @reset="handleReset"
      />
    </div>

    <!-- 统计表格区域（个性化实现，不使用 DynamicTable） -->
    <div class="hdty-fit">
      <stat-table
        ref="statTable"
        :columns="columns"
        :data="statData"
        :loading="loading"
        @cell-click="handleCellClick"
      />
    </div>

    <!-- 分页区域 -->
    <div class="hdty-footer">
      <el-pagination
        :current-page="pagination.current"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>

    <!-- 明细数据弹窗 -->
    <detail-dialog
      :visible.sync="detailVisible"
      :form-id="currentFormId"
      :org-id="currentOrgId"
      :column-prop="currentColumnProp"
      @refresh="refreshStatData"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import StatQuery from "./components/StatQuery.vue";
import StatTable from "./components/StatTable.vue";
import DetailDialog from "./components/DetailDialog.vue";

export default {
  name: "FlexViewStatPage",
  components: {
    StatQuery,
    StatTable,
    DetailDialog
  },
  data() {
    return {
      statData: [],
      loading: false,
      pagination: {
        current: 1,
        pageSize: 50,
        total: 0
      },
      queryParams: {},
      detailVisible: false,
      currentFormId: null,
      currentOrgId: null,
      currentColumnProp: null
    };
  },
  computed: {
    ...mapState("flexViewColumn", ["columns"]),
    ...mapState("flexViewForm", ["formConfigs"]),

    // 查询字段（从列配置中提取可查询的字段）
    queryFields() {
      // TODO: 从列配置中提取查询字段
      return [];
    }
  },
  created() {
    this.init();
  },
  methods: {
    ...mapActions("flexViewColumn", ["loadColumns"]),
    ...mapActions("flexViewStat", ["loadStatData"]),

    async init() {
      // TODO: 初始化页面数据
      // 1. 加载列配置
      // 2. 加载统计数据
    },

    async loadData() {
      // TODO: 加载统计数据
    },

    // 查询
    handleQuery(params) {
      // TODO: 处理查询
    },

    // 重置
    handleReset() {
      // TODO: 处理重置
    },

    // 单元格点击（打开明细弹窗）
    handleCellClick({ column, row }) {
      // TODO: 处理单元格点击，打开明细弹窗
    },

    // 分页切换
    handlePageChange(page) {
      // TODO: 处理分页切换
    },

    // 刷新统计数据
    refreshStatData() {
      // TODO: 刷新统计数据
    }
  }
};
</script>

<style lang="scss" scoped>
// 使用标准三段式布局，无需额外样式
</style>
