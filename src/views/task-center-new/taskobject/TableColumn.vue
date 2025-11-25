<template>
  <el-table-column
    label-class-name="header-common"
    v-if="objData.isShow === '1'"
    :prop="objData.prop"
    :label="objData.label"
    header-align="center"
    :width="JSON.parse(objData.config).width || null"
    :min-width="JSON.parse(objData.config).width ? null : (JSON.parse(objData.config).minWidth || 160)"
  >
    <!--自定义表头内容-->
    <template slot="header">
      <div class="con-dynamic-table-head">
        {{objData.label}}
        <div class="con-dynamic-table-head-operate" v-if="objData.isAdmin === '0'">
          <i
            class="el-icon-edit text-color-4 text-clickable"
            v-if="allowEditField"
            @click="handleEditField"
          ></i>
          <i
            class="el-icon-delete text-color-1 text-clickable"
            v-if="allowDeleteField"
            @click="handleDeleteField"
          ></i>
        </div>
      </div>
    </template>
    <!--自定义数据-->
    <template slot-scope="scope">
      <div
        class="con-dynamic-table-data"
        v-if="objData.config && JSON.parse(objData.config)"
        :class="(JSON.parse(objData.config).rules && JSON.parse(objData.config).rules.required) ? 'required' : ''"
      >
        <!--输入框-->
        <el-input
          style="width: 100%;"
          v-if="JSON.parse(objData.config).type === 'input'"
          :disabled="JSON.parse(objData.config).disabled || !allowEditData"
          v-model="currentTableData[scope.$index][objData.prop]"
          :placeholder="JSON.parse(objData.config).placeholder"
          :maxlength="JSON.parse(objData.config).maxlength"
        ></el-input>
        <el-input
          style="width: 100%;"
          v-if="JSON.parse(objData.config).type === 'textarea'"
          type="textarea"
          :disabled="JSON.parse(objData.config).disabled || !allowEditData"
          v-model="currentTableData[scope.$index][objData.prop]"
          :placeholder="JSON.parse(objData.config).placeholder"
          :maxlength="JSON.parse(objData.config).maxlength"
        ></el-input>
        <!--级联选择框-->
        <hd-dict-cascader
          style="width: 100%;"
          v-if="JSON.parse(objData.config).type === 'selectTree'"
          :disabled="JSON.parse(objData.config).disabled || !allowEditData"
          v-model="currentTableData[scope.$index][objData.prop]"
          :model-text.sync="currentTableData[scope.$index][objData.prop + 'Text']"
          :dict-code="JSON.parse(objData.config).typeId"
          :multiple="objData.prop && objData.prop.startsWith('hdArray')"
          :removeOption="JSON.parse(objData.config).removeOption"
          :placeholder="JSON.parse(objData.config).placeholder"
          bigCascaderPane7
        ></hd-dict-cascader>
        <!--单选框-->
        <hd-dict-radio
          style="width: 100%;"
          v-if="JSON.parse(objData.config).type === 'radio'"
          :disabled="JSON.parse(objData.config).disabled || !allowEditData"
          v-model="currentTableData[scope.$index][objData.prop]"
          :dict-code="JSON.parse(objData.config).typeId"
          type="button"
        ></hd-dict-radio>
        <!--下拉选择框-->
        <hd-dict-select
          style="width: 100%;"
          v-if="JSON.parse(objData.config).type === 'select'"
          :disabled="JSON.parse(objData.config).disabled || !allowEditData"
          v-model="currentTableData[scope.$index][objData.prop]"
          :model-text.sync="currentTableData[scope.$index][objData.prop + 'Text']"
          :dict-code="JSON.parse(objData.config).typeId"
          :multiple="objData.prop && objData.prop.startsWith('hdArray')"
          filterable
          :placeholder="JSON.parse(objData.config).placeholder"
        ></hd-dict-select>
        <!--地区-->
        <hd-region
          style="width: 100%;"
          v-if="JSON.parse(objData.config).type === 'region'"
          :disabled="JSON.parse(objData.config).disabled || !allowEditData"
          v-model="currentTableData[scope.$index][objData.prop]"
          :model-text.sync="currentTableData[scope.$index][objData.prop + 'Text']"
          :dict-code="JSON.parse(objData.config).typeId"
          :placeholder="JSON.parse(objData.config).placeholder"
        ></hd-region>
        <!--机构-->
        <hd-organ
          style="width: 100%;"
          v-if="JSON.parse(objData.config).type === 'organ'"
          :disabled="JSON.parse(objData.config).disabled || !allowEditData"
          v-model="currentTableData[scope.$index][getDictProp(objData)]"
          :model-text.sync="currentTableData[scope.$index][getDictPropText(objData)]"
          :dict-code="JSON.parse(objData.config).typeId"
          :placeholder="JSON.parse(objData.config).placeholder"
        ></hd-organ>
        <!--时间-->
        <hd-date-picker
          type="datetime"
          v-if="JSON.parse(objData.config).type === 'datetime'"
          :disabled="JSON.parse(objData.config).disabled || !allowEditData"
          :placeholder="JSON.parse(objData.config).placeholder"
          v-model="currentTableData[scope.$index][objData.prop]"
          value-format="yyyyMMddHHmmss"
        ></hd-date-picker>
        <!--日期-->
        <hd-date-picker
          type="date"
          v-if="JSON.parse(objData.config).type === 'date'"
          :disabled="JSON.parse(objData.config).disabled || !allowEditData"
          :placeholder="JSON.parse(objData.config).placeholder"
          v-model="currentTableData[scope.$index][objData.prop]"
          value-format="yyyyMMdd"
        ></hd-date-picker>
        <!--人员-->
        <hd-mj-select
          style="width: 100%;"
          v-if="JSON.parse(objData.config).type === 'personSelect'"
          :disabled="JSON.parse(objData.config).disabled || !allowEditData"
          :valueField="JSON.parse(objData.config).valueField"
          v-model="currentTableData[scope.$index][objData.prop]"
          :model-text.sync="currentTableData[scope.$index][objData.prop + 'Text']"
          :placeholder="JSON.parse(objData.config).placeholder"
        ></hd-mj-select>
      </div>
    </template>
  </el-table-column>
</template>

<script>
import { hdList } from '@/utils/util-framework';
import HdMjSelect from './../../usergrid/plugs/hd-mj-select/index.vue';

export default {
  name: 'TableColumn',
  provide() {
    return {
      Parent: this
    };
  },
  inject: ['Parent'],
  mixins: [hdList],
  components: {
    HdMjSelect
  },
  props: {
    prop: String,
    // 数据
    objData: {
      type: [Object],
      default: () => {
        return {};
      }
    },
    // 列表数据
    currentTableData: {
      type: [Array],
      default: () => {
        return [];
      }
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
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    // 编辑字段
    handleEditField() {
      // 详情也会引入该页面，详情中没有 handleEditField 方法，这里判断一下
      if (
        this.Parent.ParentPage.$options.methods &&
        this.Parent.ParentPage.$options.methods['handleEditField']
      ) {
        this.Parent.ParentPage.handleEditField();
      }
    },
    // 删除字段
    handleDeleteField() {
      // 详情也会引入该页面，详情中没有 handleDeleteField 方法，这里判断一下
      if (
        this.Parent.ParentPage.$options.methods &&
        this.Parent.ParentPage.$options.methods['handleDeleteField']
      ) {
        this.Parent.ParentPage.handleDeleteField();
      }
    },
    getDictProp(objData) {
      if (
        ['organ', 'region'].includes(JSON.parse(objData.config).type) &&
        objData.prop === 'name'
      ) {
        return 'wybs';
      } else {
        return objData.prop;
      }
    },
    getDictPropText(objData) {
      if (
        ['organ', 'region'].includes(JSON.parse(objData.config).type) &&
        objData.prop === 'name'
      ) {
        return 'name';
      } else {
        return objData.prop + 'Text';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
