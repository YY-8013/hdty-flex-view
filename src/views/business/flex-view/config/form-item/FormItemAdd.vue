<template>
  <el-dialog
    title="新增表单项配置"
    :visible.sync="visible"
    custom-class="hdty-dialog-medium new-form"
    append-to-body
  >
    <div class="con-form-anchor">
      <div class="con-anchor">
        <div class="inner">
          <div v-for="anchorItem in anchorList" :key="anchorItem.id">
            <div
              v-if="anchorItem.show"
              class="anchor-item anchor-item-menu"
              :class="{ 'is-active': activeAnchor === anchorItem.id }"
            >
              <a
                href="javascript:;"
                @click.prevent="handleAnchor(anchorItem.id)"
              >
                <i :class="anchorItem.iconClass"></i>
                <p>{{ anchorItem.label }}</p>
              </a>
            </div>
          </div>
          <div class="anchor-item">
            <a href="javascript:;" @click.prevent="handleAnchor('top')">
              <i class="el-icon-caret-top"></i>
              <p>返回顶部</p>
            </a>
          </div>
        </div>
      </div>
      <div class="con-form">
        <hd-pane fit v-loading="loading" :id="formId">
          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-width="0"
            @keyup.enter.native="submitForm"
          >
            <hd-component :model="extendData" ref="componentRef">
              <biz-form-card title="基本信息" :id="anchorList[0].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item label="组件类型" :required="true" :span="12">
                      <el-form-item prop="itemType">
                        <el-select
                          v-model="formData.itemType"
                          placeholder="请选择组件类型"
                          filterable
                        >
                          <el-option
                            v-for="item in itemTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </biz-form-item>
                    <biz-form-item
                      label="组件排序"
                      :required="false"
                      :span="12"
                    >
                      <el-form-item prop="itemOrder">
                        <hd-input-number
                          v-model="formData.itemOrder"
                          :min="0"
                          :max="9999"
                          controls-position="right"
                          placeholder="请输入排序号"
                          style="width: 100%"
                        >
                        </hd-input-number>
                      </el-form-item>
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="组件标签"
                      :required="true"
                      :span="24"
                      pClass="p-divs"
                    >
                      <el-form-item prop="itemLabel">
                        <el-input
                          v-model="formData.itemLabel"
                          placeholder="请输入组件标签"
                          maxlength="200"
                          clearable
                        >
                        </el-input>
                      </el-form-item>
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="属&ensp;性&ensp;名"
                      :required="true"
                      :span="24"
                      pClass="p-divs"
                    >
                      <el-form-item prop="itemProp">
                        <el-input
                          v-model="formData.itemProp"
                          placeholder="请输入属性名(英文字段名)"
                          maxlength="200"
                          clearable
                        >
                        </el-input>
                      </el-form-item>
                    </biz-form-item>
                  </biz-form-row>
                </biz-form>
              </biz-form-card>

              <biz-form-card title="数据映射" :id="anchorList[1].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item
                      label="是否映射表字段"
                      :required="false"
                      :span="24"
                      pClass="p-divs"
                    >
                      <el-form-item prop="isFixed">
                        <hd-dict-radio
                          v-model="formData.isFixed"
                          :dict-code="$global.dictType.isOrNot"
                          @change="handleFixedChange"
                        >
                        </hd-dict-radio>
                      </el-form-item>
                    </biz-form-item>
                  </biz-form-row>
                  <template v-if="formData.isFixed === '1'">
                    <biz-form-row>
                      <biz-form-item
                        label="列&ensp;类&ensp;型"
                        :required="true"
                        :span="12"
                      >
                        <el-form-item prop="keyType">
                          <el-select
                            v-model="formData.keyType"
                            placeholder="请选择列类型"
                          >
                            <el-option
                              v-for="item in keyTypeOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </biz-form-item>
                      <biz-form-item
                        label="数据类型"
                        :required="true"
                        :span="12"
                      >
                        <el-form-item prop="dataType">
                          <el-select
                            v-model="formData.dataType"
                            placeholder="请选择数据类型"
                          >
                            <el-option
                              v-for="item in dataTypeOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </biz-form-item>
                    </biz-form-row>
                    <biz-form-row>
                      <biz-form-item
                        label="映射列名"
                        :required="true"
                        :span="24"
                        pClass="p-divs"
                      >
                        <el-form-item prop="tableKey">
                          <el-popover
                            placement="bottom-start"
                            width="700"
                            trigger="click"
                            v-model="tableKeyPopoverVisible"
                            popper-class="table-key-popover"
                          >
                            <div class="table-key-selector">
                              <div class="selector-container">
                                <!-- 左侧分类列表 -->
                                <div class="category-list">
                                  <div
                                    v-for="(group, index) in tableKeyOptions"
                                    :key="index"
                                    class="category-item"
                                    :class="{
                                      active: selectedCategoryIndex === index
                                    }"
                                    @click="selectCategory(index)"
                                  >
                                    <i class="el-icon-folder-opened"></i>
                                    <span>{{ group.label }}</span>
                                    <span class="count"
                                      >({{ group.options.length }})</span
                                    >
                                  </div>
                                </div>
                                <!-- 右侧字段列表 -->
                                <div class="field-list">
                                  <div class="field-search">
                                    <el-input
                                      v-model="fieldSearchKeyword"
                                      placeholder="搜索字段名、类型或描述"
                                      prefix-icon="el-icon-search"
                                      size="small"
                                      clearable
                                    >
                                    </el-input>
                                  </div>
                                  <div class="field-items">
                                    <div
                                      v-for="item in filteredFieldOptions"
                                      :key="item.value"
                                      class="field-item"
                                      :class="{
                                        selected:
                                          formData.tableKey === item.value
                                      }"
                                      @click="selectField(item)"
                                    >
                                      <span class="field-name">{{
                                        item.label
                                      }}</span>
                                      <span class="field-type">{{
                                        item.type
                                      }}</span>
                                      <span class="field-desc">{{
                                        item.desc
                                      }}</span>
                                    </div>
                                    <div
                                      v-if="filteredFieldOptions.length === 0"
                                      class="empty-text"
                                    >
                                      暂无匹配的字段
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <el-input
                              slot="reference"
                              v-model="formData.tableKey"
                              placeholder="请选择映射列名"
                              clearable
                            >
                            </el-input>
                          </el-popover>
                        </el-form-item>
                      </biz-form-item>
                    </biz-form-row>
                    <biz-form-row>
                      <biz-form-item
                        label="字典类型"
                        :required="formData.keyType === 'dict'"
                        :span="24"
                        pClass="p-divs"
                      >
                        <el-form-item prop="dicType">
                          <el-input
                            v-model="formData.dicType"
                            placeholder="字典类型编码"
                            maxlength="100"
                            clearable
                            :disabled="formData.keyType !== 'dict'"
                          >
                          </el-input>
                        </el-form-item>
                      </biz-form-item>
                    </biz-form-row>
                  </template>
                </biz-form>
              </biz-form-card>

              <biz-form-card title="组件配置" :id="anchorList[2].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item
                      label="组件配置JSON"
                      :required="false"
                      :span="24"
                      pClass="p-divs"
                    >
                      <el-form-item prop="itemConfig">
                        <hd-json-editor
                          v-model="formData.itemConfig"
                          height="300"
                          maxlength="4000"
                          type="String"
                        >
                        </hd-json-editor>
                      </el-form-item>
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="备&emsp;&emsp;注"
                      :required="false"
                      :span="24"
                      pClass="p-divs"
                    >
                      <el-form-item prop="memo">
                        <el-input
                          type="textarea"
                          v-model="formData.memo"
                          :autosize="{ minRows: 2, maxRows: 5 }"
                          placeholder="请输入备注信息"
                          maxlength="500"
                        >
                        </el-input>
                      </el-form-item>
                    </biz-form-item>
                  </biz-form-row>
                </biz-form>
              </biz-form-card>
            </hd-component>
          </el-form>
        </hd-pane>
      </div>
    </div>

    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdForm } from "@/utils/util-framework";
import anchorScroll from "@/views/global/mixin/anchorScroll.js";
import { add } from "./api";
import {
  ITEM_TYPE_OPTIONS,
  KEY_TYPE_OPTIONS,
  DATA_TYPE_OPTIONS,
  YES_NO_OPTIONS,
  TABLE_KEY_OPTIONS
} from "./constants";

export default {
  name: "FormItemAdd",
  provide() {
    return {
      hdAdd: this
    };
  },
  inject: ["hdList"],
  mixins: [hdForm, anchorScroll],
  props: {
    formRow: {
      type: Object,
      default: () => ({ vo: {}, vox: {} })
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      formData: {
        formId: "",
        itemType: "",
        itemLabel: "",
        itemProp: "",
        itemOrder: 0,
        isFixed: "0",
        tableKey: "",
        keyType: "",
        dataType: "",
        dicType: "",
        itemConfig: {
          placeholder: "",
          defaultValue: ""
        },
        memo: ""
      },
      extendData: {},
      rules: {
        itemType: [
          { required: true, message: "请选择组件类型", trigger: "change" }
        ],
        itemLabel: [
          { required: true, message: "请输入组件标签", trigger: "blur" },
          {
            min: 1,
            max: 200,
            message: "长度在 1 到 200 个字符",
            trigger: "blur"
          }
        ],
        itemProp: [
          { required: true, message: "请输入属性名", trigger: "blur" },
          {
            min: 1,
            max: 200,
            message: "长度在 1 到 200 个字符",
            trigger: "blur"
          }
        ],
        tableKey: [
          {
            validator: (rule, value, callback) => {
              if (this.formData.isFixed === "1" && !value) {
                callback(new Error("请输入映射列名"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        keyType: [
          {
            validator: (rule, value, callback) => {
              if (this.formData.isFixed === "1" && !value) {
                callback(new Error("请选择列类型"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        dataType: [
          {
            validator: (rule, value, callback) => {
              if (this.formData.isFixed === "1" && !value) {
                callback(new Error("请选择数据类型"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        dicType: [
          {
            validator: (rule, value, callback) => {
              if (this.formData.keyType === "dict" && !value) {
                callback(new Error("请输入字典类型编码"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      },
      formId: "form" + this.$utilStr.uuid(32),
      anchorIds: [],
      activeAnchor: "",
      clickAnchor: false,
      anchorList: [
        {
          label: "基本信息",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-document",
          show: true
        },
        {
          label: "数据映射",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-connection",
          show: true
        },
        {
          label: "组件配置",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-edit",
          show: true
        }
      ],
      itemTypeOptions: ITEM_TYPE_OPTIONS,
      keyTypeOptions: KEY_TYPE_OPTIONS,
      dataTypeOptions: DATA_TYPE_OPTIONS,
      yesNoOptions: YES_NO_OPTIONS,
      tableKeyOptions: TABLE_KEY_OPTIONS,
      // 映射列名选择器相关
      tableKeyPopoverVisible: false,
      selectedCategoryIndex: 0,
      fieldSearchKeyword: ""
    };
  },
  computed: {
    // 过滤后的字段选项
    filteredFieldOptions() {
      if (!this.tableKeyOptions[this.selectedCategoryIndex]) {
        return [];
      }

      const options = this.tableKeyOptions[this.selectedCategoryIndex].options;

      if (!this.fieldSearchKeyword) {
        return options;
      }

      const keyword = this.fieldSearchKeyword.toLowerCase();
      return options.filter((item) => {
        return (
          item.label.toLowerCase().includes(keyword) ||
          item.type.toLowerCase().includes(keyword) ||
          item.desc.toLowerCase().includes(keyword)
        );
      });
    }
  },

  methods: {
    beforeLoadForm() {
      this.formData.formId = this.formRow.vo.id;
      this.updateAnchorList();
      this.$nextTick(() => {
        this.initScrollBox();
      });
    },

    // 选择分类
    selectCategory(index) {
      this.selectedCategoryIndex = index;
      this.fieldSearchKeyword = "";
    },

    // 选择字段
    selectField(item) {
      this.formData.tableKey = item.value;
      this.tableKeyPopoverVisible = false;
    },

    handleFixedChange(val) {
      if (val === "0") {
        this.formData.tableKey = "";
        this.formData.keyType = "";
        this.formData.dataType = "";
        this.formData.dicType = "";
      }
    },

    submitForm() {
      this.$refs.formRef.validate((valid, error) => {
        if (valid) {
          this.loading = true;

          const dataParams = {
            ...this.formData
          };

          // 如果未映射表字段，清空相关字段
          if (dataParams.isFixed === "0") {
            dataParams.tableKey = "";
            dataParams.keyType = "";
            dataParams.dataType = "";
            dataParams.dicType = "";
          }

          add(dataParams)
            .then((response) => {
              const { success, msg } = response.data;
              if (success) {
                this.$message({
                  showClose: true,
                  customClass: "is-fixed",
                  message: msg,
                  type: "success"
                });
                this.cancelForm();
                this.$emit("refresh");
              }
            })
            .catch((error) => {
              console.error("新增失败:", error);
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          this.scrollIntoFormErrorView(error);
        }
      });
    },

    cancelForm() {
      this.visible = false;
      this.resetForm();
    },

    resetForm() {
      if (this.$refs.formRef) {
        this.$refs.formRef.resetFields();
      }
      if (this.$refs.componentRef) {
        this.$refs.componentRef.resetFields();
      }
    },

    updateAnchorList() {
      this.anchorIds = this.anchorList
        .filter((item) => item.show)
        .map((item) => item.id);
      this.activeAnchor = this.anchorIds[0];
    }
  }
};
</script>

<style lang="scss" scoped>
/* 映射列名选择器样式 */
::v-deep .table-key-popover {
  padding: 0 !important;
}

.table-key-selector {
  .selector-container {
    display: flex;
    height: 400px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    overflow: hidden;

    /* 左侧分类列表 */
    .category-list {
      width: 200px;
      background: #f5f7fa;
      border-right: 1px solid #e4e7ed;
      overflow-y: auto;

      .category-item {
        padding: 12px 16px;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        border-left: 3px solid transparent;

        i {
          margin-right: 8px;
          color: #909399;
          font-size: 16px;
        }

        span {
          font-size: 14px;
          color: #606266;
        }

        .count {
          margin-left: auto;
          font-size: 12px;
          color: #909399;
        }

        &:hover {
          background: #e6f7ff;
        }

        &.active {
          background: #fff;
          border-left-color: #409eff;

          span {
            color: #409eff;
            font-weight: 600;
          }

          i {
            color: #409eff;
          }
        }
      }
    }

    /* 右侧字段列表 */
    .field-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #fff;

      .field-search {
        padding: 12px;
        border-bottom: 1px solid #e4e7ed;
      }

      .field-items {
        flex: 1;
        overflow-y: auto;
        padding: 8px;

        .field-item {
          display: flex;
          align-items: center;
          padding: 10px 12px;
          margin-bottom: 4px;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.3s;
          border: 1px solid transparent;

          .field-name {
            width: 140px;
            font-weight: 600;
            color: #303133;
            font-size: 14px;
            text-align: left;
          }

          .field-type {
            width: 160px;
            color: #909399;
            font-size: 12px;
            text-align: left;
          }

          .field-desc {
            flex: 1;
            color: #606266;
            font-size: 13px;
            text-align: left;
          }

          &:hover {
            background: #f5f7fa;
            border-color: #c6e2ff;
          }

          &.selected {
            background: #ecf5ff;
            border-color: #b3d8ff;

            .field-name {
              color: #409eff;
            }
          }
        }

        .empty-text {
          text-align: center;
          padding: 40px 0;
          color: #909399;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
