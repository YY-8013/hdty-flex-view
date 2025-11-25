<template>
  <div class="hdty-container hdty-flex">
    <div class="hdty-header">
      <hd-button-container>
        <el-button-group>
          <el-button @click="showSelection = !showSelection">{{ !showSelection?'开启':'关闭' }}多选框</el-button>
          <el-button @click="showIndex = !showIndex">{{ !showIndex?'开启':'关闭' }}索引</el-button>
          <el-button @click="showOperation = !showOperation">{{ !showOperation?'开启':'关闭' }}操作栏</el-button>
          <el-button @click="showExpand = !showExpand">{{ !showExpand?'开启':'关闭' }}展开行</el-button>
          <el-button @click="showHeader = !showHeader">{{ !showHeader?'开启':'关闭' }}表头</el-button>
          <el-button @click="showSummary = !showSummary">{{ !showSummary?'开启':'关闭' }}合计行</el-button>
          <el-button @click="showImage = !showImage">{{ !showImage?'显示':'隐藏' }}图片</el-button>
          <el-button @click="appendColumn = !appendColumn">{{ !appendColumn?'增加':'减少' }}列</el-button>
        </el-button-group>
      </hd-button-container>
    </div>
    <div class="hdty-fit">
      <hd-build-table
        ref="tableRef"
        :data="tableData"
        :props="buildTableOptions.props"
        :columns="buildTableOptions.columns"
        :default-operation-width="112"
        :show-selection="showSelection"
        :show-index="showIndex"
        :show-operation="showOperation"
        :show-expand="showExpand"
        :show-header="showHeader"
        :show-summary="showSummary"
        height="100%"
        :summary-method="handleSummaryMethod">
        <slot slot="operation" slot-scope="scope">
          <hd-button-container>
            <hd-button
              type="success"
              @click="handleClick(scope.$index, scope.row)">
              自定义按钮
            </hd-button>
          </hd-button-container>
        </slot>
        <slot slot="expand" slot-scope="scope">
          <div>{{ scope.row }}</div>
        </slot>
        <slot slot="custom_vo.item2" slot-scope="scope">
          <a
            href="javascript:;"
            underline
            @click="handleHyperlink(scope.$index, scope.row)">
            <el-tag type="success">
              {{ scope.row.vo.item2 }}
            </el-tag>
          </a>
        </slot>
      </hd-build-table>
    </div>
  </div>
</template>

<script>
  import { hdList } from '@/utils/util-framework';
  export default {
    name: "Table1",
    provide() {
      return {
        hdList: this
      };
    },
    mixins: [hdList],
    data() {
      return {
        // 是否开启多选框，默认false
        showSelection: false,
        // 是否开启索引，默认true
        showIndex: true,
        // 是否开启操作栏，默认false
        showOperation: false,
        // 是否开启展开行，默认false
        showExpand: false,
        // 是否开启表头，默认true
        showHeader: true,
        // 是否开启合计行，默认false
        showSummary: false,
        // 显示图片
        showImage: false,
        // 增加列
        appendColumn: false,
        // 渲染表格的配置选项
        buildTableOptions: {
          /* 渲染表格数据对象的配置选项
            rowKey: '',  // 指定表格每行的唯一标识对应表格数据对象中的属性值
            rowIndex: '',  // 指定表格每行的索引对应表格数据对象中的属性值
            response: 'records',  // 指定表格的数据对象对应响应数据对象中的属性值，默认records
            total: 'total',  // 指定表格的总条目数对应响应数据对象中的属性值，默认total
            render: '',  // 指定表格列的渲染配置对象对应响应数据对象中的属性值
            currentKey: '',  // 指定表格高亮显示的行的唯一标识对应响应数据对象中的属性值
            expandKeys: '',  // 指定表格展开的行的唯一标识集合对应响应数据对象中的属性值
            colKey: 'key',  // 指定表格每列的唯一标识对应表格列的渲染配置对象中的属性值，默认key
            colChildren: 'children',  // 指定表格表头子列对应表格列的渲染配置对象中的属性值，默认children
            authority: 'query',  // 指定表格权限验证的权限标识对应权限数据对象中的属性值，默认query
            module: ''  // 指定表格权限验证的模块标识对应权限数据对象中的属性值
          */
          props: {
            rowKey: 'vo.id',
            colKey: 'key',
            colChildren: 'children'
          },
          /* 渲染表格列的配置选项
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
          */
          columns: [
            {
              field: 'vo.item1',
              label: '默认列',
              sortable: true,
              width: 90
            },
            {
              type: 'custom',
              field: 'vo.item2',
              label: '自定义列',
              width: 90
            },
            {
              type: 'year',
              field: 'vo.item3',
              label: '年份列',
              width: 80
            },
            {
              type: 'month',
              field: 'vo.item4',
              label: '月份列',
              width: 100
            },
            {
              type: 'date',
              field: 'vo.item5',
              label: '日期列',
              width: 120
            },
            {
              type: 'datetime',
              field: 'vo.item6',
              label: '日期时间列',
              width: 180
            },
            {
              type: 'time',
              field: 'vo.item7',
              label: '时间列',
              width: 100
            },
            {
              type: 'array',
              arrayHyphen: '，',
              field: 'vo.item8',
              label: '数组元素列',
              minWidth: 110
            },
            {
              type: 'tag',
              tagThemeField: 'vo.tagTheme',
              field: 'vo.item9',
              label: '标签元素列',
              minWidth: 150
            },
            {
              type: 'geo',
              geoPointField: 'vo.geoPoint',
              field: 'vo.item10',
              label: '地理位置列',
              minWidth: 160
            },
            {
              type: 'html',
              field: 'vo.item11',
              label: 'HTML元素列',
              minWidth: 110
            },
            {
              label: '多级表头1',
              children: [
                {
                  type: 'number',
                  field: 'vo.item12',
                  label: '数字列',
                  width: 100
                },
                {
                  type: 'amount',
                  field: 'vo.item13',
                  label: '金额列',
                  width: 100
                }
              ]
            }
          ]
        },
        // 表格数据
        tableData: [
          {
            vo: {
              id: '1',
              item1: '示例1',
              item2: '超链接',
              item3: '2021',
              item4: '202112',
              item5: '20211231',
              item6: '20211231235959',
              item7: '235959',
              item8: ['种类1', '种类2'],
              item9: ['标签1', '标签2'],
              item10: '呼和浩特火车站',
              item11: '<p class="hdty-danger-color">html内容</p>',
              item12: 1234,
              item13: 5678,
              item14: 9999,
              tagTheme: ['primary', 'info'],
              geoPoint: {
                lng: 111.671574,
                lat: 40.834886
              },
              imageUrl: 'https://images.pexels.com/photos/620337/pexels-photo-620337.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=800'
            }
          },
          {
            vo: {
              id: '2',
              item1: '示例2',
              item2: '超链接',
              item3: '2021',
              item4: '202112',
              item5: '20211231',
              item6: '20211231235959',
              item7: '235959',
              item8: ['种类1', '种类2'],
              item9: ['标签1', '标签2'],
              item10: '呼和浩特白塔机场',
              item11: '<p class="hdty-danger-color">html内容</p>',
              item12: 1234,
              item13: 5678,
              item14: 9999,
              tagTheme: ['warning', 'danger'],
              geoPoint: {
                lng: 111.833126,
                lat: 40.860645
              },
              imageUrl: 'https://images.pexels.com/photos/2138922/pexels-photo-2138922.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=800'
            }
          }
        ]
      }
    },
    watch: {
      showImage: {
        handler(val) {
          if(val) {
            this.buildTableOptions.columns.unshift({
              type: 'image',
              field: 'vo.imageUrl',
              label: '图片列',
              width: 120
            });
          } else {
            this.buildTableOptions.columns.shift();
          }
        },
        immediate: false
      },
      appendColumn: {
        handler(val) {
          if(val) {
            this.buildTableOptions.columns.push({
              label: '多级表头2',
              children: [
                {
                  label: '多级表头2-1',
                  children: [
                    {
                      type: 'number',
                      field: 'vo.item14',
                      label: '数字列',
                      width: 100
                    }
                  ]
                }
              ]
            });
          } else {
            this.buildTableOptions.columns.pop();
          }
        },
        immediate: false
      }
    },
    methods: {
      // 自定义按钮点击
      handleClick(index, row) {
        console.log('自定义按钮点击', index, row)
      },
      // 自定义超链接点击
      handleHyperlink(index, row) {
        console.log('自定义超链接点击', index, row)
      }
    }
  }
</script>

<style scoped>

</style>
