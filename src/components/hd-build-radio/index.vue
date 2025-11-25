<template>
  <el-radio-group
    v-model="currentValue"
    tabindex="0"
    :size="size"
    :readonly="readonly"
    :disabled="disabled"
    :class="{ 'is-disabled': disabled }"
    :underline="underline"
    @click.native="handleClick"
    @change="handleChange">
    <el-radio
      v-if="showAllButton && activeData.length > 0 && (!type || type === 'radio')"
      label=""
      :readonly="readonly">
      全部
    </el-radio>
    <el-radio
      v-if="showAllButton && activeData.length > 0 && type === 'border'"
      label=""
      :readonly="readonly"
      border>
      全部
    </el-radio>
    <el-radio-button
      v-if="showAllButton && activeData.length > 0 && type === 'button'"
      label=""
      :readonly="readonly">
      全部
    </el-radio-button>
    <el-radio
      v-if="!type || type === 'radio'"
      v-for="(item, index) in activeData"
      :key="index"
      :label="$utilStr.getValueOfDeepObj(item, activeProps['value'])"
      :readonly="readonly">
      {{ $utilStr.getValueOfDeepObj(item, activeProps['label']) }}
    </el-radio>
    <el-radio
      v-if="type === 'border'"
      v-for="(item, index) in activeData"
      :key="index"
      :label="$utilStr.getValueOfDeepObj(item, activeProps['value'])"
      :readonly="readonly"
      border>
      {{ $utilStr.getValueOfDeepObj(item, activeProps['label']) }}
    </el-radio>
    <el-radio-button
      v-if="type === 'button'"
      v-for="(item, index) in activeData"
      :key="index"
      :label="$utilStr.getValueOfDeepObj(item, activeProps['value'])"
      :readonly="readonly">
      {{ $utilStr.getValueOfDeepObj(item, activeProps['label']) }}
    </el-radio-button>
    <div v-if="activeData.length === 0" class="hdty-radio-empty">
      <i v-if="loading" class="el-icon-loading"></i>
      <span>{{ loading ? '加载中' : '无数据' }}</span>
    </div>
  </el-radio-group>
</template>

<script>
  import { hdComponent, hdForm } from '@/utils/util-framework';
  export default {
    name: "index",
    provide() {
      return {
        hdBuildRadio: this
      };
    },
    mixins: [hdComponent, hdForm],
    props: {
      prop: String,
      // 显示类型（radio / border / button）
      type: {
        type: String,
        default: 'radio'
      },
      // 选项数据（通过data直接绑定数据，将不需要通过api请求接口获取数据）
      data: Array,
      // 请求接口
      api: Function,
      // 请求参数
      params: Object,
      // 渲染选项数据对象的配置选项
      props: {
        type: Object,
        default() {
          return {
            // 指定选项的值对应选项数据对象中的属性值
            value: 'key',
            // 指定选项标签对应选项数据对象中的属性值
            label: 'value',
            // 指定选项数据对象对应响应数据对象中的属性值
            response: ''
          };
        }
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
        default: null
      },
      // 隐藏选项
      removeOption: {
        type: [Number, String, Array],
        default: null
      },
      // 单选按钮尺寸（medium / small / mini）
      size: {
        type: String,
        default: ''
      },
      // 在改变会影响到绑定值的组件属性时（data/api/params/visibleOption/removeOption），是否判定影响有效(true:影响绑定值，改变属性时清空绑定值；false:不影响绑定值，改变属性时不清空绑定值)
      checkInfluentially: {
        type: Boolean,
        default: false
      },
      // 是否显示全部按钮
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
      }
    },
    data() {
      return {
        // 默认渲染选项数据对象的配置选项
        defaultProps: {
          // 指定选项的值对应选项数据对象中的属性值
          value: 'key',
          // 指定选项标签对应选项数据对象中的属性值
          label: 'value',
          // 指定选项数据对象对应响应数据对象中的属性值
          response: ''
        },
        // 数据
        radioData: this.data,
        // 当前接口参数
        currentParams: this.params, // currentParams接收父组件传来的params值
        // 上一次绑定值
        oldValue: '',
        // 缓存数据
        cacheData: {
          oldValue: ''
        },
        // 加载中
        loading: false
      }
    },
    computed: {
      currentValue: {
        get() {
          if(this.cacheData.oldValue !== this.value) {
            this.oldValue = this.cacheData.oldValue;
            this.cacheData.oldValue = this.value;
          }
          let currentLabel = '';
          if(!this.$utilStr.isEmpty(this.value)) {
            let currentSelection = this.activeData.find(e => String(this.$utilStr.getValueOfDeepObj(e, this.activeProps['value'])) === String(this.value));
            if(currentSelection) {
              currentLabel = this.$utilStr.getValueOfDeepObj(currentSelection, this.activeProps['label']);
            }
          } else {
            currentLabel = this.value;
          }
          if(currentLabel !== this.modelText) {
            this.$emit('update:modelText', currentLabel);
          }
          return this.value && String(this.value);
        },
        set(val) {
          this.$emit('input', val);
        }
      },
      activeProps() {
        return Object.assign(this.defaultProps, this.props);
      },
      activeData() {
        return !this.$utilStr.isEmpty(this.radioData) ? this.triggerFilterCode(this.radioData) : [];
      }
    },
    watch: {
      data: {
        handler(val) {
          this.radioData = val;
          if(this.$utilStr.isEmpty(val) && typeof(this.api) === 'function') {
            this.loadList();
          }
          if(this.checkInfluentially) {
            this.handleRadioClear();
          }
        },
        deep: true,
        immediate: false
      },
      api: {
        handler(val) {
          if(typeof(val) === 'function') {
            this.radioData = [];
            this.loadList();
          } else if(this.$utilStr.isEmpty(this.data)) {
            this.radioData = [];
          }
          if(this.checkInfluentially) {
            this.handleRadioClear();
          }
        },
        deep: true,
        immediate: false
      },
      params: {
        handler(val) {
          this.currentParams = val;
          if(typeof(this.api) === 'function') {
            this.radioData = [];
            this.loadList();
          }
          if(this.checkInfluentially) {
            this.handleRadioClear();
          }
        },
        deep: true,
        immediate: false
      },
      visibleOption: {
        handler() {
          if(this.checkInfluentially) {
            this.handleRadioClear();
          }
        },
        immediate: false
      },
      removeOption: {
        handler() {
          if(this.checkInfluentially) {
            this.handleRadioClear();
          }
        },
        immediate: false
      }
    },
    mounted() {
      if(typeof(this.api) === 'function') {
        this.loadList();
      }
    },
    methods: {
      // 获取数据列表
      loadList() {
        this.loading = true;
        this.api(this.currentParams).then(response => {
          let { success, data } = response.data;
          if(success) {
            this.radioData = this.$utilStr.getValueOfDeepObj(data, this.activeProps['response']);
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        }).finally(() => {
          this.loading = false;
        });
      },
      // 筛选字典
      triggerFilterCode(val) {
        if(val && val.length > 0) {
          let visibleCodes;
          let removeCodes;
          if(this.$utilStr.isExist(this.visibleOption)) {
            visibleCodes = this.$utilStr.toArray(this.visibleOption);
          }
          if(this.$utilStr.isExist(this.removeOption)) {
            removeCodes = this.$utilStr.toArray(this.removeOption);
          }
          if(this.$utilStr.isExist(visibleCodes) || this.$utilStr.isExist(removeCodes)) {
            let result = [];
            if(this.$utilStr.isExist(visibleCodes)) {
              for (let code of visibleCodes) {
                for (let i = 0, iLen = val.length;i < iLen;i++) {
                  if(String(this.$utilStr.getValueOfDeepObj(val[i], this.activeProps['value'])) === String(code)) {
                    result.push(val[i]);
                    break;
                  }
                }
              }
            } else {
              result = this.$utilStr.deepClone(val);
            }
            if(this.$utilStr.isExist(removeCodes)) {
              for (let code of removeCodes) {
                for (let i = result.length - 1;i >= 0;i--) {
                  if(String(this.$utilStr.getValueOfDeepObj(result[i], this.activeProps['value'])) === String(code)) {
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
      // radio值改变
      handleChange(val) {
        let currentSelection = this.activeData.find(e => String(this.$utilStr.getValueOfDeepObj(e, this.activeProps['value'])) === String(this.value));
        this.$emit('currentChanged', val, this.oldValue, currentSelection);
      },
      // radio清空
      handleRadioClear(emitEvent) {
        this.$emit('input', '');
        this.$emit('update:modelText', '');
        if(emitEvent) {
          this.$emit('currentChanged', '', this.oldValue, null);
        }
      },
      // 鼠标单击触发
      handleClick(e) {
        if(this.readonly) {
          // 阻止默认行为
          if (e.preventDefault) e.preventDefault(); else e.returnValue = false;
        }
      }
    }
  }
</script>

<style scoped>

</style>
