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
          ref="statQueryRef"
          :query-fields="queryFields"
          :current-theme="currentTheme"
          :input-param-org-id="inputParamOrgId"
          @query="handleQuery"
          @reset="handleReset"
          @export="handleExport"
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
      <!-- <div class="hdty-footer">
        <el-pagination
          :current-page="pagination.current"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div> -->

      <!-- 明细数据弹窗 -->
      <detail-dialog
        :visible.sync="detailVisible"
        :form-id="currentFormId"
        :org-id="currentOrgId"
        :column-prop="currentColumnProp"
        :init-params="detailInitParams"
        :query-params="queryParams"
        @refresh="refreshStatData"
      />
    </div>
  </div>
</template>

<script>
import { getEnabledColumns, getSjlsTotal, getMockStatData } from "./api/index";
import StatQuery from "./components/StatQuery.vue";
import StatTable from "./components/StatTable.vue";
import DetailDialog from "./components/DetailDialog.vue";

import ExcelExporter from "@/utils/excelExport"; // 引入封装好的类

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
      currentColumnProp: null,
      // 传递给明细页的初始参数
      detailInitParams: {},
      // 机构相关
      inputParamOrgId: "",
      inputParamOrgName: "",

      currentQueryDataParams: {}
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
      // await this.loadData();
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

      // 解析列配置

      // 递归处理树形数据为表格列配置
      const processNode = (node) => {
        const columnConfig = this.parseColumnConfig(node.columnConfig);
        console.log("columnConfig:", columnConfig);

        let column = {
          ...node,
          id: node.id,
          prop: node.prop,
          label: node.label,
          minWidth: node.columnWidth,
          align: node.align || "center",
          formId: node.formId, // 关联的表单ID（用于点击弹出明细）
          columnType: columnConfig.columnType || ""
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
      let _this = this;
      _this.loading = true;
      try {
        console.log("_this.queryParams", _this.queryParams);

        // 构建查询参数
        const params = {
          ..._this.queryParams,
          leafLevel: 5
        };

        // 使用真实接口
        const response = await getSjlsTotal(params);
        if (response.data.success) {
          this.statData = response.data.data.records || [];
          this.pagination.total = response.data.data.total || 0;

          // 保存当前查询的机构信息（用于返回上级判断）
          if (response.data.data.dto) {
            this.inputParamOrgId = response.data.data.dto.orgId || params.orgId;
            this.inputParamOrgName = response.data.data.dto.orgName || "";

            // 同步到查询组件
            if (this.$refs.statQueryRef) {
              this.$refs.statQueryRef.extendData.orgId = this.inputParamOrgName;
            }
          } else {
            this.inputParamOrgId = params.orgId;
          }

          this.currentQueryDataParams = this.$utilStr.deepClone(params);
        } else {
          this.$message.error(response.data.msg || "加载数据失败");
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

    // 单元格点击（打开明细弹窗或机构钻取）
    handleCellClick(column, row) {
      console.log("Cell clicked:", column, row);

      // 如果是钻取机构列的点击
      if (column.columnType === "drillOrg" && this.canDrillDown(row)) {
        this.handleOrgDrillDown(row);
        return;
      }

      // 解析列配置
      const columnConfig = this.parseColumnConfig(column.columnConfig);

      // 兼容旧配置: 直接使用column.formId
      if (column.formId) {
        this.currentFormId = column.formId;
        this.currentOrgId = row.orgId;
        this.currentColumnProp = column.prop;

        // 构建初始参数：将查询参数和行数据传递给明细页
        // 创建行数据的副本
        const rowCopy = { ...row };

        // 遍历rowCopy对象，查找值为"总计"的字段并替换为this.inputParamOrgName
        Object.keys(rowCopy).forEach((key) => {
          if (rowCopy[key] === "总计") {
            rowCopy[key] = this.inputParamOrgName;
          }
          if (rowCopy[key] === "999999999999") {
            rowCopy[key] = this.inputParamOrgId;
          }
        });

        this.detailInitParams = {
          query: { ...this.currentQueryDataParams }, // 当前统计列表的查询参数
          row: rowCopy // 点击的行数据（已处理"总计"值）
        };

        this.detailVisible = true;
      }
    },

    // 判断是否可以钻取
    canDrillDown(row) {
      // 最后一行（汇总行）不可钻取
      if (
        row.isLeaf ||
        this.statData.indexOf(row) === this.statData.length - 1
      ) {
        return false;
      }
      return true;
    },

    // 机构钻取
    handleOrgDrillDown(row) {
      // 通知查询组件更新机构
      if (this.$refs.statQueryRef) {
        this.$refs.statQueryRef.handleClickOrg(0, row);
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
    },

    // 生成导出表头
    generateExportHeaders() {
      // 递归处理列配置为导出表头
      const processColumns = (columns) => {
        return columns.map((column) => {
          // 解析列配置
          let columnConfig = {};
          try {
            columnConfig =
              typeof column.columnConfig === "string"
                ? JSON.parse(column.columnConfig)
                : column.columnConfig || {};
          } catch (e) {
            console.warn("解析列配置失败:", column.prop, e);
          }

          // 根据配置决定使用哪个prop
          let propToUse = column.prop;
          if (columnConfig.showPropText && columnConfig.propText) {
            propToUse = columnConfig.propText;
          }

          const item = {
            label: column.label,
            prop: propToUse,
            width: Math.floor((column.minWidth || 100) / 7) // 转换宽度
          };

          // 如果有子列，递归处理
          if (column.children && column.children.length > 0) {
            item.children = processColumns(column.children);
          }

          return item;
        });
      };

      // 处理所有列
      return processColumns(this.columns);
    },

    // 导出

    async handleExport() {
      if (this.exporting) return;

      try {
        this.exporting = true;

        // ====== 1️⃣ 生成 headerList 动态结构 ======
        const headerList = this.generateExportHeaders();

        // ====== 2️⃣ 构建导出器 ======
        const exporter = new ExcelExporter()
          .initWorkbook("系统")
          .addWorksheet("数据晾晒统计")
          .buildDynamicHeaders(headerList)
          .setColumnWidth()
          .freezeHeaderAndColumns(1); // 冻结表头

        // ====== 3️⃣ 构造样式配置 ======
        const styleConfig = {
          // 行样式
          rowStyles: [
            {
              // 最后一行橘色背景
              condition: (rowIndex) => rowIndex === this.statData.length - 1,
              style: {
                fill: {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFFFA500" }
                }
              }
            }
          ],
          // 单元格样式
          cellStyles: [
            {
              prop: "orgName",
              condition: (rowIndex, rowData) =>
                rowIndex < this.statData.length - 1,
              style: {
                fill: {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFEAF5FF" }
                }
              }
            },
            {
              // 管辖机构列最后一行样式（总计行）
              prop: "orgName",
              condition: (rowIndex, rowData) =>
                rowIndex === this.statData.length - 1,
              style: {
                fill: {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFFF9933" }
                },
                font: {
                  bold: true
                }
              }
            }
          ]
        };

        // ====== 4️⃣ 添加数据 ======
        exporter.addData(this.statData, styleConfig);

        // ====== 5️⃣ 导出文件 ======
        await exporter.export("数据晾晒统计");
      } catch (error) {
        console.error("导出失败：", error);
      } finally {
        this.exporting = false;
      }
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
