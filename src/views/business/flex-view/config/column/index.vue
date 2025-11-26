<template>
  <div class="hdty-container hdty-flex">
    <!-- 查询区域 -->
    <div class="hdty-header">
      <el-form ref="queryRef" :model="queryData" inline>
        <el-form-item label="配置名称" prop="configName">
          <el-input
            v-model="queryData.configName"
            placeholder="请输入配置名称"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <hd-button-container>
            <hd-button name="query" type="info" @click="handleQuery">
              查询
            </hd-button>
            <hd-button @click="handleClear">清空</hd-button>
          </hd-button-container>
        </el-form-item>
      </el-form>
    </div>

    <!-- 列树形编辑器 -->
    <div class="hdty-fit">
      <div class="column-config-content">
        <!-- 左侧:列树形结构 -->
        <div class="tree-panel">
          <div class="tree-header">
            <span>列树形结构</span>
            <hd-button-container>
              <hd-button type="success" size="mini" @click="handleAddRoot">
                新增根节点
              </hd-button>
            </hd-button-container>
          </div>
          <div class="tree-body">
            <!-- TODO: 使用 el-tree 渲染列树形结构 -->
            <el-tree
              ref="columnTree"
              :data="columnTreeData"
              :props="treeProps"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                  <el-button
                    type="text"
                    size="mini"
                    @click.stop="handleAddChild(data)"
                  >
                    添加
                  </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click.stop="handleEdit(data)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click.stop="handleDelete(data)"
                  >
                    删除
                  </el-button>
                </span>
              </span>
            </el-tree>
          </div>
        </div>

        <!-- 右侧:列属性编辑器 -->
        <div class="editor-panel">
          <div class="editor-header">
            <span>列属性编辑</span>
          </div>
          <div class="editor-body">
            <!-- TODO: 列属性编辑表单 -->
            <el-form
              v-if="currentColumn"
              ref="columnForm"
              :model="currentColumn"
              :rules="columnRules"
              label-width="120px"
            >
              <el-form-item label="列标签" prop="label">
                <el-input
                  v-model="currentColumn.label"
                  placeholder="请输入列标签"
                />
              </el-form-item>

              <el-form-item label="列属性名" prop="prop">
                <el-input
                  v-model="currentColumn.prop"
                  placeholder="请输入列属性名"
                />
              </el-form-item>

              <el-form-item label="列宽度" prop="width">
                <el-input-number
                  v-model="currentColumn.width"
                  :min="60"
                  controls-position="right"
                />
              </el-form-item>

              <el-form-item label="对齐方式" prop="align">
                <el-select
                  v-model="currentColumn.align"
                  placeholder="请选择对齐方式"
                >
                  <el-option label="左对齐" value="left" />
                  <el-option label="居中" value="center" />
                  <el-option label="右对齐" value="right" />
                </el-select>
              </el-form-item>

              <el-form-item label="关联表单ID" prop="formId">
                <el-input
                  v-model="currentColumn.formId"
                  placeholder="可点击时需要"
                />
              </el-form-item>

              <el-form-item>
                <hd-button-container>
                  <hd-button type="primary" @click="handleSave">保存</hd-button>
                  <hd-button @click="handleCancel">取消</hd-button>
                </hd-button-container>
              </el-form-item>
            </el-form>

            <div v-else class="empty-tip">请在左侧选择要编辑的列</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ColumnConfig",
  data() {
    return {
      queryData: {
        configName: ""
      },
      // 列树形数据
      columnTreeData: [],
      treeProps: {
        label: "label",
        children: "children"
      },
      // 当前编辑的列
      currentColumn: null,
      // 验证规则
      columnRules: {
        label: [{ required: true, message: "请输入列标签", trigger: "blur" }],
        prop: [{ required: true, message: "请输入列属性名", trigger: "blur" }]
      }
    };
  },
  created() {
    this.loadColumnTree();
  },
  methods: {
    // 加载列树形数据
    async loadColumnTree() {
      // TODO: 从后端加载列配置
      // 模拟数据
      this.columnTreeData = [];
    },

    // 查询
    handleQuery() {
      this.loadColumnTree();
    },

    // 清空
    handleClear() {
      this.$refs.queryRef.resetFields();
      this.queryData = { configName: "" };
    },

    // 新增根节点
    handleAddRoot() {
      this.currentColumn = {
        id: null,
        parentId: null,
        label: "",
        prop: "",
        width: 120,
        align: "center",
        formId: ""
      };
    },

    // 添加子节点
    handleAddChild(data) {
      this.currentColumn = {
        id: null,
        parentId: data.id,
        label: "",
        prop: "",
        width: 120,
        align: "center",
        formId: ""
      };
    },

    // 节点点击
    handleNodeClick(data) {
      this.currentColumn = { ...data };
    },

    // 编辑
    handleEdit(data) {
      this.currentColumn = { ...data };
    },

    // 删除
    async handleDelete(data) {
      try {
        await this.$confirm("确定删除该列配置?", "提示", {
          type: "warning"
        });

        // TODO: 删除列配置
        this.$message.success("删除成功");
        this.loadColumnTree();
      } catch (error) {
        if (error !== "cancel") {
          this.$message.error("删除失败");
        }
      }
    },

    // 保存
    async handleSave() {
      this.$refs.columnForm.validate(async (valid) => {
        if (valid) {
          // TODO: 保存列配置
          this.$message.success("保存成功");
          this.loadColumnTree();
          this.currentColumn = null;
        }
      });
    },

    // 取消
    handleCancel() {
      this.currentColumn = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.column-config-content {
  display: flex;
  height: 100%;
  gap: 20px;

  .tree-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    border: 1px solid #dcdfe6;
    border-radius: 4px;

    .tree-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #dcdfe6;
      background: #f5f7fa;

      span {
        font-weight: bold;
      }
    }

    .tree-body {
      flex: 1;
      padding: 16px;
      overflow: auto;

      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
      }
    }
  }

  .editor-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    border: 1px solid #dcdfe6;
    border-radius: 4px;

    .editor-header {
      padding: 12px 16px;
      border-bottom: 1px solid #dcdfe6;
      background: #f5f7fa;
      font-weight: bold;
    }

    .editor-body {
      flex: 1;
      padding: 20px;
      overflow: auto;

      .empty-tip {
        color: #909399;
        text-align: center;
        padding: 40px 0;
      }
    }
  }
}
</style>
