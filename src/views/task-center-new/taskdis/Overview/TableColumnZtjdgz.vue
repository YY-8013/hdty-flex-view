<template>
  <el-table-column
    :fixed="coloumnHeader.prop === 'userName' || coloumnHeader.prop === 'orgName'"
    :show-overflow-tooltip="coloumnHeader.prop === 'orgName'"
    :label="coloumnHeader.label"
    align="center"
    min-width="100"
    :width="coloumnHeader.prop === 'orgName' ? '320' : ''">
    <template slot-scope="scope" v-if="!coloumnHeader.children || coloumnHeader.children.length === 0">
      <div class="column-org-name" v-if="coloumnHeader.prop === 'userName'">
        <span class="unClick">
          {{scope.row[coloumnHeader.prop]}}
        </span>
      </div>
      <div class="column-org-name" v-if="coloumnHeader.prop === 'orgName'">
        <span class="unClick">
          {{scope.row[coloumnHeader.prop]}}
        </span>
      </div>
      <div class="column-num" :class="[scope.row[coloumnHeader.prop] === 0 ? 'unClick' : 'canClick']" v-else-if="coloumnHeader.prop !== 'userName'">
        <a href="javascript:;" @click="handleClickTask(scope.$index, scope.row, coloumnHeader.prop)"
           v-if="scope.row[coloumnHeader.prop] > 0 && scope.row.orgId !== '总数'">
          {{scope.row[coloumnHeader.prop]}}
        </a>
        <span v-else>
          {{scope.row[coloumnHeader.prop]}}
        </span>
      </div>
    </template>
    <template v-if="coloumnHeader.children && coloumnHeader.children.length > 0">
      <table-column-ztjdgz
        v-for="(item, index) in coloumnHeader.children"
        :key="index"
        :coloumn-header="item">
      </table-column-ztjdgz>
    </template>
  </el-table-column>
</template>

<script>

export default {
  name: 'TableColumnZtjdgz',
  provide() {
    return {
      TableColumn: this,
    };
  },
  inject: ["hdList"],
  props: {
    coloumnHeader: {
      type: Object,
      required: true
    },
    dyflag: {
      type: Number,
      default: 1 // 1.总览统计实有单位二级页面使用 2.双清双打
    }
  },
  components: {

  },
  data() {
    return {

    }
  },
  methods: {
    handleList(prop, row) {
      let orgId = row["orgId"];
      let orgName = row["orgName"];
      let isLeaf = row["isLeaf"];
      if (isLeaf) {
        this.hdList.queryData.orgId = orgId;
        this.hdList.extendData.orgId = orgName;
        this.hdList.handleQuery();
      }
    },
    // 任务列表
    handleClickTask(index, row, prop){
      // 是否全部
      let isAll = row[prop + "_formId"] || '';
      let formIdList = [];
      let type = '';
      // 质态监督-标记检查结果（0不正确 1正确）(统计跳转专用)
      let ztjdBjCheckState = '';
      if(isAll && isAll!== 'bjBzqNum' && isAll !== 'bjZqNum'){
        // 表单统计
        formIdList = [row[prop + "_formId"]];
        // 全部统计
        if(prop.startsWith('total')){
          type = '';
        }
        else if(prop.startsWith('hg')){
          type = '1';
        }
        else if(prop.startsWith('bhg')){
          type = '0';
        }
        this.hdList.handleSecondStatCheck(row, type, formIdList);
      }
      else{
        // 全部统计
        if(prop === 'totalNum'){
          type = '';
        }
        else if(prop === 'hgNum'){
          type = '1';
        }
        else if(prop === 'bhgNum'){
          type = '0';
        }
        if(prop === 'bjBzqNum' || prop === 'bjZqNum'){
          ztjdBjCheckState = prop === 'bjBzqNum' ? '0' : '1';
        }
        this.hdList.handleSecondStatCheck(row, type, formIdList, ztjdBjCheckState);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.column-org-name {
  font-weight: bold;
  color: #1194fb;
  /*span {
    color: #5c5c5c;
  }*/
  &.canClick {
    a {
      text-decoration: underline;
    }
  }
  &.unClick {
    a {
      cursor: text;
    }
  }
}

.column-num {
  font-size: 16px;
  //font-weight: bold;
  /*color: #1194fb;*/
  &.canClick {
    a {
      text-decoration: underline;
    }
  }
  &.unClick {
    a {
      cursor: text;
    }
  }
}
</style>
