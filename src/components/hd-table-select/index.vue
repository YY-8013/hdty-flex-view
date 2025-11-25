<template>
  <div
    class="hdty-dialog-select hdty-table-select"
    :class="{ 'is-adaptive': adaptive }"
    :underline="underline"
  >
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
      @clear="handleInputClear(true)"
    ></hd-input>
    <el-dialog
      ref="dialogRef"
      :visible.sync="visible"
      class="hdty-dialog-select-wrapper"
      custom-class="hdty-dialog-select-panel hdty-table-select-dialog"
      :custom-class="activeDialogCustomClass"
      append-to-body
      @open="handleDialogOpen"
    >
      <div slot="title" class="hdty-dialog-header">
        <div class="hdty-dialog-title">{{ dialogTitle || placeholder }}</div>
        <div
          v-if="refresh"
          class="hdty-dialog-refresh"
          title="点击刷新"
          @click="reload(true)"
        ></div>
        <slot name="title"></slot>
      </div>
      <hd-pane>
        <div class="hdty-container hdty-flex">
          <div class="hdty-header">
            <el-form
              v-if="
                typeof api === 'function' &&
                (activeNormalSearchItem.length > 0 ||
                  activeSuperSearchItem.length > 0 ||
                  activeMoreSearchItem.length > 0)
              "
              ref="queryRef"
              :model="queryData"
              :rules="rules"
              inline
              @submit.native.prevent
              @keyup.enter.native="handleQuery"
            >
              <hd-component :model="extendData" ref="componentRef">
                <hd-query>
                  <hd-query-fixed>
                    <el-form-item
                      v-for="(item, index) in activeNormalSearchItem"
                      :key="index"
                      :label="item.label"
                      :prop="item.field"
                    >
                      <hd-component-item
                        :prop="
                          item.type !== 'factorInput'
                            ? item.field
                            : item.field + 'FilterFactor'
                        "
                        :type="item.type"
                        v-model="queryData[item.field]"
                        :label.sync="
                          extendData[
                            item.type !== 'factorInput'
                              ? item.field
                              : item.field + 'FilterFactor'
                          ]
                        "
                        :minlength="item.minlength"
                        :maxlength="item.maxlength"
                        :show-word-limit="item.showWordLimit"
                        :show-password="item.showPassword"
                        :textarea-rows="item.textareaRows"
                        :textarea-autosize="item.textareaAutosize"
                        :fuzzy="item.fuzzy"
                        :show-control-button="item.showControlButton"
                        :control-button-readonly="item.controlButtonReadonly"
                        :control-button-disabled="item.controlButtonDisabled"
                        :control-button-position="item.controlButtonPosition"
                        :barcode-auto-input="item.barcodeAutoInput"
                        :min="item.min"
                        :max="item.max"
                        :step="item.step"
                        :precision="item.precision"
                        :step-strictly="item.stepStrictly"
                        :optional-range="item.optionalRange"
                        :dict="item.dict"
                        :visible-option="item.visibleOption"
                        :remove-option="item.removeOption"
                        :multiple="item.multiple"
                        :limit="item.limit"
                        :trigger="item.trigger"
                        :expand-trigger="item.expandTrigger"
                        :filter-code="item.filterCode"
                        :show-level="item.showLevel"
                        :check-level="item.checkLevel"
                        :map-party="item.mapParty"
                        :center="item.center"
                        :zoom="item.zoom"
                        :marker="item.marker"
                        :drawing-mode="item.drawingMode"
                        :map-auto-view="item.mapAutoView"
                        :format="item.format"
                        :value-format="item.valueFormat"
                        :default-time="item.defaultTime"
                        :picker-align="item.pickerAlign"
                        :optional-days="item.optionalDays"
                        :first-day-of-week="item.firstDayOfWeek"
                        :shortcuts-options="item.shortcutsOptions"
                        :moment-select-options="item.momentSelectOptions"
                        :picker-options="item.pickerOptions"
                        :keep-time="item.keepTime"
                        :size="item.size"
                        :dialog-select-size="item.dialogSelectSize"
                        :dialog-select-title="item.dialogSelectTitle"
                        :placeholder="item.placeholder"
                        :start-placeholder="item.startPlaceholder"
                        :end-placeholder="item.endPlaceholder"
                        :range-separator="item.rangeSeparator"
                        :collapse-tags="item.collapseTags"
                        :emit-path="item.emitPath"
                        :show-dept="item.showDept"
                        :show-city="item.showCity"
                        :check-final-level="item.checkFinalLevel"
                        :check-strictly="item.checkStrictly"
                        :check-influentially="item.checkInfluentially"
                        :default-expand-first="item.defaultExpandFirst"
                        :show-all-button="
                          typeof item.showAllButton === 'boolean'
                            ? item.showAllButton
                            : true
                        "
                        :show-refresh-button="item.showRefreshButton"
                        :show-all-levels="item.showAllLevels"
                        :show-code="item.showCode"
                        :show-full-address="item.showFullAddress"
                        :lazy="item.lazy"
                        :accordion="item.accordion"
                        :filterable="
                          typeof item.filterable === 'boolean'
                            ? item.filterable
                            : true
                        "
                        :clearable="item.clearable"
                        :readonly="item.readonly"
                        :disabled="item.disabled"
                        :adaptive="item.adaptive"
                        :underline="item.underline"
                      ></hd-component-item>
                    </el-form-item>
                    <el-form-item
                      v-if="
                        (activeMoreSearchItem &&
                          activeMoreSearchItem.length > 0) ||
                        (activeSuperSearchItem &&
                          activeSuperSearchItem.length > 0)
                      "
                      prop="andor"
                      slot="after"
                    >
                      <hd-component-item
                        type="factorButtonRadio"
                        v-model="queryData.andor"
                      ></hd-component-item>
                    </el-form-item>
                    <el-form-item
                      v-for="(item, index) in activeSuperSearchItem"
                      :key="index"
                      :prop="item.field"
                      slot="after"
                    >
                      <hd-component-item
                        :prop="
                          item.type !== 'factorInput'
                            ? item.field
                            : item.field + 'FilterFactor'
                        "
                        :type="item.type"
                        v-model="queryData[item.field]"
                        :label.sync="
                          extendData[
                            item.type !== 'factorInput'
                              ? item.field
                              : item.field + 'FilterFactor'
                          ]
                        "
                        :minlength="item.minlength"
                        :maxlength="item.maxlength"
                        :show-word-limit="item.showWordLimit"
                        :show-password="item.showPassword"
                        :textarea-rows="item.textareaRows"
                        :textarea-autosize="item.textareaAutosize"
                        :fuzzy="item.fuzzy"
                        :show-control-button="item.showControlButton"
                        :control-button-readonly="item.controlButtonReadonly"
                        :control-button-disabled="item.controlButtonDisabled"
                        :control-button-position="item.controlButtonPosition"
                        :barcode-auto-input="item.barcodeAutoInput"
                        :min="item.min"
                        :max="item.max"
                        :step="item.step"
                        :precision="item.precision"
                        :step-strictly="item.stepStrictly"
                        :optional-range="item.optionalRange"
                        :dict="item.dict"
                        :visible-option="item.visibleOption"
                        :remove-option="item.removeOption"
                        :multiple="item.multiple"
                        :limit="item.limit"
                        :trigger="item.trigger"
                        :expand-trigger="item.expandTrigger"
                        :filter-code="item.filterCode"
                        :show-level="item.showLevel"
                        :check-level="item.checkLevel"
                        :map-party="item.mapParty"
                        :center="item.center"
                        :zoom="item.zoom"
                        :marker="item.marker"
                        :drawing-mode="item.drawingMode"
                        :map-auto-view="item.mapAutoView"
                        :format="item.format"
                        :value-format="item.valueFormat"
                        :default-time="item.defaultTime"
                        :picker-align="item.pickerAlign"
                        :optional-days="item.optionalDays"
                        :first-day-of-week="item.firstDayOfWeek"
                        :shortcuts-options="item.shortcutsOptions"
                        :moment-select-options="item.momentSelectOptions"
                        :picker-options="item.pickerOptions"
                        :keep-time="item.keepTime"
                        :size="item.size"
                        :dialog-select-size="item.dialogSelectSize"
                        :dialog-select-title="item.dialogSelectTitle"
                        :placeholder="item.placeholder"
                        :start-placeholder="item.startPlaceholder"
                        :end-placeholder="item.endPlaceholder"
                        :range-separator="item.rangeSeparator"
                        :collapse-tags="item.collapseTags"
                        :emit-path="item.emitPath"
                        :show-dept="item.showDept"
                        :show-city="item.showCity"
                        :check-final-level="item.checkFinalLevel"
                        :check-strictly="item.checkStrictly"
                        :check-influentially="item.checkInfluentially"
                        :default-expand-first="item.defaultExpandFirst"
                        :show-all-button="
                          typeof item.showAllButton === 'boolean'
                            ? item.showAllButton
                            : true
                        "
                        :show-refresh-button="item.showRefreshButton"
                        :show-all-levels="item.showAllLevels"
                        :show-code="item.showCode"
                        :show-full-address="item.showFullAddress"
                        :lazy="item.lazy"
                        :accordion="item.accordion"
                        :filterable="
                          typeof item.filterable === 'boolean'
                            ? item.filterable
                            : true
                        "
                        :clearable="item.clearable"
                        :readonly="item.readonly"
                        :disabled="item.disabled"
                        :adaptive="item.adaptive"
                        :underline="item.underline"
                      ></hd-component-item>
                    </el-form-item>
                  </hd-query-fixed>
                  <hd-query-expand
                    v-if="
                      (activeMoreSearchItem &&
                        activeMoreSearchItem.length > 0) ||
                      (activeSuperSearchItem &&
                        activeSuperSearchItem.length > 0)
                    "
                  >
                    <el-row
                      v-for="(row, index) in activeMoreSearchItem"
                      :key="index"
                    >
                      <el-form-item
                        v-for="(item, index) in row"
                        :key="index"
                        :label="item.label"
                        :prop="item.field"
                      >
                        <hd-component-item
                          :prop="
                            item.type !== 'factorInput'
                              ? item.field
                              : item.field + 'FilterFactor'
                          "
                          :type="item.type"
                          v-model="queryData[item.field]"
                          :label.sync="
                            extendData[
                              item.type !== 'factorInput'
                                ? item.field
                                : item.field + 'FilterFactor'
                            ]
                          "
                          :minlength="item.minlength"
                          :maxlength="item.maxlength"
                          :show-word-limit="item.showWordLimit"
                          :show-password="item.showPassword"
                          :textarea-rows="item.textareaRows"
                          :textarea-autosize="item.textareaAutosize"
                          :fuzzy="item.fuzzy"
                          :show-control-button="item.showControlButton"
                          :control-button-readonly="item.controlButtonReadonly"
                          :control-button-disabled="item.controlButtonDisabled"
                          :control-button-position="item.controlButtonPosition"
                          :barcode-auto-input="item.barcodeAutoInput"
                          :min="item.min"
                          :max="item.max"
                          :step="item.step"
                          :precision="item.precision"
                          :step-strictly="item.stepStrictly"
                          :optional-range="item.optionalRange"
                          :dict="item.dict"
                          :visible-option="item.visibleOption"
                          :remove-option="item.removeOption"
                          :multiple="item.multiple"
                          :limit="item.limit"
                          :trigger="item.trigger"
                          :expand-trigger="item.expandTrigger"
                          :filter-code="item.filterCode"
                          :show-level="item.showLevel"
                          :check-level="item.checkLevel"
                          :map-party="item.mapParty"
                          :center="item.center"
                          :zoom="item.zoom"
                          :marker="item.marker"
                          :drawing-mode="item.drawingMode"
                          :map-auto-view="item.mapAutoView"
                          :format="item.format"
                          :value-format="item.valueFormat"
                          :default-time="item.defaultTime"
                          :picker-align="item.pickerAlign"
                          :optional-days="item.optionalDays"
                          :first-day-of-week="item.firstDayOfWeek"
                          :shortcuts-options="item.shortcutsOptions"
                          :moment-select-options="item.momentSelectOptions"
                          :picker-options="item.pickerOptions"
                          :keep-time="item.keepTime"
                          :size="item.size"
                          :dialog-select-size="item.dialogSelectSize"
                          :dialog-select-title="item.dialogSelectTitle"
                          :placeholder="item.placeholder"
                          :start-placeholder="item.startPlaceholder"
                          :end-placeholder="item.endPlaceholder"
                          :range-separator="item.rangeSeparator"
                          :collapse-tags="item.collapseTags"
                          :emit-path="item.emitPath"
                          :show-dept="item.showDept"
                          :show-city="item.showCity"
                          :check-final-level="item.checkFinalLevel"
                          :check-strictly="item.checkStrictly"
                          :check-influentially="item.checkInfluentially"
                          :default-expand-first="item.defaultExpandFirst"
                          :show-all-button="
                            typeof item.showAllButton === 'boolean'
                              ? item.showAllButton
                              : true
                          "
                          :show-refresh-button="item.showRefreshButton"
                          :show-all-levels="item.showAllLevels"
                          :show-code="item.showCode"
                          :show-full-address="item.showFullAddress"
                          :lazy="item.lazy"
                          :accordion="item.accordion"
                          :filterable="
                            typeof item.filterable === 'boolean'
                              ? item.filterable
                              : true
                          "
                          :clearable="item.clearable"
                          :readonly="item.readonly"
                          :disabled="item.disabled"
                          :adaptive="item.adaptive"
                          :underline="item.underline"
                        ></hd-component-item>
                      </el-form-item>
                    </el-row>
                  </hd-query-expand>
                </hd-query>
              </hd-component>
            </el-form>
            <div
              v-if="
                typeof api === 'function' ||
                activeNormalSearchItem.length > 0 ||
                activeSuperSearchItem.length > 0 ||
                activeMoreSearchItem.length > 0
              "
              class="hdty-btn-container"
            >
              <el-button
                v-if="typeof api === 'function'"
                type="info"
                icon="el-icon-search"
                @click="handleQuery"
                >查询</el-button
              >
              <el-button
                v-if="
                  activeNormalSearchItem.length > 0 ||
                  activeSuperSearchItem.length > 0 ||
                  activeMoreSearchItem.length > 0
                "
                icon="el-icon-delete"
                @click="handleClear"
                >清空</el-button
              >
            </div>
            <slot name="header"></slot>
          </div>
          <div class="hdty-fit">
            <el-table
              v-loading="loading"
              ref="tableRef"
              :data="tableData"
              :row-key="activeProps['value']"
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
              @sort-change="handleSortChange"
            >
              <template v-for="columns in activeTableColumns">
                <el-table-column
                  v-if="columns.type === 'selection' && multiple"
                  :key="columns[activeProps['colKey']]"
                  :fixed="columns.fixed"
                  type="selection"
                  :reserve-selection="columns.keepSelection"
                  :sortable="columns.sortable"
                  :resizable="columns.resizable"
                  :header-align="columns.headerAlign"
                  :align="columns.align"
                  :width="columns.width"
                ></el-table-column>
                <el-table-column
                  v-else-if="columns.type === 'selection'"
                  :key="columns[activeProps['colKey']]"
                  :fixed="columns.fixed"
                  label="操作"
                  :sortable="columns.sortable"
                  :resizable="columns.resizable"
                  :header-align="columns.headerAlign"
                  :align="columns.align"
                  :width="columns.width"
                >
                  <template slot-scope="scope">
                    <el-button
                      v-if="radioButton"
                      :type="
                        $utilStr.getValueOfDeepObj(
                          scope.row,
                          activeProps['value']
                        ) === currentValue
                          ? 'primary'
                          : ''
                      "
                      @click="handleChecked(scope.$index, scope.row)"
                      >选择</el-button
                    >
                    <el-radio
                      v-else
                      v-model="currentValue"
                      :label="
                        $utilStr.getValueOfDeepObj(
                          scope.row,
                          activeProps['value']
                        )
                      "
                      class="is-wordless"
                      @change="handleChecked(scope.$index, scope.row)"
                    ></el-radio>
                  </template>
                </el-table-column>
                <hd-build-table-column
                  v-else
                  :key="columns[activeProps['colKey']]"
                  :props="activeProps"
                  :col="columns"
                  :keep-selection="keepSelection"
                  :index="handleTableIndex"
                >
                  <template
                    v-for="(value, key) in $scopedSlots"
                    :slot="key"
                    slot-scope="scope"
                  >
                    <slot
                      :name="key"
                      :row="scope.row"
                      :column="scope.column"
                      :$index="scope.$index"
                    ></slot>
                  </template>
                </hd-build-table-column>
              </template>
            </el-table>
          </div>
          <div class="hdty-footer">
            <el-pagination
              v-if="$utilStr.isNotEmptyObject(currentPageOptions)"
              layout="total, sizes, prev, pager, next, jumper"
              :pager-count="5"
              :current-page="currentPageOptions.current"
              :page-sizes="currentPageOptions.sizes"
              :page-size="currentPageOptions.size"
              :total="currentPageOptions.total"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
            <slot name="footer"></slot>
          </div>
        </div>
      </hd-pane>
      <div slot="footer" class="hdty-dialog-footer">
        <div class="hdty-float-left">
          当前选择：
          <el-tag
            v-if="Array.isArray(activeTag) && activeTag.length > 0"
            type="success"
            :closable="clearable"
            @close="handleTagClose"
            >{{
              $utilStr.getValueOfDeepObj(activeTag[0], activeProps["label"])
            }}</el-tag
          >
          <el-tag
            v-else-if="!Array.isArray(activeTag) && activeTag"
            type="success"
            :closable="clearable"
            @close="handleTagClose"
            >{{ activeTag }}</el-tag
          >
          <el-tag
            v-if="Array.isArray(activeTag) && activeTag.length > 1"
            type="success"
            >+{{ activeTag.length - 1 }}</el-tag
          >
        </div>
        <div class="hdty-btn-container">
          <el-button @click="cancel">取 消</el-button>
          <el-button v-if="multiple" type="primary" @click="submit"
            >确 定</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { hdComponent, hdForm, hdTable } from "@/utils/util-framework";
export default {
  name: "index",
  provide() {
    return {
      hdTableSelect: this
    };
  },
  mixins: [hdComponent, hdForm, hdTable],
  props: {
    prop: String,
    // 表格数据（通过data直接绑定数据，将不需要通过api请求接口获取数据）
    data: Array,
    // 请求接口
    api: Function,
    // 渲染选项数据对象的配置选项
    props: {
      type: Object,
      default() {
        return {
          // 指定选项的值对应选项数据对象中的属性值
          value: "vo.id",
          // 指定选项标签对应选项数据对象中的属性值
          label: "vo.name",
          // 指定选项索引对应选项数据对象中的属性值
          rowIndex: "",
          // 指定选项数据对象对应响应数据对象中的属性值
          response: "records",
          // 指定选项的总条目数对应响应数据对象中的属性值
          total: "total",
          // 指定表格列的渲染配置对象对应响应数据对象中的属性值
          render: "",
          // 指定表格展开的行的唯一标识集合对应响应数据对象中的属性值
          expandKeys: "",
          // 指定表格每列的唯一标识对应表格列的渲染配置对象中的属性值
          colKey: "key",
          // 指定表格表头子列对应表格列的渲染配置对象中的属性值
          colChildren: "children"
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
              type: '',  // 列类型（default/custom/index/operation/expand/text/number/amount/year/month/date/datetime/time/array/tag/geo/image/file/html），默认default
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
    // 渲染搜索项的配置选项
    searches: {
      type: Array,
      default() {
        /*示例：
          * pattern属性用来设置搜索项的应用模式，其中：
          * normal为默认值。表示普通搜索项
          * super表示更高权重搜索项
          * selection表示选中结果项，不进行渲染
          * fixed表示固定搜索项，不进行渲染
          [
            [ // 首个数组为默认显示的搜索项
              {
                type: '',  // 类型（input/textarea/password/factorInput/barcodeInput/numberInput/numberRangeInput/radio/buildRadio/factorRadio/borderRadio/buildBorderRadio/factorBorderRadio/buttonRadio/buildButtonRadio/factorButtonRadio/checkbox/buildCheckbox/borderCheckbox/buildBorderCheckbox/buttonCheckbox/buildButtonCheckbox/select/buildSelect/factorSelect/organSelect/regionSelect/iconSelect/tableSelect/cascader/buildCascader/yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker/pointPicker/imageUpload/inputUpload/cameraUpload/jsonEditor/factorButton）
                field: '',  // 字段名
                label: '',  // 标题
                value: '',  // 绑定值
                text: '',  // 绑定值文本（用于radio/buildRadio/borderRadio/buildBorderRadio/buttonRadio/buildButtonRadio/checkbox/buildCheckbox/borderCheckbox/buildBorderCheckbox/buttonCheckbox/buildButtonCheckbox/select/buildSelect/organSelect/regionSelect/tableSelect/cascader/buildCascader/pointPicker/imageUpload类型）
                factor: '',  // 绑定值条件（用于factorInput类型）
                minlength: null,  // 最小输入长度（用于input/textarea/password/factorInput类型）
                maxlength: null,  // 最大输入长度（用于input/textarea/password/factorInput类型）
                showWordLimit: false,  // 是否显示输入字数（用于input/textarea/password/factorInput类型）
                showPassword: false,  // 是否显示切换密码图标（用于password类型）
                textareaRows: null,  // 输入框行数（用于textarea类型）
                textareaAutosize: false,  // 输入框高度自适应（用于textarea类型）
                fuzzy: null,  // 模糊查询类型（用于factorInput类型）
                showControlButton: true,  // 是否显示控制按钮（用于factorInput/numberInput类型）
                controlButtonReadonly: false,  // 是否只读控制按钮（用于factorInput类型）
                controlButtonDisabled: false,  // 是否禁用控制按钮（用于factorInput类型）
                controlButtonPosition: null,  // 控制按钮显示位置（用于numberInput类型）
                barcodeAutoInput: true,  // 条码是否自动输入（用于barcodeInput类型）
                min: null,  // 最小值（用于numberInput类型）
                max: null,  // 最大值（用于numberInput类型）
                step: null,  // 步长（用于numberInput类型）
                precision: null,  // 数值精度（用于numberInput类型）
                stepStrictly: false,  // 是否只能输入步长的倍数（用于numberInput类型）
                optionalRange: null,  // 可选范围（用于numberRangeInput类型）
                dict: null,  // 字典编码（用于radio/buildRadio/borderRadio/buildBorderRadio/buttonRadio/buildButtonRadio/checkbox/buildCheckbox/borderCheckbox/buildBorderCheckbox/buttonCheckbox/buildButtonCheckbox/select/buildSelect/cascader/buildCascader类型）
                visibleOption: null,  // 显示选项（用于radio/buildRadio/borderRadio/buildBorderRadio/buttonRadio/buildButtonRadio/checkbox/buildCheckbox/borderCheckbox/buildBorderCheckbox/buttonCheckbox/buildButtonCheckbox/select/buildSelect/cascader/buildCascader类型）
                removeOption: null,  // 隐藏选项（用于radio/buildRadio/borderRadio/buildBorderRadio/buttonRadio/buildButtonRadio/checkbox/buildCheckbox/borderCheckbox/buildBorderCheckbox/buttonCheckbox/buildButtonCheckbox/select/buildSelect/cascader/buildCascader类型）
                multiple: false,  // 是否允许多选（用于select/buildSelect/organSelect/regionSelect/tableSelect/cascader/buildCascader/pointPicker/imageUpload类型）
                limit: null,  // 多选限制（用于select/buildSelect/organSelect/regionSelect/tableSelect/cascader/buildCascader/pointPicker/imageUpload类型）
                trigger: null,  // 下拉触发方式（用于select/buildSelect/cascader/buildCascader类型）
                expandTrigger: null,  // 级联展开触发方式（用于cascader/buildCascader类型）
                filterCode: null,  // 筛选编码（用于organSelect/regionSelect类型）
                showLevel: null,  // 只能显示到的级别（用于organSelect/regionSelect类型）
                checkLevel: null,  // 可选择的级别（用于organSelect/regionSelect类型）
                mapParty: null,  // 地图方案（用于pointPicker类型）
                center: null,  // 地图中心点坐标（用于pointPicker类型）
                zoom: null,  // 地图缩放级别（用于pointPicker类型）
                marker: true,  // 是否开启点绘制（用于pointPicker类型）
                drawingMode: null,  // 默认开启的绘制模式（用于pointPicker类型）
                mapAutoView: true,  // 地图是否自动调整最佳视野（用于pointPicker类型）
                format: null,  // 显示格式（用于yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker类型）
                valueFormat: null,  // 绑定值格式（用于yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker类型）
                defaultTime: null,  // 默认时刻（用于yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker类型）
                pickerAlign: null,  // 对齐方式（用于yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker类型）
                optionalDays: null,  // 可选天数（用于yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker类型）
                firstDayOfWeek: null,  // 周起始日（用于yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker类型）
                shortcutsOptions: null,  // 快捷选项配置（用于yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker类型）
                momentSelectOptions: null,  // 时刻选项配置（用于yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker类型）
                pickerOptions: null,  // 日期时间选择器特有选项配置（用于yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker类型）
                keepTime: null,  // 保持实时时间（用于yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker类型）
                size: null,  // 尺寸
                dialogSelectSize: null,  // 会话选择窗口尺寸（用于iconSelect/tableSelect/pointPicker类型）
                dialogSelectTitle: null,  // 会话选择窗口标题（用于organSelect/regionSelect/iconSelect/tableSelect/pointPicker类型）
                placeholder: '',  // 水印
                startPlaceholder: '',  // 范围选择时开始水印（用于numberRangeInput/monthRangePicker/dateRangePicker/datetimeRangePicker/timeRangePicker类型）
                endPlaceholder: '',  // 范围选择时结束水印（用于numberRangeInput/monthRangePicker/dateRangePicker/datetimeRangePicker/timeRangePicker类型）
                rangeSeparator: null,  // 范围选择时分隔符（用于numberRangeInput/monthRangePicker/dateRangePicker/datetimeRangePicker/timeRangePicker类型）
                collapseTags: true,  // 多选时是否折叠标签（用于select/buildSelect/cascader/buildCascader类型）
                emitPath: false,  // 选中节点时是否返回选中节点的各级菜单的值（用于cascader/buildCascader类型）
                showDept: false,  // 是否显示部门（用于organSelect类型）
                showCity: false,  // 是否总是显示市局（用于organSelect类型）
                checkFinalLevel: false,  // 是否只可选择最后一级（用于organSelect/regionSelect类型）
                checkStrictly: true,  // 多选时是否严格遵守父子节点关联（用于organSelect/regionSelect/cacader/buildCascader类型）
                checkInfluentially: false,  // 改变影响绑定值的配置属性时是否判定影响有效（用于radio/buildRadio/borderRadio/buildBorderRadio/buttonRadio/buildButtonRadio/checkbox/buildCheckbox/borderCheckbox/buildBorderCheckbox/buttonCheckbox/buildButtonCheckbox/select/buildSelect/organSelect/regionSelect/tableSelect/cascader/buildCascader/pointPicker类型）
                defaultExpandFirst: true,  // 是否默认展开首个节点（用于organSelect/regionSelect类型）
                showAllButton: false,  // 是否显示全部/全选按钮（用于radio/buildRadio/borderRadio/buildBorderRadio/buttonRadio/buildButtonRadio/checkbox/buildCheckbox/borderCheckbox/buildBorderCheckbox/buttonCheckbox/buildButtonCheckbox/select/buildSelect类型）
                showRefreshButton: true,  // 是否显示刷新按钮（用于organSelect/regionSelect/tableSelect类型）
                showAllLevels: false,  // 是否显示完整路径（用于cascader/buildCascader类型）
                showCode: false,  // 是否显示编码（用于select/buildSelect/organSelect/regionSelect/cascader/buildCascader类型）
                showFullAddress: false,  // 是否显示完整地址（用于pointPicker类型）
                lazy: false,  // 是否懒加载（用于organSelect/regionSelect/cascader/buildCascader类型）
                accordion: false,  // 是否手风琴模式（用于organSelect/regionSelect类型）
                filterable: false,  // 是否可搜索（用于select/buildSelect/cascader/buildCascader类型）
                clearable: true,  // 是否可清空
                readonly: false,  // 是否只读
                disabled: false,  // 是否禁用
                adaptive: false,  // 宽度自适应
                underline: false,  // 下划线风格
                pattern: ''  // 模式（normal/super/selection/fixed）
              }
            ],
            [ // 其余数组为展开筛选的搜索项，每个数组显示一行
              {
                type: '',  // 类型（input/textarea/password/factorInput/barcodeInput/numberInput/numberRangeInput/radio/buildRadio/factorRadio/borderRadio/buildBorderRadio/factorBorderRadio/buttonRadio/buildButtonRadio/factorButtonRadio/checkbox/buildCheckbox/borderCheckbox/buildBorderCheckbox/buttonCheckbox/buildButtonCheckbox/select/buildSelect/factorSelect/organSelect/regionSelect/iconSelect/tableSelect/cascader/buildCascader/yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker/pointPicker/imageUpload/inputUpload/cameraUpload/jsonEditor/factorButton）
                field: '',  // 字段名
                label: '',  // 标题
                value: '',  // 绑定值
                text: '',  // 绑定值文本（用于radio/buildRadio/borderRadio/buildBorderRadio/buttonRadio/buildButtonRadio/checkbox/buildCheckbox/borderCheckbox/buildBorderCheckbox/buttonCheckbox/buildButtonCheckbox/select/buildSelect/organSelect/regionSelect/tableSelect/cascader/buildCascader/pointPicker/imageUpload类型）
                factor: '',  // 绑定值条件（用于factorInput类型）
                minlength: null,  // 最小输入长度（用于input/textarea/password/factorInput类型）
                maxlength: null,  // 最大输入长度（用于input/textarea/password/factorInput类型）
                showWordLimit: false,  // 是否显示输入字数（用于input/textarea/password/factorInput类型）
                showPassword: false,  // 是否显示切换密码图标（用于password类型）
                textareaRows: null,  // 输入框行数（用于textarea类型）
                textareaAutosize: false,  // 输入框高度自适应（用于textarea类型）
                fuzzy: null,  // 模糊查询类型（用于factorInput类型）
                showControlButton: true,  // 是否显示控制按钮（用于factorInput/numberInput类型）
                controlButtonReadonly: false,  // 是否只读控制按钮（用于factorInput类型）
                controlButtonDisabled: false,  // 是否禁用控制按钮（用于factorInput类型）
                controlButtonPosition: null,  // 控制按钮显示位置（用于numberInput类型）
                barcodeAutoInput: true,  // 条码是否自动输入（用于barcodeInput类型）
                min: null,  // 最小值（用于numberInput类型）
                max: null,  // 最大值（用于numberInput类型）
                step: null,  // 步长（用于numberInput类型）
                precision: null,  // 数值精度（用于numberInput类型）
                stepStrictly: false,  // 是否只能输入步长的倍数（用于numberInput类型）
                optionalRange: null,  // 可选范围（用于numberRangeInput类型）
                dict: null,  // 字典编码（用于radio/buildRadio/borderRadio/buildBorderRadio/buttonRadio/buildButtonRadio/checkbox/buildCheckbox/borderCheckbox/buildBorderCheckbox/buttonCheckbox/buildButtonCheckbox/select/buildSelect/cascader/buildCascader类型）
                visibleOption: null,  // 显示选项（用于radio/buildRadio/borderRadio/buildBorderRadio/buttonRadio/buildButtonRadio/checkbox/buildCheckbox/borderCheckbox/buildBorderCheckbox/buttonCheckbox/buildButtonCheckbox/select/buildSelect/cascader/buildCascader类型）
                removeOption: null,  // 隐藏选项（用于radio/buildRadio/borderRadio/buildBorderRadio/buttonRadio/buildButtonRadio/checkbox/buildCheckbox/borderCheckbox/buildBorderCheckbox/buttonCheckbox/buildButtonCheckbox/select/buildSelect/cascader/buildCascader类型）
                multiple: false,  // 是否允许多选（用于select/buildSelect/organSelect/regionSelect/tableSelect/cascader/buildCascader/pointPicker/imageUpload类型）
                limit: null,  // 多选限制（用于select/buildSelect/organSelect/regionSelect/tableSelect/cascader/buildCascader/pointPicker/imageUpload类型）
                trigger: null,  // 下拉触发方式（用于select/buildSelect/cascader/buildCascader类型）
                expandTrigger: null,  // 级联展开触发方式（用于cascader/buildCascader类型）
                filterCode: null,  // 筛选编码（用于organSelect/regionSelect类型）
                showLevel: null,  // 只能显示到的级别（用于organSelect/regionSelect类型）
                checkLevel: null,  // 可选择的级别（用于organSelect/regionSelect类型）
                mapParty: null,  // 地图方案（用于pointPicker类型）
                center: null,  // 地图中心点坐标（用于pointPicker类型）
                zoom: null,  // 地图缩放级别（用于pointPicker类型）
                marker: true,  // 是否开启点绘制（用于pointPicker类型）
                drawingMode: null,  // 默认开启的绘制模式（用于pointPicker类型）
                mapAutoView: true,  // 地图是否自动调整最佳视野（用于pointPicker类型）
                format: null,  // 显示格式（用于yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker类型）
                valueFormat: null,  // 绑定值格式（用于yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker类型）
                defaultTime: null,  // 默认时刻（用于yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker类型）
                pickerAlign: null,  // 对齐方式（用于yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker类型）
                optionalDays: null,  // 可选天数（用于yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker类型）
                firstDayOfWeek: null,  // 周起始日（用于yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker类型）
                shortcutsOptions: null,  // 快捷选项配置（用于yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker类型）
                momentSelectOptions: null,  // 时刻选项配置（用于yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker类型）
                pickerOptions: null,  // 日期时间选择器特有选项配置（用于yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker类型）
                keepTime: null,  // 保持实时时间（用于yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker类型）
                size: null,  // 尺寸
                dialogSelectSize: null,  // 会话选择窗口尺寸（用于iconSelect/tableSelect/pointPicker类型）
                dialogSelectTitle: null,  // 会话选择窗口标题（用于organSelect/regionSelect/iconSelect/tableSelect/pointPicker类型）
                placeholder: '',  // 水印
                startPlaceholder: '',  // 范围选择时开始水印（用于numberRangeInput/monthRangePicker/dateRangePicker/datetimeRangePicker/timeRangePicker类型）
                endPlaceholder: '',  // 范围选择时结束水印（用于numberRangeInput/monthRangePicker/dateRangePicker/datetimeRangePicker/timeRangePicker类型）
                rangeSeparator: null,  // 范围选择时分隔符（用于numberRangeInput/monthRangePicker/dateRangePicker/datetimeRangePicker/timeRangePicker类型）
                collapseTags: true,  // 多选时是否折叠标签（用于select/buildSelect/cascader/buildCascader类型）
                emitPath: false,  // 选中节点时是否返回选中节点的各级菜单的值（用于cascader/buildCascader类型）
                showDept: false,  // 是否显示部门（用于organSelect类型）
                showCity: false,  // 是否总是显示市局（用于organSelect类型）
                checkFinalLevel: false,  // 是否只可选择最后一级（用于organSelect/regionSelect类型）
                checkStrictly: true,  // 多选时是否严格遵守父子节点关联（用于organSelect/regionSelect/cacader/buildCascader类型）
                checkInfluentially: false,  // 改变影响绑定值的配置属性时是否判定影响有效（用于radio/buildRadio/borderRadio/buildBorderRadio/buttonRadio/buildButtonRadio/checkbox/buildCheckbox/borderCheckbox/buildBorderCheckbox/buttonCheckbox/buildButtonCheckbox/select/buildSelect/organSelect/regionSelect/tableSelect/cascader/buildCascader/pointPicker类型）
                defaultExpandFirst: true,  // 是否默认展开首个节点（用于organSelect/regionSelect类型）
                showAllButton: false,  // 是否显示全部/全选按钮（用于radio/buildRadio/borderRadio/buildBorderRadio/buttonRadio/buildButtonRadio/checkbox/buildCheckbox/borderCheckbox/buildBorderCheckbox/buttonCheckbox/buildButtonCheckbox/select/buildSelect类型）
                showRefreshButton: true,  // 是否显示刷新按钮（用于organSelect/regionSelect/tableSelect类型）
                showAllLevels: false,  // 是否显示完整路径（用于cascader/buildCascader类型）
                showCode: false,  // 是否显示编码（用于select/buildSelect/organSelect/regionSelect/cascader/buildCascader类型）
                showFullAddress: false,  // 是否显示完整地址（用于pointPicker类型）
                lazy: false,  // 是否懒加载（用于organSelect/regionSelect/cascader/buildCascader类型）
                accordion: false,  // 是否手风琴模式（用于organSelect/regionSelect类型）
                filterable: false,  // 是否可搜索（用于select/buildSelect/cascader/buildCascader类型）
                clearable: true,  // 是否可清空
                readonly: false,  // 是否只读
                disabled: false,  // 是否禁用
                adaptive: false,  // 宽度自适应
                underline: false,  // 下划线风格
              }
            ]
          ]*/
        return [];
      }
    },
    // 渲染分页的配置选项
    pageOptions: {
      type: Object,
      default() {
        return this.$app.paginationOptions;
      }
    },
    // 绑定值
    value: {
      type: [Number, String, Array],
      default: ""
    },
    // 绑定值文本
    modelText: {
      type: [String, Array],
      default: ""
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
    // 默认列的显示顺序（selection / index / expand）
    defaultOrder: {
      type: Array,
      default() {
        return ["selection", "index", "expand"];
      }
    },
    // 默认列的固定（selection / index / expand）
    defaultFixed: {
      type: Array,
      default() {
        return ["selection", "index"];
      }
    },
    // 默认列的右侧固定（selection / index / expand）
    defaultFixedRight: {
      type: Array,
      default() {
        return [];
      }
    },
    // 默认索引列的名称
    defaultIndexLabel: {
      type: String,
      default: "序号"
    },
    // 默认展开列的名称
    defaultExpandLabel: {
      type: String,
      default: ""
    },
    // 默认的排序列和排序顺序
    /*示例：
      {
        prop: '',  // 排序列字段名
        order: 'ascending'  // 排序顺序（ascending / descending）
      }*/
    defaultSort: {
      type: Object
    },
    // 展开的行的key集合
    expandRowKeys: {
      type: Array
    },
    // 输入框尺寸（medium / small / mini）
    size: {
      type: String,
      default: ""
    },
    // 会话选择窗口尺寸（large / medium / small / mini / fit）
    dialogSize: {
      type: String,
      default: "medium"
    },
    // 会话选择窗口标题
    dialogTitle: {
      type: String,
      default: ""
    },
    // 表格空数据时显示文本（支持HTML内容）
    emptyText: {
      type: String,
      default: "暂无数据"
    },
    // 水印
    placeholder: {
      type: String,
      default: "请选择"
    },
    // 在改变会影响到绑定值的组件属性时（data/api/searches/multiple/limit），是否判定影响有效(true:影响绑定值，改变属性时清空绑定值；false:不影响绑定值，改变属性时不清空绑定值)
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
    // 是否显示索引所在列
    showIndex: {
      type: Boolean,
      default: true
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
    // 是否显示分页
    showPagination: {
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
    // 默认查询参数
    defaultQueryData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 是否每次打开都刷新
    openRefresh: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 默认渲染选项数据对象的配置选项
      defaultProps: {
        // 指定选项的值对应选项数据对象中的属性值
        value: "vo.id",
        // 指定选项标签对应选项数据对象中的属性值
        label: "vo.name",
        // 指定选项索引对应选项数据对象中的属性值
        rowIndex: "",
        // 指定选项数据对象对应响应数据对象中的属性值
        response: "records",
        // 指定选项的总条目数对应响应数据对象中的属性值
        total: "total",
        // 指定表格列的渲染配置对象对应响应数据对象中的属性值
        render: "",
        // 指定表格展开的行的唯一标识集合对应响应数据对象中的属性值
        expandKeys: "",
        // 指定表格每列的唯一标识对应表格列的渲染配置对象中的属性值
        colKey: "key",
        // 指定表格表头子列对应表格列的渲染配置对象中的属性值
        colChildren: "children"
      },
      // 默认列的配置选项（selection / index / expand）
      defaultColumns: {
        selection: {
          resizable: true,
          sortable: false,
          headerAlign: "center",
          align: "center"
        },
        index: {
          label: "序号",
          resizable: true,
          sortable: false,
          headerAlign: "center",
          align: "center",
          class: "is-index",
          width: "50"
        },
        expand: {
          resizable: true,
          sortable: false,
          headerAlign: "center",
          align: "center",
          width: "45"
        }
      },
      // 当前渲染表格列的配置选项
      currentColumns: this.columns,
      // 当前渲染搜索项的配置选项
      currentSearches: this.searches, // currentSearches接收父组件传来的searches值
      // 当前分页选项
      currentPageOptions: this.showPagination ? this.pageOptions : null,
      // 当前展开的行的key集合
      currentExpandRowKeys: this.expandRowKeys,
      // 当前绑定值
      currentValue: this.value,
      // 当前绑定值文本
      input: this.modelText, // input接收父组件传来的modelText值
      // 上一次绑定值
      oldValue: "",
      // 查询
      queryData: {},
      // 查询扩展
      extendData: {},
      // 验证
      rules: {},
      // 表格数据
      tableData: this.data,
      // 多选数据
      multipleData: this.currentSelection, // multipleData接收父组件传来的currentSelection值
      // 启用构造数据
      constDataEnabled: true,
      // 构造数据
      constData: [],
      // 缓存数据
      cacheData: {
        currentPageOptions: null
      },
      // 数据加载完成
      loadComplete: false,
      // 显示Dialog
      visible: false,
      // 加载中
      loading: false
    };
  },
  computed: {
    activeProps() {
      return Object.assign(this.defaultProps, this.props);
    },
    activeDefaultColumns() {
      let defaultColumns = [];
      for (let i = 0, iLen = this.defaultOrder.length; i < iLen; i++) {
        let currentDefaultColumns = this.defaultColumns[this.defaultOrder[i]];
        if (this.defaultOrder[i] === "selection") {
          currentDefaultColumns["enabled"] = true;
          currentDefaultColumns["keepSelection"] = this.keepSelection;
          if (!this.multiple && this.radioButton) {
            currentDefaultColumns["width"] = "80";
          } else {
            currentDefaultColumns["width"] = "50";
          }
        } else if (this.defaultOrder[i] === "index") {
          currentDefaultColumns["enabled"] = this.showIndex;
          currentDefaultColumns["label"] = this.defaultIndexLabel;
          currentDefaultColumns["index"] = this.handleTableIndex;
        } else if (this.defaultOrder[i] === "expand") {
          currentDefaultColumns["enabled"] = this.showExpand;
          currentDefaultColumns["label"] = this.defaultExpandLabel;
        }
        currentDefaultColumns["type"] = this.defaultOrder[i];
        currentDefaultColumns["fixed"] = !this.defaultFixedRight.includes(
          this.defaultOrder[i]
        )
          ? this.defaultFixed.includes(this.defaultOrder[i])
          : "right";
        if (currentDefaultColumns["enabled"]) {
          defaultColumns.push(currentDefaultColumns);
        }
      }
      return defaultColumns;
    },
    activeTableColumns() {
      return this.appendKeyToTableColumns(
        this.$utilStr.deepClone(
          this.activeDefaultColumns.concat(this.currentColumns)
        )
      );
    },
    activeTableColumnsAndData() {
      return {
        columns: this.activeTableColumns,
        data: this.tableData
      };
    },
    activeDialogCustomClass() {
      if (this.dialogSize === "large") {
        return "hdty-dialog-large";
      } else if (this.dialogSize === "medium") {
        return "hdty-dialog-medium";
      } else if (this.dialogSize === "small") {
        return "hdty-dialog-small";
      } else if (this.dialogSize === "mini") {
        return "hdty-dialog-mini";
      } else if (this.dialogSize === "fit") {
        return "hdty-dialog-fit";
      } else {
        return this.dialogSize;
      }
    },
    activeTag() {
      if (this.multiple) {
        return this.multipleData;
      } else {
        return this.input;
      }
    },
    activeConstDataEnabled() {
      return (
        this.multiple &&
        this.currentValue.length > 0 &&
        this.currentSelection.length < 1 &&
        this.constDataEnabled
      );
    },
    activeNormalSearchItem() {
      if (!this.$utilStr.isEmpty(this.currentSearches)) {
        return this.currentSearches
          .find((e, i) => i === 0)
          .filter((e) => !e.pattern || e.pattern === "normal");
      }
      return [];
    },
    activeSuperSearchItem() {
      if (!this.$utilStr.isEmpty(this.currentSearches)) {
        return this.currentSearches
          .find((e, i) => i === 0)
          .filter((e) => e.pattern === "super");
      }
      return [];
    },
    activeSelectionSearchItem() {
      if (!this.$utilStr.isEmpty(this.currentSearches)) {
        return this.currentSearches
          .find((e, i) => i === 0)
          .filter((e) => e.pattern === "selection");
      }
      return [];
    },
    activeMoreSearchItem() {
      if (!this.$utilStr.isEmpty(this.currentSearches)) {
        return this.currentSearches.filter((e, i) => i > 0);
      }
      return [];
    }
  },
  watch: {
    value: {
      handler(val) {
        this.oldValue = this.value; // 因el-table是先触发change回调事件再更新绑定值，所以这里将当前绑定值直接赋给上一次绑定值
        if (this.$utilStr.isEmpty(val)) {
          if (!this.$utilStr.isEmpty(this.modelText)) {
            this.$emit("update:modelText", val);
          } else if (!this.$utilStr.isEmpty(this.input)) {
            this.input = "";
          }
          if (this.multiple) {
            this.constData = [];
            this.constDataEnabled = true;
            this.clearSelection();
          } else {
            this.clearHighlight();
          }
        }
        if (this.multiple) {
          if (!Array.isArray(val)) {
            if (val) {
              val = [val];
            } else {
              val = [];
            }
          }
          this.currentValue = val;
          if (this.activeConstDataEnabled) {
            this.constData = [];
            for (let i = 0; i < val.length; i++) {
              let initialValue = this.$utilStr.generateDeepObj(
                this.activeProps["value"],
                val[i]
              );
              this.constData.push(initialValue);
            }
          }
          this.multipleData = this.constData;
        } else {
          this.currentValue = val;
        }
        if (this.$utilStr.isNotEmptyObject(this.currentPageOptions)) {
          this.currentPageOptions.current = 1;
        }
      },
      immediate: true
    },
    modelText: {
      handler(val) {
        if (
          this.$utilStr.isEmpty(val) &&
          !this.$utilStr.isEmpty(this.currentValue)
        ) {
          val = this.currentValue;
        }
        if (this.multiple) {
          if (!Array.isArray(val)) {
            if (val) {
              val = [val];
            } else {
              val = [];
            }
          }
          this.input = this.$utilStr.arraySplit(val);
          if (this.activeConstDataEnabled) {
            for (let i = 0; i < this.constData.length; i++) {
              let initialValue = this.$utilStr.generateDeepObj(
                this.activeProps["value"],
                this.currentValue[i]
              );
              let initialLabel = this.$utilStr.generateDeepObj(
                this.activeProps["label"],
                val[i]
              );
              this.constData[i] = this.$utilStr.deepObjMerge(
                initialValue,
                initialLabel
              );
            }
            this.multipleData = this.constData;
          }
        } else {
          this.input = val;
        }
      },
      immediate: true
    },
    data: {
      handler(val) {
        this.tableData = val;
        this.loadComplete = !(
          this.$utilStr.isEmpty(val) && typeof this.api === "function"
        );
        if (this.checkInfluentially) {
          this.handleInputClear();
        }
      },
      deep: true,
      immediate: false
    },
    api: {
      handler(val) {
        if (typeof val === "function") {
          this.tableData = [];
          this.loadComplete = false;
        } else if (this.$utilStr.isEmpty(this.data)) {
          this.tableData = [];
          this.loadComplete = true;
        }
        if (this.checkInfluentially) {
          this.handleInputClear();
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
    searches: {
      handler(val) {
        this.currentSearches = val;
        if (typeof this.api === "function") {
          this.loadComplete = false;
        }
        if (this.checkInfluentially) {
          this.handleInputClear();
        }
        this.updateSearchData();
      },
      deep: true,
      immediate: false
    },
    pageOptions: {
      handler(val) {
        this.currentPageOptions = this.showPagination ? val : null;
        if (
          !this.$utilStr.isEqual(
            this.currentPageOptions,
            this.cacheData.currentPageOptions
          )
        ) {
          if (typeof this.api === "function") {
            this.loadComplete = false;
          }
        }
      },
      deep: true,
      immediate: false
    },
    activeTableColumnsAndData: {
      handler() {
        this.$nextTick(() => {
          this.doLayout();
        });
      },
      deep: true,
      immediate: true
    },
    multiple: {
      handler(val) {
        if (this.checkInfluentially) {
          this.handleInputClear();
        } else {
          if (val) {
            if (!Array.isArray(this.value)) {
              if (!this.$utilStr.isEmpty(this.value)) {
                this.$emit("input", [this.value]);
              } else {
                this.$emit("input", []);
              }
            }
            if (!Array.isArray(this.modelText)) {
              if (!this.$utilStr.isEmpty(this.modelText)) {
                this.$emit("update:modelText", [this.modelText]);
              } else {
                this.$emit("update:modelText", []);
              }
            }
          } else {
            if (Array.isArray(this.value)) {
              if (!this.$utilStr.isEmpty(this.value)) {
                this.$emit("input", this.value[0]);
              } else {
                this.$emit("input", "");
              }
            }
            if (Array.isArray(this.modelText)) {
              if (!this.$utilStr.isEmpty(this.modelText)) {
                this.$emit("update:modelText", this.modelText[0]);
              } else {
                this.$emit("update:modelText", "");
              }
            }
          }
        }
      },
      immediate: false
    },
    limit: {
      handler() {
        if (this.checkInfluentially) {
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
    },
    showPagination: {
      handler(val) {
        if (val) {
          this.currentPageOptions = this.pageOptions;
        } else {
          this.currentPageOptions = null;
        }
      },
      immediate: false
    }
  },
  created() {
    this.initSearchData();
  },
  mounted() {
    this.addTableResizeDoLayoutListener(this.$refs.dialogRef.$el);
  },
  methods: {
    // 初始化搜索数据
    initSearchData() {
      if (this.currentSearches && this.currentSearches.length > 0) {
        this.currentSearches.forEach((items) => {
          for (let item of items) {
            let initialValue;
            if (this.$utilStr.isExist(item.value)) {
              initialValue = item.value;
            } else {
              if (this.multiple && item.pattern === "selection") {
                initialValue = [];
              } else if (
                item.multiple &&
                [
                  "select",
                  "buildSelect",
                  "organSelect",
                  "regionSelect",
                  "tableSelect",
                  "cascader",
                  "buildCascader",
                  "pointPicker",
                  "imageUpload"
                ].includes(item.type)
              ) {
                initialValue = [];
              } else if (
                [
                  "numberRangeInput",
                  "checkbox",
                  "buildCheckbox",
                  "borderCheckbox",
                  "buildBorderCheckbox",
                  "buttonCheckbox",
                  "buildButtonCheckbox",
                  "yearsPicker",
                  "monthsPicker",
                  "monthRangePicker",
                  "weekPicker",
                  "datesPicker",
                  "dateRangePicker",
                  "datetimeRangePicker",
                  "timeRangePicker"
                ].includes(item.type)
              ) {
                initialValue = [];
              } else if (
                [
                  "pointPicker",
                  "imageUpload",
                  "inputUpload",
                  "cameraUpload",
                  "jsonEditor"
                ].includes(item.type)
              ) {
                initialValue = null;
              } else {
                initialValue = "";
              }
            }
            this.$set(this.queryData, item.field, initialValue);
            if (item.type === "factorInput") {
              let initialLabel;
              if (this.$utilStr.isExist(item.factor)) {
                initialLabel = item.factor;
              } else {
                initialLabel = "";
              }
              this.$set(
                this.extendData,
                item.field + "FilterFactor",
                initialLabel
              );
            } else if (
              [
                "radio",
                "buildRadio",
                "borderRadio",
                "buildBorderRadio",
                "buttonRadio",
                "buildButtonRadio",
                "checkbox",
                "buildCheckbox",
                "borderCheckbox",
                "buildBorderCheckbox",
                "buttonCheckbox",
                "buildButtonCheckbox",
                "select",
                "buildSelect",
                "organSelect",
                "regionSelect",
                "tableSelect",
                "cascader",
                "buildCascader",
                "pointPicker",
                "imageUpload"
              ].includes(item.type)
            ) {
              let initialLabel;
              if (this.$utilStr.isExist(item.text)) {
                initialLabel = item.text;
              } else if (item.multiple) {
                initialLabel = [];
              } else {
                initialLabel = "";
              }
              this.$set(this.extendData, item.field, initialLabel);
            }
          }
        });
        this.$set(
          this.queryData,
          "andor",
          this.$app.factorOptions.logicOpe.and
        );
      }
    },
    // 更新搜索数据
    updateSearchData() {
      if (this.currentSearches && this.currentSearches.length > 0) {
        let newFields = {
          queryDataArr: [],
          extendDataArr: []
        };
        this.currentSearches.forEach((items) => {
          for (let item of items) {
            let initialValue;
            if (this.$utilStr.isExist(item.value)) {
              initialValue = item.value;
            } else {
              if (this.multiple && item.pattern === "selection") {
                initialValue = [];
              } else if (
                item.multiple &&
                [
                  "select",
                  "buildSelect",
                  "organSelect",
                  "regionSelect",
                  "tableSelect",
                  "cascader",
                  "buildCascader",
                  "pointPicker",
                  "imageUpload"
                ].includes(item.type)
              ) {
                initialValue = [];
              } else if (
                [
                  "numberRangeInput",
                  "checkbox",
                  "buildCheckbox",
                  "borderCheckbox",
                  "buildBorderCheckbox",
                  "buttonCheckbox",
                  "buildButtonCheckbox",
                  "yearsPicker",
                  "monthsPicker",
                  "monthRangePicker",
                  "weekPicker",
                  "datesPicker",
                  "dateRangePicker",
                  "datetimeRangePicker",
                  "timeRangePicker"
                ].includes(item.type)
              ) {
                initialValue = [];
              } else if (
                [
                  "pointPicker",
                  "imageUpload",
                  "inputUpload",
                  "cameraUpload",
                  "jsonEditor"
                ].includes(item.type)
              ) {
                initialValue = null;
              } else {
                initialValue = "";
              }
            }
            if (
              !this.$utilStr.isEqual(this.queryData[item.field], initialValue)
            ) {
              this.$set(this.queryData, item.field, initialValue);
            }
            newFields["queryDataArr"].push(item.field);
            if (item.type === "factorInput") {
              let initialLabel;
              if (this.$utilStr.isExist(item.factor)) {
                initialLabel = item.factor;
              } else {
                initialLabel = "";
              }
              if (
                !this.$utilStr.isEqual(
                  this.extendData[item.field + "FilterFactor"],
                  initialLabel
                )
              ) {
                this.$set(
                  this.extendData,
                  item.field + "FilterFactor",
                  initialLabel
                );
              }
              newFields["extendDataArr"].push(item.field + "FilterFactor");
            } else if (
              [
                "radio",
                "buildRadio",
                "borderRadio",
                "buildBorderRadio",
                "buttonRadio",
                "buildButtonRadio",
                "checkbox",
                "buildCheckbox",
                "borderCheckbox",
                "buildBorderCheckbox",
                "buttonCheckbox",
                "buildButtonCheckbox",
                "select",
                "buildSelect",
                "organSelect",
                "regionSelect",
                "tableSelect",
                "cascader",
                "buildCascader",
                "pointPicker",
                "imageUpload"
              ].includes(item.type)
            ) {
              let initialLabel;
              if (this.$utilStr.isExist(item.text)) {
                initialLabel = item.text;
              } else if (item.multiple) {
                initialLabel = [];
              } else {
                initialLabel = "";
              }
              if (
                !this.$utilStr.isEqual(
                  this.extendData[item.field],
                  initialLabel
                )
              ) {
                this.$set(this.extendData, item.field, initialLabel);
              }
              newFields["extendDataArr"].push(item.field);
            }
          }
        });
        if (
          !this.$utilStr.isEqual(
            this.queryData["andor"],
            this.$app.factorOptions.logicOpe.and
          )
        ) {
          this.$set(
            this.queryData,
            "andor",
            this.$app.factorOptions.logicOpe.and
          );
        }
        newFields["queryDataArr"].push("andor");
        for (let k in this.queryData) {
          if (!newFields["queryDataArr"].find((v) => v === k)) {
            delete this.queryData[k];
          }
        }
        for (let k in this.extendData) {
          if (!newFields["extendDataArr"].find((v) => v === k)) {
            delete this.extendData[k];
          }
        }
      }
    },
    // 设置selection搜索数据
    setSelectionSearchData() {
      if (
        this.activeSelectionSearchItem &&
        this.activeSelectionSearchItem.length > 0
      ) {
        this.activeSelectionSearchItem.forEach((item) => {
          if (
            !this.$utilStr.isEqual(
              this.queryData[item.field],
              this.currentValue
            )
          ) {
            let selection;
            if (Array.isArray(this.queryData[item.field])) {
              selection = this.$utilStr.toArray(this.currentValue);
            } else {
              selection = this.currentValue;
            }
            this.queryData[item.field] = selection;
          }
        });
      }
    },
    // input获得焦点
    handleInputFocus() {
      if (!this.readonly) {
        this.visible = true;
        this.$emit("currentOpening", this);
        if (
          this.openRefresh ||
          (!this.loadComplete &&
            !this.loading &&
            typeof this.api === "function")
        ) {
          this.loadList();
        } else {
          if (this.multiple) {
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
        ...this.currentPageOptions,
        ...this.extendData,
        ...this.queryData,
        ...this.defaultQueryData
      };
      this.api(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            if (!this.$utilStr.isEmpty(this.activeProps["render"])) {
              this.currentColumns = this.$utilStr.getValueOfDeepObj(
                data,
                this.activeProps["render"]
              );
            }
            if (this.$utilStr.isNotEmptyObject(this.currentPageOptions)) {
              this.currentPageOptions.total = this.$utilStr.getValueOfDeepObj(
                data,
                this.activeProps["total"]
              );
              this.cacheData.currentPageOptions = this.$utilStr.deepClone(
                this.currentPageOptions
              );
            }
            this.tableData = this.$utilStr.getValueOfDeepObj(
              data,
              this.activeProps["response"]
            );
            if (!this.$utilStr.isEmpty(this.activeProps["expandKeys"])) {
              this.currentExpandRowKeys = this.$utilStr.getValueOfDeepObj(
                data,
                this.activeProps["expandKeys"]
              );
            }
            this.loadComplete = true;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          if (this.multiple) {
            this.setSelection();
          } else {
            this.setHighlight();
          }
          this.loading = false;
        });
    },
    // 查询
    handleQuery() {
      if (this.$refs.queryRef) {
        this.$refs.queryRef.validate((valid) => {
          if (valid) {
            if (this.$utilStr.isNotEmptyObject(this.currentPageOptions)) {
              this.currentPageOptions.current = 1;
              this.cacheData.currentPageOptions = this.$utilStr.deepClone(
                this.currentPageOptions
              );
            }
            if (typeof this.api === "function") {
              this.loadList();
            }
          }
        });
      } else {
        if (this.$utilStr.isNotEmptyObject(this.currentPageOptions)) {
          this.currentPageOptions.current = 1;
          this.cacheData.currentPageOptions = this.$utilStr.deepClone(
            this.currentPageOptions
          );
        }
        if (typeof this.api === "function") {
          this.loadList();
        }
      }
    },
    // 清空
    handleClear() {
      if (this.$refs.queryRef) {
        this.$refs.queryRef.resetFields();
      }
      if (this.$refs.componentRef) {
        this.$refs.componentRef.resetFields();
      }
    },
    // 表格进行重新布局
    doLayout() {
      if (this.$refs.tableRef) {
        this.$refs.tableRef.doLayout();
      }
    },
    // 分配表格列唯一标识
    appendKeyToTableColumns(columns) {
      if (columns && columns.length > 0) {
        for (let i = 0, iLen = columns.length; i < iLen; i++) {
          if (!columns[i][this.activeProps["colKey"]]) {
            columns[i][this.activeProps["colKey"]] = this.$utilStr.uuid(32, 16);
          }
          let childrenColumns = this.$utilStr.getValueOfDeepObj(
            columns[i],
            this.activeProps["colChildren"]
          );
          if (childrenColumns && childrenColumns.length > 0) {
            this.appendKeyToTableColumns(childrenColumns);
          }
        }
      }
      return columns;
    },
    // 自定义表格索引列的回调方法
    handleTableIndex(index) {
      if (
        typeof this.api === "function" &&
        !this.$utilStr.isEmpty(this.activeProps["rowIndex"])
      ) {
        return this.$utilStr.getValueOfDeepObj(
          this.tableData[index],
          this.activeProps["rowIndex"]
        );
      } else if (this.$utilStr.isNotEmptyObject(this.currentPageOptions)) {
        return (
          (this.currentPageOptions.current - 1) * this.currentPageOptions.size +
          index +
          1
        );
      } else {
        return index + 1;
      }
    },
    // 分页每页条数改变
    handleSizeChange(val) {
      this.currentPageOptions.size = val;
      this.cacheData.currentPageOptions = this.$utilStr.deepClone(
        this.currentPageOptions
      );
      if (
        this.currentPageOptions.current <=
        Math.ceil(this.currentPageOptions.total / val)
      ) {
        if (typeof this.api === "function") {
          this.loadList();
        }
      }
    },
    // 分页当前页码改变
    handleCurrentChange(val) {
      this.currentPageOptions.current = val;
      this.cacheData.currentPageOptions = this.$utilStr.deepClone(
        this.currentPageOptions
      );
      if (typeof this.api === "function") {
        this.loadList();
      }
    },
    // 表格排序条件改变
    handleSortChange({ column, prop, order }) {
      let ascs = [];
      let descs = [];
      if (order === "ascending") {
        ascs = [this.$utilStr.getSuffix(prop) || prop];
      } else if (order === "descending") {
        descs = [this.$utilStr.getSuffix(prop) || prop];
      }
      if (typeof this.queryData === "object") {
        if (!this.queryData) {
          this.queryData = {};
        }
        this.$set(this.queryData, "ascs", ascs);
        this.$set(this.queryData, "descs", descs);
      }
      if (this.$utilStr.isNotEmptyObject(this.currentPageOptions)) {
        this.currentPageOptions.current = 1;
        this.cacheData.currentPageOptions = this.$utilStr.deepClone(
          this.currentPageOptions
        );
      }
      if (typeof this.api === "function") {
        this.loadList();
      }
    },
    // 重新计算表格固定列正文距离顶部高度
    handleResetTableFixedBodyTop() {
      let tableEl = this.$refs.tableRef.$el;
      if (tableEl) {
        let tableFixedBodyWrapperEl = tableEl.querySelector(
          ".el-table__fixed-body-wrapper"
        );
        if (tableFixedBodyWrapperEl) {
          let tableFixedHeaderWrapperEl = tableEl.querySelector(
            ".el-table__fixed-header-wrapper"
          );
          if (tableFixedHeaderWrapperEl) {
            tableFixedBodyWrapperEl.style.top =
              tableFixedHeaderWrapperEl.offsetHeight + "px";
          } else {
            tableFixedBodyWrapperEl.style.top = 0;
          }
        }
      }
    },
    // 重新计算表格正文高度
    handleResetTableBodyHeight() {
      let tableEl = this.$refs.tableRef.$el;
      if (tableEl) {
        let tableLayout = this.$refs.tableRef.layout;
        let tableLayoutHeight = tableLayout.height;
        if (parseFloat(tableLayoutHeight)) {
          let tableHeight = tableLayout.tableHeight;
          let tableStyle = this.$utilElem.getStyle(tableEl);
          let tableBorderTop = parseFloat(tableStyle.borderTop);
          tableHeight += tableBorderTop;
          if (!this.$utilStr.isNum(tableLayoutHeight)) {
            if (this.$utilStr.isPercent(tableLayoutHeight)) {
              let tableParentEl = tableEl.parentNode;
              if (tableParentEl) {
                let tableParentStyle = this.$utilElem.getStyle(tableParentEl);
                let tableParentPaddingTop = parseFloat(
                  tableParentStyle.paddingTop
                );
                let tableParentPaddingBottom = parseFloat(
                  tableParentStyle.paddingBottom
                );
                let tableParentHeight =
                  tableParentEl.clientHeight -
                  tableParentPaddingTop -
                  tableParentPaddingBottom;
                tableLayoutHeight =
                  tableParentHeight *
                  this.$utilStr.percentToDecimal(tableLayoutHeight);
              } else {
                tableLayoutHeight = tableHeight;
              }
            } else {
              tableLayoutHeight = tableHeight;
            }
          }
          if (Math.round(tableLayoutHeight) === tableHeight) {
            let currentTableHeaderHeight = 0;
            let tableHeaderWrapperEl = tableEl.querySelector(
              ".el-table__header-wrapper"
            );
            if (tableHeaderWrapperEl) {
              currentTableHeaderHeight = tableHeaderWrapperEl.offsetHeight;
            }
            let currentTableFooterHeight = 0;
            let tableFooterWrapperEl = tableEl.querySelector(
              ".el-table__footer-wrapper"
            );
            if (tableFooterWrapperEl) {
              currentTableFooterHeight = tableFooterWrapperEl.offsetHeight;
            }
            let tableBodyWrapperEl = tableEl.querySelector(
              ".el-table__body-wrapper"
            );
            if (tableBodyWrapperEl) {
              let currentTableBodyHeight = tableBodyWrapperEl.offsetHeight;
              let activeTableBodyHeight =
                tableHeight -
                currentTableHeaderHeight -
                currentTableFooterHeight;
              if (currentTableBodyHeight !== activeTableBodyHeight) {
                tableBodyWrapperEl.style.height = activeTableBodyHeight + "px";
                let bodyEl =
                  tableBodyWrapperEl.querySelector(".el-table__body");
                if (bodyEl) {
                  if (activeTableBodyHeight < bodyEl.offsetHeight) {
                    tableEl.classList.add("el-table--scrollable-y");
                  } else {
                    tableEl.classList.remove("el-table--scrollable-y");
                  }
                }
              }
            }
            let tableFixedBodyWrapperEl = tableEl.querySelector(
              ".el-table__fixed-body-wrapper"
            );
            if (tableFixedBodyWrapperEl) {
              let tableViewportHeight = tableLayout.viewportHeight;
              tableViewportHeight += tableBorderTop;
              let currentTableFixedBodyHeight =
                tableFixedBodyWrapperEl.offsetHeight;
              let activeTableFixedBodyHeight =
                tableViewportHeight -
                currentTableHeaderHeight -
                currentTableFooterHeight;
              if (currentTableFixedBodyHeight !== activeTableFixedBodyHeight) {
                tableFixedBodyWrapperEl.style.height =
                  activeTableFixedBodyHeight + "px";
              }
            }
          }
        }
      }
    },
    // 单选回显
    setHighlight() {
      if (this.$refs.tableRef) {
        let currentRow = null;
        if (this.tableData && this.tableData.length > 0) {
          currentRow = this.tableData.find(
            (e) =>
              this.$utilStr.getValueOfDeepObj(e, this.activeProps["value"]) ===
              this.currentValue
          );
        }
        this.$refs.tableRef.setCurrentRow(currentRow);
      }
    },
    // 单选清空
    clearHighlight() {
      if (this.$refs.tableRef) {
        this.$refs.tableRef.setCurrentRow();
      }
    },
    // 单选
    handleChecked(index, row) {
      this.visible = false;
      let currentKey = this.$utilStr.getValueOfDeepObj(
        row,
        this.activeProps["value"]
      );
      let currentLabel = this.$utilStr.getValueOfDeepObj(
        row,
        this.activeProps["label"]
      );
      this.input = currentLabel;
      this.$emit("input", currentKey); // 触发 input 事件，并传入新值
      this.$emit("update:modelText", currentLabel);
      this.$emit("currentChanged", currentKey, this.oldValue, row);
    },
    // 多选回显
    setSelection() {
      if (this.$refs.tableRef) {
        let currentSelections = [];
        this.multipleData.forEach((item) => {
          if (this.tableData && this.tableData.length > 0) {
            let currentSelection = this.tableData.find(
              (e) =>
                this.$utilStr.getValueOfDeepObj(
                  e,
                  this.activeProps["value"]
                ) ===
                this.$utilStr.getValueOfDeepObj(item, this.activeProps["value"])
            );
            if (currentSelection) {
              currentSelections.push(currentSelection);
            }
          }
        });
        let surplusSelections = this.multipleData;
        if (this.tableData && this.tableData.length > 0) {
          this.tableData.forEach((item) => {
            surplusSelections = surplusSelections.filter(
              (e) =>
                this.$utilStr.getValueOfDeepObj(
                  e,
                  this.activeProps["value"]
                ) !==
                this.$utilStr.getValueOfDeepObj(item, this.activeProps["value"])
            );
          });
        }
        if (!surplusSelections || surplusSelections.length < 1) {
          this.$refs.tableRef.clearSelection();
        }
        if (this.tableData && this.tableData.length > 0) {
          this.tableData.forEach((row) => {
            this.$refs.tableRef.toggleRowSelection(row, false);
          });
        }
        if (currentSelections && currentSelections.length > 0) {
          currentSelections.forEach((row) => {
            this.$refs.tableRef.toggleRowSelection(row, true);
          });
        }
      }
    },
    // 多选清空
    clearSelection() {
      if (this.$refs.tableRef) {
        this.$refs.tableRef.clearSelection();
        if (!this.$utilStr.isEmpty(this.multipleData)) {
          this.triggerClearValidate();
        }
      }
    },
    // selection多选
    handleSelect(val) {
      if (this.validateLimit(val)) {
        let selections = this.multipleData;
        if (this.tableData && this.tableData.length > 0) {
          this.tableData.forEach((item) => {
            selections = selections.filter(
              (e) =>
                this.$utilStr.getValueOfDeepObj(
                  e,
                  this.activeProps["value"]
                ) !==
                this.$utilStr.getValueOfDeepObj(item, this.activeProps["value"])
            );
          });
        }
        val.forEach((item) => {
          selections = selections.filter(
            (e) =>
              this.$utilStr.getValueOfDeepObj(e, this.activeProps["value"]) !==
              this.$utilStr.getValueOfDeepObj(item, this.activeProps["value"])
          );
        });
        this.multipleData = val.concat(selections);
      }
      if (
        !this.$utilStr.isEmpty(this.currentValue) ||
        !this.$utilStr.isEmpty(this.multipleData)
      ) {
        this.triggerClearValidate();
      }
    },
    // selection全选
    handleSelectAll(val) {
      if (this.validateLimit(val)) {
        let selections = this.multipleData;
        if (this.tableData && this.tableData.length > 0) {
          this.tableData.forEach((item) => {
            selections = selections.filter(
              (e) =>
                this.$utilStr.getValueOfDeepObj(
                  e,
                  this.activeProps["value"]
                ) !==
                this.$utilStr.getValueOfDeepObj(item, this.activeProps["value"])
            );
          });
        }
        val.forEach((item) => {
          selections = selections.filter(
            (e) =>
              this.$utilStr.getValueOfDeepObj(e, this.activeProps["value"]) !==
              this.$utilStr.getValueOfDeepObj(item, this.activeProps["value"])
          );
        });
        this.multipleData = val.concat(selections);
      }
      if (
        !this.$utilStr.isEmpty(this.currentValue) ||
        !this.$utilStr.isEmpty(this.multipleData)
      ) {
        this.triggerClearValidate();
      }
    },
    // 验证多选是否超过限制数量
    validateLimit(val) {
      if (Number(this.limit) > 0 && val.length > this.limit) {
        this.$message({
          showClose: true,
          message: "超出多选限制，最多选择[" + this.limit + "]项数据",
          type: "error",
          offset: 76
        });
        val.slice(this.limit).forEach((row) => {
          this.$refs.tableRef.toggleRowSelection(row, false);
        });
        return false;
      }
      return true;
    },
    // input清空
    handleInputClear(emitEvent) {
      if (this.multiple) {
        this.multipleData = [];
        this.$emit("input", []);
        this.$emit("update:modelText", []);
        if (emitEvent) {
          this.$emit("currentChanged", [], this.oldValue, []);
        }
      } else {
        this.$emit("input", "");
        this.$emit("update:modelText", "");
        if (emitEvent) {
          this.$emit("currentChanged", "", this.oldValue, null);
        }
      }
    },
    // tag关闭
    handleTagClose() {
      if (this.multiple) {
        let currentCloseOriginRow = this.tableData.find(
          (e) =>
            this.$utilStr.getValueOfDeepObj(e, this.activeProps["value"]) ===
            this.$utilStr.getValueOfDeepObj(
              this.multipleData[0],
              this.activeProps["value"]
            )
        );
        if (currentCloseOriginRow) {
          this.$refs.tableRef.toggleRowSelection(currentCloseOriginRow, false);
        }
        this.multipleData.shift();
        if (!this.multipleData || this.multipleData.length < 1) {
          this.$refs.tableRef.clearSelection();
        }
      } else {
        this.$emit("input", "");
        this.$emit("update:modelText", "");
        this.$emit("currentChanged", "", this.oldValue, null);
      }
    },
    // dialog打开
    handleDialogOpen() {
      this.$refs.dialogRef.$el.onclick = (evt) => {
        evt.stopPropagation();
      };
      this.$nextTick(() => {
        let popupParentHiddenEl = document.querySelector(
          ".el-popup-parent--hidden"
        );
        if (popupParentHiddenEl) {
          popupParentHiddenEl.onclick = (evt) => {
            evt.stopPropagation();
            popupParentHiddenEl.onclick = null;
          };
        }
      });
    },
    // 提交
    submit() {
      this.visible = false;
      let currentKeys = this.$utilStr.objArrayToArray(
        this.multipleData,
        this.activeProps["value"]
      );
      let currentLabels = this.$utilStr.objArrayToArray(
        this.multipleData,
        this.activeProps["label"]
      );

      this.input = this.$utilStr.arraySplit(currentLabels);
      this.$emit("input", currentKeys); //触发 input 事件，并传入新值
      this.$emit("update:modelText", currentLabels);
      this.$emit(
        "currentChanged",
        currentKeys,
        this.oldValue,
        this.multipleData
      );
      if (this.constDataEnabled) {
        this.constDataEnabled = true;
      }
      if (this.currentSelection < 1) {
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
      if (this.multiple) {
        if (this.currentSelection.length > 0) {
          this.multipleData = this.currentSelection;
        } else {
          this.multipleData = this.constData;
        }
        this.setSelection();
      }
      if (this.$utilStr.isNotEmptyObject(this.currentPageOptions)) {
        this.currentPageOptions.current = 1;
      }
    },
    // 重新加载
    reload(immediate) {
      this.handleClear();
      if (immediate) {
        this.handleQuery();
      } else {
        this.loadComplete = false;
      }
    }
  }
};
</script>

<style scoped></style>
