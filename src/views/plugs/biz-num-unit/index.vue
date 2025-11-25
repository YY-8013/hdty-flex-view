<template>
  <span>{{ value }}{{ showUnit ? unit : '' }}</span>
</template>
 
<script>
export default {
  name: 'BizNumUnit',
  props: {
    value: {
      type: [Number, String],
      default: null
    },
    unit: {
      type: String,
      required: true
    }
  },
  computed: {
    showUnit() {
      return (
        this.value !== null && this.value !== '' && this.value !== undefined
      );
    }
  }
};
</script>