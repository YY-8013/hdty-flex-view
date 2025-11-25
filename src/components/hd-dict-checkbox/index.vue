<template>
  <div
    class="hdty-underline con-component-checkbox"
    tabindex="0"
    :readonly="readonly"
    :class="{ 'is-disabled': disabled }"
    :underline="underline"
  >
    <el-checkbox
      v-if="
        showAllButton && activeData.length > 0 && (!type || type === 'checkbox')
      "
      v-model="checkAll"
      :indeterminate="isIndeterminate"
      :size="size"
      :readonly="readonly"
      :disabled="disabled"
      @click.native="handleClick"
      @change="handleCheckAllChange"
      >全选</el-checkbox
    >
    <el-checkbox
      v-if="showAllButton && activeData.length > 0 && type === 'border'"
      v-model="checkAll"
      :indeterminate="isIndeterminate"
      :size="size"
      :readonly="readonly"
      :disabled="disabled"
      border
      @click.native="handleClick"
      @change="handleCheckAllChange"
      >全选</el-checkbox
    >
    <el-checkbox-button
      v-if="showAllButton && activeData.length > 0 && type === 'button'"
      :size="size"
      :readonly="readonly"
      :disabled="disabled"
      :class="{ 'is-checked': checkAll }"
      @click.native.prevent="handleAllButtonClick"
      >全选</el-checkbox-button
    >
    <el-checkbox-group
      v-model="currentValue"
      :size="size"
      :readonly="readonly"
      :disabled="disabled"
      :class="{ 'is-disabled': disabled }"
      @click.native="handleClick"
      @change="handleChange"
    >
      <el-checkbox
        v-if="!type || type === 'checkbox'"
        v-for="item in activeData"
        :key="item.id"
        :label="item.key"
        :readonly="readonly"
        >{{ item.value }}</el-checkbox
      >
      <el-checkbox
        v-if="type === 'border'"
        v-for="item in activeData"
        :key="item.id"
        :label="item.key"
        :readonly="readonly"
        border
        >{{ item.value }}</el-checkbox
      >
      <el-checkbox-button
        v-if="type === 'button'"
        v-for="item in activeData"
        :key="item.id"
        :label="item.key"
        :readonly="readonly"
        >{{ item.value }}</el-checkbox-button
      >
      <div v-if="activeData.length === 0" class="hdty-checkbox-empty">
        <i v-if="loading" class="el-icon-loading"></i>
        <span>{{ loading ? "加载中" : "无数据" }}</span>
      </div>
    </el-checkbox-group>
  </div>
</template>

<script>
import { hdComponent, hdForm } from "@/utils/util-framework";
import { getList } from "@/api/dict-item";
import { postRequest } from "@/api/common";
export default {
  name: "index",
  provide() {
    return {
      hdDictCheckbox: this
    };
  },
  mixins: [hdComponent, hdForm],
  props: {
    prop: String,
    // 显示类型（checkbox / border / button）
    type: {
      type: String,
      default: "checkbox"
    },
    // 字典编码
    dictCode: {
      type: [Number, String]
    },
    // 绑定值
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    // 绑定值文本
    modelText: {
      type: Array,
      default() {
        return [];
      }
    },
    // 显示选项
    visibleOption: {
      type: [Number, String, Array],
      default: null
    },
    // 隐藏选项
    removeOption: {
      type: [Number, String, Array],
      default: null
    },
    // 复选按钮尺寸（medium / small / mini）
    size: {
      type: String,
      default: ""
    },
    // 在改变会影响到绑定值的组件属性时（dictCode/visibleOption/removeOption），是否判定影响有效(true:影响绑定值，改变属性时清空绑定值；false:不影响绑定值，改变属性时不清空绑定值)
    checkInfluentially: {
      type: Boolean,
      default: false
    },
    // 是否显示全选按钮
    showAllButton: {
      type: Boolean,
      default: false
    },
    // 是否只读
    readonly: {
      type: Boolean,
      default: false
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 下划线风格
    underline: {
      type: Boolean,
      default: false
    },
    // 是否加载字典
    isDict: {
      type: Boolean,
      default: true
    },
    customOptions: {
      type: Array,
      default: () => []
    },
    // 是否自定义api获取字典
    isCustomApi: {
      type: Boolean,
      default: false
    },
    customApiUrl: {
      type: String,
      default: ""
    },
    customApiDefaultParams: {
      type: Object,
      default: () => {
        return {
          current: 1,
          size: 1000,
          zxbs: "0"
        };
      }
    },
    // 默认渲染节点数据对象的配置选项
    customDefaultProps: {
      type: Object,
      default: () => {
        return {
          key: "vo.key",
          id: "vo.id",
          value: "vo.value",
          parentId: "vo.parentKey",
          response: "records"
        };
      }
    }
  },
  data() {
    return {
      // 上一次绑定值
      oldValue: [],
      // 数据
      checkboxData: [],
      // 全选状态
      checkAll: false,
      // 不确定状态
      isIndeterminate: false,
      // 全选key的集合
      allKeys: [],
      // 全选label的集合
      allLabels: [],
      // 全选数据的集合
      allSelections: [],
      // 缓存数据
      cacheData: {
        oldValue: []
      },
      // 加载中
      loading: false
    };
  },
  computed: {
    currentValue: {
      get() {
        if (!this.$utilStr.isEqual(this.cacheData.oldValue, this.value)) {
          this.oldValue = this.cacheData.oldValue;
          this.cacheData.oldValue = this.value;
        }
        let checkedCount = this.value ? this.value.length : 0;
        this.checkAll = checkedCount === this.allKeys.length;
        this.isIndeterminate =
          checkedCount > 0 && checkedCount < this.allKeys.length;
        let currentLabels = [];
        if (!this.$utilStr.isEmpty(this.value)) {
          if (this.checkAll) {
            currentLabels = this.allLabels;
          } else {
            this.activeData.forEach((item) => {
              if (this.value.find((v) => String(v) === String(item.key))) {
                currentLabels.push(item.value);
              }
            });
          }
        } else {
          currentLabels = this.value;
          if (this.checkAll) {
            this.checkAll = false;
          }
        }
        if (!this.$utilStr.isEqual(currentLabels, this.modelText)) {
          this.$emit("update:modelText", currentLabels);
        }
        return this.value || [];
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    activeData() {
      return !this.$utilStr.isEmpty(this.checkboxData)
        ? this.triggerFilterCode(this.checkboxData)
        : [];
    }
  },
  watch: {
    dictCode: {
      handler() {
        this.checkboxData = [];
        this.loadList();
        if (this.checkInfluentially) {
          this.handleCheckboxClear();
        }
      },
      immediate: false
    },
    visibleOption: {
      handler() {
        if (this.checkInfluentially) {
          this.handleCheckboxClear();
        }
      },
      immediate: false
    },
    removeOption: {
      handler() {
        if (this.checkInfluentially) {
          this.handleCheckboxClear();
        }
      },
      immediate: false
    },
    activeData: {
      handler() {
        this.setAllData();
      },
      deep: true,
      immediate: false
    }
  },
  mounted() {
    // 判断是否用静态选项
    if (!this.isDict) {
      this.checkboxData = this.customOptions;
    } else if (this.isCustomApi) {
      // 自定义接口加载
      this.customLoadList();
    } else {
      this.loadList();
    }
  },
  methods: {
    customLoadList() {
      let _this = this;
      _this.loading = true;
      // 参数
      let dataParams = {
        url: _this.customApiUrl,
        params: _this.customApiDefaultParams
      };
      postRequest(dataParams)
        .then((response) => {
          let { success, data } = response.data;
          if (success) {
            let currentData = [];
            currentData = this.$utilStr.getValueOfDeepObj(
              data,
              this.customDefaultProps["response"]
            );
            _this.checkboxData = currentData.map((item) => {
              return {
                id: this.$utilStr.getValueOfDeepObj(
                  item,
                  this.customDefaultProps["id"]
                ),
                key: this.$utilStr.getValueOfDeepObj(
                  item,
                  this.customDefaultProps["key"]
                ),
                value: this.$utilStr.getValueOfDeepObj(
                  item,
                  this.customDefaultProps["value"]
                ),
                parentId: this.$utilStr.getValueOfDeepObj(
                  item,
                  this.customDefaultProps["parentId"]
                )
              };
            });
            console.log(currentData);
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.loading = false;
        });
    },
    // 获取数据列表
    loadList() {
      let _this = this;
      _this.loading = true;
      // 参数
      let dataParams = {
        typeId: _this.dictCode
      };
      getList(dataParams)
        .then((response) => {
          let { success, data } = response.data;
          if (success) {
            _this.checkboxData = data;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.loading = false;
        });
    },
    // 筛选字典
    triggerFilterCode(val) {
      if (val && val.length > 0) {
        let visibleCodes;
        let removeCodes;
        if (this.$utilStr.isExist(this.visibleOption)) {
          visibleCodes = this.$utilStr.toArray(this.visibleOption);
        }
        if (this.$utilStr.isExist(this.removeOption)) {
          removeCodes = this.$utilStr.toArray(this.removeOption);
        }
        if (
          this.$utilStr.isExist(visibleCodes) ||
          this.$utilStr.isExist(removeCodes)
        ) {
          let result = [];
          if (this.$utilStr.isExist(visibleCodes)) {
            for (let code of visibleCodes) {
              for (let i = 0, iLen = val.length; i < iLen; i++) {
                if (String(val[i].key) === String(code)) {
                  result.push(val[i]);
                  break;
                }
              }
            }
          } else {
            result = this.$utilStr.deepClone(val);
          }
          if (this.$utilStr.isExist(removeCodes)) {
            for (let code of removeCodes) {
              for (let i = result.length - 1; i >= 0; i--) {
                if (String(result[i].key) === String(code)) {
                  result.splice(i, 1);
                  break;
                }
              }
            }
          }
          return result;
        }
        return val;
      }
      return [];
    },
    // 设置全选数据
    setAllData() {
      this.clearAllData();
      if (this.activeData && this.activeData.length > 0) {
        this.activeData.forEach((item) => {
          this.allKeys.push(item.key);
          this.allLabels.push(item.value);
          this.allSelections.push(item);
        });
      }
    },
    // 清除全选数据
    clearAllData() {
      this.allKeys = [];
      this.allLabels = [];
      this.allSelections = [];
    },
    // checkList值改变
    handleChange(val) {
      let currentSelections = this.activeData.filter((e) =>
        this.value.find((v) => String(v) === String(e.key))
      );
      this.$emit("currentChanged", val, this.oldValue, currentSelections);
    },
    // checkAll值改变
    handleCheckAllChange(val) {
      let checkList = val ? this.allKeys : [];
      this.isIndeterminate = false;
      this.oldValue = this.cacheData.oldValue;
      this.$emit("input", checkList);
      this.$emit(
        "currentChanged",
        checkList,
        this.oldValue,
        this.allSelections
      );
    },
    // checkbox清空
    handleCheckboxClear(emitEvent) {
      this.$emit("input", []);
      this.$emit("update:modelText", []);
      if (emitEvent) {
        this.$emit("currentChanged", [], this.oldValue, []);
      }
    },
    // 全选按钮点击
    handleAllButtonClick() {
      if (!this.readonly && !this.disabled) {
        this.handleCheckAllChange(!this.checkAll);
      }
    },
    // 鼠标单击触发
    handleClick(e) {
      if (this.readonly) {
        // 阻止默认行为
        if (e.preventDefault) e.preventDefault();
        else e.returnValue = false;
      }
    }
  }
};
</script>

<style scoped></style>
