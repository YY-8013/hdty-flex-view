<template>
  <el-radio-group v-model="currentValue" tabindex="0" :underline="underline" @change="handleChange">
    <el-radio v-if="mode === 'radio' && showAllButton" label :disabled="disabled">全部</el-radio>
    <el-radio v-if="mode === 'border' && showAllButton" label :disabled="disabled" border>全部</el-radio>
    <el-radio-button v-if="mode === 'button' && showAllButton" label :disabled="disabled">全部</el-radio-button>
    <el-radio
      v-if="mode === 'radio'"
      v-for="item in radioData"
      :label="item.key"
      :key="item.id"
      :disabled="disabled"
    >{{ item.value }}</el-radio>
    <el-radio
      v-if="mode === 'border'"
      v-for="item in radioData"
      :label="item.key"
      :key="item.id"
      :disabled="disabled"
      border
    >{{ item.value }}</el-radio>
    <el-radio-button
      v-if="mode === 'button'"
      v-for="item in radioData"
      :label="item.key"
      :key="item.id"
      :disabled="disabled"
    >{{ item.value }}</el-radio-button>
  </el-radio-group>
</template>

<script>
import { hdComponent, hdMethod } from '@/utils/util-framework';
import { getList } from '@/api/dict-item';
export default {
  name: 'index',
  provide() {
    return {
      hdDictRadio: this
    };
  },
  mixins: [hdComponent, hdMethod],
  props: {
    prop: String,
    // 字典编码
    dictCode: {
      type: [Number, String]
    },
    // 绑定值
    value: {
      type: [Number, String],
      default: ''
    },
    // 绑定值文本
    modelText: {
      type: String,
      default: ''
    },
    // 显示选项
    visibleOption: {
      type: [Number, String, Array],
      default: ''
    },
    // 隐藏选项
    removeOption: {
      type: [Number, String, Array],
      default: ''
    },
    // 显示全部按钮
    showAllButton: {
      type: Boolean,
      default: false
    },
    // 模式（radio/border/button）
    mode: {
      type: String,
      default: 'radio'
    },
    // 显示边框
    underline: {
      type: Boolean,
      default: false
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 可选项，不进行调字典接口
    isDict: {
      type: Boolean,
      default: true
    },
    radioOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 数据
      radioData: []
    };
  },
  computed: {
    currentValue: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        let label = val || '';
        if (val) {
          for (
            let index = 0, length = this.radioData.length;
            index < length;
            index++
          ) {
            const element = this.radioData[index];
            if (element.key === val) {
              label = element.value;
              break;
            }
          }
        }
        this.$emit('update:modelText', label);
        this.$emit('input', val);
      }
    }
  },
  watch: {
    dictCode: {
      handler() {
        if (this.isDict) {
          this.loadList();
        }
        this.handleClear();
      },
      immediate: false
    }
  },
  mounted() {
    if (this.isDict) {
      this.loadList();
    } else {
      this.radioData = this.radioOptions;
    }
  },
  methods: {
    // 获取数据列表
    loadList() {
      let _this = this;
      // 参数
      let dataParams = {
        typeId: _this.dictCode
      };
      getList(dataParams)
        .then((response) => {
          let { success, data } = response.data;
          if (success) {
            _this.radioData = _this.triggerFilterCode(data);

            if (_this.value) {
              let label = _this.value || '';
              for (
                let index = 0, length = this.radioData.length;
                index < length;
                index++
              ) {
                const element = this.radioData[index];
                if (element.key === _this.value) {
                  label = element.value;
                  break;
                }
              }
              this.$emit('update:modelText', label);
            }
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
      let visibleCodes = [];
      let removeCodes = [];
      if (Array.isArray(this.visibleOption)) {
        visibleCodes = this.visibleOption;
      } else {
        if (this.visibleOption) {
          visibleCodes.push(this.visibleOption);
        }
      }
      if (Array.isArray(this.removeOption)) {
        removeCodes = this.removeOption;
      } else {
        if (this.removeOption) {
          removeCodes.push(this.removeOption);
        }
      }
      let result = [];
      if (visibleCodes.length > 0) {
        visibleCodes.forEach((item) => {
          let newArray = val.filter((e) => e.key === String(item));
          result = result.concat(newArray);
        });
      } else {
        result = val;
      }
      removeCodes.forEach((item) => {
        result = result.filter((e) => e.key !== String(item));
      });
      return result;
    },
    // radio值改变
    handleChange(val) {
      let obj = null;
      let label = val || '';
      for (
        let index = 0, length = this.radioData.length;
        index < length;
        index++
      ) {
        const element = this.radioData[index];
        if (element.key === val) {
          label = element.value;
          obj = element;
          break;
        }
      }
      this.$emit('update:modelText', label);
      this.$emit('currentChanged', val, label, obj);
      this.triggerValidate();
    },
    // 清空
    handleClear() {
      this.$emit('input', '');
      this.$emit('update:modelText', '');
      this.$emit('currentChanged', '', '', null);
    },
    // 触发校验
    triggerValidate() {
      let validateElement = this.queryComponentParent(this, 'ElForm');
      let validateFieldElement = this.queryComponentParent(this, 'ElFormItem');
      this.$nextTick(() => {
        if (validateFieldElement) {
          validateElement.validateField(validateFieldElement.prop);
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
