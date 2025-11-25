<template>
  <div class="con-dynamic-descriptions">
    <descriptions
      class="margin-top"
      :column="3"
      border
      v-for="(item,index) in ParentPage.tableData"
      :key="index"
    >
      <descriptions-item
        v-for="(objectItem, objectIndex) in ParentPage.rwNformObjectList"
        labelClassName="task-object-item-label"
        contentClassName="task-object-item-content"
        :key="objectIndex"
        v-if="objectItem.isShow === '1'"
        :span="((item[objectItem.prop] && item[objectItem.prop].length >18 &&
          JSON.parse(objectItem.config).type !== 'date' &&
          JSON.parse(objectItem.config).type !== 'datetime' &&
          JSON.parse(objectItem.config).type !== 'select' &&
          JSON.parse(objectItem.config).type !== 'region' &&
          JSON.parse(objectItem.config).type !== 'organ' &&
          JSON.parse(objectItem.config).type !== 'radio' &&
         JSON.parse(objectItem.config).type !== 'selectTree') ||
          (item[objectItem.prop + 'Text'] && item[objectItem.prop + 'Text'].length > 18)) ?3:1"
      >
        <template slot="label">{{objectItem.label}}</template>
        <span
          v-if="JSON.parse(objectItem.config).type === 'select'
         || JSON.parse(objectItem.config).type === 'selectTree'
         || JSON.parse(objectItem.config).type === 'region'
         || JSON.parse(objectItem.config).type === 'organ'
         || JSON.parse(objectItem.config).type === 'personSelect'
         || JSON.parse(objectItem.config).type === 'radio'"
        >{{item[objectItem.prop + 'Text'] ? item[objectItem.prop + 'Text'].toString() : ''}}</span>
        <span
          v-else-if="JSON.parse(objectItem.config).type === 'date'"
        >{{utilDate.dateFtt(item[objectItem.prop], 'yyyy-MM-dd')}}</span>
        <span
          v-else-if="JSON.parse(objectItem.config).type === 'datetime'"
        >{{utilDate.dateFtt(item[objectItem.prop], 'yyyy-MM-dd HH:mm:ss')}}</span>
        <span v-else>{{item[objectItem.prop]}}</span>
      </descriptions-item>
    </descriptions>
    <div
      v-if="ParentPage.tableData.length === 0"
      style="width: 100%;text-align: center;color: #bbb"
    >当前任务无任务对象</div>
  </div>
</template>

<script>
import { hdList, hdForm } from '@/utils/util-framework';
import descriptions from '../descriptions';
import descriptionsItem from '../descriptions/src/descriptions-item';
import utilDate from '../../../utils/util-date';

export default {
  name: 'DynamicTable',
  computed: {
    utilDate() {
      return utilDate;
    }
  },
  provide() {
    return {
      Parent: this
    };
  },
  inject: ['ParentPage'],
  mixins: [hdList, hdForm],
  components: {
    descriptionsItem,
    descriptions
  },
  props: {},
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import './css/element-2.15.14.css';
::v-deep .el-descriptions-item__label {
  min-width: 120px !important;
  text-align: right !important;
}

::v-deep .task-object-item-label {
  background-color: #f7f8fc !important;
  color: #878d99 !important;
  font-size: 16px !important;
  border-right: solid 1px #cfd6e4 !important;
  border-bottom: solid 1px #cfd6e4 !important;
}

::v-deep .task-object-item-content {
  font-size: 16px !important;
  color: #303133 !important;
  border-right: solid 1px #cfd6e4 !important;
  border-bottom: solid 1px #cfd6e4 !important;
}

::v-deep .margin-top {
  border-top: solid 1px #cfd6e4 !important;
  border-left: solid 1px #cfd6e4 !important;
}
//.margin-top {
//  margin-top: 20px;
//}
//.el-descriptions {
//  box-sizing: border-box;
//  font-size: 14px;
//  color: #303133;
//  ::v-deep .el-descriptions__body{
//    color: #606266 !important;
//    background-color: #fff !important;
//
//  }
//}
//::v-deep .el-descriptions__table {
//  border-collapse: collapse !important;
//  width: 100% !important;
//  table-layout: fixed !important;
//}
//.el-descriptions__header {
//  display: flex;
//  justify-content: space-between;
//  align-items: center;
//  margin-bottom: 20px
//}
//
//.el-descriptions__title {
//  font-size: 16px;
//  font-weight: 700
//}
//
//::v-deep .el-descriptions-item__cell {
//  box-sizing: border-box;
//  text-align: left;
//  font-weight: 400;
//  line-height: 1.5
//}
//
//::v-deep .el-descriptions-item__cell.is-left {
//  text-align: left
//}
//
//::v-deep .el-descriptions-item__cell.is-center {
//  text-align: center
//}
//
//::v-deep .el-descriptions-item__cell.is-right {
//  text-align: right
//}
//
//::v-deep .is-bordered {
//  table-layout: auto
//}
//
//::v-deep .el-descriptions-item__cell {
//  border: 1px solid #ebeef5;
//  padding: 12px 10px
//}
//
//.el-descriptions :not(.is-bordered) .el-descriptions-item__cell {
//  padding-bottom: 12px
//}
//
//.el-descriptions--medium.is-bordered .el-descriptions-item__cell {
//  padding: 10px
//}
//
//.el-descriptions--medium:not(.is-bordered) .el-descriptions-item__cell {
//  padding-bottom: 10px
//}
//
//::v-deep .el-descriptions-item {
//  vertical-align: top
//}
//
//::v-deep .el-descriptions-item__container {
//  display: flex
//}
//
//::v-deep .el-descriptions-item__label {
//  display: inline-flex;
//  align-items: baseline
//}
//
//::v-deep .el-descriptions-item__content {
//  flex: 1
//}
//
//::v-deep .el-descriptions-item__label.has-colon:after {
//  content: ":";
//  position: relative;
//  top: -.5px
//}
//
//::v-deep .el-descriptions-item__label.is-bordered-label {
//  font-weight: 700;
//  color: #909399;
//  background: #fafafa;
//  display: table-cell;
//}
//
//::v-deep .el-descriptions-item__label:not(.is-bordered-label) {
//  margin-right: 10px
//}
//
//::v-deep .el-descriptions-item__content {
//  word-break: break-word;
//  overflow-wrap: break-word
//}
</style>
