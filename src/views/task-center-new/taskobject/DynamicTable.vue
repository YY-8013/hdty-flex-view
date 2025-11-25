<template>
  <div class="con-dynamic-table">
    <el-table
      v-if="showTable"
      class="new-table new-table-obj"
      :data="ParentPage.tableData"
      empty-text="暂无数据"
      row-key="id"
      ref="objTableRef"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column
        label-class-name="header-fixed"
        sortable="custom"
        type="index"
        label="序号"
        :index="setIndex"
        align="center"
        width="60"
      ></el-table-column>
      <el-table-column
        v-if="showSelectionColumn"
        label-class-name="header-fixed"
        type="selection"
        reserve-selection
        align="center"
        width="40"
      ></el-table-column>
      <!--动态列-->
      <table-column
        v-for="(objectItem, objectIndex) in ParentPage.rwNformObjectList"
        :key="objectIndex"
        :objData="objectItem"
        :currentTableData="ParentPage.tableData"
        :allowEditField="allowEditField"
        :allowDeleteField="allowDeleteField"
        :allowEditData="allowEditData"
      ></table-column>
      <el-table-column
        v-if="!ParentPage.rwNformObjectList || ParentPage.rwNformObjectList.length === 0"
        label-class-name="header-common"
        align="center"
        min-width="100"
      >
        <template slot="header">
          <div class="con-dynamic-table-head">暂无属性</div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="allowDeleteData"
        fixed="right"
        label="删除"
        align="center"
        width="60"
        class-name="last_hidden"
      >
        <template slot-scope="scope">
          <a
            href="javascript:;"
            class="text-color-1"
            @click="handleDeleteRow(scope.$index,scope.row)"
          >
            <i class="el-icon-remove-outline"></i>
          </a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { hdList, hdForm } from '@/utils/util-framework';
import TableColumn from './TableColumn';

export default {
  name: 'DynamicTable',
  provide() {
    return {
      Parent: this
    };
  },
  inject: ['ParentPage'],
  mixins: [hdList, hdForm],
  components: {
    TableColumn
  },
  props: {
    // 是否显示多选列
    showSelectionColumn: {
      type: Boolean,
      default: false
    },
    // 是否可以编辑字段
    allowEditField: {
      type: Boolean,
      default: true
    },
    // 是否可以删除字段
    allowDeleteField: {
      type: Boolean,
      default: true
    },
    // 是否可编辑数据
    allowEditData: {
      type: Boolean,
      default: true
    },
    // 是否可删除数据
    allowDeleteData: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 是否显示表格
      showTable: true
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.objTableRef) {
        this.$refs.objTableRef.doLayout();
      }
    });
  },
  methods: {
    // 复选
    handleSelectionChange(val) {
      this.ParentPage.multipleSelection = val;
    },

    /*// 添加字段
      handleAddField() {
        this.ParentPage.handleAddField();
      },
      // 编辑字段
      handleEditField() {
        this.ParentPage.handleEditField();
      },*/

    // 删除数据
    handleDeleteRow(index, row) {
      let _this = this;
      _this
        .$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          // _this.ParentPage.tableData.splice(index, 1);
          _this.ParentPage.handleDeleteRow(index, row);

          _this.$nextTick(() => {
            if (_this.$refs.objTableRef) {
              _this.$refs.objTableRef.doLayout();
            }
          });
        })
        .catch(() => {});
    },
    // 设置表格索引
    setIndex(index) {
      if (this.$utilStr.isNotEmptyObject(this.ParentPage.pageOptions)) {
        return (
          (this.ParentPage.pageOptions.current - 1) *
            this.ParentPage.pageOptions.size +
          index +
          1
        );
      } else {
        return index + 1;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.new-table-obj {
  ::v-deep .el-table__header {
    th {
      padding: 0 !important;
      .header-commo {
        padding: 0 !important;
      }
      .con-dynamic-table-head {
        width: 100%;
        height: 100%;
        min-height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: inherit;
        position: relative;
        .con-dynamic-table-head-operate {
          position: absolute;
          right: 0;
          height: 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          a {
            height: 20px;
          }
        }
      }
    }
  }
  ::v-deep .el-table__body {
    // 输入框
    .el-input__inner {
      background-color: #fff;
      border-color: #cfd6e4;
    }
    .con-dynamic-table-data {
      position: relative;
      &.required {
        &:before {
          content: '*';
          position: absolute;
          left: -7px;
          color: #ff0b00;
        }
      }
    }
  }
}
</style>
