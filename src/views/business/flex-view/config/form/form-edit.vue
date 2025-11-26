<template>
  <div class="hdty-container hdty-flex">
    <!-- 表单基本信息 -->
    <div class="hdty-header">
      <el-card shadow="never">
        <div slot="header">
          <span>表单基本信息</span>
        </div>
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="表单名称" prop="formName">
                <el-input
                  v-model="formData.formName"
                  placeholder="请输入表单名称"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="表单编码" prop="formCode">
                <el-input
                  v-model="formData.formCode"
                  placeholder="请输入表单编码"
                />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="表单描述" prop="formDesc">
                <el-input
                  type="textarea"
                  v-model="formData.formDesc"
                  placeholder="请输入表单描述"
                  :rows="3"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>

    <!-- 表单项列表 -->
    <div class="hdty-fit">
      <el-card shadow="never" class="form-items-card">
        <div slot="header" class="card-header">
          <span>表单项配置</span>
          <hd-button-container>
            <hd-button type="success" size="mini" @click="handleAddFormItem">
              新增表单项
            </hd-button>
          </hd-button-container>
        </div>

        <el-table
          ref="tableRef"
          :data="formItems"
          row-key="id"
          border
          stripe
          height="100%"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="60"
          />

          <el-table-column
            prop="itemLabel"
            label="字段标签"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            prop="itemProp"
            label="字段属性名"
            min-width="120"
            show-overflow-tooltip
          />

          <el-table-column
            prop="itemType"
            label="字段类型"
            min-width="100"
            align="center"
          />

          <el-table-column label="必填" align="center" width="60">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.required ? 'success' : 'info'"
                size="mini"
              >
                {{ scope.row.required ? "是" : "否" }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            width="150"
            fixed="right"
          >
            <template slot-scope="scope">
              <hd-button-container>
                <hd-button
                  type="primary"
                  size="mini"
                  @click="handleEditFormItem(scope.row, scope.$index)"
                >
                  编辑
                </hd-button>
                <hd-button
                  type="danger"
                  size="mini"
                  @click="handleDeleteFormItem(scope.$index)"
                >
                  删除
                </hd-button>
              </hd-button-container>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 底部按钮 -->
    <div class="hdty-footer">
      <hd-button-container>
        <hd-button @click="handleCancel">取消</hd-button>
        <hd-button type="primary" @click="handleSave">保存</hd-button>
      </hd-button-container>
    </div>

    <!-- 表单项编辑弹窗 -->
    <el-dialog
      :title="editFormItemMode === 'add' ? '新增表单项' : '编辑表单项'"
      :visible.sync="formItemDialogVisible"
      width="60%"
      append-to-body
    >
      <!-- TODO: 表单项编辑表单 -->
      <el-form
        ref="formItemRef"
        :model="currentFormItem"
        :rules="formItemRules"
        label-width="120px"
      >
        <el-form-item label="字段标签" prop="itemLabel">
          <el-input
            v-model="currentFormItem.itemLabel"
            placeholder="请输入字段标签"
          />
        </el-form-item>

        <el-form-item label="字段属性名" prop="itemProp">
          <el-input
            v-model="currentFormItem.itemProp"
            placeholder="请输入字段属性名"
          />
        </el-form-item>

        <el-form-item label="字段类型" prop="itemType">
          <el-select
            v-model="currentFormItem.itemType"
            placeholder="请选择字段类型"
          >
            <el-option label="文本输入" value="input" />
            <el-option label="多行文本" value="textarea" />
            <el-option label="数字输入" value="number" />
            <el-option label="下拉选择" value="select" />
            <el-option label="日期选择" value="date" />
            <el-option label="机构选择" value="organ" />
            <el-option label="地区选择" value="region" />
            <el-option label="字典下拉" value="dict-select" />
          </el-select>
        </el-form-item>

        <el-form-item label="是否必填" prop="required">
          <el-switch v-model="currentFormItem.required" />
        </el-form-item>
      </el-form>

      <div slot="footer">
        <hd-button-container>
          <hd-button @click="formItemDialogVisible = false">取消</hd-button>
          <hd-button type="primary" @click="handleSaveFormItem">保存</hd-button>
        </hd-button-container>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "FormConfigEdit",
  data() {
    return {
      // 表单基本信息
      formData: {
        formName: "",
        formCode: "",
        formDesc: ""
      },
      formRules: {
        formName: [
          { required: true, message: "请输入表单名称", trigger: "blur" }
        ],
        formCode: [
          { required: true, message: "请输入表单编码", trigger: "blur" }
        ]
      },

      // 表单项列表
      formItems: [],

      // 表单项编辑
      formItemDialogVisible: false,
      editFormItemMode: "add",
      currentFormItem: {},
      currentFormItemIndex: -1,
      formItemRules: {
        itemLabel: [
          { required: true, message: "请输入字段标签", trigger: "blur" }
        ],
        itemProp: [
          { required: true, message: "请输入字段属性名", trigger: "blur" }
        ],
        itemType: [
          { required: true, message: "请选择字段类型", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    // 初始化
    async init() {
      const { mode, id } = this.$route.query;

      if (mode === "edit" && id) {
        // 编辑模式:加载表单配置
        await this.loadFormConfig(id);
      }
    },

    // 加载表单配置
    async loadFormConfig(id) {
      // TODO: 从后端加载表单配置
    },

    // 新增表单项
    handleAddFormItem() {
      this.editFormItemMode = "add";
      this.currentFormItem = {
        itemLabel: "",
        itemProp: "",
        itemType: "input",
        required: false
      };
      this.currentFormItemIndex = -1;
      this.formItemDialogVisible = true;
    },

    // 编辑表单项
    handleEditFormItem(row, index) {
      this.editFormItemMode = "edit";
      this.currentFormItem = { ...row };
      this.currentFormItemIndex = index;
      this.formItemDialogVisible = true;
    },

    // 删除表单项
    handleDeleteFormItem(index) {
      this.$confirm("确定删除该表单项?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.formItems.splice(index, 1);
          this.$message.success("删除成功");
        })
        .catch(() => {});
    },

    // 保存表单项
    handleSaveFormItem() {
      this.$refs.formItemRef.validate((valid) => {
        if (valid) {
          if (this.editFormItemMode === "add") {
            this.formItems.push({ ...this.currentFormItem });
          } else {
            this.$set(this.formItems, this.currentFormItemIndex, {
              ...this.currentFormItem
            });
          }
          this.formItemDialogVisible = false;
          this.$message.success("保存成功");
        }
      });
    },

    // 保存表单配置
    async handleSave() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          // TODO: 保存表单配置
          this.$message.success("保存成功");
          this.$router.back();
        }
      });
    },

    // 取消
    handleCancel() {
      this.$router.back();
    }
  }
};
</script>

<style lang="scss" scoped>
.form-items-card {
  height: 100%;
  display: flex;
  flex-direction: column;

  ::v-deep .el-card__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
