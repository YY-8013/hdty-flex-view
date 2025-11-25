<template>
  <el-cascader
    ref="cascadeRef"
    v-model="currentValue"
    :options="activeData"
    :props="activeProps"
    :size="size"
    :placeholder="placeholder"
    :collapse-tags="collapseTags"
    :show-all-levels="showAllLevels"
    :filterable="filterable"
    :clearable="clearable"
    :readonly="readonly"
    :disabled="disabled"
    :class="{ 'has-search-input': filterable && multiple, 'is-adaptive': adaptive }"
    :popper-class="readonly ? 'hdty-hide': ''"
    :underline="underline"
    @mouseenter.native="handleMouseenter"
    @mouseleave.native="handleMouseleave"
    @visible-change="handleVisibleChange"
    @change="handleChange">
    <template v-if="showCode" slot-scope="{ node, data }">
      <span class="hdty-space-between">
        <span>{{ $utilStr.getValueOfDeepObj(data, activeProps['label']) }}</span>
        <span class="hdty-tips">{{ $utilStr.getValueOfDeepObj(data, activeProps['value']) }}</span>
      </span>
    </template>
  </el-cascader>
</template>

<script>
  import { hdComponent, hdMethod } from '@/utils/util-framework';
  export default {
    name: "index",
    provide() {
      return {
        hdBuildCascader: this
      };
    },
    mixins: [hdComponent, hdMethod],
    props: {
      prop: String,
      // 请求接口
      api: Function,
      // 选项数据（通过data直接绑定数据，将不需要通过api请求接口获取数据）
      data: Array,
      // 请求参数
      params: Object,
      // 渲染选项数据对象的配置选项
      props: {
        type: Object,
        default() {
          return {
            // 指定选项的值对应选项数据对象中的属性值
            value: 'key',
            // 指定选项标签对应选项数据对象中的属性值
            label: 'value',
            // 指定选项子选项对应选项数据对象中的属性值
            children: 'children',
            // 指定选项禁用标志位对应选项数据对象中的属性值
            disabled: 'disabled',
            // 指定选项叶子节点标志位对应选项数据对象中的属性值
            leaf: 'leaf',
            // 指定选项数据对象对应响应数据对象中的属性值
            response: '',
            // 指定父级展开菜单的值对应查询数据对象中的属性值
            parent: 'parentId'
          };
        }
      },
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
      // 启用多选
      multiple: {
        type: Boolean,
        default: false
      },
      // 多选限制（0代表不限制）（功能尚在完善中）
      limit: {
        type: Number,
        default: 0
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
      // 下拉触发方式（click / hover）
      trigger: {
        type: String,
        default: 'click'
      },
      // 级联展开方式
      expandTrigger: {
        type: String,
        default: 'hover'
      },
      // 输入框尺寸（medium / small / mini）
      size: {
        type: String,
        default: ''
      },
      // 水印
      placeholder: {
        type: String,
        default: '请选择'
      },
      // 选中节点时是否返回选中节点的各级菜单的值（true:返回选中节点下各级菜单的值；false:只返回选中节点本身的值）
      emitPath: {
        type: Boolean,
        default: false
      },
      // 多选时是否折叠标签
      collapseTags: {
        type: Boolean,
        default: true
      },
      // 多选时是否严格遵守父子节点关联（true:父子关联，选择父级时即选中当前父级所有子级；false:父子不关联，选择任意一级时只选中本身）
      checkStrictly: {
        type: Boolean,
        default: true
      },
      // 在改变会影响到绑定值的组件属性时（data/api/params/multiple/limit/visibleOption/removeOption/emitPath/checkStrictly），是否判定影响有效(true:影响绑定值，改变属性时清空绑定值；false:不影响绑定值，改变属性时不清空绑定值)
      checkInfluentially: {
        type: Boolean,
        default: false
      },
      // 显示完整路径
      showAllLevels: {
        type: Boolean,
        default: false
      },
      // 显示编码
      showCode: {
        type: Boolean,
        default: false
      },
      // 是否可搜索
      filterable: {
        type: Boolean,
        default: false
      },
      // 是否可清空
      clearable: {
        type: Boolean,
        default: true,
      },
      // 是否开启懒加载（功能尚在完善中）
      lazy: {
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
      // 宽度自适应（元素宽度随内容变化）
      adaptive: {
        type: Boolean,
        default: false
      },
      // 下划线风格
      underline: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // 默认渲染选项数据对象的配置选项
        defaultProps: {
          // 指定选项的值对应选项数据对象中的属性值
          value: 'key',
          // 指定选项标签对应选项数据对象中的属性值
          label: 'value',
          // 指定选项子选项对应选项数据对象中的属性值
          children: 'children',
          // 指定选项禁用标志位对应选项数据对象中的属性值
          disabled: 'disabled',
          // 指定选项叶子节点标志位对应选项数据对象中的属性值
          leaf: 'leaf',
          // 指定选项数据对象对应响应数据对象中的属性值
          response: '',
          // 指定父级展开菜单的值对应查询数据对象中的属性值
          parent: 'parentId'
        },
        // 数据
        selectData: this.data,
        // 当前接口参数
        currentParams: this.params, // currentParams接收父组件传来的params值
        // 上一次绑定值
        oldValue: '',
        // 数据加载完成
        loadComplete: false,
        // 鼠标移入Dropdown
        mouseenterDropdown: false,
        // 当前节点
        node: null,
        // 回调事件
        resolve: null,
        // 加载中
        loading: null
      }
    },
    computed: {
      currentValue: {
        get() {
          this.oldValue = this.value; // 因el-cascader是先触发change回调事件再更新绑定值，所以这里将当前绑定值直接赋给上一次绑定值
          if(this.$utilStr.isEmpty(this.value)) {
            if(!this.$utilStr.isEmpty(this.modelText)) {
              this.$emit('update:modelText', this.value);
            }
          }
          this.handleAdaptive();
          return this.value;
        },
        set(val) {
          this.$emit('input', val);
        }
      },
      activeProps() {
        let activeProps = Object.assign(this.defaultProps, this.props);
        // 指定次级菜单的展开方式
        activeProps['expandTrigger'] = this.expandTrigger;
        // 指定是否允许多选
        activeProps['multiple'] = this.multiple;
        // 指定是否严格遵守父子节点不互相关联
        activeProps['checkStrictly'] = !this.checkStrictly;
        // 指定选中节点时是否返回选中节点的各级菜单的值
        activeProps['emitPath'] = this.emitPath;
        // 指定是否开启懒加载
        activeProps['lazy'] = this.lazy;
        // 指定开启懒加载时加载动态数据的函数
        activeProps['lazyLoad'] = this.lazyLoad;
        return activeProps;
      },
      activeData() {
        if(!this.$utilStr.isEmpty(this.selectData)) {
          return this.triggerFilterCode(this.selectData);
        } else if(!this.loadComplete) {
          let constData = [];
          if(Array.isArray(this.value)) {
            for (let i = 0;i < this.value.length;i++) {
              let initialValue = this.$utilStr.generateDeepObj(this.activeProps['value'], this.value[i]);
              let initialLabel = this.$utilStr.generateDeepObj(this.activeProps['label'], this.modelText[i] || this.value[i]);
              let initialLeaf = this.$utilStr.generateDeepObj(this.activeProps['leaf'], true);
              let initialObj = this.$utilStr.deepObjMerge(this.$utilStr.deepObjMerge(initialValue, initialLabel), initialLeaf);
              constData.push(initialObj);
            }
          } else if(!this.$utilStr.isEmpty(this.value)) {
            let initialValue = this.$utilStr.generateDeepObj(this.activeProps['value'], this.value);
            let initialLabel = this.$utilStr.generateDeepObj(this.activeProps['label'], this.modelText || this.value);
            let initialLeaf = this.$utilStr.generateDeepObj(this.activeProps['leaf'], true);
            let initialObj = this.$utilStr.deepObjMerge(this.$utilStr.deepObjMerge(initialValue, initialLabel), initialLeaf);
            constData.push(initialObj);
          }
          return constData;
        }
      }
    },
    watch: {
      data: {
        handler(val) {
          this.selectData = val;
          this.loadComplete = !(this.$utilStr.isEmpty(val) && typeof(this.api) === 'function');
          if(this.checkInfluentially) {
            this.handleCascaderClear();
          }
        },
        deep: true,
        immediate: false
      },
      api: {
        handler(val) {
          if(typeof(val) === 'function') {
            this.selectData = [];
            this.loadComplete = false;
          } else if(this.$utilStr.isEmpty(this.data)) {
            this.selectData = [];
            this.loadComplete = true;
          }
          if(this.checkInfluentially) {
            this.handleCascaderClear();
          }
        },
        deep: true,
        immediate: false
      },
      params: {
        handler(val) {
          this.currentParams = val;
          if(typeof(this.api) === 'function') {
            this.selectData = [];
            this.loadComplete = false;
          }
          if(this.checkInfluentially) {
            this.handleCascaderClear();
          }
        },
        deep: true,
        immediate: false
      },
      multiple: {
        handler(val) {
          if(this.checkInfluentially) {
            this.handleCascaderClear();
          } else {
            if(val) {
              if(!Array.isArray(this.value)) {
                if(!this.$utilStr.isEmpty(this.value)) {
                  this.$emit('input', [this.value]);
                } else {
                  this.$emit('input', []);
                }
              }
              if(!Array.isArray(this.modelText)) {
                if(!this.$utilStr.isEmpty(this.modelText)) {
                  this.$emit('update:modelText', [this.modelText]);
                } else {
                  this.$emit('update:modelText', []);
                }
              }
            } else {
              if(Array.isArray(this.value)) {
                if(!this.$utilStr.isEmpty(this.value)) {
                  this.$emit('input', this.value[0]);
                } else {
                  this.$emit('input', '');
                }
              }
              if(Array.isArray(this.modelText)) {
                if(!this.$utilStr.isEmpty(this.modelText)) {
                  this.$emit('update:modelText', this.modelText[0]);
                } else {
                  this.$emit('update:modelText', '');
                }
              }
            }
          }
        },
        immediate: false
      },
      limit: {
        handler() {
          if(this.checkInfluentially) {
            this.handleCascaderClear();
          }
        },
        immediate: false
      },
      visibleOption: {
        handler() {
          if(this.checkInfluentially) {
            this.handleCascaderClear();
          }
        },
        immediate: false
      },
      removeOption: {
        handler() {
          if(this.checkInfluentially) {
            this.handleCascaderClear();
          }
        },
        immediate: false
      },
      emitPath: {
        handler() {
          if(this.checkInfluentially) {
            this.handleCascaderClear();
          }
        },
        immediate: false
      },
      checkStrictly: {
        handler() {
          if(this.checkInfluentially) {
            this.handleCascaderClear();
          }
        },
        immediate: false
      },
      readonly: {
        handler() {
          if(this.filterable) {
            this.$nextTick(() => {
              let allInputEl = this.$refs.cascadeRef.$el.querySelectorAll('input');
              if(allInputEl && allInputEl.length > 0) {
                [].forEach.call(allInputEl, inputEl => {
                  if(this.readonly) {
                    inputEl.setAttribute('readonly', 'readonly');
                  } else if(inputEl.className.includes('el-cascader__search-input')) {
                    inputEl.removeAttribute('readonly');
                  } else if(this.$refs.cascadeRef.readonly) {
                    inputEl.setAttribute('readonly', 'readonly');
                  } else {
                    inputEl.removeAttribute('readonly');
                  }
                })
              }
            });
          }
        },
        immediate: true
      }
    },
    //自定义函数
    methods: {
      // 下拉框出现时触发
      handleVisibleChange(visible) {
        if(visible) {
          if(!this.readonly) {
            if(!this.loadComplete) {
              if(typeof(this.api) === 'function') {
                this.$nextTick(() => {
                  if(!this.loading) {
                    this.loading = this.$loading({
                      target: this.$refs.cascadeRef.popperElm
                    });
                  }
                  if(!this.loading.visible) {
                    if(this.lazy) {
                      this.lazyLoad(this.node, this.resolve);
                    } else {
                      this.loadList();
                    }
                  }
                });
              }
            }
          }
        }
      },
      // 获取数据列表
      loadList() {
        this.loading.visible = true;
        this.api(this.currentParams).then(response => {
          let { success, data } = response.data;
          if(success) {
            this.selectData = this.$utilStr.getValueOfDeepObj(data, this.activeProps['response']);
            this.loadComplete = true;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        }).finally(() => {
          this.loading.visible = false;
        });
      },
      // 懒加载
      lazyLoad(node, resolve) {
        if(this.resolve) {
          if(!node.value) {
            this.loading.visible = true;
          }
          // 追加接口参数
          let initialParentParams = this.$utilStr.generateDeepObj(this.props['parent'], node.value);
          this.$utilStr.deepObjMerge(this.currentParams, initialParentParams);
          this.api(this.currentParams).then(response => {
            let { success, data } = response.data;
            if(success) {
              data = this.$utilStr.getValueOfDeepObj(data, this.activeProps['response']);
              data.forEach(e => {
                if(this.$utilStr.isEmpty(this.$utilStr.getValueOfDeepObj(e, this.activeProps['leaf']))) {
                  let initialLeaf = this.$utilStr.generateDeepObj(this.activeProps['leaf'], !this.$utilStr.getValueOfDeepObj(e, this.activeProps['children']));
                  this.$utilStr.deepObjMerge(e, initialLeaf);
                }
              });
              resolve(data);
              this.loadComplete = true;
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          }).finally(() => {
            this.loading.visible = false;
          });
        } else {
          this.node = node;
          this.resolve = resolve;
        }
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
            let flattenVal = this.$utilStr.flattenTreeNode(val, this.activeProps['value'], null, this.activeProps['children']);
            let flattenResult = [];
            if(this.$utilStr.isExist(visibleCodes)) {
              for (let code of visibleCodes) {
                for (let i = 0, iLen = flattenVal.length;i < iLen;i++) {
                  if(String(this.$utilStr.getValueOfDeepObj(flattenVal[i], this.activeProps['value'])) === String(code)) {
                    flattenResult.push(flattenVal[i]);
                    break;
                  }
                }
              }
            } else {
              flattenResult = flattenVal;
            }
            if(this.$utilStr.isExist(removeCodes)) {
              for (let code of removeCodes) {
                for (let i = flattenResult.length - 1;i >= 0;i--) {
                  if(String(this.$utilStr.getValueOfDeepObj(flattenResult[i], this.activeProps['value'])) === String(code)) {
                    flattenResult.splice(i, 1);
                    break;
                  }
                }
              }
            }
            return this.$utilStr.generateTree(flattenResult, this.activeProps['value'], null, null, this.activeProps['children']);
          }
          return val;
        }
        return [];
      },
      // select值改变
      handleChange(val) {
        let currentKeys = [];
        let currentLabels = [];
        let currentSelections = [];
        if(Array.isArray(val)) {
          currentKeys = val;
        }else {
          currentKeys.push(val);
        }
        currentKeys.forEach(e => {
          let selection = this.$utilStr.getTreeNode(this.activeData, e, this.activeProps['value'], this.activeProps['children']);
          if(selection) {
            currentSelections.push(selection);
          }
        });
        currentSelections.forEach(item => {
          currentLabels.push(this.$utilStr.getValueOfDeepObj(item, this.activeProps['label']));
        });
        if(this.multiple) {
          this.$emit('update:modelText', currentLabels);
          this.$emit('currentChanged', currentKeys, this.oldValue, currentSelections);
        }else {
          this.$emit('update:modelText', currentLabels[0] || '');
          this.$emit('currentChanged', currentKeys[0] || '', this.oldValue, currentSelections[0] || null);
        }
      },
      // cascader清空
      handleCascaderClear(emitEvent) {
        if(this.multiple) {
          this.$emit('input', []);
          this.$emit('update:modelText', []);
          if(emitEvent) {
            this.$emit('currentChanged', [], this.oldValue, []);
          }
        }else {
          this.$emit('input', '');
          this.$emit('update:modelText', '');
          if(emitEvent) {
            this.$emit('currentChanged', '', this.oldValue, null);
          }
        }
      },
      // 重新适应宽度
      handleAdaptive() {
        if(this.adaptive) {
          this.$nextTick(() => {
            this.$nextTick(async () => {
              let cascadeRef = this.$refs.cascadeRef;
              if(cascadeRef) {
                let text;
                if(!this.$utilStr.isEmpty(this.value)) {
                  if(Array.isArray(this.value)) {
                    text = [];
                    for (let e of cascadeRef.presentTags) {
                      text.push(e.text);
                    }
                  } else {
                    text = cascadeRef.presentText;
                  }
                } else if(this.placeholder) {
                  text = this.placeholder;
                }
                let inputBoxEl = cascadeRef.$el.querySelector('.el-input');
                let inputEl = inputBoxEl.querySelector('.el-input__inner');
                let inputStyles = this.$utilElem.getStyle(inputEl);
                if(Array.isArray(text)) {
                  let tagBoxEl = cascadeRef.$el.querySelector('.el-cascader__tags');
                  let tagEl = tagBoxEl.querySelector('.el-tag');
                  let tagStyles = this.$utilElem.getStyle(tagEl);
                  let borderSize = parseFloat(tagStyles.borderLeftWidth) + parseFloat(tagStyles.borderRightWidth);
                  let paddingSize = parseFloat(tagStyles.paddingLeft) + parseFloat(tagStyles.paddingRight);
                  let marginSize = parseFloat(tagStyles.marginLeft) + parseFloat(tagStyles.marginRight);
                  let tagWidth = await this.$utilElem.getTextScreenWidth(text[0], tagStyles.fontSize) + parseFloat(tagStyles.fontSize) + borderSize + paddingSize + marginSize;
                  if(text.length > 1) {
                    let tagEl = tagBoxEl.querySelectorAll('.el-tag')[1];
                    let tagStyles = this.$utilElem.getStyle(tagEl);
                    let borderSize = parseFloat(tagStyles.borderLeftWidth) + parseFloat(tagStyles.borderRightWidth);
                    let paddingSize = parseFloat(tagStyles.paddingLeft) + parseFloat(tagStyles.paddingRight);
                    let marginSize = parseFloat(tagStyles.marginLeft) + parseFloat(tagStyles.marginRight);
                    tagWidth += await this.$utilElem.getTextScreenWidth(text[1], tagStyles.fontSize) + borderSize + paddingSize + marginSize;
                  }
                  let inputPaddingSize = parseFloat(inputStyles.paddingRight);
                  inputBoxEl.style.width = Math.ceil(tagWidth + inputPaddingSize) + 'px';
                } else {
                  let borderSize = parseFloat(inputStyles.borderLeftWidth) + parseFloat(inputStyles.borderRightWidth);
                  let paddingSize = parseFloat(inputStyles.paddingLeft) + parseFloat(inputStyles.paddingRight);
                  inputBoxEl.style.width = Math.ceil(await this.$utilElem.getTextScreenWidth(text, inputStyles.fontSize) + borderSize + paddingSize) + 'px';
                }
              }
            });
          });
        }
      },
      // 鼠标移入触发
      handleMouseenter() {
        if(this.trigger === 'hover') {
          let popperElm = this.$refs.cascadeRef.popperElm;
          this.mouseenterDropdown = true;
          if(!this.$refs.cascadeRef.dropDownVisible) {
            this.$refs.cascadeRef.toggleDropDownVisible();
          }
          popperElm.onmouseenter = () => {
            this.mouseenterDropdown = true;
            popperElm.onmouseenter = null;
          };
          popperElm.onmouseleave = () => {
            this.mouseenterDropdown = false;
            setTimeout(() => {
              if(!this.mouseenterDropdown && this.$refs.cascadeRef.dropDownVisible) {
                this.$refs.cascadeRef.toggleDropDownVisible();
              }
            }, 100);
            popperElm.onmouseleave = null;
          };
        }
      },
      // 鼠标移出触发
      handleMouseleave() {
        if(this.trigger === 'hover') {
          this.mouseenterDropdown = false;
          setTimeout(() => {
            if(!this.mouseenterDropdown && this.$refs.cascadeRef.dropDownVisible) {
              this.$refs.cascadeRef.toggleDropDownVisible();
            }
          }, 100);
        }
      }
    }
  }
</script>
