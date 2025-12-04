<template>
  <div>
    <el-input
      ref="inputRef"
      v-model="input"
      suffix-icon="el-icon-more"
      :size="size"
      :placeholder="placeholder"
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
              :model="queryData"
              :rules="rules"
              ref="queryRef"
              inline
              @submit.native.prevent
              @keyup.enter.native="handleQuery"
            >
              <hd-component :model="factorData" ref="componentRef">
                <el-form-item label="表单项标签" prop="itemLabel">
                  <hd-factor-input
                    prop="itemLabelFilterFactor"
                    v-model="queryData.itemLabel"
                    fuzzy="between"
                    :model-control.sync="factorData.itemLabelFilterFactor"
                    placeholder="请输入表单项标签"
                  ></hd-factor-input>
                </el-form-item>
                <!-- 属性名 -->
                <el-form-item label="属性名" prop="itemProp">
                  <hd-factor-input
                    prop="itemPropFilterFactor"
                    v-model="queryData.itemProp"
                    fuzzy="between"
                    :model-control.sync="factorData.itemPropFilterFactor"
                    placeholder="请输入属性名"
                  ></hd-factor-input>
                </el-form-item>
              </hd-component>
            </el-form>
            <div class="hdty-btn-group">
              <el-button
                type="info"
                v-preventReClick
                icon="el-icon-search"
                @click="handleQuery"
                >查询</el-button
              >
              <el-button siza="small" icon="el-icon-delete" @click="handleClear"
                >清空</el-button
              >
            </div>
          </div>
          <div class="hdty-fit">
            <el-table
              ref="tableRef"
              row-key="id"
              v-loading="loading"
              :data="tableData"
              @sort-change="handleSortChange"
              @select="handleSelect"
              @select-all="handleSelectAll"
              border
              fit
              height="100%"
            >
              <el-table-column
                v-if="multiple"
                fixed
                type="selection"
                reserve-selection
                align="center"
                width="50"
              ></el-table-column>
              <el-table-column
                v-else
                fixed
                label="操作"
                align="center"
                width="80"
              >
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    @click="handleChecked(scope.$index, scope.row)"
                    >选择</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column
                fixed
                sortable="custom"
                type="index"
                label="序号"
                :index="setIndex"
                align="center"
                width="50"
              ></el-table-column>
              <!-- 组件标签 -->
              <el-table-column
                prop="vo.itemLabel"
                label="组件标签"
                min-width="150"
                show-overflow-tooltip
              >
              </el-table-column>

              <!-- 属性名 -->
              <el-table-column
                prop="vo.itemProp"
                label="属性名"
                width="140"
                show-overflow-tooltip
              >
              </el-table-column>

              <!-- 组件类型 -->
              <el-table-column
                prop="vo.itemType"
                label="组件类型"
                align="center"
                width="120"
              >
                <template slot-scope="scope">
                  <el-tag type="primary" size="mini">
                    {{ scope.row.vo.itemType }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="hdty-footer">
            <el-pagination
              :pager-count="5"
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
        <cite class="hdty-float-left"
          >当前选择：
          <el-tag
            v-if="input"
            closable
            type="success"
            @close="handleTagClose"
            >{{ input }}</el-tag
          >
        </cite>
        <el-button @click="cancelForm">取 消</el-button>
        <el-button
          v-if="multiple"
          v-preventReClick
          type="primary"
          @click="submitForm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { hdComponent, hdList, hdMethod } from "@/utils/util-framework";
import { listPage } from "./api";

export default {
  name: "index",
  provide() {
    return {
      BizFormSelect: this
    };
  },
  mixins: [hdComponent, hdList, hdMethod],
  props: {
    prop: String,
    // 绑定值
    value: {
      type: [Number, String, Array],
      default: ""
    },
    // 绑定值文本
    modelText: {
      type: [Number, String, Array],
      default: ""
    },
    // 尺寸
    size: {
      type: String,
      default: ""
    },
    // 水印
    placeholder: {
      type: String,
      default: "请选择"
    },
    // 多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 多选限制
    multipleLimit: {
      type: Number,
      default: 0
    },
    // 多选值
    currentSelection: {
      type: Array,
      default() {
        return [];
      }
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
      default: false
    },
    // 会话标题
    title: {
      type: String,
      default: "选择表单项"
    },
    // 表单ID
    formId: {
      type: [String, Number],
      default: ""
    }
  },
  data() {
    return {
      // 显示Dialog
      visible: false,
      // 绑定值
      input: this.modelText, // input接收父组件传来的modelText值
      // 查询
      queryData: {
        formId: this.formId,
        itemLabel: "",
        itemProp: "",
        zxbs: "0"
      },
      // 查询条件
      factorData: {
        itemLabelFilterFactor: this.$app.factorOptions.matchOpe.between,
        itemPropFilterFactor: this.$app.factorOptions.matchOpe.between
      },
      // 验证
      rules: {},
      // 表格数据
      tableData: [],
      // 多选数据
      multipleData: this.currentSelection, // multipleData接收父组件传来的currentSelection值
      // 启用构造
      activeEnable:
        this.multiple &&
        this.value.length > 0 &&
        this.currentSelection.length < 1,
      // 构造数据
      activeData: [],
      // 页面加载次数
      loadTime: 0
    };
  },
  watch: {
    value: {
      handler(val) {
        if (!val || val.length < 1) {
          this.input = "";
        }
        if (this.multiple) {
          this.multipleData = this.activeData;
        }
        if (Array.isArray(val) && this.activeEnable) {
          this.activeData = [];
          for (let i = 0; i < val.length; i++) {
            this.activeData.push({
              vo: { id: val[i] }
            });
          }
          this.multipleData = this.activeData;
        }
        this.pageOptions.current = 1;
      },
      immediate: true
    },
    modelText: {
      handler(val) {
        if (Array.isArray(val)) {
          this.input = this.$utilStr.splitArray(val);
          if (this.activeEnable) {
            this.activeData = [];
            for (let i = 0; i < val.length; i++) {
              this.activeData.push({
                vo: {
                  id: this.value[i],
                  itemLabel: val[i]
                }
              });
            }
            this.multipleData = this.activeData;
          }
        } else {
          this.input = val;
        }
      },
      immediate: true
    },
    currentSelection: {
      handler(val) {
        this.multipleData = val;
      },
      immediate: false
    },
    formId(newVal) {
      if (newVal) {
        this.queryData.formId = newVal;
        this.pageOptions.current = 1;
        if (this.visible) {
          this.loadList();
        }
      }
    }
  },
  methods: {
    // input获得焦点
    handleInputFocus() {
      let _this = this;
      _this.visible = true;
      _this.$emit("currentOpening", _this);
      _this.loadList();
    },
    // 获取数据列表
    loadList() {
      let _this = this;
      if (
        _this.loadTime < 1 ||
        !_this.queryData.dzyslxdm ||
        _this.queryData.dzyslxdm.length < 1
      ) {
        _this.queryData.dzyslxdm = _this.searchLx;
      }
      _this.loading = true;
      // 参数
      let dataParams = {
        ...this.factorData,
        ..._this.queryData,
        ..._this.pageOptions
      };
      listPage(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.pageOptions.total = data.total;
            _this.tableData = data.records;
            _this.loadTime++;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          if (_this.multiple) {
            _this.toggleSelection();
          }
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
    // input清空
    handleInputClear() {
      if (this.multiple) {
        this.triggerClearSelection();
        this.$emit("input", []);
        this.$emit("update:modelText", []);
      } else {
        this.$emit("input", "");
        this.$emit("update:modelText", "");
      }
      this.$emit("currentChanged", []);
      this.triggerValidate();
    },
    // tag关闭
    handleTagClose() {
      this.input = "";
      if (this.multiple) {
        this.triggerClearSelection();
        this.multipleData = [];
      } else {
        this.$emit("input", "");
        this.$emit("update:modelText", "");
        this.$emit("currentChanged", []);
        this.triggerValidate();
      }
    },
    // 单选
    handleChecked(index, row) {
      this.visible = false;
      this.input = row.vo.itemLabel;
      this.$emit("input", row.vo.id); //触发 input 事件，并传入新值
      this.$emit("update:modelText", row.vo.itemLabel);
      this.$emit("currentChanged", row);
      // this.triggerValidate();
    },
    // selection回显
    toggleSelection() {
      let _this = this;
      if (_this.$refs.tableRef) {
        let selections = [];
        _this.multipleData.forEach((item) => {
          let currentSelections = _this.tableData.find(
            (e) => e.vo.id === item.vo.id
          );
          if (currentSelections) {
            selections.push(currentSelections);
          }
        });
        let surplusSelections = _this.multipleData;
        _this.tableData.forEach((item) => {
          surplusSelections = surplusSelections.filter(
            (e) => e.vo.id !== item.vo.id
          );
        });
        if (!surplusSelections || surplusSelections.length < 1) {
          _this.$refs.tableRef.clearSelection();
        }
        if (_this.tableData) {
          _this.tableData.forEach((row) => {
            _this.$refs.tableRef.toggleRowSelection(row, false);
          });
        }
        if (selections) {
          selections.forEach((row) => {
            _this.$refs.tableRef.toggleRowSelection(row, true);
          });
        }
      }
    },
    // selection多选
    handleSelect(val) {
      let _this = this;
      if (_this.triggerSelectionValidate(val)) {
        let selections = _this.multipleData;
        _this.tableData.forEach((item) => {
          selections = selections.filter((e) => e.vo.id !== item.vo.id);
        });
        val.forEach((item) => {
          selections = selections.filter((e) => e.vo.id !== item.vo.id);
        });
        _this.multipleData = val.concat(selections);
        _this.triggerInputChange();
      }
    },
    // selection全选
    handleSelectAll(val) {
      let _this = this;
      if (_this.triggerSelectionValidate(val)) {
        let selections = _this.multipleData;
        _this.tableData.forEach((item) => {
          selections = selections.filter((e) => e.vo.id !== item.vo.id);
        });
        val.forEach((item) => {
          selections = selections.filter((e) => e.vo.id !== item.vo.id);
        });
        _this.multipleData = val.concat(selections);
        _this.triggerInputChange();
      }
    },
    // selection清空
    triggerClearSelection() {
      this.$nextTick(() => {
        if (this.$refs.tableRef) {
          this.$refs.tableRef.clearSelection();
        }
      });
    },
    // selection验证
    triggerSelectionValidate(val) {
      let _this = this;
      if (_this.multipleLimit > 0) {
        if (val.length > _this.multipleLimit) {
          _this.$message({
            showClose: true,
            customClass: "is-fixed",
            message:
              "超出多选限制，最多选择[" + _this.multipleLimit + "]项数据",
            type: "error"
          });
          val.slice(_this.multipleLimit).forEach((row) => {
            _this.$refs.tableRef.toggleRowSelection(row, false);
          });
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    // 提交
    submitForm() {
      this.visible = false;
      this.triggerInputChange();
      this.$emit(
        "input",
        this.$utilStr.objArrayToArray(
          this.$utilStr.objArrayToArray(this.multipleData, "vo"),
          "id"
        )
      ); //触发 input 事件，并传入新值
      this.$emit(
        "update:modelText",
        this.$utilStr.objArrayToArray(
          this.$utilStr.objArrayToArray(this.multipleData, "vo"),
          "itemLabel"
        )
      );
      this.$emit("currentChanged", this.multipleData);
      this.triggerValidate();
      if (this.activeEnable) {
        this.activeEnable = false;
      }
      if (this.currentSelection < 1) {
        this.activeData = this.multipleData;
      }
    },
    // input改变
    triggerInputChange() {
      this.input = this.$utilStr.splitArray(
        this.$utilStr.objArrayToArray(
          this.$utilStr.objArrayToArray(this.multipleData, "vo"),
          "itemLabel"
        )
      );
    },
    // 取消
    cancelForm() {
      this.visible = false;
      if (this.multiple) {
        this.resetForm();
      }
    },
    // 触发校验
    triggerValidate() {
      let validateElement = this.queryComponentParent(this, "ElForm");
      let validateFieldElement = this.queryComponentParent(this, "ElFormItem");
      this.$nextTick(() => {
        if (validateFieldElement) {
          validateElement.validateField(validateFieldElement.prop);
        }
      });
    },
    // 重置
    resetForm() {
      if (this.currentSelection.length > 0) {
        this.multipleData = this.currentSelection;
      } else {
        this.multipleData = this.activeData;
      }
      this.toggleSelection();
      this.triggerInputChange();
      this.pageOptions.current = 1;
    }
  }
};
</script>

<style scoped></style>
