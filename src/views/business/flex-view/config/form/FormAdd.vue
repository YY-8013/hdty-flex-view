<template>
  <el-dialog
    title="新增表单配置"
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
                    <biz-form-item label="表单编码" :required="true" :span="14">
                      <el-form-item prop="formCode">
                        <el-input
                          v-model="formData.formCode"
                          placeholder="请输入表单编码"
                          maxlength="100"
                          clearable
                        >
                        </el-input>
                      </el-form-item>
                    </biz-form-item>
                    <biz-form-item label="表单类型" :required="true" :span="10">
                      <el-form-item prop="formType">
                        <hd-dict-select
                          v-model="formData.formType"
                          :model-text.sync="extendData.formType"
                          :dict-code="$global.dictType.formType"
                          placeholder="请选择表单类型"
                        >
                        </hd-dict-select>
                      </el-form-item>
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="表单名称"
                      :required="true"
                      :span="24"
                      pClass="p-divs"
                    >
                      <el-form-item prop="formName">
                        <el-input
                          v-model="formData.formName"
                          placeholder="请输入表单名称"
                          maxlength="200"
                          show-word-limit
                          clearable
                        >
                        </el-input>
                      </el-form-item>
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="数据存储表"
                      :required="true"
                      :span="14"
                    >
                      <el-form-item prop="dataTable">
                        <el-input
                          v-model="formData.dataTable"
                          placeholder="请输入数据表名"
                          maxlength="100"
                          clearable
                        >
                        </el-input>
                      </el-form-item>
                    </biz-form-item>
                    <biz-form-item
                      label="版&ensp;本&ensp;号"
                      :required="false"
                      :span="10"
                    >
                      <el-form-item prop="version">
                        <hd-input-number
                          v-model="formData.version"
                          :min="1"
                          :max="9999"
                          controls-position="right"
                          placeholder="请输入版本号"
                          style="width: 100%"
                        >
                        </hd-input-number>
                      </el-form-item>
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="表单说明"
                      :required="false"
                      :span="24"
                      pClass="p-divs"
                    >
                      <el-form-item prop="description">
                        <el-input
                          type="textarea"
                          v-model="formData.description"
                          :autosize="{ minRows: 2, maxRows: 5 }"
                          placeholder="请输入表单说明"
                          maxlength="500"
                        >
                        </el-input>
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

              <biz-form-card title="表单配置" :id="anchorList[1].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item
                      label="表单配置JSON"
                      :required="false"
                      :span="24"
                      pClass="p-divs"
                    >
                      <el-form-item prop="formConfig">
                        <hd-json-editor
                          v-model="formData.formConfig"
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
import { add } from "./api";

export default {
  name: "FormAdd",
  moduleName: "FormConfigList",
  provide() {
    return {
      hdAdd: this
    };
  },
  inject: ["hdList"],
  mixins: [hdForm, anchorScroll],
  data() {
    return {
      visible: false,
      loading: false,
      formData: {
        formCode: "",
        formName: "",
        dataTable: "BIZ_DATA_COMMON",
        formType: "0",
        version: 1,
        description: "",
        formConfig: {
          title: "表单"
        },
        memo: ""
      },
      extendData: { formType: "通用表单" },
      rules: {
        formCode: [
          { required: true, message: "请输入表单编码", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur"
          }
        ],
        formName: [
          { required: true, message: "请输入表单名称", trigger: "blur" },
          {
            min: 1,
            max: 200,
            message: "长度在 1 到 200 个字符",
            trigger: "blur"
          }
        ],
        formType: [
          { required: true, message: "请选择表单类型", trigger: "change" }
        ],
        dataTable: [
          { required: true, message: "请输入数据表名", trigger: "blur" }
        ],
        formConfig: []
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
          label: "表单配置",
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
      });
    },

    submitForm() {
      this.$refs.formRef.validate((valid, error) => {
        if (valid) {
          this.loading = true;

          const dataParams = {
            ...this.formData
          };

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
                this.hdList.handleQuery();
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
