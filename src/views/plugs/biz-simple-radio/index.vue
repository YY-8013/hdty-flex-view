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
    @change="handleChange"
    >
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
  export default {
    name: "index",
    provide() {
      return {
        bizSimpleRadio: this
      };
    },
    mixins: [hdComponent, hdForm],
    props: {
      prop: String,
      // 显示类型（radio / border / button）
      type: {
        type: String,
        default: 'button'
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
      },
      // 简单默认选项
      radioDataList: {
        type: Array,
        default() {
          return [
            {
              id: '1',
              key: '1',
              value: '是',
            },
            {
              id: '0',
              key: '0',
              value: '否',
            },
          ]
        }
      },
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
    },
    mounted() {
      this.loadList();
    },
    methods: {
      // 获取数据列表
      loadList() {
        let _this = this;
        _this.loading = true;
        
        _this.$nextTick(() => {
          _this.radioData = _this.radioDataList;
        });
        

        _this.loading = false;
      },
      // 筛选字典
      triggerFilterCode(val) {
        return val;
      },
      // radio值改变
      handleChange(val) {
        let currentSelection = this.activeData.find(e => String(e.key) === String(this.value));
        this.$emit('currentChanged', val, this.oldValue, currentSelection);
      },
      // 选中值改变
      handleInput(val) {
        console.log(val);
      },
      // radio清空
      handleRadioClear(emitEvent) {
        this.$emit('input', '');
        this.$emit('update:modelText', '');
        this.$emit('currentChanged', '', this.oldValue, null);
      },
      // 鼠标单击触发
      handleClick(e) {
        if(this.readonly && e) {
          // 阻止默认行为
          if (e.preventDefault) e.preventDefault(); else e.returnValue = false;
        }
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>