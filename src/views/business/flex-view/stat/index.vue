<template>
  <div class="stat-page-wrapper" :class="'theme-' + currentTheme">
    <!-- 顶部公共区域 -->
    <div class="stat-header-bar">
      <div class="header-left">
        <i class="el-icon-user-solid header-icon"></i>
        <span class="user-info">{{ userName }}</span>
      </div>
      <div class="header-center">
        <div class="title-wrapper">
          <i class="el-icon-data-analysis title-icon"></i>
          <div class="system-title">基础管控系统·数据晾晒</div>
        </div>
      </div>
      <div class="header-right">
        <el-dropdown @command="handleThemeChange" placement="bottom-end">
          <div class="theme-switch">
            <i class="el-icon-brush"></i>
            <span class="theme-text">{{ getThemeName(currentTheme) }}</span>
            <i class="el-icon-arrow-down"></i>
          </div>
          <el-dropdown-menu slot="dropdown" class="theme-dropdown">
            <el-dropdown-item
              command="police"
              :class="{ 'is-active': currentTheme === 'police' }"
            >
              <i class="theme-icon el-icon-circle-check"></i>
              <span>警用蓝</span>
            </el-dropdown-item>
            <el-dropdown-item
              command="green"
              :class="{ 'is-active': currentTheme === 'green' }"
            >
              <i class="theme-icon el-icon-circle-check"></i>
              <span>科技绿</span>
            </el-dropdown-item>
            <el-dropdown-item
              command="dark"
              :class="{ 'is-active': currentTheme === 'dark' }"
            >
              <i class="theme-icon el-icon-circle-check"></i>
              <span>深邃黑</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="hdty-container hdty-flex stat-main-content">
      <!-- 查询区域 -->
      <div class="hdty-header">
        <stat-query
          :query-fields="queryFields"
          :current-theme="currentTheme"
          @query="handleQuery"
          @reset="handleReset"
        />
      </div>

      <!-- 统计表格区域 -->
      <div class="hdty-fit">
        <stat-table
          ref="statTableRef"
          :columns="columns"
          :data="statData"
          :loading="loading"
          :current-theme="currentTheme"
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
  </div>
</template>

<script>
import { getEnabledColumns, getMockStatData } from "./api";
import StatQuery from "./components/StatQuery.vue";
import StatTable from "./components/StatTable.vue";
import DetailDialog from "./components/DetailDialog.vue";

export default {
  name: "ViewStatPage",
  components: {
    StatQuery,
    StatTable,
    DetailDialog
  },
  data() {
    return {
      // 主题
      currentTheme: "police", // police | normal
      // 用户名
      userName: this.$utilPublic.getUserInfo().xm,
      // 列配置
      columns: [],
      // 统计数据
      statData: [],
      loading: false,
      pagination: {
        current: 1,
        pageSize: 50,
        total: 0
      },
      queryParams: {},
      // 明细弹窗
      detailVisible: false,
      currentFormId: null,
      currentOrgId: null,
      currentColumnProp: null
    };
  },
  computed: {
    // 查询字段（从列配置中提取可查询的字段）
    queryFields() {
      // 固定查询字段
      return [
        // {
        //   prop: "orgName",
        //   label: "机构名称",
        //   type: "input",
        //   config: {
        //     placeholder: "请输入机构名称"
        //   }
        // }
      ];
    }
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      // 从本地存储恢复主题
      const savedTheme = localStorage.getItem("stat_page_theme");
      if (savedTheme) {
        this.currentTheme = savedTheme;
      }

      // 加载列配置
      await this.loadColumns();

      // 加载统计数据
      await this.loadData();
    },

    // 加载列配置
    async loadColumns() {
      try {
        const response = await getEnabledColumns();
        if (response.data.success) {
          // 处理树形列配置，转换为表格列
          this.columns = this.processColumns(response.data.data.records || []);
        }
      } catch (error) {
        console.error("加载列配置失败:", error);
        // 使用默认列配置
        this.columns = this.getDefaultColumns();
      }
    },

    // 处理列配置
    processColumns(treeData) {
      if (!treeData || treeData.length === 0) {
        this.$message.warning(
          "暂无可用的列配置，请先在列配置管理中添加并启用列"
        );
        return [];
      }

      // 递归处理树形数据为表格列配置
      const processNode = (node) => {
        let column = {
          ...node,
          id: node.id,
          prop: node.prop,
          label: node.label,
          minWidth: node.columnWidth,
          align: node.align || "center",
          formId: node.formId // 关联的表单ID（用于点击弹出明细）
        };
        delete column.children;
        if (node.children && node.children.length > 0) {
          column.children = node.children.map(processNode);
        }

        return column;
      };

      return treeData.map(processNode);
    },

    // 加载统计数据
    async loadData() {
      this.loading = true;
      try {
        // 使用Mock数据（后期替换为真实接口）
        const response = getMockStatData();
        if (response.success) {
          this.statData = response.data.records;
          this.pagination.total = response.data.total;
        }
      } catch (error) {
        console.error("加载统计数据失败:", error);
        this.$message.error("加载数据失败");
      } finally {
        this.loading = false;
        this.$nextTick(() => {
          if (this.$refs.statTableRef) {
            this.$refs.statTableRef.doLayout();
          }
        });
      }
    },

    // 查询
    handleQuery(params) {
      this.queryParams = params;
      this.pagination.current = 1;
      this.loadData();
    },

    // 重置
    handleReset() {
      this.queryParams = {};
      this.pagination.current = 1;
      this.loadData();
    },

    // 单元格点击（打开明细弹窗）
    handleCellClick(column, row) {
      console.log("Cell clicked:", column, row);
      // 解析列配置
      const columnConfig = this.parseColumnConfig(column.columnConfig);

      // 兼容旧配置: 直接使用column.formId
      if (column.formId) {
        this.currentFormId = column.formId;
        this.currentOrgId = row.orgId;
        this.currentColumnProp = column.prop;
        this.detailVisible = true;
      }
    },

    // 解析列配置JSON
    parseColumnConfig(configStr) {
      try {
        return typeof configStr === "string"
          ? JSON.parse(configStr)
          : configStr || {};
      } catch {
        return {};
      }
    },

    // 分页切换
    handlePageChange(page) {
      this.pagination.current = page;
      this.loadData();
    },

    // 每页条数切换
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.pagination.current = 1;
      this.loadData();
    },

    // 获取主题名称
    getThemeName(theme) {
      const themeMap = {
        police: "警用蓝",
        green: "科技绿",
        dark: "深邃黑"
      };
      return themeMap[theme] || "警用蓝";
    },

    // 主题切换
    handleThemeChange(theme) {
      this.currentTheme = theme;
      // 保存到本地存储
      localStorage.setItem("stat_page_theme", theme);
      this.$message.success(`已切换到${this.getThemeName(theme)}主题`);
    },

    // 刷新统计数据
    refreshStatData() {
      this.loadData();
    }
  }
};
</script>

<style lang="scss" scoped>
// 导入基础样式
@import "./styles/index.scss";
// 导入主题样式
@import "./styles/theme-police.scss";
@import "./styles/theme-green.scss";
@import "./styles/theme-dark.scss";
// 导入下拉菜单样式
@import "./styles/theme-dropdown.scss";
</style>
