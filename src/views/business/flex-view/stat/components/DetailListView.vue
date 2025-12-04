<template>
  <div class="hdty-container hdty-flex detail-list-view">
    <!-- 查询条件 -->
    <div class="hdty-header">
      <el-form
        ref="queryRef"
        :model="queryData"
        inline
        @submit.native.prevent
        @keyup.enter.native="handleQuery"
      >
        <hd-query>
          <hd-query-fixed>
            <!-- 动态查询字段 -->
            <el-form-item
              v-for="field in queryFields"
              :key="field.prop"
              :label="field.label"
              :prop="field.prop"
            >
              <!-- 文本输入框 -->
              <hd-input
                v-if="field.queryType === 'input'"
                v-model="queryData[field.prop]"
                :placeholder="field.config && field.config.placeholder"
                clearable
              />
              <!-- 因子输入框（带匹配操作符） -->
              <hd-factor-input
                v-else-if="field.queryType === 'factorInput'"
                :prop="field.prop + 'FilterFactor'"
                v-model="queryData[field.prop]"
                fuzzy="between"
                :model-control.sync="extendData[field.prop + 'FilterFactor']"
                :placeholder="field.config && field.config.placeholder"
              />
              <!-- 字典选择器 -->
              <hd-dict-select
                v-else-if="field.queryType === 'dictSelect'"
                v-model="queryData[field.prop]"
                :dict-code="field.config && field.config.dictCode"
                :placeholder="field.config && field.config.placeholder"
                clearable
              />
              <!-- 字典单选框 -->
              <hd-dict-radio
                v-else-if="field.queryType === 'dictRadio'"
                v-model="queryData[field.prop]"
                :dict-code="field.config && field.config.dictCode"
              />
              <!-- 日期时间范围选择器 -->
              <hd-date-picker
                v-else-if="field.queryType === 'datetimerange'"
                :type="
                  field.config && field.config.dateType
                    ? field.config.dateType
                    : 'daterange'
                "
                v-model="queryData[field.prop]"
              />
              <!-- 机构选择 -->
              <hd-organ
                v-else-if="field.queryType === 'organ'"
                :placeholder="field.config && field.config.placeholder"
                v-model="queryData[field.prop]"
                :model-text.sync="extendData[field.prop]"
              />
              <!-- 地区选择 -->
              <hd-region
                v-else-if="field.queryType === 'region'"
                v-model="queryData[field.prop]"
              />
              <!-- 默认文本输入框 -->
              <hd-input
                v-else
                v-model="queryData[field.prop]"
                :placeholder="field.config && field.config.placeholder"
                clearable
              />
            </el-form-item>
          </hd-query-fixed>
          <hd-query-expand>
            <el-form-item label="创建时间" prop="createTime">
              <hd-date-picker
                type="datetimerange"
                v-model="queryData.createTime"
              />
            </el-form-item>
            <!-- 注销状态 -->
            <el-form-item label="注销状态" prop="zxbs">
              <hd-dict-radio
                v-model="queryData.zxbs"
                :dict-code="$global.dictType.zxbs"
                show-all-button
              />
            </el-form-item>
          </hd-query-expand>
        </hd-query>
      </el-form>

      <!-- 按钮区域 -->
      <hd-button-container>
        <hd-button
          name="query"
          type="info"
          icon="el-icon-search"
          @click="handleQuery"
        >
          查询
        </hd-button>
        <hd-button icon="el-icon-delete" @click="handleClear"> 清空 </hd-button>
        <hd-button
          name="add"
          type="success"
          icon="el-icon-circle-plus-outline"
          @click="handleAdd"
        >
          新增
        </hd-button>
      </hd-button-container>
    </div>

    <!-- 明细列表 -->
    <div class="hdty-fit">
      <dynamic-table
        ref="tableRef"
        :columns="detailColumns"
        :data="detailData"
        :loading="loading"
        :show-operation="true"
        :show-logout="true"
        @detail="handleDetail"
        @edit="handleEdit"
        @delete="handleDelete"
        @logout="handleLogout"
      />
    </div>

    <!-- 分页 -->
    <div class="hdty-footer">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="pageOptions.current"
        :page-sizes="pageOptions.sizes"
        :page-size="pageOptions.size"
        :total="pageOptions.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>

    <!-- 注销弹窗 -->
    <dynamic-logout
      ref="logoutRef"
      @submit="handleLogoutSubmit"
    ></dynamic-logout>
  </div>
</template>

<script>
import DynamicTable from "../../components/common/DynamicTable/index.vue";
import DynamicLogout from "../../components/common/DynamicLogout/index.vue";
import { dynamicFormPage, dynamicFormLogout } from "../api/index";
import request from "@/config/axios-init";
import { hdList } from "@/utils/util-framework";

export default {
  name: "DetailListView",
  mixins: [hdList],
  components: {
    DynamicTable,
    DynamicLogout
  },
  props: {
    formConfig: Object,
    ywFormId: String,
    orgId: String,
    columnProp: String,
    // 初始参数（由DetailDialog传入）
    initParams: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // 表单项配置
      queryFields: [],
      detailColumns: [],

      // 查询数据
      queryData: {
        createTime: [],
        zxbs: "0"
      },
      extendData: {},

      // 明细数据
      detailData: [],
      loading: false,
      // 是否已初始化（避免重复初始化）
      isInitialized: false
    };
  },
  watch: {},
  methods: {
    beforeLoadForm() {
      let _this = this;
      _this.$nextTick(() => {
        _this.parseFormConfig();
        _this.applyInitParams(); // 应用初始参数
        _this.loadList();
      });
    },
    // 解析表单配置
    parseFormConfig() {
      if (!this.formConfig || !this.formConfig.formItemList) {
        return;
      }

      const items = this.formConfig.formItemList;

      // 解析每个表单项的配置
      const parsedItems = items.map((item) => {
        const config = this.parseConfig(item.itemConfig);
        return {
          ...item,
          config
        };
      });

      console.log("parsedItems", parsedItems);

      // 构建查询字段(showInQuery=true)
      this.queryFields = parsedItems
        .filter((item) =>
          item.config && item.config.display
            ? item.config.display.showInQuery === true
            : false
        )
        .map((item) => this.convertToFormField(item));

      // 初始化查询数据和扩展数据
      this.queryFields.forEach((field) => {
        this.$set(this.queryData, field.prop, "");
        // 为queryType为factorInput的字段初始化因子数据
        if (field.queryType === "factorInput") {
          this.$set(
            this.extendData,
            field.prop + "FilterFactor",
            this.$app.factorOptions.matchOpe.between
          );
        }
      });

      // 构建列表列(showInList=true)
      this.detailColumns = parsedItems
        .filter((item) =>
          item.config && item.config.display
            ? item.config.display.showInList === true
            : false
        )
        .map((item) => this.convertToColumn(item));
    },

    // 转换为表单字段配置
    convertToFormField(item) {
      const config = item.config;
      const displayConfig = config.display || {};
      const layoutConfig = config.layout || {};
      const validationConfig = config.validation || {};
      const componentProps = config.componentProps || {};

      // 根据itemType确定queryType
      let queryType = this.getQueryType(item.itemType, config);

      // 根据keyType判断placeholder前缀（请输入 or 请选择）
      const selectTypes = ["org", "region", "dict", "date"];
      const placeholderPrefix = selectTypes.includes(item.keyType)
        ? "请选择"
        : "请输入";

      return {
        prop: item.itemProp,
        label: item.itemLabel,
        type: item.itemType,
        queryType: queryType,
        span: layoutConfig.span || 8, // 查询区域默认一行3个
        required: false, // 查询条件不必填
        config: {
          ...config,
          placeholder:
            config.placeholder || `${placeholderPrefix}${item.itemLabel}`,
          dictCode: item.dicType || componentProps.dictCode
        }
      };
    },

    // 转换为列配置
    convertToColumn(item) {
      const config = item.config;
      const displayConfig = config.display || {};

      return {
        ...item,
        ...config,
        prop: item.itemProp,
        label: item.itemLabel,
        width: displayConfig.columnWidth || undefined,
        minWidth: displayConfig.columnMinWidth || undefined,
        align: displayConfig.align || "center",
        sortable: displayConfig.sortable || false,
        showOverflowTooltip: displayConfig.showOverflowTooltip !== false
      };
    },

    // 根据itemType确定queryType
    getQueryType(itemType, config) {
      // 如果配置中有queryType，优先使用
      if (config && config.queryType) {
        return config.queryType;
      }

      // 根据itemType映射到queryType
      const queryTypeMap = {
        input: "factorInput",
        text: "factorInput",
        textarea: "factorInput",
        number: "input",
        factorInput: "factorInput",
        select: "dictSelect",
        dictSelect: "dictSelect",
        radio: "dictRadio",
        dictRadio: "dictRadio",
        date: "datetimerange",
        datetime: "datetimerange",
        datetimerange: "datetimerange",
        daterange: "datetimerange",
        organ: "organ",
        region: "region"
      };

      return queryTypeMap[itemType] || "input";
    },

    // 应用初始参数
    applyInitParams() {
      if (!this.initParams || Object.keys(this.initParams).length === 0) {
        return;
      }

      console.log("应用初始参数:", this.initParams);

      // 遍历 initParams，设置到 queryData 中
      Object.keys(this.initParams).forEach((prop) => {
        const value = this.initParams[prop];

        // 只设置非空值
        if (value !== undefined && value !== null && value !== "") {
          // 检查是否在查询字段中
          const queryField = this.queryFields.find((f) => f.prop === prop);
          console.log("queryField", queryField);
          console.log("value", value);

          if (queryField) {
            this.$set(this.queryData, prop, value);
            if (
              queryField.config &&
              queryField.config.showPropText &&
              queryField.config.propText
            ) {
              this.$set(
                this.extendData,
                prop,
                this.initParams[queryField.config.propText]
              );
            }

            // 如果是因子输入字段，需要设置因子
            if (
              queryField.queryType === "factorInput" &&
              this.initParams[prop + "FilterFactor"]
            ) {
              this.$set(
                this.extendData,
                prop + "FilterFactor",
                this.initParams[prop + "FilterFactor"]
              );
            }

            console.log(`设置查询参数: ${prop} = ${JSON.stringify(value)}`);
          }
        }
      });

      this.isInitialized = true;
    },

    // 解析配置JSON
    parseConfig(configStr) {
      try {
        return typeof configStr === "string"
          ? JSON.parse(configStr)
          : configStr || {};
      } catch {
        return {};
      }
    },

    // 加载明细数据
    async loadList() {
      let _this = this;
      if (!this.ywFormId) return;

      this.loading = true;
      try {
        // 构建查询字段数据
        const queryFieldsData = this.buildDynamicQueryData();

        // 整理queryData中不在queryFields里的字段（固定字段如createTime、zxbs等）
        const fixedFields = {};
        const queryFieldProps = this.queryFields.map((f) => f.prop);
        Object.keys(this.queryData).forEach((key) => {
          if (!queryFieldProps.includes(key)) {
            fixedFields[key] = this.queryData[key];
          }
        });

        const params = {
          formId: this.ywFormId,
          queryFields: queryFieldsData, // 动态查询字段数据
          ...fixedFields, // 固定字段（createTime、zxbs等）
          ..._this.pageOptions
        };

        const response = await dynamicFormPage(params);

        if (response.data.success) {
          this.detailData = response.data.data.records || [];
          this.pageOptions.total = response.data.data.total || 0;
        } else {
          this.$message.error(response.data.msg || "加载数据失败");
        }
      } catch (error) {
        console.error("加载明细数据失败:", error);
        this.$message.error("加载数据失败");
      } finally {
        this.loading = false;

        if (this.$refs.tableRef) {
          this.$nextTick(() => {
            if (this.$refs.tableRef && this.$refs.tableRef.doLayout) {
              this.$refs.tableRef.doLayout();
            }
          });
        }
      }
    },

    // 查询
    handleQuery() {
      this.pageOptions.current = 1;
      this.loadList();
    },

    // 构建动态查询数据结构
    buildDynamicQueryData() {
      const queryFieldsData = [];

      this.queryFields.forEach((field) => {
        const value = this.queryData[field.prop];

        // 只处理有值的字段
        if (value === "" || value === null || value === undefined) {
          return;
        }

        // 获取对应的 formItem 完整配置
        const formItem = this.formConfig.formItemList.find(
          (item) => item.itemProp === field.prop
        );
        if (!formItem) return;

        const config = this.parseConfig(formItem.itemConfig);
        const componentProps = config.componentProps || {};

        // 构建查询字段数据结构
        const queryFieldItem = {
          prop: field.prop,
          label: field.label,
          type: field.type || formItem.itemType, // 使用 keyType 作为 type
          value: value,
          valueType:
            componentProps.queryValueType ||
            config.valueType ||
            this.getValueType(field.type) ||
            this.getValueTypeByValue(value), // 值类型：组件配置 > 配置 > 推导 > 实际值类型
          tableColumnKey: formItem.tableKey, // 映射列名（formItemList中的独立属性）
          ...(componentProps.queryDateType && {
            queryDateType: componentProps.queryDateType
          }), // 全干选项：需要传递给后端用于日期类型判断
          ...(config.filterFactor && { filterFactor: config.filterFactor }) // 过滤因子
        };

        // 如果是因子输入，添加 filterFactor
        if (
          field.queryType === "factorInput" &&
          this.extendData[field.prop + "FilterFactor"]
        ) {
          queryFieldItem.filterFactor =
            this.extendData[field.prop + "FilterFactor"];
        }

        queryFieldsData.push(queryFieldItem);
      });

      return queryFieldsData;
    },

    // 根据类型推断值类型
    getValueType(fieldType) {
      const valueTypeMap = {
        input: "string",
        text: "string",
        number: "number",
        date: "array",
        datetime: "array",
        daterange: "array",
        datetimerange: "array",
        select: "string",
        dictSelect: "string",
        radio: "string",
        dictRadio: "string",
        organ: "string",
        region: "string"
      };
      return valueTypeMap[fieldType] || null;
    },

    // 根据实际值推断值类型
    getValueTypeByValue(value) {
      if (Array.isArray(value)) {
        return "array";
      } else if (typeof value === "number") {
        return "number";
      } else {
        return "string";
      }
    },

    // 清空
    handleClear() {
      this.$refs.queryRef && this.$refs.queryRef.resetFields();
      // 清空extendData中的因子数据
      this.queryFields.forEach((field) => {
        if (field.queryType === "factorInput") {
          this.$set(
            this.extendData,
            field.prop + "FilterFactor",
            this.$app.factorOptions.matchOpe.between
          );
        }
        this.$set(this.queryData, field.prop, "");
      });
      this.pageOptions.current = 1;
      this.applyInitParams();
      this.isInitialized = false; // 重置初始化标志
      this.loadList();
    },

    // 新增
    handleAdd() {
      this.$emit("add");
    },

    // 详情
    handleDetail(row) {
      this.$emit("detail", row);
    },

    // 编辑
    handleEdit(row) {
      this.$emit("edit", row);
    },

    // 删除
    async handleDelete(row) {
      try {
        await this.$confirm("确定删除该数据?", "提示", {
          type: "warning"
        });

        const response = await request({
          url: "/web/sjls/detailData/delete",
          method: "post",
          data: { id: row.vo.id }
        });

        if (response.data.success) {
          this.$message.success("删除成功");
          this.loadList();
          this.$emit("refresh");
        } else {
          this.$message.error(response.data.msg || "删除失败");
        }
      } catch (error) {
        if (error !== "cancel") {
          console.error("删除失败:", error);
          this.$message.error("删除失败");
        }
      }
    },

    // 注销
    handleLogout(row) {
      this.$refs.logoutRef.visible = true;
      this.$refs.logoutRef.row = row;
      this.$nextTick(() => {
        this.$refs.logoutRef.beforeLoadForm();
      });
    },

    // 注销提交
    async handleLogoutSubmit({ id, zxyy, callback }) {
      try {
        const response = await dynamicFormLogout({
          id,
          zxyy
        });

        const { success, msg } = response.data;
        callback(success, msg);

        if (success) {
          this.handleQuery();
          this.$emit("refresh");
        }
      } catch (error) {
        console.error("注销失败:", error);
        callback(false, "注销失败");
      }
    },

    // 刷新数据
    refreshData() {
      this.loadList();
    }
  }
};
</script>

<style lang="scss" scoped>
.detail-list-view {
  min-height: 500px;
  max-height: 70vh;

  ::v-deep .hdty-header {
    padding: 2px 0;
  }

  ::v-deep .hdty-footer {
    padding: 10px 0;
    text-align: center;

    .el-pagination {
      text-align: center;
    }
  }
}
</style>
