<template>
  <div>
    <el-input
      ref="inputRef"
      v-model="input"
      :placeholder="placeholder"
      suffix-icon="el-icon-more"
      :disabled="disabled"
      :clearable="clearable"
      :underline="underline"
      elip
      @focus="handleInputFocus"
      @clear="handleInputClear"
    ></el-input>
    <el-dialog
      :title="'选择' + title"
      :visible.sync="visible"
      custom-class="hdty-dialog-large"
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
              size="small"
              @submit.native.prevent
              @keyup.enter.native="handleQuery"
            >
              <hd-component :model="factorData" ref="componentRef">
                <hd-expand>
                  <hd-expand-header>
                    <el-form-item label="民警姓名" prop="xm">
                      <el-input
                        v-model="queryData.xm"
                        placeholder="请输入民警姓名"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="gmsfhm">
                      <el-input
                        v-model="queryData.gmsfhm"
                        placeholder="请输入身份证号"
                      ></el-input>
                    </el-form-item>
                  </hd-expand-header>
                  <hd-expand-body>
                    <el-row v-if="!['2'].includes(isQueryAll)">
                      <el-form-item label="管辖机构" prop="orgId">
                        <hd-organ
                          v-model="queryData.orgId"
                          :model-text.sync="factorData.orgName"
                          :filterCode="orgFilterCode"
                          :showLevel="rwBaseConfig.orgLevel"
                          placeholder="请选择管辖机构"
                        ></hd-organ>
                      </el-form-item>
                      <!-- <el-form-item prop="ckbj"
                        ><el-checkbox v-model="queryData.ckbj"
                          >查询本级</el-checkbox
                        ></el-form-item
                      > -->
                      <el-form-item v-if="isQueryAll === '1'" prop="orgLevel">
                        <el-checkbox-group v-model="queryData.orgLevel">
                          <el-checkbox
                            v-for="(orgLevelItem, index) in showOrgLevel"
                            :key="orgLevelItem.key"
                            :label="orgLevelItem.key"
                            >{{ orgLevelItem.label }}</el-checkbox
                          >
                        </el-checkbox-group></el-form-item
                      >
                    </el-row>
                    <el-row>
                      <el-form-item label="联系电话" prop="telephone">
                        <el-input
                          v-model="queryData.telephone"
                          placeholder="请输入联系电话"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="用 户 名" prop="username">
                        <el-input
                          v-model="queryData.username"
                          placeholder="请输入用户名"
                        ></el-input>
                      </el-form-item>
                    </el-row>

                    <el-row>
                      <el-form-item label="注册时间" prop="createTime">
                        <hd-date-picker
                          v-model="queryData.createTime"
                          type="datetimerange"
                          :picker-options="pickerOptions"
                          range-separator="至"
                          start-placeholder="请输入开始时间"
                          end-placeholder="请输入结束时间"
                          value-format="yyyyMMddHHmmss"
                          align="right"
                        ></hd-date-picker>
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
                @click="handleQuery"
                >查询</el-button
              >
              <el-button icon="el-icon-delete" @click="handleClear"
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
              border
              @select="handleSelect"
              @select-all="handleSelectAll"
              fit
              height="100%"
            >
              <el-table-column
                key="hd_table_select_multiple"
                v-if="multiple"
                fixed
                type="selection"
                reserve-selection
                align="center"
                width="50"
              ></el-table-column>
              <el-table-column
                key="hd_table_select_single"
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
              <el-table-column
                prop="vo.xm"
                label="民警姓名"
                sortable="custom"
                header-align="center"
                show-overflow-tooltip
                width="160"
              ></el-table-column>
              <el-table-column
                prop="vo.gmsfhm"
                label="身份证号"
                sortable="custom"
                header-align="center"
                align="center"
                width="190"
              ></el-table-column>
              <el-table-column
                prop="vo.telephone"
                label="联系电话"
                sortable="custom"
                header-align="center"
                width="120"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="vo.username"
                label="用户名"
                sortable="custom"
                header-align="center"
                min-width="160"
              ></el-table-column>
              <el-table-column
                prop="vox.orgId"
                label="管辖机构"
                sortable="custom"
                header-align="center"
                min-width="240"
              ></el-table-column>
              <el-table-column
                prop="vo.createTime"
                label="注册时间"
                sortable="custom"
                header-align="center"
                width="180"
              >
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
              :total="pageOptions.total"
            ></el-pagination>
          </div>
        </div>
      </hd-pane>
      <span slot="footer" class="hdty-dialog-footer">
        <cite class="hdty-float-left">
          当前选择：
          <el-tag
            v-if="activeTag"
            type="success"
            :closable="clearable"
            @close="handleTagClose"
            >{{ activeTag }}</el-tag
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
import { hdComponent, hdForm, hdList, hdMethod } from "@/utils/util-framework";
import { getPageSelect } from "./api";

import { getOrganDetail } from "@/api/organ";

export default {
  name: "index",
  provide() {
    return {
      Index: this
    };
  },
  mixins: [hdComponent, hdList, hdForm, hdMethod],
  props: {
    prop: String,
    // 机构的filterCode
    orgFilterCode: {
      type: [Number, String],
      value: ""
    },
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
    // 水印
    placeholder: {
      type: String,
      default: "请选择所属民警"
    },
    // 多选
    multiple: {
      type: Boolean,
      default: false
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
      default: "所属民警"
    },
    // 多选值
    currentSelection: {
      type: Array,
      default() {
        return [];
      }
    },
    // 机构编码
    orgId: {
      type: String,
      default: ""
    },
    // 机构名称
    orgName: {
      type: String,
      default: ""
    },
    // 警员类别
    policeType: {
      type: Array,
      default() {
        return [];
      }
    },
    // 警员类别
    policeTypeText: {
      type: Array,
      default() {
        return [];
      }
    },
    // 绑定值的字段名
    valueField: {
      type: String,
      default() {
        return "vo.id";
      }
    },
    // 是否显示机构下所有民警，用于任务中心给上级用户指派任务,2的时候仅展示本级
    isQueryAll: {
      type: String,
      default: ""
    },
    // 是否过滤责任管区是orgid的用户
    isQueryZrq: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      orgLevel: [
        {
          key: "3",
          label: "市局用户",
          value: ["3"]
        },
        {
          key: "4",
          label: "分局用户",
          value: ["4"]
        },
        {
          key: "5",
          label: "派出所用户",
          value: ["5"]
        },
        {
          key: "6",
          label: "责任区用户",
          value: ["6", "7"]
        }
      ],
      showOrgLevel: [],
      // 绑定值的字段名
      // valueField: 'vo.id',
      // 绑定值文本的字段名
      labelField: "vo.xm",
      // 选中值的字段名
      selectionField: "ids",
      // 显示Dialog
      visible: false,
      // 绑定值
      input: this.modelText, // input接收父组件传来的modelText值
      // 查询
      queryData: {
        xm: "",
        gmsfhm: "",
        telephone: "",
        username: "",
        orgId: "",
        isQueryAll: "",
        orgLevel: [],
        createTime: [],
        //查询本级
        ckbj: false
      },
      // 查询条件
      factorData: {
        policeTypeText: this.policeTypeText || [],
        orgName: ""
      },
      // 验证
      rules: {},
      // 表格数据
      tableData: [],
      // 多选数据
      multipleData: this.currentSelection, // multipleData接收父组件传来的currentSelection值

      rwBaseConfig: {
        orgLevel: 4,
        orgLevelText: "分局",
        checkLevel: []
      }
    };
  },
  computed: {
    activeTag() {
      if (this.multiple) {
        return this.$utilStr.splitArray(
          this.$utilStr.objArrayToArray(this.multipleData, this.labelField)
        );
      } else {
        return this.input;
      }
    },
    activeConstDataEnabled() {
      return (
        this.multiple &&
        this.currentValue.length > 0 &&
        this.currentSelection.length < 1 &&
        this.constDataEnabled
      );
    }
  },
  watch: {
    value: {
      handler(val) {
        if (!val || val.length < 1) {
          this.input = "";
        }
        if (this.multiple) {
          if (!Array.isArray(val)) {
            if (val) {
              val = [val];
            } else {
              val = [];
            }
          }
          this.currentValue = val;
          if (this.$utilStr.isEmpty(val)) {
            this.constData = [];
            this.triggerClearSelection();
          }
          if (this.activeConstDataEnabled) {
            this.constData = [];
            for (let i = 0; i < val.length; i++) {
              let initialValue = this.$utilStr.generateDeepObj(
                this.valueField,
                val[i]
              );
              this.constData.push(initialValue);
            }
          }
          this.multipleData = this.constData;
        } else {
          this.currentValue = val;
        }
        this.pageOptions.current = 1;
      },
      immediate: true
    },
    modelText: {
      handler(val) {
        if (
          this.$utilStr.isEmpty(val) &&
          !this.$utilStr.isEmpty(this.currentValue)
        ) {
          val = this.currentValue;
        }
        if (this.multiple) {
          if (!Array.isArray(val)) {
            if (val) {
              val = [val];
            } else {
              val = [];
            }
          }
          this.input = this.$utilStr.splitArray(val);
          if (this.activeConstDataEnabled) {
            for (let i = 0; i < val.length; i++) {
              let initialValue = this.$utilStr.generateDeepObj(
                this.valueField,
                this.currentValue[i]
              );
              let initialLabel = this.$utilStr.generateDeepObj(
                this.labelField,
                val[i]
              );
              this.constData[i] = this.$utilStr.deepObjMerge(
                initialValue,
                initialLabel
              );
            }
            this.multipleData = this.constData;
          }
        } else {
          this.input = val;
        }
      },
      immediate: true
    },
    multiple: {
      handler() {
        this.handleInputClear();
      },
      immediate: false
    },
    currentSelection: {
      handler(val) {
        this.multipleData = val;
      },
      immediate: false
    },
    visible: {
      handler(val) {
        if (!val) {
          this.pageOptions.current = 1;
        }
      },
      immediate: true
    },
    "queryData.orgId": {
      handler(val) {
        this.updateOrgLevel();
      },
      immediate: true
    }
  },
  created() {
    this.initOrgLevel();
  },
  methods: {
    initOrgLevel() {
      let _this = this;
      let configValue = this.$storage.session
        .get("configData")
        .find((e) => e.key === "RW" && e.keyItem === "rwBaseConfig");

      if (configValue && configValue.value) {
        let baseConfig = JSON.parse(configValue.value);
        this.rwBaseConfig = baseConfig;
      }
    },
    updateOrgLevel() {
      this.queryData.orgLevel = [];
      let currentOrgId =
        this.queryData.orgId || this.$utilPublic.getUserInfo().orgId;
      let currentOrgLevel = this.$utilAll.getOrgIdLevel(currentOrgId);
      this.showOrgLevel = this.orgLevel.filter((item) => {
        return (
          this.isQueryAll === "1" &&
          Number(currentOrgLevel) < this.rwBaseConfig.orgLevel &&
          Number(item.key) <= this.rwBaseConfig.orgLevel &&
          Number(item.key) >= Number(currentOrgLevel)
        );
      });

      console.log("showOrgLevel", this.showOrgLevel);
    },
    // 获取机构翻译
    getOrgName(orgId) {
      let _this = this;
      // 参数
      let dataParams = {
        id: orgId
      };
      // Lambda写法
      getOrganDetail(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            this.factorData.orgName = data.vo.name;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        });
    },
    // input获得焦点
    handleInputFocus() {
      let _this = this;
      _this.visible = true;
      _this.$emit("currentOpening", _this);
      if (this.orgId) {
        this.queryData.orgId = this.orgId;
        if (!this.orgName) {
          this.getOrgName(this.orgId);
        }
      }
      if (this.orgName) {
        this.factorData.orgName = this.orgName;
      }
      if (["1"].includes(this.isQueryAll)) {
        this.queryData.isQueryAll = "1";
        this.queryData.ckbj = false;
        _this.updateOrgLevel();
      } else if (["2"].includes(this.isQueryAll)) {
        this.queryData.isQueryAll = "1";
        this.queryData.ckbj = true;
      } else {
        this.queryData.isQueryAll = "0";
        this.queryData.ckbj = false;
      }

      _this.loadList();
    },
    // 获取数据列表
    loadList() {
      let _this = this;
      _this.loading = true;
      // 参数
      let currentOrgLevel = _this.orgLevel
        .filter((item) => _this.queryData.orgLevel.includes(item.key))
        .reduce((acc, item) => acc.concat(item.value), []);

      let dataParams = {
        ..._this.queryData,
        ..._this.factorData,
        ..._this.pageOptions,
        baseOrgLevel: _this.rwBaseConfig.orgLevel,
        orgLevel: currentOrgLevel,
        isQueryZrq: _this.isQueryZrq ? "1" : ""
      };
      getPageSelect(dataParams)
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

      this.factorData.orgName = "";

      if (this.orgId) {
        this.queryData.orgId = this.orgId;
        if (!this.orgName) {
          this.getOrgName(this.orgId);
        }
      }
      if (this.orgName) {
        this.factorData.orgName = this.orgName;
      }
      if (this.isQueryAll) {
        this.queryData.isQueryAll = this.isQueryAll;
      }
    },
    // input清空
    handleInputClear() {
      if (this.multiple) {
        this.$emit("input", []);
        this.$emit("update:modelText", []);
        this.$emit("currentChanged", []);
      } else {
        this.$emit("input", "");
        this.$emit("update:modelText", "");
        this.$emit("currentChanged", "");
      }
      this.triggerValidateField();
    },
    // tag关闭
    handleTagClose() {
      if (this.multiple) {
        this.multipleData = [];
        this.triggerClearSelection();
      } else {
        this.$emit("input", "");
        this.$emit("update:modelText", "");
        this.$emit("currentChanged", "");
        this.triggerValidateField();
      }
    },
    // 单选
    handleChecked(index, row) {
      this.visible = false;
      this.input = row.vo.xm;
      if (this.valueField === "vo.gmsfhm") {
        this.$emit("input", row.vo.gmsfhm); //触发 input 事件，并传入新值
      } else {
        this.$emit("input", row.vo.id); //触发 input 事件，并传入新值
      }
      this.$emit("update:modelText", row.vo.xm);
      this.$emit("currentChanged", row);
      this.triggerValidateField();
    },
    // selection回显
    toggleSelection() {
      let _this = this;
      if (_this.$refs.tableRef) {
        let selections = [];
        if (!_this.multipleData) {
          _this.multipleData = [];
        }
        _this.multipleData.forEach((item) => {
          let currentSelections = _this.tableData.find(
            (e) =>
              this.$utilStr.getValueOfDeepObj(e, this.valueField) ===
              this.$utilStr.getValueOfDeepObj(item, this.valueField)
          );
          if (currentSelections) {
            selections.push(currentSelections);
          }
        });
        let surplusSelections = _this.multipleData;
        _this.tableData.forEach((item) => {
          surplusSelections = surplusSelections.filter(
            (e) =>
              this.$utilStr.getValueOfDeepObj(e, this.valueField) !==
              this.$utilStr.getValueOfDeepObj(item, this.valueField)
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
          selections = selections.filter(
            (e) =>
              this.$utilStr.getValueOfDeepObj(e, this.valueField) !==
              this.$utilStr.getValueOfDeepObj(item, this.valueField)
          );
        });
        val.forEach((item) => {
          selections = selections.filter(
            (e) =>
              this.$utilStr.getValueOfDeepObj(e, this.valueField) !==
              this.$utilStr.getValueOfDeepObj(item, this.valueField)
          );
        });
        _this.multipleData = val.concat(selections);
      }
    },
    // selection全选
    handleSelectAll(val) {
      let _this = this;
      if (_this.triggerSelectionValidate(val)) {
        let selections = _this.multipleData;
        _this.tableData.forEach((item) => {
          selections = selections.filter(
            (e) =>
              this.$utilStr.getValueOfDeepObj(e, this.valueField) !==
              this.$utilStr.getValueOfDeepObj(item, this.valueField)
          );
        });
        val.forEach((item) => {
          selections = selections.filter(
            (e) =>
              this.$utilStr.getValueOfDeepObj(e, this.valueField) !==
              this.$utilStr.getValueOfDeepObj(item, this.valueField)
          );
        });
        _this.multipleData = val.concat(selections);
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
      if (_this.limit > 0) {
        if (val.length > _this.limit) {
          _this.$message({
            showClose: true,
            customClass: "is-fixed",
            message: "超出多选限制，最多选择[" + _this.limit + "]项数据",
            type: "error"
          });
          val.slice(_this.limit).forEach((row) => {
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
      this.input = this.$utilStr.splitArray(
        this.$utilStr.objArrayToArray(this.multipleData, this.labelField)
      );
      this.$emit(
        "input",
        this.$utilStr.objArrayToArray(this.multipleData, this.valueField)
      ); //触发 input 事件，并传入新值
      this.$emit(
        "update:modelText",
        this.$utilStr.objArrayToArray(this.multipleData, this.labelField)
      );
      this.$emit("currentChanged", this.multipleData);
      this.triggerValidateField();
      if (this.constDataEnabled) {
        this.constDataEnabled = false;
      }
      if (this.currentSelection) {
        this.constData = this.multipleData;
      }
    },
    // 取消
    cancelForm() {
      this.visible = false;
      if (this.multiple) {
        this.resetForm();
      }
    },
    // 重置
    resetForm() {
      if (this.currentSelection.length > 0) {
        this.multipleData = this.currentSelection;
      } else {
        this.multipleData = this.constData;
      }
      this.toggleSelection();
      this.pageOptions.current = 1;
    }
  }
};
</script>

<style scoped></style>
