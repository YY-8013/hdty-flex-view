<template>
  <div
    class="hdty-dialog-select hdty-table-select"
    :class="{ 'is-adaptive': adaptive }"
    :underline="underline">
    <hd-input
      ref="inputRef"
      v-model="input"
      suffix-icon="el-icon-more"
      :size="size"
      clear-class="hdty-dialog-select-clear"
      :placeholder="placeholder"
      :clearable="clearable"
      :readonly="readonly"
      :disabled="disabled"
      :adaptive="adaptive"
      @focus="handleInputFocus"
      @clear="handleInputClear(true)">
    </hd-input>
    <el-dialog
      ref="dialogRef"
      :visible.sync="visible"
      class="hdty-dialog-select-wrapper"
      custom-class="hdty-dialog-select-panel hdty-table-select-dialog"
      :custom-class="activeDialogCustomClass"
      append-to-body
      @open="handleDialogOpen">
      <div slot="title" class="hdty-dialog-header">
        <div class="hdty-dialog-title">
          {{ dialogTitle || placeholder }}
        </div>
        <div
          v-if="refresh"
          class="hdty-dialog-refresh"
          title="点击刷新"
          @click="reload(true)">
        </div>
      </div>
      <hd-pane>
        <div class="hdty-container hdty-flex">
          <div class="hdty-header">
            <el-form
              ref="queryRef"
              :model="queryData"
              :rules="rules"
              inline
              @submit.native.prevent
              @keyup.enter.native="handleQuery">
              <hd-component
                :model="extendData"
                ref="componentRef">
                <hd-query>
                  <hd-query-fixed>
                    <el-form-item label="名  称" prop="name">
                      <hd-factor-input
                        prop="nameFilterFactor"
                        v-model="queryData.name"
                        :model-control.sync="extendData.nameFilterFactor"
                        placeholder="请输入名称">
                      </hd-factor-input>
                    </el-form-item>
                  </hd-query-fixed>
                </hd-query>
              </hd-component>
            </el-form>
            <div class="hdty-btn-container">
              <el-button
                type="info"
                icon="el-icon-search"
                @click="handleQuery">查询</el-button>
              <el-button
                icon="el-icon-delete"
                @click="handleClear">清空</el-button>
            </div>
          </div>
          <div class="hdty-fit">
            <el-table
              v-loading="loading"
              ref="tableRef"
              :data="tableData"
              :row-key="defaultProps['value']"
              :empty-text="emptyText"
              :default-sort="defaultSort"
              :default-expand-all="defaultExpandAll"
              :expand-row-keys="currentExpandRowKeys"
              :highlight-current-row="highlight"
              :select-on-indeterminate="selectOnIndeterminate"
              :border="border"
              :stripe="stripe"
              :fit="fit"
              :show-header="showHeader"
              height="100%"
              @select="handleSelect"
              @select-all="handleSelectAll"
              @sort-change="handleSortChange">
              <el-table-column
                v-if="multiple"
                key="hd_table_select_multiple"
                fixed
                type="selection"
                :reserve-selection="keepSelection"
                align="center"
                width="50">
              </el-table-column>
              <el-table-column
                v-else
                key="hd_table_select_single"
                fixed
                label="操作"
                align="center"
                :width="radioButton ? '80' : '50'">
                <template slot-scope="scope">
                  <el-button
                    v-if="radioButton"
                    :type="$utilStr.getValueOfDeepObj(scope.row, defaultProps['value']) === currentValue ? 'primary' : ''"
                    @click="handleChecked(scope.$index, scope.row)">
                    选择
                  </el-button>
                  <el-radio
                    v-else
                    v-model="currentValue"
                    :label="$utilStr.getValueOfDeepObj(scope.row, defaultProps['value'])"
                    class="is-wordless"
                    @change="handleChecked(scope.$index, scope.row)">
                  </el-radio>
                </template>
              </el-table-column>
              <el-table-column
                fixed
                type="index"
                :index="handleTableIndex"
                label="序号"
                class-name="is-index"
                align="center"
                width="50">
              </el-table-column>
              <el-table-column
                prop="id"
                label="编码"
                sortable="custom"
                header-align="center"
                width="180">
              </el-table-column>
              <el-table-column
                prop="name"
                label="名称"
                sortable="custom"
                header-align="center"
                width="180">
              </el-table-column>
              <el-table-column
                prop="memo"
                label="描述"
                sortable="custom"
                header-align="center"
                min-width="180">
              </el-table-column>
            </el-table>
          </div>
          <div class="hdty-footer">
            <el-pagination
              v-if="$utilStr.isNotEmptyObject(pageOptions)"
              layout="total, sizes, prev, pager, next, jumper"
              :pager-count="5"
              :current-page="pageOptions.current"
              :page-sizes="pageOptions.sizes"
              :page-size="pageOptions.size"
              :total="pageOptions.total"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange">
            </el-pagination>
          </div>
        </div>
      </hd-pane>
      <div slot="footer" class="hdty-dialog-footer">
        <div class="hdty-float-left">当前选择：
          <el-tag
            v-if="Array.isArray(activeTag) && activeTag.length > 0"
            type="success"
            :closable="clearable"
            @close="handleTagClose">
            {{ $utilStr.getValueOfDeepObj(activeTag[0], defaultProps['label']) }}
          </el-tag>
          <el-tag
            v-else-if="!Array.isArray(activeTag) && activeTag"
            type="success"
            :closable="clearable"
            @close="handleTagClose">
            {{ activeTag }}
          </el-tag>
          <el-tag
            v-if="Array.isArray(activeTag) && activeTag.length > 1"
            type="success">
            +{{ activeTag.length - 1 }}
          </el-tag>
        </div>
        <div class="hdty-btn-container">
          <el-button
            @click="cancel">
            取 消
          </el-button>
          <el-button
            v-if="multiple"
            type="primary"
            @click="submit">
            确 定
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { hdComponent, hdForm, hdTable } from "@/utils/util-framework";
  import { example } from './api';
  export default {
    name: "index",
    provide() {
      return {
        bizTableSelect: this
      };
    },
    mixins: [hdComponent, hdForm, hdTable],
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
      // 多选
      multiple: {
        type: Boolean,
        default: false
      },
      // 多选限制（0代表不限制）
      limit: {
        type: [Number, String],
        default: 0
      },
      // 多选值
      currentSelection: {
        type: Array,
        default() {
          return [];
        }
      },
      // 默认的排序列和排序顺序
      /*示例：
      {
        prop: '',  // 排序列字段名
        order: 'ascending'  // 排序顺序（ascending / descending）
      }*/
      defaultSort: {
        type: Object,
      },
      // 展开的行的key集合
      expandRowKeys: {
        type: Array
      },
      // 输入框尺寸（medium / small / mini）
      size: {
        type: String,
        default: ''
      },
      // 会话选择窗口尺寸（large / medium / small / mini / fit）
      dialogSize: {
        type: String,
        default: 'medium'
      },
      // 会话选择窗口标题
      dialogTitle: {
        type: String,
        default: ''
      },
      // 水印
      placeholder: {
        type: String,
        default: '请选择'
      },
      // 在改变会影响到绑定值的组件属性时（multiple/limit），是否判定影响有效(true:影响绑定值，改变属性时清空绑定值；false:不影响绑定值，改变属性时不清空绑定值)
      checkInfluentially: {
        type: Boolean,
        default: false
      },
      // 是否默认展开所有行
      defaultExpandAll: {
        type: Boolean,
        default: false
      },
      // 是否高亮显示单选选中行
      highlight: {
        type: Boolean,
        default: true
      },
      // 开启表格多选时，如果表格数据更新，是否保留之前选中的行
      keepSelection: {
        type: Boolean,
        default: true
      },
      // 开启表格多选时，如果已选中部分行，点击表头全选框是否选中所有行（true：选中所有行；false：取消选中行）
      selectOnIndeterminate: {
        type: Boolean,
        default: true
      },
      // 单选时是否启用按钮样式
      radioButton: {
        type: Boolean,
        default: false
      },
      // 是否带有边框
      border: {
        type: Boolean,
        default: true
      },
      // 是否带有斑马纹
      stripe: {
        type: Boolean,
        default: false
      },
      // 列宽是否自动撑开
      fit: {
        type: Boolean,
        default: true
      },
      // 是否显示表头
      showHeader: {
        type: Boolean,
        default: true
      },
      // 是否显示刷新按钮
      refresh: {
        type: Boolean,
        default: true
      },
      // 是否可清空
      clearable: {
        type: Boolean,
        default: true,
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
        // 渲染选项数据对象的配置选项
        defaultProps: {
          // 指定选项的值对应选项数据对象中的属性值
          value: 'id',
          // 指定选项标签对应选项数据对象中的属性值
          label: 'name',
          // 指定选项数据对象对应响应数据对象中的属性值
          response: 'records',
          // 指定选项的总条目数对应响应数据对象中的属性值
          total: 'total',
          // 指定表格展开的行的唯一标识集合对应响应数据对象中的属性值
          expandKeys: '',
          // 指定表格选中的行的唯一标识集合对应查询数据对象中的属性值
          selection: 'ids'
        },
        // 分页选项
        pageOptions: this.$app.paginationOptions,
        // 表格空数据时显示文本
        emptyText: '暂无数据',
        // 当前展开的行的key集合
        currentExpandRowKeys: this.expandRowKeys,
        // 当前绑定值
        currentValue: this.value,
        // 当前绑定值文本
        input: this.modelText,
        // 上一次绑定值
        oldValue: '',
        // 查询
        queryData: {
          name: '',
          andor: this.$app.factorOptions.logicOpe.and
        },
        // 查询扩展
        extendData: {
          nameFilterFactor: ''
        },
        // 验证
        rules: {},
        // 表格数据
        tableData: [
          {
            id: '1001',
            name: '名称1',
            memo: '业务表格选择控件，绑定值为编码[1001]，显示值为名称[名称1]',
          },
          {
            id: '1002',
            name: '名称2',
            memo: '业务表格选择控件，绑定值为编码[1002]，显示值为名称[名称2]',
          },
          {
            id: '1003',
            name: '名称3',
            memo: '业务表格选择控件，绑定值为编码[1003]，显示值为名称[名称3]',
          }
        ],
        // 多选数据
        multipleData: this.currentSelection,
        // 启用构造数据
        constDataEnabled: true,
        // 构造数据
        constData: [],
        // 缓存数据
        cacheData: {
          pageOptions: null
        },
        // 数据加载完成
        loadComplete: false,
        // 显示Dialog
        visible: false,
        // 加载中
        loading: false
      }
    },
    computed: {
      activeDialogCustomClass() {
        if(this.dialogSize === 'large') {
          return 'hdty-dialog-large';
        } else if(this.dialogSize === 'medium') {
          return 'hdty-dialog-medium';
        } else if(this.dialogSize === 'small') {
          return 'hdty-dialog-small';
        } else if(this.dialogSize === 'mini') {
          return 'hdty-dialog-mini';
        } else if(this.dialogSize === 'fit') {
          return 'hdty-dialog-fit';
        } else {
          return this.dialogSize;
        }
      },
      activeTag() {
        if(this.multiple) {
          return this.multipleData;
        } else {
          return this.input;
        }
      },
      activeConstDataEnabled() {
        return this.multiple
          && this.currentValue.length > 0
          && this.currentSelection.length < 1
          && this.constDataEnabled;
      }
    },
    watch: {
      value: {
        handler(val) {
          this.oldValue = this.value; // 因el-table是先触发change回调事件再更新绑定值，所以这里将当前绑定值直接赋给上一次绑定值
          if(this.$utilStr.isEmpty(val)) {
            if(!this.$utilStr.isEmpty(this.modelText)) {
              this.$emit('update:modelText', val);
            } else if(!this.$utilStr.isEmpty(this.input)) {
              this.input = '';
            }
            if(this.multiple) {
              this.constData = [];
              this.constDataEnabled = true;
              this.clearSelection();
            } else {
              this.clearHighlight();
            }
          }
          if(this.multiple) {
            if(!Array.isArray(val)) {
              if(val) {
                val = [val];
              } else {
                val = [];
              }
            }
            this.currentValue = val;
            if(this.activeConstDataEnabled) {
              this.constData = [];
              for (let i = 0;i < val.length;i++) {
                let initialValue = this.$utilStr.generateDeepObj(this.defaultProps['value'], val[i]);
                this.constData.push(initialValue);
              }
            }
            this.multipleData = this.constData;
          } else {
            this.currentValue = val;
          }
          if(this.$utilStr.isNotEmptyObject(this.pageOptions)) {
            this.pageOptions.current = 1;
          }
        },
        immediate: true
      },
      modelText: {
        handler(val) {
          if (this.$utilStr.isEmpty(val) && !this.$utilStr.isEmpty(this.currentValue)) {
            val = this.currentValue;
          }
          if(this.multiple) {
            if(!Array.isArray(val)) {
              if(val) {
                val = [val];
              } else {
                val = [];
              }
            }
            this.input = this.$utilStr.arraySplit(val);
            if(this.activeConstDataEnabled) {
              for (let i = 0;i < val.length;i++) {
                let initialValue = this.$utilStr.generateDeepObj(this.defaultProps['value'], this.currentValue[i]);
                let initialLabel = this.$utilStr.generateDeepObj(this.defaultProps['label'], val[i]);
                this.constData[i] = this.$utilStr.deepObjMerge(initialValue, initialLabel);
              }
              this.multipleData = this.constData;
            }
          } else {
            this.input = val;
          }
        },
        immediate: true
      },
      pageOptions: {
        handler(val) {
          if(!this.$utilStr.isEqual(val, this.cacheData.pageOptions)) {
            if(typeof(this.api) === 'function') {
              this.loadComplete = false;
            }
          }
        },
        deep: true,
        immediate: false
      },
      multiple: {
        handler(val) {
          if(this.checkInfluentially) {
            this.handleInputClear();
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
            this.handleInputClear();
          }
        },
        immediate: false
      },
      currentSelection: {
        handler(val) {
          this.multipleData = val;
        },
        immediate: false
      },
      expandRowKeys: {
        handler(val) {
          this.currentExpandRowKeys = val;
        },
        immediate: false
      },
      showHeader: {
        handler() {
          this.$nextTick(() => {
            this.handleResetTableFixedBodyTop();
            this.handleResetTableBodyHeight();
          });
        },
        immediate: false
      }
    },
    mounted() {
      this.addTableResizeDoLayoutListener(this.$refs.dialogRef.$el);
    },
    methods: {
      // 设置selection搜索数据
      setSelectionSearchData() {
        if(!this.$utilStr.isEqual(this.queryData[this.defaultProps['selection']], this.currentValue)) {
          let selection = this.currentValue;
          if(Array.isArray(this.queryData[this.defaultProps['selection']]) && !Array.isArray(selection)) {
            selection = [selection]
          }
          this.queryData[this.defaultProps['selection']] = selection;
        }
      },
      // input获得焦点
      handleInputFocus() {
        if(!this.readonly) {
          this.visible = true;
          this.$emit('currentOpening', this);
          if(!this.loadComplete && !this.loading && typeof(this.loadList) === 'function') {
            this.loadList();
          } else {
            if(this.multiple) {
              this.setSelection();
            } else {
              this.setHighlight();
            }
          }
        }
      },
      // 获取数据列表
      loadList() {
        this.loading = true;
        this.setSelectionSearchData();
        // 参数
        let dataParams = {
          ...this.pageOptions,
          ...this.extendData,
          ...this.queryData
        };
        example(dataParams).then(response => {
          // 响应成功回调
          let { success, data } = response.data;
          if(success) {
            if(this.$utilStr.isNotEmptyObject(this.pageOptions)) {
              this.pageOptions.total = this.$utilStr.getValueOfDeepObj(data, this.defaultProps['total']);
              this.cacheData.pageOptions = this.$utilStr.deepClone(this.pageOptions);
            }
            this.tableData = this.$utilStr.getValueOfDeepObj(data, this.defaultProps['response']);
            if(!this.$utilStr.isEmpty(this.defaultProps['expandKeys'])) {
              this.currentExpandRowKeys = this.$utilStr.getValueOfDeepObj(data, this.defaultProps['expandKeys']);
            }
            this.loadComplete = true;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        }).finally(() => {
          if(this.multiple) {
            this.setSelection();
          } else {
            this.setHighlight();
          }
          this.doLayout();
          this.loading = false;
        });
      },
      // 查询
      handleQuery() {
        if(this.$refs.queryRef) {
          this.$refs.queryRef.validate((valid) => {
            if (valid) {
              if(this.$utilStr.isNotEmptyObject(this.pageOptions)) {
                this.pageOptions.current = 1;
                this.cacheData.pageOptions = this.$utilStr.deepClone(this.pageOptions);
              }
              if(typeof(this.loadList) === 'function') {
                this.loadList();
              }
            }
          });
        } else {
          if(this.$utilStr.isNotEmptyObject(this.pageOptions)) {
            this.pageOptions.current = 1;
            this.cacheData.pageOptions = this.$utilStr.deepClone(this.pageOptions);
          }
          if(typeof(this.loadList) === 'function') {
            this.loadList();
          }
        }
      },
      // 清空
      handleClear() {
        if(this.$refs.queryRef) {
          this.$refs.queryRef.resetFields();
        }
        if(this.$refs.componentRef) {
          this.$refs.componentRef.resetFields();
        }
      },
      // 表格进行重新布局
      doLayout() {
        if(this.$refs.tableRef) {
          this.$refs.tableRef.doLayout();
        }
      },
      // 自定义表格索引列的回调方法
      handleTableIndex(index) {
        if(this.$utilStr.isNotEmptyObject(this.pageOptions)) {
          return (this.pageOptions.current - 1) * this.pageOptions.size + index + 1;
        } else {
          return index + 1;
        }
      },
      // 分页每页条数改变
      handleSizeChange(val) {
        this.pageOptions.size = val;
        this.cacheData.pageOptions = this.$utilStr.deepClone(this.pageOptions);
        if(this.pageOptions.current <= Math.ceil(this.pageOptions.total / val)) {
          if(typeof(this.loadList) === 'function') {
            this.loadList();
          }
        }
      },
      // 分页当前页码改变
      handleCurrentChange(val) {
        this.pageOptions.current = val;
        this.cacheData.pageOptions = this.$utilStr.deepClone(this.pageOptions);
        if(typeof(this.loadList) === 'function') {
          this.loadList();
        }
      },
      // 表格排序条件改变
      handleSortChange({ column, prop, order }) {
        let ascs = [];
        let descs = [];
        if (order === 'ascending') {
          ascs = [this.$utilStr.getSuffix(prop) || prop];
        } else if (order === 'descending') {
          descs = [this.$utilStr.getSuffix(prop) || prop];
        }
        if(typeof(this.queryData) === 'object') {
          if(!this.queryData) {
            this.queryData = {};
          }
          this.$set(this.queryData, 'ascs', ascs);
          this.$set(this.queryData, 'descs', descs);
        }
        if(this.$utilStr.isNotEmptyObject(this.pageOptions)) {
          this.pageOptions.current = 1;
          this.cacheData.pageOptions = this.$utilStr.deepClone(this.pageOptions);
        }
        if(typeof(this.loadList) === 'function') {
          this.loadList();
        }
      },
      // 重新计算表格固定列正文距离顶部高度
      handleResetTableFixedBodyTop() {
        let tableEl = this.$refs.tableRef.$el;
        if(tableEl) {
          let tableFixedBodyWrapperEl = tableEl.querySelector('.el-table__fixed-body-wrapper');
          if(tableFixedBodyWrapperEl) {
            let tableFixedHeaderWrapperEl = tableEl.querySelector('.el-table__fixed-header-wrapper');
            if(tableFixedHeaderWrapperEl) {
              tableFixedBodyWrapperEl.style.top = tableFixedHeaderWrapperEl.offsetHeight + 'px';
            } else {
              tableFixedBodyWrapperEl.style.top = 0;
            }
          }
        }
      },
      // 重新计算表格正文高度
      handleResetTableBodyHeight() {
        let tableEl = this.$refs.tableRef.$el;
        if(tableEl) {
          let tableLayout = this.$refs.tableRef.layout;
          let tableLayoutHeight = tableLayout.height;
          if(parseFloat(tableLayoutHeight)) {
            let tableHeight = tableLayout.tableHeight;
            let tableStyle = this.$utilElem.getStyle(tableEl);
            let tableBorderTop = parseFloat(tableStyle.borderTop);
            tableHeight += tableBorderTop;
            if(!this.$utilStr.isNum(tableLayoutHeight)) {
              if(this.$utilStr.isPercent(tableLayoutHeight)) {
                let tableParentEl = tableEl.parentNode;
                if(tableParentEl) {
                  let tableParentStyle = this.$utilElem.getStyle(tableParentEl);
                  let tableParentPaddingTop = parseFloat(tableParentStyle.paddingTop);
                  let tableParentPaddingBottom = parseFloat(tableParentStyle.paddingBottom);
                  let tableParentHeight = tableParentEl.clientHeight - tableParentPaddingTop - tableParentPaddingBottom;
                  tableLayoutHeight = tableParentHeight * this.$utilStr.percentToDecimal(tableLayoutHeight);
                } else {
                  tableLayoutHeight = tableHeight;
                }
              } else {
                tableLayoutHeight = tableHeight;
              }
            }
            if(Math.round(tableLayoutHeight) === tableHeight) {
              let currentTableHeaderHeight = 0;
              let tableHeaderWrapperEl = tableEl.querySelector('.el-table__header-wrapper');
              if(tableHeaderWrapperEl) {
                currentTableHeaderHeight = tableHeaderWrapperEl.offsetHeight;
              }
              let currentTableFooterHeight = 0;
              let tableFooterWrapperEl = tableEl.querySelector('.el-table__footer-wrapper');
              if(tableFooterWrapperEl) {
                currentTableFooterHeight = tableFooterWrapperEl.offsetHeight;
              }
              let tableBodyWrapperEl = tableEl.querySelector('.el-table__body-wrapper');
              if(tableBodyWrapperEl) {
                let currentTableBodyHeight = tableBodyWrapperEl.offsetHeight;
                let activeTableBodyHeight = tableHeight - currentTableHeaderHeight - currentTableFooterHeight;
                if(currentTableBodyHeight !== activeTableBodyHeight) {
                  tableBodyWrapperEl.style.height = activeTableBodyHeight + 'px';
                  let bodyEl = tableBodyWrapperEl.querySelector('.el-table__body');
                  if(bodyEl) {
                    if(activeTableBodyHeight < bodyEl.offsetHeight) {
                      tableEl.classList.add('el-table--scrollable-y');
                    } else {
                      tableEl.classList.remove('el-table--scrollable-y');
                    }
                  }
                }
              }
              let tableFixedBodyWrapperEl = tableEl.querySelector('.el-table__fixed-body-wrapper');
              if(tableFixedBodyWrapperEl) {
                let tableViewportHeight = tableLayout.viewportHeight;
                tableViewportHeight += tableBorderTop;
                let currentTableFixedBodyHeight = tableFixedBodyWrapperEl.offsetHeight;
                let activeTableFixedBodyHeight = tableViewportHeight - currentTableHeaderHeight - currentTableFooterHeight;
                if(currentTableFixedBodyHeight !== activeTableFixedBodyHeight) {
                  tableFixedBodyWrapperEl.style.height = activeTableFixedBodyHeight + 'px';
                }
              }
            }
          }
        }
      },
      // 单选回显
      setHighlight() {
        if(this.$refs.tableRef) {
          let currentRow = null;
          if(this.tableData && this.tableData.length > 0) {
            currentRow = this.tableData.find(e => this.$utilStr.getValueOfDeepObj(e, this.defaultProps['value']) === this.currentValue);
          }
          this.$refs.tableRef.setCurrentRow(currentRow);
        }
      },
      // 单选清空
      clearHighlight() {
        if(this.$refs.tableRef) {
          this.$refs.tableRef.setCurrentRow();
        }
      },
      // 单选
      handleChecked(index, row) {
        this.visible = false;
        let currentKey = this.$utilStr.getValueOfDeepObj(row, this.defaultProps['value']);
        let currentLabel = this.$utilStr.getValueOfDeepObj(row, this.defaultProps['label']);
        this.input = currentLabel;
        this.$emit('input', currentKey); //触发 input 事件，并传入新值
        this.$emit('update:modelText', currentLabel);
        this.$emit('currentChanged', currentKey, this.oldValue, row);
      },
      // 多选回显
      setSelection() {
        if(this.$refs.tableRef) {
          let currentSelections = [];
          this.multipleData.forEach(item => {
            if(this.tableData && this.tableData.length > 0) {
              let currentSelection = this.tableData.find(e => this.$utilStr.getValueOfDeepObj(e, this.defaultProps['value']) === this.$utilStr.getValueOfDeepObj(item, this.defaultProps['value']));
              if(currentSelection) {
                currentSelections.push(currentSelection);
              }
            }
          });
          let surplusSelections = this.multipleData;
          if(this.tableData && this.tableData.length > 0) {
            this.tableData.forEach(item => {
              surplusSelections = surplusSelections.filter(e => this.$utilStr.getValueOfDeepObj(e, this.defaultProps['value']) !== this.$utilStr.getValueOfDeepObj(item, this.defaultProps['value']));
            });
          }
          if(!surplusSelections || surplusSelections.length < 1) {
            this.$refs.tableRef.clearSelection();
          }
          if(this.tableData && this.tableData.length > 0) {
            this.tableData.forEach(row => {
              this.$refs.tableRef.toggleRowSelection(row, false);
            });
          }
          if (currentSelections && currentSelections.length > 0) {
            currentSelections.forEach(row => {
              this.$refs.tableRef.toggleRowSelection(row, true);
            });
          }
        }
      },
      // 多选清空
      clearSelection() {
        if(this.$refs.tableRef) {
          this.$refs.tableRef.clearSelection();
          if(!this.$utilStr.isEmpty(this.multipleData)) {
            this.triggerClearValidate();
          }
        }
      },
      // selection多选
      handleSelect(val) {
        if(this.validateLimit(val)) {
          let selections = this.multipleData;
          if(this.tableData && this.tableData.length > 0) {
            this.tableData.forEach(item => {
              selections = selections.filter(e => this.$utilStr.getValueOfDeepObj(e, this.defaultProps['value']) !== this.$utilStr.getValueOfDeepObj(item, this.defaultProps['value']));
            });
          }
          val.forEach(item => {
            selections = selections.filter(e => this.$utilStr.getValueOfDeepObj(e, this.defaultProps['value']) !== this.$utilStr.getValueOfDeepObj(item, this.defaultProps['value']));
          });
          this.multipleData = val.concat(selections);
        }
        if(!this.$utilStr.isEmpty(this.currentValue) || !this.$utilStr.isEmpty(this.multipleData)) {
          this.triggerClearValidate();
        }
      },
      // selection全选
      handleSelectAll(val) {
        if(this.validateLimit(val)) {
          let selections = this.multipleData;
          if(this.tableData && this.tableData.length > 0) {
            this.tableData.forEach(item => {
              selections = selections.filter(e => this.$utilStr.getValueOfDeepObj(e, this.defaultProps['value']) !== this.$utilStr.getValueOfDeepObj(item, this.defaultProps['value']));
            });
          }
          val.forEach(item => {
            selections = selections.filter(e => this.$utilStr.getValueOfDeepObj(e, this.defaultProps['value']) !== this.$utilStr.getValueOfDeepObj(item, this.defaultProps['value']));
          });
          this.multipleData = val.concat(selections);
        }
        if(!this.$utilStr.isEmpty(this.currentValue) || !this.$utilStr.isEmpty(this.multipleData)) {
          this.triggerClearValidate();
        }
      },
      // 验证多选是否超过限制数量
      validateLimit(val) {
        if(Number(this.limit) > 0 && val.length > this.limit) {
          this.$message({
            showClose: true,
            message: '超出多选限制，最多选择['+this.limit+']项数据',
            type: 'error',
            offset: 76
          });
          val.slice(this.limit).forEach(row => {
            this.$refs.tableRef.toggleRowSelection(row, false);
          });
          return false;
        }
        return true;
      },
      // input清空
      handleInputClear(emitEvent) {
        if(this.multiple) {
          this.multipleData = [];
          this.$emit('input', []);
          this.$emit('update:modelText', []);
          if(emitEvent) {
            this.$emit('currentChanged', [], this.oldValue, []);
          }
        } else {
          this.$emit('input', '');
          this.$emit('update:modelText', '');
          if(emitEvent) {
            this.$emit('currentChanged', '', this.oldValue, null);
          }
        }
      },
      // tag关闭
      handleTagClose() {
        if(this.multiple) {
          let currentCloseOriginRow = this.tableData.find(e => this.$utilStr.getValueOfDeepObj(e, this.defaultProps['value']) === this.$utilStr.getValueOfDeepObj(this.multipleData[0], this.defaultProps['value']));
          if(currentCloseOriginRow) {
            this.$refs.tableRef.toggleRowSelection(currentCloseOriginRow, false);
          }
          this.multipleData.shift();
          if(!this.multipleData || this.multipleData.length < 1) {
            this.$refs.tableRef.clearSelection();
          }
        } else {
          this.$emit('input', '');
          this.$emit('update:modelText', '');
          this.$emit('currentChanged', '', this.oldValue, null);
        }
      },
      // dialog打开
      handleDialogOpen() {
        this.$refs.dialogRef.$el.onclick = evt => {
          evt.stopPropagation();
        };
        this.$nextTick(() => {
          let popupParentHiddenEl = document.querySelector('.el-popup-parent--hidden');
          if(popupParentHiddenEl) {
            popupParentHiddenEl.onclick = evt => {
              evt.stopPropagation();
              popupParentHiddenEl.onclick = null;
            };
          }
        });
      },
      // 提交
      submit() {
        this.visible = false;
        let currentKeys = this.$utilStr.objArrayToArray(this.multipleData, this.defaultProps['value']);
        let currentLabels = this.$utilStr.objArrayToArray(this.multipleData, this.defaultProps['label']);
        this.input = this.$utilStr.arraySplit(currentLabels);
        this.$emit('input', currentKeys); //触发 input 事件，并传入新值
        this.$emit('update:modelText', currentLabels);
        this.$emit('currentChanged', currentKeys, this.oldValue, this.multipleData);
        if(this.constDataEnabled) {
          this.constDataEnabled = false;
        }
        if(this.currentSelection < 1) {
          this.constData = this.multipleData;
        }
      },
      // 取消
      cancel() {
        this.visible = false;
        this.reset();
      },
      // 重置
      reset() {
        if(this.multiple) {
          if(this.currentSelection.length > 0) {
            this.multipleData = this.currentSelection;
          } else {
            this.multipleData = this.constData;
          }
          this.setSelection();
        }
        if(this.$utilStr.isNotEmptyObject(this.pageOptions)) {
          this.pageOptions.current = 1;
        }
      },
      // 重新加载
      reload(immediate) {
        this.handleClear();
        if(immediate) {
          this.handleQuery();
        } else {
          this.loadComplete = false;
        }
      }
    }
  }
</script>

<style scoped>

</style>
