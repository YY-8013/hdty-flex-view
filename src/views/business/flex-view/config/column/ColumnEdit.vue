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
                    <biz-form-item
                      label="父节点"
                      :required="false"
                      :span="24"
                      pClass="p-divs"
                    >
                      <el-form-item prop="parentId">
                        <el-cascader
                          v-model="formData.parentId"
                          :options="parentOptions"
                          :props="cascaderProps"
                          placeholder="请选择父节点(留空为根节点)"
                          clearable
                          filterable
                          style="width: 100%"
                        >
                        </el-cascader>
                      </el-form-item>
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="列名称"
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
                    <biz-form-item label="排序号" :required="true" :span="12">
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
                    <biz-form-item label="列宽" :required="false" :span="12">
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
                    <biz-form-item label="对齐方式" :required="true" :span="12">
                      <el-form-item prop="align">
                        <el-select
                          v-model="formData.align"
                          placeholder="请选择对齐方式"
                          clearable
                          style="width: 100%"
                        >
                          <el-option
                            v-for="item in alignOptions"
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
                    <biz-form-item label="固定列" :required="false" :span="12">
                      <el-form-item prop="fixed">
                        <el-select
                          v-model="formData.fixed"
                          placeholder="请选择固定位置"
                          clearable
                          style="width: 100%"
                        >
                          <el-option
                            v-for="item in fixedOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          >
                          </el-option>
                        </el-select>
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
                    <biz-form-item label="默认展开" :required="true" :span="12">
                      <el-form-item prop="defaultExpand">
                        <hd-dict-radio
                          v-model="formData.defaultExpand"
                          :dict-code="$global.dictType.isOrNot"
                        >
                        </hd-dict-radio>
                      </el-form-item>
                    </biz-form-item>
                    <biz-form-item
                      label="关联表单"
                      :required="false"
                      :span="12"
                    >
                      <el-form-item prop="formId">
                        <el-select
                          v-model="formData.formId"
                          placeholder="请选择关联表单"
                          clearable
                          filterable
                          style="width: 100%"
                        >
                          <el-option
                            v-for="item in formOptions"
                            :key="item.id"
                            :label="item.formName"
                            :value="item.id"
                          >
                          </el-option>
                        </el-select>
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
                          height="200"
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
                          height="250"
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
        id: "",
        parentId: null,
        label: "",
        prop: "",
        columnWidth: null,
        align: "center",
        fixed: null,
        sortable: "0",
        defaultExpand: "1",
        formId: null,
        calcType: null,
        calcRule: null,
        columnConfig: null,
        sortNum: 0,
        memo: ""
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
        align: [
          { required: true, message: "请选择对齐方式", trigger: "change" }
        ],
        sortable: [
          { required: true, message: "请选择是否可排序", trigger: "change" }
        ],
        defaultExpand: [
          { required: true, message: "请选择默认展开状态", trigger: "change" }
        ],
        sortNum: [{ required: true, message: "请输入排序号", trigger: "blur" }],

        calcRule: [{ validator: this.validateJSON, trigger: "blur" }],
        columnConfig: [{ validator: this.validateJSON, trigger: "blur" }]
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
        id: _this.row.vo.id
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
      this.$refs.formRef.validate((valid, error) => {
        if (valid) {
          this.loading = true;

          const dataParams = {
            ...this.formData
          };

          if (!dataParams.parentId) {
            dataParams.parentId = null;
          }

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
