<template>
  <el-radio-group
    v-if="type === 'radio'"
    v-model="currentValue"
    class="hdty-factor-radio"
    :underline="underline"
    @change="handleChange">
    <el-radio :label="$app.factorOptions.logicOpe.and">与</el-radio>
    <el-radio :label="$app.factorOptions.logicOpe.or">或</el-radio>
  </el-radio-group>
  <el-radio-group
    v-else-if="type === 'borderRadio'"
    v-model="currentValue"
    class="hdty-factor-radio"
    :underline="underline"
    @change="handleChange">
    <el-radio :label="$app.factorOptions.logicOpe.and" border>与</el-radio>
    <el-radio :label="$app.factorOptions.logicOpe.or" border>或</el-radio>
  </el-radio-group>
  <el-radio-group
    v-else-if="type === 'buttonRadio'"
    v-model="currentValue"
    class="hdty-factor-radio"
    :underline="underline"
    @change="handleChange">
    <el-radio-button :label="$app.factorOptions.logicOpe.and">与</el-radio-button>
    <el-radio-button :label="$app.factorOptions.logicOpe.or">或</el-radio-button>
  </el-radio-group>
  <el-button
    v-else-if="type === 'button'"
    type="success"
    title="点击切换"
    class="hdty-factor-button"
    square
    @click="handleChange">
    {{ currentValue === $app.factorOptions.logicOpe.and ? '与' : '或' }}
  </el-button>
  <el-select
    v-else
    v-model="currentValue"
    class="hdty-factor-select"
    :underline="underline"
    @change="handleChange">
    <el-option label="并且" :value="$app.factorOptions.logicOpe.and"></el-option>
    <el-option label="或者" :value="$app.factorOptions.logicOpe.or"></el-option>
  </el-select>
</template>

<script>
  import { hdComponent } from '@/utils/util-framework';
  export default {
    name: "index",
    provide() {
      return {
        hdFactorLogic: this
      };
    },
    mixins: [hdComponent],
    props: {
      prop: String,
      // 类型（radio / borderRadio / buttonRadio / button / select）
      type: {
        type: String,
        default: 'buttonRadio'
      },
      // 选中值
      value: {
        type: String,
        default: ''
      },
      // 下划线风格
      underline: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      currentValue: {
        get() {
          if(this.value === '' || this.value === null) {
            this.$emit('input', this.$app.factorOptions.logicOpe.and);
          } else {
            return this.value;
          }
        },
        set(val) {
          this.$emit('input', val);
        }
      }
    },
    methods: {
      // 选中值改变
      handleChange(val) {
        if(this.type === 'button') {
          if(this.currentValue === this.$app.factorOptions.logicOpe.and) {
            this.currentValue = this.$app.factorOptions.logicOpe.or;
          }else {
            this.currentValue = this.$app.factorOptions.logicOpe.and;
          }
        }
        this.$emit('currentChanged', val);
      }
    }
  }
</script>

<style scoped>

</style>
