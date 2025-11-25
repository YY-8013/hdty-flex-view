<template>
  <div class="hdty-sort" :class="options[activeIndex].class" @click="handleClick">
    <span class="hdty-sort-label">
      <slot></slot>
    </span>
    <span class="hdty-sort-caret-wrapper">
      <i class="hdty-sort-caret is-ascent"></i>
      <i class="hdty-sort-caret is-descent"></i>
    </span>
  </div>
</template>

<script>
  import { hdComponent } from '@/utils/util-framework';
  export default {
    name: "index",
    componentName: 'HdSort',
    provide() {
      return {
        hdSort: this
      };
    },
    mixins: [hdComponent],
    props: {
      prop: String,
      value: Object,
      label: String
    },
    data() {
      return {
        activeIndex: 0,
        options: [{
          index: 0,
          class: ''
        },{
          index: 0,
          class: 'is-ascending'
        },{
          index: 0,
          class: 'is-descending'
        }],
      }
    },
    computed: {
      isGroup() {
        let parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'HdSortGroup') {
            parent = parent.$parent;
          } else {
            this._sortGroup = parent;
            return true;
          }
        }
        return false;
      },
      activeValue() {
        return this.isGroup ? this._sortGroup.value : this.value;
      }
    },
    watch: {
      activeValue: {
        handler(val) {
          if(!this.$utilStr.isEmpty(val)) {
            if(val.ascs) {
              if(val.ascs.find(e => e === this.label)) {
                if(this.activeIndex !== 1) {
                  this.activeIndex = 1;
                }
              } else {
                if(this.activeIndex !== 0) {
                  this.activeIndex = 0;
                }
              }
            }
            if(val.descs) {
              if(val.descs.find(e => e === this.label)) {
                if(this.activeIndex !== 2) {
                  this.activeIndex = 2;
                }
              } else {
                if(this.activeIndex !== 0) {
                  this.activeIndex = 0;
                }
              }
            }
          } else {
            if(this.activeIndex !== 0) {
              this.activeIndex = 0;
            }
          }
        },
        immediate: true
      }
    },
    methods: {
      handleClick() {
        this.activeIndex++;
        this.activeIndex = this.activeIndex % this.options.length;
        let model;
        if(this.activeIndex === 1) {
          model = {
            ascs: [this.label]
          }
        } else if(this.activeIndex === 2) {
          model = {
            descs: [this.label]
          }
        }
        if(this.isGroup) {
          this.dispatch('HdSortGroup', 'input', [model]);
          this.dispatch('HdSortGroup', 'handleChange', [model])
        } else {
          this.$emit('input', model);
        }
        this.$emit('currentChanged', model);
      }
    }
  }
</script>

<style scoped>

</style>
