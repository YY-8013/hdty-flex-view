<template>
  <el-dialog
    :visible.sync="visible"
    width="1000px"
    custom-class="new-dialog jcgk-mh-dialog"
    :show-close="false"
    append-to-body
  >
    <!-- 自定义头部 -->
    <div slot="title" class="new-dialog-header">
      <div class="header-title">
        我的常用管理
        <div class="header-line"></div>
      </div>
      <span class="close-btn">
        <img
          src="../images/newPage/close.png"
          alt=""
          @click="visible = false"
        />
      </span>
    </div>

    <!-- 内容区域 -->
    <div
      class="new-dialog-pane menu-box"
      style="min-height: 400px; max-height: 600px"
    >
      <!-- 左侧菜单树 -->
      <div class="menu-list hdty-dp-scroll">
        <div class="menu-tree">
          <el-tree
            v-if="lazy"
            :lazy="lazy"
            :default-expanded-keys="defaultExpandedKeys"
            :props="defaultProps"
            :data="tableData"
            :load="loadNode"
            ref="tree"
            node-key="id"
            check-strictly
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span class="tree-node">{{ node.label }}</span>
              <span
                class="node-btn"
                v-if="node.isLeaf && $utilPublic.getUserAuthority(data.url)"
              >
                <el-link
                  v-if="!selectedIds.includes(data.id)"
                  type="success"
                  :underline="false"
                  @click="handleSelect(data, true)"
                  >选择</el-link
                >
                <el-link
                  v-else
                  type="danger"
                  :underline="false"
                  @click="handleSelect(data, false)"
                  >取消选择</el-link
                >
              </span>
            </span>
          </el-tree>
        </div>
      </div>

      <!-- 右侧已选菜单列表 -->
      <div class="select-list hdty-jcgk-scroll">
        <div class="header-title">
          <div class="left">
            已选菜单({{ selecteMenuList.length }}/{{ maxSelect }})
          </div>
        </div>
        <div class="select-menu-list">
          <div
            v-for="selectItem in selecteMenuList"
            :key="'select-item-' + selectItem.id"
          >
            <el-tag
              type="primary"
              closable
              @close="handleSelect(selectItem, false)"
            >
              {{ selectItem.name }}
            </el-tag>
          </div>
        </div>
        <div class="bottom">
          <el-button type="primary" size="small" @click="saveMenuConfig"
            >保存配置</el-button
          >
        </div>
      </div>

      <div class="split-line"></div>
    </div>
  </el-dialog>
</template>

<script>
import { hdComponent, hdMethod } from "@/utils/util-framework";
import { getMenuList, getCommonMenu, commonMenuListAdd } from "./api";

export default {
  name: "menuSelect",
  mixins: [hdComponent, hdMethod],
  props: {
    value: {
      type: [Number, String, Array],
      default: ""
    },
    modelText: {
      type: [Number, String, Array],
      default: ""
    },
    lazy: {
      type: Boolean,
      default: true
    },
    parentId: {
      type: [Number, String],
      default: ""
    },
    filterOrg: {
      type: [Number, String],
      default: ""
    },
    isFilterCity: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      maxSelect: 8,
      visible: false,
      queryData: {
        isLazy: this.lazy,
        clientType: "0",
        parentId: ""
      },
      defaultProps: {
        id: "id",
        label: "name",
        children: "children",
        isLeaf: "leaf"
      },
      tableData: [],
      selecteMenuList: [],
      defaultExpandedKeys: [],
      loading: false
    };
  },
  computed: {
    selectedIds() {
      return this.selecteMenuList.map((item) => item.id);
    }
  },
  methods: {
    // 初始化加载
    beforeLoadForm() {
      this.loadCommonList();
      this.loadList();
    },
    // 获取已配置常用菜单
    loadCommonList() {
      const dataParams = {
        ...this.queryData,
        current: 1,
        size: this.maxSelect
      };
      getCommonMenu(dataParams)
        .then((res) => {
          const { success, data } = res.data;
          if (success) {
            this.selecteMenuList = (data.records || []).map((item) => ({
              ...item.vo,
              id: item.vo.menuId,
              name: item.vox.menuId
            }));
          }
        })
        .catch(console.error);
    },
    // 获取菜单树根节点
    loadList() {
      this.loading = true;
      const menuIds = [];
      const dataParams = {
        menuIds,
        clientType: "0",
        isLazy: "false",
        ...this.queryData,
        parentId: ""
      };
      getMenuList(dataParams)
        .then((res) => {
          const { success, data } = res.data;
          if (success) {
            data.forEach((val) => (val.hasChildren = !!val.children));
            this.tableData = data;
            if (data && data.length > 0) {
              this.defaultExpandedKeys = [data[0].id];
            }
          }
        })
        .finally(() => (this.loading = false));
    },
    // 懒加载节点
    loadNode(node, resolve) {
      if (!node.data.id) return;
      this.queryData.parentId = node.data.id;
      const dataParams = { clientType: "0", ...this.queryData };
      getMenuList(dataParams)
        .then((res) => {
          const { success, data } = res.data;
          if (success) resolve(data);
          else resolve([]);
        })
        .catch(() => resolve([]));
    },
    // 选择或取消选择
    handleSelect(data, add) {
      if (add) {
        if (this.selecteMenuList.length >= this.maxSelect) {
          this.$message.warning({
            title: "提示",
            message: `最多设置${this.maxSelect}个常用菜单~`
          });
        } else if (!this.selecteMenuList.find((i) => i.id === data.id)) {
          this.selecteMenuList.push(data);
        }
      } else {
        this.selecteMenuList = this.selecteMenuList.filter(
          (i) => i.id !== data.id
        );
      }
    },
    // 保存菜单配置
    saveMenuConfig() {
      const dataParams = {
        menuIdList: this.selecteMenuList.map((i) => i.id)
      };
      commonMenuListAdd(dataParams).then((res) => {
        const { success } = res.data;
        if (success) {
          this.$message.success({
            message: "常用功能配置成功~",
            type: "success"
          });
          this.visible = false;
          this.$emit("update-list");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.new-dialog {
  background: url("../../images/dialog/dialog-bg-01.png");
  background-size: 100% 100% !important;
  background-color: transparent !important;

  .close-btn {
    position: absolute;
    top: 80px;
    right: -14px;
    img {
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        transform: scale(1.1);
      }
    }
  }
  &-header {
    position: relative;
    text-align: center;
    font-size: 28px;
    font-weight: 600;
    color: #cbdeff;
    letter-spacing: 2px;
    margin-bottom: 10px;
    width: 100%;
    .header-title {
      position: relative;
      display: inline-block;
      .header-line {
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        width: 175px;
        height: 34px;
        background: url("../images/newPage/dialog-title-line.png");
        background-size: 100% 100%;
      }
    }
  }
}

.menu-box {
  display: flex;
  position: relative;
  .menu-list {
    width: 60%;
    padding: 12px 16px;
    height: 500px;
  }
  .select-list {
    width: 40%;
    padding: 12px 16px;
    height: 500px;
    position: relative;
    .header-title {
      .left {
        color: #30c0fd;
        font-size: 16px;
      }
    }
    .bottom {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .split-line {
    position: absolute;
    top: 50%;
    left: 60%;
    transform: translate(-50%, -50%);
    width: 1px;
    height: 90%;
    background-color: #2685c2;
  }
}

::v-deep .menu-tree {
  .el-tree {
    background: transparent;
    --el-tree-node-content-height: 26px;
    .custom-tree-node {
      display: flex;
      align-items: center;
      color: #30c0fd;
      .tree-node {
        margin-right: 8px;
      }
    }
    .el-tree-node__content {
      background-color: transparent !important;
    }

    .el-tree-node.is-current > .el-tree-node__content,
    .el-tree-node__content:hover {
      background-color: rgba(7, 23, 53, 0.6) !important;
    }
  }
}

.select-menu-list {
  .el-tag {
    margin: 4px 6px 6px 0;
  }
}
</style>
