<template>
  <el-select
    ref="selectRef"
    v-model="currentValue"
    :loading="loading"
    :multiple="multiple"
    :multiple-limit="limit"
    :size="size"
    :placeholder="placeholder"
    :collapse-tags="collapseTags"
    :filterable="filterable"
    :clearable="clearable"
    :readonly="readonly"
    :disabled="disabled"
    :class="{ 'has-search-input': filterable && multiple, 'is-disabled': disabled, 'is-adaptive': adaptive }"
    :popper-class="readonly ? 'hdty-hide': ''"
    :underline="underline"
    @mouseenter.native="handleMouseenter"
    @mouseleave.native="handleMouseleave"
    @click.native="handleClick"
    @focus="handleInputFocus"
    @visible-change="handleVisibleChange"
    @change="handleChange"
  >
    <el-option v-for="item in activeData" :key="item.id" :label="item.value" :value="item.key">
      <span v-if="showCode" class="hdty-space-between">
        <span>{{ item.value }}</span>
        <span class="hdty-tips">{{ item.key }}</span>
      </span>
    </el-option>
  </el-select>
</template>

<script>
import { hdComponent } from '@/utils/util-framework';
import { getList } from '@/api/dict-item';
export default {
  name: 'index',
  provide() {
    return {
      hdDictSelect: this
    };
  },
  mixins: [hdComponent],
  props: {
    prop: String,
    // 字典编码
    dictCode: {
      type: [Number, String]
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
    // 多选限制（0代表不限制）
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
    // 多选时是否折叠标签
    collapseTags: {
      type: Boolean,
      default: true
    },
    // 在改变会影响到绑定值的组件属性时（dictCode/multiple/limit/visibleOption/removeOption），是否判定影响有效(true:影响绑定值，改变属性时清空绑定值；false:不影响绑定值，改变属性时不清空绑定值)
    checkInfluentially: {
      type: Boolean,
      default: false
    },
    // 是否显示全选按钮
    showAllButton: {
      type: Boolean,
      default: false
    },
    // 是否显示编码
    showCode: {
      type: Boolean,
      default: false
    },
    // 是否可搜索
    filterable: {
      type: Boolean,
      default: true
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      default: true
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
    },
    // 是否加载字典
    isDict: {
      type: Boolean,
      default: true
    },
    customOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 上一次绑定值
      oldValue: '',
      // 数据
      selectData: [],
      // 当前选择key的集合
      currentKeys: [],
      // 下拉框底部栏元素
      dropdownFooEl: null,
      // 多选限制提示元素
      limitTipEl: null,
      // 全选按钮元素
      allButtonEl: null,
      // 全选key的集合
      allKeys: [],
      // 全选label的集合
      allLabels: [],
      // 全选数据的集合
      allSelections: [],
      // 数据加载完成
      loadComplete: false,
      // 鼠标是否悬停
      hovering: false,
      // 鼠标移入Dropdown
      mouseenterDropdown: false,
      // 加载中
      loading: false
    };
  },
  computed: {
    currentValue: {
      get() {
        this.oldValue = this.value; // 因el-select是先触发change回调事件再更新绑定值，所以这里将当前绑定值直接赋给上一次绑定值
        if (this.$utilStr.isEmpty(this.value)) {
          if (!this.$utilStr.isEmpty(this.modelText)) {
            this.$emit('update:modelText', this.value);
          }
        }
        this.handleAdaptive();
        if (Array.isArray(this.value)) {
          for (let i = this.value.length - 1; i >= 0; i--) {
            if (this.$utilStr.isEmpty(this.value[i])) {
              this.value.splice(i, 1);
              this.modelText.splice(i, 1);
            } else {
              this.value[i] = String(this.value[i]);
            }
          }
          return this.value;
        }
        return this.value && String(this.value);
      },
      set(val) {
        this.$emit('input', val);
      }
    },
    activeData() {
      if (!this.$utilStr.isEmpty(this.selectData)) {
        return this.triggerFilterCode(this.selectData);
      } else if (!this.loadComplete) {
        let constData = [];
        if (Array.isArray(this.currentValue)) {
          for (let i = 0; i < this.currentValue.length; i++) {
            constData.push({
              key: this.currentValue[i],
              value: this.modelText[i] || this.currentValue[i]
            });
          }
        } else if (!this.$utilStr.isEmpty(this.currentValue)) {
          constData.push({
            key: this.currentValue,
            value: this.modelText || this.currentValue
          });
        }
        return constData;
      }
    }
  },
  watch: {
    dictCode: {
      handler() {
        this.selectData = [];
        this.loadComplete = false;
        if (this.checkInfluentially) {
          this.handleSelectClear();
        }
      },
      immediate: false
    },
    multiple: {
      handler(val) {
        if (this.checkInfluentially) {
          this.handleSelectClear();
        } else {
          if (val) {
            if (!Array.isArray(this.value)) {
              if (!this.$utilStr.isEmpty(this.value)) {
                this.$emit('input', [this.value]);
              } else {
                this.$emit('input', []);
              }
            }
            if (!Array.isArray(this.modelText)) {
              if (!this.$utilStr.isEmpty(this.modelText)) {
                this.$emit('update:modelText', [this.modelText]);
              } else {
                this.$emit('update:modelText', []);
              }
            }
          } else {
            if (Array.isArray(this.value)) {
              if (!this.$utilStr.isEmpty(this.value)) {
                this.$emit('input', this.value[0]);
              } else {
                this.$emit('input', '');
              }
            }
            if (Array.isArray(this.modelText)) {
              if (!this.$utilStr.isEmpty(this.modelText)) {
                this.$emit('update:modelText', this.modelText[0]);
              } else {
                this.$emit('update:modelText', '');
              }
            }
          }
        }
        this.setLimitTip();
        this.setAllButton();
      },
      immediate: false
    },
    limit: {
      handler() {
        if (this.checkInfluentially) {
          this.handleSelectClear();
        }
        this.setLimitTip();
      },
      immediate: false
    },
    visibleOption: {
      handler() {
        if (this.checkInfluentially) {
          this.handleSelectClear();
        }
      },
      immediate: false
    },
    removeOption: {
      handler() {
        if (this.checkInfluentially) {
          this.handleSelectClear();
        }
      },
      immediate: false
    },
    showAllButton: {
      handler() {
        this.setAllButton();
        this.setAllData();
      },
      immediate: false
    },
    activeData: {
      handler() {
        let popper = this.$refs.selectRef && this.$refs.selectRef.$refs.popper;
        if (popper) {
          popper.updatePopper();
          this.$nextTick(() => {
            this.$nextTick(() => {
              this.$nextTick(() => {
                popper.updatePopper();
              });
            });
          });
        }
        this.setAllData();
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.setLimitTip();
    this.setAllButton();

    // 判断是否用静态选项
    if (!this.isDict) {
      this.selectData = this.customOptions;
      this.loadComplete = true;
    }
  },
  //自定义函数
  methods: {
    // input获得焦点
    handleInputFocus() {
      if (this.filterable) {
        this.$nextTick(() => {
          let allInputEl = this.$refs.selectRef.$el.querySelectorAll('input');
          if (allInputEl && allInputEl.length > 0) {
            [].forEach.call(allInputEl, (inputEl) => {
              if (this.readonly) {
                inputEl.setAttribute('readonly', 'readonly');
              } else if (inputEl.className.includes('el-select__input')) {
                inputEl.removeAttribute('readonly');
              } else if (this.$refs.selectRef.readonly) {
                inputEl.setAttribute('readonly', 'readonly');
              } else {
                inputEl.removeAttribute('readonly');
              }
            });
          }
        });
      }
    },
    // 下拉框出现时触发
    handleVisibleChange(visible) {
      if (visible) {
        if (!this.readonly) {
          if (!this.loadComplete) {
            if (!this.loading) {
              this.loadList();
            }
          }
        }
      }
    },
    // 获取数据列表
    loadList() {
      this.loading = true;
      // 参数
      let dataParams = {
        typeId: this.dictCode
      };
      getList(dataParams)
        .then((response) => {
          let { success, data } = response.data;
          if (success) {
            this.selectData = data;
            this.loadComplete = true;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 筛选字典
    triggerFilterCode(val) {
      if (val && val.length > 0) {
        let visibleCodes;
        let removeCodes;
        if (this.$utilStr.isExist(this.visibleOption)) {
          visibleCodes = this.$utilStr.toArray(this.visibleOption);
        }
        if (this.$utilStr.isExist(this.removeOption)) {
          removeCodes = this.$utilStr.toArray(this.removeOption);
        }
        if (
          this.$utilStr.isExist(visibleCodes) ||
          this.$utilStr.isExist(removeCodes)
        ) {
          let result = [];
          if (this.$utilStr.isExist(visibleCodes)) {
            for (let code of visibleCodes) {
              for (let i = 0, iLen = val.length; i < iLen; i++) {
                if (String(val[i].key) === String(code)) {
                  result.push(val[i]);
                  break;
                }
              }
            }
          } else {
            result = this.$utilStr.deepClone(val);
          }
          if (this.$utilStr.isExist(removeCodes)) {
            for (let code of removeCodes) {
              for (let i = result.length - 1; i >= 0; i--) {
                if (String(result[i].key) === String(code)) {
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
    // 设置多选限制提示
    setLimitTip() {
      this.clearLimitTip();
      if (this.multiple) {
        if (Number(this.limit)) {
          if (!this.dropdownFooEl) {
            this.dropdownFooEl = document.createElement('div');
            this.dropdownFooEl.className = 'hdty-select-dropdown-footer';
          }
          if (!this.limitTipEl) {
            this.limitTipEl = document.createElement('span');
            this.limitTipEl.className = 'hdty-tips';
            let tipText = document.createTextNode(
              '最多选择[' + this.limit + ']项'
            );
            this.limitTipEl.appendChild(tipText);
            this.dropdownFooEl.appendChild(this.limitTipEl);
            this.$refs.selectRef.popperElm.appendChild(this.dropdownFooEl);
          }
        }
      }
    },
    // 清除多选限制提示
    clearLimitTip() {
      if (this.limitTipEl) {
        this.limitTipEl.remove();
        this.limitTipEl = null;
        if (!this.showAllButton) {
          this.dropdownFooEl.remove();
          this.dropdownFooEl = null;
        }
      }
    },
    // 设置全选按钮
    setAllButton() {
      this.clearAllButton();
      if (this.multiple) {
        if (this.showAllButton) {
          if (!this.dropdownFooEl) {
            this.dropdownFooEl = document.createElement('div');
            this.dropdownFooEl.className = 'hdty-select-dropdown-footer';
          }
          if (!this.allButtonEl) {
            this.allButtonEl = document.createElement('button');
            this.allButtonEl.className = 'hdty-btn';
            this.allButtonEl.onclick = this.handleAllButtonClick;
            let btnText = document.createTextNode('全选');
            this.allButtonEl.appendChild(btnText);
            this.dropdownFooEl.appendChild(this.allButtonEl);
            this.$refs.selectRef.popperElm.appendChild(this.dropdownFooEl);
          }
        }
      }
    },
    // 清除全选按钮
    clearAllButton() {
      if (this.allButtonEl) {
        this.allButtonEl.remove();
        this.allButtonEl = null;
        if (!Number(this.limit)) {
          this.dropdownFooEl.remove();
          this.dropdownFooEl = null;
        }
      }
    },
    // 设置全选数据
    setAllData() {
      this.clearAllData();
      if (this.multiple && this.showAllButton) {
        if (this.activeData && this.activeData.length > 0) {
          this.activeData.forEach((item, index) => {
            if (!Number(this.limit) || index < Number(this.limit)) {
              this.allKeys.push(item.key);
              this.allLabels.push(item.value);
              this.allSelections.push(item);
            }
          });
        }
      }
    },
    // 清除全选数据
    clearAllData() {
      this.allKeys = [];
      this.allLabels = [];
      this.allSelections = [];
    },
    // 点击全选按钮
    handleAllButtonClick() {
      if (!this.allButtonEl.className.includes('is-active')) {
        this.selectAll();
        this.currentKeys = this.allKeys;
        this.$emit('input', this.allKeys);
        this.$emit('update:modelText', this.allLabels);
        this.$emit(
          'currentChanged',
          this.allKeys,
          this.oldValue,
          this.allSelections
        );
      } else {
        this.handleSelectClear(true);
      }
    },
    // 全选
    selectAll() {
      this.allButtonEl.classList.add('is-active');
    },
    // 取消全选
    unselectAll() {
      this.allButtonEl.classList.remove('is-active');
    },
    // select值改变
    handleChange(val) {
      this.currentKeys = [];
      if (Array.isArray(val)) {
        this.currentKeys = val;
      } else {
        this.currentKeys.push(val);
      }
      let currentLabels = [];
      let currentSelections = [];
      this.activeData.forEach((item) => {
        if (this.currentKeys.find((e) => String(e) === String(item.key))) {
          currentLabels.push(item.value);
          currentSelections.push(item);
        }
      });
      if (this.multiple) {
        if (this.showAllButton) {
          if (Number(this.limit)) {
            if (this.currentKeys.length < Number(this.limit)) {
              this.unselectAll();
            } else {
              this.selectAll();
            }
          } else {
            if (this.currentKeys.length < this.activeData.length) {
              this.unselectAll();
            } else {
              this.selectAll();
            }
          }
        }
        this.$emit('update:modelText', currentLabels);
        this.$emit(
          'currentChanged',
          this.currentKeys,
          this.oldValue,
          currentSelections
        );
      } else {
        this.$nextTick(() => {
          this.$refs.selectRef.blur();
        });
        this.$emit('update:modelText', currentLabels[0] || '');
        this.$emit(
          'currentChanged',
          this.currentKeys[0] || '',
          this.oldValue,
          currentSelections[0] || null
        );
      }
    },
    // select清空
    handleSelectClear(emitEvent) {
      if (this.multiple) {
        if (this.showAllButton) {
          this.unselectAll();
          this.currentKeys = [];
        }
        this.$emit('input', []);
        this.$emit('update:modelText', []);
        if (emitEvent) {
          this.$emit('currentChanged', [], this.oldValue, []);
        }
      } else {
        this.$emit('input', '');
        this.$emit('update:modelText', '');
        if (emitEvent) {
          this.$emit('currentChanged', '', this.oldValue, null);
        }
      }
    },
    // 重新适应宽度
    handleAdaptive() {
      if (this.adaptive) {
        this.$nextTick(async () => {
          let selectRef = this.$refs.selectRef;
          if (selectRef) {
            let text;
            if (!this.$utilStr.isEmpty(this.value)) {
              if (Array.isArray(this.value)) {
                text = [];
                for (let e of this.value) {
                  let match = this.activeData.find(
                    (item) => String(item.key) === String(e)
                  );
                  if (match) text.push(match.value);
                }
              } else {
                let match = this.activeData.find(
                  (item) => String(item.key) === String(this.value)
                );
                if (match) text = match.value;
              }
            } else if (this.placeholder) {
              text = this.placeholder;
            }
            let inputBoxEl = selectRef.$el.querySelector('.el-input');
            let inputEl = inputBoxEl.querySelector('.el-input__inner');
            let inputStyles = this.$utilElem.getStyle(inputEl);
            if (Array.isArray(text)) {
              this.$nextTick(async () => {
                let tagBoxEl = selectRef.$el.querySelector('.el-select__tags');
                let tagEl = tagBoxEl.querySelector('.el-tag');
                let tagStyles = this.$utilElem.getStyle(tagEl);
                let borderSize =
                  parseFloat(tagStyles.borderLeftWidth) +
                  parseFloat(tagStyles.borderRightWidth);
                let paddingSize =
                  parseFloat(tagStyles.paddingLeft) +
                  parseFloat(tagStyles.paddingRight);
                let marginSize =
                  parseFloat(tagStyles.marginLeft) +
                  parseFloat(tagStyles.marginRight);
                let tagWidth =
                  (await this.$utilElem.getTextScreenWidth(
                    text[0],
                    tagStyles.fontSize
                  )) +
                  parseFloat(tagStyles.fontSize) +
                  borderSize +
                  paddingSize +
                  marginSize;
                if (text.length > 1) {
                  let tagEl = tagBoxEl.querySelectorAll('.el-tag')[1];
                  let tagStyles = this.$utilElem.getStyle(tagEl);
                  let borderSize =
                    parseFloat(tagStyles.borderLeftWidth) +
                    parseFloat(tagStyles.borderRightWidth);
                  let paddingSize =
                    parseFloat(tagStyles.paddingLeft) +
                    parseFloat(tagStyles.paddingRight);
                  let marginSize =
                    parseFloat(tagStyles.marginLeft) +
                    parseFloat(tagStyles.marginRight);
                  tagWidth +=
                    (await this.$utilElem.getTextScreenWidth(
                      '+ ' + (text.length - 1),
                      tagStyles.fontSize
                    )) +
                    borderSize +
                    paddingSize +
                    marginSize;
                }
                let inputPaddingSize = parseFloat(inputStyles.paddingRight);
                inputBoxEl.style.width =
                  Math.ceil(tagWidth + inputPaddingSize) + 'px';
              });
            } else {
              let borderSize =
                parseFloat(inputStyles.borderLeftWidth) +
                parseFloat(inputStyles.borderRightWidth);
              let paddingSize =
                parseFloat(inputStyles.paddingLeft) +
                parseFloat(inputStyles.paddingRight);
              inputBoxEl.style.width =
                Math.ceil(
                  (await this.$utilElem.getTextScreenWidth(
                    text,
                    inputStyles.fontSize
                  )) +
                    borderSize +
                    paddingSize
                ) + 'px';
            }
          }
        });
      }
    },
    // 鼠标移入触发
    handleMouseenter() {
      this.hovering = true;
      this.$refs.selectRef.inputHovering = true;
      if (this.multiple) {
        let inputElm = this.$refs.selectRef.$el.querySelector('.el-input');
        inputElm.onmouseenter = () => {
          if (this.hovering) {
            this.$refs.selectRef.inputHovering = true;
          }
          inputElm.onmouseenter = null;
        };
        inputElm.onmouseleave = () => {
          if (this.hovering) {
            this.$refs.selectRef.inputHovering = true;
          }
          inputElm.onmouseleave = null;
        };
      }
      if (this.trigger === 'hover') {
        let popperElm = this.$refs.selectRef.popperElm;
        this.mouseenterDropdown = true;
        if (!this.$refs.selectRef.visible) {
          this.$refs.selectRef.toggleMenu();
        }
        popperElm.onmouseenter = () => {
          this.mouseenterDropdown = true;
          popperElm.onmouseenter = null;
        };
        popperElm.onmouseleave = () => {
          this.mouseenterDropdown = false;
          setTimeout(() => {
            if (!this.mouseenterDropdown && this.$refs.selectRef.visible) {
              this.$refs.selectRef.toggleMenu();
            }
          }, 100);
          popperElm.onmouseleave = null;
        };
      }
    },
    // 鼠标移出触发
    handleMouseleave() {
      this.hovering = false;
      this.$refs.selectRef.inputHovering = false;
      if (this.trigger === 'hover') {
        this.mouseenterDropdown = false;
        setTimeout(() => {
          if (!this.mouseenterDropdown && this.$refs.selectRef.visible) {
            this.$refs.selectRef.toggleMenu();
          }
        }, 100);
      }
    },
    // 鼠标单击触发
    handleClick() {
      if (this.filterable) {
        let allInputEl = this.$refs.selectRef.$el.querySelectorAll('input');
        if (allInputEl && allInputEl.length > 0) {
          [].forEach.call(allInputEl, (inputEl) => {
            if (this.readonly) {
              inputEl.setAttribute('readonly', 'readonly');
            } else if (inputEl.className.includes('el-select__input')) {
              inputEl.removeAttribute('readonly');
            } else if (this.$refs.selectRef.readonly) {
              inputEl.setAttribute('readonly', 'readonly');
            } else {
              inputEl.removeAttribute('readonly');
            }
          });
        }
      }
    }
  }
};
</script>
