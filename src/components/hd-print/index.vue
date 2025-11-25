<template>
  <el-dialog
    v-if="popup"
    :visible.sync="closed"
    fullscreen
    :show-close="showClose"
    @closed="handleClose"
    append-to-body>
    <div class="hdty-print">
      <div class="hdty-print-header">
        <button
          v-if="showButton"
          type="button"
          class="hdty-print-button">
          <span @click="handlePrint">
            立即打印
          </span>
        </button>
      </div>
      <div class="hdty-print-body hdty-scroll">
        <div class="hdty-print-container">
          <div
            class="hdty-print-content hdty-scroll page"
            :style="activeContentStyle">
            <slot>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
  <div v-else class="hdty-print">
    <div class="hdty-print-header">
      <button
        v-if="showButton"
        type="button"
        class="hdty-print-button">
        <span @click="handlePrint">
          立即打印
        </span>
      </button>
    </div>
    <div class="hdty-print-body hdty-scroll">
      <div class="hdty-print-container">
        <div
          class="hdty-print-content hdty-scroll page"
          :style="activeContentStyle">
          <slot>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    provide() {
      return {
        hdPrint: this
      };
    },
    props: {
      prop: String,
      // 是否弹出
      popup: {
        type: Boolean,
        default: true
      },
      // 显示
      visible: {
        type: Boolean,
        default: false
      },
      // 显示关闭按钮
      showClose: {
        type: Boolean,
        default: true
      },
      // 显示打印按钮
      showButton: {
        type: Boolean,
        default: true
      },
      // 纸张尺寸
      size: {
        type: String,
        default: 'A4'
      },
      // 纸张方向（portrait / landscape）
      rotated: {
        type: String,
        default: 'portrait'
      },
      // 宽度
      width: {
        type: [Number, String],
        default: null
      },
      // 高度
      height: {
        type: [Number, String],
        default: null
      }
    },
    data() {
      return {
        closed: this.visible,
        sheet: null,
        selfDomTree: [],
        broDomTree: [],
        defaultPrintSize: {
          A4: {
            portrait: [210, 297],
            landscape: [297, 210]
          }
        }
      }
    },
    computed: {
      activeSizeAndRotated() {
        return {
          size: this.size,
          rotated: this.rotated
        }
      },
      activeContentStyle() {
        let style = {
          width: this.width ? this.$utilElem.pixelsFtt(this.width, 'mm') : this.$utilElem.pixelsFtt(this.defaultPrintSize[this.size][this.rotated][0], 'mm'),
          height: this.height ? this.$utilElem.pixelsFtt(this.height, 'mm') : this.$utilElem.pixelsFtt(this.defaultPrintSize[this.size][this.rotated][1], 'mm')
        };
        return this.$utilStr.clearObjUndef(style);
      }
    },
    watch: {
      popup: {
        handler(val) {
          if(val) {
            this.modifyRule(this.getStyleSheet(this.sheet), '#HDTY_app_admin .hdty-layout > .hdty-body', 'display: none;');
            this.removeAttrFromDomTree();
          } else {
            this.modifyRule(this.getStyleSheet(this.sheet), '#HDTY_app_admin .hdty-layout > .hdty-body', 'display: block;');
            this.addAttrToDomTree();
          }
        },
        immediate: false
      },
      visible: {
        handler(val) {
          this.closed = val;
        },
        immediate: false
      },
      activeSizeAndRotated: {
        handler(val) {
          this.modifyRule(this.getStyleSheet(this.sheet), '@page', 'size: ' + val.size + ' ' + val.rotated + ';');
        },
        immediate: false
      }
    },
    mounted() {
      this.sheet = document.createElement('style');
      this.sheet.setAttribute('media', 'print');
      this.sheet.setAttribute('id', 'HDTY_print');
      let sheetText = '@page { size: ' + this.size + ' ' + this.rotated + '; }';
      if(this.popup) {
        sheetText += '#HDTY_app_admin .hdty-layout > .hdty-body { display: none; }';
      }
      this.sheet.innerHTML = sheetText;
      document.head.appendChild(this.sheet);
      if(!this.popup) {
        this.addAttrToDomTree();
      }
    },
    destroyed() {
      document.head.removeChild(this.sheet);
    },
    methods: {
      getStyleSheet(element) {
        return element.sheet || element.styleSheet;
      },
      modifyRule(sheet, selectorText, cssText) {
        let rules = sheet.cssRules;
        if(rules && rules.length > 0) {
          for (let i = 0, iLen = rules.length; i < iLen; i++) {
            let o = rules[i];
            let pat = new RegExp('^' + selectorText + '\\s*{.*?}.*?$');
            if (pat.test(o.cssText)) {
              this.deleteRule(sheet, i);
              this.insertRule(sheet, selectorText, cssText, i);
            }
          }
        }
      },
      insertRule(sheet, selectorText, cssText, position) {
        if (sheet.insertRule) {
          sheet.insertRule(selectorText + '{' + cssText + '}', position);
        } else if (sheet.addRule) {
          sheet.addRule(selectorText, cssText, position);
        }
      },
      deleteRule(sheet, index) {
        if (sheet.deleteRule) {
          sheet.deleteRule(index);
        } else if (sheet.removeRule) {
          sheet.removeRule(index);
        }
      },
      addAttrToBrosDomTree(el) {
        el = el || this.$el;
        if(this.$utilElem.isHTMLElement(el.parentNode)) {
          let parent = el.parentNode;
          let parentName = parent.className;
          if(!parentName.includes('hdty-body') && !parentName.includes('el-dialog__body')) {
            let parentChildren = parent.children;
            Array.from(parentChildren).forEach(childEl => {
              if(!childEl.contains(el) && this.$utilElem.getStyle(childEl, 'display') !== 'none' && childEl.getAttribute('hdty-print-self-dom-tree') === null) {
                childEl.setAttribute('hdty-print-bro-dom-tree', '');
                this.broDomTree.push(childEl);
              }
            });
            this.addAttrToBrosDomTree(parent);
          }
        }
      },
      addAttrToSelfDomTree() {
        if(this.$utilElem.isHTMLElement(this.$el.parentNode)) {
          let parent = this.$el.parentNode;
          let parentName = parent.className;
          while(!parentName.includes('hdty-body') && !parentName.includes('el-dialog__body')) {
            parent.setAttribute('hdty-print-self-dom-tree', '');
            this.selfDomTree.push(parent);
            if(this.$utilElem.isHTMLElement(parent.parentNode)) {
              parent = parent.parentNode;
              parentName = parent.className;
            } else {
              break;
            }
          }
        }
      },
      addAttrToDomTree() {
        this.addAttrToSelfDomTree();
        this.addAttrToBrosDomTree();
      },
      removeAttrFromDomTree() {
        if(this.selfDomTree && this.selfDomTree.length > 0) {
          Array.from(this.selfDomTree).forEach(el => {
            if(el.getAttribute('hdty-print-self-dom-tree') !== null) {
              el.removeAttribute('hdty-print-self-dom-tree');
            }
          });
        }
        this.broDomTree = [];
        if(this.broDomTree && this.broDomTree.length > 0) {
          Array.from(this.broDomTree).forEach(el => {
            if(el.getAttribute('hdty-print-bro-dom-tree') !== null) {
              el.removeAttribute('hdty-print-bro-dom-tree');
            }
          });
        }
        this.broDomTree = [];
      },
      // 打印
      handlePrint() {
        window.print();
      },
      // 关闭
      handleClose() {
        this.$emit('update:visible', this.closed);
        this.$emit('closed');
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/hdtyui/css/prints/screen-style.scss";
</style>

<style>
  @import "../../assets/hdtyui/css/prints/print-style.css";
</style>
