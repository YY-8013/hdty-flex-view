<template>
  <el-table
    v-loading="loading"
    ref="tableRef"
    :data="tableData"
    :row-key="activeProps['rowKey']"
    :size="size"
    :empty-text="activeEmptyText"
    :sum-text="sumText"
    :default-sort="defaultSort"
    :default-expand-all="defaultExpandAll"
    :current-row-key="currentHighlightRowKey"
    :expand-row-keys="currentExpandRowKeys"
    :highlight-current-row="highlight"
    :select-on-indeterminate="selectOnIndeterminate"
    :border="border"
    :stripe="stripe"
    :fit="fit"
    :height="height"
    :max-height="maxHeight"
    :show-header="showHeader"
    :summary="showSummary"
    :show-summary="showSummary"
    :summary-method="summaryMethod"
    :span-method="spanMethod"
    :header-row-class-name="headerRowClass"
    :header-row-style="headerRowStyle"
    :header-cell-class-name="headerCellClass"
    :header-cell-style="headerCellStyle"
    :row-class-name="rowClass"
    :row-style="rowStyle"
    :cell-class-name="cellClass"
    :cell-style="cellStyle"
    @select="handleTableSelect"
    @select-all="handleTableSelectAll"
    @selection-change="handleTableSelectionChange"
    @cell-mouse-enter="handleTableCellMouseEnter"
    @cell-mouse-leave="handleTableCellMouseLeave"
    @cell-click="handleTableCellClick"
    @cell-dblclick="handleTableCellDblclick"
    @row-click="handleTableRowClick"
    @row-dblclick="handleTableRowDblclick"
    @row-contextmenu="handleTableRowContextmenu"
    @header-click="handleTableHeaderClick"
    @header-contextmenu="handleTableHeaderContextmenu"
    @header-dragend="handleTableHeaderDragend"
    @sort-change="handleTableSortChange"
    @current-change="handleTableCurrentChange"
    @expand-change="handleTableExpandChange">
    <template v-for="column in activeTableRealColumns">
      <hd-build-table-column
        :key="column[activeProps['colKey']]"
        :props="activeProps"
        :col="column"
        :keep-selection="keepSelection"
        :index="handleTableIndex">
        <template
          v-for="(value, key) in $scopedSlots"
          :slot="key"
          slot-scope="scope">
          <slot
            :name="key"
            :row="scope.row"
            :column="scope.column"
            :$index="scope.$index">
          </slot>
        </template>
      </hd-build-table-column>
    </template>
  </el-table>
</template>

<script>
  import { hdMethod } from "@/utils/util-framework";
  export default {
    name: "index",
    provide() {
      return {
        hdBuildTable: this
      };
    },
    mixins: [hdMethod],
    props: {
      // 表格数据（通过data直接绑定数据，将不需要通过api请求接口获取数据）
      data: Array,
      // 请求接口
      api: Function,
      // 请求参数
      params: Object,
      // 分页选项
      pageOptions: Object,
      // 渲染表格数据对象的配置选项
      props: {
        type: Object,
        default() {
          return {
            // 指定表格每行的唯一标识对应表格数据对象中的属性值
            rowKey: '',
            // 指定表格每行的索引对应表格数据对象中的属性值
            rowIndex: '',
            // 指定表格的数据对象对应响应数据对象中的属性值
            response: 'records',
            // 指定表格的总条目数对应响应数据对象中的属性值
            total: 'total',
            // 指定表格列的渲染配置对象对应响应数据对象中的属性值
            render: '',
            // 指定表格高亮显示的行的唯一标识对应响应数据对象中的属性值
            currentKey: '',
            // 指定表格展开的行的唯一标识集合对应响应数据对象中的属性值
            expandKeys: '',
            // 指定表格每列的唯一标识对应表格列的渲染配置对象中的属性值
            colKey: 'key',
            // 指定表格表头子列对应表格列的渲染配置对象中的属性值
            colChildren: 'children',
            // 指定表格权限验证的权限标识对应权限数据对象中的属性值
            authority: 'query',
            // 指定表格权限验证的模块标识对应权限数据对象中的属性值
            module: ''
          };
        }
      },
      // 渲染表格列的配置选项
      columns: {
        type: Array,
        default() {
          /*示例：
          [
            {
              key: '',  // 列唯一标识（列如果包含子列，动态更新列时，每次必须更新列唯一标识，element原生问题），为空时组件默认自动分配
              type: '',  // 列类型（default/custom/selection/index/operation/expand/text/number/amount/year/month/date/datetime/time/array/tag/geo/image/file/html），默认default，default与text相同，text不参与表尾合计
              numberFix: '',  // 数字小数保留位数（列类型为number时有效），默认为空，表示保留原数字小数位数不变
              amountSign: '￥',  // 金额符号（列类型为amount时有效），默认为'￥'
              amountFix: '2',  // 金额小数保留位数（列类型为amount时有效），默认为'2'
              yearIcon: '',  // 年份图标类名（列类型为year时有效），默认为空
              yearPattern: 'yyyy年',  // 年份格式（列类型为year时有效），默认为'yyyy年'
              monthIcon: '',  // 月份图标类名（列类型为month时有效），默认为空
              monthPattern: 'yyyy年MM月',  // 月份格式（列类型为month时有效），默认为'yyyy年MM月'
              dateIcon: 'el-icon-date',  // 日期图标类名（列类型为date时有效），默认为'el-icon-date'
              datePattern: 'yyyy-MM-dd',  // 日期格式（列类型为date时有效），默认为'yyyy-MM-dd'
              datetimeIcon: 'el-icon-time',  // 日期时间图标类名（列类型为datetime时有效），默认为'el-icon-time'
              datetimePattern: 'yyyy-MM-dd HH:mm:ss',  // 日期时间格式（列类型为datetime时有效），默认为'yyyy-MM-dd HH:mm:ss'
              timeIcon: 'el-icon-time',  // 时间图标类名（列类型为time时有效），默认为'el-icon-time'
              timePattern: 'HH:mm:ss',  // 时间格式（列类型为time时有效），默认为'HH:mm:ss'
              arrayHyphen: '，',  // 数组连字符（列类型为array时有效），默认为'，'
              tagThemeField: '',  // 标签主题字段名（列类型为tag时有效）（数据为default/brand/primary/success/info/remind/warning/danger，默认为'default'）（支持数组类型设置多个）
              geoEmptyText: '未知',   // 地理位置空数据时显示文本（列类型为geo时有效），默认为'未知'
              geoPointField: '',  // 地理位置坐标点字段名（列类型为geo时有效）（数据为Point对象，即{ lng: 0, lat: 0 }，默认为空）
              imageEmptyIcon: 'icon-no-image',   // 图片空数据时显示图标（列类型为image时有效），默认为'icon-no-image'
              imageEmptyText: '暂无图片',   // 图片空数据时显示文本（列类型为image时有效），默认为'暂无图片'
              imageScaleClass: 'hdty-img-scale-wide',  // 图片比例类名（hdty-img-scale-square/hdty-img-scale-wide/hdty-img-scale-narrow）（列类型为image时有效），默认为'hdty-img-scale-wide',
              filePreviewEmptyIcon: '',   // 文件预览空数据时显示图标（列类型为file时有效），默认为空
              filePreviewEmptyText: '暂不支持预览',   // 文件预览空数据时显示文本（列类型为file时有效），默认为'暂不支持预览'
              filePreviewScaleClass: 'hdty-img-scale-wide',  // 文件预览比例类名（hdty-img-scale-square/hdty-img-scale-wide/hdty-img-scale-narrow）（列类型为file时有效），默认为'hdty-img-scale-wide'
              field: '',  // 列字段名
              label: '',  // 列名
              fixed: false,  // 是否固定列，默认false
              textOverflowTooltip: false,  // 列是否允许内容溢出时显示tooltip提示，默认false
              adaptive: false,  // 列是否自适应宽度
              resizable: true,  // 列是否允许拖动调整宽度（开启表格带边框时有效），默认true
              sortable: false,  // 列是否允许排序，默认false
              sortMethod: null,  // 自定义列排序的回调方法
              sortBy: null,  // 自定义列排序属性的回调方法
              sortOrders: null,  // 自定义列排序策略的轮转顺序
              formatter: null,  // 自定义列正文内容格式化的回调方法
              align: 'left',  // 列正文对齐方式（left/center/right），默认left
              class: '',  // 列正文自定义类名
              headerAlign: 'center',  // 列表头对齐方式（left/center/right），默认center
              headerClass: '',  // 列表头自定义类名
              headerRender: null,  // 自定义列表头区域渲染的回调方法
              width: '',  // 列的宽度
              minWidth: '',  // 列的最小宽度
              children: null // 子列（children里面嵌套列，可以实现多级表头）
            }
          ]*/
          return [];
        }
      },
      // 表格尺寸（medium / small / mini）
      size: {
        type: String
      },
      // 空数据时显示文本（支持HTML内容）
      emptyText: {
        type: String,
        default: '暂无数据'
      },
      // 无权限时显示文本（支持HTML内容）
      unauthorizedText: {
        type: String,
        default: '暂无权限'
      },
      // 表尾合计行首列显示文本
      sumText: {
        type: String,
        default: '合计'
      },
      // 默认列的显示顺序（selection / index / operation / expand）
      defaultOrder: {
        type: Array,
        default() {
          return ['selection', 'index', 'operation', 'expand'];
        }
      },
      // 默认列的固定（selection / index / operation / expand）
      defaultFixed: {
        type: Array,
        default() {
          return ['selection', 'index', 'operation'];
        }
      },
      // 默认列的右侧固定（selection / index / operation / expand）
      defaultFixedRight: {
        type: Array,
        default() {
          return [];
        }
      },
      // 默认索引列的名称
      defaultIndexLabel: {
        type: String,
        default: '序号'
      },
      // 默认操作列的名称
      defaultOperationLabel: {
        type: String,
        default: '操作'
      },
      // 默认操作列的宽度
      defaultOperationWidth: {
        type: [Number, String],
        default: 50
      },
      // 默认操作列宽度是否自适应
      defaultOperationAdaptive: {
        type: Boolean,
        default: true
      },
      // 默认展开列的名称
      defaultExpandLabel: {
        type: String,
        default: ''
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
      // 是否默认展开所有行
      defaultExpandAll: {
        type: Boolean,
        default: false
      },
      // 高亮显示的行的key值
      currentRowKey: {
        type: [Number, String]
      },
      // 展开的行的key集合
      expandRowKeys: {
        type: Array
      },
      // 是否高亮显示单选选中行
      highlight: {
        type: Boolean,
        default: false
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
      // 是否开启授权验证
      authorization: {
        type: Boolean,
        default() {
          return this.$app.btnAuthorizationEnabled;
        }
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
      // 列宽是否自适应（只能根据表头内容自适应宽度，不能根据列的内容自适应宽度）
      fit: {
        type: Boolean,
        default: true
      },
      // 是否显示多选框所在列
      showSelection: {
        type: Boolean,
        default: false
      },
      // 是否显示索引所在列
      showIndex: {
        type: Boolean,
        default: true
      },
      // 是否显示操作按钮所在列
      showOperation: {
        type: Boolean,
        default: false
      },
      // 是否显示展开按钮所在列
      showExpand: {
        type: Boolean,
        default: false
      },
      // 是否显示表头
      showHeader: {
        type: Boolean,
        default: true
      },
      // 是否显示表尾合计行
      showSummary: {
        type: Boolean,
        default: false
      },
      // 高度
      height: {
        type: [Number, String]
      },
      // 最大高度
      maxHeight: {
        type: [Number, String]
      },
      // 自定义表尾合计行的回调方法
      summaryMethod: {
        type: Function
      },
      // 自定义合并行或合并列的回调方法
      spanMethod: {
        type: Function
      },
      // 自定义表头类名的回调方法
      headerRowClass: {
        type: [String, Function]
      },
      // 自定义表头样式的回调方法
      headerRowStyle: {
        type: [Object, Function]
      },
      // 自定义表头单元格类名的回调方法
      headerCellClass: {
        type: [String, Function]
      },
      // 自定义表头单元格样式的回调方法
      headerCellStyle: {
        type: [Object, Function]
      },
      // 自定义行类名的回调方法
      rowClass: {
        type: [String, Function]
      },
      // 自定义行样式的回调方法
      rowStyle: {
        type: [Object, Function]
      },
      // 自定义单元格类名的回调方法
      cellClass: {
        type: [String, Function]
      },
      // 自定义单元格样式的回调方法
      cellStyle: {
        type: [Object, Function]
      }
    },
    data() {
      return {
        // 默认渲染表格数据对象的配置选项
        defaultProps: {
          // 指定表格每行的唯一标识对应表格数据对象中的属性值
          rowKey: '',
          // 指定表格每行的索引对应表格数据对象中的属性值
          rowIndex: '',
          // 指定表格的数据对象对应响应数据对象中的属性值
          response: 'records',
          // 指定表格的总条目数对应响应数据对象中的属性值
          total: 'total',
          // 指定表格列的渲染配置对象对应响应数据对象中的属性值
          render: '',
          // 指定表格高亮显示的行的唯一标识对应响应数据对象中的属性值
          currentKey: '',
          // 指定表格展开的行的唯一标识集合对应响应数据对象中的属性值
          expandKeys: '',
          // 指定表格每列的唯一标识对应表格列的渲染配置对象中的属性值
          colKey: 'key',
          // 指定表格表头子列对应表格列的渲染配置对象中的属性值
          colChildren: 'children',
          // 指定表格权限验证的权限标识对应权限数据对象中的属性值
          authority: 'query',
          // 指定表格权限验证的模块标识对应权限数据对象中的属性值
          module: ''
        },
        // 默认列的配置选项（selection / index / operation / expand）
        defaultColumns: {
          selection: {
            resizable: true,
            sortable: false,
            headerAlign: 'center',
            align: 'center',
            width: '50'
          },
          index: {
            label: '序号',
            resizable: true,
            sortable: false,
            headerAlign: 'center',
            align: 'center',
            class: 'is-index',
            width: '50'
          },
          operation: {
            label: '操作',
            resizable: true,
            sortable: false,
            headerAlign: 'center',
            align: 'center',
            class: 'is-operation'
          },
          expand: {
            resizable: true,
            sortable: false,
            headerAlign: 'center',
            align: 'center',
            width: '45'
          }
        },
        // 请求参数
        currentParams: typeof(this.params) === 'object' && this.params ? this.params : {},
        // 当前分页选项
        currentPageOptions: this.pageOptions,
        // 当前渲染表格列的配置选项
        currentColumns: this.columns,
        // 当前高亮显示的行的key值
        currentHighlightRowKey: this.currentRowKey,
        // 当前展开的行的key集合
        currentExpandRowKeys: this.expandRowKeys,
        // 表格数据
        tableData: this.data,
        // 缓存数据
        cacheData: {
          currentPageOptions: null,
          pageOptionsString: null
        },
        // 表格自适应列的宽度集合
        tableColumnsAdaptiveWidthMaps: null,
        // 表格是否有自适应列
        tableColumnsHasAdaptive: false,
        // 表格列自适应中
        tableColumnsAdapting: false,
        // 表格布局进行中
        tableLayoutDoing: false,
        // 加载中
        loading: false
      }
    },
    computed: {
      activeProps() {
        return Object.assign(this.defaultProps, this.props);
      },
      activeParamsAndPageOptions() {
        return {
          ...this.currentParams,
          ...this.$utilStr.toJSONObj(this.cacheData.pageOptionsString)
        }
      },
      activeDefaultColumns() {
        let defaultColumns = [];
        for (let i = 0, iLen = this.defaultOrder.length; i < iLen; i++) {
          let currentDefaultColumns = this.defaultColumns[this.defaultOrder[i]];
          if(this.defaultOrder[i] === 'selection') {
            currentDefaultColumns['enabled'] = this.showSelection;
            currentDefaultColumns['keepSelection'] = this.keepSelection;
          } else if(this.defaultOrder[i] === 'index') {
            currentDefaultColumns['enabled'] = this.showIndex;
            currentDefaultColumns['label'] = this.defaultIndexLabel;
            currentDefaultColumns['index'] = this.handleTableIndex;
          } else if(this.defaultOrder[i] === 'operation') {
            currentDefaultColumns['enabled'] = this.showOperation;
            currentDefaultColumns['label'] = this.defaultOperationLabel;
            currentDefaultColumns['width'] = this.defaultOperationWidth;
            currentDefaultColumns['adaptive'] = this.defaultOperationAdaptive;
          } else if(this.defaultOrder[i] === 'expand') {
            currentDefaultColumns['enabled'] = this.showExpand;
            currentDefaultColumns['label'] = this.defaultExpandLabel;
          }
          currentDefaultColumns['type'] = this.defaultOrder[i];
          currentDefaultColumns['fixed'] = !this.defaultFixedRight.includes(this.defaultOrder[i]) ? this.defaultFixed.includes(this.defaultOrder[i]) : 'right';
          if(currentDefaultColumns['enabled']) {
            defaultColumns.push(currentDefaultColumns);
          }
        }
        return defaultColumns;
      },
      activeTableColumns() {
        this.tableColumnsHasAdaptive = false;
        let currentTableRealColumns = [];
        let currentTableColumns = this.$utilStr.deepClone(this.activeDefaultColumns.concat(this.currentColumns));
        if(!this.$utilStr.isEmpty(currentTableColumns)) {
          const filterTableUnqualifiedColumns = (columns) => {
            for(let i = columns.length - 1; i >= 0; i--) {
              if(parseFloat(columns[i].width) !== 0) {
                if(columns[i].adaptive) {
                  this.tableColumnsHasAdaptive = true;
                }
                let currentChildrenColumns = columns[i][this.activeProps['colChildren']];
                if (currentChildrenColumns && currentChildrenColumns.length > 0) {
                  filterTableUnqualifiedColumns(currentChildrenColumns)
                }
              } else {
                columns.splice(i, 1);
              }
            }
          };
          filterTableUnqualifiedColumns(currentTableColumns);
          let fixedColumns = [];
          let fixedRightColumns = [];
          for(let i = currentTableColumns.length - 1; i >= 0; i--) {
            let currentColumn = currentTableColumns[i];
            if (typeof(currentColumn.fixed) === 'boolean' && currentColumn.fixed) {
              currentTableColumns.splice(i, 1);
              fixedColumns.unshift(currentColumn);
            } else if (typeof(currentColumn.fixed) === 'string' && currentColumn.fixed === 'right') {
              currentTableColumns.splice(i, 1);
              fixedRightColumns.unshift(currentColumn);
            }
          }
          currentTableRealColumns = fixedColumns.concat(currentTableColumns).concat(fixedRightColumns);
        }
        return currentTableRealColumns;
      },
      activeTableRealColumns() {
        let currentTableColumns = this.$utilStr.deepClone(this.activeTableColumns);
        if(this.tableColumnsHasAdaptive) {
          if(!this.$utilStr.isEmpty(this.tableColumnsAdaptiveWidthMaps)) {
            let currentAdaptiveFlattenColumns = [];
            for (let colIndex in this.tableColumnsAdaptiveWidthMaps) {
              let currentColWidth = this.tableColumnsAdaptiveWidthMaps[colIndex];
              let currentColumnIndexMap = this.activeTableColIndexMatchColumnIndexMaps[colIndex];
              if(currentColumnIndexMap && currentColumnIndexMap.length > 0) {
                let flattenColumnId = '';
                for(let i = 0, iLen = currentColumnIndexMap.length; i < iLen; i++) {
                  let columnIndex = currentColumnIndexMap[i];
                  let flattenColumnParentId = flattenColumnId;
                  flattenColumnId = flattenColumnId + columnIndex;
                  let currentFlattenColumn = currentAdaptiveFlattenColumns.find(e => e.id === flattenColumnId);
                  if(!currentFlattenColumn) {
                    currentAdaptiveFlattenColumns.push({
                      id: flattenColumnId,
                      index: columnIndex,
                      width: currentColWidth,
                      parentId: flattenColumnParentId,
                    });
                  } else {
                    currentFlattenColumn.width = currentFlattenColumn.width + currentColWidth;
                  }
                }
              }
            }
            let currentAdaptiveColumns = this.$utilStr.generateTree(currentAdaptiveFlattenColumns, 'id', '', 'parentId', this.activeProps['colChildren']);
            if(currentAdaptiveColumns && currentAdaptiveColumns.length > 0) {
              const setTableAdaptiveWidth = (adaptiveColumns, tableColumns) => {
                for (let index = 0, iLen = adaptiveColumns.length; index < iLen; index++) {
                  let currentAdaptiveColumn = adaptiveColumns[index];
                  let columnIndex = currentAdaptiveColumn['index'];
                  let currentTableColumn = tableColumns[columnIndex];
                  if(typeof(currentTableColumn) === 'object' && currentTableColumn) {
                    currentTableColumn['width'] = currentAdaptiveColumn['width'];
                  }
                  let currentAdaptiveChildrenColumns = currentAdaptiveColumn[this.activeProps['colChildren']];
                  if(currentAdaptiveChildrenColumns && currentAdaptiveChildrenColumns.length > 0) {
                    let currentTableChildrenColumns = currentTableColumn[this.activeProps['colChildren']];
                    if(currentTableChildrenColumns && currentTableChildrenColumns.length > 0) {
                      setTableAdaptiveWidth(currentAdaptiveChildrenColumns, currentTableChildrenColumns);
                    }
                  }
                }
              };
              setTableAdaptiveWidth(currentAdaptiveColumns, currentTableColumns);
            }
          }
          return this.appendKeyToTableColumns(currentTableColumns);
        } else {
          return this.appendKeyToTableColumns(currentTableColumns);
        }
      },
      activeTableColumnsAndData() {
        return {
          columns: this.activeTableRealColumns,
          data: this.tableData
        }
      },
      activeTableColIndexMatchColumnIndexMaps() {
        let matchMaps = {};
        let colIndex = 0;
        const tableColIndexMatchColumnIndex = (columns, tempMatchArr, resultMatchMaps, colLevel) => {
          for (let index = 0, iLen = columns.length; index < iLen; index++) {
            let currentColumn = columns[index];
            let currentChildrenColumns = currentColumn[this.activeProps['colChildren']];
            if(currentChildrenColumns && currentChildrenColumns.length > 0) {
              if(isNaN(parseInt(tempMatchArr[colLevel]))) {
                tempMatchArr.push(index);
              } else {
                tempMatchArr.splice(colLevel, 1, index);
              }
              tableColIndexMatchColumnIndex(currentChildrenColumns, tempMatchArr, resultMatchMaps, colLevel + 1);
            } else {
              let currentMatchArr = [];
              if(tempMatchArr && tempMatchArr.length > 0) {
                currentMatchArr = tempMatchArr.concat([index]);
              } else {
                currentMatchArr = [index];
              }
              resultMatchMaps[colIndex] = currentMatchArr;
              colIndex++;
            }
            if(!colLevel) {
              tempMatchArr = [];
            }
          }
        };
        tableColIndexMatchColumnIndex(this.activeTableColumns, [], matchMaps, 0);
        return matchMaps;
      },
      activeEmptyText() {
        return this.handleAuthorize() ? this.emptyText : this.unauthorizedText;
      }
    },
    watch: {
      data: {
        handler(val) {
          this.tableData = val;
          if(this.$utilStr.isEmpty(val) && typeof(this.api) === 'function') {
            this.loadList();
          }
        },
        deep: true,
        immediate: false
      },
      api: {
        handler(val) {
          if(typeof(val) === 'function') {
            this.loadList();
          } else if(this.$utilStr.isEmpty(this.data)) {
            this.tableData = [];
          }
        },
        deep: true,
        immediate: false
      },
      params: {
        handler(val) {
          this.currentParams = val;
        },
        deep: true,
        immediate: false
      },
      pageOptions: {
        handler(val) {
          this.currentPageOptions = val;
          if(!this.$utilStr.isEqual(val, this.cacheData.currentPageOptions)) {
            this.cacheData.pageOptionsString = JSON.stringify(val);
          }
        },
        deep: true,
        immediate: false
      },
      activeParamsAndPageOptions: {
        handler() {
          if(typeof(this.api) === 'function') {
            this.loadList();
          }
        },
        deep: true,
        immediate: false
      },
      columns: {
        handler(val) {
          this.currentColumns = val;
        },
        deep: true,
        immediate: false
      },
      activeTableColumns: {
        handler() {
          if(this.tableColumnsHasAdaptive) {
            if(!this.$utilStr.isEmpty(this.tableData)) {
              if(!this.tableColumnsAdapting) {
                this.tableColumnsAdapting = true;
                this.$nextTick(() => {
                  this.$nextTick(() => {
                    this.handleResetTableAdaptiveColWidth();
                    this.tableColumnsAdapting = false;
                  });
                });
              }
            }
          }
        },
        deep: true,
        immediate: true
      },
      activeTableColumnsAndData: {
        handler() {
          if(!this.tableLayoutDoing) {
            this.tableLayoutDoing = true;
            this.$nextTick(() => {
              this.doLayout();
              this.tableLayoutDoing = false;
            });
          }
        },
        deep: true,
        immediate: true
      },
      tableData: {
        handler() {
          if(this.tableColumnsHasAdaptive) {
            this.currentColumns = this.$utilStr.deepClone(this.columns);
          }
        },
        deep: true,
        immediate: false
      },
      currentRowKey: {
        handler(val) {
          this.currentHighlightRowKey = val;
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
      },
      showSummary: {
        handler() {
          this.$nextTick(() => {
            this.handleResetTableBodyHeight();
          });
        },
        immediate: false
      }
    },
    mounted() {
      if(typeof(this.api) === 'function') {
        this.loadList();
      }
    },
    methods: {
      // 手动勾选表格正文多选列的复选框时触发
      handleTableSelect(selection, row) {
        this.$emit('select', selection, row);
      },
      // 手动勾选表格表头多选列的全选框时触发
      handleTableSelectAll(selection) {
        this.$emit('select-all', selection);
      },
      // 表格多选列复选框选中项发生改变时触发
      handleTableSelectionChange(selection) {
        this.$emit('selection-change', selection);
      },
      // 鼠标移入表格单元格时触发
      handleTableCellMouseEnter(row, column, cell, event) {
        this.$emit('cell-mouse-enter', row, column, cell, event);
      },
      // 鼠标移出表格单元格时触发
      handleTableCellMouseLeave(row, column, cell, event) {
        this.$emit('cell-mouse-leave', row, column, cell, event);
      },
      // 点击表格单元格时触发
      handleTableCellClick(row, column, cell, event) {
        this.$emit('cell-click', row, column, cell, event);
      },
      // 双击表格单元格时触发
      handleTableCellDblclick(row, column, cell, event) {
        this.$emit('cell-dblclick', row, column, cell, event);
      },
      // 点击表格行时触发
      handleTableRowClick(row, column, event) {
        this.$emit('row-click', row, column, event);
      },
      // 双击表格行时触发
      handleTableRowDblclick(row, column, event) {
        this.$emit('row-dblclick', row, column, event);
      },
      // 右键点击表格行时触发
      handleTableRowContextmenu(row, column, event) {
        this.$emit('row-contextmenu', row, column, event);
      },
      // 点击表格表头时触发
      handleTableHeaderClick(column, event) {
        this.$emit('header-click', column, event);
      },
      // 右键点击表格表头时触发
      handleTableHeaderContextmenu(column, event) {
        this.$emit('header-contextmenu', column, event);
      },
      // 拖动表格表头改变列宽时触发
      handleTableHeaderDragend(newWidth, oldWidth, column, event) {
        this.$emit('header-dragend', newWidth, oldWidth, column, event);
      },
      // 表格排序条件发生改变时触发
      handleTableSortChange({ column, prop, order }) {
        this.$emit('sort-change', { column, prop, order }, this.currentParams);
      },
      // 表格当前选中行发生改变时触发
      handleTableCurrentChange(currentRow, oldCurrentRow) {
        this.$emit('current-change', currentRow, oldCurrentRow);
      },
      // 表格某一行展开或关闭时触发
      handleTableExpandChange(row, expanded) {
        this.$emit('expand-change', row, expanded);
      },
      // 清空表格多选列复选框选中项
      clearSelection() {
        if(this.$refs.tableRef) {
          this.$refs.tableRef.clearSelection();
        }
      },
      // 切换表格多选列某一行复选框的选中状态
      toggleRowSelection(row, selected) {
        if(this.$refs.tableRef) {
          this.$refs.tableRef.toggleRowSelection(row, selected);
        }
      },
      // 切换表格多选列所有行复选框的选中状态
      toggleAllSelection() {
        if(this.$refs.tableRef) {
          this.$refs.tableRef.toggleAllSelection();
        }
      },
      // 切换表格某一行的展开状态
      toggleRowExpansion(row, expanded) {
        if(this.$refs.tableRef) {
          this.$refs.tableRef.toggleRowExpansion(row, expanded);
        }
      },
      // 设置表格某一行为当前选中行
      setCurrentRow(row) {
        if(this.$refs.tableRef) {
          this.$refs.tableRef.setCurrentRow(row);
        }
      },
      // 清空表格排序条件
      clearSort() {
        if(this.$refs.tableRef) {
          this.$refs.tableRef.clearSort();
        }
      },
      // 表格进行重新排序
      sort(prop, order) {
        if(this.$refs.tableRef) {
          this.$refs.tableRef.sort(prop, order);
        }
      },
      // 表格进行重新布局
      doLayout() {
        if(this.$refs.tableRef) {
          this.$refs.tableRef.doLayout();
        }
      },
      // 获取数据列表
      loadList() {
        if (this.handleAuthorize()) {
          this.loading = true;
          // 参数
          let dataParams = {
            ...this.currentPageOptions,
            ...this.currentParams
          };
          this.api(dataParams).then(response => {
            let { success, data } = response.data;
            if(success) {
              if(!this.$utilStr.isEmpty(this.activeProps['render'])) {
                this.currentColumns = this.$utilStr.getValueOfDeepObj(data, this.activeProps['render']);
              }
              if(this.$utilStr.isNotEmptyObject(this.currentPageOptions)) {
                this.currentPageOptions.total = this.$utilStr.getValueOfDeepObj(data, this.activeProps['total']);
                this.cacheData.currentPageOptions = this.$utilStr.deepClone(this.currentPageOptions);
              }
              this.tableData = this.$utilStr.getValueOfDeepObj(data, this.activeProps['response']);
              if(!this.$utilStr.isEmpty(this.activeProps['currentKey'])) {
                this.currentHighlightRowKey = this.$utilStr.getValueOfDeepObj(data, this.activeProps['currentKey']);
              }
              if(!this.$utilStr.isEmpty(this.activeProps['expandKeys'])) {
                this.currentExpandRowKeys = this.$utilStr.getValueOfDeepObj(data, this.activeProps['expandKeys']);
              }
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          }).finally(() => {
            this.loading = false;
          });
        }
      },
      // 授权验证
      handleAuthorize() {
        if(this.activeProps['authority']) {
          return this.getUserAuthority(this.activeProps['authority'], this.activeProps['module'] || this.queryComponentModuleName() || this.$route.name, this.authorization);
        } else {
          return true;
        }
      },
      // 分配表格列唯一标识
      appendKeyToTableColumns(columns) {
        if(columns && columns.length > 0) {
          for(let i = 0, iLen = columns.length; i < iLen; i++) {
            if(!columns[i][this.activeProps['colKey']]) {
              columns[i][this.activeProps['colKey']] = this.$utilStr.uuid(32, 16);
            }
            let childrenColumns = columns[i][this.activeProps['colChildren']];
            if(childrenColumns && childrenColumns.length > 0) {
              this.appendKeyToTableColumns(childrenColumns);
            }
          }
        }
        return columns;
      },
      // 自定义表格索引列的回调方法
      handleTableIndex(index) {
        if(typeof(this.api) === 'function' && !this.$utilStr.isEmpty(this.activeProps['rowIndex'])) {
          return this.$utilStr.getValueOfDeepObj(this.tableData[index], this.activeProps['rowIndex']);
        }else if(this.$utilStr.isNotEmptyObject(this.currentPageOptions)) {
          return (this.currentPageOptions.current - 1) * this.currentPageOptions.size + index + 1;
        } else {
          return index + 1;
        }
      },
      // 重新计算表格自适应列宽度
      handleResetTableAdaptiveColWidth() {
        let tableEl = this.$refs.tableRef.$el;
        if(tableEl) {
          let tableBodyWrapperEl = tableEl.querySelector('.el-table__body-wrapper');
          if(tableBodyWrapperEl) {
            let allTableRowEls = tableBodyWrapperEl.querySelectorAll('.el-table__row');
            if(allTableRowEls && allTableRowEls.length > 0) {
              let currentAdaptiveColWidthMaps = {};
              [].forEach.call(allTableRowEls, rowEl => {
                let allColEls = rowEl.querySelectorAll('td');
                [].forEach.call(allColEls, (colEl, colIndex) => {
                  let isAdaptiveCol = colEl.className.includes('is-adaptive');
                  if(isAdaptiveCol) {
                    let currentAdaptiveColWidth = 0;
                    let currentAdaptiveColRealWidth = 0;
                    let cellEl = colEl.querySelector('.cell');
                    if(cellEl) {
                      let adaptiveEl = cellEl.children;
                      if(adaptiveEl && adaptiveEl.length > 0) {
                        [].forEach.call(adaptiveEl, targetEl => {
                          let targetStyle = this.$utilElem.getStyle(targetEl);
                          currentAdaptiveColWidth += targetEl.offsetWidth + parseFloat(targetStyle.marginLeft) + parseFloat(targetStyle.marginRight);
                        });
                        if(currentAdaptiveColWidth) {
                          let cellStyle = this.$utilElem.getStyle(cellEl);
                          currentAdaptiveColRealWidth += currentAdaptiveColWidth + parseFloat(cellStyle.paddingLeft) + parseFloat(cellStyle.paddingRight);
                        }
                        if(currentAdaptiveColRealWidth) {
                          let colStyle = this.$utilElem.getStyle(colEl);
                          currentAdaptiveColRealWidth += parseFloat(colStyle.borderLeft) + parseFloat(colStyle.borderRight);
                        }
                        if(isNaN(parseInt(currentAdaptiveColWidthMaps[colIndex]))) {
                          currentAdaptiveColWidthMaps[colIndex] = currentAdaptiveColRealWidth > 0 ? Math.floor(currentAdaptiveColRealWidth + 1) : 0;
                        } else if(currentAdaptiveColWidthMaps[colIndex] < currentAdaptiveColRealWidth) {
                          currentAdaptiveColWidthMaps[colIndex] = Math.floor(currentAdaptiveColRealWidth + 1);
                        }
                      }
                    }
                  }
                });
              });
              let allTableColgroupEls = tableEl.querySelectorAll('colgroup');
              if(allTableColgroupEls && allTableColgroupEls.length > 0) {
                [].forEach.call(allTableColgroupEls, colgroupEl => {
                  for (let k in currentAdaptiveColWidthMaps) {
                    if(currentAdaptiveColWidthMaps.hasOwnProperty(k)) {
                      let currentAdaptiveColEl = colgroupEl.children && colgroupEl.children[k];
                      if(currentAdaptiveColEl) {
                        let currentAdaptiveColRealWidth = currentAdaptiveColWidthMaps[k];
                        if(currentAdaptiveColEl.getAttribute('width') !== currentAdaptiveColRealWidth) {
                          currentAdaptiveColEl.setAttribute('width', currentAdaptiveColRealWidth);
                        }
                      }
                    }
                  }
                });
              }
              this.tableColumnsAdaptiveWidthMaps = currentAdaptiveColWidthMaps;
            }
          }
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
      }
    }
  }
</script>

<style scoped>

</style>
