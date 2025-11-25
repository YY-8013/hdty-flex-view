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
      v-for="item in activeData"
      :key="item.id"
      :label="item.key"
      :readonly="readonly">
      {{ item.value }}
    </el-radio>
    <el-radio
      v-if="type === 'border'"
      v-for="item in activeData"
      :key="item.id"
      :label="item.key"
      :readonly="readonly"
      border>
      {{ item.value }}
    </el-radio>
    <el-radio-button
      v-if="type === 'button'"
      v-for="item in activeData"
      :key="item.id"
      :label="item.key"
      :readonly="readonly">
      {{ item.value }}
    </el-radio-button>
    <div v-if="activeData.length === 0" class="hdty-radio-empty">
      <i v-if="loading" class="el-icon-loading"></i>
      <span>{{ loading ? '加载中' : '无数据' }}</span>
    </div>
  </el-radio-group>
</template>

<script>
  import { hdComponent, hdForm } from '@/utils/util-framework';
  import { getList } from "@/api/dict-item";
  export default {
    name: "index",
    provide() {
      return {
        hdDictRadio: this
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
      // 字典编码
      dictCode: {
        type: [Number, String],
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
      // 在改变会影响到绑定值的组件属性时（dictCode/visibleOption/removeOption），是否判定影响有效(true:影响绑定值，改变属性时清空绑定值；false:不影响绑定值，改变属性时不清空绑定值)
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
        // 上一次绑定值
        oldValue: '',
        // 数据
        radioData: [],
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
            let currentSelection = this.activeData.find(e => String(e.key) === String(this.value));
            if(currentSelection) {
              currentLabel = currentSelection.value;
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
      activeData() {
        return !this.$utilStr.isEmpty(this.radioData) ? this.triggerFilterCode(this.radioData) : [];
      }
    },
    watch: {
      dictCode: {
        handler() {
          this.radioData = [];
          this.loadList();
          if(this.checkInfluentially) {
            this.handleRadioClear();
          }
        },
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
      this.loadList();
    },
    methods: {
      // 获取数据列表
      loadList() {
        let _this = this;
        _this.loading = true;
        // 参数
        let dataParams = {
          typeId: _this.dictCode
        };
        getList(dataParams).then(response => {
          let { success, data } = response.data;
          if(success) {
            _this.radioData = data;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        }).finally(() => {
          _this.loading = false;
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
                  if(String(val[i].key) === String(code)) {
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
                  if(String(result[i].key) === String(code)) {
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
        let currentSelection = this.activeData.find(e => String(e.key) === String(this.value));
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
