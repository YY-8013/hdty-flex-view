<template>
  <div :class="['form-item', `form-item-top`]">
    <label class="label" :style="{width: labelWidth?labelWidth + 'px':'revert-layer'}">
      <span :class="required ? 'required' : ''" v-html="label"></span>
      <!-- 根据tip属性是否有值来展示提示信息 -->
      <el-tooltip v-if="false && tip" effect="dark" :content="tip">
        <img
          src="./images/tip.png"
          style="margin-left: 4px; color: #909399; cursor: pointer;width:18px;height:18xpx;"
          alt
        />
      </el-tooltip>
    </label>
    <div :class="['p-div', pClass]">
      <div v-if="!tip" class="text-div">
        <slot></slot>
      </div>
      <div
        v-if="tip && tipPosition === 'right'"
        class="text-div"
        style="display: flex;align-items: flex-end;"
      >
        <slot></slot>
        <span
          style="margin-left: 20px;color: #ff7000;flex: 1;height: 40px;line-height: 14px;display: flex;align-items: center;font-size: 14px;"
        >{{ tip }}</span>
      </div>
      <div v-if="tip && tipPosition === 'bottom'" class="text-div">
        <slot></slot>
        <span
          style="color: #ff7000;flex: 1;height: 36px;line-height: 1;display: flex;align-items: center;font-size: 14px;"
        >提示：{{ tip }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BizFormItem',
  props: {
    label: {
      type: String,
      required: true
    },
    labelWidth: {
      type: [String, Number],
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    span: {
      type: [Number, String],
      default: 24
    },
    /**
     * p-div 的附加 class，可传如：'p-divs'、'p-div3' 等
     */
    pClass: {
      type: String,
      default: 'p-divs'
    },
    tip: {
      type: String,
      default: ''
    },
    tipPosition: {
      type: String,
      default: 'right'
    }
  }
};
</script>
