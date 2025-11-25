<template>
  <div class="hdty-component">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "index",
    componentName: 'BizComponent',
    provide() {
      return {
        hdComponent: this
      };
    },
    props: {
      // 数据对象
      model: Object,
    },
    data() {
      return {
        fields: [],
      };
    },
    created() {
      this.$on('hd.component.addField', (field) => {
        if (field) {
          if(!this.fields.find(e => e.prop === field.prop)) {
            this.fields.push(field);
          }
        }
      });
    },
    methods: {
      resetFields() {
        if (!this.model) {
          console.warn('[Hdty Warn][HdComponent]model is required for resetFields to work.');
          return;
        }
        this.fields.forEach(field => {
          field.resetField(field);
        });
      },
    }
  }
</script>

<style scoped>
  .hdty-component {
    display: block;
    position: relative;
  }
</style>
