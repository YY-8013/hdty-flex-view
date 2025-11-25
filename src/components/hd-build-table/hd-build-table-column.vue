<template>
  <el-table-column
    v-if="col[props['colChildren']] && col[props['colChildren']].length > 0 && parseFloat(col.width) !== 0"
    :fixed="col.fixed"
    :type="col.type"
    :prop="col.field"
    :label="col.label"
    :show-overflow-tooltip="col.textOverflowTooltip"
    :resizable="col.resizable"
    :sortable="setTableSortable(col)"
    :sort-method="col.sortMethod"
    :sort-by="col.sortBy"
    :sort-orders="col.sortOrders"
    :formatter="col.formatter"
    :align="col.align"
    :class-name="setTableClassName(col)"
    :header-align="col.headerAlign ? col.headerAlign : 'center'"
    :label-class-name="col.headerClass"
    :render-header="col.headerRender"
    :width="col.width"
    :min-width="col.minWidth">
    <template slot="header" slot-scope="scope">
      <slot v-if="$scopedSlots['header_' + col.field]" :name="'header_' + col.field" :column="scope.column" :$index="scope.$index">
      </slot>
      <slot v-else>{{ scope.column.label }}</slot>
    </template>
    <template v-for="childCol in col[props['colChildren']]">
      <hd-build-table-column
        :key="childCol[props['colKey']]"
        :props="props"
        :col="childCol"
        :keep-selection="keepSelection"
        :index="index">
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
  </el-table-column>
  <el-table-column
    v-else-if="col.type === 'custom' && parseFloat(col.width) !== 0"
    :fixed="col.fixed"
    :type="col.type"
    :prop="col.field"
    :label="col.label"
    :show-overflow-tooltip="col.textOverflowTooltip"
    :resizable="col.resizable"
    :sortable="setTableSortable(col)"
    :sort-method="col.sortMethod"
    :sort-by="col.sortBy"
    :sort-orders="col.sortOrders"
    :formatter="col.formatter"
    :align="col.align"
    :class-name="setTableClassName(col)"
    :header-align="col.headerAlign ? col.headerAlign : 'center'"
    :label-class-name="col.headerClass"
    :render-header="col.headerRender"
    :width="col.width"
    :min-width="col.minWidth">
    <template slot="header" slot-scope="scope">
      <slot v-if="$scopedSlots['header_' + col.field]" :name="'header_' + col.field" :column="scope.column" :$index="scope.$index">
      </slot>
      <slot v-else>{{ scope.column.label }}</slot>
    </template>
    <template slot-scope="scope">
      <slot :name="'custom_' + col.field" :row="scope.row" :column="scope.column" :$index="scope.$index">
      </slot>
    </template>
  </el-table-column>
  <el-table-column
    v-else-if="col.type === 'selection' && parseFloat(col.width) !== 0"
    :fixed="col.fixed"
    :type="col.type"
    :reserve-selection="keepSelection"
    :prop="col.field"
    :label="col.label"
    :show-overflow-tooltip="col.textOverflowTooltip"
    :resizable="col.resizable"
    :sortable="setTableSortable(col)"
    :sort-method="col.sortMethod"
    :sort-by="col.sortBy"
    :sort-orders="col.sortOrders"
    :formatter="col.formatter"
    :align="col.align"
    :class-name="setTableClassName(col)"
    :header-align="col.headerAlign ? col.headerAlign : 'center'"
    :label-class-name="col.headerClass"
    :render-header="col.headerRender"
    :width="col.width"
    :min-width="col.minWidth">
    <template slot="header" slot-scope="scope">
      <slot v-if="$scopedSlots['header_' + col.field]" :name="'header_' + col.field" :column="scope.column" :$index="scope.$index">
      </slot>
      <slot v-else>{{ scope.column.label }}</slot>
    </template>
  </el-table-column>
  <el-table-column
    v-else-if="col.type === 'index' && parseFloat(col.width) !== 0"
    :fixed="col.fixed"
    :type="col.type"
    :index="index"
    :prop="col.field"
    :label="col.label"
    :show-overflow-tooltip="col.textOverflowTooltip"
    :resizable="col.resizable"
    :sortable="setTableSortable(col)"
    :sort-method="col.sortMethod"
    :sort-by="col.sortBy"
    :sort-orders="col.sortOrders"
    :formatter="col.formatter"
    :align="col.align"
    :class-name="setTableClassName(col)"
    :header-align="col.headerAlign ? col.headerAlign : 'center'"
    :label-class-name="col.headerClass"
    :render-header="col.headerRender"
    :width="col.width"
    :min-width="col.minWidth">
    <template slot="header" slot-scope="scope">
      <slot v-if="$scopedSlots['header_' + col.field]" :name="'header_' + col.field" :column="scope.column" :$index="scope.$index">
      </slot>
      <slot v-else>{{ scope.column.label }}</slot>
    </template>
  </el-table-column>
  <el-table-column
    v-else-if="col.type === 'operation' && parseFloat(col.width) !== 0"
    :fixed="col.fixed"
    :type="col.type"
    :prop="col.field"
    :label="col.label"
    :show-overflow-tooltip="col.textOverflowTooltip"
    :resizable="col.resizable"
    :sortable="setTableSortable(col)"
    :sort-method="col.sortMethod"
    :sort-by="col.sortBy"
    :sort-orders="col.sortOrders"
    :formatter="col.formatter"
    :align="col.align"
    :class-name="setTableClassName(col)"
    :header-align="col.headerAlign ? col.headerAlign : 'center'"
    :label-class-name="col.headerClass"
    :render-header="col.headerRender"
    :width="col.width"
    :min-width="col.minWidth">
    <template slot="header" slot-scope="scope">
      <slot v-if="$scopedSlots['header_' + col.field]" :name="'header_' + col.field" :column="scope.column" :$index="scope.$index">
      </slot>
      <slot v-else>{{ scope.column.label }}</slot>
    </template>
    <template slot-scope="scope">
      <slot name="operation" :row="scope.row" :column="scope.column" :$index="scope.$index">
      </slot>
    </template>
  </el-table-column>
  <el-table-column
    v-else-if="col.type === 'expand' && parseFloat(col.width) !== 0"
    :fixed="col.fixed"
    :type="col.type"
    :prop="col.field"
    :label="col.label"
    :show-overflow-tooltip="col.textOverflowTooltip"
    :resizable="col.resizable"
    :sortable="setTableSortable(col)"
    :sort-method="col.sortMethod"
    :sort-by="col.sortBy"
    :sort-orders="col.sortOrders"
    :formatter="col.formatter"
    :align="col.align"
    :class-name="setTableClassName(col)"
    :header-align="col.headerAlign ? col.headerAlign : 'center'"
    :label-class-name="col.headerClass"
    :render-header="col.headerRender"
    :width="col.width"
    :min-width="col.minWidth">
    <template slot="header" slot-scope="scope">
      <slot v-if="$scopedSlots['header_' + col.field]" :name="'header_' + col.field" :column="scope.column" :$index="scope.$index">
      </slot>
      <slot v-else>{{ scope.column.label }}</slot>
    </template>
    <template slot-scope="scope">
      <slot
        name="expand"
        :row="scope.row"
        :column="scope.column"
        :$index="scope.$index">
      </slot>
    </template>
  </el-table-column>
  <el-table-column
    v-else-if="col.type === 'number' && parseFloat(col.width) !== 0"
    :fixed="col.fixed"
    :type="col.type"
    :prop="col.field"
    :label="col.label"
    :show-overflow-tooltip="col.textOverflowTooltip"
    :resizable="col.resizable"
    :sortable="setTableSortable(col)"
    :sort-method="col.sortMethod"
    :sort-by="col.sortBy"
    :sort-orders="col.sortOrders"
    :formatter="col.formatter"
    :align="col.align"
    :class-name="setTableClassName(col)"
    :header-align="col.headerAlign ? col.headerAlign : 'center'"
    :label-class-name="col.headerClass"
    :render-header="col.headerRender"
    :width="col.width"
    :min-width="col.minWidth">
    <template slot="header" slot-scope="scope">
      <slot v-if="$scopedSlots['header_' + col.field]" :name="'header_' + col.field" :column="scope.column" :$index="scope.$index">
      </slot>
      <slot v-else>{{ scope.column.label }}</slot>
    </template>
    <template slot-scope="scope">
      <span v-html="formatNumber(col, $utilStr.getValueOfDeepObj(scope.row, col.field))">
      </span>
    </template>
  </el-table-column>
  <el-table-column
    v-else-if="col.type === 'amount' && parseFloat(col.width) !== 0"
    :fixed="col.fixed"
    :type="col.type"
    :prop="col.field"
    :label="col.label"
    :show-overflow-tooltip="col.textOverflowTooltip"
    :resizable="col.resizable"
    :sortable="setTableSortable(col)"
    :sort-method="col.sortMethod"
    :sort-by="col.sortBy"
    :sort-orders="col.sortOrders"
    :formatter="col.formatter"
    :align="col.align"
    :class-name="setTableClassName(col)"
    :header-align="col.headerAlign ? col.headerAlign : 'center'"
    :label-class-name="col.headerClass"
    :render-header="col.headerRender"
    :width="col.width"
    :min-width="col.minWidth">
    <template slot="header" slot-scope="scope">
      <slot v-if="$scopedSlots['header_' + col.field]" :name="'header_' + col.field" :column="scope.column" :$index="scope.$index">
      </slot>
      <slot v-else>{{ scope.column.label }}</slot>
    </template>
    <template slot-scope="scope">
      <span v-html="formatAmount(col, $utilStr.getValueOfDeepObj(scope.row, col.field))">
      </span>
    </template>
  </el-table-column>
  <el-table-column
    v-else-if="col.type === 'year' && parseFloat(col.width) !== 0"
    :fixed="col.fixed"
    :type="col.type"
    :prop="col.field"
    :label="col.label"
    :show-overflow-tooltip="col.textOverflowTooltip"
    :resizable="col.resizable"
    :sortable="setTableSortable(col)"
    :sort-method="col.sortMethod"
    :sort-by="col.sortBy"
    :sort-orders="col.sortOrders"
    :formatter="col.formatter"
    :align="col.align"
    :class-name="setTableClassName(col)"
    :header-align="col.headerAlign ? col.headerAlign : 'center'"
    :label-class-name="col.headerClass"
    :render-header="col.headerRender"
    :width="col.width"
    :min-width="col.minWidth">
    <template slot="header" slot-scope="scope">
      <slot v-if="$scopedSlots['header_' + col.field]" :name="'header_' + col.field" :column="scope.column" :$index="scope.$index">
      </slot>
      <slot v-else>{{ scope.column.label }}</slot>
    </template>
    <template slot-scope="scope">
      <span v-html="formatYear(col, $utilStr.getValueOfDeepObj(scope.row, col.field))">
      </span>
    </template>
  </el-table-column>
  <el-table-column
    v-else-if="col.type === 'month' && parseFloat(col.width) !== 0"
    :fixed="col.fixed"
    :type="col.type"
    :prop="col.field"
    :label="col.label"
    :show-overflow-tooltip="col.textOverflowTooltip"
    :resizable="col.resizable"
    :sortable="setTableSortable(col)"
    :sort-method="col.sortMethod"
    :sort-by="col.sortBy"
    :sort-orders="col.sortOrders"
    :formatter="col.formatter"
    :align="col.align"
    :class-name="setTableClassName(col)"
    :header-align="col.headerAlign ? col.headerAlign : 'center'"
    :label-class-name="col.headerClass"
    :render-header="col.headerRender"
    :width="col.width"
    :min-width="col.minWidth">
    <template slot="header" slot-scope="scope">
      <slot v-if="$scopedSlots['header_' + col.field]" :name="'header_' + col.field" :column="scope.column" :$index="scope.$index">
      </slot>
      <slot v-else>{{ scope.column.label }}</slot>
    </template>
    <template slot-scope="scope">
      <span v-html="formatMonth(col, $utilStr.getValueOfDeepObj(scope.row, col.field))">
      </span>
    </template>
  </el-table-column>
  <el-table-column
    v-else-if="col.type === 'date' && parseFloat(col.width) !== 0"
    :fixed="col.fixed"
    :type="col.type"
    :prop="col.field"
    :label="col.label"
    :show-overflow-tooltip="col.textOverflowTooltip"
    :resizable="col.resizable"
    :sortable="setTableSortable(col)"
    :sort-method="col.sortMethod"
    :sort-by="col.sortBy"
    :sort-orders="col.sortOrders"
    :formatter="col.formatter"
    :align="col.align"
    :class-name="setTableClassName(col)"
    :header-align="col.headerAlign ? col.headerAlign : 'center'"
    :label-class-name="col.headerClass"
    :render-header="col.headerRender"
    :width="col.width"
    :min-width="col.minWidth">
    <template slot="header" slot-scope="scope">
      <slot v-if="$scopedSlots['header_' + col.field]" :name="'header_' + col.field" :column="scope.column" :$index="scope.$index">
      </slot>
      <slot v-else>{{ scope.column.label }}</slot>
    </template>
    <template slot-scope="scope">
      <span v-html="formatDate(col, $utilStr.getValueOfDeepObj(scope.row, col.field))">
      </span>
    </template>
  </el-table-column>
  <el-table-column
    v-else-if="col.type === 'datetime' && parseFloat(col.width) !== 0"
    :fixed="col.fixed"
    :type="col.type"
    :prop="col.field"
    :label="col.label"
    :show-overflow-tooltip="col.textOverflowTooltip"
    :resizable="col.resizable"
    :sortable="setTableSortable(col)"
    :sort-method="col.sortMethod"
    :sort-by="col.sortBy"
    :sort-orders="col.sortOrders"
    :formatter="col.formatter"
    :align="col.align"
    :class-name="setTableClassName(col)"
    :header-align="col.headerAlign ? col.headerAlign : 'center'"
    :label-class-name="col.headerClass"
    :render-header="col.headerRender"
    :width="col.width"
    :min-width="col.minWidth">
    <template slot="header" slot-scope="scope">
      <slot v-if="$scopedSlots['header_' + col.field]" :name="'header_' + col.field" :column="scope.column" :$index="scope.$index">
      </slot>
      <slot v-else>{{ scope.column.label }}</slot>
    </template>
    <template slot-scope="scope">
      <span v-html="formatDatetime(col, $utilStr.getValueOfDeepObj(scope.row, col.field))">
      </span>
    </template>
  </el-table-column>
  <el-table-column
    v-else-if="col.type === 'time' && parseFloat(col.width) !== 0"
    :fixed="col.fixed"
    :type="col.type"
    :prop="col.field"
    :label="col.label"
    :show-overflow-tooltip="col.textOverflowTooltip"
    :resizable="col.resizable"
    :sortable="setTableSortable(col)"
    :sort-method="col.sortMethod"
    :sort-by="col.sortBy"
    :sort-orders="col.sortOrders"
    :formatter="col.formatter"
    :align="col.align"
    :class-name="setTableClassName(col)"
    :header-align="col.headerAlign ? col.headerAlign : 'center'"
    :label-class-name="col.headerClass"
    :render-header="col.headerRender"
    :width="col.width"
    :min-width="col.minWidth">
    <template slot="header" slot-scope="scope">
      <slot v-if="$scopedSlots['header_' + col.field]" :name="'header_' + col.field" :column="scope.column" :$index="scope.$index">
      </slot>
      <slot v-else>{{ scope.column.label }}</slot>
    </template>
    <template slot-scope="scope">
      <span v-html="formatTime(col, $utilStr.getValueOfDeepObj(scope.row, col.field))">
      </span>
    </template>
  </el-table-column>
  <el-table-column
    v-else-if="col.type === 'array' && parseFloat(col.width) !== 0"
    :fixed="col.fixed"
    :type="col.type"
    :prop="col.field"
    :label="col.label"
    :show-overflow-tooltip="col.textOverflowTooltip"
    :resizable="col.resizable"
    :sortable="setTableSortable(col)"
    :sort-method="col.sortMethod"
    :sort-by="col.sortBy"
    :sort-orders="col.sortOrders"
    :formatter="col.formatter"
    :align="col.align"
    :class-name="setTableClassName(col)"
    :header-align="col.headerAlign ? col.headerAlign : 'center'"
    :label-class-name="col.headerClass"
    :render-header="col.headerRender"
    :width="col.width"
    :min-width="col.minWidth">
    <template slot="header" slot-scope="scope">
      <slot v-if="$scopedSlots['header_' + col.field]" :name="'header_' + col.field" :column="scope.column" :$index="scope.$index">
      </slot>
      <slot v-else>{{ scope.column.label }}</slot>
    </template>
    <template slot-scope="scope">
      <span v-html="formatArray(col, $utilStr.getValueOfDeepObj(scope.row, col.field))">
      </span>
    </template>
  </el-table-column>
  <el-table-column
    v-else-if="col.type === 'tag' && parseFloat(col.width) !== 0"
    :fixed="col.fixed"
    :type="col.type"
    :prop="col.field"
    :label="col.label"
    :show-overflow-tooltip="col.textOverflowTooltip"
    :resizable="col.resizable"
    :sortable="setTableSortable(col)"
    :sort-method="col.sortMethod"
    :sort-by="col.sortBy"
    :sort-orders="col.sortOrders"
    :formatter="col.formatter"
    :align="col.align"
    :class-name="setTableClassName(col)"
    :header-align="col.headerAlign ? col.headerAlign : 'center'"
    :label-class-name="col.headerClass"
    :render-header="col.headerRender"
    :width="col.width"
    :min-width="col.minWidth">
    <template slot="header" slot-scope="scope">
      <slot v-if="$scopedSlots['header_' + col.field]" :name="'header_' + col.field" :column="scope.column" :$index="scope.$index">
      </slot>
      <slot v-else>{{ scope.column.label }}</slot>
    </template>
    <template slot-scope="scope">
      <div
        v-if="!$utilStr.isEmpty($utilStr.getValueOfDeepObj(scope.row, col.field))"
        class="hdty-tag-container">
        <template
          v-for="(item, index) in $utilStr.toArray($utilStr.getValueOfDeepObj(scope.row, col.field))">
          <el-tag
            v-if="!$utilStr.isEmpty(item)"
            :key="$utilStr.uuid(32, 16)"
            :type="!$utilStr.isEmpty($utilStr.getValueOfDeepObj(scope.row, col.tagThemeField))
             ? $utilStr.toArray($utilStr.getValueOfDeepObj(scope.row, col.tagThemeField))[index % $utilStr.toArray($utilStr.getValueOfDeepObj(scope.row, col.tagThemeField)).length]
             : 'default'">
            {{ item }}
          </el-tag>
        </template>
      </div>
    </template>
  </el-table-column>
  <el-table-column
    v-else-if="col.type === 'geo' && parseFloat(col.width) !== 0"
    :fixed="col.fixed"
    :type="col.type"
    :prop="col.field"
    :label="col.label"
    :show-overflow-tooltip="col.textOverflowTooltip"
    :resizable="col.resizable"
    :sortable="setTableSortable(col)"
    :sort-method="col.sortMethod"
    :sort-by="col.sortBy"
    :sort-orders="col.sortOrders"
    :formatter="col.formatter"
    :align="col.align"
    :class-name="setTableClassName(col)"
    :header-align="col.headerAlign ? col.headerAlign : 'center'"
    :label-class-name="col.headerClass"
    :render-header="col.headerRender"
    :width="col.width"
    :min-width="col.minWidth">
    <template slot="header" slot-scope="scope">
      <slot v-if="$scopedSlots['header_' + col.field]" :name="'header_' + col.field" :column="scope.column" :$index="scope.$index">
      </slot>
      <slot v-else>{{ scope.column.label }}</slot>
    </template>
    <template slot-scope="scope">
      <div class="hdty-geo-container">
        <span v-html="formatGeo(col, $utilStr.getValueOfDeepObj(scope.row, col.field))">
        </span>
        <hd-map-point
          v-if="$utilStr.getValueOfDeepObj(scope.row, col.geoPointField)"
          type="button"
          :value="$utilStr.getValueOfDeepObj(scope.row, col.geoPointField)"
          :model-text="$utilStr.getValueOfDeepObj(scope.row, col.field)">
        </hd-map-point>
      </div>
    </template>
  </el-table-column>
  <el-table-column
    v-else-if="col.type === 'image' && parseFloat(col.width) !== 0"
    :fixed="col.fixed"
    :type="col.type"
    :prop="col.field"
    :label="col.label"
    :show-overflow-tooltip="col.textOverflowTooltip"
    :resizable="col.resizable"
    :sortable="setTableSortable(col)"
    :sort-method="col.sortMethod"
    :sort-by="col.sortBy"
    :sort-orders="col.sortOrders"
    :formatter="col.formatter"
    :align="col.align"
    :class-name="setTableClassName(col)"
    :header-align="col.headerAlign ? col.headerAlign : 'center'"
    :label-class-name="col.headerClass"
    :render-header="col.headerRender"
    :width="col.width"
    :min-width="col.minWidth">
    <template slot="header" slot-scope="scope">
      <slot v-if="$scopedSlots['header_' + col.field]" :name="'header_' + col.field" :column="scope.column" :$index="scope.$index">
      </slot>
      <slot v-else>{{ scope.column.label }}</slot>
    </template>
    <template slot-scope="scope">
      <hd-image
        :src="formatURLAppendTimeStamp($utilStr.getValueOfDeepObj(scope.row, col.field))"
        :empty-icon="formatImageEmptyIcon(col)"
        :empty-text="formatImageEmptyText(col)"
        :class="formatImageScaleClass(col)">
      </hd-image>
    </template>
  </el-table-column>
  <el-table-column
    v-else-if="col.type === 'file' && parseFloat(col.width) !== 0"
    :fixed="col.fixed"
    :type="col.type"
    :prop="col.field"
    :label="col.label"
    :show-overflow-tooltip="col.textOverflowTooltip"
    :resizable="col.resizable"
    :sortable="setTableSortable(col)"
    :sort-method="col.sortMethod"
    :sort-by="col.sortBy"
    :sort-orders="col.sortOrders"
    :formatter="col.formatter"
    :align="col.align"
    :class-name="setTableClassName(col)"
    :header-align="col.headerAlign ? col.headerAlign : 'center'"
    :label-class-name="col.headerClass"
    :render-header="col.headerRender"
    :width="col.width"
    :min-width="col.minWidth">
    <template slot="header" slot-scope="scope">
      <slot v-if="$scopedSlots['header_' + col.field]" :name="'header_' + col.field" :column="scope.column" :$index="scope.$index">
      </slot>
      <slot v-else>{{ scope.column.label }}</slot>
    </template>
    <template slot-scope="scope">
      <hd-image
        v-if="!$utilStr.isEmpty($utilStr.getValueOfDeepObj(scope.row, col.field))"
        :src="formatURLAppendTimeStamp($utilStr.getValueOfDeepObj(scope.row, col.field))"
        :empty-icon="formatFilePreviewEmptyIcon(col)"
        :empty-text="formatFilePreviewEmptyText(col)"
        class="hdty-file-preview-image"
        :class="formatFilePreviewScaleClass(col)">
      </hd-image>
      <div v-else class="hdty-file-preview-empty">
        <i v-if="formatFilePreviewEmptyIcon(col)" :class="formatFilePreviewEmptyIcon(col)">
        </i>
        <span v-if="formatFilePreviewEmptyText(col)">
          {{ formatFilePreviewEmptyText(col) }}
        </span>
      </div>
    </template>
  </el-table-column>
  <el-table-column
    v-else-if="col.type === 'html' && parseFloat(col.width) !== 0"
    :fixed="col.fixed"
    :type="col.type"
    :prop="col.field"
    :label="col.label"
    :show-overflow-tooltip="col.textOverflowTooltip"
    :resizable="col.resizable"
    :sortable="setTableSortable(col)"
    :sort-method="col.sortMethod"
    :sort-by="col.sortBy"
    :sort-orders="col.sortOrders"
    :formatter="col.formatter"
    :align="col.align"
    :class-name="setTableClassName(col)"
    :header-align="col.headerAlign ? col.headerAlign : 'center'"
    :label-class-name="col.headerClass"
    :render-header="col.headerRender"
    :width="col.width"
    :min-width="col.minWidth">
    <template slot="header" slot-scope="scope">
      <slot v-if="$scopedSlots['header_' + col.field]" :name="'header_' + col.field" :column="scope.column" :$index="scope.$index">
      </slot>
      <slot v-else>{{ scope.column.label }}</slot>
    </template>
    <template slot-scope="scope">
      <div class="hdty-html-container" v-html="$utilStr.getValueOfDeepObj(scope.row, col.field)">
      </div>
    </template>
  </el-table-column>
  <el-table-column
    v-else-if="parseFloat(col.width) !== 0"
    :fixed="col.fixed"
    :type="col.type"
    :prop="col.field"
    :label="col.label"
    :show-overflow-tooltip="col.textOverflowTooltip"
    :resizable="col.resizable"
    :sortable="setTableSortable(col)"
    :sort-method="col.sortMethod"
    :sort-by="col.sortBy"
    :sort-orders="col.sortOrders"
    :formatter="col.formatter"
    :align="col.align"
    :class-name="setTableClassName(col)"
    :header-align="col.headerAlign ? col.headerAlign : 'center'"
    :label-class-name="col.headerClass"
    :render-header="col.headerRender"
    :width="col.width"
    :min-width="col.minWidth">
    <template slot="header" slot-scope="scope">
      <slot v-if="$scopedSlots['header_' + col.field]" :name="'header_' + col.field" :column="scope.column" :$index="scope.$index">
      </slot>
      <slot v-else>{{ scope.column.label }}</slot>
    </template>
  </el-table-column>
</template>

<script>
  export default {
    name: "HdBuildTableColumn",
    provide() {
      return {
        hdBuildTableColumn: this
      };
    },
    props: {
      props: Object,
      col: Object,
      keepSelection: Boolean,
      index: Function
    },
    methods: {
      // 设置表格列的排序属性
      setTableSortable(column) {
        if(column.sortable) {
          if(typeof(column.sortable) !== 'boolean') {
            return 'custom';
          } else {
            return true;
          }
        } else {
          return false;
        }
      },
      // 设置表格列的自定义类名
      setTableClassName(column) {
        let className;
        if(column.adaptive) {
          if(column.type === 'index') {
            if(column.class) {
              if(column.class.includes('is-index')) {
                if(column.class.includes('is-adaptive')) {
                  className = column.class;
                } else {
                  className = column.class + ' is-adaptive';
                }
              } else {
                if(column.class.includes('is-adaptive')) {
                  className = 'is-index ' + column.class;
                } else {
                  className = 'is-index is-adaptive ' + column.class;
                }
              }
            } else {
              className = 'is-index is-adaptive';
            }
          } else if(column.type === 'operation') {
            if(column.class) {
              if(column.class.includes('is-operation')) {
                if(column.class.includes('is-adaptive')) {
                  className = column.class;
                } else {
                  className = column.class + ' is-adaptive';
                }
              } else {
                if(column.class.includes('is-adaptive')) {
                  className = 'is-operation ' + column.class;
                } else {
                  className = 'is-operation is-adaptive ' + column.class;
                }
              }
            } else {
              className = 'is-index is-adaptive';
            }
          } else {
            if(column.class) {
              if(column.class.includes('is-adaptive')) {
                className = column.class;
              } else {
                className = 'is-adaptive ' + column.class;
              }
            } else {
              className = 'is-adaptive';
            }
          }
        } else {
          if(column.type === 'index') {
            if(column.class) {
              if(column.class.includes('is-index')) {
                className = column.class;
              } else {
                className = 'is-index ' + column.class;
              }
            } else {
              className = 'is-index';
            }
          } else if(column.type === 'operation') {
            if(column.class) {
              if(column.class.includes('is-operation')) {
                className = column.class;
              } else {
                className = 'is-operation ' + column.class;
              }
            } else {
              className = 'is-operation';
            }
          } else {
            className = column.class;
          }
        }
        return className;
      },
      // 表格数字列格式化
      formatNumber(column, cellValue) {
        return this.$utilStr.numFtt(cellValue, column.numberFix);
      },
      // 表格金额列格式化
      formatAmount(column, cellValue) {
        let amountSign = '￥';
        if(this.$utilStr.isExist(column.amountSign)) {
          amountSign = column.amountSign;
        }
        let amountFix = '2';
        if(this.$utilStr.isExist(column.amountFix)) {
          amountFix = column.amountFix;
        }
        return amountSign + this.$utilStr.numFtt(cellValue, amountFix);
      },
      // 表格年份列格式化
      formatYear(column, cellValue) {
        let iconHTML = '';
        if(!this.$utilStr.isEmpty(column.yearIcon)) {
          iconHTML = '<i class="'+column.yearIcon+'"></i>';
        }
        let pattern = 'yyyy年';
        if(!this.$utilStr.isEmpty(column.yearPattern)) {
          pattern = column.yearPattern;
        }
        return iconHTML + '\r\n' + this.$utilDate.dateFtt(cellValue, pattern) + '\r\n';
      },
      // 表格月份列格式化
      formatMonth(column, cellValue) {
        let iconHTML = '';
        if(!this.$utilStr.isEmpty(column.monthIcon)) {
          iconHTML = '<i class="'+column.monthIcon+'"></i>';
        }
        let pattern = 'yyyy年MM月';
        if(!this.$utilStr.isEmpty(column.monthPattern)) {
          pattern = column.monthPattern;
        }
        if(this.$utilStr.isText(cellValue) && (cellValue + '').replace(/[^0-9]/ig, '').length < 6) {
          let patternMatch = pattern.match(/MM([\s\S]*)/);
          if(patternMatch) {
            pattern = patternMatch[0];
          }
        }
        return iconHTML + '\r\n' + this.$utilDate.dateFtt(cellValue, pattern) + '\r\n';
      },
      // 表格日期列格式化
      formatDate(column, cellValue) {
        let iconHTML = '<i class="el-icon-date"></i>';
        if(this.$utilStr.isExist(column.dateIcon)) {
          if(column.dateIcon) {
            iconHTML = '<i class="'+column.dateIcon+'"></i>';
          } else {
            iconHTML = '';
          }
        }
        let pattern = 'yyyy-MM-dd';
        if(!this.$utilStr.isEmpty(column.datePattern)) {
          pattern = column.datePattern;
        }
        if(this.$utilStr.isText(cellValue) && (cellValue + '').replace(/[^0-9]/ig, '').length < 8) {
          let patternMatch = pattern.match(/MM([\s\S]*)/);
          if(patternMatch) {
            pattern = patternMatch[0];
          }
        }
        return iconHTML + '\r\n' + this.$utilDate.dateFtt(cellValue, pattern) + '\r\n';
      },
      // 表格日期时间列格式化
      formatDatetime(column, cellValue) {
        let iconHTML = '<i class="el-icon-time"></i>';
        if(this.$utilStr.isExist(column.datetimeIcon)) {
          if(column.datetimeIcon) {
            iconHTML = '<i class="'+column.datetimeIcon+'"></i>';
          } else {
            iconHTML = '';
          }
        }
        let pattern = 'yyyy-MM-dd HH:mm:ss';
        if(!this.$utilStr.isEmpty(column.datetimePattern)) {
          pattern = column.datetimePattern;
        }
        if(this.$utilStr.isText(cellValue) && (cellValue + '').replace(/[^0-9]/ig, '').length < 14) {
          let patternMatch = pattern.match(/([\s\S]*)mm/);
          if(patternMatch) {
            pattern = patternMatch[0];
          }
        }
        return iconHTML + '\r\n' + this.$utilDate.dateFtt(cellValue, pattern) + '\r\n';
      },
      // 表格时间列格式化
      formatTime(column, cellValue) {
        let iconHTML = '<i class="el-icon-time"></i>';
        if(this.$utilStr.isExist(column.datetimeIcon)) {
          if(column.datetimeIcon) {
            iconHTML = '<i class="'+column.datetimeIcon+'"></i>';
          } else {
            iconHTML = '';
          }
        }
        let pattern = 'HH:mm:ss';
        if(!this.$utilStr.isEmpty(column.timePattern)) {
          pattern = column.timePattern;
        }
        if(this.$utilStr.isText(cellValue) && (cellValue + '').replace(/[^0-9]/ig, '').length < 6) {
          let patternMatch = pattern.match(/([\s\S]*)mm/);
          if(patternMatch) {
            pattern = patternMatch[0];
          }
        }
        return iconHTML + '\r\n' + this.$utilDate.timeFtt(cellValue, pattern) + '\r\n';
      },
      // 表格数组列格式化
      formatArray(column, cellValue) {
        let arrayHyphen = '，';
        if(this.$utilStr.isExist(column.arrayHyphen)) {
          arrayHyphen = column.arrayHyphen;
        }
        return this.$utilStr.arrayJoin(cellValue, arrayHyphen);
      },
      // 表格地理位置列格式化
      formatGeo(column, cellValue) {
        let geoEmptyText = '未知';
        if(this.$utilStr.isExist(column.geoEmptyText)) {
          geoEmptyText = column.geoEmptyText;
        }
        if(cellValue) {
          return cellValue;
        } else {
          return geoEmptyText;
        }
      },
      // 表格图片列格式化空数据时显示图标
      formatImageEmptyIcon(column) {
        let imageEmptyIcon = 'icon-no-image';
        if(this.$utilStr.isExist(column.imageEmptyIcon)) {
          imageEmptyIcon = column.imageEmptyIcon;
        }
        return imageEmptyIcon;
      },
      // 表格图片列格式化空数据时显示文本
      formatImageEmptyText(column) {
        let imageEmptyText = '暂无图片';
        if(this.$utilStr.isExist(column.imageEmptyText)) {
          imageEmptyText = column.imageEmptyText;
        }
        return imageEmptyText;
      },
      // 表格图片列格式化比例类名
      formatImageScaleClass(column) {
        let imageScaleClass = 'hdty-img-scale-wide';
        if(this.$utilStr.isExist(column.imageScaleClass)) {
          imageScaleClass = column.imageScaleClass;
        }
        return imageScaleClass;
      },
      // 表格文件列格式化预览空数据时显示图标
      formatFilePreviewEmptyIcon(column) {
        let filePreviewEmptyIcon = '';
        if(!this.$utilStr.isEmpty(column.filePreviewEmptyIcon)) {
          filePreviewEmptyIcon = column.filePreviewEmptyIcon;
        }
        return filePreviewEmptyIcon;
      },
      // 表格文件列格式化预览空数据时显示文本
      formatFilePreviewEmptyText(column) {
        let filePreviewEmptyText = '暂不支持预览';
        if(this.$utilStr.isExist(column.filePreviewEmptyText)) {
          filePreviewEmptyText = column.filePreviewEmptyText;
        }
        return filePreviewEmptyText;
      },
      // 表格文件列格式化预览比例类名
      formatFilePreviewScaleClass(column) {
        let filePreviewScaleClass = 'hdty-img-scale-wide';
        if(this.$utilStr.isExist(column.filePreviewScaleClass)) {
          filePreviewScaleClass = column.filePreviewScaleClass;
        }
        return filePreviewScaleClass;
      },
      // 表格URL列格式化追加时间戳
      formatURLAppendTimeStamp(cellValue) {
        if(this.$utilStr.isURL(cellValue)) {
          return this.$utilStr.appendParameterToURL(cellValue, {
            t: new Date().getTime()
          });
        } else {
          return cellValue;
        }
      }
    }
  }
</script>

<style scoped>

</style>
