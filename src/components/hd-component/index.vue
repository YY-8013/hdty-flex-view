<template>
  <div class="hdty-component">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "index",
    componentName: 'HdComponent',
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
          // if(!this.fields.find(e => e.prop === field.prop)) {
            this.fields.push(field);
          // }
        }
      });
      this.$on('hd.component.removeField', (field) => {
        if (field.prop) {
          this.fields.splice(this.fields.indexOf(field), 1);
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
