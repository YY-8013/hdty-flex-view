<template>
  <div class="hdty-query-fixed">
    <slot></slot>
    <el-button
      v-if="showExpandButton"
      type="text"
      :size="expandButtonSize"
      :icon="mode === 'expand' ? 'el-icon-arrow-up': 'icon-filter'"
      class="hdty-query-expand-btn"
      :class="{ 'hdty-query-expand-icon': mode === 'expand', 'is-reverse': mode === 'expand' && opened }"
      @click="handleMore">
      更多筛选
    </el-button>
    <div class="hdty-query-super" v-show="opened">
      <slot name="after">
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "HdQueryFixed",
    componentName: 'HdQueryFixed',
    data() {
      return {
        // 显示展开/收起按钮
        showExpandButton: false,
        // 打开
        opened: false
      }
    },
    computed: {
      form() {
        let parent = this.$parent;
        let parentName = parent.$options.componentName;
        while (parentName !== 'ElForm') {
          parent = parent.$parent;
          if(!parent) break;
          parentName = parent.$options.componentName;
        }
        return parent;
      },
      component() {
        let parent = this.$parent;
        let parentName = parent.$options.componentName;
        while (parentName !== 'HdComponent') {
          parent = parent.$parent;
          if(!parent) break;
          parentName = parent.$options.componentName;
        }
        return parent;
      },
      search() {
        let parent = this.$parent;
        let parentName = parent.$options.componentName;
        while (parentName !== 'HdSearch') {
          parent = parent.$parent;
          if(!parent) break;
          parentName = parent.$options.componentName;
        }
        return parent;
      },
      query() {
        let parent = this.$parent;
        let parentName = parent.$options.componentName;
        while (parentName !== 'HdQuery') {
          parent = parent.$parent;
          if(!parent) break;
          parentName = parent.$options.componentName;
        }
        return parent;
      },
      queryExpand() {
        let children = this.query.$children;
        if(children && children.length > 0) {
          return (function find(components) {
            for(let i = 0, iLen = components.length; i < iLen; i++) {
              let componentName = components[i].$options.componentName;
              if(componentName === 'HdQueryExpand') {
                return components[i];
              } else {
                let componentChildren = components[i].$children;
                if(componentChildren && componentChildren.length > 0) {
                  let findComponent = find(componentChildren);
                  if(findComponent) {
                    return findComponent;
                  }
                }
              }
            }
          })(children);
        }
      },
      mode() {
        return this.query.queryMode;
      },
      expandButtonSize() {
        return this.query.queryExpandButtonSize;
      }
    },
    mounted() {
      this.showExpandButton = !!this.queryExpand;
    },
    methods: {
      // 打开更多筛选
      handleMore() {
        this.opened = !this.opened;
        this.queryExpand.opened = this.opened;
        if(this.queryExpand.$refs.queryDrawerRef) {
          if(!this.queryExpand.$refs.queryDrawerRef.rendered) {
            let formInitialValue = {};
            let componentInitialValue = {};
            let searchInitialValue = {};
            if(this.form) {
              this.form.fields.forEach(field => {
                let initialValue = field.initialValue;
                let prop = field.prop;
                if (Array.isArray(initialValue)) {
                  formInitialValue[prop] = [].concat(initialValue);
                } else {
                  formInitialValue[prop] = initialValue;
                }
              });
            }
            if(this.component) {
              this.component.fields.forEach(field => {
                let initialValue = field.initialValue;
                let prop = field.prop;
                if (Array.isArray(initialValue)) {
                  componentInitialValue[prop] = [].concat(initialValue);
                } else {
                  componentInitialValue[prop] = initialValue;
                }
              });
            }
            if(this.search) {
              this.search.fields.forEach(field => {
                let initialValue = field.initialValue;
                let prop = field.prop;
                if (Array.isArray(initialValue)) {
                  searchInitialValue[prop] = [].concat(initialValue);
                } else {
                  searchInitialValue[prop] = initialValue;
                }
              });
            }
            this.$nextTick(() =>{
              if(this.form) {
                this.form.fields.forEach(field => {
                  let initialValue = field.initialValue;
                  let prop = field.prop;
                  if(typeof(formInitialValue[prop]) !== 'undefined'
                    && !this.$utilStr.isEqual(formInitialValue[prop], initialValue)) {
                    Object.defineProperty(field, 'initialValue', {
                      writable: true
                    });
                    if (Array.isArray(formInitialValue[prop])) {
                      field.initialValue = [].concat(formInitialValue[prop]);
                    } else {
                      field.initialValue = formInitialValue[prop];
                    }
                    Object.defineProperty(field, 'initialValue', {
                      writable: false
                    });
                  }
                });
              }
              if(this.component) {
                this.component.fields.forEach(field => {
                  let initialValue = field.initialValue;
                  let prop = field.prop;
                  if(typeof(componentInitialValue[prop]) !== 'undefined'
                    && !this.$utilStr.isEqual(componentInitialValue[prop], initialValue)) {
                    Object.defineProperty(field, 'initialValue', {
                      writable: true
                    });
                    if (Array.isArray(componentInitialValue[prop])) {
                      field.initialValue = [].concat(componentInitialValue[prop]);
                    } else {
                      field.initialValue = componentInitialValue[prop];
                    }
                    Object.defineProperty(field, 'initialValue', {
                      writable: false
                    });
                  }
                });
              }
              if(this.search) {
                this.search.fields.forEach(field => {
                  let initialValue = field.initialValue;
                  let prop = field.prop;
                  if(typeof(searchInitialValue[prop]) !== 'undefined'
                    && !this.$utilStr.isEqual(searchInitialValue[prop], initialValue)) {
                    Object.defineProperty(field, 'initialValue', {
                      writable: true
                    });
                    if (Array.isArray(searchInitialValue[prop])) {
                      field.initialValue = [].concat(searchInitialValue[prop]);
                    } else {
                      field.initialValue = searchInitialValue[prop];
                    }
                    Object.defineProperty(field, 'initialValue', {
                      writable: false
                    });
                  }
                });
              }
            });
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
