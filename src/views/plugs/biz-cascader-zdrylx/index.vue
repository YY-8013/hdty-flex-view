<template>
  <el-cascader
    :popper-class="bigCascaderPane7 ? 'new-element-big-cascader-pane7' : ''"
    v-model="currentValue"
    ref="cascadeRef"
    collapse-tags
    :options="activeData"
    :props="props"
    :show-all-levels="showAllLevels"
    :filterable="filterable"
    :size="size"
    :placeholder="placeholder"
    :disabled="disabled"
    :clearable="clearable"
    :underline="underline"
    @visible-change="handleInputVisibleChange"
    @change="handleChange"
  >
    <template v-if="showCode" slot-scope="{ node, data }">
      <span class="hdty-space-between">
        <span>{{ data.value }}</span>
        <span class="hdty-tips">{{ data.key }}</span>
      </span>
    </template>
  </el-cascader>
</template>

<script>
import { hdComponent, hdMethod } from '@/utils/util-framework';
import { getZdryLxTree } from './api';
export default {
  name: 'index',
  provide() {
    return {
      hdDictCascader: this
    };
  },
  mixins: [hdComponent, hdMethod],
  props: {
    prop: String,
    // 绑定值
    value: {
      type: [Number, String, Array],
      default: ''
    },
    // 绑定值文本
    modelText: {
      type: [String, Array],
      default: ''
    },
    // 展开方式
    expandTrigger: {
      type: String,
      default: 'hover'
    },
    // 严格检查父子节点关联（true:只能选中最后一级；false:可以选择任意一级）
    checkStrictly: {
      type: Boolean,
      default: true
    },
    // 启用多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 多选限制（0代表不限制）
    limit: {
      type: Number,
      default: 0
    },
    // 显示选项
    visibleOption: {
      type: [Number, String, Array],
      default: ''
    },
    // 隐藏选项
    removeOption: {
      type: [Number, String, Array],
      default: ''
    },
    // 显示完整路径
    showAllLevels: {
      type: Boolean,
      default: false
    },
    // 搜索
    filterable: {
      type: Boolean,
      default: false
    },
    // 尺寸
    size: {
      type: String,
      default: ''
    },
    // 水印
    placeholder: {
      type: String,
      default: '请选择'
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 清空
    clearable: {
      type: Boolean,
      default: true
    },
    // 显示边框
    underline: {
      type: Boolean,
      default: false
    },
    // 显示编码
    showCode: {
      type: Boolean,
      default: false
    },
    // 大面板
    bigCascaderPane7: {
      type: Boolean,
      default: false
    },
    // 开启禁用、可选部分项
    enablePart: {
      type: Boolean,
      default: false
    },
    // 可选项
    enableOptions: {
      type: Array,
      default: () => []
    },
    // 排除项
    disableZdryLxList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 配置项
      props: {
        expandTrigger: this.expandTrigger,
        multiple: this.multiple,
        checkStrictly: !this.checkStrictly,
        emitPath: false,
        value: 'key',
        label: 'value',
        children: 'children'
      },
      // 数据
      selectData: [],
      // 选中值
      activeValue: [],
      // 选中标签
      activeLabel: [],
      // 加载完成
      isLoad: false,
      // 当前节点
      node: {},
      // 回调事件
      resolve: null
    };
  },
  computed: {
    currentValue: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit('input', val);
      }
    },
    activeData() {
      if (!this.isLoad) {
        if (Array.isArray(this.modelText)) {
          for (let i = 0; i < this.modelText.length; i++) {
            this.selectData.push({
              key: this.value[i],
              value: this.modelText[i]
            });
          }
        } else {
          if (this.modelText) {
            this.selectData.push({
              key: this.value,
              value: this.modelText
            });
          }
        }
      }
      return this.updateOptions(this.selectData);
    }
  },
  watch: {
    dictCode: {
      handler() {
        this.isLoad = false;
        this.handleClear();
      },
      immediate: false
    }
  },
  //自定义函数
  methods: {
    // 遍历数组，动态设置可选项的是否禁用
    updateOptions(list) {
      return list.map((item) => {
        item.disabled =
          this.enablePart && !this.enableOptions.includes(item.key);
        return item;
      });
    },
    // 下拉框出现时触发
    handleInputVisibleChange(visible) {
      if (visible) {
        if (!this.isLoad) {
          this.loadList();
          this.isLoad = true;
        }
      }
    },
    // 获取数据列表
    loadList() {
      let _this = this;
      // 参数
      let dataParams = {
        disableZdryLxList: _this.disableZdryLxList || []
      };
      getZdryLxTree(dataParams)
        .then((response) => {
          let { success, data } = response.data;
          if (success) {
            let treeData = data.zdryLxTree || [];
            let visibleCodes = [];
            let removeCodes = [];
            if (Array.isArray(_this.visibleOption)) {
              visibleCodes = _this.visibleOption;
            } else {
              if (_this.visibleOption) {
                visibleCodes.push(_this.visibleOption);
              }
            }
            if (Array.isArray(_this.removeOption)) {
              removeCodes = _this.removeOption;
            } else {
              if (_this.removeOption) {
                removeCodes.push(_this.removeOption);
              }
            }
            if (visibleCodes.length > 0) {
              treeData = _this.iterationFilter(treeData, visibleCodes);
            }
            removeCodes.forEach((e) => {
              treeData = _this.iterationDelete(treeData, e);
            });
            _this.selectData = treeData;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        });
    },
    // 递归过滤
    iterationFilter(nodes, leaf) {
      return nodes
        .filter((item) => {
          return leaf.indexOf(item.key) > -1;
        })
        .map((item) => {
          item = Object.assign({}, item);
          if (item.children) {
            item.children = this.iterationFilter(item.children, leaf);
          }
          return item;
        });
    },
    // 递归删除
    iterationDelete(nodes, leaf) {
      if (nodes.length) {
        for (let i in nodes) {
          if (leaf !== nodes[i].key) {
            if (nodes[i].children) {
              this.iterationDelete(nodes[i].children, leaf);
            }
          } else {
            delete nodes[i];
          }
        }
      }
      return nodes;
    },
    // select值改变
    handleChange(val) {
      let codes = [];
      let selections = [];
      let labels = [];
      if (Array.isArray(val)) {
        codes = val;
      } else {
        codes.push(val);
      }
      codes.forEach((e) => {
        let selection = this.doFilter(this.selectData, e);
        if (selection) {
          selections.push(selection);
        }
      });
      selections.forEach((item) => {
        labels.push(item.value);
      });
      if (this.multiple) {
        this.$emit('update:modelText', labels);
      } else {
        this.$emit('update:modelText', labels[0] || '');
      }
      this.$emit('currentChanged', val);
    },
    doFilter(nodes, leaf) {
      let _this = this;
      // 隐藏某些项后  length 值不等于 nodes 长度 nodes[i] 可能为空
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i]) {
          if (nodes[i] && leaf === nodes[i]['key']) {
            return nodes[i];
          }
          if (nodes[i]['children']) {
            let node = this.doFilter(nodes[i]['children'], leaf);
            if (node) {
              return node;
            }
          }
        }
      }
    },
    // 清空
    handleClear() {
      if (this.multiple) {
        this.$emit('input', []);
        this.$emit('update:modelText', []);
      } else {
        this.$emit('input', '');
        this.$emit('update:modelText', '');
      }
      this.$emit('currentChanged', []);
    }
  }
};
</script>
