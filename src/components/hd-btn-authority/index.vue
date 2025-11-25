<template>
  <div class="hdty-btn-container">
    <slot
      :visible="records.visible"
      :disabled="records.disabled">
    </slot>
  </div>
</template>

<script>
  import { hdMethod } from "@/utils/util-framework";
  export default {
    name: "index",
    provide() {
      return {
        hdBtnAuthority: this
      };
    },
    mixins: [hdMethod],
    props: {
      // 是否开启授权验证
      authorization: {
        type: Boolean,
        default() {
          return this.$app.btnAuthorizationEnabled;
        }
      },
      // 授权验证失败处理方式
      authorizationDefeat: {
        type: String,
        default() {
          return this.$app.btnAuthorizationDefeat;
        }
      }
    },
    data() {
      return {
        records: {
          visible: {},
          disabled: {}
        }
      }
    },
    mounted() {
      this.validateAuthority();
    },
    methods: {
      validateAuthority() {
        let moduleName = this.queryComponentModuleName() || this.$route.name;
        this.queryComponentChildrenAll('ElButton').forEach(item => {
          if(!item.$attrs.name || this.getUserAuthority(item.$attrs.name, moduleName, this.authorization)) {
            this.$set(this.records.disabled, item.$attrs.name, false);
          } else {
            this.$set(this.records.disabled, item.$attrs.name, true);
            if(this.authorizationDefeat === 'hidden') {
              item.$el.remove();
            }
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
