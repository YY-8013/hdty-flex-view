<template>
  <el-dialog
    title="编辑列配置"
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
      <div class="con-form" v-if="visible">
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
                    <biz-form-item
                      label="父&ensp;节&ensp;点"
                      :required="false"
                      :span="24"
                      pClass="p-divs"
                    >
                      <el-form-item prop="parentId">
                        <biz-view-column-tree
                          v-model="formData.parentId"
                          :model-text.sync="extendData.parentId"
                        ></biz-view-column-tree>
                      </el-form-item>
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="列&ensp;名&ensp;称"
                      :required="true"
                      :span="24"
                      pClass="p-divs"
                    >
                      <el-form-item prop="label">
                        <el-input
                          v-model="formData.label"
                          placeholder="请输入列名称"
                          maxlength="100"
                          show-word-limit
                          clearable
                        >
                        </el-input>
                      </el-form-item>
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="属&ensp;性&ensp;名"
                      :required="false"
                      :span="12"
                    >
                      <el-form-item prop="prop">
                        <el-input
                          v-model="formData.prop"
                          placeholder="请输入属性名名"
                          maxlength="100"
                          clearable
                        >
                        </el-input>
                      </el-form-item>
                    </biz-form-item>
                    <biz-form-item
                      label="排&emsp;&emsp;序"
                      :required="true"
                      :span="12"
                    >
                      <el-form-item prop="sortNum">
                        <hd-input-number
                          v-model="formData.sortNum"
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

              <biz-form-card title="显示配置" :id="anchorList[1].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item
                      label="列&emsp;&emsp;宽"
                      :required="false"
                      :span="12"
                    >
                      <el-form-item prop="columnWidth">
                        <hd-input-number
                          v-model="formData.columnWidth"
                          :min="60"
                          :max="500"
                          controls-position="right"
                          placeholder="请输入列宽(px)"
                          style="width: 100%"
                        >
                        </hd-input-number>
                      </el-form-item>
                    </biz-form-item>
                    <biz-form-item
                      label="对齐方式"
                      :required="false"
                      :span="12"
                    >
                      <el-form-item prop="align">
                        <hd-dict-select
                          v-model="formData.align"
                          :model-text.sync="extendData.align"
                          :dict-code="$global.dictType.columnDqfs"
                        ></hd-dict-select>
                      </el-form-item>
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="固&ensp;定&ensp;列"
                      :required="false"
                      :span="12"
                    >
                      <el-form-item prop="fixed">
                        <hd-dict-select
                          v-model="formData.fixed"
                          :model-text.sync="extendData.fixed"
                          :dict-code="$global.dictType.columnGdl"
                        ></hd-dict-select>
                      </el-form-item>
                    </biz-form-item>
                    <biz-form-item
                      label="是否可排序"
                      :required="true"
                      :span="12"
                    >
                      <el-form-item prop="sortable">
                        <hd-dict-radio
                          v-model="formData.sortable"
                          :dict-code="$global.dictType.isOrNot"
                        >
                        </hd-dict-radio>
                      </el-form-item>
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="关联表单"
                      :required="false"
                      :span="12"
                    >
                      <el-form-item prop="formId">
                        <biz-view-form-select
                          v-model="formData.formId"
                          :model-text.sync="extendData.formId"
                          ref="formSelectRef"
                          placeholder="请选择表单"
                        ></biz-view-form-select>
                      </el-form-item>
                    </biz-form-item>
                    <biz-form-item label="默认展开" :required="true" :span="12">
                      <el-form-item prop="defaultExpand">
                        <hd-dict-radio
                          v-model="formData.defaultExpand"
                          :dict-code="$global.dictType.isOrNot"
                        >
                        </hd-dict-radio>
                      </el-form-item>
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row v-if="formData.formId">
                    <biz-form-item
                      label="关联表单项"
                      :required="false"
                      :span="24"
                    >
                      <el-form-item prop="formItemId">
                        <biz-view-form-item-select
                          v-model="formData.formItemId"
                          :model-text.sync="extendData.formItemId"
                          :form-id="formData.formId"
                          placeholder="请选择表单项"
                        ></biz-view-form-item-select>
                      </el-form-item>
                    </biz-form-item>
                  </biz-form-row>
                </biz-form>
              </biz-form-card>

              <biz-form-card title="计算配置" :id="anchorList[2].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item
                      label="计算类型"
                      :required="false"
                      :span="24"
                      pClass="p-divs"
                    >
                      <el-form-item prop="calcType">
                        <el-select
                          v-model="formData.calcType"
                          placeholder="请选择计算类型"
                          clearable
                          style="width: 100%"
                        >
                          <el-option
                            v-for="item in calcTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          >
                            <span style="float: left">{{ item.label }}</span>
                            <span
                              style="
                                float: right;
                                color: #8492a6;
                                font-size: 13px;
                              "
                              >{{ item.desc }}</span
                            >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="计算规则"
                      :required="false"
                      :span="24"
                      pClass="p-divs"
                    >
                      <el-form-item prop="calcRule">
                        <hd-json-editor
                          v-model="formData.calcRule"
                          height="350"
                          maxlength="2000"
                          type="String"
                        >
                        </hd-json-editor>
                      </el-form-item>
                    </biz-form-item>
                  </biz-form-row>
                </biz-form>
              </biz-form-card>

              <biz-form-card title="列前端配置" :id="anchorList[3].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item
                      label="列配置JSON"
                      :required="false"
                      :span="24"
                      pClass="p-divs"
                    >
                      <el-form-item prop="columnConfig">
                        <hd-json-editor
                          v-model="formData.columnConfig"
                          height="350"
                          maxlength="4000"
                          type="String"
                        >
                        </hd-json-editor>
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
import { getColumnDetail, getColumnTree, getFormList } from "../../api/column";
import { edit, editBefore } from "./api";
import { ALIGN_OPTIONS, FIXED_OPTIONS, CALC_TYPE_OPTIONS } from "./constants";

export default {
  name: "ColumnEdit",
  moduleName: "ColumnConfigList",
  provide() {
    return {
      hdEdit: this
    };
  },
  inject: ["hdList"],
  mixins: [hdForm, anchorScroll],
  data() {
    return {
      visible: false,
      loading: false,
      row: {},
      formData: {
        calcRule: "",
        columnConfig: "",
        formItemId: ""
      },
      extendData: {},
      rules: {
        label: [
          { required: true, message: "请输入列名称", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur"
          }
        ],
        sortable: [
          { required: true, message: "请选择是否可排序", trigger: "change" }
        ],
        defaultExpand: [
          { required: true, message: "请选择默认展开状态", trigger: "change" }
        ],
        sortNum: [{ required: true, message: "请输入排序号", trigger: "blur" }],

        calcRule: [
          { required: false, message: "请输入计算规则", trigger: "blur" }
        ],
        columnConfig: [
          { required: false, message: "请输入列配置JSON", trigger: "blur" }
        ]
      },
      parentOptions: [],
      cascaderProps: {
        value: "id",
        label: "label",
        children: "children",
        checkStrictly: true,
        emitPath: false
      },
      formOptions: [],
      alignOptions: ALIGN_OPTIONS,
      fixedOptions: FIXED_OPTIONS,
      calcTypeOptions: CALC_TYPE_OPTIONS,
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
          label: "显示配置",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-setting",
          show: true
        },
        {
          label: "计算配置",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-s-data",
          show: true
        },
        {
          label: "列前端配置",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-edit",
          show: true
        }
      ]
    };
  },
  watch: {
    "formData.formId"(newVal) {
      // 当关联表单改变时，清空关联表单项的值
      if (!newVal) {
        this.formData.formItemId = "";
        this.extendData.formItemId = "";
      }
    }
  },
  methods: {
    beforeLoadForm() {
      this.updateAnchorList();
      this.$nextTick(() => {
        this.initScrollBox();
        this.resetForm();
        this.loadForm();
      });
    },

    loadForm() {
      let _this = this;
      let dataParams = {
        id: _this.row.id
      };
      _this.loading = true;

      editBefore(dataParams)
        .then((response) => {
          const { success, data } = response.data;
          if (success) {
            this.formData = {
              ...this.formData,
              ...data.vo
            };
            this.extendData = data.vox || {};
          }
        })
        .catch((error) => {
          console.error("加载详情失败:", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    filterCurrentNode(tree, currentId) {
      return tree.filter((node) => {
        if (node.id === currentId) {
          return false;
        }
        if (node.children && node.children.length > 0) {
          node.children = this.filterCurrentNode(node.children, currentId);
        }
        return true;
      });
    },

    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid, error) => {
        if (valid) {
          let dataParams = {
            ..._this.formData
          };

          // 如果没有关联表单，清空formItemId
          if (!dataParams.formId) {
            dataParams.formItemId = null;
          }

          // 使用正则表达式去除换行和多余的空格
          let cleanedJsonString1 = _this.formData.calcRule
            ? _this.formData.calcRule.replace(/\s+/g, "")
            : "";
          // 将清理后的字符串转换为JSON对象
          dataParams.calcRule = cleanedJsonString1;

          let cleanedJsonString2 = _this.formData.columnConfig
            ? _this.formData.columnConfig.replace(/\s+/g, "")
            : "";
          // 将清理后的字符串转换为JSON对象
          dataParams.columnConfig = cleanedJsonString2;

          _this.loading = true;

          edit(dataParams)
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
                this.hdList.handleQuery();
              }
            })
            .catch((error) => {
              console.error("编辑失败:", error);
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

      this.extendData = {};
    },

    updateAnchorList() {
      this.anchorIds = this.anchorList
        .filter((item) => item.show)
        .map((item) => item.id);
      this.activeAnchor = this.anchorIds[0];
    },

    validateJSON(rule, value, callback) {
      if (!value) {
        callback();
        return;
      }

      try {
        JSON.parse(value);
        callback();
      } catch (e) {
        callback(new Error("JSON格式不正确"));
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
