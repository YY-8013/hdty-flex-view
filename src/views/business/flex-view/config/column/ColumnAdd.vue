<template>
  <el-dialog
    title="新增列配置"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
    width="900px"
    @close="handleClose"
  >
    <hd-pane fit v-loading="submitting">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        style="padding-right: 20px"
      >
        <hd-component :model="extendData" ref="componentRef">
          <!-- 基本信息 -->
          <div class="form-section">
            <div class="section-title">
              <i class="el-icon-document"></i>
              <span>基本信息</span>
            </div>

            <el-row :gutter="20">
              <!-- 父节点 -->
              <el-col :span="12">
                <el-form-item label="父节点" prop="parentId">
                  <el-cascader
                    v-model="formData.parentId"
                    :options="parentOptions"
                    :props="cascaderProps"
                    placeholder="请选择父节点（留空为根节点）"
                    clearable
                    filterable
                    underline
                    style="width: 100%"
                  >
                  </el-cascader>
                </el-form-item>
              </el-col>

              <!-- 列名称 -->
              <el-col :span="12">
                <el-form-item label="列名称" prop="label">
                  <el-input
                    v-model="formData.label"
                    placeholder="请输入列名称"
                    maxlength="100"
                    show-word-limit
                    clearable
                    underline
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <!-- 数据字段 -->
              <el-col :span="12">
                <el-form-item label="数据字段" prop="prop">
                  <el-input
                    v-model="formData.prop"
                    placeholder="请输入数据字段名（叶子节点必填）"
                    maxlength="100"
                    clearable
                    underline
                  >
                    <template slot="append">
                      <el-tooltip
                        content="数据字段名用于绑定统计数据,只有叶子节点需要填写"
                        placement="top"
                      >
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>

              <!-- 排序号 -->
              <el-col :span="12">
                <el-form-item label="排序号" prop="sortNum">
                  <hd-input-number
                    v-model="formData.sortNum"
                    :min="0"
                    :max="9999"
                    controls-position="right"
                    placeholder="请输入排序号"
                    underline
                    style="width: 100%"
                  >
                  </hd-input-number>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <!-- 备注 -->
              <el-col :span="24">
                <el-form-item label="备注" prop="memo">
                  <el-input
                    type="textarea"
                    v-model="formData.memo"
                    :rows="2"
                    placeholder="请输入备注信息"
                    maxlength="500"
                    show-word-limit
                    underline
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 显示配置 -->
          <div class="form-section">
            <div class="section-title">
              <i class="el-icon-setting"></i>
              <span>显示配置</span>
            </div>

            <el-row :gutter="20">
              <!-- 列宽 -->
              <el-col :span="8">
                <el-form-item label="列宽" prop="columnWidth">
                  <hd-input-number
                    v-model="formData.columnWidth"
                    :min="60"
                    :max="500"
                    controls-position="right"
                    placeholder="请输入列宽(px)"
                    underline
                    style="width: 100%"
                  >
                  </hd-input-number>
                </el-form-item>
              </el-col>

              <!-- 对齐方式 -->
              <el-col :span="8">
                <el-form-item label="对齐方式" prop="align">
                  <el-select
                    v-model="formData.align"
                    placeholder="请选择对齐方式"
                    clearable
                    underline
                    style="width: 100%"
                  >
                    <el-option label="左对齐" value="left"></el-option>
                    <el-option label="居中" value="center"></el-option>
                    <el-option label="右对齐" value="right"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- 固定列 -->
              <el-col :span="8">
                <el-form-item label="固定列" prop="fixed">
                  <el-select
                    v-model="formData.fixed"
                    placeholder="请选择固定位置"
                    clearable
                    underline
                    style="width: 100%"
                  >
                    <el-option label="左侧固定" value="left"></el-option>
                    <el-option label="右侧固定" value="right"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <!-- 是否可排序 -->
              <el-col :span="8">
                <el-form-item label="是否可排序" prop="sortable">
                  <el-select
                    v-model="formData.sortable"
                    placeholder="请选择"
                    underline
                    style="width: 100%"
                  >
                    <el-option label="否" value="false"></el-option>
                    <el-option label="是" value="true"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- 默认展开 -->
              <el-col :span="8">
                <el-form-item label="默认展开" prop="defaultExpand">
                  <el-select
                    v-model="formData.defaultExpand"
                    placeholder="请选择"
                    underline
                    style="width: 100%"
                  >
                    <el-option label="是" value="true"></el-option>
                    <el-option label="否" value="false"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- 关联表单 -->
              <el-col :span="8">
                <el-form-item label="关联表单" prop="formId">
                  <el-select
                    v-model="formData.formId"
                    placeholder="请选择关联表单"
                    clearable
                    filterable
                    underline
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
              </el-col>
            </el-row>
          </div>

          <!-- 列前端配置 -->
          <div class="form-section">
            <div class="section-title">
              <i class="el-icon-edit"></i>
              <span>列前端配置 (JSON)</span>
              <el-tooltip
                content="配置列的样式、格式化、条件显示等前端渲染属性"
                placement="top"
              >
                <i
                  class="el-icon-question"
                  style="margin-left: 8px; cursor: help"
                ></i>
              </el-tooltip>
            </div>

            <el-row>
              <el-col :span="24">
                <el-form-item label="列配置JSON" prop="columnConfig">
                  <el-input
                    type="textarea"
                    v-model="formData.columnConfig"
                    :rows="6"
                    placeholder='例: {"formatter":{"type":"number","precision":2}}'
                    underline
                  >
                  </el-input>
                  <div class="config-tips">
                    <el-alert
                      title="配置说明"
                      type="info"
                      :closable="false"
                      style="margin-top: 10px"
                    >
                      <div slot="title">
                        <p>常用配置示例:</p>
                        <pre style="margin: 5px 0; font-size: 12px">
格式化数字: {"formatter":{"type":"number","precision":2}}
百分比显示: {"formatter":{"type":"percent","precision":2,"suffix":"%"}}
可点击样式: {"click":{"enabled":true,"style":{"cursor":"pointer","color":"#409EFF"}}}
条件格式: {"conditional":{"rules":[{"condition":"value >= 95","style":{"color":"#67C23A"}}]}}
                        </pre>
                      </div>
                    </el-alert>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 状态 -->
          <div class="form-section">
            <div class="section-title">
              <i class="el-icon-switch-button"></i>
              <span>状态设置</span>
            </div>

            <el-row :gutter="20">
              <!-- 启用状态 -->
              <el-col :span="12">
                <el-form-item label="启用状态" prop="status">
                  <el-radio-group v-model="formData.status">
                    <el-radio label="1">启用</el-radio>
                    <el-radio label="0">停用</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>

              <!-- 状态备注 -->
              <el-col :span="12">
                <el-form-item label="状态备注" prop="statusRemark">
                  <el-input
                    v-model="formData.statusRemark"
                    placeholder="请输入状态备注"
                    maxlength="200"
                    clearable
                    underline
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </hd-component>
      </el-form>
    </hd-pane>

    <!-- 底部按钮 -->
    <div slot="footer" class="hdty-btn-container">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { hdForm } from "@/utils/util-framework";
import { addColumn, getColumnTree, getFormList } from "../../api/column";

export default {
  name: "ColumnAdd",
  moduleName: "ColumnConfigList",
  provide() {
    return {
      hdAdd: this
    };
  },
  inject: ["hdList"],
  mixins: [hdForm],
  data() {
    return {
      // 弹窗显示状态
      visible: false,
      // 提交中状态
      submitting: false,
      // 表单数据
      formData: {
        parentId: null,
        label: "",
        prop: "",
        columnWidth: null,
        align: "center",
        fixed: null,
        sortable: "false",
        defaultExpand: "true",
        formId: null,
        columnConfig: null,
        sortNum: 0,
        status: "1",
        statusRemark: "",
        memo: ""
      },
      // 扩展数据
      extendData: {},
      // 验证规则
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
        status: [
          { required: true, message: "请选择启用状态", trigger: "change" }
        ],
        columnConfig: [{ validator: this.validateJSON, trigger: "blur" }]
      },
      // 父节点选项
      parentOptions: [],
      // 级联选择器配置
      cascaderProps: {
        value: "id",
        label: "label",
        children: "children",
        checkStrictly: true,
        emitPath: false
      },
      // 表单选项
      formOptions: []
    };
  },
  methods: {
    /**
     * 加载表单前的准备工作
     */
    beforeLoadForm() {
      this.resetForm();
      this.loadParentOptions();
      this.loadFormOptions();
    },

    /**
     * 加载父节点选项
     */
    loadParentOptions() {
      getColumnTree()
        .then((response) => {
          const { success, data } = response.data;
          if (success) {
            this.parentOptions = data || [];
          }
        })
        .catch((error) => {
          console.error("加载父节点选项失败:", error);
        });
    },

    /**
     * 加载表单选项
     */
    loadFormOptions() {
      getFormList()
        .then((response) => {
          const { success, data } = response.data;
          if (success) {
            this.formOptions = data || [];
          }
        })
        .catch((error) => {
          console.error("加载表单选项失败:", error);
        });
    },

    /**
     * 提交表单
     */
    handleSubmit() {
      this.$refs.formRef.validate((valid, error) => {
        if (valid) {
          this.submitting = true;

          // 构建提交数据
          const dataParams = {
            ...this.formData
          };

          // 如果父节点为空,设置为null
          if (!dataParams.parentId) {
            dataParams.parentId = null;
          }

          addColumn(dataParams)
            .then((response) => {
              const { success, msg } = response.data;
              if (success) {
                this.$message({
                  showClose: true,
                  customClass: "is-fixed",
                  message: msg,
                  type: "success"
                });
                this.handleCancel();
                this.$emit("refresh");
              }
            })
            .catch((error) => {
              console.error("新增失败:", error);
            })
            .finally(() => {
              this.submitting = false;
            });
        } else {
          this.scrollIntoFormErrorView(error);
        }
      });
    },

    /**
     * 取消
     */
    handleCancel() {
      this.visible = false;
      this.resetForm();
    },

    /**
     * 关闭弹窗
     */
    handleClose() {
      this.resetForm();
    },

    /**
     * 重置表单
     */
    resetForm() {
      if (this.$refs.formRef) {
        this.$refs.formRef.resetFields();
      }
      if (this.$refs.componentRef) {
        this.$refs.componentRef.resetFields();
      }

      // 重置为初始值
      this.formData = {
        parentId: null,
        label: "",
        prop: "",
        columnWidth: null,
        align: "center",
        fixed: null,
        sortable: "false",
        defaultExpand: "true",
        formId: null,
        columnConfig: null,
        sortNum: 0,
        status: "1",
        statusRemark: "",
        memo: ""
      };
      this.extendData = {};
    },

    /**
     * 验证JSON格式
     * @param {Object} rule - 验证规则
     * @param {String} value - 值
     * @param {Function} callback - 回调函数
     */
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

<style lang="scss" scoped>
/* 表单分组样式 */
.form-section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;

  .section-title {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    font-size: 15px;
    font-weight: bold;
    color: #303133;

    i {
      margin-right: 8px;
      color: #409eff;
      font-size: 16px;
    }
  }

  &:last-child {
    margin-bottom: 0;
  }
}

/* 配置提示样式 */
.config-tips {
  ::v-deep .el-alert {
    .el-alert__title {
      font-size: 12px;
      line-height: 1.5;

      p {
        margin: 0 0 5px 0;
        font-weight: bold;
      }

      pre {
        background-color: #f5f5f5;
        padding: 8px;
        border-radius: 4px;
        overflow-x: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    }
  }
}

/* 覆盖级联选择器样式 */
::v-deep .el-cascader {
  width: 100%;
}
</style>
