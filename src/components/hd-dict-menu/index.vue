<template>
  <ul v-loading="loading" class="hdty-menu hdty-scroll">
    <li
      v-for="item in activeData"
      :key="item.id"
      class="hdty-menu-item"
      :class="{ 'is-active': currentValue === item.key }">
      <a href="javascript:;" @click="handleClick(item)">
        {{ item.value }}
      </a>
    </li>
    <div v-if="activeData.length === 0" class="hdty-empty-tips">无数据</div>
  </ul>
</template>

<script>
  import { getList } from "@/api/dict-item";
  export default {
    name: "index",
    provide() {
      return {
        hdDictMenu: this
      };
    },
    props: {
      prop: String,
      // 字典编码
      dictCode: {
        type: [Number, String],
      },
      // 绑定值
      value: {
        type: [Number, String],
        default: ''
      },
      // 显示选项
      visibleOption: {
        type: [Number, String, Array],
        default: null
      },
      // 隐藏选项
      removeOption: {
        type: [Number, String, Array],
        default: null
      },
      // 在改变会影响到绑定值的组件属性时（dictCode/visibleOption/removeOption），是否判定影响有效(true:影响绑定值，改变属性时清空绑定值；false:不影响绑定值，改变属性时不清空绑定值)
      checkInfluentially: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        // 当前绑定值
        currentValue: this.value,  // currentValue接收父组件传来的value值
        // 上一次绑定值
        oldValue: this.value,
        // 数据
        menuData: [],
        // 加载中
        loading: false
      }
    },
    computed: {
      activeData() {
        return !this.$utilStr.isEmpty(this.menuData) ? this.triggerFilterCode(this.menuData) : [];
      }
    },
    watch: {
      value: {
        handler(val) {
          this.oldValue = val; // 因是先触发click点击事件再更新绑定值，所以这里将当前绑定值直接赋给上一次绑定值
          this.currentValue = val;
        },
        immediate: false
      },
      dictCode: {
        handler() {
          this.loadList();
          if(this.checkInfluentially) {
            this.handleClear();
          }
        },
        immediate: false
      },
      visibleOption: {
        handler() {
          if(this.checkInfluentially) {
            this.handleClear();
          }
        },
        immediate: false
      },
      removeOption: {
        handler() {
          if(this.checkInfluentially) {
            this.handleClear();
          }
        },
        immediate: false
      }
    },
    mounted() {
      this.loadList();
    },
    methods: {
      // 获取数据列表
      loadList() {
        let _this = this;
        _this.loading = true;
        // 参数
        let dataParams = {
          typeId: _this.dictCode
        };
        getList(dataParams).then(response => {
          let { success, data } = response.data;
          if(success) {
            _this.menuData = data;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        }).finally(() => {
          _this.loading = false;
        });
      },
      // 筛选字典
      triggerFilterCode(val) {
        if(val && val.length > 0) {
          let visibleCodes;
          let removeCodes;
          if(this.$utilStr.isExist(this.visibleOption)) {
            visibleCodes = this.$utilStr.toArray(this.visibleOption);
          }
          if(this.$utilStr.isExist(this.removeOption)) {
            removeCodes = this.$utilStr.toArray(this.removeOption);
          }
          if(this.$utilStr.isExist(visibleCodes) || this.$utilStr.isExist(removeCodes)) {
            let result = [];
            if(this.$utilStr.isExist(visibleCodes)) {
              for (let code of visibleCodes) {
                for (let i = 0, iLen = val.length;i < iLen;i++) {
                  if(String(val[i].key) === String(code)) {
                    result.push(val[i]);
                    break;
                  }
                }
              }
            } else {
              result = this.$utilStr.deepClone(val);
            }
            if(this.$utilStr.isExist(removeCodes)) {
              for (let code of removeCodes) {
                for (let i = result.length - 1;i >= 0;i--) {
                  if(String(result[i].key) === String(code)) {
                    result.splice(i, 1);
                    break;
                  }
                }
              }
            }
            return result;
          }
          return val;
        }
        return [];
      },
      // 选中
      handleClick(val) {
        this.$emit('input', val.key);
        this.$emit('currentChanged', val.key, this.oldValue, val);
      },
      // 选中清空
      handleClear(emitEvent) {
        this.$emit('input', '');
        if(emitEvent) {
          this.$emit('currentChanged', '', this.oldValue, null);
        }
      }
    }
  }
</script>

<style scoped>

</style>
