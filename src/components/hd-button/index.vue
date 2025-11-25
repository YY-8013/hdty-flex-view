<template>
  <el-button
    :name="name"
    :native-type="nativeType"
    :type="type"
    :icon="icon"
    :size="size"
    :loading="loading"
    :autofocus="autofocus"
    :readonly="readonly"
    :disabled="activeDisabled"
    :plain="plain"
    :round="round"
    :circle="circle"
    @click="handleClick">
    <slot></slot>
  </el-button>
</template>

<script>
  import { hdMethod } from "@/utils/util-framework";
  export default {
    name: "index",
    provide() {
      return {
        hdButton: this
      };
    },
    mixins: [hdMethod],
    props: {
      // 指定名称
      name: {
        type: String,
        default: ''
      },
      // 模块名称
      moduleName: {
        type: String,
        default: ''
      },
      // 原生type属性（button / submit / reset）
      nativeType: {
        type: String,
        default: 'button'
      },
      // 类型（primary / success / warning / danger / info / text）
      type: {
        type: String,
        default: ''
      },
      // 图标类名
      icon: {
        type: String,
        default: ''
      },
      // 按钮尺寸（medium / small / mini）
      size: {
        type: String,
        default: ''
      },
      // 是否加载中状态
      loading: {
        type: Boolean,
        default: false
      },
      // 是否默认聚焦
      autofocus: {
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
      // 是否朴素按钮
      plain: {
        type: Boolean,
        default: false
      },
      // 是否圆角按钮
      round: {
        type: Boolean,
        default: false
      },
      // 是否圆形按钮
      circle: {
        type: Boolean,
        default: false
      },
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
        activeDisabled: this.disabled
      }
    },
    watch: {
      disabled: {
        handler(val) {
          this.activeDisabled = val;
          this.validateAuthority();
        },
        immediate: false
      },
    },
    mounted() {
      this.validateAuthority();
    },
    methods: {
      validateAuthority() {
        try {
          if(this.name) {
            let moduleName = this.moduleName || this.queryComponentModuleName() || this.$route.name;
            if(!this.getUserAuthority(this.name, moduleName, this.authorization)) {
              this.activeDisabled = true;
              if(this.authorizationDefeat === 'hidden') {
                this.$el.remove();
              }
            }
          }
        } catch (e) {
          this.$el.remove();
          console.error(e);
        }
      },
      handleClick(evt) {
        if(!this.readonly) {
          this.$emit('click', evt);
        }
      }
    }
  }
</script>

<style scoped>

</style>
