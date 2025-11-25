<template>
  <div ref="mapRef" class="hdty-map-wrapper" :style="activeWrapperStyle">
    <div
      v-loading="loading"
      :element-loading-text="loadingText"
      class="hdty-map"
      :style="{ minHeight: !activeWrapperStyle.height ? '300px' : '' }"
    >
      <div
        :id="mapId"
        class="hdty-map-baidu"
        :class="{
          'drawing-tool-hide':
            !currentDrawingTool || !activeEnableDrawingManager,
          'drawing-marker-hide': !currentMarker,
          'drawing-polyline-hide': !currentPolyline,
          'drawing-circle-hide': !currentCircle,
          'drawing-polygon-hide': !currentPolygon,
          'copyright-hide': !copyright,
          'logo-hide': !logo
        }"
        :style="{ minHeight: !activeWrapperStyle.height ? '300px' : '' }"
      ></div>
      <el-color-picker
        v-if="map && colorPicker"
        v-model="currentDrawingColor"
        title="选择颜色"
        popper-class="no-clear-btn"
        :style="[activeColorPickerOffsetStyle]"
        @change="handleColorChange"
      >
      </el-color-picker>
      <hd-factor-input
        v-if="map && keywordSearch"
        ref="searchRef"
        :id="keywordSearchId"
        v-model="searchKeyword"
        :model-control.sync="currentKeywordSearchControl"
        :fuzzy="keywordSearchFuzzy"
        :placeholder="keywordSearchPlaceholder"
        :validate-event="false"
        :show-control-button="showKeywordSearchControlButton"
        :control-button-readonly="keywordSearchControlButtonReadonly"
        :control-button-disabled="keywordSearchControlButtonDisabled"
        clearable
        class="hdty-map-search"
        :style="[activeKeywordSearchOffsetStyle]"
        @currentFocus="handleKeywordSearchFocus"
        @currentInput="handleKeywordSearchInput"
        @currentClear="handleKeywordSearchClear"
        @keyup.enter.native="handleKeywordSearch"
      >
        <el-button
          slot="append"
          :loading="searchLoading"
          icon="icon-search"
          class="hdty-map-search-button"
          @click="handleKeywordSearch"
        >
        </el-button>
      </hd-factor-input>
      <div
        v-if="activeKeywordShopEnabled && keywordShopVisible"
        class="hdty-map-search-shop"
        :style="[activeKeywordSearchShopOffsetStyle]"
      >
        <div class="hdty-shop">
          <div
            v-for="(item, index) in activeKeywordFilterShopOptions"
            :key="index"
            class="hdty-shop-item"
            :class="{ 'is-active': activeKeywordShop === item.shop }"
          >
            <a href="javascript:;" @click.stop="handleKeywordShopItem(item)">
              <i
                :class="item.icon"
                :style="'background-color:' + item.color"
                circle
              >
              </i>
              <span>
                {{ item.name }}
              </span>
            </a>
          </div>
        </div>
      </div>
      <div
        v-if="keywordAutoVisible || keywordSearchVisible"
        class="hdty-map-search-list hdty-scroll"
        :style="[
          activeKeywordSearchListOffsetStyle,
          {
            maxHeight: currentRouteSearchBoxOccupy ? '75%' : ''
          }
        ]"
      >
        <div
          v-if="keywordAutoResult.length > 0"
          v-show="keywordAutoVisible"
          class="hdty-list hdty-auto-list"
          :class="customKeywordAutoResultPanelClass"
        >
          <div
            v-for="(item, index) in keywordAutoResult"
            :key="index"
            class="hdty-list-item"
            @click.stop="handleKeywordAutoItem(item)"
          >
            <i class="icon-search"> </i>
            {{ item.business }}
            <cite>
              {{ item.region }}
            </cite>
          </div>
        </div>
        <div
          v-else-if="keywordSearchResult.length > 0"
          v-show="keywordSearchVisible"
          class="hdty-list hdty-search-list"
          :class="customKeywordSearchResultPanelClass"
        >
          <div
            v-if="
              currentCityListSearchResultItemChecked &&
              !$utilStr.isEmpty(currentCityListSearchResultItem)
            "
            class="hdty-search-back"
          >
            已切换至<strong>{{
              currentCityListSearchResultItem.department
            }}</strong
            >，
            <a
              href="javascript:;"
              :title="'点击返回其他城市的搜索结果'"
              @click.stop="handleCityListSearchResult"
            >
              返回其他城市
            </a>
          </div>
          <div
            v-if="activeKeywordFilterEnabled && !currentRouteSearchBoxOccupy"
            class="hdty-search-filter hdty-scroll hdty-scroll-x"
          >
            <div class="hdty-filter-wrapper">
              <div class="hdty-filter">
                <div
                  v-for="(item, index) in activeKeywordFilters"
                  :key="index"
                  class="hdty-filter-item"
                >
                  <hd-component-item
                    :type="item.type"
                    v-model="keywordSearchFilterData[item.field]"
                    :label.sync="
                      keywordSearchExtendData[
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
                    :show-all-button="item.showAllButton"
                    :show-refresh-button="item.showRefreshButton"
                    :show-all-levels="item.showAllLevels"
                    :show-code="item.showCode"
                    :show-full-address="item.showFullAddress"
                    :lazy="item.lazy"
                    :accordion="item.accordion"
                    :filterable="item.filterable"
                    :clearable="item.clearable"
                    :readonly="item.readonly"
                    :disabled="item.disabled"
                    :adaptive="
                      typeof item.adaptive === 'boolean' ? item.adaptive : true
                    "
                    :underline="item.underline"
                  >
                  </hd-component-item>
                </div>
              </div>
            </div>
          </div>
          <div
            v-for="(item, index) in keywordSearchResult"
            :key="index"
            class="hdty-list-item"
            @click.stop="handleKeywordSearchItem(item)"
          >
            <div class="hdty-search-base">
              <div v-if="item.point" class="hdty-search-label number">
                <div class="hdty-number">
                  <i class="icon-marker"> </i>
                  <span>{{ index + 1 }}</span>
                </div>
              </div>
              <div v-else-if="item.image" class="hdty-search-label thumbnail">
                <hd-image :src="item.image"> </hd-image>
              </div>
              <div class="hdty-search-content">
                <h6>{{ item.business }}</h6>
                <div
                  v-if="item.tags && item.tags.length > 0"
                  class="hdty-form-item"
                >
                  <div
                    v-if="item.tagsAlias"
                    class="hdty-form-label"
                    :style="{ width: item.tagsAlias.length * 12 + 6 + 'px' }"
                  >
                    {{ item.tagsAlias }}
                  </div>
                  <div
                    class="hdty-form-content"
                    :style="{
                      marginLeft: item.tagsAlias
                        ? item.tagsAlias.length * 12 + 6 + 'px'
                        : 0
                    }"
                  >
                    <div
                      v-for="(tag, index) in item.tags"
                      :key="index"
                      v-html="tag"
                      class="hdty-tag"
                    ></div>
                  </div>
                </div>
                <div v-if="item.address" class="hdty-form-item">
                  <div
                    v-if="item.addressAlias"
                    class="hdty-form-label"
                    :style="{ width: item.addressAlias.length * 12 + 6 + 'px' }"
                  >
                    {{ item.addressAlias }}
                  </div>
                  <div
                    class="hdty-form-content"
                    :style="{
                      marginLeft: item.addressAlias
                        ? item.addressAlias.length * 12 + 6 + 'px'
                        : 0
                    }"
                  >
                    {{ item.address }}
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="item.items && item.items.length > 0"
              class="hdty-search-perfect"
            >
              <div
                v-for="(customItem, index) in item.items"
                :key="index"
                class="hdty-form-item"
              >
                <div
                  v-if="item.itemsAlias && item.itemsAlias[index]"
                  class="hdty-form-label"
                  :style="{
                    width: item.itemsAlias[index].length * 12 + 6 + 'px'
                  }"
                >
                  {{ item.itemsAlias[index] }}
                </div>
                <div
                  class="hdty-form-content"
                  :style="{
                    marginLeft:
                      item.itemsAlias && item.itemsAlias[index]
                        ? item.itemsAlias[index].length * 12 + 6 + 'px'
                        : 0
                  }"
                >
                  {{ customItem }}
                </div>
              </div>
            </div>
            <div
              v-if="item.html"
              v-html="item.html"
              class="hdty-result-extra"
            ></div>
          </div>
          <el-pagination
            background
            layout="pager"
            :pager-count="5"
            :current-page="keywordSearchPage.current"
            :page-size="keywordSearchPage.size"
            :total="keywordSearchPage.total"
            @current-change="handleKeywordSearchCurrentChange"
          >
          </el-pagination>
        </div>
        <div
          v-else-if="cityListSearchResult.length > 0"
          v-show="keywordSearchVisible"
          class="hdty-list hdty-city-list"
          :class="customCityListSearchResultPanelClass"
        >
          <div
            v-if="activeKeywordFilterEnabled && !currentRouteSearchBoxOccupy"
            class="hdty-search-filter hdty-scroll hdty-scroll-x"
          >
            <div class="hdty-filter-wrapper">
              <div class="hdty-filter">
                <div
                  v-for="(item, index) in activeKeywordFilters"
                  :key="index"
                  class="hdty-filter-item"
                >
                  <hd-component-item
                    :type="item.type"
                    v-model="keywordSearchFilterData[item.field]"
                    :label.sync="
                      keywordSearchExtendData[
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
                    :show-all-button="item.showAllButton"
                    :show-refresh-button="item.showRefreshButton"
                    :show-all-levels="item.showAllLevels"
                    :show-code="item.showCode"
                    :show-full-address="item.showFullAddress"
                    :lazy="item.lazy"
                    :accordion="item.accordion"
                    :filterable="item.filterable"
                    :clearable="item.clearable"
                    :readonly="item.readonly"
                    :disabled="item.disabled"
                    :adaptive="
                      typeof item.adaptive === 'boolean' ? item.adaptive : true
                    "
                    :underline="item.underline"
                  >
                  </hd-component-item>
                </div>
              </div>
            </div>
          </div>
          <div
            v-for="item in cityListSearchResult"
            class="hdty-list-item"
            @click.stop="handleCityListSearchItem(item)"
          >
            <div class="hdty-form-label">约{{ item.num }}个结果</div>
            <div class="hdty-form-content">
              {{ item.department }}
            </div>
          </div>
        </div>
        <div v-else v-show="keywordSearchVisible" class="hdty-search-tips">
          <div
            v-if="activeKeywordFilterEnabled && !currentRouteSearchBoxOccupy"
            class="hdty-search-filter hdty-scroll hdty-scroll-x"
          >
            <div class="hdty-filter-wrapper">
              <div class="hdty-filter">
                <div
                  v-for="(item, index) in activeKeywordFilters"
                  :key="index"
                  class="hdty-filter-item"
                >
                  <hd-component-item
                    :type="item.type"
                    v-model="keywordSearchFilterData[item.field]"
                    :label.sync="
                      keywordSearchExtendData[
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
                    :show-all-button="item.showAllButton"
                    :show-refresh-button="item.showRefreshButton"
                    :show-all-levels="item.showAllLevels"
                    :show-code="item.showCode"
                    :show-full-address="item.showFullAddress"
                    :lazy="item.lazy"
                    :accordion="item.accordion"
                    :filterable="item.filterable"
                    :clearable="item.clearable"
                    :readonly="item.readonly"
                    :disabled="item.disabled"
                    :adaptive="
                      typeof item.adaptive === 'boolean' ? item.adaptive : true
                    "
                    :underline="item.underline"
                  >
                  </hd-component-item>
                </div>
              </div>
            </div>
          </div>
          <p class="hdty-tips">没有搜索到相关结果</p>
        </div>
      </div>
      <div
        v-if="
          currentKeywordSearchResultItemChecked &&
          !$utilStr.isEmpty(currentKeywordSearchResultItem)
        "
        class="hdty-map-search-intro"
        :style="[activeKeywordSearchIntroOffsetStyle]"
      >
        <div
          class="hdty-search-back"
          :title="'点击返回“' + searchKeyword + '”的搜索结果'"
          @click="handleKeywordSearchResult"
        >
          <i class="icon-return"></i>
          返回“{{ searchKeyword }}”的搜索结果
        </div>
        <div class="hdty-search-card">
          <div class="hdty-form-label">
            <el-button
              icon="icon-arrow-down"
              round
              @click="handleRouteSearchToEnd"
            >
              &thinsp;到这去&ensp;&thinsp;
            </el-button>
            <el-button
              icon="icon-arrow-up"
              round
              @click="handleRouteSearchFromStart"
            >
              从这出发
            </el-button>
          </div>
          <div class="hdty-form-content">
            <h5>{{ currentKeywordSearchResultItem.business }}</h5>
            <div
              v-html="currentKeywordSearchResultItem.summary"
              class="hdty-content"
            ></div>
          </div>
        </div>
      </div>
      <div
        v-if="currentRouteSearchBoxOccupy"
        class="hdty-map-search-route"
        :style="[activeKeywordSearchRouteOffsetStyle]"
      >
        <div class="hdty-search-route-plan">
          <div class="hdty-search-route-tool">
            <div class="hdty-tab-header">
              <a href="javascript:;" class="hdty-tab-item is-active">
                <i class="icon-car"></i>
                驾车
              </a>
            </div>
            <div
              title="关闭路线"
              class="hdty-search-route-close"
              @click="handleRouteSearchClose"
            >
              <i class="icon-cancel"></i>
            </div>
          </div>
          <div class="hdty-search-route-control">
            <div
              title="切换起终点"
              class="hdty-search-route-revert"
              @click="handleRouteSearchRevert"
            >
              <i class="icon-sort"></i>
            </div>
            <div class="hdty-control">
              <el-input
                ref="startSearchRef"
                :id="startKeywordSearchId"
                v-model="startSearchKeyword"
                placeholder="输入起点或在图区上选点"
                prefix-icon="icon-ring"
                clearable
                class="hdty-search-route-start"
                @focus="handleStartKeywordSearchFocus"
                @blur="handleStartKeywordSearchBlur"
                @input="handleStartKeywordSearchInput"
                @clear="handleStartKeywordSearchClear"
                @keyup.enter.native="handleStartKeywordSearch"
              >
              </el-input>
              <el-input
                ref="endSearchRef"
                :id="endKeywordSearchId"
                v-model="endSearchKeyword"
                placeholder="输入终点或在图区上选点"
                prefix-icon="icon-ring"
                clearable
                class="hdty-search-route-end"
                @focus="handleEndKeywordSearchFocus"
                @blur="handleEndKeywordSearchBlur"
                @input="handleEndKeywordSearchInput"
                @clear="handleEndKeywordSearchClear"
                @keyup.enter.native="handleEndKeywordSearch"
              >
              </el-input>
            </div>
          </div>
        </div>
        <div
          v-if="!$utilStr.isEmpty(currentRouteMileage)"
          class="hdty-search-route-mileage"
        >
          <div class="hdty-mileage">
            {{ currentRouteMileage.duration }}&ensp;|&ensp;{{
              currentRouteMileage.distance
            }}
          </div>
        </div>
      </div>
      <slot v-if="map"></slot>
    </div>
  </div>
</template>

<script>
import MP from "./src/map";
import Fullscreen from "screenfull";
import iconSeriesA from "./src/icon/icon-series-a.svg";
import iconSeriesB from "./src/icon/icon-series-b.svg";
import iconSeriesC from "./src/icon/icon-series-c.svg";
import iconSeriesD from "./src/icon/icon-series-d.svg";
import iconSeriesE from "./src/icon/icon-series-e.svg";
import iconSeriesF from "./src/icon/icon-series-f.svg";
import iconCar from "./src/icon/icon-car.png";
import utilConvert from "./src/util-convert";
import utilGeo from "./src/util-geo";
import cityCenter from "./src/data/city-center";
import { hdComponent } from "@/utils/util-framework";
import {
  getPoint,
  getLocation,
  localSearch,
  routePlan,
  getBoundary
} from "./api";
import Vue from "vue";
Vue.prototype.$utilConvert = utilConvert;
Vue.prototype.$utilGeo = utilGeo;
export default {
  name: "index",
  provide() {
    return {
      hdMapBaidu: this
    };
  },
  mixins: [hdComponent],
  components: {
    Fullscreen
  },
  props: {
    prop: String,
    // 地图基础资源请求地址
    offlineURL: {
      type: String,
      default: appEnv.bmap_offlineURL
    },
    // 地图LBS服务请求地址
    LBSServerURL: {
      type: String,
      default: appEnv.offlineMap_LBSServerURL
    },
    // 自动定位(定位到当前城市)
    automatic: {
      type: Boolean,
      default: true
    },
    // 精确定位(定位到当前位置)
    location: {
      type: Boolean,
      default: false
    },
    // 中心点坐标
    center: {
      type: Object,
      default() {
        // 呼和浩特
        // return {
        //   lng: 111.66,
        //   lat: 40.828
        // };
        // 北京
        /*return {
            lng: 116.404,
            lat: 39.915
          };*/
        // 鄂尔多斯
        return { lng: 109.789301, lat: 39.613973 };
      }
    },
    // 缩放级别
    zoom: {
      type: [Number, String],
      default: 12
    },
    // 最小缩放级别
    minZoom: {
      type: [Number, String],
      default: null
    },
    // 最大缩放级别
    maxZoom: {
      type: [Number, String],
      default: null
    },
    // 显示行政区边界
    boundary: {
      type: Boolean,
      default: false
    },
    // 行政区边界宽度
    boundaryWeight: {
      type: Number,
      default: 1
    },
    // 行政区边界样式（solid / dashed）
    boundaryStyle: {
      type: String,
      default: "solid"
    },
    // 行政区边界颜色
    boundaryColor: {
      type: [String, Array],
      default: "#006fff"
    },
    // 行政区边界填充颜色
    boundaryFillColor: {
      type: [String, Array],
      default: "#7cb6f1"
    },
    // 行政区边界描边宽度
    boundaryStrokeWeight: {
      type: Number,
      default: 2
    },
    // 行政区边界描边颜色
    boundaryStrokeColor: {
      type: String,
      default: "#006fff"
    },
    // 开启行政区边界自动视野调整
    boundaryAutoView: {
      type: Boolean,
      default: true
    },
    // 是否高亮当前选择行政区
    boundaryHighlight: {
      type: Boolean,
      default: false
    },
    // 行政区边界高亮颜色
    boundaryHighlightColor: {
      type: [String, Array],
      default: "#3c7fff"
    },
    // 行政区边界填充高亮颜色
    boundaryFillHighlightColor: {
      type: [String, Array],
      default: "#3c7fff"
    },
    // 当前选择的行政区名称
    boundaryCurrentName: {
      type: String,
      default: ""
    },
    // 是否显示行政区边界遮罩层
    boundaryModal: {
      type: Boolean,
      default: false
    },
    // 行政区边界遮罩层颜色
    boundaryModalColor: {
      type: String,
      default: "#daeafa"
    },
    // 行政区边界遮罩层是否鼠标移入消失
    boundaryModalHoverHide: {
      type: Boolean,
      default: false
    },
    // 显示行政区边界城市中心点
    showBoundaryCity: {
      type: Boolean,
      default: false
    },
    // 显示边界的行政区名称
    boundaryName: {
      type: String,
      default() {
        return !Array.isArray(this.$utilLogin.getUserRegionName())
          ? this.$utilLogin.getUserRegionName()
          : this.$utilLogin.getUserRegionName()[0];
      }
    },
    // 显示边界的行政区层级（省级-1、市级-2、区/县-3）（支持数组设置多个层级，如[1, 2]）
    boundaryKind: {
      type: [Number, String],
      default() {
        return !Array.isArray(this.$utilLogin.getUserRegionLevel())
          ? this.$utilLogin.getUserRegionLevel()
          : this.$utilLogin.getUserRegionLevel()[0];
      }
    },
    // 开启行政区边界数据自定义请求
    enableBoundaryApi: {
      type: Boolean,
      default: false
    },
    // 行政区边界数据自定义请求接口
    boundaryApi: {
      type: Function,
      default: getBoundary
    },
    // 行政区边界数据自定义请求参数
    boundaryParams: {
      type: Object,
      default: null
    },
    // 显示自定义图层瓦片
    tileLayer: {
      type: Boolean,
      default: false
    },
    // 自定义图层服务规范（WMS / WMTS / TMS）
    tileLayerService: {
      type: String,
      default: "WMS"
    },
    // 自定义图层加载范围数据是否为WGS84坐标系（EPSG:4326），反之为墨卡托投影（EPSG:3857）
    tileLayerCrsIsWgs84: {
      type: Boolean,
      default: false
    },
    // 自定义图层缩放时是否使用跨图层的瓦片进行平滑切换（如果非透明图层，可以设为true，如果影响透明图层的展示效果，可以设为false）
    tileLayerContinuous: {
      type: Boolean,
      default: false
    },
    // 点坐标
    markers: {
      type: Array,
      default() {
        /*示例：
          [
            {
              lng: 0,  // 标注点经度
              lat: 0,  // 标注点纬度
              icon: 'b1', // 标注点图标(支持b1~b30/c1~c30/图片路径)
              count: 0,  // 标注点权重值
              title: '文字提示',  // 标注点文字提示
              label: '文本标注',  // 标注点文本标注（支持HTML内容）
              labelColor: 'default',  // 标注点文本标注颜色（default / auto / 色值）
              labelTrigger: 'always',  // 标注点文本标注触发方式（always / hover）
              popover: '',  // 标注点信息窗口（支持HTML内容）
              popoverClass: '',  // 标注点信息窗口自定义类名
              dragging: false,  // 标注点是否允许拖拽
              clustering: true, // 标注点是否允许聚合（开启点聚合时生效，默认为true）
              onopen: '', // 标注点信息窗口打开事件回调方法名称
              onclose: '', // 标注点信息窗口关闭事件回调方法名称
              onclick: '回调方法名称',  // 标注点点击事件回调方法名称
              ondblclick: '回调方法名称',  // 标注点双击事件回调方法名称
              contextmenu: ['菜单名称'],  // 标注点右键点击显示菜单名称
              oncontextmenu: ['回调方法名称'], // 标注点右键菜单点击事件回调方法名称
              iconOptions: {  // 标注点图标配置项
                x: 0,  // 标注点图标锚点水平方向的偏移值
                y: 0,  // 标注点图标锚点垂直方向的偏移值
                width: 0,  // 标注点图标宽度
                height: 0,  // 标注点图标高度
                imageX: 0,  // 标注点图标所用图片起始点水平方向的偏移值
                imageY: 0,  // 标注点图标所用图片起始点垂直方向的偏移值
                imageWidth: 0,  //  标注点图标所用图片宽度
                imageHeight: 0  // 标注点图标所用图片高度
              }
            }
          ]*/
        return [];
      }
    },
    // 开启点聚合
    clusterer: {
      type: Boolean,
      default: true
    },
    // 开启点自动视野调整
    markerAutoView: {
      type: Boolean,
      default: false
    },
    // 开启点连线
    connection: {
      type: Boolean,
      default: false
    },
    // 开启点连线方向箭头
    connectionSequence: {
      type: Boolean,
      default: false
    },
    // 开启点连线轨迹运动
    connectionPlay: {
      type: Boolean,
      default: false
    },
    // 点连线轨迹运动配置项
    connectionPlayOptions: {
      type: Object,
      default() {
        return {
          // 自动播放
          auto: true,
          // 循环播放
          loop: true,
          // 移动速度，单位米/秒
          speed: 4500,
          // 标注图标，设置b1~b30/c1~c30或图片URL
          icon: "d4",
          // 标注随道路走向旋转
          rotation: false,
          // 默认显示的信息窗口HTML内容
          html: "",
          // 轨迹运动中显示的特殊点
          /*示例：
            [
              {
                lng: 0,  // 标注点经度
                lat: 0,  // 标注点纬度
                html: '',  // 信息窗口HTML内容
                pauseTime: 2  // 停留时间（默认为2s）
              }
            ]*/
          landmark: [],
          // 标注图标配置项
          /*示例：
            {
              x: 0,  // 标注点图标锚点水平方向的偏移值
              y: 0,  // 标注点图标锚点垂直方向的偏移值
              width: 0,  // 标注点图标宽度
              height: 0,  // 标注点图标高度
              imageX: 0,  // 标注点图标所用图片起始点水平方向的偏移值
              imageY: 0,  // 标注点图标所用图片起始点垂直方向的偏移值
              imageWidth: 0,  //  标注点图标所用图片宽度
              imageHeight: 0  // 标注点图标所用图片高度
            }*/
          iconOptions: {}
        };
      }
    },
    // 开启热力图
    heatmap: {
      type: Boolean,
      default: false
    },
    // 热力图权重的最大值
    maxWeight: {
      type: [Number, String],
      default: null
    },
    // 热力图的渐变区间
    /*示例：
      {
        0: 'rgb(0,0,0)',  // black
        .45: 'rgb(0,0,255)',  // blue
        .55: 'rgb(0,255,255)',  // cyan
        .65: 'rgb(0,255,0)',  // lime
        .95: 'rgb(255,255,0)',  // yellow
        1: 'rgb(255,0,0)'  // red
      }*/
    gradient: {
      type: Object,
      default: null
    },
    // 开启热力图时显示标注点
    showMarker: {
      type: Boolean,
      default: false
    },
    // 折线颜色
    polylineColor: {
      type: Array,
      default() {
        return [];
      }
    },
    // 折线路径坐标
    polylinePath: {
      type: Array,
      default() {
        /*示例：
          [
           {
             lng: 0,  // 经度
             lat: 0  // 纬度
           }
          ]*/
        return [];
      }
    },
    // 开启折线可编辑
    polylineEditing: {
      type: [Boolean, Array],
      default: false
    },
    // 折线可编辑触发方式（always / click）
    polylineEditingTrigger: {
      type: String,
      default: "always"
    },
    // 开启折线自动视野调整
    polylineAutoView: {
      type: Boolean,
      default: false
    },
    // 开启折线方向箭头
    polylineSequence: {
      type: Boolean,
      default: false
    },
    // 开启折线路径轨迹运动
    polylinePlay: {
      type: Boolean,
      default: false
    },
    // 折线路径轨迹运动配置项
    polylinePlayOptions: {
      type: Object,
      default() {
        return {
          // 自动播放
          auto: true,
          // 循环播放
          loop: true,
          // 移动速度，单位米/秒
          speed: 4500,
          // 标注图标，设置b1~b30/c1~c30或图片URL
          icon: "d4",
          // 标注随道路走向旋转
          rotation: false,
          // 默认显示的信息窗口HTML内容
          html: "",
          // 轨迹运动中显示的特殊点
          /*示例：
            [
              {
                lng: 0,  // 标注点经度
                lat: 0,  // 标注点纬度
                html: '',  // 信息窗口HTML内容
                pauseTime: 2  // 停留时间（默认为2s）
              }
            ]*/
          landmark: [],
          // 标注图标配置项
          /*示例：
            {
              x: 0,  // 标注点图标锚点水平方向的偏移值
              y: 0,  // 标注点图标锚点垂直方向的偏移值
              width: 0,  // 标注点图标宽度
              height: 0,  // 标注点图标高度
              imageX: 0,  // 标注点图标所用图片起始点水平方向的偏移值
              imageY: 0,  // 标注点图标所用图片起始点垂直方向的偏移值
              imageWidth: 0,  //  标注点图标所用图片宽度
              imageHeight: 0  // 标注点图标所用图片高度
            }*/
          iconOptions: {}
        };
      }
    },
    // 圆颜色
    circleColor: {
      type: Array,
      default() {
        return [];
      }
    },
    // 圆标签（支持HTML内容）
    circleLabel: {
      type: Array,
      default() {
        return [];
      }
    },
    // 圆标签触发方式（always / hover）
    circleLabelTrigger: {
      type: [String, Array],
      default: "always"
    },
    // 圆信息窗口（支持HTML内容）
    circlePopover: {
      type: Array,
      default() {
        return [];
      }
    },
    // 圆路径坐标
    circlePath: {
      type: Array,
      default() {
        /*示例：
          [
           {
             lng: 0,  // 经度
             lat: 0,  // 纬度
             radius: 0  // 半径
           }
          ]*/
        return [];
      }
    },
    // 开启圆可编辑
    circleEditing: {
      type: [Boolean, Array],
      default: false
    },
    // 圆可编辑触发方式（always / click）
    circleEditingTrigger: {
      type: String,
      default: "always"
    },
    // 开启圆自动视野调整
    circleAutoView: {
      type: Boolean,
      default: false
    },
    // 多边形颜色
    polygonColor: {
      type: Array,
      default() {
        return [];
      }
    },
    // 多边形标签（支持HTML内容）
    polygonLabel: {
      type: Array,
      default() {
        return [];
      }
    },
    // 多边形标签触发方式（always / hover）
    polygonLabelTrigger: {
      type: [String, Array],
      default: "always"
    },
    // 多边形信息窗口（支持HTML内容）
    polygonPopover: {
      type: Array,
      default() {
        return [];
      }
    },
    // 多边形路径坐标
    polygonPath: {
      type: Array,
      default() {
        /*示例：
          [
           {
             lng: 0,  // 经度
             lat: 0  // 纬度
           }
          ]*/
        return [];
      }
    },
    // 开启多边形可编辑
    polygonEditing: {
      type: [Boolean, Array],
      default: false
    },
    // 多边形可编辑触发方式（always / click）
    polygonEditingTrigger: {
      type: String,
      default: "always"
    },
    // 开启多边形自动视野调整
    polygonAutoView: {
      type: Boolean,
      default: false
    },
    // 驾车路径规划坐标
    drivingRoutePath: {
      type: Object,
      default() {
        /*示例：
          {
            start: {
              lng: 0,  // 经度
              lat: 0  // 纬度
            },
            end: {
              lng: 0,  // 经度
              lat: 0  // 纬度
            },
            ways: [
              {
                lng: 0,  // 经度
                lat: 0  // 纬度
              }
            ]
          }*/
        return {};
      }
    },
    // 开启驾车路径轨迹运动
    drivingRoutePlay: {
      type: Boolean,
      default: false
    },
    // 驾车路径轨迹运动配置项
    drivingRoutePlayOptions: {
      type: Object,
      default() {
        return {
          // 自动播放
          auto: true,
          // 循环播放
          loop: true,
          // 移动速度，单位米/秒
          speed: 4500,
          // 标注图标，设置b1~b30/c1~c30或图片URL
          icon: "",
          // 标注随道路走向旋转
          rotation: true,
          // 默认显示的信息窗口HTML内容
          html: "",
          // 轨迹运动中显示的特殊点
          /*示例：
            [
              {
                lng: 0,  // 标注点经度
                lat: 0,  // 标注点纬度
                html: '',  // 信息窗口HTML内容
                pauseTime: 2  // 停留时间（默认为2s）
              }
            ]*/
          landmark: [],
          // 标注图标配置项
          /*示例：
            {
              x: 0,  // 标注点图标锚点水平方向的偏移值
              y: 0,  // 标注点图标锚点垂直方向的偏移值
              width: 0,  // 标注点图标宽度
              height: 0,  // 标注点图标高度
              imageX: 0,  // 标注点图标所用图片起始点水平方向的偏移值
              imageY: 0,  // 标注点图标所用图片起始点垂直方向的偏移值
              imageWidth: 0,  //  标注点图标所用图片宽度
              imageHeight: 0  // 标注点图标所用图片高度
            }*/
          iconOptions: {}
        };
      }
    },
    // 标注图标(支持b1~b30/c1~c30/图片路径)
    icon: {
      type: String,
      default: ""
    },
    // 标注图标配置项
    iconOptions: {
      type: Object,
      default() {
        /*示例：
          {
            x: 0,  // 标注点图标锚点水平方向的偏移值
            y: 0,  // 标注点图标锚点垂直方向的偏移值
            width: 0,  // 标注点图标宽度
            height: 0,  // 标注点图标高度
            imageX: 0,  // 标注点图标所用图片起始点水平方向的偏移值
            imageY: 0,  // 标注点图标所用图片起始点垂直方向的偏移值
            imageWidth: 0,  //  标注点图标所用图片宽度
            imageHeight: 0  // 标注点图标所用图片高度
          }*/
        return {};
      }
    },
    // 开启点绘制
    marker: {
      type: Boolean,
      default: false
    },
    // 开启折线绘制
    polyline: {
      type: Boolean,
      default: false
    },
    // 开启圆绘制
    circle: {
      type: Boolean,
      default: false
    },
    // 开启多边形绘制
    polygon: {
      type: Boolean,
      default: false
    },
    // 默认开启的绘制模式（drag/marker/polyline/circle/polygon/rectangle）
    drawingMode: {
      type: String,
      default: ""
    },
    // 默认选择的绘制颜色
    drawingColor: {
      type: String,
      default: "#ff0000"
    },
    // 开启绘制时线/面/圆可编辑
    drawingCanEdit: {
      type: Boolean,
      default: true
    },
    // 显示绘制工具
    drawingTool: {
      type: Boolean,
      default: true
    },
    // 绘制工具显示位置（top-left / top-right）
    drawingToolPlacement: {
      type: String,
      default: "top-right"
    },
    // 绘制工具水平方向偏移量
    drawingToolOffsetWidth: {
      type: Number,
      default: null
    },
    // 绘制工具垂直方向偏移量
    drawingToolOffsetHeight: {
      type: Number,
      default: null
    },
    // 开启颜色选择器
    colorPicker: {
      type: Boolean,
      default: false
    },
    // 颜色选择器显示位置（top-left / top-right）（开启绘制工具时失效）
    colorPickerPlacement: {
      type: String,
      default: "top-right"
    },
    // 颜色选择器水平方向偏移量（开启绘制工具时失效）
    colorPickerOffsetWidth: {
      type: Number,
      default: null
    },
    // 颜色选择器垂直方向偏移量（开启绘制工具时失效）
    colorPickerOffsetHeight: {
      type: Number,
      default: null
    },
    // 覆盖物绘制限制数量（0代表不限制）
    limit: {
      type: [Number, String],
      default: 0
    },
    // 点绘制限制数量（0代表不限制）
    markerLimit: {
      type: [Number, String],
      default: 0
    },
    // 折线绘制限制数量（0代表不限制）
    polylineLimit: {
      type: [Number, String],
      default: 0
    },
    // 圆绘制限制数量（0代表不限制）
    circleLimit: {
      type: [Number, String],
      default: 0
    },
    // 多边形绘制限制数量（0代表不限制）
    polygonLimit: {
      type: [Number, String],
      default: 0
    },
    // 开启关键字检索
    keywordSearch: {
      type: Boolean,
      default: true
    },
    // 开启关键字联想
    keywordAuto: {
      type: Boolean,
      default: true
    },
    // 显示关键字检索功能区
    keywordShop: {
      type: Boolean,
      default: true
    },
    // 显示关键字检索过滤器
    keywordFilter: {
      type: Boolean,
      default: false
    },
    // 关键字检索过滤功能配置项
    keywordFilterShopOptions: {
      type: Array,
      default() {
        /* 示例
          [
            {
              shop: '',  // 功能标识
              name: '',  // 名称
              keyword: '',  // 关键字
              icon: '',  // 图标
              color: '',  // 颜色
              authority: 'query',  // 权限标识（尚未完成）
              module: '',  // 模块标识（尚未完成）
              filters: [  // 过滤器
                {
                  type: '',  // 类型（input/textarea/password/factorInput/barcodeInput/numberInput/numberRangeInput/radio/buildRadio/factorRadio/borderRadio/buildBorderRadio/factorBorderRadio/buttonRadio/buildButtonRadio/factorButtonRadio/checkbox/buildCheckbox/borderCheckbox/buildBorderCheckbox/buttonCheckbox/buildButtonCheckbox/select/buildSelect/factorSelect/organSelect/regionSelect/iconSelect/tableSelect/cascader/buildCascader/yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker/pointPicker/imageUpload/inputUpload/cameraUpload/jsonEditor/factorButton）
                  field: '',  // 字段名
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
            }
          ]*/
        return [
          {
            shop: "food",
            name: "找美食",
            keyword: "美食",
            icon: "icon-noodles",
            color: "#ee905b"
          },
          {
            shop: "hotel",
            name: "订酒店",
            keyword: "酒店",
            icon: "icon-building",
            color: "#a3c05e"
          },
          {
            shop: "station",
            name: "公交站",
            keyword: "公交站",
            icon: "icon-bus",
            color: "#49a6db"
          }
        ];
      }
    },
    // 自定义关键字检索
    customKeywordSearch: {
      type: Boolean,
      default: false
    },
    // 自定义关键字联想
    customKeywordAuto: {
      type: Boolean,
      default: false
    },
    // 自定义关键字检索结果
    customKeywordSearchResult: {
      type: Array,
      default() {
        /*示例：
          [
            {
              business: '',  // 名称
              tags: [],  // 标签
              tagsAlias: '',  // 标签标明
              address: '',  // 地址
              addressAlias: '',  // 地址标明
              image: '',  // 图片（要显示图片则不能配置坐标）
              items: [],  // 其他信息项
              itemsAlias: [],  // 其他信息项标明
              html: '',  // 自定义插入HTML内容
              summary: '',  // 摘要（支持HTML内容）
              lng: 0,  // 经度
              lat: 0,  // 纬度
              title: '文字提示',  // 标注点文字提示
              label: '文本标注',  // 标注点文本标注（支持HTML内容）
              labelColor: 'default',  // 标注点文本标注颜色（default / auto / 色值）
              labelTrigger: 'always',  // 标注点文本标注触发方式（always / hover）
              popover: '',  // 标注点信息窗口（支持HTML内容）
              popoverClass: '',  // 标注点信息窗口自定义类名
              dragging: false,  // 标注点是否允许拖拽
              onopen: '',  // 标注点信息窗口打开事件回调方法名称
              onclose: '',  // 标注点信息窗口关闭事件回调方法名称
              onclick: '回调方法名称',  // 标注点点击事件回调方法名称
              ondblclick: '回调方法名称',  // 标注点双击事件回调方法名称
              contextmenu: ['菜单名称'],  // 标注点右键点击显示菜单名称
              oncontextmenu: ['回调方法名称']  // 标注点右键菜单点击事件回调方法名称
            }
          ]*/
        return [];
      }
    },
    // 自定义关键字检索结果总条数
    customKeywordSearchResultTotal: {
      type: [Number, String],
      default: 0
    },
    // 自定义关键字检索结果面板类名
    customKeywordSearchResultPanelClass: {
      type: String,
      default: ""
    },
    // 自定义关键字按城市列表检索结果
    customCityListSearchResult: {
      type: Array,
      default() {
        /*示例：
          [
            {
              department: '',  // 名称（有城市名可不配置名称）
              city: '',  // 城市名（有城市名可不配置坐标，根据城市算法定位）
              num: 0,  // 数量
              lng: 0,  // 经度
              lat: 0  // 纬度
            }
          ]*/
        return [];
      }
    },
    // 自定义按城市列表检索结果面板类名
    customCityListSearchResultPanelClass: {
      type: String,
      default: ""
    },
    // 自定义关键字联想结果
    customKeywordAutoResult: {
      type: Array,
      default() {
        /*示例：
          [
            {
              business: '',  // 名称
              region: ''  // 地区
            }
          ]*/
        return [];
      }
    },
    // 自定义关键字联想结果面板类名
    customKeywordAutoResultPanelClass: {
      type: String,
      default: ""
    },
    // 关键字检索框控制条件
    keywordSearchControl: {
      type: String,
      default() {
        return this.$app.factorOptions.matchOpe.after;
      }
    },
    // 关键字检索框模糊查询类型（before / between / after）
    keywordSearchFuzzy: {
      type: String,
      default: "after"
    },
    // 关键字检索框水印
    keywordSearchPlaceholder: {
      type: String,
      default: "搜地点、查公交、找路线"
    },
    // 关键字检索框权限标识（尚未完成）
    keywordSearchAuthority: {
      type: String,
      default: ""
    },
    // 关键字检索框模块标识（尚未完成）
    keywordSearchModule: {
      type: String,
      default: ""
    },
    // 是否显示关键字检索框精确/模糊按钮
    showKeywordSearchControlButton: {
      type: Boolean,
      default: false
    },
    // 是否只读关键字检索框精确/模糊按钮
    keywordSearchControlButtonReadonly: {
      type: Boolean,
      default: false
    },
    // 是否禁用关键字检索框精确/模糊按钮
    keywordSearchControlButtonDisabled: {
      type: Boolean,
      default: false
    },
    // 开启检索前后保持地图状态
    keepKeywordSearchAlive: {
      type: Boolean,
      default: false
    },
    // 关键字检索框显示位置（top-left / top-right）
    keywordSearchPlacement: {
      type: String,
      default: "top-left"
    },
    // 关键字检索框水平方向偏移量
    keywordSearchOffsetWidth: {
      type: Number,
      default: null
    },
    // 关键字检索框垂直方向偏移量
    keywordSearchOffsetHeight: {
      type: Number,
      default: null
    },
    // 开启鼠标在地图移动时跟随显示经纬度坐标提示
    enablePointTooltip: {
      type: Boolean,
      default: false
    },
    // 开启地图区域大小变化中心点保持不变
    enableCenterFixed: {
      type: Boolean,
      default: false
    },
    // 开启地图自适应容器大小变化
    enableAutoResize: {
      type: Boolean,
      default: true
    },
    // 开启单击显示POI信息窗口
    enableMapClick: {
      type: Boolean,
      default: true
    },
    // 开启鼠标双击放大
    doubleClickZoom: {
      type: Boolean,
      default: true
    },
    // 开启鼠标滚轮缩放
    scrollWheelZoom: {
      type: Boolean,
      default: true
    },
    // 开启双指缩放地图
    pinchToZoom: {
      type: Boolean,
      default: true
    },
    // 显示左下角百度地图标志
    logo: {
      type: Boolean,
      default: false
    },
    // 显示左下角百度地图版权信息
    copyright: {
      type: Boolean,
      default: false
    },
    // 显示比例尺控件
    scale: {
      type: Boolean,
      default: true
    },
    // 显示缩放控件
    navigation: {
      type: Boolean,
      default: true
    },
    // 显示地图类型控件
    mapType: {
      type: Boolean,
      default: false
    },
    // 显示缩略图控件
    overviewMap: {
      type: Boolean,
      default: false
    },
    // 显示定位控件
    geolocation: {
      type: Boolean,
      default: true
    },
    // 显示城市列表控件
    cityList: {
      type: Boolean,
      default: false
    },
    // 显示全景控件
    panorama: {
      type: Boolean,
      default: false
    },
    // 显示全屏控件
    fullscreen: {
      type: Boolean,
      default: true
    },
    // 地图主题（default/normal/googlelite/light/grassgreen/bluish/dark/midnight）
    theme: {
      type: String,
      default: ""
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
    },
    // 打开弹框时，是否隐藏lable
    openHideLabel: {
      type: Boolean,
      default: true
    }
  },
  data() {
    // 唯一标识
    let uuid = this.$utilStr.uuid();
    return {
      // LBS服务密钥
      lbsKey: "c3d864202da56b9be0530100007f342e",
      // 是否在线地图
      online: null,
      // 地图Id
      mapId: "BMap_" + uuid,
      // 地图实例
      map: null,
      // 地图位置和层级确定完成
      centerAndZoomComplete: false,
      // 地图图块加载完成
      tilesloadComplete: false,
      // 地图初始化完成
      initComplete: false,
      // 地图初始化渲染完成
      initRenderComplete: false,
      // 定位当前城市完成
      localCityComplete: false,
      // 定位当前位置完成
      currentPositionComplete: false,
      // 地理定位完成
      geolocationComplete: false,
      // 行政区边界渲染完成
      boundaryRenderComplete: false,
      // 地图加载完成
      loadComplete: false,
      // 地理定位平移完成
      geolocationPanToComplete: false,
      // 当前默认中心点坐标
      defaultCenter: this.center,
      // 当前默认中心点坐标发生变化
      defaultCenterChanged: false,
      // 当前默认缩放级别
      defaultZoom: parseInt(this.zoom),
      // 当前默认最小缩放级别
      defaultMinZoom: parseInt(this.minZoom),
      // 最小缩放级别限制
      minZoomLimit: 3,
      // 当前默认最大缩放级别
      defaultMaxZoom: parseInt(this.maxZoom),
      // 最大缩放级别限制
      maxZoomLimit: 19,
      // 初始化中心点坐标
      initCenter: null,
      // 初始化缩放级别
      initZoom: null,
      // 当前中心点坐标
      currentCenter: null,
      // 上一次中心点坐标
      oldCenter: null,
      // 当前缩放级别
      currentZoom: null,
      // 上一次缩放级别
      oldZoom: null,
      // 登录用户信息
      user: this.$utilLogin.getUserInfo(),
      // 北京中心点配置
      beijing: {
        center: {
          // 中心点坐标
          lng: 116.404,
          lat: 39.915
        },
        zoom: 12 // 缩放级别
      },
      // 地图坐标转换类实例
      convert: null,
      // 地图区域级别范围配置
      mapRegionZoomRange: {
        country: [1, 4], // 国
        province: [5, 8], // 省
        city: [9, 12], // 市
        district: [13, 14], // 区、县
        town: [15, 16], // 乡、镇
        street: [17, 19] // 街道
      },
      // 当前是否显示行政区边界
      currentBoundary: this.boundary,
      // 当前行政区边界是否有多个层级
      currentDistrictHasMultiKind: false,
      // 当前行政区边界是否有描边
      currentBoundaryHasStroke: false,
      // 上一次选择的行政区名称
      oldBoundaryCurrentName: "",
      // 当前最大行政区边界坐标
      currentMaxBoundaryPath: "",
      // 当前行政区边界对象
      currentBoundaryTarget: [],
      // 当前行政区边界描边对象
      currentBoundaryStrokeTarget: [],
      // 当前行政区边界遮罩层对象
      currentBoundaryModalTarget: [],
      // 当前行政区边界城市中心点对象
      currentBoundaryCityTarget: [],
      // 当前行政区边界视野坐标集合
      currentBoundaryViewDataset: [],
      // 当前点坐标
      currentMarkers: this.markers,
      // 当前点对象
      currentMarkersTarget: [],
      // 点聚合实例
      markerClusterer: null,
      // 当前点聚合对象
      currentClustererTarget: [],
      // 当前标注点视野坐标集合
      currentMarkerViewDataset: [],
      // 当前点连线对象
      currentConnectionTarget: null,
      // 点连线路书实例
      connectionLuShu: null,
      // 热力图实例
      heatmapOverlay: null,
      // 当前折线颜色
      currentPolylineColor: this.polylineColor,
      // 当前折线路径坐标
      currentPolylinePath: this.polylinePath,
      // 当前折线路径坐标是否矩阵
      currentPolylineMatrix: false,
      // 当前默认可编辑折线索引（折线可编辑触发方式为'click'时使用）
      currentPolylineDefEdiIndex: null,
      // 当前折线对象
      currentPolylineTarget: [],
      // 折线路径路书实例
      polylineLuShu: [],
      // 当前折线视野坐标集合
      currentPolylineViewDataset: [],
      // 当前圆颜色
      currentCircleColor: this.circleColor,
      // 当前圆路径坐标
      currentCirclePath: this.circlePath,
      // 当前默认可编辑圆索引（圆可编辑触发方式为'click'时使用）
      currentCircleDefEdiIndex: null,
      // 当前圆标签对象
      currentCircleLabelTarget: [],
      // 当前圆对象
      currentCircleTarget: [],
      // 当前圆视野坐标集合
      currentCircleViewDataset: [],
      // 当前多边形颜色
      currentPolygonColor: this.polygonColor,
      // 当前多边形路径坐标
      currentPolygonPath: this.polygonPath,
      // 当前多边形路径坐标是否矩阵
      currentPolygonMatrix: false,
      // 当前默认可编辑多边形索引（多边形可编辑触发方式为'click'时使用）
      currentPolygonDefEdiIndex: null,
      // 当前多边形标签对象
      currentPolygonLabelTarget: [],
      // 当前多边形对象
      currentPolygonTarget: [],
      // 当前多边形视野坐标集合
      currentPolygonViewDataset: [],
      // 当前打开信息窗口实例
      currentInfoBox: null,
      // 当前驾车路径规划坐标
      currentDrivingRoutePath: this.drivingRoutePath,
      // 当前驾车路线补丁对象
      currentDrivingRouteMendTarget: [],
      // 驾车路径规划实例
      drivingRoute: null,
      // 驾车路径路书实例
      drivingRouteLuShu: null,
      // 当前驾车路径视野坐标集合
      currentDrivingRouteViewDataset: [],
      // 当前开启多边形绘制
      currentMarker: this.marker,
      // 当前开启多边形绘制
      currentPolyline: this.polyline,
      // 当前开启多边形绘制
      currentCircle: this.circle,
      // 当前开启多边形绘制
      currentPolygon: this.polygon,
      // 当前开启的绘制模式
      currentDrawingMode: this.drawingMode,
      // 当前选择的绘制颜色
      currentDrawingColor: this.drawingColor && this.drawingColor.toLowerCase(),
      // 上一次选择的绘制颜色
      oldDrawingColor: this.drawingColor && this.drawingColor.toLowerCase(),
      // 当前颜色选择器的真实宽度
      currentColorPickerWidth: 0,
      // 当前颜色选择器的真实高度
      currentColorPickerHeight: 0,
      // 当前颜色选择器的水平方向偏移量
      currentColorPickerOffsetWidth: this.colorPickerOffsetWidth,
      // 当前颜色选择器的垂直方向偏移量
      currentColorPickerOffsetHeight: this.colorPickerOffsetHeight,
      // 当前显示绘制工具
      currentDrawingTool: this.drawingTool,
      // 当前绘制工具准备完毕
      currentDrawingToolReady: false,
      // 当前绘制工具的真实宽度
      currentDrawingToolWidth: 0,
      // 当前绘制工具的真实高度
      currentDrawingToolHeight: 0,
      // 当前绘制工具的水平方向偏移量
      currentDrawingToolOffsetWidth: this.drawingToolOffsetWidth,
      // 当前绘制工具的垂直方向偏移量
      currentDrawingToolOffsetHeight: this.drawingToolOffsetHeight,
      // 绘制工具实例
      drawingManager: null,
      // 绘制工具容器元素
      drawingContainerEl: null,
      // 绘制工具面板元素
      drawingPanelEl: null,
      // 当前绘制的覆盖物
      currentOverlays: [],
      // 最近一个绘制的覆盖物
      currentOverlay: null,
      // 覆盖物绘制超出限制提示完成
      limitPrompted: false,
      // 点绘制超出限制提示完成
      markerLimitPrompted: false,
      // 折线绘制超出限制提示完成
      polylineLimitPrompted: false,
      // 圆绘制超出限制提示完成
      circleLimitPrompted: false,
      // 多边形绘制超出限制提示完成
      polygonLimitPrompted: false,
      // 关键字检索框Id
      keywordSearchId: "BMap_KeywordSearch_" + uuid,
      // 关键字检索框正在撰写中
      keywordSearchComposing: false,
      // 检索关键字
      searchKeyword: "",
      // 关键字检索范围(地图实例 / 坐标点 / 城市名称)
      keywordSearchLocation: null,
      // 关键字检索范围发生改变
      keywordSearchLocationChanged: false,
      // 关键字检索模式分界级别
      keywordSearchDivideZoom: 10,
      // 当前关键字检索模式(BMAP_STATUS_SUCCESS / BMAP_STATUS_CITY_LIST)
      currentKeywordSearchMode: -1,
      // 当前是否真实选中关键字检索功能项
      currentKeywordShopRealChecked: false,
      // 当前是否模拟选中关键字检索功能项
      currentKeywordShopMockChecked: false,
      // 当前关键字检索功能项
      currentKeywordShop: null,
      // 当前检索关键字是否使用功能项关键字
      currentSearchKeywordUseShopKeyword: false,
      // 关键字检索过滤数据
      keywordSearchFilterData: null,
      // 关键字检索过滤扩展数据
      keywordSearchExtendData: null,
      // 显示关键字检索功能区
      keywordShopVisible: false,
      // 当前是否开启关键字联想
      currentKeywordAuto: this.keywordAuto,
      // 关键字联想结果
      keywordAutoResult: [],
      // 显示关键字联想结果
      keywordAutoVisible: false,
      // 关键字检索结果
      keywordSearchResult: [],
      // 关键字按城市列表检索结果
      cityListSearchResult: [],
      // 显示关键字检索结果
      keywordSearchVisible: false,
      // 关键字检索分页选项
      keywordSearchPage: {
        current: 1,
        size: 10,
        total: 0
      },
      // 当前是否自定义关键字联想
      currentCustomKeywordAuto: this.customKeywordAuto,
      // 当前是否自定义关键字检索
      currentCustomKeywordSearch: this.customKeywordSearch,
      // 当前关键字检索框控制条件
      currentKeywordSearchControl: this.keywordSearchControl,
      // 当前选中关键字检索结果项
      currentKeywordSearchResultItem: null,
      // 当前是否选中关键字检索结果项
      currentKeywordSearchResultItemChecked: false,
      // 当前选中关键字按城市列表检索结果项
      currentCityListSearchResultItem: null,
      // 当前是否选中关键字按城市列表检索结果项
      currentCityListSearchResultItemChecked: false,
      // 当前关键字检索结果标注点覆盖物对象
      currentKeywordSearchPoiTarget: [],
      // 当前关键字检索结果标注点视野坐标集合
      currentKeywordSearchPoiViewDataset: [],
      // 起点关键字检索框Id
      startKeywordSearchId: "BMap_StartKeywordSearch_" + uuid,
      // 起点检索关键字
      startSearchKeyword: "",
      // 路线检索起点坐标
      routeSearchStartPoint: null,
      // 路线检索起点标注
      routeSearchStartMarker: null,
      // 终点关键字检索框Id
      endKeywordSearchId: "BMap_EndKeywordSearch_" + uuid,
      // 终点检索关键字
      endSearchKeyword: "",
      // 路线检索终点坐标
      routeSearchEndPoint: null,
      // 路线检索终点标注
      routeSearchEndMarker: null,
      // 当前路线检索框正在占用标识(start / end)
      currentRouteSearchBoxOccupy: "",
      // 当前路线检索框获得焦点标识(start / end)
      currentRouteSearchBoxFocus: "",
      // 当前关键字检索框准备完毕
      currentKeywordSearchReady: false,
      // 当前关键字检索框的真实宽度
      currentKeywordSearchWidth: 0,
      // 当前关键字检索框的真实高度
      currentKeywordSearchHeight: 0,
      // 当前关键字检索按钮真实宽度
      currentKeywordSearchButtonWidth: 0,
      // 当前关键字检索框的水平方向偏移量
      currentKeywordSearchOffsetWidth: this.keywordSearchOffsetWidth,
      // 当前关键字检索框的垂直方向偏移量
      currentKeywordSearchOffsetHeight: this.keywordSearchOffsetHeight,
      // 当前路线检索框的真实高度
      currentRouteSearchHeight: 0,
      // 关键字联想实例
      keywordAutoInstance: null,
      // 起点关键字联想实例
      startKeywordAutoInstance: null,
      // 终点关键字联想实例
      endKeywordAutoInstance: null,
      // 关键字检索实例
      keywordSearchInstance: null,
      // 当前路线里程信息
      currentRouteMileage: null,
      // 当前路线里程展示区域的真实高度
      currentRouteMileageHeight: 0,
      // 初始化时地图元素大小变化监听实例
      erdInit: null,
      // 绘制点和热力图时地图元素大小变化监听实例
      erdMarkerAndHeatmap: null,
      // 绘制点时地图元素大小变化监听实例
      erdMarker: null,
      // 绘制热力图时地图元素大小变化监听实例
      erdHeatmap: null,
      // 绘制折线时地图元素大小变化监听实例
      erdPolyline: null,
      // 绘制圆时地图元素大小变化监听实例
      erdCircle: null,
      // 绘制多边形时地图元素大小变化监听实例
      erdPolygon: null,
      // 比例尺控件实例
      scaleCtrl: null,
      // 缩放控件实例
      navigationCtrl: null,
      // 地图类型控件实例
      mapTypeCtrl: null,
      // 缩略图控件实例
      overviewMapCtrl: null,
      // 定位控件实例
      geolocationCtrl: null,
      // 城市列表控件实例
      cityListCtrl: null,
      // 全景控件实例
      panoramaCtrl: null,
      // 全屏控件实例
      fullscreenCtrl: null,
      // 覆盖物清理控件实例
      drawingClearCtrl: null,
      // 控件之间的中等间距长度
      ctrlSpaceMedium: 12,
      // 控件之间的小型间距长度
      ctrlSpaceSmall: 10,
      // 控件之间的迷你间距长度
      ctrlSpaceMini: 8,
      // 缩放控件的真实宽度
      navigationCtrlWidth: 62,
      // 缩放控件的真实高度
      navigationCtrlHeight: 186,
      // 地图类型控件的真实宽度
      mapTypeCtrlWidth: 75,
      // 地图类型控件的真实高度
      mapTypeCtrlHeight: 24,
      // 缩略图控件的真实宽度
      overviewMapCtrlWidth: 150,
      // 缩略图控件的真实高度
      overviewMapCtrlHeight: 150,
      // 定位控件的真实宽度
      geolocationCtrlWidth: 34,
      // 定位控件的真实高度
      geolocationCtrlHeight: 32,
      // 城市列表控件的真实宽度
      cityListCtrlWidth: 90,
      // 城市列表控件的真实高度
      cityListCtrlHeight: 24,
      // 全景控件控件的真实宽度
      panoramaCtrlWidth: 49,
      // 全景控件控件的真实高度
      panoramaCtrlHeight: 51,
      // 全屏控件的真实宽度
      fullscreenCtrlWidth: 30,
      // 全屏控件的真实高度
      fullscreenCtrlHeight: 30,
      // 当前覆盖物清理控件的真实宽度
      currentDrawingClearCtrlWidth: 0,
      // 当前覆盖物清理控件的真实高度
      currentDrawingClearCtrlHeight: 0,
      // 当前地图主题
      currentTheme: this.theme,
      // 自定义地图主题
      mapTheme: {
        // 普通地图样式
        normal: [],
        // 精简风格
        googlelite: [
          {
            featureType: "road",
            elementType: "all",
            stylers: {
              lightness: 20
            }
          },
          {
            featureType: "highway",
            elementType: "geometry",
            stylers: {
              color: "#f49935"
            }
          },
          {
            featureType: "railway",
            elementType: "all",
            stylers: {
              visibility: "off"
            }
          },
          {
            featureType: "local",
            elementType: "labels",
            stylers: {
              visibility: "off"
            }
          },
          {
            featureType: "water",
            elementType: "all",
            stylers: {
              color: "#d1e5ff"
            }
          },
          {
            featureType: "poi",
            elementType: "labels",
            stylers: {
              visibility: "off"
            }
          }
        ],
        // 清新蓝风格
        light: [
          {
            featureType: "land",
            elementType: "geometry",
            stylers: {
              color: "#e7f7fc"
            }
          },
          {
            featureType: "water",
            elementType: "all",
            stylers: {
              color: "#96b5d6"
            }
          },
          {
            featureType: "green",
            elementType: "all",
            stylers: {
              color: "#b0d3dd"
            }
          },
          {
            featureType: "highway",
            elementType: "geometry.fill",
            stylers: {
              color: "#a6cfcf"
            }
          },
          {
            featureType: "highway",
            elementType: "geometry.stroke",
            stylers: {
              color: "#7dabb3"
            }
          },
          {
            featureType: "arterial",
            elementType: "geometry.fill",
            stylers: {
              color: "#e7f7fc"
            }
          },
          {
            featureType: "arterial",
            elementType: "geometry.stroke",
            stylers: {
              color: "#b0d5d4"
            }
          },
          {
            featureType: "local",
            elementType: "labels.text.fill",
            stylers: {
              color: "#7a959a"
            }
          },
          {
            featureType: "local",
            elementType: "labels.text.stroke",
            stylers: {
              color: "#d6e4e5"
            }
          },
          {
            featureType: "arterial",
            elementType: "labels.text.fill",
            stylers: {
              color: "#374a46"
            }
          },
          {
            featureType: "highway",
            elementType: "labels.text.fill",
            stylers: {
              color: "#374a46"
            }
          },
          {
            featureType: "highway",
            elementType: "labels.text.stroke",
            stylers: {
              color: "#e9eeed"
            }
          }
        ],
        // 自然绿风格
        grassgreen: [
          {
            featureType: "water",
            elementType: "all",
            stylers: {
              color: "#72b8fe"
            }
          },
          {
            featureType: "road",
            elementType: "geometry.fill",
            stylers: {
              color: "#ffffff"
            }
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: {
              color: "#bababa"
            }
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: {
              color: "#767676"
            }
          },
          {
            featureType: "road",
            elementType: "labels.text.stroke",
            stylers: {
              color: "#ffffff"
            }
          },
          {
            featureType: "land",
            elementType: "all",
            stylers: {
              color: "#b8cb93"
            }
          }
        ],
        // 清新蓝绿风格
        bluish: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: {
              hue: "#007fff",
              saturation: 89
            }
          },
          {
            featureType: "water",
            elementType: "all",
            stylers: {
              color: "#ffffff"
            }
          }
        ],
        // 午夜风格
        dark: [
          {
            featureType: "land",
            elementType: "geometry",
            stylers: {
              color: "#212121"
            }
          },
          {
            featureType: "building",
            elementType: "geometry",
            stylers: {
              color: "#2b2b2b"
            }
          },
          {
            featureType: "highway",
            elementType: "all",
            stylers: {
              lightness: -42,
              saturation: -91
            }
          },
          {
            featureType: "arterial",
            elementType: "geometry",
            stylers: {
              lightness: -77,
              saturation: -94
            }
          },
          {
            featureType: "green",
            elementType: "geometry",
            stylers: {
              color: "#1b1b1b"
            }
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: {
              color: "#181818"
            }
          },
          {
            featureType: "subway",
            elementType: "geometry.stroke",
            stylers: {
              color: "#181818"
            }
          },
          {
            featureType: "railway",
            elementType: "geometry",
            stylers: {
              lightness: -52
            }
          },
          {
            featureType: "all",
            elementType: "labels.text.stroke",
            stylers: {
              color: "#313131"
            }
          },
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: {
              color: "#8b8787"
            }
          },
          {
            featureType: "manmade",
            elementType: "geometry",
            stylers: {
              color: "#1b1b1b"
            }
          },
          {
            featureType: "local",
            elementType: "geometry",
            stylers: {
              lightness: -75,
              saturation: -91
            }
          },
          {
            featureType: "subway",
            elementType: "geometry",
            stylers: {
              lightness: -65
            }
          },
          {
            featureType: "railway",
            elementType: "all",
            stylers: {
              lightness: -40
            }
          },
          {
            featureType: "boundary",
            elementType: "geometry",
            stylers: {
              color: "#8b8787",
              weight: "1",
              lightness: -29
            }
          }
        ],
        // 午夜蓝风格
        midnight: [
          {
            featureType: "water",
            elementType: "all",
            stylers: {
              color: "#021019"
            }
          },
          {
            featureType: "highway",
            elementType: "geometry.fill",
            stylers: {
              color: "#000000"
            }
          },
          {
            featureType: "highway",
            elementType: "geometry.stroke",
            stylers: {
              color: "#147a92"
            }
          },
          {
            featureType: "arterial",
            elementType: "geometry.fill",
            stylers: {
              color: "#000000"
            }
          },
          {
            featureType: "arterial",
            elementType: "geometry.stroke",
            stylers: {
              color: "#0b3d51"
            }
          },
          {
            featureType: "local",
            elementType: "geometry",
            stylers: {
              color: "#000000"
            }
          },
          {
            featureType: "land",
            elementType: "all",
            stylers: {
              color: "#08304b"
            }
          },
          {
            featureType: "railway",
            elementType: "geometry.fill",
            stylers: {
              color: "#000000"
            }
          },
          {
            featureType: "railway",
            elementType: "geometry.stroke",
            stylers: {
              color: "#08304b"
            }
          },
          {
            featureType: "subway",
            elementType: "geometry",
            stylers: {
              lightness: -70
            }
          },
          {
            featureType: "building",
            elementType: "geometry.fill",
            stylers: {
              color: "#000000"
            }
          },
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: {
              color: "#857f7f"
            }
          },
          {
            featureType: "all",
            elementType: "labels.text.stroke",
            stylers: {
              color: "#000000"
            }
          },
          {
            featureType: "building",
            elementType: "geometry",
            stylers: {
              color: "#022338"
            }
          },
          {
            featureType: "green",
            elementType: "geometry",
            stylers: {
              color: "#062032"
            }
          },
          {
            featureType: "boundary",
            elementType: "all",
            stylers: {
              color: "#1e1c1c"
            }
          },
          {
            featureType: "manmade",
            elementType: "geometry",
            stylers: {
              color: "#022338"
            }
          },
          {
            featureType: "poi",
            elementType: "all",
            stylers: {
              visibility: "off"
            }
          },
          {
            featureType: "all",
            elementType: "labels.icon",
            stylers: {
              visibility: "off"
            }
          },
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: {
              color: "#2da0c6",
              visibility: "on"
            }
          }
        ]
      },
      // 自定义覆盖物样式
      overlayStyle: {
        label: {
          display: "block",
          lineHeight: "16px",
          padding: "3px 6px",
          backgroundColor: "#ef5350",
          border: "none",
          borderRadius: "4px",
          textAlign: "center",
          color: "#fff",
          fontFamily: "arial, sans-serif",
          fontSize: "12px",
          transform: "translateX(-50%)"
        },
        graphicLabel: {
          display: "block",
          lineHeight: "17px",
          padding: "3px 6px",
          backgroundColor: "#ff0000",
          borderColor: "#ccc",
          borderRadius: "4px",
          textAlign: "center",
          color: "#fff",
          fontFamily: "arial, sans-serif",
          fontSize: "13px",
          transform: "translateX(-50%)"
        },
        waysLabel: {
          display: "block",
          lineHeight: "16px",
          minWidth: "16px",
          padding: "1px",
          backgroundColor: "#2b81ff",
          border: "none",
          borderRadius: "50%",
          textAlign: "center",
          color: "#fff",
          fontSize: "12px"
        },
        positionLabel: {
          display: "block",
          lineHeight: "16px",
          padding: "3px 6px",
          backgroundColor: "#2b81ff",
          border: "none",
          borderRadius: "4px",
          textAlign: "center",
          color: "#fff",
          fontFamily: "arial, sans-serif",
          fontSize: "12px",
          transform: "translateX(-50%)"
        },
        searchLabel: {
          display: "block",
          lineHeight: "17px",
          minWidth: "19px",
          padding: "1px",
          backgroundColor: "transparent",
          border: "none",
          borderRadius: "50%",
          textAlign: "center",
          color: "#fff",
          fontSize: "13px"
        },
        cityListSearchLabel: {
          display: "block",
          lineHeight: "16px",
          width: "36px",
          backgroundColor: "transparent",
          border: "none",
          borderRadius: "50%",
          textAlign: "center",
          color: "#fff",
          fontSize: "13px"
        },
        boundaryLabel: {
          display: "block",
          lineHeight: "18px",
          padding: "3px",
          backgroundColor: "transparent",
          border: "none",
          textAlign: "center",
          color: "#0a338d",
          fontFamily: "arial, sans-serif",
          fontSize: "14px",
          fontWeight: 700,
          transform: "translateX(-50%)"
        },
        boundary: {
          fillColor: "none", // 填充颜色
          fillOpacity: 0, // 填充的透明度，取值范围0 - 1
          strokeWeight: 1, // 边线的宽度，以像素为单位
          strokeStyle: "solid", // 边线的样式，solid或dashed
          strokeColor: "none", // 边线颜色
          strokeOpacity: 0, // 边线透明度，取值范围0 - 1
          enableClicking: true // 是否响应点击事件，默认为true
        },
        boundaryStroke: {
          fillColor: "none", // 填充颜色
          fillOpacity: 0, // 填充的透明度，取值范围0 - 1
          strokeWeight: 1, // 边线的宽度，以像素为单位
          strokeStyle: "solid", // 边线的样式，solid或dashed
          strokeColor: "none", // 边线颜色
          strokeOpacity: 0, // 边线透明度，取值范围0 - 1
          enableClicking: true // 是否响应点击事件，默认为true
        },
        boundaryModal: {
          fillColor: "none", // 填充颜色
          fillOpacity: 0, // 填充的透明度，取值范围0 - 1
          strokeWeight: 1, // 边线的宽度，以像素为单位
          strokeColor: "none", // 边线颜色
          strokeOpacity: 0 // 边线透明度，取值范围0 - 1
        },
        connection: {
          strokeWeight: 2, // 折线的宽度，以像素为单位
          strokeColor: "#00bd01", // 折线颜色
          strokeOpacity: 0.8 // 折线的透明度，取值范围0 - 1
        },
        route: {
          strokeWeight: 6, // 折线的宽度，以像素为单位
          strokeColor: "#00bd01", // 折线颜色
          strokeOpacity: 1 // 折线的透明度，取值范围0 - 1
        },
        polyline: {
          strokeWeight: 2, // 折线的宽度，以像素为单位
          strokeColor: "#0000ff", // 折线颜色
          strokeOpacity: 0.5, // 折线的透明度，取值范围0 - 1
          enableEditing: false, // 是否启用线编辑，默认为false
          enableClicking: true // 是否响应点击事件，默认为true
        },
        graphic: {
          fillColor: "#ff0000", // 填充颜色
          fillOpacity: 0.3, // 填充的透明度，取值范围0 - 1
          strokeWeight: 2, // 边线的宽度，以像素为单位
          strokeStyle: "solid", // 边线的样式，solid或dashed
          strokeColor: "#ff0000", // 边线颜色
          strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1
          enableEditing: false, // 是否启用线编辑，默认为false
          enableClicking: true // 是否响应点击事件，默认为true
        },
        boundaryFillOpacity: {
          level1: 0.6,
          level2: 0.4,
          level3: 0.2,
          level4: 0.1,
          level5: 0.05
        },
        graphicFillOpacity: {
          level1: 0.35,
          level2: 0.25,
          level3: 0.15,
          level4: 0.1,
          level5: 0.05
        }
      },
      // 自定义地图图标名称前缀
      iconPrefix: "icon_",
      // 自定义地图图标默认尺寸配置
      iconSizeOptions: {
        aSeries: {
          x: 13,
          y: 40,
          width: 26,
          height: 42
        },
        bSeries: {
          x: 13,
          y: 40,
          width: 26,
          height: 42
        },
        cSeries: {
          x: 13,
          y: 21,
          width: 26,
          height: 42
        },
        dSeries: {
          x: 18,
          y: 40,
          width: 36,
          height: 42
        },
        eSeries: {
          x: 13,
          y: 40,
          width: 26,
          height: 42
        },
        fSeries: {
          x: 12,
          y: 44,
          width: 36,
          height: 46
        },
        car: {
          x: 27,
          y: 13,
          width: 52,
          height: 26
        },
        other: {
          x: 13,
          y: 40,
          width: 26,
          height: 42
        },
        null: {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        }
      },
      // 自定义地图图标默认颜色配置
      iconColorOptions: {
        default: "#ed2d2d",
        a101: "#e62520",
        a102: "#e62520",
        a103: "#e62520",
        a104: "#e62520",
        a105: "#e62520",
        a106: "#e62520",
        a107: "#e62520",
        a108: "#e62520",
        a109: "#e62520",
        a110: "#e62520",
        a111: "#e62520",
        a112: "#e62520",
        a113: "#e62520",
        a114: "#e62520",
        a115: "#e62520",
        a116: "#e62520",
        a117: "#e62520",
        a118: "#e62520",
        a119: "#e62520",
        a120: "#e62520",
        a201: "#2b81ff",
        a202: "#2b81ff",
        a203: "#2b81ff",
        a204: "#2b81ff",
        a205: "#2b81ff",
        a206: "#2b81ff",
        a207: "#2b81ff",
        a208: "#2b81ff",
        a209: "#2b81ff",
        a210: "#2b81ff",
        a211: "#2b81ff",
        a212: "#2b81ff",
        a213: "#2b81ff",
        a214: "#2b81ff",
        a215: "#2b81ff",
        a216: "#2b81ff",
        a217: "#2b81ff",
        a218: "#2b81ff",
        a219: "#2b81ff",
        a220: "#2b81ff",
        b1: "#e62520",
        b2: "#56b032",
        b3: "#ff8500",
        b4: "#62b500",
        b5: "#f54336",
        b6: "#2b81ff",
        b7: "#fb5b53",
        b8: "#4fca77",
        b9: "#ff851a",
        b10: "#0fb579",
        b11: "#2ea4a0",
        b12: "#586984",
        b13: "#ba247f",
        b14: "#e95517",
        b15: "#f90b0b",
        b16: "#ba247f",
        b17: "#e95517",
        b18: "#2ea4a0",
        b19: "#586984",
        b20: "#3795e2",
        b21: "#165d9c",
        b22: "#4b5cc4",
        b23: "#ed5564",
        c1: "#1095ff",
        d1: "#e34530",
        d2: "#56b032",
        d3: "#2b81ff",
        d4: "#e62520",
        d5: "#56b032",
        d6: "#2b81ff",
        d7: "#e62520",
        d8: "#56b032",
        d9: "#2b81ff",
        d10: "#e62520",
        d11: "#56b032",
        d12: "#2b81ff",
        d13: "#e62520",
        d14: "#56b032",
        d15: "#2b81ff",
        e1: "#dc3022",
        e2: "#e2771e",
        e3: "#517684",
        e4: "#4a72cc",
        e5: "#3981b7",
        e6: "#057749",
        e7: "#2b3da5",
        e8: "#d1b618",
        e9: "#3d892b",
        e10: "#e95517",
        e11: "#0b511c",
        e12: "#b28a24",
        e13: "#32aace",
        e14: "#5d657a",
        e15: "#4b5cc4",
        e16: "#9daa26",
        e17: "#5273a7",
        e18: "#890a0a",
        e19: "#3e34c1",
        e20: "#30c4ae",
        e21: "#2ea4a0",
        e22: "#0baefd",
        e23: "#f49c1c",
        e24: "#987bc6",
        e25: "#e95517",
        e26: "#dbb100",
        e27: "#939393",
        e28: "#244642",
        e29: "#0c698e",
        e30: "#44443f",
        e31: "#4b5cc4",
        e32: "#165d9c",
        e33: "#3795e2",
        e34: "#7cbfbe",
        e35: "#725e83",
        e36: "#cca4e3",
        e37: "#768c89",
        e38: "#57004f",
        e39: "#ed5564",
        e40: "#2edfa3",
        e41: "#997d0a",
        e42: "#ff8938",
        e43: "#ba247f",
        e44: "#845a32",
        e45: "#b36d61",
        e46: "#e0b232",
        e47: "#ea6ba5",
        e48: "#6c4c93",
        e49: "#e27e5a",
        e50: "#273743",
        e51: "#890a0a",
        e52: "#86ad97",
        e53: "#32aace",
        e54: "#ada0d0",
        e55: "#890a0a",
        e56: "#35331f",
        e57: "#7679b7",
        e58: "#594f4d",
        e59: "#4c5b72",
        e60: "#e50016",
        e61: "#9cb5ad",
        e62: "#275075",
        e63: "#e50016",
        e64: "#393b56",
        e65: "#82938a",
        e66: "#0a7058",
        e67: "#38b4c1",
        e68: "#423b30",
        e69: "#d32020",
        e70: "#685757",
        e71: "#f49c1c",
        e72: "#2ba5af",
        e73: "#23af94",
        e74: "#45207a",
        e75: "#185ec4",
        e76: "#c92020",
        e77: "#725e83",
        f101: "#2b81ff",
        f102: "#2b81ff",
        f103: "#2b81ff",
        f104: "#2b81ff",
        f105: "#2b81ff",
        f106: "#2b81ff",
        f107: "#2b81ff",
        f108: "#2b81ff",
        f109: "#2b81ff",
        f110: "#2b81ff",
        f111: "#2b81ff",
        f112: "#2b81ff",
        f113: "#2b81ff",
        f114: "#2b81ff",
        f115: "#2b81ff",
        f116: "#2b81ff",
        f117: "#2b81ff",
        f118: "#2b81ff",
        f119: "#2b81ff",
        f120: "#2b81ff"
      },
      // 自定义地图图标
      mapIcon: {},
      // 热力图的默认渐变区间
      heatmapDefaultGradient: {
        0: "rgb(0,0,0)", // black
        0.45: "rgb(0,0,255)", // blue
        0.55: "rgb(0,255,255)", // cyan
        0.65: "rgb(0,255,0)", // lime
        0.95: "rgb(255,255,0)", // yellow
        1: "rgb(255,0,0)" // red
      },
      // 路书默认配置
      luShuDefaultOptions: {
        // 自动播放
        auto: true,
        // 循环播放
        loop: true,
        // 移动速度，单位米/秒
        speed: 4500,
        // 标注图标，设置b1~b30/c1~c30或图片URL
        icon: "",
        // 默认显示的信息窗口HTML内容
        html: "",
        // 轨迹运动中显示的特殊点
        landmark: [],
        // 标注图标配置项
        /*示例：
          {
            x: 0,  // 标注点图标锚点水平方向的偏移值
            y: 0,  // 标注点图标锚点垂直方向的偏移值
            width: 0,  // 标注点图标宽度
            height: 0,  // 标注点图标高度
            imageX: 0,  // 标注点图标所用图片起始点水平方向的偏移值
            imageY: 0,  // 标注点图标所用图片起始点垂直方向的偏移值
            imageWidth: 0,  //  标注点图标所用图片宽度
            imageHeight: 0  // 标注点图标所用图片高度
          }*/
        iconOptions: {}
      },
      // 缓存数据
      cacheData: {
        // 关键字检索结果
        keywordSearchResult: [],
        // 关键字按城市列表检索结果
        cityListSearchResult: [],
        // 关键字检索分页选项
        keywordSearchPage: null,
        // 关键字按城市列表检索结果视野级别
        cityListSearchResultViewZoom: null,
        // 当前选中关键字检索结果项
        currentKeywordSearchResultItem: null,
        // 当前选中关键字按城市列表检索结果项
        currentCityListSearchResultItem: null
      },
      // 平面图形样式缩放更新中
      graphicStyleZoomUpdating: false,
      // 绘制中
      drawing: false,
      // 加载中
      loading: false,
      // 加载中说明文字
      loadingText: "",
      // 搜索中
      searchLoading: false,
      // 计时器
      timer: {
        mapClick: null,
        markerClick: null
      }
    };
  },
  computed: {
    wrapperElement() {
      return this.$el;
    },
    boxElement() {
      return this.$el.querySelector(".hdty-map");
    },
    mapElement() {
      return this.$el.querySelector(".hdty-map-baidu");
    },
    activeWrapperStyle() {
      let style = {
        width: this.$utilElem.pixelsFtt(this.width),
        height: this.$utilElem.pixelsFtt(this.height)
      };
      return this.$utilStr.clearObjUndef(style);
    },
    activeColorPickerOffsetStyle() {
      if (this.colorPicker) {
        if (this.activeEnableDrawingManager) {
          if (this.drawingToolPlacement === "top-left") {
            return {
              left: this.$utilElem.pixelsFtt(
                this.currentColorPickerOffsetWidth
              ),
              right: "auto",
              top: this.$utilElem.pixelsFtt(this.currentColorPickerOffsetHeight)
            };
          } else {
            return {
              left: "auto",
              right: this.$utilElem.pixelsFtt(
                this.currentColorPickerOffsetWidth
              ),
              top: this.$utilElem.pixelsFtt(this.currentColorPickerOffsetHeight)
            };
          }
        } else {
          if (this.colorPickerPlacement === "top-left") {
            return {
              left: this.$utilElem.pixelsFtt(
                this.currentColorPickerOffsetWidth
              ),
              right: "auto",
              top: this.$utilElem.pixelsFtt(this.currentColorPickerOffsetHeight)
            };
          } else {
            return {
              left: "auto",
              right: this.$utilElem.pixelsFtt(
                this.currentColorPickerOffsetWidth
              ),
              top: this.$utilElem.pixelsFtt(this.currentColorPickerOffsetHeight)
            };
          }
        }
      }
      return null;
    },
    activeKeywordSearchOffsetStyle() {
      if (this.keywordSearch) {
        if (this.keywordSearchPlacement === "top-left") {
          return {
            left: this.$utilElem.pixelsFtt(
              this.currentKeywordSearchOffsetWidth
            ),
            right: "auto",
            top: this.$utilElem.pixelsFtt(this.currentKeywordSearchOffsetHeight)
          };
        } else {
          return {
            left: "auto",
            right: this.$utilElem.pixelsFtt(
              this.currentKeywordSearchOffsetWidth
            ),
            top: this.$utilElem.pixelsFtt(this.currentKeywordSearchOffsetHeight)
          };
        }
      }
      return null;
    },
    activeKeywordSearchShopOffsetStyle() {
      if (this.keywordSearchPlacement === "top-left") {
        return {
          left: this.$utilElem.pixelsFtt(this.currentKeywordSearchOffsetWidth),
          right: "auto",
          top: this.$utilElem.pixelsFtt(
            this.currentKeywordSearchOffsetHeight +
              this.currentKeywordSearchHeight
          )
        };
      } else {
        return {
          left: "auto",
          right: this.$utilElem.pixelsFtt(
            this.currentKeywordSearchOffsetWidth +
              this.currentKeywordSearchButtonWidth
          ),
          top: this.$utilElem.pixelsFtt(
            this.currentKeywordSearchOffsetHeight +
              this.currentKeywordSearchHeight
          )
        };
      }
    },
    activeKeywordSearchListOffsetStyle() {
      if (this.keywordSearchPlacement === "top-left") {
        return {
          left: this.$utilElem.pixelsFtt(this.currentKeywordSearchOffsetWidth),
          right: "auto",
          top: this.currentRouteSearchBoxOccupy
            ? !this.$utilStr.isEmpty(this.currentRouteMileage)
              ? this.$utilElem.pixelsFtt(
                  this.currentKeywordSearchOffsetHeight +
                    this.currentRouteSearchHeight +
                    this.currentRouteMileageHeight
                )
              : this.$utilElem.pixelsFtt(
                  this.currentKeywordSearchOffsetHeight +
                    this.currentRouteSearchHeight
                )
            : this.$utilElem.pixelsFtt(
                this.currentKeywordSearchOffsetHeight +
                  this.currentKeywordSearchHeight
              )
        };
      } else {
        return {
          left: "auto",
          right: this.$utilElem.pixelsFtt(
            this.currentKeywordSearchOffsetWidth +
              this.currentKeywordSearchButtonWidth
          ),
          top: this.currentRouteSearchBoxOccupy
            ? !this.$utilStr.isEmpty(this.currentRouteMileage)
              ? this.$utilElem.pixelsFtt(
                  this.currentKeywordSearchOffsetHeight +
                    this.currentRouteSearchHeight +
                    this.currentRouteMileageHeight
                )
              : this.$utilElem.pixelsFtt(
                  this.currentKeywordSearchOffsetHeight +
                    this.currentRouteSearchHeight
                )
            : this.$utilElem.pixelsFtt(
                this.currentKeywordSearchOffsetHeight +
                  this.currentKeywordSearchHeight
              )
        };
      }
    },
    activeKeywordSearchIntroOffsetStyle() {
      if (this.keywordSearchPlacement === "top-left") {
        return {
          left: this.$utilElem.pixelsFtt(this.currentKeywordSearchOffsetWidth),
          right: "auto",
          top: this.$utilElem.pixelsFtt(
            this.currentKeywordSearchOffsetHeight +
              this.currentKeywordSearchHeight
          )
        };
      } else {
        return {
          left: "auto",
          right: this.$utilElem.pixelsFtt(
            this.currentKeywordSearchOffsetWidth +
              this.currentKeywordSearchButtonWidth
          ),
          top: this.$utilElem.pixelsFtt(
            this.currentKeywordSearchOffsetHeight +
              this.currentKeywordSearchHeight
          )
        };
      }
    },
    activeKeywordSearchRouteOffsetStyle() {
      if (this.keywordSearchPlacement === "top-left") {
        return {
          left: this.$utilElem.pixelsFtt(this.currentKeywordSearchOffsetWidth),
          right: "auto",
          top: this.$utilElem.pixelsFtt(this.currentKeywordSearchOffsetHeight)
        };
      } else {
        return {
          left: "auto",
          right: this.$utilElem.pixelsFtt(
            this.currentKeywordSearchOffsetWidth +
              this.currentKeywordSearchButtonWidth
          ),
          top: this.$utilElem.pixelsFtt(this.currentKeywordSearchOffsetHeight)
        };
      }
    },
    activeAppTheme() {
      return this.$store.state.app.theme;
    },
    activeMinZoom() {
      let minZoom = null;
      if (
        !isNaN(this.defaultMinZoom) &&
        this.defaultMinZoom > this.minZoomLimit
      ) {
        minZoom = this.defaultMinZoom;
      } else {
        minZoom = this.minZoomLimit;
      }
      return minZoom;
    },
    activeMaxZoom() {
      let maxZoom = null;
      if (
        !isNaN(this.defaultMaxZoom) &&
        this.defaultMaxZoom < this.maxZoomLimit
      ) {
        maxZoom = this.defaultMaxZoom;
      } else {
        maxZoom = this.maxZoomLimit;
      }
      return maxZoom;
    },
    activeInitCenter() {
      let center = null;
      if (
        this.defaultCenter &&
        !isNaN(parseFloat(this.defaultCenter.lng)) &&
        !isNaN(parseFloat(this.defaultCenter.lat))
      ) {
        center = this.defaultCenter;
      } else {
        center = this.beijing.center;
      }
      return center;
    },
    activeInitZoom() {
      let zoom = null;
      if (!isNaN(this.defaultZoom)) {
        zoom = this.defaultZoom;
      } else {
        zoom = this.beijing.zoom;
      }
      return zoom;
    },
    activeOrganKind() {
      return this.getOrganKindByMapZoom(this.currentZoom);
    },
    activeCityCenter() {
      let result = [];
      result = result.concat(cityCenter.municipalities);
      cityCenter.provinces.forEach((e) => {
        result = result.concat(e.cities);
      });
      result = result.concat(cityCenter.other);
      return result;
    },
    activeBoundaryWeight() {
      let boundaryWeight = this.overlayStyle.boundary.strokeWeight;
      if (this.currentDistrictHasMultiKind) {
        if (this.boundaryWeight) {
          boundaryWeight = this.boundaryWeight;
        }
      } else {
        if (this.currentBoundaryHasStroke) {
          if (this.boundaryStrokeWeight) {
            boundaryWeight = this.boundaryStrokeWeight;
          }
        } else {
          if (this.boundaryWeight) {
            boundaryWeight = this.boundaryWeight;
          }
        }
        if (this.boundaryModal) {
          boundaryWeight = boundaryWeight * 2;
        }
      }
      return boundaryWeight;
    },
    activeBoundaryBoldWeight() {
      let boldBoundaryWeight = this.activeBoundaryWeight;
      if (boldBoundaryWeight === 1) {
        boldBoundaryWeight = boldBoundaryWeight + 1;
        if (!this.currentDistrictHasMultiKind) {
          if (this.boundaryModal) {
            boldBoundaryWeight = boldBoundaryWeight * 2;
          }
        }
      }
      return boldBoundaryWeight;
    },
    activeBoundaryDefaultStrokeWeight() {
      let strokeWeight = this.overlayStyle.boundaryStroke.strokeWeight;
      if (this.currentDistrictHasMultiKind) {
        if (this.boundaryStrokeWeight) {
          strokeWeight = this.boundaryStrokeWeight;
        }
      } else {
        if (this.currentBoundaryHasStroke) {
          if (this.boundaryStrokeWeight) {
            strokeWeight = this.boundaryStrokeWeight;
          }
        } else {
          if (this.boundaryWeight) {
            strokeWeight = this.boundaryWeight;
          }
        }
      }
      return strokeWeight;
    },
    activeBoundaryDefaultBoldStrokeWeight() {
      let boldStrokeWeight = this.activeBoundaryDefaultStrokeWeight;
      if (boldStrokeWeight === 1) {
        boldStrokeWeight = boldStrokeWeight + 1;
      }
      return boldStrokeWeight;
    },
    activeBoundaryStrokeWeight() {
      let strokeWeight = this.overlayStyle.boundaryStroke.strokeWeight;
      if (this.currentDistrictHasMultiKind) {
        if (this.boundaryStrokeWeight) {
          strokeWeight = this.boundaryStrokeWeight;
        }
      } else {
        if (this.currentBoundaryHasStroke) {
          if (this.boundaryStrokeWeight) {
            strokeWeight = this.boundaryStrokeWeight;
          }
        } else {
          if (this.boundaryWeight) {
            strokeWeight = this.boundaryWeight;
          }
        }
      }
      if (this.boundaryModal) {
        strokeWeight = strokeWeight * 2;
      }
      return strokeWeight;
    },
    activeBoundaryBoldStrokeWeight() {
      let boldStrokeWeight = this.activeBoundaryStrokeWeight;
      if (boldStrokeWeight === 1) {
        boldStrokeWeight = boldStrokeWeight + 1;
      }
      if (this.boundaryModal) {
        boldStrokeWeight = boldStrokeWeight * 2;
      }
      return boldStrokeWeight;
    },
    activeBoundaryNameAndKind() {
      return {
        boundaryName: this.boundaryName,
        boundaryKind: this.boundaryKind
      };
    },
    activeMaxWeightAndGradient() {
      return {
        maxWeight: this.maxWeight,
        gradient: this.gradient
      };
    },
    activeMaxWeight() {
      if (!this.maxWeight) {
        let weights = this.markers.map((item) => {
          return item.count;
        });
        return weights.sort((a, b) => {
          return a - b;
        })[weights.length - 1];
      }
      return this.maxWeight;
    },
    activeGradient() {
      let gradient = {};
      let currentGradient = !this.$utilStr.isEmpty(this.gradient)
        ? this.gradient
        : this.heatmapDefaultGradient;
      let k = Object.keys(currentGradient);
      let l = k.length;
      let max = k.sort((a, b) => {
        return a - b;
      })[l - 1];
      while (l--) {
        if (max > 1) {
          gradient[k[l] / this.activeMaxWeight] = currentGradient[k[l]];
        } else {
          gradient[k[l]] = currentGradient[k[l]];
        }
      }
      return gradient;
    },
    activeEnableGraphicEditing() {
      return (
        this.circleEditing.toString().includes("true") ||
        this.polygonEditing.toString().includes("true")
      );
    },
    activeEnableDrawingManager() {
      return (
        this.currentMarker ||
        this.currentPolyline ||
        this.currentCircle ||
        this.currentPolygon
      );
    },
    activeEnableDrawingMode() {
      return (
        this.activeEnableDrawingManager &&
        this.currentDrawingMode &&
        this.currentDrawingMode !== "drag"
      );
    },
    activeKeywordShopEnabled() {
      return this.keywordShop && this.activeKeywordFilterShopOptions;
    },
    activeKeywordFilterEnabled() {
      return this.keywordFilter && this.activeKeywordFilters;
    },
    activeKeywordFilterShopEnabled() {
      return (
        (this.keywordShop || this.keywordFilter) &&
        this.activeKeywordFilterShopOptions
      );
    },
    activeKeywordShopChecked() {
      return (
        this.currentKeywordShopRealChecked || this.currentKeywordShopMockChecked
      );
    },
    activeKeywordShop() {
      if (this.activeKeywordShopChecked) {
        return this.currentKeywordShop;
      }
      return null;
    },
    activeKeywordDefaultShop() {
      if (this.activeKeywordFilterShopEnabled) {
        return this.activeKeywordFilterShopOptions[0].shop;
      }
      return null;
    },
    activeKeywordFilters() {
      if (this.activeKeywordFilterShopOptions) {
        if (this.activeKeywordShopChecked) {
          let filterShop = this.activeKeywordFilterShopOptions.find(
            (e) => e.shop === this.activeKeywordShop
          );
          if (
            filterShop &&
            filterShop.filters &&
            filterShop.filters.length > 0
          ) {
            if (Array.isArray(filterShop.filters)) {
              return filterShop.filters;
            }
          }
        }
      }
      return null;
    },
    activeKeywordFilterShopOptions() {
      if (
        this.keywordFilterShopOptions &&
        this.keywordFilterShopOptions.length > 0
      ) {
        if (Array.isArray(this.keywordFilterShopOptions)) {
          return this.keywordFilterShopOptions;
        }
      }
      return null;
    },
    activeEnableAutoView() {
      return (
        (this.boundaryAutoView && this.currentBoundaryViewDataset.length > 0) ||
        (this.markerAutoView && this.currentMarkerViewDataset.length > 0) ||
        (this.polylineAutoView && this.currentPolylineViewDataset.length > 0) ||
        (this.circleAutoView && this.currentCircleViewDataset.length > 0) ||
        (this.polygonAutoView && this.currentPolygonViewDataset.length > 0) ||
        this.currentDrivingRouteViewDataset.length > 0 ||
        this.currentKeywordSearchPoiViewDataset.length > 0
      );
    },
    activeAutoViewDataset() {
      return (this.boundaryAutoView ? this.currentBoundaryViewDataset : [])
        .concat(this.markerAutoView ? this.currentMarkerViewDataset : [])
        .concat(this.polylineAutoView ? this.currentPolylineViewDataset : [])
        .concat(this.circleAutoView ? this.currentCircleViewDataset : [])
        .concat(this.polygonAutoView ? this.currentPolygonViewDataset : [])
        .concat(this.currentDrivingRouteViewDataset)
        .concat(this.currentKeywordSearchPoiViewDataset);
    },
    activeMapHasAnyOverlay() {
      return (
        this.currentMarkers.length > 0 ||
        this.currentPolylinePath.length > 0 ||
        this.currentCirclePath.length > 0 ||
        this.currentPolygonPath.length > 0 ||
        this.currentDrivingRoutePath.length > 0 ||
        this.keywordSearchResult.length > 0 ||
        this.cityListSearchResult.length > 0 ||
        !(!this.currentDrawingMode || this.currentDrawingMode === "drag")
      );
    },
    activeConnectionPlayOptions() {
      return {
        ...this.luShuDefaultOptions,
        icon: "d4",
        rotation: false,
        ...this.connectionPlayOptions
      };
    },
    activePolylinePlayOptions() {
      return {
        ...this.luShuDefaultOptions,
        icon: "d4",
        rotation: false,
        ...this.polylinePlayOptions
      };
    },
    activeDrivingRoutePlayOptions() {
      return {
        ...this.luShuDefaultOptions,
        rotation: true,
        ...this.drivingRoutePlayOptions
      };
    }
  },
  watch: {
    center: {
      handler(val) {
        if (val) {
          if (!this.defaultCenterChanged) {
            this.defaultCenterChanged = true;
          }
          this.defaultCenter = val;
          if (this.initRenderComplete) {
            this.setDefaultCenterAndZoom();
          }
        }
      },
      immediate: false
    },
    zoom: {
      handler(val) {
        this.defaultZoom = parseInt(val);
        if (this.initRenderComplete) {
          this.setDefaultZoom();
        }
      },
      immediate: false
    },
    minZoom: {
      handler(val) {
        this.defaultMinZoom = parseInt(val);
      },
      immediate: false
    },
    activeMinZoom: {
      handler() {
        if (this.initRenderComplete) {
          this.setMinZoom();
        }
      },
      immediate: false
    },
    maxZoom: {
      handler(val) {
        this.defaultMaxZoom = parseInt(val);
      },
      immediate: false
    },
    activeMaxZoom: {
      handler() {
        if (this.initRenderComplete) {
          this.setMaxZoom();
        }
      },
      immediate: false
    },
    boundary: {
      handler(val) {
        this.currentBoundary = val;
        if (this.initRenderComplete) {
          if (this.currentBoundary) {
            this.setBoundary();
          } else {
            this.clearBoundary();
          }
        }
      },
      immediate: false
    },
    boundaryAutoView: {
      handler(val) {
        if (this.initRenderComplete) {
          if (val) {
            this.setBestView(this.currentBoundaryViewDataset);
          }
        }
      },
      immediate: false
    },
    boundaryHighlight: {
      handler(val) {
        this.oldBoundaryCurrentName = "";
        if (this.initRenderComplete) {
          if (val) {
            this.setBoundaryHighlight();
          } else {
            this.clearBoundaryHighlight();
          }
        }
      },
      immediate: false
    },
    boundaryCurrentName: {
      handler(val, oldVal) {
        this.oldBoundaryCurrentName = oldVal;
        if (this.initRenderComplete) {
          if (this.boundaryHighlight && val) {
            this.setBoundaryCurrentName();
          } else {
            this.clearBoundaryCurrentName();
          }
        }
      },
      immediate: false
    },
    boundaryModal: {
      handler(val) {
        if (this.initRenderComplete) {
          if (val) {
            this.setBoundaryModal();
          } else {
            this.clearBoundaryModal();
          }
        }
      },
      immediate: false
    },
    boundaryModalHoverHide: {
      handler(val) {
        if (this.initRenderComplete) {
          if (val) {
            this.setBoundaryModalHoverHide();
          } else {
            this.clearBoundaryModalHoverHide();
          }
        }
      },
      immediate: false
    },
    showBoundaryCity: {
      handler(val) {
        if (this.initRenderComplete) {
          if (val) {
            this.setBoundaryCity();
          } else {
            this.clearBoundaryCity();
          }
        }
      },
      immediate: false
    },
    activeBoundaryNameAndKind: {
      handler(val) {
        if (this.initRenderComplete) {
          if (val.boundaryName) {
            if (this.currentBoundary) {
              this.setBoundary();
            }
          } else {
            this.clearBoundary();
          }
        }
      },
      immediate: false
    },
    enableBoundaryApi: {
      handler(val) {
        if (this.initRenderComplete) {
          if (val) {
            if (this.currentBoundary) {
              this.setBoundary();
            }
          } else {
            this.clearBoundary();
          }
        }
      },
      immediate: false
    },
    boundaryApi: {
      handler(val) {
        if (this.initRenderComplete) {
          if (typeof val === "function") {
            if (this.currentBoundary) {
              this.setBoundary();
            }
          } else {
            this.clearBoundary();
          }
        }
      },
      deep: true,
      immediate: false
    },
    boundaryParams: {
      handler(val) {
        if (this.initRenderComplete) {
          if (val) {
            if (this.currentBoundary) {
              this.setBoundary();
            }
          } else {
            this.clearBoundary();
          }
        }
      },
      deep: true,
      immediate: false
    },
    markers: {
      handler(val) {
        this.currentMarkers = val;
        if (this.initRenderComplete) {
          if (this.currentMarkers.length === 0 || !this.marker) {
            this.clearMarkerOverlay();
          }
          if (this.wrapperElement.scrollHeight > 0) {
            this.setMarkerAndHeatmap();
          } else {
            this.erdMarkerAndHeatmap = this.$erd;
            this.erdMarkerAndHeatmap.listenTo(
              this.wrapperElement,
              this.setMarkerAndHeatmap
            );
          }
        }
      },
      deep: true,
      immediate: false
    },
    clusterer: {
      handler() {
        if (this.initRenderComplete) {
          if (this.wrapperElement.scrollHeight > 0) {
            this.setMarker();
          } else {
            this.erdMarker = this.$erd;
            this.erdMarker.listenTo(this.wrapperElement, this.setMarker);
          }
        }
      },
      immediate: false
    },
    markerAutoView: {
      handler(val) {
        if (this.initRenderComplete) {
          if (val) {
            this.setBestView(this.currentMarkerViewDataset);
          }
        }
      },
      immediate: false
    },
    heatmap: {
      handler(val) {
        if (this.initRenderComplete) {
          if (val) {
            if (this.wrapperElement.scrollHeight > 0) {
              this.setHeatmap();
            } else {
              this.erdHeatmap = this.$erd;
              this.erdHeatmap.listenTo(this.wrapperElement, this.setHeatmap);
            }
          } else {
            this.clearHeatmap();
          }
        }
      },
      immediate: false
    },
    activeMaxWeightAndGradient: {
      handler() {
        if (this.initRenderComplete) {
          if (this.wrapperElement.scrollHeight > 0) {
            this.setHeatmap();
          } else {
            this.erdHeatmap = this.$erd;
            this.erdHeatmap.listenTo(this.wrapperElement, this.setHeatmap);
          }
        }
      },
      deep: true,
      immediate: false
    },
    showMarker: {
      handler(val) {
        if (this.initRenderComplete) {
          if (val) {
            if (this.wrapperElement.scrollHeight > 0) {
              this.setMarker();
            } else {
              this.erdMarker = this.$erd;
              this.erdMarker.listenTo(this.wrapperElement, this.setMarker);
            }
          } else {
            this.clearMarker();
          }
        }
      },
      immediate: false
    },
    polylineColor: {
      handler(val) {
        this.currentPolylineColor = val;
      },
      immediate: false
    },
    polylinePath: {
      handler(val) {
        this.currentPolylinePath = val;
        if (this.initRenderComplete) {
          if (this.currentPolylinePath.length === 0 || !this.polyline) {
            this.clearPolylineOverlay();
          }
          if (this.wrapperElement.scrollHeight > 0) {
            this.setPolyline();
          } else {
            this.erdPolyline = this.$erd;
            this.erdPolyline.listenTo(this.wrapperElement, this.setPolyline);
          }
        }
      },
      immediate: false
    },
    polylineEditing: {
      handler() {
        if (this.initRenderComplete) {
          this.setPolylineEditing();
        }
      },
      immediate: false
    },
    polylineAutoView: {
      handler(val) {
        if (this.initRenderComplete) {
          if (val) {
            this.setBestView(this.currentPolylineViewDataset);
          }
        }
      },
      immediate: false
    },
    circleColor: {
      handler(val) {
        this.currentCircleColor = val;
      },
      immediate: false
    },
    circlePath: {
      handler(val) {
        this.currentCirclePath = val;
        if (this.initRenderComplete) {
          if (this.currentCirclePath.length === 0 || !this.circle) {
            this.clearCircleOverlay();
          }
          if (this.wrapperElement.scrollHeight > 0) {
            this.setCircle();
          } else {
            this.erdCircle = this.$erd;
            this.erdCircle.listenTo(this.wrapperElement, this.setCircle);
          }
        }
      },
      immediate: false
    },
    circlePopover: {
      handler() {
        if (this.initRenderComplete) {
          this.setCirclePopover();
        }
      },
      immediate: false
    },
    circleEditing: {
      handler() {
        if (this.initRenderComplete) {
          this.setCircleEditing();
        }
      },
      immediate: false
    },
    circleAutoView: {
      handler(val) {
        if (this.initRenderComplete) {
          if (val) {
            this.setBestView(this.currentCircleViewDataset);
          }
        }
      },
      immediate: false
    },
    polygonColor: {
      handler(val) {
        this.currentPolygonColor = val;
      },
      immediate: false
    },
    polygonPath: {
      handler(val) {
        this.currentPolygonPath = val;
        if (this.initRenderComplete) {
          if (this.currentPolygonPath.length === 0 || !this.polygon) {
            this.clearPolygonOverlay();
          }
          if (this.wrapperElement.scrollHeight > 0) {
            this.setPolygon();
          } else {
            this.erdPolygon = this.$erd;
            this.erdPolygon.listenTo(this.wrapperElement, this.setPolygon);
          }
        }
      },
      immediate: false
    },
    polygonPopover: {
      handler() {
        if (this.initRenderComplete) {
          this.setPolygonPopover();
        }
      },
      immediate: false
    },
    polygonEditing: {
      handler() {
        if (this.initRenderComplete) {
          this.setPolygonEditing();
        }
      },
      immediate: false
    },
    polygonAutoView: {
      handler(val) {
        if (this.initRenderComplete) {
          if (val) {
            this.setBestView(this.currentPolygonViewDataset);
          }
        }
      },
      immediate: false
    },
    drivingRoutePath: {
      handler(val) {
        this.currentDrivingRoutePath = val;
        if (this.$utilStr.isEmpty(this.currentDrivingRoutePath)) {
          this.clearDrivingRoute();
        }
        this.setDrivingRoute();
      },
      immediate: false
    },
    marker: {
      handler(val) {
        this.currentMarker = val;
        if (this.initRenderComplete) {
          this.setDrawingManager();
        }
      },
      immediate: false
    },
    polyline: {
      handler(val) {
        this.currentPolyline = val;
        if (this.initRenderComplete) {
          this.setDrawingManager();
        }
      },
      immediate: false
    },
    circle: {
      handler(val) {
        this.currentCircle = val;
        if (this.initRenderComplete) {
          this.setDrawingManager();
        }
      },
      immediate: false
    },
    polygon: {
      handler(val) {
        this.currentPolygon = val;
        if (this.initRenderComplete) {
          this.setDrawingManager();
        }
      },
      immediate: false
    },
    drawingMode: {
      handler(val) {
        this.currentDrawingMode = val;
        if (this.initRenderComplete) {
          this.setDrawingMode();
        }
      },
      immediate: false
    },
    activeKeywordFilters: {
      handler() {
        this.setKeywordSearchFilterData();
      },
      deep: true,
      immediate: false
    },
    keywordSearchFilterData: {
      handler(val, oldVal) {
        if (val && oldVal) {
          this.clearKeywordSearchOverlays();
          this.keywordSearchPage.current = 1;
          if (!this.currentCustomKeywordSearch) {
            if (this.keywordSearchInstance) {
              this.keywordSearchInstance.clearResults();
            }
            this.poiSearch(this.searchKeyword);
          } else {
            this.currentKeywordSearchMode = this.getKeywordSearchCurrentMode();
            this.emitKeywordSearchClickEvent();
          }
        }
      },
      deep: true,
      immediate: false
    },
    customKeywordSearchResult: {
      handler(val) {
        this.keywordSearchComplete(val);
      },
      immediate: false
    },
    customCityListSearchResult: {
      handler(val) {
        this.cityListSearchComplete(val);
      },
      immediate: false
    },
    customKeywordAutoResult: {
      handler(val) {
        this.keywordAutoComplete(val);
      },
      immediate: false
    },
    theme: {
      handler(val) {
        if (!val) {
          if (
            this.activeAppTheme &&
            this.activeAppTheme.includes("ocean-blue")
          ) {
            val = "midnight";
          }
        }
        this.currentTheme = val;
      },
      immediate: true
    },
    currentTheme: {
      handler(val) {
        this.$nextTick(() => {
          if (val === "midnight") {
            this.wrapperElement.classList.remove("hdty-map-default");
            this.wrapperElement.classList.add("hdty-map-midnight");
          } else {
            this.wrapperElement.classList.remove("hdty-map-midnight");
            this.wrapperElement.classList.add("hdty-map-default");
          }
        });
      },
      immediate: true
    },
    activeAppTheme: {
      handler(val) {
        if (!this.theme) {
          if (val.includes("ocean-blue")) {
            this.currentTheme = "midnight";
          } else {
            this.currentTheme = "";
          }
          if (this.initRenderComplete) {
            this.setMapTheme();
          }
        }
      },
      immediate: false
    }
  },
  created() {
    this.initCenter = this.activeInitCenter;
    this.initZoom = this.activeInitZoom;
    this.currentCenter = this.activeInitCenter;
    this.oldCenter = this.activeInitCenter;
    this.currentZoom = this.activeInitZoom;
    this.oldZoom = this.activeInitZoom;
  },
  mounted() {
    let _this = this;
    _this.loading = true;
    _this.loadingText = "初始化地图中";
    MP.api(_this.offlineURL, _this.currentTheme)
      .then((valid) => {
        _this.online = valid;
        _this.init();
      })
      .catch((error) => {
        _this.loading = false;
        _this.loadingText = "";
        if (
          error.message &&
          error.message !== "BMap is not defined" &&
          error.message !== "Network Error" &&
          !error.message.includes("timeout of")
        ) {
          console.error(error.message);
        } else {
          _this.$message({
            showClose: true,
            customClass: "is-wrap",
            message: "初始化地图失败",
            type: "error",
            offset: 76
          });
        }
      });
  },
  destroyed() {
    this.$erd.uninstall(this.wrapperElement);
    for (let k in this.timer) {
      clearTimeout(this.timer[k]);
    }
  },
  methods: {
    // 地图初始化
    init() {
      let _this = this;
      if (_this.wrapperElement.scrollHeight > 0) {
        instantiation();
      } else {
        _this.erdInit = _this.$erd;
        _this.erdInit.listenTo(_this.wrapperElement, instantiation);
      }
      function instantiation() {
        if (_this.erdInit) {
          _this.erdInit.removeListener(_this.wrapperElement, instantiation);
          _this.erdInit = null;
        }
        // 创建Map实例
        _this.map = new BMap.Map(_this.mapId, {
          enableAutoResize: _this.enableAutoResize,
          enableMapClick: _this.enableMapClick
        });
        // 监听地图位置、缩放层级确定完成事件
        _this.map.addEventListener("load", function () {
          if (!_this.centerAndZoomComplete) {
            _this.centerAndZoomComplete = true;
            if (_this.tilesloadComplete) {
              _this.initComplete = true;
            } else {
              if (_this.initZoom <= 5) {
                _this.tilesloadComplete = true;
                _this.initComplete = true;
              }
            }
            _this.updateMapLoadComplete();
          }
        });
        // 监听地图所有图块加载完成事件
        _this.map.addEventListener("tilesloaded", function () {
          if (!_this.tilesloadComplete) {
            _this.tilesloadComplete = true;
            if (_this.centerAndZoomComplete) {
              _this.initComplete = true;
            }
            if (_this.initZoom > 5) {
              _this.updateMapLoadComplete();
            }
          }
        });
        // 设置地图主题
        if (_this.currentTheme && _this.currentTheme !== "default") {
          _this.setMapTheme();
        }
        // 设置最小级别
        _this.setMinZoom();
        // 设置最大级别
        _this.setMaxZoom();
        // 设置地图图标
        _this.setMapIcon();
        // 初始化地图，设置中心点坐标和地图级别
        if (_this.automatic) {
          let centerPt;
          if (
            _this.user &&
            !isNaN(parseFloat(_this.user.longitude)) &&
            !isNaN(parseFloat(_this.user.latitude))
          ) {
            centerPt = new BMap.Point(
              _this.user.longitude,
              _this.user.latitude
            );
          } else {
            centerPt = new BMap.Point(
              _this.initCenter.lng,
              _this.initCenter.lat
            );
          }
          _this.map.centerAndZoom(centerPt, _this.initZoom);
          _this.LocalCity();
        } else {
          if (!_this.location) {
            _this.geolocationComplete = true;
            _this.updateMapLoadComplete();
          }
          let centerPt = new BMap.Point(
            _this.initCenter.lng,
            _this.initCenter.lat
          );
          _this.map.centerAndZoom(centerPt, _this.initZoom);
        }
        // 精确定位
        if (_this.location) {
          _this.LocalCurrentPosition();
        }
        // 设置地图加载状态
        if (_this.geolocationComplete && !_this.loadComplete) {
          _this.loadingText = "正在渲染中";
        }
        // 开启地图区域大小变化中心点保持不变
        if (_this.enableCenterFixed) {
          _this.map.disableAutoResize();
          _this.$erd.listenTo(_this.wrapperElement, function () {
            let center = _this.map.getCenter();
            _this.map.checkResize();
            _this.map.setCenter(center);
          });
        }
        // 开启鼠标双击放大
        if (!_this.doubleClickZoom) {
          _this.map.disableDoubleClickZoom();
        }
        // 开启鼠标滚轮缩放
        if (_this.scrollWheelZoom) {
          _this.map.enableScrollWheelZoom();
        }
        // 开启双指缩放地图
        if (_this.pinchToZoom) {
          _this.map.enablePinchToZoom();
        } else {
          _this.map.disablePinchToZoom();
        }
        // 添加比例尺控件
        if (_this.scale) {
          let anchor = BMAP_ANCHOR_TOP_LEFT;
          let x = _this.ctrlSpaceMedium;
          let y = _this.ctrlSpaceMedium;
          if (
            _this.mapType ||
            _this.cityList ||
            (_this.keywordSearch &&
              _this.keywordSearchPlacement === "top-left") ||
            (_this.activeEnableDrawingManager &&
              _this.currentDrawingTool &&
              _this.drawingToolPlacement === "top-left")
          ) {
            anchor = BMAP_ANCHOR_BOTTOM_LEFT;
            if (_this.online && _this.geolocation)
              y += _this.geolocationCtrlHeight + _this.ctrlSpaceMedium;
          }
          _this.scaleCtrl = new BMap.ScaleControl({
            anchor: anchor,
            offset: new BMap.Size(x, y)
          });
          _this.map.addControl(_this.scaleCtrl);
        }
        // 添加缩放控件
        if (_this.navigation) {
          let anchor = BMAP_ANCHOR_BOTTOM_RIGHT;
          let x = -2;
          let y = _this.ctrlSpaceMedium;
          if (_this.overviewMap) {
            anchor = BMAP_ANCHOR_TOP_RIGHT;
            if (_this.fullscreen) {
              y += _this.fullscreenCtrlHeight + _this.ctrlSpaceMini;
            }
          } else if (_this.online && _this.panorama) {
            y += _this.panoramaCtrlHeight + _this.ctrlSpaceMedium;
          }
          _this.navigationCtrl = new BMap.NavigationControl({
            anchor: anchor,
            offset: new BMap.Size(x, y)
          });
          _this.map.addControl(_this.navigationCtrl);
        }
        // 添加地图类型控件
        if (_this.mapType) {
          _this.mapTypeCtrl = new BMap.MapTypeControl({
            mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP],
            anchor: BMAP_ANCHOR_TOP_LEFT,
            offset: new BMap.Size(_this.ctrlSpaceMedium, _this.ctrlSpaceMedium)
          });
          _this.map.addControl(_this.mapTypeCtrl);
        }
        // 添加缩略图控件
        if (_this.overviewMap) {
          _this.overviewMapCtrl = new BMap.OverviewMapControl({
            isOpen: true,
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT
          });
          _this.map.addControl(_this.overviewMapCtrl);
        }
        // 添加定位控件
        if (_this.online && _this.geolocation) {
          _this.geolocationCtrl = new BMap.GeolocationControl({
            anchor: BMAP_ANCHOR_BOTTOM_LEFT,
            offset: new BMap.Size(_this.ctrlSpaceMedium, _this.ctrlSpaceMedium)
          });
          _this.map.addControl(_this.geolocationCtrl);
        }
        // 添加城市列表控件
        if (_this.online && _this.cityList) {
          let anchor = BMAP_ANCHOR_TOP_LEFT;
          let x = _this.ctrlSpaceMedium;
          let y = _this.ctrlSpaceMedium;
          if (_this.mapType)
            x += _this.mapTypeCtrlWidth + _this.ctrlSpaceMedium;
          _this.cityListCtrl = new BMap.CityListControl({
            anchor: anchor,
            offset: new BMap.Size(x, y),
            onChangeSuccess: function (e) {
              _this.$emit("currentCityListChanged", e);
            }
          });
          _this.map.addControl(_this.cityListCtrl);
        }
        // 添加全景控件
        if (_this.online && _this.panorama) {
          let anchor = BMAP_ANCHOR_BOTTOM_RIGHT;
          let x = _this.ctrlSpaceMedium;
          let y = _this.ctrlSpaceMedium;
          if (_this.overviewMap) {
            x += _this.overviewMapCtrlWidth;
          }
          _this.panoramaCtrl = new BMap.PanoramaControl({
            anchor: anchor,
            offset: new BMap.Size(x, y)
          });
          _this.map.addControl(_this.panoramaCtrl);
        }
        // 添加全屏控件
        if (_this.fullscreen) {
          _this.createFullscreenControl();
        }
        // 设置颜色选择器
        if (_this.colorPicker) {
          _this.setColorPicker();
        }
        // 创建坐标转换类实例
        _this.convert = new utilConvert(_this.map);
        // 监听单击事件
        _this.listenMapClick();
        // 监听双击事件
        _this.listenMapDblclick();
        // 监听移动开始事件
        _this.listenMapMovestart();
        // 监听移动结束事件
        _this.listenMapMoveend();
        // 监听缩放开始事件
        _this.listenMapZoomstart();
        // 监听缩放结束事件
        _this.listenMapZoomend();
        // 监听拖拽开始事件
        _this.listenMapDragstart();
        // 监听拖拽结束事件
        _this.listenMapDragend();
        // 开启鼠标在地图移动时跟随显示经纬度坐标提示
        if (_this.enablePointTooltip && !_this.activeEnableDrawingManager) {
          _this.setPointTooltip();
        }
        MP.ct()
          .then(() => {
            _this.initRender();
          })
          .catch((error) => {
            _this.initRender();
            console.error(error);
            _this.$message({
              showClose: true,
              customClass: "is-wrap",
              message: "常量文件加载失败",
              type: "error",
              offset: 76
            });
          });
      }
    },
    // 初始化渲染图层、覆盖物
    initRender() {
      let _this = this;
      // 设置行政区边界
      if (_this.currentBoundary) {
        _this.setBoundary();
      } else {
        _this.boundaryRenderComplete = true;
        _this.updateMapLoadComplete();
      }
      // 设置自定义图层瓦片
      if (_this.tileLayer) {
        _this.setTileLayer();
      }
      // 设置点
      if (_this.currentMarkers.length > 0) {
        _this.markerClusterer = null;
        _this.setMarkerAndHeatmap();
      }
      // 设置折线
      if (_this.currentPolylinePath.length > 0) {
        _this.setPolyline();
      }
      // 设置圆
      if (_this.currentCirclePath.length > 0) {
        _this.setCircle();
      }
      // 设置多边形
      if (_this.currentPolygonPath.length > 0) {
        _this.setPolygon();
      }
      // 设置鼠标绘制工具
      if (_this.activeEnableDrawingManager) {
        _this.drawingManager = null;
        _this.setDrawingManager();
      }
      // 设置驾车路线
      if (!_this.$utilStr.isEmpty(_this.currentDrivingRoutePath)) {
        _this.drivingRoute = null;
        _this.setDrivingRoute();
      }
      // 设置关键字检索
      if (_this.keywordSearch) {
        _this.setKeywordAutoAndSearch();
      }
      // 设置地图初始化渲染完成
      if (!_this.initRenderComplete) {
        _this.initRenderComplete = true;
        _this.updateMapLoadComplete();
      }
    },
    // 设置主题
    setMapTheme() {
      if (this.online) {
        let currentStyleJson = this.mapTheme[this.currentTheme];
        if (currentStyleJson) {
          this.map.setMapStyle({ styleJson: currentStyleJson });
        } else {
          this.map.setMapStyle({ style: "normal" });
        }
      }
    },
    // 设置地图最小级别
    setMinZoom() {
      this.map.setMinZoom(this.activeMinZoom);
    },
    // 设置地图最大级别
    setMaxZoom() {
      this.map.setMaxZoom(this.activeMaxZoom);
    },
    // 设置地图图标
    setMapIcon() {
      let x = 0,
        y = 0,
        l = 16,
        t = 16;
      for (let i = 1; i <= 100; i++) {
        let row = Math.ceil(i / 20);
        let col = i % 20 !== 0 ? i % 20 : 20;
        let name = this.iconPrefix + "a" + row + this.$utilStr.digitFtt(col, 2);
        x = -(this.iconSizeOptions.aSeries.width * (col - 1));
        y = -(this.iconSizeOptions.aSeries.height * (row - 1));
        this.mapIcon[name] = new BMap.Icon(
          iconSeriesA,
          new BMap.Size(
            this.iconSizeOptions.aSeries.width,
            this.iconSizeOptions.aSeries.height
          ),
          {
            imageOffset: new BMap.Size(x, y)
          }
        );
      }
      for (let i = 1; i <= 30; i++) {
        let name = this.iconPrefix + "b" + i;
        let row = Math.ceil(i / 5);
        let col = i % 5 !== 0 ? i % 5 : 5;
        x = -(l * col + this.iconSizeOptions.bSeries.width * (col - 1));
        y = -(t * row + this.iconSizeOptions.bSeries.height * (row - 1));
        this.mapIcon[name] = new BMap.Icon(
          iconSeriesB,
          new BMap.Size(
            this.iconSizeOptions.bSeries.width,
            this.iconSizeOptions.bSeries.height
          ),
          {
            imageOffset: new BMap.Size(x, y)
          }
        );
      }
      for (let i = 1; i <= 30; i++) {
        let name = this.iconPrefix + "c" + i;
        let row = Math.ceil(i / 5);
        let col = i % 5 !== 0 ? i % 5 : 5;
        x = -(l * col + this.iconSizeOptions.cSeries.width * (col - 1));
        y = -(t * row + this.iconSizeOptions.cSeries.height * (row - 1));
        this.mapIcon[name] = new BMap.Icon(
          iconSeriesC,
          new BMap.Size(
            this.iconSizeOptions.cSeries.width,
            this.iconSizeOptions.cSeries.height
          ),
          {
            imageOffset: new BMap.Size(x, y)
          }
        );
      }
      for (let i = 1; i <= 30; i++) {
        let name = this.iconPrefix + "d" + i;
        let row = Math.ceil(i / 5);
        let col = i % 5 !== 0 ? i % 5 : 5;
        x = -(l * col + this.iconSizeOptions.dSeries.width * (col - 1));
        y = -(t * row + this.iconSizeOptions.dSeries.height * (row - 1));
        this.mapIcon[name] = new BMap.Icon(
          iconSeriesD,
          new BMap.Size(
            this.iconSizeOptions.dSeries.width,
            this.iconSizeOptions.dSeries.height
          ),
          {
            imageOffset: new BMap.Size(x, y)
          }
        );
      }
      for (let i = 1; i <= 100; i++) {
        let name = this.iconPrefix + "e" + i;
        let row = Math.ceil(i / 20);
        let col = i % 20 !== 0 ? i % 20 : 20;
        x = -(this.iconSizeOptions.eSeries.width * (col - 1));
        y = -(this.iconSizeOptions.eSeries.height * (row - 1));
        this.mapIcon[name] = new BMap.Icon(
          iconSeriesE,
          new BMap.Size(
            this.iconSizeOptions.eSeries.width,
            this.iconSizeOptions.eSeries.height
          ),
          {
            imageOffset: new BMap.Size(x, y)
          }
        );
      }
      for (let i = 1; i <= 100; i++) {
        let row = Math.ceil(i / 20);
        let col = i % 20 !== 0 ? i % 20 : 20;
        let name = this.iconPrefix + "f" + row + this.$utilStr.digitFtt(col, 2);
        x = -(this.iconSizeOptions.fSeries.width * (col - 1));
        y = -(this.iconSizeOptions.fSeries.height * (row - 1));
        this.mapIcon[name] = new BMap.Icon(
          iconSeriesF,
          new BMap.Size(
            this.iconSizeOptions.fSeries.width,
            this.iconSizeOptions.fSeries.height
          ),
          {
            imageOffset: new BMap.Size(x, y)
          }
        );
      }
      this.mapIcon.car = new BMap.Icon(
        iconCar,
        new BMap.Size(
          this.iconSizeOptions.car.width,
          this.iconSizeOptions.car.height
        ),
        {
          anchor: new BMap.Size(
            this.iconSizeOptions.car.x,
            this.iconSizeOptions.car.y
          )
        }
      );
      this.mapIcon.null = new BMap.Symbol(BMap_Symbol_SHAPE_CIRCLE, {
        scale: 0,
        strokeColor: "rgba(255,255,255,0)"
      });
      this.mapIcon.geo = new BMap.Symbol(BMap_Symbol_SHAPE_CIRCLE, {
        scale: 7, //图标缩放大小
        fillColor: "#3fb9fe", // 填充颜色
        fillOpacity: 0.8, // 填充透明度
        strokeColor: "#3a68c2", // 线填充颜色
        strokeWeight: 1, // 线宽
        strokeOpacity: 1 // 线的透明度
      });
      this.mapIcon.arrow = new BMap.Symbol(
        BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW,
        {
          scale: 0.35, // 图标缩放大小
          strokeColor: "#fff", // 设置矢量图标的线填充颜色
          strokeWeight: 1.5 // 线宽
        }
      );
    },
    // 获取地图图标
    getMapIcon(icon, iconOptions) {
      if (!this.$utilStr.isEmpty(icon)) {
        if (/^[a][0-9]*$/.test(icon)) {
          let name = this.iconPrefix + icon;
          let options = {
            ...this.iconSizeOptions.aSeries,
            ...this.$utilStr.clearObjEmpty(iconOptions)
          };
          this.mapIcon[name].setAnchor(new BMap.Size(options.x, options.y));
          this.mapIcon[name].name = name;
          this.mapIcon[name].realHeight = 34;
          return this.mapIcon[name];
        } else if (/^[b][0-9]*$/.test(icon)) {
          let name = this.iconPrefix + icon;
          let options = {
            ...this.iconSizeOptions.bSeries,
            ...this.$utilStr.clearObjEmpty(iconOptions)
          };
          this.mapIcon[name].setAnchor(new BMap.Size(options.x, options.y));
          this.mapIcon[name].name = name;
          if (/^[b][0-6]$/.test(icon)) {
            this.mapIcon[name].realHeight = 42;
          } else {
            this.mapIcon[name].realHeight = 36;
          }
          return this.mapIcon[name];
        } else if (/^[c][0-9]*$/.test(icon)) {
          let name = this.iconPrefix + icon;
          let options = {
            ...this.iconSizeOptions.cSeries,
            ...this.$utilStr.clearObjEmpty(iconOptions)
          };
          this.mapIcon[name].setAnchor(new BMap.Size(options.x, options.y));
          this.mapIcon[name].name = name;
          this.mapIcon[name].realHeight = 26;
          return this.mapIcon[name];
        } else if (/^[d][0-9]*$/.test(icon)) {
          let name = this.iconPrefix + icon;
          let options = {
            ...this.iconSizeOptions.dSeries,
            ...this.$utilStr.clearObjEmpty(iconOptions)
          };
          this.mapIcon[name].setAnchor(new BMap.Size(options.x, options.y));
          this.mapIcon[name].name = name;
          if (/^[d][0-3]$/.test(icon)) {
            this.mapIcon[name].realHeight = 30;
          } else {
            this.mapIcon[name].realHeight = 38;
          }
          return this.mapIcon[name];
        } else if (/^[e][0-9]*$/.test(icon)) {
          let name = this.iconPrefix + icon;
          let options = {
            ...this.iconSizeOptions.eSeries,
            ...this.$utilStr.clearObjEmpty(iconOptions)
          };
          this.mapIcon[name].setAnchor(new BMap.Size(options.x, options.y));
          this.mapIcon[name].name = name;
          this.mapIcon[name].realHeight = 36;
          return this.mapIcon[name];
        } else if (/^[f][0-9]*$/.test(icon)) {
          let name = this.iconPrefix + icon;
          let options = {
            ...this.iconSizeOptions.fSeries,
            ...this.$utilStr.clearObjEmpty(iconOptions)
          };
          this.mapIcon[name].setAnchor(new BMap.Size(options.x, options.y));
          this.mapIcon[name].name = name;
          this.mapIcon[name].realHeight = 42;
          return this.mapIcon[name];
        } else if (/^car$/.test(icon)) {
          let options = {
            ...this.iconSizeOptions.car,
            ...this.$utilStr.clearObjEmpty(iconOptions)
          };
          this.mapIcon[icon].setAnchor(new BMap.Size(options.x, options.y));
          this.mapIcon[icon].name = icon;
          this.mapIcon[icon].realHeight = options.height;
          return this.mapIcon[icon];
        } else if (/^null$/.test(icon)) {
          let options = {
            ...this.iconSizeOptions.null,
            ...this.$utilStr.clearObjEmpty(iconOptions)
          };
          this.mapIcon[icon].setAnchor(new BMap.Size(options.x, options.y));
          this.mapIcon[icon].name = icon;
          this.mapIcon[icon].realHeight = options.height;
          return this.mapIcon[icon];
        } else {
          if (!this.$utilStr.isURL(icon) && !this.$utilStr.isBase64(icon)) {
            icon =
              process.env.NODE_PATH +
              icon.replace(new RegExp(process.env.NODE_PATH), "");
          }
          let options = {
            ...this.iconSizeOptions.other,
            ...this.$utilStr.clearObjEmpty(iconOptions)
          };
          let mapIcon = new BMap.Icon(
            icon,
            new BMap.Size(options.width, options.height),
            {
              anchor: new BMap.Size(options.x, options.y)
            }
          );
          if (
            !this.$utilStr.isEmpty(options.imageWidth) &&
            !this.$utilStr.isEmpty(options.imageHeight)
          ) {
            mapIcon.setImageSize(
              new BMap.Size(options.imageWidth, options.imageHeight)
            );
          }
          if (
            !this.$utilStr.isEmpty(options.imageX) &&
            !this.$utilStr.isEmpty(options.imageY)
          ) {
            mapIcon.setImageOffset(
              new BMap.Size(options.imageX, options.imageY)
            );
          }
          mapIcon.name = null;
          mapIcon.realHeight = options.height;
          return mapIcon;
        }
      }
    },
    // 定位到当前城市
    LocalCity() {
      let _this = this;
      _this.loadingText = "正在定位中";
      if (_this.online) {
        let localCitySuccess = false;
        let myCity = new BMap.LocalCity();
        myCity.get((r) => {
          if (!localCitySuccess) {
            localCitySuccess = true;
            success(r.center, r.name);
          }
        });
        if (!_this.location) {
          setTimeout(() => {
            if (!localCitySuccess) {
              localCitySuccess = true;
              // 根据浏览器定位
              let geolocation = new BMap.Geolocation();
              geolocation.getCurrentPosition(
                function (r) {
                  if (this.getStatus() === BMAP_STATUS_SUCCESS) {
                    success(r.point, r.address.city);
                  } else {
                    error();
                  }
                },
                () => {
                  error();
                }
              );
            }
          }, 1000);
        }
      } else {
        if (
          _this.user &&
          !isNaN(parseFloat(_this.user.longitude)) &&
          !isNaN(parseFloat(_this.user.latitude))
        ) {
          let center = new BMap.Point(
            _this.user.longitude,
            _this.user.latitude
          );
          success(center);
        } else if (_this.user && _this.user.orgName) {
          _this
            .getPoint(_this.user.orgName, true)
            .then((center) => {
              if (center) {
                success(center);
              } else {
                error();
              }
            })
            .catch(() => {
              error();
            });
        } else {
          error();
        }
      }
      function success(center, city) {
        if (!_this.localCityComplete) {
          _this.localCityComplete = true;
          if (!_this.location) {
            if (
              !_this.activeEnableAutoView &&
              !_this.geolocationPanToComplete
            ) {
              _this.map.setCenter(center);
              _this.updateMapDefaultCenter();
            }
            _this.geolocationPanToComplete = true;
            _this.geolocationComplete = true;
          } else {
            if (!_this.currentPositionComplete) {
              if (
                !_this.activeEnableAutoView &&
                !_this.geolocationPanToComplete
              ) {
                _this.map.setCenter(center);
              }
            } else {
              _this.geolocationComplete = true;
            }
          }
          _this.updateMapLoadComplete();
          if (_this.geolocationComplete && !_this.loadComplete) {
            _this.loadingText = "正在渲染中";
          }
          let currentLocalCity = {
            lng: center.lng,
            lat: center.lat,
            city: ""
          };
          if (city) {
            currentLocalCity.city = city;
            _this.$emit("currentLocalCity", currentLocalCity);
          } else {
            _this
              .getLocation(center, true)
              .then((rs) => {
                if (rs) {
                  let addComp = rs.addressComponents;
                  currentLocalCity.city = addComp.city;
                }
              })
              .finally(() => {
                _this.$emit("currentLocalCity", currentLocalCity);
              });
          }
        }
      }
      function error() {
        _this.localCityComplete = true;
        if (!_this.location) {
          if (!_this.activeEnableAutoView && !_this.geolocationPanToComplete) {
            _this.updateMapDefaultCenter();
          }
          _this.geolocationPanToComplete = true;
          _this.geolocationComplete = true;
        } else {
          if (_this.currentPositionComplete) {
            _this.geolocationComplete = true;
          }
        }
        _this.updateMapLoadComplete();
        if (_this.geolocationComplete && !_this.loadComplete) {
          _this.loadingText = "正在渲染中";
        }
        _this.$emit("currentLocalCity");
        _this.$message({
          showClose: true,
          customClass: "is-wrap",
          message: "当前地理位置定位失败",
          type: "error",
          offset: 76
        });
      }
    },
    // 定位到当前位置
    LocalCurrentPosition() {
      let _this = this;
      _this.loadingText = "正在定位中";
      if (_this.online) {
        let geolocation = new BMap.Geolocation();
        // 开启SDK辅助定位
        geolocation.enableSDKLocation();
        geolocation.getCurrentPosition(
          function (r) {
            if (this.getStatus() === BMAP_STATUS_SUCCESS) {
              success(r.point);
            } else {
              error();
            }
          },
          () => {
            error();
          }
        );
      } else {
        if (
          _this.user &&
          !isNaN(parseFloat(_this.user.longitude)) &&
          !isNaN(parseFloat(_this.user.latitude))
        ) {
          let point = new BMap.Point(_this.user.longitude, _this.user.latitude);
          success(point);
        } else if (_this.user && _this.user.orgName) {
          _this
            .getPoint(_this.user.orgName, true)
            .then((point) => {
              if (point) {
                success(point);
              } else {
                error();
              }
            })
            .catch(() => {
              error();
            });
        } else {
          error();
        }
      }
      function success(point) {
        if (!_this.currentPositionComplete) {
          _this.currentPositionComplete = true;
          setCurrentPositionMarker(point);
          if (!_this.activeEnableAutoView && !_this.geolocationPanToComplete) {
            _this.map.panTo(point);
            _this.updateMapDefaultCenter();
          }
          _this.geolocationPanToComplete = true;
          if (
            !_this.automatic ||
            (_this.automatic && _this.localCityComplete)
          ) {
            _this.geolocationComplete = true;
          }
          _this.updateMapLoadComplete();
          if (_this.geolocationComplete && !_this.loadComplete) {
            _this.loadingText = "正在渲染中";
          }
          emitCurrentPosition(point);
        }
      }
      function error() {
        _this.currentPositionComplete = true;
        if (!_this.activeEnableAutoView && !_this.geolocationPanToComplete) {
          _this.updateMapDefaultCenter();
        }
        _this.geolocationPanToComplete = true;
        if (!_this.automatic || (_this.automatic && _this.localCityComplete)) {
          _this.geolocationComplete = true;
        }
        _this.updateMapLoadComplete();
        if (_this.geolocationComplete && !_this.loadComplete) {
          _this.loadingText = "正在渲染中";
        }
        _this.$emit("currentPosition");
        _this.$message({
          showClose: true,
          customClass: "is-wrap",
          message: "当前位置定位失败",
          type: "error",
          offset: 76
        });
      }
      function setCurrentPositionMarker(pt) {
        let mk = new BMap.Marker(pt, {
          icon: _this.getMapIcon("c1")
        });
        _this.map.addOverlay(mk);
        // 添加我的位置文本标注
        let mkIcon = mk.getIcon();
        let mkIconAnchor = mkIcon.anchor;
        let mkIconSize = mkIcon.size;
        let mkIconAnchorWidth = mkIconAnchor.width;
        let mkIconAnchorHeight = mkIconAnchor.height;
        let mkIconHeight = mkIconSize.height;
        let mkIconRealHeight = !isNaN(parseFloat(mkIcon.realHeight))
          ? mkIcon.realHeight
          : mkIconHeight;
        let label = new BMap.Label("我的位置", {
          offset: new BMap.Size(
            mkIconAnchorWidth,
            (mkIconHeight / 2 !== mkIconAnchorHeight
              ? -22 + mkIconHeight - mkIconRealHeight
              : -22 + (mkIconHeight - mkIconRealHeight) / 2) - 6
          )
        });
        label.setStyle(_this.overlayStyle.positionLabel);
        mk.setLabel(label);
        setTimeout(() => {
          label.setStyle({ display: "none" });
          mk.addEventListener(
            "mouseover",
            _this.handleMarkerMouseoverShowLabel
          );
          mk.addEventListener("mouseout", _this.handleMarkerMouseoutHideLabel);
        }, 3000);
      }
      function emitCurrentPosition(pt) {
        let currentPosition = {
          lng: pt.lng,
          lat: pt.lat,
          province: "",
          city: "",
          district: "",
          street: "",
          streetNumber: "",
          address: ""
        };
        _this
          .getLocation(pt, true)
          .then((rs) => {
            if (rs) {
              let addComp = rs.addressComponents;
              currentPosition.province = addComp.province;
              currentPosition.city = addComp.city;
              currentPosition.district = addComp.district;
              currentPosition.street = addComp.street;
              currentPosition.streetNumber = addComp.streetNumber;
              currentPosition.address =
                addComp.province +
                addComp.city +
                addComp.district +
                addComp.street +
                addComp.streetNumber;
            }
          })
          .finally(() => {
            _this.$emit("currentPosition", currentPosition);
          });
      }
    },
    // 设置地图默认中心点
    setDefaultCenter() {
      if (
        this.defaultCenter &&
        !isNaN(parseFloat(this.defaultCenter.lng)) &&
        !isNaN(parseFloat(this.defaultCenter.lat))
      ) {
        let point = new BMap.Point(
          this.defaultCenter.lng,
          this.defaultCenter.lat
        );
        this.map.setCenter(point);
      }
    },
    // 设置地图默认级别
    setDefaultZoom() {
      if (!isNaN(this.defaultZoom)) {
        this.map.setZoom(this.defaultZoom);
      }
    },
    // 设置地图默认中心点和级别
    setDefaultCenterAndZoom() {
      if (
        this.defaultCenter &&
        !isNaN(parseFloat(this.defaultCenter.lng)) &&
        !isNaN(parseFloat(this.defaultCenter.lat)) &&
        !isNaN(this.defaultZoom)
      ) {
        let point = new BMap.Point(
          this.defaultCenter.lng,
          this.defaultCenter.lat
        );
        this.map.centerAndZoom(point, this.defaultZoom);
      }
    },
    // 更新地图默认中心点
    updateMapDefaultCenter() {
      if (this.defaultCenterChanged) {
        this.setDefaultCenter();
      }
    },
    // 更新地图加载完成状态
    updateMapLoadComplete() {
      if (!this.loadComplete) {
        if (
          this.initComplete &&
          this.initRenderComplete &&
          this.geolocationComplete &&
          this.boundaryRenderComplete
        ) {
          this.loadComplete = true;
          this.loading = false;
          this.loadingText = "";
          this.$emit("currentLoaded", this.map);
        }
      }
    },
    // 监听地图单击事件
    listenMapClick() {
      let _this = this;
      _this.map.addEventListener("click", function (e) {
        if (e.overlay) return;
        if (_this.currentRouteSearchBoxFocus) return;
        if (_this.activeEnableDrawingMode) return;
        if (!_this.drawing) {
          clearTimeout(_this.timer.mapClick);
          if (event.detail === 2) return;
          _this.timer.mapClick = setTimeout(() => {
            _this
              .getLocation(e.point)
              .then((rs) => {
                if (rs) {
                  e.address = rs.address;
                  e.addressComponents = rs.addressComponents;
                  e.business = rs.business;
                  e.surroundingPois = rs.surroundingPois;
                }
              })
              .finally(() => {
                _this.$emit("currentClick", e, _this.map);
              });
          }, 500);
        }
      });
    },
    // 监听地图双击事件
    listenMapDblclick() {
      let _this = this;
      _this.map.addEventListener("dblclick", function (e) {
        if (_this.timer.mapClick) clearTimeout(_this.timer.mapClick);
        _this.$emit("currentDblclick", e, _this.map);
      });
    },
    // 监听地图移动开始事件
    listenMapMovestart() {
      let _this = this;
      _this.map.addEventListener("movestart", function () {
        let currentCenter = this.getCenter();
        let currentView = {
          center: currentCenter,
          zoom: this.getZoom()
        };
        _this.$emit("currentMovestart", currentCenter, _this.map);
        _this.$emit("currentViewstart", currentView, _this.map);
      });
    },
    // 监听地图移动结束事件
    listenMapMoveend() {
      let _this = this;
      _this.map.addEventListener("moveend", function () {
        _this.currentCenter = this.getCenter();
        let currentView = {
          center: _this.currentCenter,
          zoom: this.getZoom()
        };
        let oldView = {
          center: _this.oldCenter,
          zoom: _this.oldZoom
        };
        _this.$emit(
          "currentMoveend",
          _this.currentCenter,
          _this.oldCenter,
          _this.map
        );
        _this.$emit("currentViewend", currentView, oldView, _this.map);
        _this.oldCenter = _this.currentCenter;
      });
    },
    // 监听地图缩放开始事件
    listenMapZoomstart() {
      let _this = this;
      _this.map.addEventListener("zoomstart", function () {
        let currentZoom = this.getZoom();
        let currentView = {
          center: this.getCenter(),
          zoom: currentZoom
        };
        _this.$emit("currentZoomstart", currentZoom, _this.map);
        _this.$emit("currentViewstart", currentView, _this.map);
      });
    },
    // 监听地图缩放结束事件
    listenMapZoomend() {
      let _this = this;
      _this.map.addEventListener("zoomend", function () {
        _this.currentZoom = this.getZoom();
        let currentView = {
          center: this.getCenter(),
          zoom: _this.currentZoom
        };
        let oldView = {
          center: _this.oldCenter,
          zoom: _this.oldZoom
        };
        _this.$emit(
          "currentZoomend",
          _this.currentZoom,
          _this.oldZoom,
          _this.activeOrganKind,
          _this.map
        );
        _this.$emit("currentViewend", currentView, oldView, _this.map);
        if (_this.currentZoom <= 5 && _this.oldZoom > 5) {
          if (!_this.tilesloadComplete) {
            _this.tilesloadComplete = true;
            if (_this.centerAndZoomComplete) {
              _this.initComplete = true;
            }
            _this.updateMapLoadComplete();
          }
        }
        _this.updateBoundaryFillOpacity();
        _this.updateGraphicFillOpacity();
        _this.updateKeywordSearchModel();
        _this.oldZoom = _this.currentZoom;
      });
    },
    // 监听地图拖拽开始事件
    listenMapDragstart() {
      let _this = this;
      _this.map.addEventListener("dragstart", function (e) {
        _this.$emit("currentDragstart", e, this.getCenter(), _this.map);
      });
    },
    // 监听地图拖拽结束事件
    listenMapDragend() {
      let _this = this;
      _this.map.addEventListener("dragend", function (e) {
        _this.$emit("currentDragend", e, this.getCenter(), _this.map);
      });
    },
    // 设置颜色选择器
    setColorPicker() {
      if (!this.$utilStr.isExist(this.colorPickerOffsetWidth)) {
        if (this.colorPickerPlacement === "top-left") {
          this.currentColorPickerOffsetWidth = this.ctrlSpaceMedium;
        } else {
          if (this.navigation && this.overviewMap) {
            this.currentColorPickerOffsetWidth =
              this.navigationCtrlWidth + this.ctrlSpaceMedium;
          } else {
            this.currentColorPickerOffsetWidth = this.ctrlSpaceMedium;
          }
        }
      }
      if (!this.$utilStr.isExist(this.colorPickerOffsetHeight)) {
        if (this.colorPickerPlacement === "top-left") {
          if (this.mapType) {
            this.currentColorPickerOffsetHeight =
              this.ctrlSpaceMedium +
              this.mapTypeCtrlHeight +
              this.ctrlSpaceMedium;
          } else {
            this.currentColorPickerOffsetHeight =
              this.ctrlSpaceMedium + 32 + this.ctrlSpaceMedium;
          }
        } else {
          if (this.fullscreen && !(this.navigation && this.overviewMap)) {
            this.currentColorPickerOffsetHeight =
              this.ctrlSpaceMini +
              this.fullscreenCtrlHeight +
              this.ctrlSpaceMedium;
          } else {
            this.currentColorPickerOffsetHeight =
              this.ctrlSpaceMedium + 32 + this.ctrlSpaceMedium;
          }
        }
      }
    },
    // 设置经纬度坐标提示
    setPointTooltip(container) {
      let _this = this;
      // 文字提示
      let title = "未知";
      // 锚点偏移坐标
      let anchorX = 10;
      let anchorY = 10;
      container = container || _this.map.getContainer();
      _this.map.addEventListener("mousemove", function (eventMove) {
        let tooltip = document.querySelector(".hdty-tooltip");
        if (!tooltip) {
          tooltip = document.createElement("div");
          tooltip.className = "hdty-tooltip";
          document.body.appendChild(tooltip);
        }
        if (!eventMove.point) {
          eventMove.point = _this.map.pixelToPoint(
            new BMap.Pixel(eventMove.offsetX, eventMove.offsetY)
          );
        }
        title = eventMove.point.lng + "," + eventMove.point.lat;
        tooltip.innerHTML = title;
        tooltip.style.display = "block";
        setTooltipPosition(eventMove, tooltip);
      });
      container.addEventListener("mouseleave", function () {
        let tooltip = document.querySelector(".hdty-tooltip");
        if (tooltip) tooltip.style.display = "none";
      });
      function setTooltipPosition(e, tooltip) {
        // 鼠标偏移后的坐标
        let mx = e.clientX + anchorX;
        let my = e.clientY + anchorY;
        // 网页的宽高
        let pageWidth = document.documentElement.clientWidth;
        let pageHeight = document.documentElement.clientHeight;
        // 内容的宽高
        let elementWidth = tooltip.offsetWidth;
        let elementHeight = tooltip.offsetHeight;
        // 判断：如果水平方向显示的位置+当前元素的宽度>网页的宽度，则改为右侧定位
        if (mx + elementWidth < pageWidth) {
          tooltip.style.left = mx + "px";
          tooltip.style.right = "auto";
        } else {
          tooltip.style.right = pageWidth - mx + "px";
          tooltip.style.left = "auto";
        }
        // 判断：如果垂直方向显示的位置+当前元素的高度>网页的高度，则改为底部定位
        if (my + elementHeight < pageHeight) {
          tooltip.style.top = my + "px";
          tooltip.style.bottom = "auto";
        } else {
          tooltip.style.bottom = pageHeight - my + "px";
          tooltip.style.top = "auto";
        }
      }
    },
    // 设置行政区边界
    setBoundary() {
      let _this = this;
      _this.clearBoundary();
      // 获取行政区边界
      if (_this.boundaryName) {
        // 判断地图状态
        if (_this.loadComplete) {
          _this.loading = true;
        }
        if (_this.enableBoundaryApi) {
          if (typeof _this.boundaryApi === "function") {
            _this
              .boundaryApi(_this.boundaryParams)
              .then(success)
              .catch(error)
              .finally(complete);
          }
        } else {
          if (_this.online) {
            let bdary = new BMap.Boundary();
            bdary.get(_this.boundaryName, success);
          } else {
            getBoundary().then(success).catch(error).finally(complete);
          }
        }
      } else {
        if (!_this.boundaryRenderComplete) {
          _this.boundaryRenderComplete = true;
          _this.updateMapLoadComplete();
        }
      }
      function success(rs) {
        _this.clearBoundary();
        if (
          _this.$utilStr.isObject(rs) &&
          typeof rs.status !== "undefined" &&
          typeof rs.data !== "undefined"
        ) {
          let { success, data } = rs.data;
          if (success) {
            if (valid(data)) {
              let districts = [];
              for (let i = 0, iLen = data.length; i < iLen; i++) {
                if (data[i].wd.includes(_this.boundaryName)) {
                  if (_this.$utilStr.isNum(_this.boundaryKind)) {
                    if (data[i].kind <= _this.boundaryKind) {
                      districts.push(data[i]);
                    }
                  } else {
                    districts.push(data[i]);
                  }
                }
              }
              if (_this.$utilStr.isNum(_this.boundaryKind)) {
                districts = _this.$utilStr.arraySort(districts, "kind");
              } else {
                districts = _this.$utilStr
                  .arraySort(districts, "kind")
                  .slice(0, 1);
              }
              draw(districts);
            }
          }
        } else {
          if (valid(rs)) {
            let districts = [];
            if (_this.$utilStr.isArray(rs)) {
              districts = districts.concat(rs);
            } else {
              districts.push(rs);
            }
            draw(districts);
          }
          complete();
        }
      }
      function error(error) {
        console.error(error);
      }
      function complete() {
        if (_this.loadComplete) {
          _this.loading = false;
        }
        if (!_this.boundaryRenderComplete) {
          _this.boundaryRenderComplete = true;
          _this.updateMapLoadComplete();
        }
      }
      function draw(districts) {
        if (_this.currentBoundary) {
          if (valid(districts)) {
            let pointArr = [];
            let boundaryColors = _this.$utilStr.toArray(_this.boundaryColor);
            let boundaryFillColors = _this.$utilStr.toArray(
              _this.boundaryFillColor
            );
            let boundaryStyle = _this.setBoundaryStyle();
            let boundaryStrokeStyle = {
              ..._this.overlayStyle.boundaryStroke
            };
            let districtKinds = Array.from(
              new Set(_this.$utilStr.objArrayToArray(districts, "kind"))
            );
            _this.currentDistrictHasMultiKind = districtKinds.length > 1;
            if (_this.currentDistrictHasMultiKind) {
              let maxKind = districtKinds[0];
              let minKind = districtKinds[districtKinds.length - 1];
              for (let i = districts.length - 1; i >= 0; i--) {
                let boundaries = districts[i].boundaries;
                if (valid(boundaries)) {
                  let kind = districts[i].kind;
                  if (kind === minKind) {
                    let boundaryTarget = {
                      wd: districts[i].wd,
                      n: districts[i].n,
                      f: districts[i].f,
                      overlays: []
                    };
                    let activeBoundaryColor =
                      boundaryColors[i % boundaryColors.length];
                    if (
                      _this.boundaryWeight &&
                      activeBoundaryColor &&
                      activeBoundaryColor !== "transparent" &&
                      activeBoundaryColor !== "none"
                    ) {
                      boundaryStyle.strokeWeight = _this.boundaryWeight;
                      boundaryStyle.strokeColor = activeBoundaryColor;
                      boundaryStyle.strokeOpacity = 0.8;
                    }
                    if (_this.boundaryStyle) {
                      boundaryStyle.strokeStyle = _this.boundaryStyle;
                    }
                    let activeBoundaryFillColor =
                      boundaryFillColors[i % boundaryFillColors.length];
                    if (
                      activeBoundaryFillColor &&
                      activeBoundaryFillColor !== "transparent" &&
                      activeBoundaryFillColor !== "none"
                    ) {
                      if (boundaryStyle.fillOpacity) {
                        boundaryStyle.fillColor = activeBoundaryFillColor;
                      } else {
                        boundaryStyle.fillColor = "";
                        if (
                          boundaryStyle.strokeColor !== "none" &&
                          boundaryStyle.strokeWeight === 1
                        ) {
                          boundaryStyle.strokeWeight =
                            boundaryStyle.strokeWeight + 1;
                        }
                      }
                    } else {
                      boundaryStyle.fillOpacity = 0;
                    }
                    let activeMaxDistrictPath = [];
                    for (let j = 0, jLen = boundaries.length; j < jLen; j++) {
                      // 建立多边形覆盖物
                      let ply = new BMap.Polygon(boundaries[j], boundaryStyle);
                      // 添加覆盖物
                      _this.map.addOverlay(ply);
                      boundaryTarget.overlays.push(ply);
                      let plyPath = ply.getPath();
                      if (plyPath.length > activeMaxDistrictPath.length) {
                        activeMaxDistrictPath = plyPath;
                      }
                    }
                    boundaryTarget.c = utilGeo.getPolygonCenter(
                      activeMaxDistrictPath
                    );
                    _this.currentBoundaryTarget.push(boundaryTarget);
                  } else if (kind === maxKind) {
                    let boundaryStrokeTarget = {
                      wd: districts[i].wd,
                      n: districts[i].n,
                      f: districts[i].f,
                      overlays: []
                    };
                    if (
                      _this.boundaryStrokeWeight &&
                      _this.boundaryStrokeColor &&
                      _this.boundaryStrokeColor !== "transparent" &&
                      _this.boundaryStrokeColor !== "none"
                    ) {
                      boundaryStrokeStyle.strokeWeight =
                        _this.boundaryStrokeWeight;
                      boundaryStrokeStyle.strokeColor =
                        _this.boundaryStrokeColor;
                      boundaryStrokeStyle.strokeOpacity = 0.8;
                    }
                    let activeMaxDistrictPath = [];
                    for (let j = 0, jLen = boundaries.length; j < jLen; j++) {
                      // 建立多边形覆盖物
                      let ply = new BMap.Polygon(
                        boundaries[j],
                        boundaryStrokeStyle
                      );
                      // 添加覆盖物
                      _this.map.addOverlay(ply);
                      boundaryStrokeTarget.overlays.push(ply);
                      let plyPath = ply.getPath();
                      pointArr = pointArr.concat(plyPath);
                      if (plyPath.length > activeMaxDistrictPath.length) {
                        activeMaxDistrictPath = plyPath;
                      }
                      if (
                        boundaries[j].length >
                        _this.currentMaxBoundaryPath.length
                      ) {
                        _this.currentMaxBoundaryPath = boundaries[j];
                      }
                    }
                    boundaryStrokeTarget.c = utilGeo.getPolygonCenter(
                      activeMaxDistrictPath
                    );
                    _this.currentBoundaryStrokeTarget.push(
                      boundaryStrokeTarget
                    );
                  }
                }
              }
            } else {
              for (let i = 0, iLen = districts.length; i < iLen; i++) {
                let boundaries = districts[i].boundaries;
                if (valid(boundaries)) {
                  let boundaryTarget = {
                    wd: districts[i].wd,
                    n: districts[i].n,
                    f: districts[i].f,
                    overlays: []
                  };
                  _this.currentBoundaryHasStroke =
                    _this.boundaryStrokeWeight > _this.boundaryWeight;
                  let activeBoundaryWeight = _this.currentBoundaryHasStroke
                    ? _this.boundaryStrokeWeight
                    : _this.boundaryWeight;
                  let activeBoundaryColor = _this.currentBoundaryHasStroke
                    ? _this.boundaryStrokeColor
                    : boundaryColors[i % boundaryColors.length];
                  if (
                    activeBoundaryWeight &&
                    activeBoundaryColor &&
                    activeBoundaryColor !== "transparent" &&
                    activeBoundaryColor !== "none"
                  ) {
                    boundaryStyle.strokeWeight = activeBoundaryWeight;
                    boundaryStyle.strokeColor = activeBoundaryColor;
                    boundaryStyle.strokeOpacity = 0.8;
                  }
                  let activeBoundaryStyle =
                    !_this.currentBoundaryHasStroke && _this.boundaryStyle;
                  if (activeBoundaryStyle) {
                    boundaryStyle.strokeStyle = activeBoundaryStyle;
                  }
                  let activeBoundaryFillColor =
                    boundaryFillColors[i % boundaryFillColors.length];
                  if (
                    activeBoundaryFillColor &&
                    activeBoundaryFillColor !== "transparent" &&
                    activeBoundaryFillColor !== "none"
                  ) {
                    if (boundaryStyle.fillOpacity) {
                      boundaryStyle.fillColor = activeBoundaryFillColor;
                    } else {
                      boundaryStyle.fillColor = "";
                      if (
                        boundaryStyle.strokeColor !== "none" &&
                        boundaryStyle.strokeWeight === 1
                      ) {
                        boundaryStyle.strokeWeight =
                          boundaryStyle.strokeWeight + 1;
                      }
                    }
                  } else {
                    boundaryStyle.fillOpacity = 0;
                  }
                  let activeMaxDistrictPath = [];
                  for (let j = 0, jLen = boundaries.length; j < jLen; j++) {
                    // 建立多边形覆盖物
                    let ply = new BMap.Polygon(boundaries[j], boundaryStyle);
                    // 添加覆盖物
                    _this.map.addOverlay(ply);
                    boundaryTarget.overlays.push(ply);
                    let plyPath = ply.getPath();
                    pointArr = pointArr.concat(plyPath);
                    if (plyPath.length > activeMaxDistrictPath.length) {
                      activeMaxDistrictPath = plyPath;
                    }
                    if (
                      boundaries[j].length > _this.currentMaxBoundaryPath.length
                    ) {
                      _this.currentMaxBoundaryPath = boundaries[j];
                    }
                  }
                  boundaryTarget.c = utilGeo.getPolygonCenter(
                    activeMaxDistrictPath
                  );
                  _this.currentBoundaryTarget.push(boundaryTarget);
                }
              }
            }
            _this.currentBoundaryViewDataset = pointArr;
            // 设置地图最佳视野
            if (_this.boundaryAutoView) {
              _this.setBestView(_this.currentBoundaryViewDataset);
            }
            // 设置行政区当前选择高亮
            if (_this.boundaryHighlight) {
              _this.setBoundaryHighlight();
            }
            // 设置行政区边界遮罩层
            if (_this.boundaryModal) {
              _this.setBoundaryModal();
            }
            // 设置行政区边界遮罩层鼠标移入消失
            if (_this.boundaryModalHoverHide) {
              _this.setBoundaryModalHoverHide();
            }
            // 设置行政区边界城市中心点
            if (_this.showBoundaryCity) {
              _this.setBoundaryCity();
            }
          }
          _this.$emit(
            "currentBoundaryComplete",
            districts,
            _this.currentBoundaryTarget,
            _this.map
          );
        }
      }
      function valid(val) {
        if (!_this.$utilStr.isEmpty(val)) {
          return true;
        }
        _this.$message({
          showClose: true,
          message: "当前没有查询到行政区边界",
          type: "warning",
          offset: 76
        });
        return false;
      }
    },
    // 设置行政区当前选择高亮
    setBoundaryHighlight() {
      let container = this.map.getContainer();
      if (this.boundaryCurrentName) {
        this.setBoundaryCurrentName();
      }
      function setBoundaryHighlightStyle(e) {
        if (this.currentBoundaryTarget.length > 0) {
          let boundaryColors = this.$utilStr.toArray(this.boundaryColor);
          let boundaryFillColors = this.$utilStr.toArray(
            this.boundaryFillColor
          );
          let boundaryHighlightColors = this.$utilStr.toArray(
            this.boundaryHighlightColor
          );
          let boundaryFillHighlightColors = this.$utilStr.toArray(
            this.boundaryFillHighlightColor
          );
          let fillOpacityOptions = this.overlayStyle.boundaryFillOpacity;
          let activeFillOpacity = 0;
          let activeHighlightFillOpacity = 0;
          let activeStrokeWeight = 0;
          if (this.activeMapHasAnyOverlay) {
            if (this.currentZoom <= this.mapRegionZoomRange.province[1]) {
              activeFillOpacity = fillOpacityOptions.level2;
              activeHighlightFillOpacity = fillOpacityOptions.level1 + 0.15;
              activeStrokeWeight = this.activeBoundaryWeight;
            } else if (this.currentZoom <= this.mapRegionZoomRange.city[1]) {
              activeFillOpacity = fillOpacityOptions.level3;
              activeHighlightFillOpacity = fillOpacityOptions.level2 + 0.15;
              activeStrokeWeight = this.activeBoundaryWeight;
            } else if (
              this.currentZoom <= this.mapRegionZoomRange.district[1]
            ) {
              activeFillOpacity = fillOpacityOptions.level4;
              activeHighlightFillOpacity = fillOpacityOptions.level3 + 0.15;
              activeStrokeWeight = this.activeBoundaryWeight;
            } else if (this.currentZoom <= this.mapRegionZoomRange.town[1]) {
              activeFillOpacity = fillOpacityOptions.level5;
              activeHighlightFillOpacity = fillOpacityOptions.level4 + 0.15;
              activeStrokeWeight = this.activeBoundaryWeight;
            } else {
              activeFillOpacity = 0;
              activeHighlightFillOpacity = fillOpacityOptions.level5 + 0.05;
              activeStrokeWeight = this.activeBoundaryBoldWeight;
            }
          } else {
            if (this.currentZoom <= this.mapRegionZoomRange.province[1]) {
              activeFillOpacity = fillOpacityOptions.level1;
              activeHighlightFillOpacity = fillOpacityOptions.level1 + 0.15;
            } else if (this.currentZoom <= this.mapRegionZoomRange.city[1]) {
              activeFillOpacity = fillOpacityOptions.level2;
              activeHighlightFillOpacity = fillOpacityOptions.level2 + 0.15;
            } else if (
              this.currentZoom <= this.mapRegionZoomRange.district[1]
            ) {
              activeFillOpacity = fillOpacityOptions.level3;
              activeHighlightFillOpacity = fillOpacityOptions.level3 + 0.15;
            } else if (this.currentZoom <= this.mapRegionZoomRange.town[1]) {
              activeFillOpacity = fillOpacityOptions.level4;
              activeHighlightFillOpacity = fillOpacityOptions.level4 + 0.15;
            } else {
              activeFillOpacity = fillOpacityOptions.level5;
              activeHighlightFillOpacity = fillOpacityOptions.level5 + 0.05;
            }
            activeStrokeWeight = this.activeBoundaryWeight;
          }
          this.currentBoundaryTarget.forEach((v, i) => {
            if (
              !this.boundaryCurrentName ||
              !v.wd.includes(this.boundaryCurrentName)
            ) {
              let activeBoundaryFillHighlightColor =
                boundaryFillHighlightColors[
                  i % boundaryFillHighlightColors.length
                ];
              let activeBoundaryHighlightColor =
                boundaryHighlightColors[i % boundaryHighlightColors.length];
              let activeBoundaryFillColor =
                boundaryFillColors[i % boundaryFillColors.length];
              let activeBoundaryColor =
                boundaryColors[i % boundaryColors.length];
              if (
                this.currentBoundaryHasStroke &&
                !this.currentDistrictHasMultiKind
              ) {
                activeBoundaryColor = this.boundaryStrokeColor;
              }
              let validatePointInBoundary = false;
              for (let ply of v.overlays) {
                if (utilGeo.isPointInPolygon(e.point, ply)) {
                  validatePointInBoundary = true;
                  break;
                }
              }
              if (validatePointInBoundary) {
                v.overlays.forEach((ply) => {
                  let currentFillColor = ply.getFillColor();
                  let currentFillOpacity = ply.getFillOpacity();
                  let currentStrokeWeight = ply.getStrokeWeight();
                  let currentStrokeColor = ply.getStrokeColor();
                  let currentStrokeOpacity = ply.getStrokeOpacity();
                  if (
                    activeBoundaryFillHighlightColor &&
                    activeBoundaryFillHighlightColor !== "transparent" &&
                    activeBoundaryFillHighlightColor !== "none"
                  ) {
                    if (currentFillColor !== activeBoundaryFillHighlightColor) {
                      ply.setFillColor(activeBoundaryFillHighlightColor);
                    }
                    if (currentFillOpacity !== activeHighlightFillOpacity) {
                      ply.setFillOpacity(activeHighlightFillOpacity);
                    }
                  } else {
                    if (currentFillColor !== "none") {
                      ply.setFillColor("none");
                    }
                    if (currentFillOpacity !== 0) {
                      ply.setFillOpacity(0);
                    }
                  }
                  if (
                    activeBoundaryHighlightColor &&
                    activeBoundaryHighlightColor !== "transparent" &&
                    activeBoundaryHighlightColor !== "none"
                  ) {
                    if (currentStrokeWeight !== activeStrokeWeight) {
                      ply.setStrokeWeight(activeStrokeWeight);
                    }
                    if (currentStrokeColor !== activeBoundaryHighlightColor) {
                      ply.setStrokeColor(activeBoundaryHighlightColor);
                    }
                    if (currentStrokeOpacity !== 0.8) {
                      ply.setStrokOpacity(0.8);
                    }
                  } else {
                    if (currentStrokeWeight !== 1) {
                      ply.setStrokeWeight(1);
                    }
                    if (currentStrokeColor !== "none") {
                      ply.setStrokeColor("none");
                    }
                    if (currentStrokeOpacity !== 0) {
                      ply.setStrokeOpacity(0);
                    }
                  }
                });
              } else {
                v.overlays.forEach((ply) => {
                  let currentFillColor = ply.getFillColor();
                  let currentFillOpacity = ply.getFillOpacity();
                  let currentStrokeWeight = ply.getStrokeWeight();
                  let currentStrokeColor = ply.getStrokeColor();
                  let currentStrokeOpacity = ply.getStrokeOpacity();
                  if (
                    activeBoundaryFillColor &&
                    activeBoundaryFillColor !== "transparent" &&
                    activeBoundaryFillColor !== "none"
                  ) {
                    if (activeFillOpacity) {
                      if (currentFillColor !== activeBoundaryFillColor) {
                        ply.setFillColor(activeBoundaryFillColor);
                      }
                      if (currentFillOpacity !== activeFillOpacity) {
                        ply.setFillOpacity(activeFillOpacity);
                      }
                    } else {
                      if (currentFillColor !== "") {
                        ply.setFillColor("");
                      }
                      if (currentFillOpacity !== 0) {
                        ply.setFillOpacity(0);
                      }
                    }
                  } else {
                    if (currentFillColor !== "none") {
                      ply.setFillColor("none");
                    }
                    if (currentFillOpacity !== 0) {
                      ply.setFillOpacity(0);
                    }
                  }
                  if (
                    activeBoundaryColor &&
                    activeBoundaryColor !== "transparent" &&
                    activeBoundaryColor !== "none"
                  ) {
                    if (currentStrokeWeight !== activeStrokeWeight) {
                      ply.setStrokeWeight(activeStrokeWeight);
                    }
                    if (currentStrokeColor !== activeBoundaryColor) {
                      ply.setStrokeColor(activeBoundaryColor);
                    }
                    if (currentStrokeOpacity !== 0.8) {
                      ply.setStrokOpacity(0.8);
                    }
                  } else {
                    if (currentStrokeWeight !== 1) {
                      ply.setStrokeWeight(1);
                    }
                    if (currentStrokeColor !== "none") {
                      ply.setStrokeColor("none");
                    }
                    if (currentStrokeOpacity !== 0) {
                      ply.setStrokeOpacity(0);
                    }
                  }
                });
              }
            }
          });
        }
      }
      function setBoundaryStyle() {
        if (this.currentBoundaryTarget.length > 0) {
          let boundaryColors = this.$utilStr.toArray(this.boundaryColor);
          let boundaryFillColors = this.$utilStr.toArray(
            this.boundaryFillColor
          );
          let fillOpacityOptions = this.overlayStyle.boundaryFillOpacity;
          let activeFillOpacity = 0;
          let activeStrokeWeight = 0;
          if (this.activeMapHasAnyOverlay) {
            if (this.currentZoom <= this.mapRegionZoomRange.province[1]) {
              activeFillOpacity = fillOpacityOptions.level2;
              activeStrokeWeight = this.activeBoundaryWeight;
            } else if (this.currentZoom <= this.mapRegionZoomRange.city[1]) {
              activeFillOpacity = fillOpacityOptions.level3;
              activeStrokeWeight = this.activeBoundaryWeight;
            } else if (
              this.currentZoom <= this.mapRegionZoomRange.district[1]
            ) {
              activeFillOpacity = fillOpacityOptions.level4;
              activeStrokeWeight = this.activeBoundaryWeight;
            } else if (this.currentZoom <= this.mapRegionZoomRange.town[1]) {
              activeFillOpacity = fillOpacityOptions.level5;
              activeStrokeWeight = this.activeBoundaryWeight;
            } else {
              activeFillOpacity = 0;
              activeStrokeWeight = this.activeBoundaryBoldWeight;
            }
          } else {
            if (this.currentZoom <= this.mapRegionZoomRange.province[1]) {
              activeFillOpacity = fillOpacityOptions.level1;
            } else if (this.currentZoom <= this.mapRegionZoomRange.city[1]) {
              activeFillOpacity = fillOpacityOptions.level2;
            } else if (
              this.currentZoom <= this.mapRegionZoomRange.district[1]
            ) {
              activeFillOpacity = fillOpacityOptions.level3;
            } else if (this.currentZoom <= this.mapRegionZoomRange.town[1]) {
              activeFillOpacity = fillOpacityOptions.level4;
            } else {
              activeFillOpacity = fillOpacityOptions.level5;
            }
            activeStrokeWeight = this.activeBoundaryWeight;
          }
          this.currentBoundaryTarget.forEach((v, i) => {
            if (
              !this.boundaryCurrentName ||
              !v.wd.includes(this.boundaryCurrentName)
            ) {
              let activeBoundaryFillColor =
                boundaryFillColors[i % boundaryFillColors.length];
              let activeBoundaryColor =
                boundaryColors[i % boundaryColors.length];
              if (
                this.currentBoundaryHasStroke &&
                !this.currentDistrictHasMultiKind
              ) {
                activeBoundaryColor = this.boundaryStrokeColor;
              }
              v.overlays.forEach((ply) => {
                let currentFillColor = ply.getFillColor();
                let currentFillOpacity = ply.getFillOpacity();
                let currentStrokeWeight = ply.getStrokeWeight();
                let currentStrokeColor = ply.getStrokeColor();
                let currentStrokeOpacity = ply.getStrokeOpacity();
                if (
                  activeBoundaryFillColor &&
                  activeBoundaryFillColor !== "transparent" &&
                  activeBoundaryFillColor !== "none"
                ) {
                  if (activeFillOpacity) {
                    if (currentFillColor !== activeBoundaryFillColor) {
                      ply.setFillColor(activeBoundaryFillColor);
                    }
                    if (currentFillOpacity !== activeFillOpacity) {
                      ply.setFillOpacity(activeFillOpacity);
                    }
                  } else {
                    if (currentFillColor !== "") {
                      ply.setFillColor("");
                    }
                    if (currentFillOpacity !== 0) {
                      ply.setFillOpacity(0);
                    }
                  }
                } else {
                  if (currentFillColor !== "none") {
                    ply.setFillColor("none");
                  }
                  if (currentFillOpacity !== 0) {
                    ply.setFillOpacity(0);
                  }
                }
                if (
                  activeBoundaryColor &&
                  activeBoundaryColor !== "transparent" &&
                  activeBoundaryColor !== "none"
                ) {
                  if (currentStrokeWeight !== activeStrokeWeight) {
                    ply.setStrokeWeight(activeStrokeWeight);
                  }
                  if (currentStrokeColor !== activeBoundaryColor) {
                    ply.setStrokeColor(activeBoundaryColor);
                  }
                  if (currentStrokeOpacity !== 0.8) {
                    ply.setStrokOpacity(0.8);
                  }
                } else {
                  if (currentStrokeWeight !== 1) {
                    ply.setStrokeWeight(1);
                  }
                  if (currentStrokeColor !== "none") {
                    ply.setStrokeColor("none");
                  }
                  if (currentStrokeOpacity !== 0) {
                    ply.setStrokeOpacity(0);
                  }
                }
              });
            }
          });
        }
      }
      this.listenerMousemoveSetBoundaryHighlight =
        setBoundaryHighlightStyle.bind(this);
      this.listenerMouseleaveSetBoundary = setBoundaryStyle.bind(this);
      this.map.addEventListener(
        "mousemove",
        this.listenerMousemoveSetBoundaryHighlight
      );
      container.addEventListener(
        "mouseleave",
        this.listenerMouseleaveSetBoundary
      );
    },
    // 设置高亮当前选择行政区
    setBoundaryCurrentName() {
      this.clearBoundaryCurrentName();
      if (this.currentBoundaryTarget.length > 0) {
        let boundaryHighlightColors = this.$utilStr.toArray(
          this.boundaryHighlightColor
        );
        let boundaryFillHighlightColors = this.$utilStr.toArray(
          this.boundaryFillHighlightColor
        );
        let fillOpacityOptions = this.overlayStyle.boundaryFillOpacity;
        let activeHighlightFillOpacity = 0;
        let activeStrokeWeight = 0;
        if (this.activeMapHasAnyOverlay) {
          if (this.currentZoom <= this.mapRegionZoomRange.province[1]) {
            activeHighlightFillOpacity = fillOpacityOptions.level1 + 0.15;
            activeStrokeWeight = this.activeBoundaryWeight;
          } else if (this.currentZoom <= this.mapRegionZoomRange.city[1]) {
            activeHighlightFillOpacity = fillOpacityOptions.level2 + 0.15;
            activeStrokeWeight = this.activeBoundaryWeight;
          } else if (this.currentZoom <= this.mapRegionZoomRange.district[1]) {
            activeHighlightFillOpacity = fillOpacityOptions.level3 + 0.15;
            activeStrokeWeight = this.activeBoundaryWeight;
          } else if (this.currentZoom <= this.mapRegionZoomRange.town[1]) {
            activeHighlightFillOpacity = fillOpacityOptions.level4 + 0.15;
            activeStrokeWeight = this.activeBoundaryWeight;
          } else {
            activeHighlightFillOpacity = fillOpacityOptions.level5 + 0.05;
            activeStrokeWeight = this.activeBoundaryBoldWeight;
          }
        } else {
          if (this.currentZoom <= this.mapRegionZoomRange.province[1]) {
            activeHighlightFillOpacity = fillOpacityOptions.level1 + 0.15;
          } else if (this.currentZoom <= this.mapRegionZoomRange.city[1]) {
            activeHighlightFillOpacity = fillOpacityOptions.level2 + 0.15;
          } else if (this.currentZoom <= this.mapRegionZoomRange.district[1]) {
            activeHighlightFillOpacity = fillOpacityOptions.level3 + 0.15;
          } else if (this.currentZoom <= this.mapRegionZoomRange.town[1]) {
            activeHighlightFillOpacity = fillOpacityOptions.level4 + 0.15;
          } else {
            activeHighlightFillOpacity = fillOpacityOptions.level5 + 0.05;
          }
          activeStrokeWeight = this.activeBoundaryWeight;
        }
        this.currentBoundaryTarget.forEach((e, i) => {
          if (e.wd.includes(this.boundaryCurrentName)) {
            let activeBoundaryFillHighlightColor =
              boundaryFillHighlightColors[
                i % boundaryFillHighlightColors.length
              ];
            let activeBoundaryHighlightColor =
              boundaryHighlightColors[i % boundaryHighlightColors.length];
            e.overlays.forEach((ply) => {
              let currentFillColor = ply.getFillColor();
              let currentFillOpacity = ply.getFillOpacity();
              let currentStrokeWeight = ply.getStrokeWeight();
              let currentStrokeColor = ply.getStrokeColor();
              let currentStrokeOpacity = ply.getStrokeOpacity();
              if (
                activeBoundaryFillHighlightColor &&
                activeBoundaryFillHighlightColor !== "transparent" &&
                activeBoundaryFillHighlightColor !== "none"
              ) {
                if (currentFillColor !== activeBoundaryFillHighlightColor) {
                  ply.setFillColor(activeBoundaryFillHighlightColor);
                }
                if (currentFillOpacity !== activeHighlightFillOpacity) {
                  ply.setFillOpacity(activeHighlightFillOpacity);
                }
              } else {
                if (currentFillColor !== "none") {
                  ply.setFillColor("none");
                }
                if (currentFillOpacity !== 0) {
                  ply.setFillOpacity(0);
                }
              }
              if (
                activeBoundaryHighlightColor &&
                activeBoundaryHighlightColor !== "transparent" &&
                activeBoundaryHighlightColor !== "none"
              ) {
                if (currentStrokeWeight !== activeStrokeWeight) {
                  ply.setStrokeWeight(activeStrokeWeight);
                }
                if (currentStrokeColor !== activeBoundaryHighlightColor) {
                  ply.setStrokeColor(activeBoundaryHighlightColor);
                }
                if (currentStrokeOpacity !== 0.8) {
                  ply.setStrokOpacity(0.8);
                }
              } else {
                if (currentStrokeWeight !== 1) {
                  ply.setStrokeWeight(1);
                }
                if (currentStrokeColor !== "none") {
                  ply.setStrokeColor("none");
                }
                if (currentStrokeOpacity !== 0) {
                  ply.setStrokeOpacity(0);
                }
              }
            });
          }
        });
      }
    },
    // 设置行政区边界遮罩层
    setBoundaryModal() {
      if (this.currentMaxBoundaryPath) {
        let maxBoundaryPath = "";
        let boundaryPointArr = this.currentMaxBoundaryPath.split(";");
        let boundaryPointArrLen = boundaryPointArr.length;
        // 首尾闭合
        if (boundaryPointArr[boundaryPointArrLen - 1] !== boundaryPointArr[0]) {
          boundaryPointArr.push(boundaryPointArr[0]);
        }
        // 行政区边界点集合
        for (let i = 0; i < boundaryPointArrLen; i++) {
          maxBoundaryPath += boundaryPointArr[i] + ";";
        }
        // 自定义外围边框点集合
        const SE_JW = "180, -90;"; // 东南角的坐标(右下端点)
        const SW_JW = "-180, -90;"; // 西南角的坐标(左下端点)
        const NW_JW = "-180, 90;"; // 西北角的坐标(左上端点)
        const NE_JW = "180, 90;"; // 东北角的坐标(右上端点)
        // 外围边框点首尾闭合
        let outermostPolygonPath = SE_JW + SW_JW + NW_JW + NE_JW + SE_JW;
        let boundaryModalStyle = {
          ...this.overlayStyle.boundaryModal
        };
        if (
          this.boundaryModalColor &&
          this.boundaryModalColor !== "transparent" &&
          this.boundaryModalColor !== "none"
        ) {
          boundaryModalStyle.fillColor = this.boundaryModalColor;
          boundaryModalStyle.fillOpacity = 1;
        }
        // 建立多边形覆盖物
        let ply = new BMap.Polygon(
          maxBoundaryPath + outermostPolygonPath,
          boundaryModalStyle
        );
        // 添加覆盖物
        this.map.addOverlay(ply);
        // 调整行政区边界宽度
        if (ply.getFillColor() !== "none") {
          this.setBoundaryModalStroke();
        }
        this.currentBoundaryModalTarget.push(ply);
      }
    },
    // 设置行政区边界遮罩层鼠标移入消失
    setBoundaryModalHoverHide() {
      let container = this.map.getContainer();
      function setBoundaryModalHoverHideStyle(e) {
        if (this.currentBoundaryModalTarget.length > 0) {
          let activeBoundaryModalColor = "none";
          if (
            this.boundaryModalColor &&
            this.boundaryModalColor !== "transparent" &&
            this.boundaryModalColor !== "none"
          ) {
            activeBoundaryModalColor = this.boundaryModalColor;
          }
          if (activeBoundaryModalColor !== "none") {
            this.currentBoundaryModalTarget.forEach((ply) => {
              let currentFillColor = ply.getFillColor();
              let currentFillOpacity = ply.getFillOpacity();
              if (utilGeo.isPointInPolygon(e.point, ply)) {
                if (currentFillColor !== "none") {
                  ply.setFillColor("none");
                }
                if (currentFillOpacity !== 0) {
                  ply.setFillOpacity(0);
                }
                // 调整行政区边界宽度
                this.resetBoundaryModalStroke();
              } else {
                if (currentFillColor !== activeBoundaryModalColor) {
                  ply.setFillColor(activeBoundaryModalColor);
                }
                if (currentFillOpacity !== 1) {
                  ply.setFillOpacity(1);
                }
                // 调整行政区边界宽度
                this.setBoundaryModalStroke();
              }
            });
          }
        }
      }
      function setBoundaryModalStyle() {
        if (this.currentBoundaryModalTarget.length > 0) {
          let activeBoundaryModalColor = "none";
          if (
            this.boundaryModalColor &&
            this.boundaryModalColor !== "transparent" &&
            this.boundaryModalColor !== "none"
          ) {
            activeBoundaryModalColor = this.boundaryModalColor;
          }
          if (activeBoundaryModalColor !== "none") {
            this.currentBoundaryModalTarget.forEach((ply) => {
              let currentFillColor = ply.getFillColor();
              let currentFillOpacity = ply.getFillOpacity();
              if (currentFillColor !== activeBoundaryModalColor) {
                ply.setFillColor(activeBoundaryModalColor);
              }
              if (currentFillOpacity !== 1) {
                ply.setFillOpacity(1);
              }
            });
            // 调整行政区边界宽度
            this.setBoundaryModalStroke();
          }
        }
      }
      this.listenerMousemoveSetBoundaryModalHoverHide =
        setBoundaryModalHoverHideStyle.bind(this);
      this.listenerMouseleaveSetBoundaryModal =
        setBoundaryModalStyle.bind(this);
      this.map.addEventListener(
        "mousemove",
        this.listenerMousemoveSetBoundaryModalHoverHide
      );
      container.addEventListener(
        "mouseleave",
        this.listenerMouseleaveSetBoundaryModal
      );
    },
    // 设置行政区边界城市中心点
    setBoundaryCity() {
      let _this = this;
      _this.clearBoundaryCity();
      if (_this.currentBoundaryTarget.length > 0) {
        _this.currentBoundaryTarget.forEach((e) => {
          let mk = new BMap.Marker(e.c, {
            icon: _this.getMapIcon("b10")
          });
          _this.map.addOverlay(mk);
          if (e.f) {
            let labelStyle = {
              ..._this.overlayStyle.boundaryLabel
            };
            let cvs = document.createElement("canvas");
            let cxt = cvs.getContext("2d");
            cxt.font = labelStyle.fontSize + " " + labelStyle.fontFamily;
            let width = cxt.measureText(e.f).width;
            if (width > 314) {
              labelStyle.width = "320px";
              labelStyle.whiteSpace = "normal";
            }
            let mkIcon = mk.getIcon();
            let mkIconAnchor = mkIcon.anchor;
            let label = new BMap.Label(e.f, {
              offset: new BMap.Size(mkIconAnchor.width, mkIconAnchor.height)
            });
            label.setStyle(labelStyle);
            mk.setLabel(label);
          }
          mk.addEventListener("click", function () {
            let mkIcon = mk.getIcon();
            let mkIconAnchor = mkIcon.anchor;
            let mkIconSize = mkIcon.size;
            let mkIconAnchorHeight = mkIconAnchor.height;
            let mkIconHeight = mkIconSize.height;
            let mkIconRealHeight = !isNaN(parseFloat(mkIcon.realHeight))
              ? mkIcon.realHeight
              : mkIconHeight;
            const resolve = (val) => {
              _this.setInfoWindow(
                val,
                "city",
                new BMap.Size(
                  0,
                  mkIconHeight / 2 !== mkIconAnchorHeight
                    ? mkIconRealHeight - mkIconHeight + mkIconAnchorHeight
                    : mkIconRealHeight / 2
                ),
                function (info) {
                  info.open(mk);
                }
              );
            };
            _this.$emit("currentBoundaryCityClick", e, mk, resolve);
          });
          _this.currentBoundaryCityTarget.push(mk);
        });
      }
    },
    // 设置行政区边界样式
    setBoundaryStyle() {
      let boundaryStyle = {
        ...this.overlayStyle.boundary
      };
      let fillOpacityOptions = this.overlayStyle.boundaryFillOpacity;
      if (this.activeMapHasAnyOverlay) {
        if (this.currentZoom <= this.mapRegionZoomRange.province[1]) {
          boundaryStyle.fillOpacity = fillOpacityOptions.level2;
        } else if (this.currentZoom <= this.mapRegionZoomRange.city[1]) {
          boundaryStyle.fillOpacity = fillOpacityOptions.level3;
        } else if (this.currentZoom <= this.mapRegionZoomRange.district[1]) {
          boundaryStyle.fillOpacity = fillOpacityOptions.level4;
        } else if (this.currentZoom <= this.mapRegionZoomRange.town[1]) {
          boundaryStyle.fillOpacity = fillOpacityOptions.level5;
        } else {
          boundaryStyle.fillOpacity = 0;
        }
      } else {
        if (this.currentZoom <= this.mapRegionZoomRange.province[1]) {
          boundaryStyle.fillOpacity = fillOpacityOptions.level1;
        } else if (this.currentZoom <= this.mapRegionZoomRange.city[1]) {
          boundaryStyle.fillOpacity = fillOpacityOptions.level2;
        } else if (this.currentZoom <= this.mapRegionZoomRange.district[1]) {
          boundaryStyle.fillOpacity = fillOpacityOptions.level3;
        } else if (this.currentZoom <= this.mapRegionZoomRange.town[1]) {
          boundaryStyle.fillOpacity = fillOpacityOptions.level4;
        } else {
          boundaryStyle.fillOpacity = fillOpacityOptions.level5;
        }
      }
      return boundaryStyle;
    },
    // 设置行政区边界遮罩层描边
    setBoundaryModalStroke() {
      if (this.currentDistrictHasMultiKind) {
        if (this.currentBoundaryStrokeTarget.length > 0) {
          let activeStrokeWeight = 0;
          if (this.activeMapHasAnyOverlay) {
            if (this.currentZoom <= this.mapRegionZoomRange.town[1]) {
              activeStrokeWeight = this.activeBoundaryDefaultStrokeWeight * 2;
            } else {
              activeStrokeWeight =
                this.activeBoundaryDefaultBoldStrokeWeight * 2;
            }
          } else {
            activeStrokeWeight = this.activeBoundaryDefaultStrokeWeight * 2;
          }
          this.currentBoundaryStrokeTarget.forEach((e) => {
            e.overlays.forEach((ply) => {
              let currentStrokeColor = ply.getStrokeColor();
              let currentStrokeWeight = ply.getStrokeWeight();
              if (currentStrokeColor !== "none") {
                if (currentStrokeWeight !== activeStrokeWeight) {
                  ply.setStrokeWeight(activeStrokeWeight);
                }
              }
            });
          });
        }
      } else {
        if (this.currentBoundaryTarget.length > 0) {
          let activeStrokeWeight = 0;
          if (this.activeMapHasAnyOverlay) {
            if (this.currentZoom <= this.mapRegionZoomRange.town[1]) {
              activeStrokeWeight = this.activeBoundaryDefaultStrokeWeight * 2;
            } else {
              activeStrokeWeight =
                this.activeBoundaryDefaultBoldStrokeWeight * 2;
            }
          } else {
            activeStrokeWeight = this.activeBoundaryDefaultStrokeWeight * 2;
          }
          this.currentBoundaryTarget.forEach((e) => {
            e.overlays.forEach((ply) => {
              let currentStrokeColor = ply.getStrokeColor();
              let currentStrokeWeight = ply.getStrokeWeight();
              if (currentStrokeColor !== "none") {
                if (currentStrokeWeight !== activeStrokeWeight) {
                  ply.setStrokeWeight(activeStrokeWeight);
                }
              }
            });
          });
        }
      }
    },
    // 重置行政区边界遮罩层描边
    resetBoundaryModalStroke() {
      if (this.currentDistrictHasMultiKind) {
        if (this.currentBoundaryStrokeTarget.length > 0) {
          let activeStrokeWeight = 0;
          if (this.activeMapHasAnyOverlay) {
            if (this.currentZoom <= this.mapRegionZoomRange.town[1]) {
              activeStrokeWeight = this.activeBoundaryDefaultStrokeWeight;
            } else {
              activeStrokeWeight = this.activeBoundaryDefaultBoldStrokeWeight;
            }
          } else {
            activeStrokeWeight = this.activeBoundaryDefaultStrokeWeight;
          }
          this.currentBoundaryStrokeTarget.forEach((e) => {
            e.overlays.forEach((ply) => {
              let currentStrokeColor = ply.getStrokeColor();
              let currentStrokeWeight = ply.getStrokeWeight();
              if (currentStrokeColor !== "none") {
                if (currentStrokeWeight !== activeStrokeWeight) {
                  ply.setStrokeWeight(activeStrokeWeight);
                }
              }
            });
          });
        }
      } else {
        if (this.currentBoundaryTarget.length > 0) {
          let activeStrokeWeight = 0;
          if (this.activeMapHasAnyOverlay) {
            if (this.currentZoom <= this.mapRegionZoomRange.town[1]) {
              activeStrokeWeight = this.activeBoundaryDefaultStrokeWeight;
            } else {
              activeStrokeWeight = this.activeBoundaryDefaultBoldStrokeWeight;
            }
          } else {
            activeStrokeWeight = this.activeBoundaryDefaultStrokeWeight;
          }
          this.currentBoundaryTarget.forEach((e) => {
            e.overlays.forEach((ply) => {
              let currentStrokeColor = ply.getStrokeColor();
              let currentStrokeWeight = ply.getStrokeWeight();
              if (currentStrokeColor !== "none") {
                if (currentStrokeWeight !== activeStrokeWeight) {
                  ply.setStrokeWeight(activeStrokeWeight);
                }
              }
            });
          });
        }
      }
    },
    // 更新行政区边界填充透明度
    updateBoundaryFillOpacity() {
      let _this = this;
      if (_this.currentBoundaryStrokeTarget.length > 0) {
        _this.currentBoundaryStrokeTarget.forEach((e, i) => {
          e.overlays.forEach((ply) => {
            boundaryStrokeStyleUpdate(ply, i);
          });
        });
        function boundaryStrokeStyleUpdate(ply, i) {
          let currentStrokeColor = ply.getStrokeColor();
          let currentStrokeWeight = ply.getStrokeWeight();
          if (currentStrokeColor !== "none") {
            if (_this.activeMapHasAnyOverlay) {
              if (_this.currentZoom <= _this.mapRegionZoomRange.town[1]) {
                if (currentStrokeWeight !== _this.activeBoundaryStrokeWeight) {
                  ply.setStrokeWeight(_this.activeBoundaryStrokeWeight);
                }
              } else {
                if (
                  currentStrokeWeight !== _this.activeBoundaryBoldStrokeWeight
                ) {
                  ply.setStrokeWeight(_this.activeBoundaryBoldStrokeWeight);
                }
              }
            }
          }
        }
      }
      if (_this.currentBoundaryTarget.length > 0) {
        let boundaryFillColors = _this.$utilStr.toArray(
          _this.boundaryFillColor
        );
        let fillOpacityOptions = _this.overlayStyle.boundaryFillOpacity;
        _this.currentBoundaryTarget.forEach((e, i) => {
          e.overlays.forEach((ply) => {
            boundaryStyleUpdate(ply, i);
          });
        });
        function boundaryStyleUpdate(ply, i) {
          let currentFillColor = ply.getFillColor();
          let currentFillOpacity = ply.getFillOpacity();
          let currentStrokeColor = ply.getStrokeColor();
          let currentStrokeWeight = ply.getStrokeWeight();
          if (currentFillColor !== "none") {
            if (_this.activeMapHasAnyOverlay) {
              if (_this.currentZoom <= _this.mapRegionZoomRange.province[1]) {
                if (currentFillOpacity !== fillOpacityOptions.level2) {
                  ply.setFillOpacity(fillOpacityOptions.level2);
                }
              } else if (
                _this.currentZoom <= _this.mapRegionZoomRange.city[1]
              ) {
                if (currentFillOpacity !== fillOpacityOptions.level3) {
                  ply.setFillOpacity(fillOpacityOptions.level3);
                }
              } else if (
                _this.currentZoom <= _this.mapRegionZoomRange.district[1]
              ) {
                if (currentFillOpacity !== fillOpacityOptions.level4) {
                  ply.setFillOpacity(fillOpacityOptions.level4);
                }
              } else if (
                _this.currentZoom <= _this.mapRegionZoomRange.town[1]
              ) {
                let defaultFillColor =
                  boundaryFillColors[i % boundaryFillColors.length];
                if (currentFillColor !== defaultFillColor) {
                  ply.setFillColor(defaultFillColor);
                }
                if (currentFillOpacity !== fillOpacityOptions.level5) {
                  ply.setFillOpacity(fillOpacityOptions.level5);
                }
              } else {
                if (currentFillColor !== "") {
                  ply.setFillColor("");
                }
                if (currentFillOpacity !== 0) {
                  ply.setFillOpacity(0);
                }
              }
            } else {
              if (_this.currentZoom <= _this.mapRegionZoomRange.province[1]) {
                if (currentFillOpacity !== fillOpacityOptions.level1) {
                  ply.setFillOpacity(fillOpacityOptions.level1);
                }
              } else if (
                _this.currentZoom <= _this.mapRegionZoomRange.city[1]
              ) {
                if (currentFillOpacity !== fillOpacityOptions.level2) {
                  ply.setFillOpacity(fillOpacityOptions.level2);
                }
              } else if (
                _this.currentZoom <= _this.mapRegionZoomRange.district[1]
              ) {
                if (currentFillOpacity !== fillOpacityOptions.level3) {
                  ply.setFillOpacity(fillOpacityOptions.level3);
                }
              } else if (
                _this.currentZoom <= _this.mapRegionZoomRange.town[1]
              ) {
                if (currentFillOpacity !== fillOpacityOptions.level4) {
                  ply.setFillOpacity(fillOpacityOptions.level4);
                }
              } else {
                if (currentFillOpacity !== fillOpacityOptions.level5) {
                  ply.setFillOpacity(fillOpacityOptions.level5);
                }
              }
            }
          }
          if (currentStrokeColor !== "none") {
            if (_this.activeMapHasAnyOverlay) {
              if (_this.currentZoom <= _this.mapRegionZoomRange.town[1]) {
                if (currentStrokeWeight !== _this.activeBoundaryWeight) {
                  ply.setStrokeWeight(_this.activeBoundaryWeight);
                }
              } else {
                if (currentStrokeWeight !== _this.activeBoundaryBoldWeight) {
                  ply.setStrokeWeight(_this.activeBoundaryBoldWeight);
                }
              }
            }
          }
        }
      }
    },
    // 设置自定义图层瓦片
    setTileLayer() {
      let _this = this;
      let tileLayer = new BMap.TileLayer({
        transparentPng: !_this.tileLayerContinuous
      });
      tileLayer.getTilesUrl = (tileLeftBottomCoord, zoom) => {
        let tileUrl = "";
        if (_this.tileLayerService === "WMS") {
          // 获取瓦片左下角的像素坐标
          let x = tileLeftBottomCoord.x;
          let y = tileLeftBottomCoord.y;
          // 获取瓦片左下角的经纬度坐标
          let tileLeftBottomPoint =
            _this.convert.tileToLngLat(tileLeftBottomCoord);
          // 获取瓦片右上角的像素坐标
          let tileRightTopCoord = new BMap.Pixel(x + 1, y + 1);
          // 获取瓦片右上角的经纬度坐标
          let tileRightTopPoint = _this.convert.tileToLngLat(tileRightTopCoord);
          // 获取瓦片中心点的经纬度坐标
          let tileCenterPoint = _this.$utilGeo.getPolygonCenter([
            tileLeftBottomPoint,
            tileRightTopPoint
          ]);
          // 获取瓦片左下角的WGS84坐标
          let tileLeftBottomWgs = _this.$utilCoord.bd09ToWgs84(
            tileLeftBottomPoint.lng,
            tileLeftBottomPoint.lat
          );
          // 获取瓦片右上角的WGS84坐标
          let tileRightTopWgs = _this.$utilCoord.bd09ToWgs84(
            tileRightTopPoint.lng,
            tileRightTopPoint.lat
          );
          // 获取瓦片中心点的WGS84坐标
          let tileCenterWgs = _this.$utilCoord.bd09ToWgs84(
            tileCenterPoint.lng,
            tileCenterPoint.lat
          );
          // 设置瓦片的宽高
          let tileWidth = 256;
          let tileHeight = 256;
          // 设置srs
          let srs;
          // 设置bbox
          let bbox;
          // 设置中心点
          let center;
          if (_this.tileLayerCrsIsWgs84) {
            srs = "EPSG:4326";
            bbox = tileLeftBottomWgs.concat(tileRightTopWgs);
            center = tileCenterWgs;
          } else {
            srs = "EPSG:3857";
            let tileLeftBottomMkt = _this.$utilCoord.wgs84ToWebMkt(
              tileLeftBottomWgs[0],
              tileLeftBottomWgs[1]
            );
            let tileRightTopMkt = _this.$utilCoord.wgs84ToWebMkt(
              tileRightTopWgs[0],
              tileRightTopWgs[1]
            );
            bbox = tileLeftBottomMkt.concat(tileRightTopMkt);
            center = _this.$utilCoord.wgs84ToWebMkt(
              tileCenterWgs[0],
              tileCenterWgs[1]
            );
          }
          let parameters = {
            service: "WMS",
            srs: srs,
            width: tileWidth,
            height: tileHeight,
            bbox: bbox,
            center: center,
            zoom: zoom,
            organKind: _this.getOrganKindByMapZoom(zoom)
          };
          const resolve = (val) => {
            tileUrl = val;
          };
          _this.$emit(
            "currentTileUrl",
            {
              ...parameters,
              URLParameters: _this.$utilStr.objToParameter(parameters)
            },
            resolve
          );
        }
        return tileUrl;
      };
      _this.map.addTileLayer(tileLayer);
    },
    // 根据地图级别获取机构层级
    getOrganKindByMapZoom(val) {
      if (val <= this.mapRegionZoomRange.country[1]) {
        return this.$global.dictItem.orgLevel.gab;
      } else if (val <= this.mapRegionZoomRange.province[1]) {
        return this.$global.dictItem.orgLevel.st;
      } else if (val <= this.mapRegionZoomRange.city[1]) {
        return this.$global.dictItem.orgLevel.sj;
      } else if (val <= this.mapRegionZoomRange.district[1]) {
        return this.$global.dictItem.orgLevel.fj;
      } else if (val <= this.mapRegionZoomRange.town[1]) {
        return this.$global.dictItem.orgLevel.pcs;
      } else if (val <= this.mapRegionZoomRange.street[1]) {
        return this.$global.dictItem.orgLevel.zrq;
      }
    },
    // 设置点和热力图
    setMarkerAndHeatmap() {
      let _this = this;
      if (_this.erdMarkerAndHeatmap) {
        _this.erdMarkerAndHeatmap.removeListener(
          _this.wrapperElement,
          _this.setMarkerAndHeatmap
        );
        _this.erdMarkerAndHeatmap = null;
      }
      _this.map.checkResize();
      if (!_this.keepKeywordSearchAlive) {
        _this.clearKeywordSearch();
      }
      if (_this.heatmap) {
        if (_this.showMarker) {
          if (_this.clusterer) {
            _this.setMarkerClusterer();
          } else {
            _this.setMarkerOverlay();
          }
        }
        _this.setMarkerHeatmap();
      } else {
        if (_this.clusterer) {
          _this.setMarkerClusterer();
        } else {
          _this.setMarkerOverlay();
        }
      }
    },
    // 设置点
    setMarker() {
      let _this = this;
      if (_this.erdMarker) {
        _this.erdMarker.removeListener(_this.wrapperElement, _this.setMarker);
        _this.erdMarker = null;
      }
      _this.map.checkResize();
      if (!_this.keepKeywordSearchAlive) {
        _this.clearKeywordSearch();
      }
      if (_this.clusterer) {
        _this.setMarkerClusterer();
      } else {
        _this.setMarkerOverlay();
      }
    },
    // 设置热力图
    setHeatmap() {
      let _this = this;
      if (_this.erdHeatmap) {
        _this.erdHeatmap.removeListener(_this.wrapperElement, _this.setHeatmap);
        _this.erdHeatmap = null;
      }
      _this.map.checkResize();
      _this.setMarkerHeatmap();
    },
    // 设置点标记
    setMarkerOverlay() {
      let _this = this;
      _this.clearMarker();
      if (!_this.drawing) {
        let pointArr = [];
        let markers = [];
        _this.currentMarkers.forEach((e) => {
          let pt = new BMap.Point(e.lng, e.lat);
          pointArr.push(pt);
          let currentIcon;
          if (e.icon) {
            currentIcon = _this.getMapIcon(e.icon, e.iconOptions);
          } else if (_this.icon) {
            currentIcon = _this.getMapIcon(_this.icon, _this.iconOptions);
          }
          let mk = new BMap.Marker(pt, { icon: currentIcon });
          markers.push(mk);
          _this.map.addOverlay(mk);
          if (e.label) {
            _this.setMarkerLabel(mk, e);
          }
          if (e.popover) {
            _this.setMarkerInfoWindow(mk, e);
          }
          if (e.title) {
            _this.setMarkerTitle(mk, e);
          }
          if (e.dragging) {
            _this.setMarkerDragging(mk, e, _this.draggingComplete);
          }
          if (e.onclick) {
            _this.setMarkerClick(mk, e);
          }
          if (e.ondblclick) {
            _this.setMarkerDblclick(mk, e);
          }
          if (e.contextmenu) {
            _this.setMarkerContextmenu(mk, e);
          }
        });
        _this.currentMarkersTarget = markers;
        _this.currentMarkerViewDataset = pointArr;
        if (_this.markerAutoView) {
          _this.setBestView(_this.currentMarkerViewDataset);
        }
        if (_this.connection) {
          _this.setConnection(pointArr);
          if (_this.connectionPlay) {
            _this.setLuShu(
              "_this.connectionLuShu",
              pointArr,
              _this.activeConnectionPlayOptions
            );
          }
        }
        _this.$emit(
          "currentMarkerComplete",
          _this.currentMarkers,
          _this.currentMarkersTarget,
          _this.map
        );
      } else {
        _this.drawing = false;
      }
    },
    // 设置点聚合
    setMarkerClusterer() {
      let _this = this;
      _this.clearMarker();
      if (_this.online) {
        MP.mc()
          .then(() => {
            instantiation();
          })
          .catch((error) => {
            console.error(error);
            _this.$message({
              showClose: true,
              customClass: "is-wrap",
              message: "点聚合实例化失败",
              type: "error",
              offset: 76
            });
          });
      } else {
        MP.offline_mc(_this.offlineURL)
          .then(() => {
            instantiation();
          })
          .catch((error) => {
            console.error(error);
            _this.$message({
              showClose: true,
              customClass: "is-wrap",
              message: "点聚合实例化失败",
              type: "error",
              offset: 76
            });
          });
      }
      function instantiation() {
        _this.clearMarker();
        if (!_this.markerClusterer) {
          _this.markerClusterer = new BMapLib.MarkerClusterer(_this.map, {
            markers: [], // 要聚合的标记数组
            girdSize: 60, // 聚合计算时网格的像素大小
            maxZoom: _this.activeMaxZoom - 1, // 最大的聚合级别
            minClusterSize: 2, // 最小的聚合数量
            isAverangeCenter: false, // 聚合点的落脚位置是否是所有聚合在内点的平均值, 否则落脚在聚合内的第一个点，
            styles: [] // 自定义聚合后的图标风格
          });
        }
        if (!_this.drawing) {
          let pointArr = [];
          let clusterMarkers = [];
          let overlayMarkers = [];
          let allMarkers = [];
          _this.currentMarkers.forEach((e) => {
            let pt = new BMap.Point(e.lng, e.lat);
            pointArr.push(pt);
            let currentIcon;
            if (e.icon) {
              currentIcon = _this.getMapIcon(e.icon, e.iconOptions);
            } else if (_this.icon) {
              currentIcon = _this.getMapIcon(_this.icon, _this.iconOptions);
            }
            let mk = new BMap.Marker(pt, { icon: currentIcon });
            if (!_this.$utilStr.isExist(e.clustering)) {
              e.clustering = true;
            }
            if (_this.$utilStr.parseBoolean(e.clustering)) {
              mk.isCluster = true;
              clusterMarkers.push(mk);
              allMarkers.push(mk);
            } else {
              mk.isCluster = false;
              overlayMarkers.push(mk);
              allMarkers.push(mk);
              _this.map.addOverlay(mk);
            }
            if (e.label) {
              _this.setMarkerLabel(mk, e);
            }
            if (e.popover) {
              _this.setMarkerInfoWindow(mk, e);
            }
            if (e.title) {
              _this.setMarkerTitle(mk, e);
            }
            if (e.dragging) {
              _this.setMarkerDragging(mk, e, _this.draggingComplete);
            }
            if (e.onclick) {
              _this.setMarkerClick(mk, e);
            }
            if (e.ondblclick) {
              _this.setMarkerDblclick(mk, e);
            }
            if (e.contextmenu) {
              _this.setMarkerContextmenu(mk, e);
            }
          });
          _this.currentClustererTarget = clusterMarkers;
          _this.currentMarkersTarget = overlayMarkers;
          _this.currentMarkerViewDataset = pointArr;
          if (_this.markerAutoView) {
            _this.setBestView(_this.currentMarkerViewDataset);
          }
          _this.markerClusterer.addMarkers(
            _this.currentClustererTarget,
            function () {
              if (_this.connection) {
                _this.setConnection(pointArr);
                if (_this.connectionPlay) {
                  _this.setLuShu(
                    "_this.connectionLuShu",
                    pointArr,
                    _this.activeConnectionPlayOptions
                  );
                }
              }
              _this.$emit(
                "currentMarkerComplete",
                _this.currentMarkers,
                allMarkers,
                _this.map
              );
            }
          );
        } else {
          _this.drawing = false;
        }
      }
    },
    // 设置点热力图
    setMarkerHeatmap() {
      let _this = this;
      let cvs = document.createElement("canvas");
      if (!(cvs.getContext && cvs.getContext("2d"))) {
        this.$message({
          showClose: true,
          message: "您的浏览器暂不支持热力图",
          type: "warning",
          offset: 76
        });
      } else {
        _this.clearHeatmap();
        if (_this.online) {
          MP.hm()
            .then(() => {
              instantiation();
            })
            .catch((error) => {
              console.error(error);
              _this.$message({
                showClose: true,
                customClass: "is-wrap",
                message: "热力图实例化失败",
                type: "error",
                offset: 76
              });
            });
        } else {
          MP.offline_hm(_this.offlineURL)
            .then(() => {
              instantiation();
            })
            .catch((error) => {
              console.error(error);
              _this.$message({
                showClose: true,
                customClass: "is-wrap",
                message: "热力图实例化失败",
                type: "error",
                offset: 76
              });
            });
        }
        function instantiation() {
          _this.clearHeatmap();
          if (!_this.drawing) {
            if (_this.heatmap) {
              if (!_this.heatmapOverlay) {
                _this.heatmapOverlay = new BMapLib.HeatmapOverlay({
                  radius: 20,
                  visible: true,
                  gradient: _this.activeGradient
                });
              }
              _this.map.addOverlay(_this.heatmapOverlay);
              _this.heatmapOverlay.setDataSet({
                data: _this.currentMarkers,
                max: _this.activeMaxWeight
              });
            }
          } else {
            _this.drawing = false;
          }
        }
      }
    },
    // 标注点设置文本标注
    setMarkerLabel(mk, val) {
      let labelStyle = {
        ...this.overlayStyle.label
      };
      let labelWidth;
      let labelHeight;
      let labelMaxWidth = 320;
      let labelPaddingWidth = 12;
      let labelPaddingHeight = 6;
      let labelLineHeight = 16;
      if (this.$utilElem.isHTMLElement(val.label)) {
        let d = document.createElement("div");
        d.appendChild(val.label);
        for (let attr in labelStyle) {
          if (labelStyle.hasOwnProperty(attr)) {
            d.style[attr] = labelStyle[attr];
          }
        }
        d.style.display = "inline-block";
        this.boxElement.appendChild(d);
        if (d.offsetWidth > labelMaxWidth) {
          d.style.width = labelMaxWidth + "px";
          labelStyle.width = labelMaxWidth + "px";
          labelStyle.whiteSpace = "normal";
        }
        labelWidth = d.offsetWidth;
        labelHeight = d.offsetHeight;
        d.remove();
      } else if (this.$utilElem.isHTMLStr(val.label)) {
        let d = document.createElement("div");
        d.innerHTML = val.label;
        for (let attr in labelStyle) {
          if (labelStyle.hasOwnProperty(attr)) {
            d.style[attr] = labelStyle[attr];
          }
        }
        d.style.display = "inline-block";
        this.boxElement.appendChild(d);
        if (d.offsetWidth > labelMaxWidth) {
          d.style.width = labelMaxWidth + "px";
          labelStyle.width = labelMaxWidth + "px";
          labelStyle.whiteSpace = "normal";
        }
        labelWidth = d.offsetWidth;
        labelHeight = d.offsetHeight;
        d.remove();
      } else {
        let cvs = document.createElement("canvas");
        let cxt = cvs.getContext("2d");
        cxt.font = labelStyle.fontSize + " " + labelStyle.fontFamily;
        let labelTextWidth = cxt.measureText(val.label).width;
        let labelTextLines = Math.ceil(
          labelTextWidth / (labelMaxWidth - labelPaddingWidth)
        );
        let labelTextHeight = labelTextLines * labelLineHeight;
        labelHeight = labelTextHeight + labelPaddingHeight;
        if (labelTextLines > 1) {
          labelWidth = labelMaxWidth;
          labelStyle.width = labelMaxWidth + "px";
          labelStyle.whiteSpace = "normal";
        } else {
          labelWidth = labelTextWidth + labelPaddingWidth;
        }
      }
      let mkIcon = mk.getIcon();
      let mkIconName = mkIcon.name;
      if (mkIconName) {
        mkIconName = mkIconName.replace(new RegExp(this.iconPrefix), "");
      }
      if (!val.labelColor) {
        val.labelColor = "default";
      } else {
        if (val.labelColor !== "default") {
          if (val.labelColor === "auto") {
            labelStyle.backgroundColor =
              this.iconColorOptions[mkIconName] ||
              this.iconColorOptions["default"];
          } else {
            labelStyle.backgroundColor = val.labelColor;
          }
        }
      }
      let mkIconAnchor = mkIcon.anchor;
      let mkIconSize = mkIcon.size;
      let mkIconAnchorWidth = mkIconAnchor.width;
      let mkIconAnchorHeight = mkIconAnchor.height;
      let mkIconHeight = mkIconSize.height;
      let mkIconRealHeight = !isNaN(parseFloat(mkIcon.realHeight))
        ? mkIcon.realHeight
        : mkIconHeight;
      let label = new BMap.Label(val.label, {
        offset: new BMap.Size(
          mkIconAnchorWidth,
          (mkIconHeight / 2 !== mkIconAnchorHeight
            ? -labelHeight + mkIconHeight - mkIconRealHeight
            : -labelHeight + (mkIconHeight - mkIconRealHeight) / 2) -
            labelPaddingHeight
        )
      });
      label.setStyle(labelStyle);
      mk.setLabel(label);
      if (!val.labelTrigger) {
        val.labelTrigger = "always";
      }
      if (val.labelTrigger === "hover") {
        label.setStyle({ display: "none" });
        mk.addEventListener("mouseover", this.handleMarkerMouseoverShowLabel);
        mk.addEventListener("mouseout", this.handleMarkerMouseoutHideLabel);
      }
    },
    // 标注点设置信息窗口
    setMarkerInfoWindow(mk, val) {
      let _this = this;
      if (!val.title) {
        mk.setTitle("点击查看详情");
      }
      mk.addEventListener("click", function (e) {
        _this.handleMarkerClickOpenInfoWindow(e, val);
      });
    },
    // 标注点鼠标移入显示文本标注
    handleMarkerMouseoverShowLabel(e) {
      let label = e.target.getLabel();
      label.setStyle({ display: "block" });
    },
    // 标注点鼠标移出隐藏文本标注
    handleMarkerMouseoutHideLabel(e) {
      let label = e.target.getLabel();
      label.setStyle({ display: "none" });
    },
    // 标注点鼠标点击打开信息窗口
    handleMarkerClickOpenInfoWindow(e, val) {
      let _this = this;
      let mk = e.target;
      let mkIcon = mk.getIcon();
      let mkIconAnchor = mkIcon.anchor;
      let mkIconSize = mkIcon.size;
      let mkIconAnchorHeight = mkIconAnchor.height;
      let mkIconHeight = mkIconSize.height;
      let mkIconRealHeight = !isNaN(parseFloat(mkIcon.realHeight))
        ? mkIcon.realHeight
        : mkIconHeight;
      this.setInfoWindow(
        val.popover,
        val.popoverClass || "marker",
        new BMap.Size(
          0,
          mkIconHeight / 2 !== mkIconAnchorHeight
            ? mkIconRealHeight - mkIconHeight + mkIconAnchorHeight
            : mkIconRealHeight / 2
        ),
        function (info) {
          info.addEventListener("open", function (e) {
            if (_this.openHideLabel) {
              let label = mk.getLabel();
              if (label) {
                label.setStyle({ display: "none" });
              }
            }
            if (val.onopen) {
              _this.$emit(val.onopen, val, mk, e);
            }
          });
          info.addEventListener("close", function (e) {
            if (_this.openHideLabel) {
              let label = mk.getLabel();
              if (label) {
                if (val.labelTrigger !== "hover") {
                  label.setStyle({ display: "block" });
                }
              }
            }

            if (val.onclose) {
              _this.$emit(val.onopen, val, mk, e);
            }
          });
          info.open(mk);
        }
      );
    },
    // 标注点设置文字提示
    setMarkerTitle(mk, val) {
      mk.setTitle(val.title);
    },
    // 标注点开启拖拽功能
    setMarkerDragging(mk, val, callback) {
      let _this = this;
      if (!val.title) {
        mk.setTitle("长按坐标点可拖动调整位置");
      }
      mk.enableDragging();
      mk.addEventListener("dragend", function (e) {
        val.lng = e.point.lng;
        val.lat = e.point.lat;
        let location = {
          address: "",
          addressComponents: {
            city: "",
            district: "",
            province: "",
            street: "",
            streetNumber: ""
          },
          business: "",
          point: e.point,
          surroundingPois: []
        };
        _this
          .getLocation(e.point)
          .then((rs) => {
            if (rs) location = rs;
          })
          .finally(() => {
            if (callback) {
              callback(val, mk, e, location);
            }
            _this.$emit(
              "currentMarkerDragend",
              Object.assign(location, val),
              mk,
              e
            );
          });
      });
    },
    // 标注点拖拽完成
    draggingComplete(val, mk, e, location) {
      let _this = this;
      let locations = _this.currentMarkers.map((e) => {
        if (e.lng === location.point.lng && e.lat === location.point.lat) {
          return location;
        }
      });
      _this.$emit("update:markers", _this.currentMarkers);
      _this.$emit("currentMarkerChanged", _this.currentMarkers, locations);
    },
    // 标注点设置点击事件
    setMarkerClick(mk, val) {
      let _this = this;
      mk.addEventListener("click", function (e) {
        if (val.ondblclick) {
          clearTimeout(_this.timer.markerClick);
          if (event.detail === 2) return;
          _this.timer.markerClick = setTimeout(() => {
            _this.$emit(val.onclick, val, mk, e);
          }, 500);
        } else {
          _this.$emit(val.onclick, val, mk, e);
        }
      });
    },
    // 标注点设置双击事件
    setMarkerDblclick(mk, val) {
      let _this = this;
      mk.addEventListener("dblclick", function (e) {
        if (val.onclick) clearTimeout(_this.timer.markerClick);
        _this.$emit(val.ondblclick, val, mk, e);
      });
    },
    // 标注点设置右键菜单
    setMarkerContextmenu(mk, val) {
      let _this = this;
      if (Array.isArray(val.contextmenu)) {
        let markerMenu = new BMap.ContextMenu();
        val.contextmenu.forEach((item, i) => {
          let fn = function (value, point, offset, marker) {
            _this.$emit(value.oncontextmenu[i], value, marker);
          };
          markerMenu.addItem(new BMap.MenuItem(item, fn.bind(mk, val)));
        });
        // 给标注点添加右键菜单
        mk.addContextMenu(markerMenu);
      }
    },
    // 设置点连线
    setConnection(path) {
      let _this = this;
      if (path && path.length > 1) {
        let connectionStyle;
        if (_this.online && _this.connectionSequence) {
          connectionStyle = {
            ..._this.overlayStyle.connection,
            strokeWeight: 4,
            icons: [new BMap.IconSequence(_this.mapIcon.arrow, "10", "30")]
          };
          instantiation();
        } else {
          connectionStyle = {
            ..._this.overlayStyle.connection
          };
          instantiation();
        }
        function instantiation() {
          let polyline = new BMap.Polyline(path, connectionStyle);
          _this.map.addOverlay(polyline);
          _this.currentConnectionTarget = polyline;
        }
      }
    },
    // 设置折线
    setPolyline() {
      let _this = this;
      if (_this.erdPolyline) {
        _this.erdPolyline.removeListener(
          _this.wrapperElement,
          _this.setPolyline
        );
        _this.erdPolyline = null;
      }
      _this.map.checkResize();
      if (!_this.keepKeywordSearchAlive) {
        _this.clearKeywordSearch();
      }
      _this.clearPolyline();
      if (!_this.drawing) {
        let pointArr = [];
        let multi = [];
        let single = [];
        let polylineStyle;
        _this.currentPolylinePath.forEach((path) => {
          if (Array.isArray(path)) {
            single = [];
            path.forEach((p) => {
              let pt = new BMap.Point(p.lng, p.lat);
              single.push(pt);
            });
            multi.push(single);
            pointArr = pointArr.concat(single);
            if (!_this.currentPolylineMatrix)
              _this.currentPolylineMatrix = true;
          } else {
            let pt = new BMap.Point(path.lng, path.lat);
            single.push(pt);
            if (_this.currentPolylineMatrix)
              _this.currentPolylineMatrix = false;
          }
        });
        if (multi.length === 0 && single.length > 0) {
          multi.push(single);
          pointArr = pointArr.concat(single);
        }
        if (multi.length > 0) {
          let showDisableEditingTitle = false;
          if (
            Array.isArray(this.polylineEditing) &&
            this.polylineEditing.length > 0 &&
            this.polylineEditingTrigger === "click"
          ) {
            showDisableEditingTitle = true;
          }
          if (
            _this.polylineEditing.toString().includes("true") &&
            _this.polylineEditingTrigger === "click" &&
            _this.$utilStr.isEmpty(_this.currentPolylineDefEdiIndex)
          ) {
            _this.setPolylineDefEdiIndex(multi);
          }
          if (_this.online && _this.polylineSequence) {
            polylineStyle = {
              ..._this.overlayStyle.polyline,
              strokeWeight: 4,
              icons: [new BMap.IconSequence(_this.mapIcon.arrow, "10", "30")]
            };
            multi.forEach((path, i) => {
              polylineStyle.strokeColor =
                _this.currentPolylineColor[i] ||
                _this.overlayStyle.polyline.strokeColor;
              instantiation(path, i);
            });
          } else {
            polylineStyle = {
              ..._this.overlayStyle.polyline
            };
            multi.forEach((path, i) => {
              polylineStyle.strokeColor =
                _this.currentPolylineColor[i] ||
                _this.overlayStyle.polyline.strokeColor;
              instantiation(path, i);
            });
          }
          function instantiation(path, i) {
            let polyline = new BMap.Polyline(path, polylineStyle);
            // 添加折线
            _this.map.addOverlay(polyline);
            // 设置可编辑
            if (_this.validatePolylineEditing(i)) {
              _this.setPolylineEditing(polyline, i);
            } else if (showDisableEditingTitle) {
              _this.setGraphicDisableEditingTitle(polyline);
            }
            _this.currentPolylineTarget.push(polyline);
            if (_this.polylinePlay) {
              _this.setLuShu(
                "_this.polylineLuShu[" + i + "]",
                path,
                _this.activePolylinePlayOptions
              );
            }
          }
        }
        _this.currentPolylineViewDataset = pointArr;
        if (_this.polylineAutoView) {
          _this.setBestView(_this.currentPolylineViewDataset);
        }
        _this.$emit(
          "currentPolylineComplete",
          multi,
          _this.currentPolylineTarget,
          _this.map
        );
      } else {
        _this.drawing = false;
      }
    },
    // 设置折线可编辑
    setPolylineEditing(polyline, i) {
      let _this = this;
      if (polyline) {
        beforeEnableEditing(polyline, i);
      } else {
        if (_this.currentPolylineTarget.length > 0) {
          let showDisableEditingTitle = false;
          if (
            Array.isArray(this.polylineEditing) &&
            this.polylineEditing.length > 0 &&
            this.polylineEditingTrigger === "click"
          ) {
            showDisableEditingTitle = true;
          }
          if (
            _this.polylineEditing.toString().includes("true") &&
            _this.polylineEditingTrigger === "click"
          ) {
            _this.setPolylineDefEdiIndex(_this.currentPolylineTarget);
          }
          _this.currentPolylineTarget.forEach((polyline, i) => {
            if (_this.validatePolylineEditing(i)) {
              beforeEnableEditing(polyline, i);
            } else {
              polyline.disableEditing();
              if (showDisableEditingTitle) {
                _this.setGraphicDisableEditingTitle(polyline);
              }
            }
          });
        }
      }
      function beforeEnableEditing(polyline, i) {
        if (
          !_this.polylineEditingTrigger ||
          _this.polylineEditingTrigger === "always"
        ) {
          enableEditing(polyline, i);
        } else if (_this.polylineEditingTrigger === "click") {
          _this.setGraphicEnableEditingTitle(polyline);
          if (i === _this.currentPolylineDefEdiIndex) {
            enableEditing(polyline, i);
          }
          polyline.addEventListener("click", function (e) {
            if (i !== _this.currentPolylineDefEdiIndex) {
              _this.currentPolylineDefEdiIndex = i;
              _this.currentPolylineTarget.forEach((t) => {
                t.disableEditing();
              });
              enableEditing(e.target, i);
            }
          });
        }
      }
      function enableEditing(polyline, i) {
        if (_this.colorPicker) {
          _this.currentDrawingColor = polyline.getStrokeColor();
        }
        polyline.enableEditing();
        setTimeout(() => {
          polyline.addEventListener("lineupdate", function (e) {
            if (_this.colorPicker) {
              let activePolylineColor = e.target.getStrokeColor();
              let currentPolylineColor =
                _this.currentPolylineColor[i] ||
                _this.overlayStyle.polyline.strokeColor;
              if (
                activePolylineColor.toLowerCase() !==
                currentPolylineColor.toLowerCase()
              ) {
                updatePolylineColor(e, i);
              } else {
                updatePolylinePath(e, i);
              }
            } else {
              updatePolylinePath(e, i);
            }
          });
        });
      }
      function updatePolylineColor(e, i) {
        _this.currentPolylineColor[i] = e.target.getStrokeColor();
        _this.$emit("update:polylineColor", _this.currentPolylineColor);
      }
      function updatePolylinePath(e, i) {
        if (_this.currentPolylineMatrix) {
          _this.currentPolylinePath.splice(i, 1, e.target.getPath());
        } else {
          _this.currentPolylinePath = e.target.getPath();
        }
        _this.$emit("update:polylinePath", _this.currentPolylinePath);
        _this.$emit("currentPolylineChanged", _this.currentPolylinePath);
      }
    },
    // 设置默认可编辑折线索引
    setPolylineDefEdiIndex(array) {
      if (!Array.isArray(this.polylineEditing)) {
        this.currentPolylineDefEdiIndex = array.length - 1;
      } else {
        for (let i = array.length - 1; i >= 0; i--) {
          if (this.polylineEditing[i]) {
            this.currentPolylineDefEdiIndex = i;
            break;
          }
        }
      }
    },
    // 校验折线可编辑
    validatePolylineEditing(i) {
      let activePolylineEditing = false;
      if (!Array.isArray(this.polylineEditing)) {
        if (this.polylineEditing) activePolylineEditing = true;
      } else {
        if (this.polylineEditing[i]) activePolylineEditing = true;
      }
      return activePolylineEditing;
    },
    // 设置圆
    setCircle() {
      let _this = this;
      if (_this.erdCircle) {
        _this.erdCircle.removeListener(_this.wrapperElement, _this.setCircle);
        _this.erdCircle = null;
      }
      _this.map.checkResize();
      if (!_this.keepKeywordSearchAlive) {
        _this.clearKeywordSearch();
      }
      _this.clearCircle();
      if (!_this.drawing) {
        let pointArr = [];
        if (_this.currentCirclePath.length > 0) {
          let showDisableEditingTitle = false;
          if (
            Array.isArray(this.circleEditing) &&
            this.circleEditing.length > 0 &&
            this.circleEditingTrigger === "click"
          ) {
            showDisableEditingTitle = true;
          }
          if (
            _this.circleEditing.toString().includes("true") &&
            _this.circleEditingTrigger === "click" &&
            _this.$utilStr.isEmpty(_this.currentCircleDefEdiIndex)
          ) {
            _this.setCircleDefEdiIndex(_this.currentCirclePath);
          }
          let graphicStyle = _this.setGraphicStyle();
          _this.currentCirclePath.forEach((path, i) => {
            graphicStyle.fillColor =
              _this.currentCircleColor[i] ||
              _this.overlayStyle.graphic.fillColor;
            graphicStyle.strokeColor =
              _this.currentCircleColor[i] ||
              _this.overlayStyle.graphic.strokeColor;
            let pt = new BMap.Point(path.lng, path.lat);
            let circle = new BMap.Circle(pt, path.radius, graphicStyle);
            // 添加圆
            _this.map.addOverlay(circle);
            // 添加标签
            if (_this.circleLabel[i]) {
              let activeCircleLabelTrigger = "always";
              if (!Array.isArray(_this.circleLabelTrigger)) {
                if (_this.circleLabelTrigger)
                  activeCircleLabelTrigger = _this.circleLabelTrigger;
              } else {
                if (_this.circleLabelTrigger[i])
                  activeCircleLabelTrigger = _this.circleLabelTrigger[i];
              }
              let label = _this.setGraphicLabel(
                circle,
                _this.circleLabel[i],
                activeCircleLabelTrigger,
                _this.currentCircleColor[i]
              );
              _this.currentCircleLabelTarget.push(label);
            }
            // 添加信息窗口
            if (_this.circlePopover[i]) {
              _this.setCirclePopover(circle, i);
            }
            // 设置可编辑
            if (_this.validateCircleEditing(i)) {
              _this.setCircleEditing(circle, i);
            } else if (showDisableEditingTitle) {
              _this.setGraphicDisableEditingTitle(circle);
            }
            _this.currentCircleTarget.push(circle);
            pointArr = pointArr.concat(circle.getPath());
          });
        }
        _this.currentCircleViewDataset = pointArr;
        if (_this.circleAutoView) {
          _this.setBestView(_this.currentCircleViewDataset);
        }
        _this.$emit(
          "currentCircleComplete",
          _this.currentCirclePath,
          _this.currentCircleTarget,
          _this.map
        );
      } else {
        _this.drawing = false;
      }
    },
    // 设置圆信息窗口
    setCirclePopover(circle, i) {
      let _this = this;
      if (circle) {
        createCirclePopover(circle, i);
      } else {
        _this.clearInfoBox();
        if (_this.currentCircleTarget.length > 0) {
          _this.currentCircleTarget.forEach((circle, i) => {
            createCirclePopover(circle, i);
          });
        }
      }
      function createCirclePopover(circle, i) {
        _this.setGraphicInfoWindow(
          circle,
          _this.circlePopover[i],
          function (info) {
            info.addEventListener("open", function (e) {
              _this.$emit(
                "currentCirclePopoverOpened",
                _this.circlePopover[i],
                i,
                e
              );
            });
          }
        );
        if (_this.currentCircleLabelTarget[i]) {
          _this.setGraphicLabelInfoWindow(
            circle,
            _this.currentCircleLabelTarget[i],
            _this.circlePopover[i],
            function (info) {
              info.addEventListener("open", function (e) {
                _this.$emit(
                  "currentCirclePopoverOpened",
                  _this.circlePopover[i],
                  i,
                  e
                );
              });
            }
          );
        }
      }
    },
    // 设置圆可编辑
    setCircleEditing(circle, i) {
      let _this = this;
      if (circle) {
        beforeEnableEditing(circle, i);
      } else {
        if (_this.currentCircleTarget.length > 0) {
          let showDisableEditingTitle = false;
          if (
            Array.isArray(this.circleEditing) &&
            this.circleEditing.length > 0 &&
            this.circleEditingTrigger === "click"
          ) {
            showDisableEditingTitle = true;
          }
          if (
            _this.circleEditing.toString().includes("true") &&
            _this.circleEditingTrigger === "click"
          ) {
            _this.setCircleDefEdiIndex(_this.currentCircleTarget);
          }
          _this.currentCircleTarget.forEach((circle, i) => {
            if (_this.validateCircleEditing(i)) {
              beforeEnableEditing(circle, i);
            } else {
              circle.disableEditing();
              if (showDisableEditingTitle) {
                _this.setGraphicDisableEditingTitle(circle);
              }
            }
          });
        }
      }
      function beforeEnableEditing(circle, i) {
        if (
          !_this.circleEditingTrigger ||
          _this.circleEditingTrigger === "always"
        ) {
          enableEditing(circle, i);
        } else if (_this.circleEditingTrigger === "click") {
          _this.setGraphicEnableEditingTitle(circle);
          if (i === _this.currentCircleDefEdiIndex) {
            enableEditing(circle, i);
          }
          circle.addEventListener("click", function (e) {
            if (i !== _this.currentCircleDefEdiIndex) {
              _this.currentCircleDefEdiIndex = i;
              _this.currentCircleTarget.forEach((t) => {
                t.disableEditing();
              });
              enableEditing(e.target, i);
            }
          });
        }
      }
      function enableEditing(circle, i) {
        if (_this.colorPicker) {
          _this.currentDrawingColor = circle.getFillColor();
        }
        circle.enableEditing();
        setTimeout(() => {
          let lineUpdateCount = 0;
          let dragendCount = 0;
          circle.addEventListener("lineupdate", function (e) {
            if (!_this.graphicStyleZoomUpdating) {
              lineUpdateCount++;
              dragendCount++;
              if (lineUpdateCount === 1) {
                if (_this.colorPicker) {
                  let activeCircleColor = e.target.getFillColor();
                  let currentCircleColor =
                    _this.currentCircleColor[i] ||
                    _this.overlayStyle.graphic.fillColor;
                  if (
                    activeCircleColor.toLowerCase() !==
                    currentCircleColor.toLowerCase()
                  ) {
                    updateCircleColor(e, i);
                  }
                }
              } else {
                lineUpdateCount = 0;
              }
              if (dragendCount === 1) {
                let vertex;
                for (let k in e.target) {
                  if (e.target.hasOwnProperty(k)) {
                    if (Array.isArray(e.target[k])) {
                      for (let v of e.target[k]) {
                        if (v && v.Lb && v.Lb === "overlay") {
                          vertex = e.target[k];
                          break;
                        }
                      }
                    }
                    if (vertex) {
                      break;
                    }
                  }
                }
                vertex[0].addEventListener("dragend", function () {
                  updateCirclePath(e, i);
                  dragendCount = 0;
                });
                vertex[1].addEventListener("dragend", function () {
                  updateCirclePath(e, i);
                  dragendCount = 0;
                });
              }
            }
          });
        });
      }
      function updateCircleColor(e, i) {
        _this.currentCircleColor[i] = e.target.getFillColor();
        _this.$emit("update:circleColor", _this.currentCircleColor);
        if (
          _this.currentCircleLabelTarget[i] &&
          _this.currentCircleLabelTarget[i].V
        ) {
          _this.currentCircleLabelTarget[i].V.style.backgroundColor =
            _this.currentCircleColor[i];
        }
      }
      function updateCirclePath(e, i) {
        _this.currentCirclePath.splice(i, 1, {
          ...e.target.getCenter(),
          radius: e.target.getRadius()
        });
        _this.$emit("update:circlePath", _this.currentCirclePath);
        _this.$emit("currentCircleChanged", _this.currentCirclePath);
      }
    },
    // 设置默认可编辑圆索引
    setCircleDefEdiIndex(array) {
      if (!Array.isArray(this.circleEditing)) {
        this.currentCircleDefEdiIndex = array.length - 1;
      } else {
        for (let i = array.length - 1; i >= 0; i--) {
          if (this.circleEditing[i]) {
            this.currentCircleDefEdiIndex = i;
            break;
          }
        }
      }
    },
    // 校验圆可编辑
    validateCircleEditing(i) {
      let activeCircleEditing = false;
      if (!Array.isArray(this.circleEditing)) {
        if (this.circleEditing) activeCircleEditing = true;
      } else {
        if (this.circleEditing[i]) activeCircleEditing = true;
      }
      return activeCircleEditing;
    },
    // 设置多边形
    setPolygon() {
      let _this = this;
      if (_this.erdPolygon) {
        _this.erdPolygon.removeListener(_this.wrapperElement, _this.setPolygon);
        _this.erdPolygon = null;
      }
      _this.map.checkResize();
      if (!_this.keepKeywordSearchAlive) {
        _this.clearKeywordSearch();
      }
      _this.clearPolygon();
      if (!_this.drawing) {
        let pointArr = [];
        let multi = [];
        let single = [];
        _this.currentPolygonPath.forEach((path) => {
          if (Array.isArray(path)) {
            single = [];
            path.forEach((p) => {
              let pt = new BMap.Point(p.lng, p.lat);
              single.push(pt);
            });
            multi.push(single);
            pointArr = pointArr.concat(single);
            if (!_this.currentPolygonMatrix) _this.currentPolygonMatrix = true;
          } else {
            let pt = new BMap.Point(path.lng, path.lat);
            single.push(pt);
            if (_this.currentPolygonMatrix) _this.currentPolygonMatrix = false;
          }
        });
        if (multi.length === 0 && single.length > 0) {
          multi.push(single);
          pointArr = pointArr.concat(single);
        }
        if (multi.length > 0) {
          let showDisableEditingTitle = false;
          if (
            Array.isArray(this.polygonEditing) &&
            this.polygonEditing.length > 0 &&
            this.polygonEditingTrigger === "click"
          ) {
            showDisableEditingTitle = true;
          }
          if (
            _this.polygonEditing.toString().includes("true") &&
            _this.polygonEditingTrigger === "click" &&
            _this.$utilStr.isEmpty(_this.currentPolygonDefEdiIndex)
          ) {
            _this.setPolygonDefEdiIndex(multi);
          }
          let graphicStyle = _this.setGraphicStyle();
          multi.forEach((path, i) => {
            graphicStyle.fillColor =
              _this.currentPolygonColor[i] ||
              _this.overlayStyle.graphic.fillColor;
            graphicStyle.strokeColor =
              _this.currentPolygonColor[i] ||
              _this.overlayStyle.graphic.strokeColor;
            let polygon = new BMap.Polygon(path, graphicStyle);
            // 添加多边形
            _this.map.addOverlay(polygon);
            // 添加标签
            if (_this.polygonLabel[i]) {
              let activePolygonLabelTrigger = "always";
              if (!Array.isArray(_this.polygonLabelTrigger)) {
                if (_this.polygonLabelTrigger)
                  activePolygonLabelTrigger = _this.polygonLabelTrigger;
              } else {
                if (_this.polygonLabelTrigger[i])
                  activePolygonLabelTrigger = _this.polygonLabelTrigger[i];
              }
              let label = _this.setGraphicLabel(
                polygon,
                _this.polygonLabel[i],
                activePolygonLabelTrigger,
                _this.currentPolygonColor[i]
              );
              _this.currentPolygonLabelTarget.push(label);
            }
            // 添加信息窗口
            if (_this.polygonPopover[i]) {
              _this.setPolygonPopover(polygon, i);
            }
            // 设置可编辑
            if (_this.validatePolygonEditing(i)) {
              _this.setPolygonEditing(polygon, i);
            } else if (showDisableEditingTitle) {
              _this.setGraphicDisableEditingTitle(polygon);
            }
            _this.currentPolygonTarget.push(polygon);
          });
        }
        _this.currentPolygonViewDataset = pointArr;
        if (_this.polygonAutoView) {
          _this.setBestView(_this.currentPolygonViewDataset);
        }
        _this.$emit(
          "currentPolygonComplete",
          multi,
          _this.currentPolygonTarget,
          _this.map
        );
      } else {
        _this.drawing = false;
      }
    },
    // 设置多边形信息窗口
    setPolygonPopover(polygon, i) {
      let _this = this;
      if (polygon) {
        createPolygonPopover(polygon, i);
      } else {
        _this.clearInfoBox();
        if (_this.currentPolygonTarget.length > 0) {
          _this.currentPolygonTarget.forEach((polygon, i) => {
            createPolygonPopover(polygon, i);
          });
        }
      }
      function createPolygonPopover(polygon, i) {
        _this.setGraphicInfoWindow(
          polygon,
          _this.polygonPopover[i],
          function (info) {
            info.addEventListener("open", function (e) {
              _this.$emit(
                "currentPolygonPopoverOpened",
                _this.polygonPopover[i],
                i,
                e
              );
            });
          }
        );
        if (_this.currentPolygonLabelTarget[i]) {
          _this.setGraphicLabelInfoWindow(
            polygon,
            _this.currentPolygonLabelTarget[i],
            _this.polygonPopover[i],
            function (info) {
              info.addEventListener("open", function (e) {
                _this.$emit(
                  "currentPolygonPopoverOpened",
                  _this.polygonPopover[i],
                  i,
                  e
                );
              });
            }
          );
        }
      }
    },
    // 设置多边形可编辑
    setPolygonEditing(polygon, i) {
      let _this = this;
      if (polygon) {
        beforeEnableEditing(polygon, i);
      } else {
        if (_this.currentPolygonTarget.length > 0) {
          let showDisableEditingTitle = false;
          if (
            Array.isArray(this.polygonEditing) &&
            this.polygonEditing.length > 0 &&
            this.polygonEditingTrigger === "click"
          ) {
            showDisableEditingTitle = true;
          }
          if (
            _this.polygonEditing.toString().includes("true") &&
            _this.polygonEditingTrigger === "click"
          ) {
            _this.setPolygonDefEdiIndex(_this.currentPolygonTarget);
          }
          _this.currentPolygonTarget.forEach((polygon, i) => {
            if (_this.validatePolygonEditing(i)) {
              beforeEnableEditing(polygon, i);
            } else {
              polygon.disableEditing();
              if (showDisableEditingTitle) {
                _this.setGraphicDisableEditingTitle(polygon);
              }
            }
          });
        }
      }
      function beforeEnableEditing(polygon, i) {
        if (
          !_this.polygonEditingTrigger ||
          _this.polygonEditingTrigger === "always"
        ) {
          enableEditing(polygon, i);
        } else if (_this.polygonEditingTrigger === "click") {
          _this.setGraphicEnableEditingTitle(polygon);
          if (i === _this.currentPolygonDefEdiIndex) {
            enableEditing(polygon, i);
          }
          polygon.addEventListener("click", function (e) {
            if (i !== _this.currentPolygonDefEdiIndex) {
              _this.currentPolygonDefEdiIndex = i;
              _this.currentPolygonTarget.forEach((t) => {
                t.disableEditing();
              });
              enableEditing(e.target, i);
            }
          });
        }
      }
      function enableEditing(polygon, i) {
        if (_this.colorPicker) {
          _this.currentDrawingColor = polygon.getFillColor();
        }
        polygon.enableEditing();
        setTimeout(() => {
          let lineUpdateCount = 0;
          polygon.addEventListener("lineupdate", function (e) {
            if (!_this.graphicStyleZoomUpdating) {
              lineUpdateCount++;
              if (lineUpdateCount === 1) {
                if (_this.colorPicker) {
                  let activePolygonColor = e.target.getFillColor();
                  let currentPolygonColor =
                    _this.currentPolygonColor[i] ||
                    _this.overlayStyle.graphic.fillColor;
                  if (
                    activePolygonColor.toLowerCase() !==
                    currentPolygonColor.toLowerCase()
                  ) {
                    updatePolygonColor(e, i);
                  } else {
                    updatePolygonPath(e, i);
                  }
                } else {
                  updatePolygonPath(e, i);
                }
              } else {
                lineUpdateCount = 0;
              }
            }
          });
        });
      }
      function updatePolygonColor(e, i) {
        _this.currentPolygonColor[i] = e.target.getFillColor();
        _this.$emit("update:polygonColor", _this.currentPolygonColor);
        if (
          _this.currentPolygonLabelTarget[i] &&
          _this.currentPolygonLabelTarget[i].V
        ) {
          _this.currentPolygonLabelTarget[i].V.style.backgroundColor =
            _this.currentPolygonColor[i];
        }
      }
      function updatePolygonPath(e, i) {
        if (_this.currentPolygonMatrix) {
          _this.currentPolygonPath.splice(i, 1, e.target.getPath());
        } else {
          _this.currentPolygonPath = e.target.getPath();
        }
        _this.$emit("update:polygonPath", _this.currentPolygonPath);
        _this.$emit("currentPolygonChanged", _this.currentPolygonPath);
      }
    },
    // 设置默认可编辑多边形索引
    setPolygonDefEdiIndex(array) {
      if (!Array.isArray(this.polygonEditing)) {
        this.currentPolygonDefEdiIndex = array.length - 1;
      } else {
        for (let i = array.length - 1; i >= 0; i--) {
          if (this.polygonEditing[i]) {
            this.currentPolygonDefEdiIndex = i;
            break;
          }
        }
      }
    },
    // 校验多边形可编辑
    validatePolygonEditing(i) {
      let activePolygonEditing = false;
      if (!Array.isArray(this.polygonEditing)) {
        if (this.polygonEditing) activePolygonEditing = true;
      } else {
        if (this.polygonEditing[i]) activePolygonEditing = true;
      }
      return activePolygonEditing;
    },
    // 设置平面图形样式
    setGraphicStyle() {
      let graphicStyle = {
        ...this.overlayStyle.graphic
      };
      let fillOpacityOptions = this.overlayStyle.graphicFillOpacity;
      if (this.currentZoom <= this.mapRegionZoomRange.province[1]) {
        graphicStyle.fillOpacity = fillOpacityOptions.level1;
      } else if (this.currentZoom <= this.mapRegionZoomRange.city[1]) {
        graphicStyle.fillOpacity = fillOpacityOptions.level2;
      } else if (this.currentZoom <= this.mapRegionZoomRange.district[1]) {
        graphicStyle.fillOpacity = fillOpacityOptions.level3;
      } else if (this.currentZoom <= this.mapRegionZoomRange.town[1]) {
        graphicStyle.fillOpacity = fillOpacityOptions.level4;
      } else {
        graphicStyle.fillOpacity = fillOpacityOptions.level5;
        graphicStyle.strokeWeight = graphicStyle.strokeWeight + 1;
      }
      return graphicStyle;
    },
    // 更新平面图形填充透明度
    updateGraphicFillOpacity() {
      let _this = this;
      if (
        _this.currentCircleTarget.length > 0 ||
        _this.currentPolygonTarget.length > 0
      ) {
        let fillOpacityOptions = _this.overlayStyle.graphicFillOpacity;
        let defaultStrokeWeight = _this.overlayStyle.graphic.strokeWeight;
        let boldStrokeWeight = defaultStrokeWeight + 1;
        if (_this.currentCircleTarget.length > 0) {
          _this.currentCircleTarget.forEach((e) => {
            graphicStyleUpdate(e);
          });
        }
        if (_this.currentPolygonTarget.length > 0) {
          _this.currentPolygonTarget.forEach((e) => {
            graphicStyleUpdate(e);
          });
        }
        function graphicStyleUpdate(e) {
          let styleUpdateCount = 0;
          let fillOpacityUpdateValue = null;
          let strokeWeightUpdateValue = null;
          let lineUpdateCount = 0;
          if (_this.activeEnableGraphicEditing) {
            _this.graphicStyleZoomUpdating = true;
            e.addEventListener("lineupdate", lineUpdate);
          }
          let currentFillOpacity = e.getFillOpacity();
          let currentStrokeWeight = e.getStrokeWeight();
          if (_this.currentZoom <= _this.mapRegionZoomRange.province[1]) {
            if (currentFillOpacity !== fillOpacityOptions.level1) {
              styleUpdateCount++;
              fillOpacityUpdateValue = fillOpacityOptions.level1;
            }
          } else if (_this.currentZoom <= _this.mapRegionZoomRange.city[1]) {
            if (currentFillOpacity !== fillOpacityOptions.level2) {
              styleUpdateCount++;
              fillOpacityUpdateValue = fillOpacityOptions.level2;
            }
          } else if (
            _this.currentZoom <= _this.mapRegionZoomRange.district[1]
          ) {
            if (currentFillOpacity !== fillOpacityOptions.level3) {
              styleUpdateCount++;
              fillOpacityUpdateValue = fillOpacityOptions.level3;
            }
          } else if (_this.currentZoom <= _this.mapRegionZoomRange.town[1]) {
            if (currentFillOpacity !== fillOpacityOptions.level4) {
              styleUpdateCount++;
              fillOpacityUpdateValue = fillOpacityOptions.level4;
            }
            if (currentStrokeWeight !== defaultStrokeWeight) {
              styleUpdateCount++;
              strokeWeightUpdateValue = defaultStrokeWeight;
            }
          } else {
            if (currentFillOpacity !== fillOpacityOptions.level5) {
              styleUpdateCount++;
              fillOpacityUpdateValue = fillOpacityOptions.level5;
            }
            if (currentStrokeWeight !== boldStrokeWeight) {
              styleUpdateCount++;
              strokeWeightUpdateValue = boldStrokeWeight;
            }
          }
          if (styleUpdateCount) {
            if (!isNaN(parseFloat(fillOpacityUpdateValue))) {
              e.setFillOpacity(fillOpacityUpdateValue);
            }
            if (!isNaN(parseFloat(strokeWeightUpdateValue))) {
              e.setStrokeWeight(strokeWeightUpdateValue);
            }
          }
          if (_this.activeEnableGraphicEditing && !styleUpdateCount) {
            _this.graphicStyleZoomUpdating = false;
            e.removeEventListener("lineupdate", lineUpdate);
          }
          function lineUpdate() {
            lineUpdateCount++;
            if (lineUpdateCount === styleUpdateCount) {
              _this.graphicStyleZoomUpdating = false;
              lineUpdateCount = 0;
              e.removeEventListener("lineupdate", lineUpdate);
            }
          }
        }
      }
    },
    // 设置平面图形文本标注
    setGraphicLabel(graphic, val, trigger, color) {
      let _this = this;
      // 获取中心点
      let center = utilGeo.getPolygonCenter(graphic);
      let graphicLabelStyle = {
        ..._this.overlayStyle.graphicLabel
      };
      let cvs = document.createElement("canvas");
      let cxt = cvs.getContext("2d");
      cxt.font =
        graphicLabelStyle.fontSize + " " + graphicLabelStyle.fontFamily;
      let width = cxt.measureText(val).width;
      let height = Math.ceil(width / 308) * 16 + 6;
      if (width > 308) {
        graphicLabelStyle.width = "320px";
        graphicLabelStyle.whiteSpace = "normal";
      }
      if (color) graphicLabelStyle.backgroundColor = color;
      let label = new BMap.Label(val, {
        offset: new BMap.Size(0, -height / 2),
        position: center
      });
      label.setStyle(graphicLabelStyle);
      if (!trigger) trigger = "always";
      if (trigger === "always") {
        _this.map.addOverlay(label);
      } else if (trigger === "hover") {
        graphic.addEventListener("mouseover", function () {
          _this.map.addOverlay(label);
        });
        graphic.addEventListener("mouseout", function () {
          _this.map.removeOverlay(label);
        });
      }
      return label;
    },
    // 设置平面图形信息窗口
    setGraphicInfoWindow(graphic, val, callback) {
      let _this = this;
      _this.setGraphicTitle(graphic, "点击查看详情");
      // 获取中心点
      let center = utilGeo.getPolygonCenter(graphic);
      graphic.onclick = function () {
        _this.setInfoWindow(
          val,
          "graphic",
          new BMap.Size(0, 0),
          function (info) {
            if (callback) {
              callback(info);
            }
            info.open(center);
          }
        );
      };
    },
    // 设置平面图形文本标注信息窗口
    setGraphicLabelInfoWindow(graphic, label, val, callback) {
      let _this = this;
      _this.setGraphicLabelTitle(label, "点击查看详情");
      // 获取中心点
      let center = utilGeo.getPolygonCenter(graphic);
      label.onclick = function () {
        _this.setInfoWindow(
          val,
          "graphic",
          new BMap.Size(0, 0),
          function (info) {
            if (callback) {
              callback(info);
            }
            info.open(center);
          }
        );
      };
    },
    // 设置平面图形文字提示
    setGraphicTitle(graphic, val) {
      setTimeout(() => {
        if (graphic.V) {
          graphic.V.style.cursor = "pointer";
          graphic.V.innerHTML = "<title>" + val + "</title>";
        }
      });
    },
    // 设置平面图形文本标注文字提示
    setGraphicLabelTitle(label, val) {
      label.setTitle(val);
    },
    // 设置平面图形可编辑文字提示
    setGraphicEnableEditingTitle(graphic) {
      this.setGraphicTitle(graphic, "点击图形可开启编辑模式");
    },
    // 设置平面图形不可编辑文字提示
    setGraphicDisableEditingTitle(graphic) {
      this.setGraphicTitle(graphic, "不允许编辑");
    },
    // 设置驾车路线
    setDrivingRoute(routeSearching) {
      let _this = this;
      if (!routeSearching) {
        if (!_this.keepKeywordSearchAlive) {
          _this.clearKeywordSearch();
        } else {
          _this.clearRouteSearch();
        }
      }
      _this.clearDrivingRoute();
      if (_this.online) {
        if (!(_this.currentDrivingRoutePath.start instanceof BMap.Point)) {
          _this.currentDrivingRoutePath.start = new BMap.Point(
            _this.currentDrivingRoutePath.start.lng,
            _this.currentDrivingRoutePath.start.lat
          );
        }
        if (!(_this.currentDrivingRoutePath.end instanceof BMap.Point)) {
          _this.currentDrivingRoutePath.end = new BMap.Point(
            _this.currentDrivingRoutePath.end.lng,
            _this.currentDrivingRoutePath.end.lat
          );
        }
        if (
          _this.currentDrivingRoutePath.ways &&
          _this.currentDrivingRoutePath.ways.length > 0
        ) {
          _this.currentDrivingRoutePath.ways.forEach((e, i) => {
            if (!(e instanceof BMap.Point)) {
              _this.currentDrivingRoutePath.ways[i] = new BMap.Point(
                e.lng,
                e.lat
              );
            }
          });
        }
        if (!_this.drivingRoute) {
          _this.drivingRoute = new BMap.DrivingRoute(_this.map, {
            renderOptions: {
              map: _this.map,
              autoViewport: false,
              enableDragging: true // 起终点可进行拖拽
            },
            onSearchComplete: onSearchComplete,
            onMarkersSet: onMarkersSet,
            onPolylinesSet: onPolylinesSet
          });
          function onSearchComplete(routes) {
            for (let i of _this.currentDrivingRouteMendTarget) {
              _this.map.removeOverlay(i);
            }
            _this.currentDrivingRouteMendTarget = [];
            if (_this.drivingRouteLuShu) {
              _this.map.removeOverlay(_this.drivingRouteLuShu._marker);
              _this.drivingRouteLuShu.stop();
              _this.drivingRouteLuShu = null;
            }
            let plan = routes.getPlan(0);
            if (plan) {
              _this.currentRouteMileage = {
                distance: plan.getDistance(),
                duration: plan.getDuration()
              };
              if (routeSearching) {
                _this.clearRouteSearch();
                _this.$nextTick(() => {
                  let mileageEl = _this.$el.querySelector(
                    ".hdty-search-route-mileage"
                  );
                  let mTop = parseInt(
                    _this.$utilElem.getStyle(mileageEl, "marginTop")
                  );
                  let mBottom = parseInt(
                    _this.$utilElem.getStyle(mileageEl, "marginBottom")
                  );
                  _this.currentRouteMileageHeight =
                    mileageEl.offsetHeight + mTop + mBottom;
                });
              }
              let routesNum = plan.getNumRoutes();
              let routeArr = [];
              let pointArr = [];
              for (let i = 0; i < routesNum; i++) {
                let routePath = plan.getRoute(i).getPath();
                routeArr.push(routePath);
                pointArr = pointArr.concat(routePath);
              }
              let firstRoutePath = routeArr[0];
              let routeStartPoint = firstRoutePath[0];
              let lastRoutePath = routeArr[routesNum - 1];
              let routeEndPoint = lastRoutePath[lastRoutePath.length - 1];
              let startPoint = routes.getStart().point;
              let endPoint = routes.getEnd().point;
              // 计算当前起点跟路线规划的起点之间的距离
              let m = utilGeo.getDistance(
                new BMap.Point(startPoint.lng, startPoint.lat),
                new BMap.Point(routeStartPoint.lng, routeStartPoint.lat)
              );
              if (m > 0) {
                pointArr.unshift(startPoint);
                setPolyline([startPoint, routeStartPoint]);
              }
              // 计算当前终点跟路线规划的终点之间的距离
              let n = utilGeo.getDistance(
                new BMap.Point(endPoint.lng, endPoint.lat),
                new BMap.Point(routeEndPoint.lng, routeEndPoint.lat)
              );
              if (n > 0) {
                pointArr.push(endPoint);
                setPolyline([endPoint, routeEndPoint]);
              }
              function setPolyline(path) {
                let polyline = new BMap.Polyline(
                  path,
                  _this.overlayStyle.route
                );
                // 添加折线
                _this.map.addOverlay(polyline);
                _this.currentDrivingRouteMendTarget.push(polyline);
              }
              _this.currentDrivingRouteViewDataset = pointArr;
              _this.setBestView(_this.currentDrivingRouteViewDataset);
              if (_this.drivingRoutePlay) {
                _this.setLuShu(
                  "_this.drivingRouteLuShu",
                  pointArr,
                  _this.activeDrivingRoutePlayOptions
                );
              }
            } else {
              error();
            }
            _this.$emit(
              "currentDrivingRouteChanged",
              _this.currentRouteMileage
            );
          }
          function onMarkersSet(pois) {
            let len = pois.length;
            let startPoi = pois[0];
            startPoi.marker.setIcon(_this.getMapIcon("b4"));
            if (len > 2) {
              for (let i = 1; i < len - 1; i++) {
                let wayPoi = pois[i];
                let wayMk;
                for (let k in wayPoi) {
                  if (wayPoi.hasOwnProperty(k)) {
                    if (typeof wayPoi[k] === "object" && wayPoi[k]) {
                      if (wayPoi[k].Lb === "overlay") {
                        wayMk = wayPoi[k];
                        break;
                      }
                    }
                  }
                }
                wayMk.setIcon(_this.mapIcon.null);
                let mk = new BMap.Marker(wayPoi.point, {
                  icon: _this.getMapIcon("f1" + _this.$utilStr.digitFtt(i, 2))
                });
                _this.map.addOverlay(mk);
                _this.currentDrivingRouteMendTarget.push(mk);
                // 添加途经点文本标注
                /*let label = new BMap.Label(i, {
                    offset: new BMap.Size(23, -4)
                  });
                  label.setStyle(_this.overlayStyle.waysLabel);
                  mk.setLabel(label);*/
              }
            }
            let endPoi = pois[len - 1];
            endPoi.marker.setIcon(_this.getMapIcon("b5"));
          }
          function onPolylinesSet(lines) {
            for (let i = 0; i < lines.length; i++) {
              let line = lines[i].getPolyline();
              line.setStrokeColor(_this.overlayStyle.route.strokeColor);
              line.setStrokeOpacity(_this.overlayStyle.route.strokeOpacity);
              line.setStrokeWeight(_this.overlayStyle.route.strokeWeight);
            }
          }
        }
        _this.drivingRoute.search(
          _this.currentDrivingRoutePath.start,
          _this.currentDrivingRoutePath.end,
          {
            waypoints: _this.currentDrivingRoutePath.ways
          }
        );
      } else {
        // 参数
        let dataParams = {
          ak: _this.lbsKey,
          inParameterType: _this.$global.coordType.BD09,
          typeConvert: _this.$global.coordType.BD09,
          startLng: _this.currentDrivingRoutePath.start.lng,
          startLat: _this.currentDrivingRoutePath.start.lat,
          endLng: _this.currentDrivingRoutePath.end.lng,
          endLat: _this.currentDrivingRoutePath.end.lat,
          ways: _this.currentDrivingRoutePath.ways
        };
        routePlan(_this.LBSServerURL, dataParams)
          .then((response) => {
            let { success, data } = response.data;
            if (success) {
              if (data.position && data.position.length > 1) {
                _this.currentRouteMileage = {
                  distance: data.distanceText,
                  duration: data.timeInMsText
                };
                if (routeSearching) {
                  _this.clearRouteSearch();
                  _this.$nextTick(() => {
                    let mileageEl = _this.$el.querySelector(
                      ".hdty-search-route-mileage"
                    );
                    let mTop = parseInt(
                      _this.$utilElem.getStyle(mileageEl, "marginTop")
                    );
                    let mBottom = parseInt(
                      _this.$utilElem.getStyle(mileageEl, "marginBottom")
                    );
                    _this.currentRouteMileageHeight =
                      mileageEl.offsetHeight + mTop + mBottom;
                  });
                }
                let pointArr = [];
                for (let i = 0, len = data.position.length; i < len; i++) {
                  pointArr.push(
                    new BMap.Point(data.position[i].lng, data.position[i].lat)
                  );
                }
                let startPt = new BMap.Point(
                  _this.currentDrivingRoutePath.start.lng,
                  _this.currentDrivingRoutePath.start.lat
                );
                let endPt = new BMap.Point(
                  _this.currentDrivingRoutePath.end.lng,
                  _this.currentDrivingRoutePath.end.lat
                );
                // 计算当前起点跟路线规划的起点之间的距离
                let m = utilGeo.getDistance(startPt, pointArr[0]);
                if (m > 0) {
                  pointArr.unshift(startPt);
                }
                // 计算当前终点跟路线规划的终点之间的距离
                let n = utilGeo.getDistance(
                  endPt,
                  pointArr[pointArr.length - 1]
                );
                if (n > 0) {
                  pointArr.push(endPt);
                }
                let polyline = new BMap.Polyline(
                  pointArr,
                  _this.overlayStyle.route
                );
                _this.map.addOverlay(polyline);
                _this.currentDrivingRouteMendTarget.push(polyline);
                let startMarker = new BMap.Marker(
                  this.currentDrivingRoutePath.start,
                  {
                    icon: _this.getMapIcon("b4"),
                    enableDragging: true
                  }
                );
                _this.map.addOverlay(startMarker);
                startMarker.addEventListener("dragend", function (e) {
                  _this.currentDrivingRoutePath.start = e.point;
                  _this.setDrivingRoute(routeSearching);
                });
                _this.currentDrivingRouteMendTarget.push(startMarker);
                if (
                  _this.currentDrivingRoutePath.ways &&
                  _this.currentDrivingRoutePath.ways.length > 0
                ) {
                  for (
                    let i = 0, len = _this.currentDrivingRoutePath.ways.length;
                    i < len;
                    i++
                  ) {
                    let mk = new BMap.Marker(
                      _this.currentDrivingRoutePath.ways[i],
                      {
                        icon: _this.getMapIcon(
                          "f1" + _this.$utilStr.digitFtt(i + 1, 2)
                        )
                      }
                    );
                    _this.map.addOverlay(mk);
                    _this.currentDrivingRouteMendTarget.push(mk);
                    // 添加途经点文本标注
                    /*let label = new BMap.Label(i + 1, {
                      offset: new BMap.Size(23, -4)
                    });
                    label.setStyle(_this.overlayStyle.waysLabel);
                    mk.setLabel(label);*/
                  }
                }
                let endMarker = new BMap.Marker(
                  this.currentDrivingRoutePath.end,
                  {
                    icon: _this.getMapIcon("b5"),
                    enableDragging: true
                  }
                );
                _this.map.addOverlay(endMarker);
                endMarker.addEventListener("dragend", function (e) {
                  _this.currentDrivingRoutePath.end = e.point;
                  _this.setDrivingRoute(routeSearching);
                });
                _this.currentDrivingRouteMendTarget.push(endMarker);
                _this.currentDrivingRouteViewDataset = pointArr;
                _this.setBestView(_this.currentDrivingRouteViewDataset);
                if (_this.drivingRoutePlay) {
                  _this.setLuShu(
                    "_this.drivingRouteLuShu",
                    pointArr,
                    _this.activeDrivingRoutePlayOptions
                  );
                }
              } else {
                error();
              }
            }
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            _this.$emit(
              "currentDrivingRouteChanged",
              _this.currentRouteMileage
            );
          });
      }
      function error() {
        _this.$message({
          showClose: true,
          message: "当前起点到终点没有可规划的路线",
          type: "warning",
          offset: 76
        });
      }
    },
    // 设置路书
    setLuShu(bind, path, opts) {
      let _this = this;
      MP.ls()
        .then(() => {
          if (path && path.length > 1) {
            let currentIcon = _this.getMapIcon("car");
            if (opts.icon) {
              currentIcon = _this.getMapIcon(opts.icon, opts.iconOptions);
            }
            let currentLuShu = new BMapLib.LuShu(_this.map, path, {
              defaultContent: opts.html, // 要在覆盖物上方默认显示的信息窗口内容
              autoView: true, // 是否开启自动视野调整
              icon: currentIcon,
              speed: 0, // 覆盖物移动速度，单位米/秒
              enableRotation: opts.rotation, // 是否开启marker随道路走向进行旋转
              landmarkPois: opts.landmark // 要在marker移动过程中显示的特殊点
            });
            if (opts.auto) {
              currentLuShu._opts.speed = opts.speed;
            }
            if (opts.loop) {
              _this.handleLuShuLoopPlay(currentLuShu);
            } else {
              currentLuShu.start();
            }
            let contextmenu = new BMap.ContextMenu();
            let contextMenuItem = [
              {
                text: "播放",
                callback: function () {
                  currentLuShu._opts.speed = opts.speed;
                  if (opts.loop) {
                    _this.handleLuShuLoopPlay(currentLuShu);
                  } else {
                    currentLuShu.start();
                  }
                }
              },
              {
                text: "暂停",
                callback: function () {
                  currentLuShu.pause();
                }
              },
              {
                text: "结束",
                callback: function () {
                  currentLuShu.stop();
                }
              }
            ];
            for (let e of contextMenuItem) {
              let fn = function (e) {
                e();
              };
              contextmenu.addItem(
                new BMap.MenuItem(e.text, fn.bind(this, e.callback))
              );
            }
            currentLuShu._marker.addContextMenu(contextmenu);
            eval(bind + "=currentLuShu");
          }
        })
        .catch((error) => {
          console.error(error);
          _this.$message({
            showClose: true,
            customClass: "is-wrap",
            message: "路书实例化失败",
            type: "error",
            offset: 76
          });
        });
    },
    // 路书循环播放
    handleLuShuLoopPlay(bind) {
      let _this = this;
      bind.start(function () {
        _this.handleLuShuLoopPlay(bind);
      });
    },
    // 设置信息窗口
    setInfoWindow(content, customClass, offset, callback) {
      let _this = this;
      MP.ib()
        .then(() => {
          let info = new BMapLib.InfoBox(_this.map, content, {
            boxClass: "hdty-bubble-wrapper hdty-map-bubble " + customClass,
            closeIconClass: "hdty-bubble-close",
            enableClose: true,
            arrowIconClass: "hdty-bubble-arrow",
            visibleArrow: true,
            enableAutoPan: true,
            align: INFOBOX_AT_TOP,
            offset: offset
          });
          info.addEventListener("open", function () {
            _this.clearInfoBox();
            _this.currentInfoBox = info;
            let dragged = false;
            // 点击其他位置关闭信息窗口
            _this.map.ondragstart = function () {
              dragged = true;
              _this.map.ondragstart = null;
            };
            document.documentElement.onclick = function () {
              if (dragged) {
                dragged = false;
                _this.map.ondragstart = function () {
                  dragged = true;
                  _this.map.ondragstart = null;
                };
              } else {
                _this.clearInfoBox();
                _this.map.ondragstart = null;
                document.documentElement.onclick = null;
                document.documentElement.oncontextmenu = null;
              }
            };
            document.documentElement.oncontextmenu = function () {
              _this.clearInfoBox();
              _this.map.ondragstart = null;
              document.documentElement.onclick = null;
              document.documentElement.oncontextmenu = null;
            };
          });
          info.addEventListener("close", function () {
            _this.currentInfoBox = null;
          });
          if (callback) {
            callback(info);
          }
        })
        .catch((error) => {
          console.error(error);
          _this.$message({
            showClose: true,
            customClass: "is-wrap",
            message: "信息窗口实例化失败",
            type: "error",
            offset: 76
          });
        });
    },
    // 设置地图最佳视野
    setBestView(path) {
      if (path && path.length > 0) {
        if (!this.geolocationPanToComplete)
          this.geolocationPanToComplete = true;
        if (path.length > 1) {
          this.map.setViewport(path);
        } else {
          this.map.panTo(utilGeo.getPolygonCenter(path));
        }
      }
    },
    // 重置地图最佳视野
    resetBestView() {
      if (this.activeAutoViewDataset) {
        if (this.activeAutoViewDataset.length > 1) {
          this.map.setViewport(this.activeAutoViewDataset);
        } else if (this.activeAutoViewDataset.length > 0) {
          this.map.panTo(utilGeo.getPolygonCenter(this.activeAutoViewDataset));
        }
      }
    },
    // 设置鼠标绘制工具
    setDrawingManager() {
      let _this = this;
      if (_this.online) {
        MP.dm()
          .then(() => {
            instantiation();
          })
          .catch((error) => {
            console.error(error);
            _this.$message({
              showClose: true,
              customClass: "is-wrap",
              message: "绘制工具实例化失败",
              type: "error",
              offset: 76
            });
          });
      } else {
        MP.offline_dm(_this.offlineURL)
          .then(() => {
            instantiation();
          })
          .catch((error) => {
            console.error(error);
            _this.$message({
              showClose: true,
              customClass: "is-wrap",
              message: "绘制工具实例化失败",
              type: "error",
              offset: 76
            });
          });
      }
      function instantiation() {
        if (!_this.drawingManager) {
          if (!_this.$utilStr.isExist(_this.drawingToolOffsetWidth)) {
            if (_this.drawingToolPlacement === "top-left") {
              _this.currentDrawingToolOffsetWidth = _this.ctrlSpaceMedium;
              if (_this.mapType) {
                _this.currentDrawingToolOffsetWidth +=
                  _this.mapTypeCtrlWidth + _this.ctrlSpaceMedium;
              }
              if (_this.online && _this.cityList) {
                _this.currentDrawingToolOffsetWidth +=
                  _this.cityListCtrlWidth + _this.ctrlSpaceMedium;
              }
              if (
                _this.keywordSearch &&
                _this.keywordSearchPlacement === "top-left"
              ) {
                _this.currentDrawingToolOffsetWidth +=
                  _this.currentKeywordSearchWidth &&
                  _this.currentKeywordSearchWidth + _this.ctrlSpaceMedium;
              }
            } else {
              _this.currentDrawingToolOffsetWidth = _this.ctrlSpaceMedium;
              if (_this.navigation && _this.overviewMap) {
                _this.currentDrawingToolOffsetWidth +=
                  _this.navigationCtrlWidth;
                if (_this.fullscreen)
                  _this.currentDrawingToolOffsetWidth -= _this.ctrlSpaceMedium;
              } else {
                if (_this.fullscreen)
                  _this.currentDrawingToolOffsetWidth +=
                    _this.fullscreenCtrlWidth + _this.ctrlSpaceMini;
              }
            }
          }
          if (!_this.$utilStr.isExist(_this.drawingToolOffsetHeight)) {
            _this.currentDrawingToolOffsetHeight = _this.ctrlSpaceMedium;
          }
          _this.currentDrawingToolReady = true;
          let currentIcon;
          if (_this.icon) {
            currentIcon = _this.getMapIcon(_this.icon, _this.iconOptions);
          }
          let markerStyle = {
            icon: currentIcon
          };
          let graphicStyle = {
            ..._this.overlayStyle.graphic,
            fillColor: _this.currentDrawingColor
              ? _this.currentDrawingColor
              : _this.overlayStyle.graphic.fillColor,
            strokeColor: _this.currentDrawingColor
              ? _this.currentDrawingColor
              : _this.overlayStyle.graphic.strokeColor
          };
          let polylineStyle = {
            ..._this.overlayStyle.polyline,
            strokeColor: _this.currentDrawingColor
              ? _this.currentDrawingColor
              : _this.overlayStyle.polyline.strokeColor
          };
          let drawingModes = [
            BMAP_DRAWING_MARKER,
            BMAP_DRAWING_POLYLINE,
            BMAP_DRAWING_CIRCLE,
            BMAP_DRAWING_POLYGON,
            BMAP_DRAWING_RECTANGLE
          ];
          // 实例化鼠标绘制工具
          _this.drawingManager = new BMapLib.DrawingManager(_this.map, {
            isOpen: false, // 是否开启绘制模式
            enableDrawingTool: true, // 是否添加绘制工具栏控件
            enableCalculate: false, // 绘制是否进行测距
            drawingToolOptions: {
              anchor:
                _this.drawingToolPlacement === "top-left"
                  ? BMAP_ANCHOR_TOP_LEFT
                  : BMAP_ANCHOR_TOP_RIGHT, // 位置
              offset: new BMap.Size(
                _this.currentDrawingToolOffsetWidth,
                _this.currentDrawingToolOffsetHeight
              ), // 偏离值
              scale: 1, // 工具栏缩放比例
              drawingModes: drawingModes // 工具栏上可以选择出现的绘制模式
            },
            markerOptions: markerStyle, // 点的样式
            polylineOptions: polylineStyle, // 线的样式
            circleOptions: graphicStyle, // 圆的样式
            polygonOptions: graphicStyle, // 多边形的样式
            rectangleOptions: graphicStyle // 矩形的样式
          });
          // 监听覆盖物绘制完成事件
          _this.drawingManager.addEventListener(
            "overlaycomplete",
            _this.overlayComplete
          );
          let drawingTool = _this.drawingManager._drawingTool;
          if (drawingTool) {
            _this.drawingContainerEl = drawingTool.container;
            _this.drawingPanelEl = drawingTool.panel;
            // 监听绘制工具点击事件
            _this.drawingPanelEl.addEventListener("click", function () {
              _this.setDrawingLastClass();
              let activeDrawingMode = _this.getDrawingMode();
              if (activeDrawingMode !== _this.currentDrawingMode) {
                if (activeDrawingMode === "drag" && !_this.currentDrawingMode)
                  return;
                _this.currentDrawingMode = activeDrawingMode;
                _this.$emit("update:drawingMode", _this.currentDrawingMode);
                _this.$emit(
                  "currentDrawingModeChanged",
                  _this.currentDrawingMode
                );
                if (_this.enablePointTooltip) {
                  if (
                    _this.currentDrawingMode &&
                    _this.currentDrawingMode !== "drag"
                  ) {
                    _this.setPointTooltip(_this.drawingManager._mask.container);
                  } else {
                    _this.setPointTooltip();
                  }
                }
              }
            });
          }
          if (_this.enablePointTooltip) {
            setTimeout(() => {
              let activeDrawingMode = _this.getDrawingMode();
              if (activeDrawingMode && activeDrawingMode !== "drag") {
                _this.setPointTooltip(_this.drawingManager._mask.container);
              } else {
                _this.setPointTooltip();
              }
            });
          }
          _this.updateDrawingTool();
        } else {
          _this.updateDrawingTool();
        }
      }
    },
    // 更新绘制工具
    updateDrawingTool() {
      this.currentDrawingToolWidth = this.drawingContainerEl.offsetWidth;
      this.currentDrawingToolHeight = this.drawingContainerEl.offsetHeight;
      if (this.activeEnableDrawingManager) {
        if (
          this.keywordSearch &&
          this.keywordSearchPlacement !== "top-left" &&
          !this.$utilStr.isExist(this.keywordSearchOffsetWidth) &&
          this.currentKeywordSearchReady
        ) {
          if (this.drawingToolPlacement !== "top-left") {
            this.currentKeywordSearchOffsetWidth =
              this.currentDrawingToolOffsetWidth +
              (this.currentDrawingToolWidth &&
                this.currentDrawingToolWidth + this.ctrlSpaceMedium);
          }
        }
        if (this.colorPicker) {
          let colorPickerEl = this.$el.querySelector(".el-color-picker");
          this.currentColorPickerWidth = colorPickerEl.offsetWidth;
          this.currentColorPickerHeight = colorPickerEl.offsetHeight;
          if (this.drawingToolPlacement === "top-left") {
            this.currentColorPickerOffsetWidth =
              this.currentDrawingToolOffsetWidth +
              (this.currentDrawingToolWidth -
                this.currentColorPickerWidth -
                this.ctrlSpaceSmall);
            this.currentColorPickerOffsetHeight =
              this.currentDrawingToolOffsetHeight +
              this.currentDrawingToolHeight +
              this.ctrlSpaceMedium;
          } else {
            this.currentColorPickerOffsetWidth =
              this.currentDrawingToolOffsetWidth + this.ctrlSpaceSmall;
            this.currentColorPickerOffsetHeight =
              this.currentDrawingToolOffsetHeight +
              this.currentDrawingToolHeight +
              this.ctrlSpaceMedium;
          }
        }
        if (
          this.mapType &&
          !(this.keywordSearch && this.keywordSearchPlacement === "top-left")
        ) {
          if (this.drawingToolPlacement === "top-left") {
            if (this.currentDrawingToolOffsetHeight <= this.ctrlSpaceMedium) {
              let offset = this.mapTypeCtrl.getOffset();
              offset.height =
                this.currentDrawingToolOffsetHeight +
                (this.currentDrawingToolHeight - this.mapTypeCtrlHeight) / 2;
              this.mapTypeCtrl.setOffset(offset);
            }
          }
        }
        if (
          this.online &&
          this.cityList &&
          !(this.keywordSearch && this.keywordSearchPlacement === "top-left")
        ) {
          if (this.drawingToolPlacement === "top-left") {
            if (this.currentDrawingToolOffsetHeight <= this.ctrlSpaceMedium) {
              let offset = this.cityListCtrl.getOffset();
              offset.height =
                this.currentDrawingToolOffsetHeight +
                (this.currentDrawingToolHeight - this.cityListCtrlHeight) / 2;
              this.cityListCtrl.setOffset(offset);
            }
          }
        }
        this.createDrawingClearControl();
        this.setDrawingLastClass();
      } else {
        if (this.colorPicker) {
          this.setColorPicker();
        }
        let controlEl = this.$el.querySelector(".hdty-drawing-clear");
        if (controlEl) {
          controlEl.style.display = "none";
        }
        if (
          this.currentOverlay &&
          this.currentOverlay.drawingMode !== "marker"
        ) {
          this.currentOverlay.overlay.disableEditing();
        }
      }
      this.setDrawingMode();
    },
    // 设置绘制模式
    setDrawingMode() {
      if (this.drawingManager) {
        this.setDrawingLastClass();
        if (this.currentDrawingMode === "marker") {
          if (this.currentMarker) {
            this.drawingManager.setDrawingMode(BMAP_DRAWING_MARKER);
            this.drawingManager.open();
          } else {
            this.drawingManager.close();
          }
        } else if (this.currentDrawingMode === "polyline") {
          if (this.currentPolyline) {
            this.drawingManager.setDrawingMode(BMAP_DRAWING_POLYLINE);
            this.drawingManager.open();
          } else {
            this.drawingManager.close();
          }
        } else if (this.currentDrawingMode === "circle") {
          if (this.currentCircle) {
            this.drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
            this.drawingManager.open();
          } else {
            this.drawingManager.close();
          }
        } else if (this.currentDrawingMode === "polygon") {
          if (this.currentPolygon) {
            this.drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
            this.drawingManager.open();
          } else {
            this.drawingManager.close();
          }
        } else if (this.currentDrawingMode === "rectangle") {
          if (this.currentPolygon) {
            this.drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
            this.drawingManager.open();
          } else {
            this.drawingManager.close();
          }
        } else {
          this.drawingManager.setDrawingMode(null);
          this.drawingManager.close();
        }
      }
    },
    // 获取绘制模式
    getDrawingMode() {
      if (this.drawingPanelEl) {
        let mode = "";
        let drawingBtnEls = this.drawingPanelEl.children;
        try {
          [].forEach.call(drawingBtnEls, (e) => {
            if (e.className.includes("_hander_hover")) {
              mode = "drag";
              throw Error();
            } else if (e.className.includes("_marker_hover")) {
              mode = "marker";
              throw Error();
            } else if (e.className.includes("_polyline_hover")) {
              mode = "polyline";
              throw Error();
            } else if (e.className.includes("_circle_hover")) {
              mode = "circle";
              throw Error();
            } else if (e.className.includes("_polygon_hover")) {
              mode = "polygon";
              throw Error();
            } else if (e.className.includes("_rectangle_hover")) {
              mode = "rectangle";
              throw Error();
            }
          });
        } catch (e) {}
        return mode;
      }
    },
    // 设置最后一个绘制按钮class类
    setDrawingLastClass() {
      let _this = this;
      _this.$nextTick(() => {
        if (_this.drawingPanelEl) {
          let lastIndex = 0;
          let drawingBtnEls = _this.drawingPanelEl.children;
          [].forEach.call(drawingBtnEls, (e, i) => {
            e.classList.remove("BMapLib_last");
            if (_this.$utilElem.getStyle(e, "display") !== "none") {
              lastIndex = i;
            }
          });
          drawingBtnEls[lastIndex].classList.add("BMapLib_last");
        }
      });
    },
    // 鼠标绘制覆盖物完成
    overlayComplete(e) {
      let _this = this;
      _this.currentOverlay = e;
      _this.currentOverlays.push(_this.currentOverlay);
      if (_this.validateLimit()) {
        _this.drawing = true;
        let len = _this.currentOverlays.length;
        if (_this.drawingCanEdit) {
          if (len > 1) {
            if (_this.currentOverlays[len - 2].drawingMode !== "marker") {
              _this.currentOverlays[len - 2].overlay.disableEditing();
            }
          }
          if (_this.currentOverlay.drawingMode !== "marker") {
            _this.currentOverlay.overlay.enableEditing();
            _this.currentOverlay.overlay.addEventListener(
              "lineupdate",
              function () {
                if (_this.currentOverlay.drawingMode === "polyline") {
                  _this.updatePolylinePath();
                }
                if (_this.currentOverlay.drawingMode === "circle") {
                  _this.updateCirclePath();
                }
                if (
                  _this.currentOverlay.drawingMode === "polygon" ||
                  _this.currentOverlay.drawingMode === "rectangle"
                ) {
                  _this.updatePolygonPath();
                }
              }
            );
          }
        }
        if (_this.currentOverlay.drawingMode === "marker") {
          _this.updateMarkers();
        }
        if (_this.currentOverlay.drawingMode === "polyline") {
          _this.updatePolylineColor();
          _this.updatePolylinePath();
        }
        if (_this.currentOverlay.drawingMode === "circle") {
          _this.updateCircleColor();
          _this.updateCirclePath();
        }
        if (
          _this.currentOverlay.drawingMode === "polygon" ||
          _this.currentOverlay.drawingMode === "rectangle"
        ) {
          _this.updatePolygonColor();
          _this.updatePolygonPath();
        }
        _this.updateDrawingClearControl();
      }
      setTimeout(() => {
        let activeDrawingMode = _this.getDrawingMode();
        if (activeDrawingMode !== _this.currentDrawingMode) {
          _this.currentDrawingMode = activeDrawingMode;
          _this.$emit("update:drawingMode", _this.currentDrawingMode);
          _this.$emit("currentDrawingModeChanged", _this.currentDrawingMode);
        }
      });
    },
    // 鼠标绘制覆盖物限制校验
    validateLimit() {
      let _this = this;
      let len = _this.currentOverlays.length;
      let mkLen = 0,
        plLen = 0,
        clLen = 0,
        pgLen = 0;
      let mkInd, plInd, clInd, pgInd;
      for (let i in _this.currentOverlays) {
        if (_this.currentOverlays.hasOwnProperty(i)) {
          if (_this.currentOverlays[i].drawingMode === "marker") {
            mkLen++;
            if (!mkInd) {
              mkInd = i;
            }
          } else if (_this.currentOverlays[i].drawingMode === "polyline") {
            plLen++;
            if (!plInd) {
              plInd = i;
            }
          } else if (_this.currentOverlays[i].drawingMode === "circle") {
            clLen++;
            if (!clInd) {
              clInd = i;
            }
          } else {
            pgLen++;
            if (!pgInd) {
              pgInd = i;
            }
          }
        }
      }
      if (Number(_this.limit) > 0) {
        if (len > Number(_this.limit)) {
          if (Number(_this.limit) > 1 && !_this.limitPrompted) {
            _this.$message({
              showClose: true,
              customClass: "is-wrap",
              message:
                "超出地图绘制限制，最多绘制[" +
                _this.limit +
                "]项，继续绘制将自动覆盖第一项",
              type: "error",
              offset: 76,
              duration: 5000
            });
            _this.limitPrompted = true;
            _this.map.removeOverlay(_this.currentOverlay.overlay);
            _this.currentOverlays.pop();
            return;
          } else {
            _this.map.removeOverlay(_this.currentOverlays[0].overlay);
            _this.currentOverlays.shift();
          }
        }
      }
      if (Number(_this.markerLimit) > 0) {
        if (mkLen > Number(_this.markerLimit)) {
          if (Number(_this.markerLimit) > 1 && !_this.markerLimitPrompted) {
            _this.$message({
              showClose: true,
              customClass: "is-wrap",
              message:
                "超出地图点绘制限制，最多绘制[" +
                _this.markerLimit +
                "]个点，继续绘制将自动覆盖第一个点",
              type: "error",
              offset: 76,
              duration: 5000
            });
            _this.markerLimitPrompted = true;
            _this.map.removeOverlay(_this.currentOverlay.overlay);
            _this.currentOverlays.pop();
            return;
          } else {
            _this.map.removeOverlay(_this.currentOverlays[mkInd].overlay);
            _this.currentOverlays.splice(mkInd, 1);
          }
        }
      }
      if (Number(_this.polylineLimit) > 0) {
        if (plLen > Number(_this.polylineLimit)) {
          if (Number(_this.polylineLimit) > 1 && !_this.polylineLimitPrompted) {
            _this.$message({
              showClose: true,
              customClass: "is-wrap",
              message:
                "超出地图折线绘制限制，最多绘制[" +
                _this.polylineLimit +
                "]条折线，继续绘制将自动覆盖第一条折线",
              type: "error",
              offset: 76,
              duration: 5000
            });
            _this.polylineLimitPrompted = true;
            _this.map.removeOverlay(_this.currentOverlay.overlay);
            _this.currentOverlays.pop();
            return;
          } else {
            _this.map.removeOverlay(_this.currentOverlays[plInd].overlay);
            _this.currentOverlays.splice(plInd, 1);
          }
        }
      }
      if (Number(_this.circleLimit) > 0) {
        if (clLen > Number(_this.circleLimit)) {
          if (Number(_this.circleLimit) > 1 && !_this.circleLimitPrompted) {
            _this.$message({
              showClose: true,
              customClass: "is-wrap",
              message:
                "超出地图圆形绘制限制，最多绘制[" +
                _this.circleLimit +
                "]个圆，继续绘制将自动覆盖第一个圆",
              type: "error",
              offset: 76,
              duration: 5000
            });
            _this.circleLimitPrompted = true;
            _this.map.removeOverlay(_this.currentOverlay.overlay);
            _this.currentOverlays.pop();
            return;
          } else {
            _this.map.removeOverlay(_this.currentOverlays[clInd].overlay);
            _this.currentOverlays.splice(clInd, 1);
          }
        }
      }
      if (Number(_this.polygonLimit) > 0) {
        if (pgLen > Number(_this.polygonLimit)) {
          if (Number(_this.polygonLimit) > 1 && !_this.polygonLimitPrompted) {
            _this.$message({
              showClose: true,
              customClass: "is-wrap",
              message:
                "超出地图多边形绘制限制，最多绘制[" +
                _this.polygonLimit +
                "]个多边形，继续绘制将自动覆盖第一个多边形",
              type: "error",
              offset: 76,
              duration: 5000
            });
            _this.polygonLimitPrompted = true;
            _this.map.removeOverlay(_this.currentOverlay.overlay);
            _this.currentOverlays.pop();
            return;
          } else {
            _this.map.removeOverlay(_this.currentOverlays[pgInd].overlay);
            _this.currentOverlays.splice(pgInd, 1);
          }
        }
      }
      return true;
    },
    // 更新markers
    async updateMarkers() {
      let _this = this;
      let locations = await _this.$utilStr.asyncMap(
        _this.currentOverlays.filter((e) => e.drawingMode === "marker"),
        async (e) => {
          let pt = e.overlay.getPosition();
          let result = {
            address: "",
            addressComponents: {
              city: "",
              district: "",
              province: "",
              street: "",
              streetNumber: ""
            },
            business: "",
            point: pt,
            surroundingPois: []
          };
          await _this.getLocation(pt, true).then((rs) => {
            if (rs) result = rs;
          });
          return result;
        }
      );
      let markers = locations.map((e) => {
        return e.point;
      });
      if (_this.connection) {
        _this.setConnection(markers);
      }
      _this.$emit("update:markers", markers);
      _this.$emit("currentMarkerChanged", markers, locations);
    },
    // 更新polylineColor
    updatePolylineColor() {
      let colors = this.currentOverlays
        .filter((e) => e.drawingMode === "polyline")
        .map((e) => {
          return e.overlay.getStrokeColor();
        });
      this.$emit("update:polylineColor", colors);
    },
    // 更新polylinePath
    updatePolylinePath() {
      let polylinePath = this.currentOverlays
        .filter((e) => e.drawingMode === "polyline")
        .map((e) => {
          return e.overlay.getPath();
        });
      this.$emit("update:polylinePath", polylinePath);
      this.$emit("currentPolylineChanged", polylinePath);
    },
    // 更新circleColor
    updateCircleColor() {
      let colors = this.currentOverlays
        .filter((e) => e.drawingMode === "circle")
        .map((e) => {
          return e.overlay.getFillColor();
        });
      this.$emit("update:circleColor", colors);
    },
    // 更新circlePath
    updateCirclePath() {
      let circleCenter = this.currentOverlays
        .filter((e) => e.drawingMode === "circle")
        .map((e) => {
          return e.overlay.getCenter();
        });
      let circleRadius = this.currentOverlays
        .filter((e) => e.drawingMode === "circle")
        .map((e) => {
          return e.overlay.getRadius();
        });
      circleCenter.forEach((e, i) => {
        e.radius = circleRadius[i];
      });
      this.$emit("update:circlePath", circleCenter);
      this.$emit("currentCircleChanged", circleCenter);
    },
    // 更新polygonColor
    updatePolygonColor() {
      let colors = this.currentOverlays
        .filter(
          (e) => e.drawingMode === "polygon" || e.drawingMode === "rectangle"
        )
        .map((e) => {
          return e.overlay.getFillColor();
        });
      this.$emit("update:polygonColor", colors);
    },
    // 更新polygonPath
    updatePolygonPath() {
      let polygonPath = this.currentOverlays
        .filter(
          (e) => e.drawingMode === "polygon" || e.drawingMode === "rectangle"
        )
        .map((e) => {
          return e.overlay.getPath();
        });
      this.$emit("update:polygonPath", polygonPath);
      this.$emit("currentPolygonChanged", polygonPath);
    },
    // 创建覆盖物清理控件
    createDrawingClearControl() {
      let _this = this;
      let controlEl = _this.$el.querySelector(".hdty-drawing-clear");
      if (!controlEl) {
        // 创建DOM元素
        controlEl = document.createElement("div");
        // 添加项目
        let minusEl = document.createElement("div");
        controlEl.appendChild(minusEl);
        let clearEl = document.createElement("div");
        controlEl.appendChild(clearEl);
        let minusIconEl = document.createElement("i");
        minusEl.appendChild(minusIconEl);
        let clearIconEl = document.createElement("i");
        clearEl.appendChild(clearIconEl);
        // 设置样式
        controlEl.className = "hdty-drawing-clear";
        controlEl.style.opacity = "0";
        minusEl.title = "清除单个";
        minusEl.className = "hdty-drawing-clear-btn minus";
        minusEl.style.visibility = "hidden";
        clearEl.title = "清除全部";
        clearEl.className = "hdty-drawing-clear-btn clear";
        if (_this.currentColorPickerWidth && _this.currentColorPickerHeight) {
          minusEl.style.width = _this.$utilElem.pixelsFtt(
            _this.currentColorPickerWidth
          );
          minusEl.style.height = _this.$utilElem.pixelsFtt(
            _this.currentColorPickerHeight
          );
          clearEl.style.width = _this.$utilElem.pixelsFtt(
            _this.currentColorPickerWidth
          );
          clearEl.style.height = _this.$utilElem.pixelsFtt(
            _this.currentColorPickerHeight
          );
        }
        minusIconEl.className = "hdty-drawing-clear-icon icon-minus-sign";
        clearIconEl.className = "hdty-drawing-clear-icon icon-clear";
        // 绑定事件
        minusEl.onclick = _this.clearOverlay;
        clearEl.onclick = _this.clearOverlays;
        // 添加DOM元素到地图中
        _this.map.getContainer().appendChild(controlEl);
        // 定义一个控件类,即function
        function ClearOverlayControl() {
          _this.currentDrawingClearCtrlWidth = controlEl.offsetWidth;
          _this.currentDrawingClearCtrlHeight = controlEl.offsetHeight;
          controlEl.style.display = "none";
          controlEl.style.opacity = "1";
          // 默认停靠位置和偏移量
          this.defaultAnchor =
            _this.drawingToolPlacement === "top-left"
              ? BMAP_ANCHOR_TOP_LEFT
              : BMAP_ANCHOR_TOP_RIGHT;
          this.defaultOffset = getDrawingClearControlOffset();
        }
        // 通过JavaScript的prototype属性继承于BMap.Control
        ClearOverlayControl.prototype = new BMap.Control();
        // 在本方法中创建元素作为控件的容器,并将其添加到地图容器中
        ClearOverlayControl.prototype.initialize = () => {
          // 将DOM元素返回
          return controlEl;
        };
        // 创建控件
        _this.drawingClearCtrl = new ClearOverlayControl();
        // 添加到地图当中
        _this.map.addControl(_this.drawingClearCtrl);
      } else {
        _this.drawingClearCtrl.setOffset(getDrawingClearControlOffset());
      }
      _this.updateDrawingClearControl();
      function getDrawingClearControlOffset() {
        let offsetWidth;
        let offsetHeight;
        if (_this.drawingToolPlacement === "top-left") {
          offsetWidth =
            _this.currentDrawingToolOffsetWidth +
            (_this.currentDrawingToolWidth -
              _this.currentDrawingClearCtrlWidth -
              _this.ctrlSpaceSmall -
              (_this.currentColorPickerWidth &&
                _this.currentColorPickerWidth + _this.ctrlSpaceMedium));
          offsetHeight =
            _this.currentDrawingToolOffsetHeight +
            _this.currentDrawingToolHeight +
            _this.ctrlSpaceMedium;
        } else {
          offsetWidth =
            _this.currentDrawingToolOffsetWidth +
            _this.ctrlSpaceSmall +
            (_this.currentColorPickerWidth &&
              _this.currentColorPickerWidth + _this.ctrlSpaceMedium);
          offsetHeight =
            _this.currentDrawingToolOffsetHeight +
            _this.currentDrawingToolHeight +
            _this.ctrlSpaceMedium;
        }
        return new BMap.Size(offsetWidth, offsetHeight);
      }
    },
    // 更新覆盖物清理控件
    updateDrawingClearControl() {
      let controlEl = this.$el.querySelector(".hdty-drawing-clear");
      if (controlEl) {
        let overlayLen = this.currentOverlays.length;
        if (overlayLen === 0) {
          controlEl.style.display = "none";
        } else if (overlayLen === 1) {
          controlEl.style.display = "inline-block";
          let minusEl = controlEl.querySelector(
            ".hdty-drawing-clear-btn.minus"
          );
          if (minusEl) {
            minusEl.style.visibility = "hidden";
          }
        } else {
          controlEl.style.display = "inline-block";
          let minusEl = controlEl.querySelector(
            ".hdty-drawing-clear-btn.minus"
          );
          if (minusEl) {
            minusEl.style.visibility = "visible";
          }
        }
      }
    },
    // 清除单个覆盖物和绑定值
    clearOverlay() {
      let lastOverlay = this.currentOverlays[this.currentOverlays.length - 1];
      this.map.removeOverlay(lastOverlay.overlay);
      this.currentOverlays.pop();
      this.drawing = true;
      if (lastOverlay.drawingMode === "marker") {
        this.updateMarkers();
      }
      if (lastOverlay.drawingMode === "polyline") {
        this.updatePolylineColor();
        this.updatePolylinePath();
      }
      if (lastOverlay.drawingMode === "circle") {
        this.updateCircleColor();
        this.updateCirclePath();
      }
      if (
        lastOverlay.drawingMode === "polygon" ||
        lastOverlay.drawingMode === "rectangle"
      ) {
        this.updatePolygonColor();
        this.updatePolygonPath();
      }
      this.updateDrawingClearControl();
    },
    // 清除全部覆盖物和绑定值
    clearOverlays() {
      this.clearConnection();
      for (let e of this.currentOverlays) {
        this.map.removeOverlay(e.overlay);
      }
      this.currentOverlays = [];
      this.$emit("update:markers", []);
      this.$emit("currentMarkerChanged", []);
      this.$emit("update:polylineColor", []);
      this.$emit("update:polylinePath", []);
      this.$emit("currentPolylineChanged", []);
      this.$emit("update:circleColor", []);
      this.$emit("update:circlePath", []);
      this.$emit("currentCircleChanged", []);
      this.$emit("update:polygonColor", []);
      this.$emit("update:polygonPath", []);
      this.$emit("currentPolygonChanged", []);
      this.updateDrawingClearControl();
    },
    // 清除点覆盖物
    clearMarkerOverlay() {
      let len = this.currentOverlays.length;
      if (len > 0) {
        for (let i = len - 1; i >= 0; i--) {
          let overlay = this.currentOverlays[i];
          if (overlay.drawingMode === "marker") {
            this.map.removeOverlay(overlay.overlay);
            this.currentOverlays.splice(i, 1);
          }
        }
        this.updateDrawingClearControl();
      }
    },
    // 清除折线覆盖物
    clearPolylineOverlay() {
      let len = this.currentOverlays.length;
      if (len > 0) {
        for (let i = len - 1; i >= 0; i--) {
          let overlay = this.currentOverlays[i];
          if (overlay.drawingMode === "polyline") {
            this.map.removeOverlay(overlay.overlay);
            this.currentOverlays.splice(i, 1);
          }
        }
        this.updateDrawingClearControl();
      }
    },
    // 清除圆形覆盖物
    clearCircleOverlay() {
      let len = this.currentOverlays.length;
      if (len > 0) {
        for (let i = len - 1; i >= 0; i--) {
          let overlay = this.currentOverlays[i];
          if (overlay.drawingMode === "circle") {
            this.map.removeOverlay(overlay.overlay);
            this.currentOverlays.splice(i, 1);
          }
        }
        this.updateDrawingClearControl();
      }
    },
    // 清除多边形覆盖物
    clearPolygonOverlay() {
      let len = this.currentOverlays.length;
      if (len > 0) {
        for (let i = len - 1; i >= 0; i--) {
          let overlay = this.currentOverlays[i];
          if (
            overlay.drawingMode === "polygon" ||
            overlay.drawingMode === "rectangle"
          ) {
            this.map.removeOverlay(overlay.overlay);
            this.currentOverlays.splice(i, 1);
          }
        }
        this.updateDrawingClearControl();
      }
    },
    // 设置关键字联想和检索
    setKeywordAutoAndSearch() {
      let _this = this;
      if (!_this.$utilStr.isExist(_this.keywordSearchOffsetWidth)) {
        if (_this.keywordSearchPlacement === "top-left") {
          _this.currentKeywordSearchOffsetWidth = _this.ctrlSpaceMedium;
          if (_this.mapType) {
            _this.currentKeywordSearchOffsetWidth +=
              _this.mapTypeCtrlWidth + _this.ctrlSpaceMedium;
          }
          if (_this.online && _this.cityList) {
            _this.currentKeywordSearchOffsetWidth +=
              _this.cityListCtrlWidth + _this.ctrlSpaceMedium;
          }
        } else {
          _this.currentKeywordSearchOffsetWidth = _this.ctrlSpaceMedium;
          if (_this.navigation && _this.overviewMap) {
            _this.currentKeywordSearchOffsetWidth += _this.navigationCtrlWidth;
            if (_this.fullscreen)
              _this.currentKeywordSearchOffsetWidth -= _this.ctrlSpaceMedium;
          } else {
            if (_this.fullscreen)
              _this.currentKeywordSearchOffsetWidth +=
                _this.fullscreenCtrlWidth + _this.ctrlSpaceMini;
          }
          if (
            _this.activeEnableDrawingManager &&
            _this.drawingToolPlacement !== "top-left"
          ) {
            _this.currentKeywordSearchOffsetWidth +=
              _this.currentDrawingToolWidth &&
              _this.currentDrawingToolWidth + _this.ctrlSpaceMedium;
          }
        }
      }
      if (!_this.$utilStr.isExist(_this.keywordSearchOffsetHeight)) {
        _this.currentKeywordSearchOffsetHeight = _this.ctrlSpaceMedium;
      }
      _this.currentKeywordSearchReady = true;
      if (_this.currentKeywordAuto) {
        _this.setKeywordAuto();
      }
      _this.setKeywordSearch();
      _this.$nextTick(() => {
        let keywordSearchEl = _this.$el.querySelector(".hdty-map-search");
        if (keywordSearchEl) {
          _this.currentKeywordSearchWidth = keywordSearchEl.offsetWidth;
          _this.currentKeywordSearchHeight = keywordSearchEl.offsetHeight;
          let keywordSearchButtonEl = keywordSearchEl.querySelector(
            ".hdty-map-search-button"
          );
          if (keywordSearchButtonEl) {
            _this.currentKeywordSearchButtonWidth =
              keywordSearchButtonEl.offsetWidth;
          }
        }
        if (
          _this.activeEnableDrawingManager &&
          _this.drawingToolPlacement === "top-left" &&
          !_this.$utilStr.isExist(_this.drawingToolOffsetWidth) &&
          _this.currentDrawingToolReady
        ) {
          if (_this.keywordSearchPlacement === "top-left") {
            _this.currentDrawingToolOffsetWidth =
              _this.currentKeywordSearchOffsetWidth +
              (_this.currentKeywordSearchWidth &&
                _this.currentKeywordSearchWidth + _this.ctrlSpaceMedium);
            let offset = _this.drawingManager._drawingTool.getOffset();
            offset.width = _this.currentDrawingToolOffsetWidth;
            _this.drawingManager._drawingTool.setOffset(offset);
          }
        }
        if (_this.mapType && _this.keywordSearchPlacement === "top-left") {
          if (_this.currentKeywordSearchOffsetHeight <= _this.ctrlSpaceMedium) {
            let offset = _this.mapTypeCtrl.getOffset();
            offset.height =
              _this.currentKeywordSearchOffsetHeight +
              (_this.currentKeywordSearchHeight - _this.mapTypeCtrlHeight) / 2;
            _this.mapTypeCtrl.setOffset(offset);
          }
        }
        if (
          _this.online &&
          _this.cityList &&
          _this.keywordSearchPlacement === "top-left"
        ) {
          if (_this.currentKeywordSearchOffsetHeight <= _this.ctrlSpaceMedium) {
            let offset = _this.cityListCtrl.getOffset();
            offset.height =
              _this.currentKeywordSearchOffsetHeight +
              (_this.currentKeywordSearchHeight - _this.cityListCtrlHeight) / 2;
            _this.cityListCtrl.setOffset(offset);
          }
        }
      });
    },
    // 设置关键字联想
    setKeywordAuto() {
      let _this = this;
      _this.$nextTick(() => {
        if (_this.online && !_this.currentCustomKeywordAuto) {
          // 建立一个自动完成的对象
          _this.keywordAutoInstance = new BMap.Autocomplete({
            input: _this.keywordSearchId,
            location: _this.map,
            onSearchComplete: _this.keywordAutoComplete
          });
          document
            .getElementById(_this.keywordSearchId)
            .addEventListener("input", function (evt) {
              if (_this.activeKeywordShopEnabled) {
                if (_this.currentSearchKeywordUseShopKeyword) {
                  _this.currentSearchKeywordUseShopKeyword = false;
                }
              }
              let value = evt.target.value;
              if (!value) {
                _this.resetKeywordSearchFocus();
              }
            });
        } else if (!_this.currentCustomKeywordAuto) {
          document
            .getElementById(_this.keywordSearchId)
            .addEventListener("input", function (evt) {
              if (_this.activeKeywordShopEnabled) {
                if (_this.currentSearchKeywordUseShopKeyword) {
                  _this.currentSearchKeywordUseShopKeyword = false;
                }
              }
              let value = evt.target.value;
              if (value) {
                // 参数
                let dataParams = {
                  ak: _this.lbsKey,
                  typeConvert: _this.$global.coordType.BD09,
                  current: _this.keywordSearchPage.current,
                  size: _this.keywordSearchPage.size,
                  queryStr: value
                };
                localSearch(_this.LBSServerURL, dataParams)
                  .then((response) => {
                    let { success, data } = response.data;
                    if (success) {
                      if (data.results && data.results.length > 0) {
                        data.results.forEach((e) => {
                          let addComp = _this.$utilStr.extractRegion(e.address);
                          e.business = e.name;
                          e.province = addComp.province;
                          e.city = addComp.city;
                          e.district = addComp.district;
                        });
                      }
                      _this.keywordAutoComplete(data.results);
                    }
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              } else {
                _this.resetKeywordSearchFocus();
              }
            });
        } else {
          document
            .getElementById(_this.keywordSearchId)
            .addEventListener("input", function (evt) {
              if (_this.activeKeywordShopEnabled) {
                if (_this.currentSearchKeywordUseShopKeyword) {
                  _this.currentSearchKeywordUseShopKeyword = false;
                }
              }
              let value = evt.target.value;
              if (value) {
                _this.$emit("currentKeywordSearchInput", {
                  keyword: value,
                  keywordFilterFactor: _this.currentKeywordSearchControl,
                  realKeyword: !_this.currentSearchKeywordUseShopKeyword
                    ? value
                    : "",
                  shop:
                    _this.activeKeywordShop || _this.activeKeywordDefaultShop
                });
              } else {
                _this.resetKeywordSearchFocus();
              }
            });
        }
      });
    },
    // 设置关键字检索
    setKeywordSearch() {
      let _this = this;
      _this.$nextTick(() => {
        if (_this.online && !_this.currentCustomKeywordSearch) {
          // 建立一个本地检索的对象
          _this.keywordSearchInstance = new BMap.LocalSearch(_this.map, {
            renderOptions: {
              // map: _this.map, // 搜索结果自动标注
              selectFirstResult: false, // 默认选中第一个搜索结果
              autoViewport: false // 自动调整地图视野
            },
            pageCapacity: _this.keywordSearchPage.size, // 每页显示的数量
            onSearchComplete: function (result) {
              if (
                _this.keywordSearchInstance.getStatus() === BMAP_STATUS_SUCCESS
              ) {
                _this.currentKeywordSearchMode = BMAP_STATUS_SUCCESS;
                _this.keywordSearchComplete(result);
              } else if (
                _this.keywordSearchInstance.getStatus() ===
                BMAP_STATUS_CITY_LIST
              ) {
                _this.currentKeywordSearchMode = BMAP_STATUS_CITY_LIST;
                _this.cityListSearchComplete(result);
              } else {
                _this.currentKeywordSearchMode = -1;
                _this.searchLoading = false;
                _this.clearKeywordSearchResult();
                _this.clearKeywordSearchResultCache();
                _this.clearKeywordSearchOverlays();
                if (_this.searchKeyword) {
                  _this.keywordSearchVisible = true;
                }
              }
            }
          });
        }
        if (!_this.currentRouteSearchBoxOccupy) {
          document
            .getElementById(_this.keywordSearchId)
            .addEventListener("compositionstart", function () {
              _this.keywordSearchComposing = true;
            });
          document
            .getElementById(_this.keywordSearchId)
            .addEventListener("compositionupdate", function (evt) {
              let value = evt.target.value;
              _this.keywordSearchComposing =
                !/([(\uAC00-\uD7AF)|(\u3130-\u318F)])+/gi.test(
                  value[value.length - 1] || ""
                );
            });
          document
            .getElementById(_this.keywordSearchId)
            .addEventListener("compositionend", function () {
              if (_this.keywordSearchComposing) {
                _this.keywordSearchComposing = false;
              }
            });
          document
            .getElementById(_this.keywordSearchId)
            .addEventListener("input", function (evt) {
              let value = evt.target.value;
              if (!value) {
                if (!_this.keywordSearchComposing) {
                  _this.$emit("currentKeywordSearchClear");
                }
              }
            });
        }
      });
    },
    // 关键字联想完成
    keywordAutoComplete(val) {
      if (this.currentKeywordAuto) {
        let value = document.getElementById(this.keywordSearchId).value;
        if (value) {
          this.keywordAutoVisible = true;
          this.keywordAutoResult = [];
          if (this.online && !this.currentCustomKeywordAuto) {
            let count = val.getNumPois();
            if (count > 0) {
              for (let i = 0; i <= count - 1; i++) {
                let poi = val.getPoi(i);
                poi.region = poi.city + poi.district;
                this.keywordAutoResult.push(poi);
              }
            }
          } else {
            if (val && val.length > 0) {
              this.keywordAutoResult = val;
            }
          }
        }
      }
    },
    // 关键字检索完成
    keywordSearchComplete(val) {
      let _this = this;
      _this.keywordSearchVisible = true;
      _this.keywordSearchResult = [];
      _this.cityListSearchResult = [];
      if (_this.online && !_this.currentCustomKeywordSearch) {
        if (val.getNumPois) _this.keywordSearchPage.total = val.getNumPois();
        let count = val.getCurrentNumPois
          ? val.getCurrentNumPois()
          : val.length;
        if (count > 0) {
          // 坐标数组，设置最佳比例尺时会用到
          let pointArr = [];
          for (let i = 0; i < count; i++) {
            // 闭包
            (function (i) {
              let poi = val.getPoi ? val.getPoi(i) : val[i];
              if (!poi.business) {
                poi.business = poi.title;
              }
              if (poi.type === BMAP_POI_TYPE_BUSSTOP) {
                if (!poi.addressAlias) {
                  poi.addressAlias = "途经公交车：";
                }
              } else if (poi.type === BMAP_POI_TYPE_SUBSTOP) {
                if (!poi.addressAlias) {
                  poi.addressAlias = "途经地铁：";
                }
              }
              _this.keywordSearchResult.push(poi);
              poi.marker = setKeywordSearchOverlay(poi, i);
              _this.currentKeywordSearchPoiTarget.push(poi);
              pointArr.push(poi.point);
            })(i);
          }
          _this.searchLoading = false;
          if (!_this.currentRouteSearchBoxOccupy) {
            _this.cacheData.keywordSearchResult = _this.keywordSearchResult;
            _this.cacheData.keywordSearchPage = _this.$utilStr.deepClone(
              _this.keywordSearchPage
            );
          }
          let view = _this.map.getViewport(pointArr);
          let viewZoom = view && view.zoom;
          let searchDivideHigherZoom = _this.keywordSearchDivideZoom + 1;
          if (_this.currentZoom > _this.keywordSearchDivideZoom) {
            if (
              pointArr.length > 1 &&
              viewZoom > _this.keywordSearchDivideZoom
            ) {
              _this.currentKeywordSearchPoiViewDataset = pointArr;
              _this.setBestView(_this.currentKeywordSearchPoiViewDataset);
            } else {
              _this.map.setZoom(searchDivideHigherZoom);
              _this.map.panTo(utilGeo.getPolygonCenter(pointArr));
            }
          } else {
            if (pointArr.length > 1 && viewZoom > searchDivideHigherZoom) {
              _this.currentKeywordSearchPoiViewDataset = pointArr;
              _this.setBestView(_this.currentKeywordSearchPoiViewDataset);
            } else {
              _this.map.setZoom(searchDivideHigherZoom + 1);
              _this.map.panTo(utilGeo.getPolygonCenter(pointArr));
            }
          }
        } else {
          _this.searchLoading = false;
        }
      } else if (!_this.currentCustomKeywordSearch) {
        _this.keywordSearchPage.total = val.count;
        if (val.results && val.results.length > 0) {
          // 坐标数组，设置最佳比例尺时会用到
          let pointArr = [];
          val.results.forEach((poi, i) => {
            if (!poi.business) {
              poi.business = poi.name;
            }
            if (!poi.title) {
              poi.title = poi.name;
            }
            if (!poi.point) {
              if (!isNaN(parseFloat(poi.lng)) && !isNaN(parseFloat(poi.lat))) {
                poi.point = new BMap.Point(poi.lng, poi.lat);
              }
            }
            _this.keywordSearchResult.push(poi);
            if (poi.point) {
              poi.marker = setKeywordSearchOverlay(poi, i);
              pointArr.push(poi.point);
            }
            _this.currentKeywordSearchPoiTarget.push(poi);
          });
          _this.searchLoading = false;
          if (!_this.currentRouteSearchBoxOccupy) {
            _this.cacheData.keywordSearchResult = _this.keywordSearchResult;
            _this.cacheData.keywordSearchPage = _this.$utilStr.deepClone(
              _this.keywordSearchPage
            );
          }
          _this.currentKeywordSearchPoiViewDataset = pointArr;
          _this.setBestView(_this.currentKeywordSearchPoiViewDataset);
        } else {
          _this.searchLoading = false;
        }
      } else {
        _this.keywordSearchPage.total = Number(
          _this.customKeywordSearchResultTotal
        );
        if (val && val.length > 0) {
          // 坐标数组，设置最佳比例尺时会用到
          let pointArr = [];
          val.forEach((poi, i) => {
            if (!poi.title) {
              poi.title = poi.business;
            }
            if (!poi.point) {
              if (!isNaN(parseFloat(poi.lng)) && !isNaN(parseFloat(poi.lat))) {
                poi.point = new BMap.Point(poi.lng, poi.lat);
              }
            }
            _this.keywordSearchResult.push(poi);
            if (poi.point) {
              poi.marker = setKeywordSearchOverlay(poi, i);
              pointArr.push(poi.point);
            }
            _this.currentKeywordSearchPoiTarget.push(poi);
          });
          _this.searchLoading = false;
          if (!_this.currentRouteSearchBoxOccupy) {
            _this.cacheData.keywordSearchResult = _this.keywordSearchResult;
            _this.cacheData.keywordSearchPage = _this.$utilStr.deepClone(
              _this.keywordSearchPage
            );
          }
          let view = _this.map.getViewport(pointArr);
          let viewZoom = view && view.zoom;
          let searchDivideHigherZoom = _this.keywordSearchDivideZoom + 1;
          if (_this.currentZoom > _this.keywordSearchDivideZoom) {
            if (
              pointArr.length > 1 &&
              viewZoom > _this.keywordSearchDivideZoom
            ) {
              _this.currentKeywordSearchPoiViewDataset = pointArr;
              _this.setBestView(_this.currentKeywordSearchPoiViewDataset);
            } else {
              _this.map.setZoom(searchDivideHigherZoom);
              _this.map.panTo(utilGeo.getPolygonCenter(pointArr));
            }
          } else {
            if (pointArr.length > 1 && viewZoom > searchDivideHigherZoom) {
              _this.currentKeywordSearchPoiViewDataset = pointArr;
              _this.setBestView(_this.currentKeywordSearchPoiViewDataset);
            } else {
              _this.map.setZoom(searchDivideHigherZoom + 1);
              _this.map.panTo(utilGeo.getPolygonCenter(pointArr));
            }
          }
        } else {
          _this.searchLoading = false;
        }
      }
      if (!_this.currentRouteSearchBoxOccupy) {
        _this.$emit(
          "currentKeywordSearchComplete",
          _this.keywordSearchResult,
          _this.currentKeywordSearchPoiTarget,
          _this.map
        );
      }
      function setKeywordSearchOverlay(val, index) {
        // 创建标注对象
        let mk = new BMap.Marker(val.point, {
          icon: _this.getMapIcon("a1" + _this.$utilStr.digitFtt(index + 1, 2))
        });
        // 地图上添加poi点
        _this.map.addOverlay(mk);
        _this.setKeywordSearchPoiHoverAndSelect(val, index, mk);
        // 设置标注点默认点击事件
        mk.addEventListener("click", function (evt) {
          evt.domEvent.stopPropagation();
          if (!_this.currentRouteSearchBoxOccupy) {
            _this.clearInfoBox();
            _this.handleKeywordSearchItem(val, true);
          }
        });
        // 设置poi点信息窗口
        if (val.popover) {
          _this.setMarkerInfoWindow(mk, val);
        } else if (val.popover !== null && val.popover !== "") {
          mk.setTitle("点击查看详情");
          let popoverBody = document.createElement("div");
          popoverBody.className = "hdty-bubble-body";
          let contentHTML = "";
          if (val.tags && val.tags.length > 0) {
            let tagsHTML = "";
            for (let i = 0; i < val.tags.length; i++) {
              tagsHTML += '<div class="hdty-tag">' + val.tags[i] + "</div>";
            }
            let labelHTML = "";
            let labelWidth = 0;
            if (val.tagsAlias) {
              labelWidth = val.tagsAlias.length * 14 + 6 + "px";
              labelHTML +=
                '<div class="hdty-form-label" style="width: ' +
                labelWidth +
                ';padding: 0 6px 0 0;">' +
                val.tagsAlias +
                "</div>";
            }
            contentHTML +=
              '<div class="hdty-form-item" style="margin-bottom: 4px;">' +
              labelHTML +
              '<div class="hdty-form-content" style="margin-left: ' +
              labelWidth +
              ';">' +
              tagsHTML +
              "</div></div>";
          }
          if (val.address) {
            let labelHTML = "";
            let labelWidth = 0;
            if (val.addressAlias) {
              labelWidth = val.addressAlias.length * 14 + 6 + "px";
              labelHTML +=
                '<div class="hdty-form-label" style="width: ' +
                labelWidth +
                ';padding: 0 6px 0 0;">' +
                val.addressAlias +
                "</div>";
            }
            contentHTML +=
              '<div class="hdty-form-item" style="margin-bottom: 4px;">' +
              labelHTML +
              '<div class="hdty-form-content" style="margin-left: ' +
              labelWidth +
              ';">' +
              val.address +
              "</div></div>";
          }
          popoverBody.innerHTML = contentHTML;
          if (_this.currentRouteSearchBoxOccupy) {
            let item = document.createElement("div");
            item.className = "hdty-form-item";
            item.style.marginTop = "8px";
            item.style.marginBottom = "0";
            item.style.textAlign = "center";
            let btn = document.createElement("button");
            btn.className = "hdty-btn";
            btn.onclick = () => {
              _this.handleKeywordSearchItem(val, true);
              btn.onclick = null;
            };
            item.appendChild(btn);
            if (_this.currentRouteSearchBoxOccupy === "start") {
              let btnTxt = document.createTextNode("设为起点");
              btn.appendChild(btnTxt);
              popoverBody.appendChild(item);
            } else if (_this.currentRouteSearchBoxOccupy === "end") {
              let btnTxt = document.createTextNode("设为终点");
              btn.appendChild(btnTxt);
              popoverBody.appendChild(item);
            }
          }
          let popover = document.createElement("div");
          popover.className = "hdty-bubble";
          popover.innerHTML =
            '<div class="hdty-bubble-header"><span class="hdty-bubble-title">' +
            val.business +
            "</span></div>";
          popover.appendChild(popoverBody);
          mk.addEventListener("click", function () {
            _this.setInfoWindow(
              popover,
              "search",
              new BMap.Size(0, 32),
              function (info) {
                if (!_this.currentRouteSearchBoxOccupy) {
                  info.addEventListener("open", function (e) {
                    _this.$emit(
                      "currentKeywordSearchPoiOpen",
                      val,
                      index,
                      mk,
                      e
                    );
                  });
                }
                info.open(mk);
              }
            );
          });
        }
        // 设置poi点文字提示
        if (val.title) {
          _this.setMarkerTitle(mk, val);
        } else {
          mk.setTitle(val.business);
        }
        if (val.label) {
          _this.setMarkerLabel(mk, val);
        }
        if (val.dragging) {
          _this.setMarkerDragging(mk, val);
        }
        if (val.onclick) {
          _this.setMarkerClick(mk, val);
        }
        if (val.ondblclick) {
          _this.setMarkerDblclick(mk, val);
        }
        if (val.contextmenu) {
          _this.setMarkerContextmenu(mk, val);
        }
        return mk;
      }
    },
    // 关键字按城市列表检索完成
    cityListSearchComplete(val) {
      let _this = this;
      _this.keywordSearchVisible = true;
      _this.keywordSearchResult = [];
      _this.cityListSearchResult = [];
      if (!_this.currentRouteSearchBoxOccupy) {
        _this.cacheData.keywordSearchResult = [];
        _this.cacheData.keywordSearchPage = null;
      }
      if (_this.online && !_this.currentCustomKeywordSearch) {
        let list = val.getCityList ? val.getCityList() : val;
        let count = list.length;
        if (list && count > 0) {
          // 坐标数组，设置最佳比例尺时会用到
          let pointArr = [];
          for (let i = 0; i < count; i++) {
            if (!list[i].department) {
              list[i].department = list[i].city;
            }
            if (isNaN(parseInt(list[i].num))) {
              list[i].num = list[i].numResults;
            }
            _this.cityListSearchResult.push(list[i]);
            if (!list[i].point) {
              if (
                !isNaN(parseFloat(list[i].lng)) &&
                !isNaN(parseFloat(list[i].lat))
              ) {
                let pt = new BMap.Point(list[i].lng, list[i].lat);
                list[i].point = pt;
                list[i].marker = setCityListSearchOverlay(list[i]);
                _this.currentKeywordSearchPoiTarget.push(list[i]);
                pointArr.push(pt);
              } else {
                let cityCenter = _this.activeCityCenter.find(
                  (e) => list[i].city && list[i].city.indexOf(e.f) === 0
                );
                if (cityCenter) {
                  let center = cityCenter.g.split("|")[0].split(",");
                  let pt = new BMap.Point(center[0], center[1]);
                  list[i].point = pt;
                  list[i].marker = setCityListSearchOverlay(list[i]);
                  _this.currentKeywordSearchPoiTarget.push(list[i]);
                  pointArr.push(pt);
                } else {
                  _this.getPoint(list[i].city).then((pt) => {
                    if (pt) {
                      list[i].point = pt;
                      list[i].marker = setCityListSearchOverlay(list[i]);
                      _this.currentKeywordSearchPoiTarget.push(list[i]);
                      pointArr.push(pt);
                    }
                  });
                }
              }
            } else {
              list[i].marker = setCityListSearchOverlay(list[i]);
              _this.currentKeywordSearchPoiTarget.push(list[i]);
              pointArr.push(list[i].point);
            }
          }
          _this.searchLoading = false;
          if (!_this.currentRouteSearchBoxOccupy) {
            _this.cacheData.cityListSearchResult = _this.cityListSearchResult;
          }
          let view = _this.map.getViewport(pointArr);
          let viewZoom = view && view.zoom;
          let searchDivideLowerZoom = _this.keywordSearchDivideZoom - 1;
          if (_this.currentZoom <= _this.keywordSearchDivideZoom) {
            if (
              pointArr.length > 1 &&
              viewZoom <= _this.keywordSearchDivideZoom
            ) {
              _this.currentKeywordSearchPoiViewDataset = pointArr;
              _this.setBestView(_this.currentKeywordSearchPoiViewDataset);
              if (!_this.currentRouteSearchBoxOccupy) {
                _this.cacheData.cityListSearchResultViewZoom = view.zoom;
              }
            } else {
              _this.map.setZoom(_this.keywordSearchDivideZoom);
              _this.map.panTo(utilGeo.getPolygonCenter(pointArr));
              if (!_this.currentRouteSearchBoxOccupy) {
                _this.cacheData.cityListSearchResultViewZoom =
                  _this.keywordSearchDivideZoom;
              }
            }
          } else {
            if (pointArr.length > 1 && viewZoom <= searchDivideLowerZoom) {
              _this.currentKeywordSearchPoiViewDataset = pointArr;
              _this.setBestView(_this.currentKeywordSearchPoiViewDataset);
              if (!_this.currentRouteSearchBoxOccupy) {
                _this.cacheData.cityListSearchResultViewZoom = view.zoom;
              }
            } else {
              _this.map.setZoom(searchDivideLowerZoom);
              _this.map.panTo(utilGeo.getPolygonCenter(pointArr));
              if (!_this.currentRouteSearchBoxOccupy) {
                _this.cacheData.cityListSearchResultViewZoom =
                  searchDivideLowerZoom;
              }
            }
          }
        } else {
          _this.searchLoading = false;
        }
      } else {
        let count = val.length;
        if (val && count > 0) {
          // 坐标数组，设置最佳比例尺时会用到
          let pointArr = [];
          for (let i = 0; i < count; i++) {
            if (!val[i].department) {
              val[i].department = val[i].city;
            }
            _this.cityListSearchResult.push(val[i]);
            if (!val[i].point) {
              if (
                !isNaN(parseFloat(val[i].lng)) &&
                !isNaN(parseFloat(val[i].lat))
              ) {
                let pt = new BMap.Point(val[i].lng, val[i].lat);
                val[i].point = pt;
                val[i].marker = setCityListSearchOverlay(val[i]);
                _this.currentKeywordSearchPoiTarget.push(val[i]);
                pointArr.push(pt);
              } else {
                let cityCenter = _this.activeCityCenter.find(
                  (e) => val[i].city && val[i].city.indexOf(e.f) === 0
                );
                if (cityCenter) {
                  let center = cityCenter.g.split("|")[0].split(",");
                  let pt = new BMap.Point(center[0], center[1]);
                  val[i].point = pt;
                  val[i].marker = setCityListSearchOverlay(val[i]);
                  _this.currentKeywordSearchPoiTarget.push(val[i]);
                  pointArr.push(pt);
                } else {
                  _this.getPoint(val[i].city).then((pt) => {
                    if (pt) {
                      val[i].point = pt;
                      val[i].marker = setCityListSearchOverlay(val[i]);
                      _this.currentKeywordSearchPoiTarget.push(val[i]);
                      pointArr.push(pt);
                    }
                  });
                }
              }
            } else {
              val[i].marker = setCityListSearchOverlay(val[i]);
              _this.currentKeywordSearchPoiTarget.push(val[i]);
              pointArr.push(val[i].point);
            }
          }
          _this.searchLoading = false;
          if (!_this.currentRouteSearchBoxOccupy) {
            _this.cacheData.cityListSearchResult = _this.cityListSearchResult;
          }
          let view = _this.map.getViewport(pointArr);
          let viewZoom = view && view.zoom;
          let searchDivideLowerZoom = _this.keywordSearchDivideZoom - 1;
          if (_this.currentZoom <= _this.keywordSearchDivideZoom) {
            if (
              pointArr.length > 1 &&
              viewZoom <= _this.keywordSearchDivideZoom
            ) {
              _this.currentKeywordSearchPoiViewDataset = pointArr;
              _this.setBestView(_this.currentKeywordSearchPoiViewDataset);
              if (!_this.currentRouteSearchBoxOccupy) {
                _this.cacheData.cityListSearchResultViewZoom = view.zoom;
              }
            } else {
              _this.map.setZoom(_this.keywordSearchDivideZoom);
              _this.map.panTo(utilGeo.getPolygonCenter(pointArr));
              if (!_this.currentRouteSearchBoxOccupy) {
                _this.cacheData.cityListSearchResultViewZoom =
                  _this.keywordSearchDivideZoom;
              }
            }
          } else {
            if (pointArr.length > 1 && viewZoom <= searchDivideLowerZoom) {
              _this.currentKeywordSearchPoiViewDataset = pointArr;
              _this.setBestView(_this.currentKeywordSearchPoiViewDataset);
              if (!_this.currentRouteSearchBoxOccupy) {
                _this.cacheData.cityListSearchResultViewZoom = view.zoom;
              }
            } else {
              _this.map.setZoom(searchDivideLowerZoom);
              _this.map.panTo(utilGeo.getPolygonCenter(pointArr));
              if (!_this.currentRouteSearchBoxOccupy) {
                _this.cacheData.cityListSearchResultViewZoom =
                  searchDivideLowerZoom;
              }
            }
          }
        } else {
          _this.searchLoading = false;
        }
      }
      if (!_this.currentRouteSearchBoxOccupy) {
        _this.$emit(
          "currentCityListSearchComplete",
          _this.cityListSearchResult,
          _this.currentKeywordSearchPoiTarget,
          _this.map
        );
      }
      function setCityListSearchOverlay(val) {
        let pt = val.point;
        // 创建标注对象
        let mk = new BMap.Marker(pt, {
          icon: _this.getMapIcon("d1")
        });
        // 地图上添加标注点
        _this.map.addOverlay(mk);
        // 设置标注点文字提示
        mk.setTitle(val.department + "共" + val.num + "个结果");
        // 设置标注点文本标注
        let label = new BMap.Label(val.num > 999 ? "999+" : val.num, {
          offset: new BMap.Size(0, 16)
        });
        label.setStyle(_this.overlayStyle.cityListSearchLabel);
        mk.setLabel(label);
        // 注册标注点的点击事件
        mk.addEventListener("click", function () {
          _this.handleCityListSearchItem(val);
        });
        return mk;
      }
    },
    // 设置关键字检索poi点鼠标悬停和选中效果
    setKeywordSearchPoiHoverAndSelect(val, index, mk) {
      let _this = this;
      let fixNum = _this.$utilStr.digitFtt(index + 1, 2);
      let defaultIcon = "a1" + fixNum;
      let activeIcon = "a2" + fixNum;
      let currentIcon = mk.getIcon().name;
      if (currentIcon !== _this.iconPrefix + defaultIcon) {
        mk.setIcon(_this.getMapIcon(defaultIcon));
      }
      // 设置鼠标悬停效果
      mk.addEventListener("mouseover", setHover);
      mk.addEventListener("mouseout", removeHover);
      // 设置鼠标选中效果
      mk.addEventListener("click", setSelect);
      function setHover() {
        mk.setIcon(_this.getMapIcon(activeIcon));
      }
      function removeHover() {
        mk.setIcon(_this.getMapIcon(defaultIcon));
      }
      function setSelect(evt) {
        mk.removeEventListener("mouseover", setHover);
        mk.removeEventListener("mouseout", removeHover);
        mk.removeEventListener("click", setSelect);
        reset(val, index, mk, evt);
      }
      function reset(val, i, mk, e) {
        _this.currentKeywordSearchPoiTarget.forEach((poi, j) => {
          let activeMk = poi.marker;
          if (activeMk) {
            let fixNum = _this.$utilStr.digitFtt(j + 1, 2);
            let defaultIcon = "a1" + fixNum;
            let activeIcon = "a2" + fixNum;
            let activeMkIcon = activeMk.getIcon().name;
            if (activeMkIcon !== _this.iconPrefix + defaultIcon && j !== i) {
              activeMk.setIcon(_this.getMapIcon(defaultIcon));
              function setInnerHover() {
                activeMk.setIcon(_this.getMapIcon(activeIcon));
              }
              function removeInnerHover() {
                activeMk.setIcon(_this.getMapIcon(defaultIcon));
              }
              function setInnerSelect(evt) {
                activeMk.removeEventListener("mouseover", setInnerHover);
                activeMk.removeEventListener("mouseout", removeInnerHover);
                activeMk.removeEventListener("click", setInnerSelect);
                reset(poi, j, activeMk, evt);
              }
              // 设置鼠标悬停效果
              activeMk.addEventListener("mouseover", setInnerHover);
              activeMk.addEventListener("mouseout", removeInnerHover);
              // 设置鼠标选中效果
              activeMk.addEventListener("click", setInnerSelect);
            }
          }
        });
        if (!_this.currentRouteSearchBoxOccupy) {
          _this.$emit("currentKeywordSearchPoiClick", val, i, mk, e);
        }
      }
    },
    // 关键字检索框获得焦点
    handleKeywordSearchFocus() {
      let _this = this;
      _this.clearInfoBox();
      if (_this.searchKeyword) {
        if (_this.keywordAutoResult.length > 0) {
          if (!_this.keywordAutoVisible) {
            _this.keywordAutoVisible = true;
          }
        }
        if (_this.cacheData.keywordSearchResult.length > 0) {
          if (!_this.keywordSearchVisible) {
            _this.currentKeywordSearchResultItem = null;
            if (!_this.$utilStr.isEmpty(_this.cacheData.keywordSearchPage)) {
              _this.keywordSearchPage = _this.$utilStr.deepClone(
                _this.cacheData.keywordSearchPage
              );
            }
            _this.keywordSearchResult = _this.cacheData.keywordSearchResult;
            _this.keywordSearchVisible = true;
          }
        } else if (_this.cacheData.cityListSearchResult.length > 0) {
          if (!_this.keywordSearchVisible) {
            _this.currentCityListSearchResultItem = null;
            if (
              !_this.$utilStr.isEmpty(
                _this.cacheData.cityListSearchResultViewZoom
              )
            ) {
              _this.map.setZoom(_this.cacheData.cityListSearchResultViewZoom);
            }
            _this.cityListSearchResult = _this.cacheData.cityListSearchResult;
            _this.keywordSearchVisible = true;
          }
        }
      } else {
        if (_this.activeKeywordShopEnabled) {
          if (!_this.keywordSearchVisible) {
            _this.keywordShopVisible = true;
          }
        }
      }
      // 点击地图释放检索框焦点
      _this.mapElement.onclick = () => {
        _this.$refs.searchRef.blur();
        _this.mapElement.onclick = null;
      };
      _this.mapElement.oncontextmenu = () => {
        _this.$refs.searchRef.blur();
        _this.mapElement.oncontextmenu = null;
      };
      // 点击其他位置隐藏检索结果面板
      document.documentElement.onclick = (e) => {
        let input = _this.$el.querySelector(".hdty-map-search");
        if (!input.contains(e.target)) {
          let shop = _this.$el.querySelector(".hdty-map-search-shop");
          let list = _this.$el.querySelector(".hdty-map-search-list");
          let closed = false;
          if (shop && !shop.contains(e.target)) {
            _this.keywordShopVisible = false;
            if (_this.currentKeywordShopRealChecked) {
              _this.currentKeywordShopRealChecked = false;
            }
            _this.currentKeywordShop = null;
            closed = true;
          }
          if (list && !list.contains(e.target)) {
            _this.keywordAutoVisible = false;
            _this.keywordSearchVisible = false;
            closed = true;
            _this.resetKeywordShop();
          }
          if (closed) {
            document.documentElement.onclick = null;
            document.documentElement.oncontextmenu = null;
          }
        }
      };
      document.documentElement.oncontextmenu = (e) => {
        let input = _this.$el.querySelector(".hdty-map-search");
        if (!input.contains(e.target)) {
          let shop = _this.$el.querySelector(".hdty-map-search-shop");
          let list = _this.$el.querySelector(".hdty-map-search-list");
          let closed = false;
          if (shop && !shop.contains(e.target)) {
            _this.keywordShopVisible = false;
            if (_this.currentKeywordShopRealChecked) {
              _this.currentKeywordShopRealChecked = false;
            }
            _this.currentKeywordShop = null;
            closed = true;
          }
          if (list && !list.contains(e.target)) {
            _this.keywordAutoVisible = false;
            _this.keywordSearchVisible = false;
            closed = true;
            _this.resetKeywordShop();
          }
          if (closed) {
            document.documentElement.onclick = null;
            document.documentElement.oncontextmenu = null;
          }
        }
      };
    },
    // 重置到关键字检索框获得焦点状态
    resetKeywordSearchFocus() {
      if (this.keywordAutoVisible) {
        this.keywordAutoVisible = false;
      }
      this.clearKeywordAutoResult();
      if (this.activeKeywordShopEnabled) {
        if (!this.keywordShopVisible) {
          this.keywordShopVisible = true;
        }
      }
      if (this.currentKeywordShopMockChecked) {
        this.currentKeywordShopMockChecked = false;
      }
      this.clearKeywordSearchOverlays();
    },
    // 关键字检索框值发生改变
    handleKeywordSearchInput(val) {
      this.currentKeywordAuto = this.keywordAuto;
      this.currentCustomKeywordAuto = this.customKeywordAuto;
      this.currentCustomKeywordSearch = this.customKeywordSearch;
      if (this.activeKeywordShopEnabled) {
        if (this.currentSearchKeywordUseShopKeyword) {
          this.currentSearchKeywordUseShopKeyword = false;
        }
      }
      if (this.keywordSearchVisible) {
        this.keywordSearchVisible = false;
      }
      this.clearKeywordSearchResult();
      this.clearKeywordSearchResultCache();
      if (val) {
        if (this.keywordShopVisible) {
          this.keywordShopVisible = false;
        }
      }
    },
    // 点击关键字检索框清空按钮
    handleKeywordSearchClear() {
      if (this.keywordAutoVisible) {
        this.keywordAutoVisible = false;
      }
      this.clearKeywordAutoResult();
      if (this.keywordShopVisible) {
        this.keywordShopVisible = false;
      }
      if (this.currentKeywordShopRealChecked) {
        this.currentKeywordShopRealChecked = false;
      }
      if (this.currentKeywordShopMockChecked) {
        this.currentKeywordShopMockChecked = false;
      }
      this.currentKeywordShop = null;
      this.clearKeywordSearchOverlays();
      this.$refs.searchRef.blur();
      this.$emit("currentKeywordSearchClear", BMAP_SEARCH_CLEAR_TRIGGER_BUTTON);
    },
    // 点击关键字检索功能项
    handleKeywordShopItem(val) {
      this.currentKeywordAuto = false;
      this.currentCustomKeywordSearch = this.customKeywordSearch;
      this.keywordShopVisible = false;
      if (this.keepKeywordSearchAlive) {
        this.clearKeywordSearchOverlays();
        this.clearDrawingMode();
      } else {
        this.clearAll();
      }
      this.currentKeywordShopRealChecked = true;
      this.currentKeywordShop = val.shop;
      if (val.keyword) {
        this.searchKeyword = val.keyword;
        this.currentSearchKeywordUseShopKeyword = !!this.searchKeyword;
      }
      this.keywordSearchPage.current = 1;
      if (!this.currentCustomKeywordSearch) {
        if (this.keywordSearchInstance) {
          this.keywordSearchInstance.clearResults();
        }
        this.poiSearch(this.searchKeyword);
      } else {
        this.currentKeywordSearchMode = this.getKeywordSearchCurrentMode();
        this.emitKeywordSearchClickEvent();
      }
    },
    // 重置关键字检索功能区
    resetKeywordShop() {
      if (!this.searchKeyword) {
        this.currentKeywordAuto = this.keywordAuto;
        this.currentCustomKeywordAuto = this.customKeywordAuto;
        this.currentCustomKeywordSearch = this.customKeywordSearch;
        this.clearKeywordSearchResult();
        this.clearKeywordSearchResultCache();
        if (this.currentKeywordShopRealChecked) {
          this.currentKeywordShopRealChecked = false;
        }
        if (this.currentKeywordShopMockChecked) {
          this.currentKeywordShopMockChecked = false;
        }
        this.currentKeywordShop = null;
        this.clearKeywordSearchOverlays();
        this.$emit("currentKeywordSearchClear");
      }
    },
    // 设置关键字检索过滤数据
    setKeywordSearchFilterData() {
      let keywordSearchFilterData = null;
      let keywordSearchExtendData = null;
      if (this.activeKeywordShopChecked) {
        if (this.activeKeywordFilters) {
          keywordSearchFilterData = {};
          keywordSearchExtendData = {};
          this.activeKeywordFilters.forEach((item) => {
            let initialValue;
            if (this.$utilStr.isExist(item.value)) {
              initialValue = item.value;
            } else {
              if (
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
            this.$set(keywordSearchFilterData, item.field, initialValue);
            if (item.type === "factorInput") {
              let initialLabel;
              if (this.$utilStr.isExist(item.factor)) {
                initialLabel = item.factor;
              } else {
                initialLabel = "";
              }
              this.$set(
                keywordSearchExtendData,
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
              this.$set(keywordSearchExtendData, item.field, initialLabel);
            }
          });
          this.$set(
            keywordSearchFilterData,
            "andor",
            this.$app.factorOptions.logicOpe.and
          );
        }
      }
      this.keywordSearchFilterData = keywordSearchFilterData;
      this.keywordSearchExtendData = keywordSearchExtendData;
    },
    // 点击关键字联想結果项
    handleKeywordAutoItem(val) {
      this.currentKeywordAuto = false;
      this.keywordAutoVisible = false;
      this.keywordAutoResult = [];
      if (!this.currentRouteSearchBoxOccupy) {
        this.searchKeyword = val.business;
        if (this.activeKeywordFilterShopEnabled) {
          if (!this.activeKeywordShopChecked) {
            this.currentKeywordShopMockChecked = true;
            this.currentKeywordShop = this.activeKeywordDefaultShop;
          }
        }
        if (this.keepKeywordSearchAlive) {
          this.clearKeywordSearchOverlays();
          this.clearDrawingMode();
        } else {
          this.clearAll();
        }
        this.keywordSearchPage.current = 1;
        if (!this.currentCustomKeywordSearch) {
          if (this.keywordSearchInstance) {
            this.keywordSearchInstance.clearResults();
          }
          this.poiSearch(this.searchKeyword);
        } else {
          this.currentKeywordSearchMode = this.getKeywordSearchCurrentMode();
          this.emitKeywordSearchClickEvent();
        }
        this.$refs.searchRef.focus();
      } else {
        let searchKeyword = "";
        if (this.currentRouteSearchBoxOccupy === "start") {
          this.startSearchKeyword = val.business;
          searchKeyword = this.startSearchKeyword;
        } else if (this.currentRouteSearchBoxOccupy === "end") {
          this.endSearchKeyword = val.business;
          searchKeyword = this.endSearchKeyword;
        }
        this.keywordSearchPage.current = 1;
        if (this.keywordSearchInstance) {
          this.keywordSearchInstance.clearResults();
        }
        this.poiSearch(searchKeyword);
      }
    },
    // 点击关键字检索
    handleKeywordSearch() {
      if (this.currentRouteSearchBoxOccupy) {
        this.handleRouteSearchClose();
      }
      if (this.searchKeyword) {
        this.currentKeywordAuto = false;
        this.currentCustomKeywordSearch = this.customKeywordSearch;
        this.keywordAutoVisible = false;
        this.clearKeywordAutoResult();
        this.keywordSearchVisible = false;
        this.clearKeywordSearchResult();
        this.clearKeywordSearchResultCache();
        if (this.activeKeywordFilterShopEnabled) {
          if (!this.activeKeywordShopChecked) {
            this.currentKeywordShopMockChecked = true;
            this.currentKeywordShop = this.activeKeywordDefaultShop;
          }
        }
        if (this.keepKeywordSearchAlive) {
          this.clearKeywordSearchOverlays();
          this.clearDrawingMode();
        } else {
          this.clearAll();
        }
        this.keywordSearchPage.current = 1;
        if (!this.currentCustomKeywordSearch) {
          if (this.keywordSearchInstance) {
            this.keywordSearchInstance.clearResults();
          }
          this.poiSearch(this.searchKeyword);
        } else {
          this.currentKeywordSearchMode = this.getKeywordSearchCurrentMode();
          this.emitKeywordSearchClickEvent();
        }
        this.$refs.searchRef.focus();
      }
    },
    // 点击关键字检索结果项
    handleKeywordSearchItem(val, markerClick) {
      let _this = this;
      if (!_this.currentRouteSearchBoxOccupy) {
        if (val.marker) {
          _this.keywordSearchVisible = false;
          _this.currentKeywordSearchResultItem = val;
          _this.cacheData.currentKeywordSearchResultItem =
            _this.currentKeywordSearchResultItem;
          _this.currentKeywordSearchResultItemChecked = true;
        }
        if (!markerClick) {
          if (val.marker) {
            let markerLabel = val.marker.getLabel();
            _this.clearKeywordSearchOverlays();
            _this.map.addOverlay(val.marker);
            if (markerLabel) {
              val.marker.setLabel(markerLabel);
            }
            _this.currentKeywordSearchPoiTarget.push(val);
            _this.currentKeywordSearchPoiViewDataset = [val.point];
            _this.setBestView(_this.currentKeywordSearchPoiViewDataset);
          }
          _this.$emit(
            "currentKeywordSearchItemClick",
            val,
            _this.currentKeywordSearchPoiTarget,
            _this.map
          );
        }
        // 点击其他位置隐藏检索结果面板
        document.documentElement.onclick = (e) => {
          let intro = _this.$el.querySelector(".hdty-map-search-intro");
          if (intro && !intro.contains(e.target)) {
            _this.currentKeywordSearchResultItemChecked = false;
            _this.currentKeywordSearchResultItem = null;
            _this.resetKeywordShop();
            document.documentElement.onclick = null;
            document.documentElement.oncontextmenu = null;
          }
        };
        document.documentElement.oncontextmenu = (e) => {
          let intro = _this.$el.querySelector(".hdty-map-search-intro");
          if (intro && !intro.contains(e.target)) {
            _this.currentKeywordSearchResultItemChecked = false;
            _this.currentKeywordSearchResultItem = null;
            _this.resetKeywordShop();
            document.documentElement.onclick = null;
            document.documentElement.oncontextmenu = null;
          }
        };
      } else {
        _this.keywordSearchVisible = false;
        _this.currentKeywordSearchResultItemChecked = true;
        _this.clearKeywordSearchOverlays();
        if (_this.currentRouteSearchBoxOccupy === "start") {
          _this.startSearchKeyword = val.business;
          _this.routeSearchStartPoint = val.point;
        } else if (this.currentRouteSearchBoxOccupy === "end") {
          _this.endSearchKeyword = val.business;
          _this.routeSearchEndPoint = val.point;
        }
        _this.currentDrivingRoutePath.start = _this.routeSearchStartPoint;
        _this.currentDrivingRoutePath.end = _this.routeSearchEndPoint;
        _this.currentDrivingRoutePath.ways = [];
        _this.setDrivingRoute(true);
      }
    },
    // 点击关键字按城市列表检索结果项
    handleCityListSearchItem(val) {
      this.keywordSearchVisible = false;
      this.currentCityListSearchResultItem = val;
      if (!this.currentRouteSearchBoxOccupy) {
        this.cacheData.currentCityListSearchResultItem =
          this.currentCityListSearchResultItem;
      }
      this.currentCityListSearchResultItemChecked = true;
      this.clearKeywordSearchOverlays();
      this.keywordSearchPage.current = 1;
      if (!this.currentCustomKeywordSearch) {
        this.keywordSearchLocationChanged = true;
        this.keywordSearchLocation = val.city;
        if (this.keywordSearchInstance) {
          this.keywordSearchInstance.clearResults();
        }
        this.poiSearch(this.searchKeyword);
      } else {
        this.currentKeywordSearchMode = BMAP_STATUS_SUCCESS;
        this.searchLoading = true;
        this.$emit("currentCityListSearchItemClick", {
          ...val,
          keyword: this.searchKeyword,
          keywordFilterFactor: this.currentKeywordSearchControl,
          realKeyword: !this.currentSearchKeywordUseShopKeyword
            ? this.searchKeyword
            : "",
          shop: this.activeKeywordShop,
          filters: this.keywordSearchFilterData,
          extendFilters: this.keywordSearchExtendData
        });
      }
    },
    // 关键字检索结果当前页数发生改变
    handleKeywordSearchCurrentChange(val) {
      this.clearKeywordSearchOverlays();
      this.keywordSearchPage.current = val;
      if (this.online && !this.currentCustomKeywordSearch) {
        this.searchLoading = true;
        this.keywordSearchInstance.gotoPage(val - 1);
      } else if (!this.currentCustomKeywordSearch) {
        if (this.currentRouteSearchBoxOccupy === "start") {
          this.poiSearch(this.startSearchKeyword);
        } else if (this.currentRouteSearchBoxOccupy === "end") {
          this.poiSearch(this.endSearchKeyword);
        } else {
          this.poiSearch(this.searchKeyword);
        }
      } else {
        this.searchLoading = true;
        this.$emit(
          "currentKeywordSearchCurrentChanged",
          {
            ...this.cacheData.currentCityListSearchResultItem,
            keyword: this.searchKeyword,
            keywordFilterFactor: this.currentKeywordSearchControl,
            realKeyword: !this.currentSearchKeywordUseShopKeyword
              ? this.searchKeyword
              : "",
            shop: this.activeKeywordShop,
            filters: this.keywordSearchFilterData,
            extendFilters: this.keywordSearchExtendData
          },
          val
        );
      }
    },
    // 返回关键字检索结果
    handleKeywordSearchResult() {
      this.currentKeywordSearchResultItemChecked = false;
      this.currentKeywordSearchResultItem = null;
      this.clearKeywordSearchOverlays();
      if (!this.$utilStr.isEmpty(this.cacheData.keywordSearchPage)) {
        this.keywordSearchPage = this.$utilStr.deepClone(
          this.cacheData.keywordSearchPage
        );
      }
      this.keywordSearchComplete(this.cacheData.keywordSearchResult);
      this.$refs.searchRef.focus();
    },
    // 返回关键字按城市列表检索结果
    handleCityListSearchResult() {
      this.currentCityListSearchResultItemChecked = false;
      this.currentCityListSearchResultItem = null;
      this.clearKeywordSearchOverlays();
      this.currentKeywordSearchMode = BMAP_STATUS_CITY_LIST;
      if (!this.$utilStr.isEmpty(this.cacheData.cityListSearchResultViewZoom)) {
        this.map.setZoom(this.cacheData.cityListSearchResultViewZoom);
      }
      this.cityListSearchComplete(this.cacheData.cityListSearchResult);
      this.$refs.searchRef.focus();
    },
    // 触发关键字检索按钮点击回调事件
    emitKeywordSearchClickEvent(trigger) {
      this.searchLoading = true;
      this.$emit(
        "currentKeywordSearchClick",
        {
          keyword: this.searchKeyword,
          keywordFilterFactor: this.currentKeywordSearchControl,
          realKeyword: !this.currentSearchKeywordUseShopKeyword
            ? this.searchKeyword
            : "",
          shop: this.activeKeywordShop,
          filters: this.keywordSearchFilterData,
          extendFilters: this.keywordSearchExtendData
        },
        this.currentKeywordSearchMode,
        trigger
      );
    },
    // 更新关键字检索模式
    updateKeywordSearchModel() {
      let _this = this;
      if (
        _this.keywordSearch &&
        (_this.online || _this.currentCustomKeywordSearch)
      ) {
        if (
          _this.keywordSearchVisible ||
          _this.keywordSearchResult.length > 0 ||
          _this.cityListSearchResult.length > 0
        ) {
          if (!_this.currentKeywordSearchResultItemChecked) {
            let activeKeywordSearchMode = -1;
            if (_this.currentZoom > _this.oldZoom) {
              if (_this.currentZoom > _this.keywordSearchDivideZoom + 1) {
                activeKeywordSearchMode = BMAP_STATUS_SUCCESS;
              } else {
                activeKeywordSearchMode = BMAP_STATUS_CITY_LIST;
              }
            } else {
              if (_this.currentZoom > _this.keywordSearchDivideZoom - 1) {
                activeKeywordSearchMode = BMAP_STATUS_SUCCESS;
              } else {
                activeKeywordSearchMode = BMAP_STATUS_CITY_LIST;
              }
            }
            if (_this.currentKeywordSearchMode !== activeKeywordSearchMode) {
              _this.currentKeywordSearchMode = activeKeywordSearchMode;
              if (_this.keywordSearchVisible) {
                _this.keywordSearchVisible = false;
              }
              _this.clearKeywordSearchResult();
              if (!_this.currentRouteSearchBoxOccupy) {
                _this.clearKeywordSearchResultCache();
              }
              _this.clearKeywordSearchOverlays();
              _this.keywordSearchPage.current = 1;
              if (!_this.currentCustomKeywordSearch) {
                if (_this.keywordSearchInstance) {
                  _this.keywordSearchInstance.clearResults();
                }
                _this.poiSearch(_this.searchKeyword);
              } else {
                _this.emitKeywordSearchClickEvent(
                  BMAP_SEARCH_TRIGGER_LOCATION_CHANGE
                );
              }
            }
          }
        }
      }
    },
    // 获取关键字检索当前模式
    getKeywordSearchCurrentMode() {
      let activeMode = -1;
      if (this.currentZoom > this.keywordSearchDivideZoom) {
        activeMode = BMAP_STATUS_SUCCESS;
      } else {
        activeMode = BMAP_STATUS_CITY_LIST;
      }
      return activeMode;
    },
    // 到这去
    handleRouteSearchToEnd() {
      let _this = this;
      _this.currentRouteMileage = null;
      _this.clearKeywordSearchResult();
      _this.clearKeywordSearchOverlays();
      _this.routeSearchEndPoint =
        _this.cacheData.currentKeywordSearchResultItem.point;
      _this.endSearchKeyword =
        _this.cacheData.currentKeywordSearchResultItem.business;
      _this.currentKeywordAuto = _this.keywordAuto;
      if (_this.currentKeywordAuto) {
        if (_this.currentCustomKeywordAuto) {
          _this.currentCustomKeywordAuto = false;
        }
        _this.setRouteSearchKeywordAuto();
      }
      if (_this.currentCustomKeywordSearch) {
        _this.currentCustomKeywordSearch = false;
      }
      _this.currentRouteSearchBoxOccupy = "start";
      if (!_this.keywordSearchInstance) {
        _this.setKeywordSearch();
      }
      _this.$nextTick(() => {
        _this.currentRouteSearchHeight = _this.$el.querySelector(
          ".hdty-map-search-route"
        ).offsetHeight;
        _this.$refs.startSearchRef.focus();
      });
      _this.setRouteSearchEndMarker();
    },
    // 从这出发
    handleRouteSearchFromStart() {
      let _this = this;
      _this.currentRouteMileage = null;
      _this.clearKeywordSearchResult();
      _this.clearKeywordSearchOverlays();
      _this.routeSearchStartPoint =
        _this.cacheData.currentKeywordSearchResultItem.point;
      _this.startSearchKeyword =
        _this.cacheData.currentKeywordSearchResultItem.business;
      _this.currentKeywordAuto = _this.keywordAuto;
      if (_this.currentKeywordAuto) {
        if (_this.currentCustomKeywordAuto) {
          _this.currentCustomKeywordAuto = false;
        }
        _this.setRouteSearchKeywordAuto();
      }
      if (_this.currentCustomKeywordSearch) {
        _this.currentCustomKeywordSearch = false;
      }
      _this.currentRouteSearchBoxOccupy = "end";
      if (!_this.keywordSearchInstance) {
        _this.setKeywordSearch();
      }
      _this.$nextTick(() => {
        _this.currentRouteSearchHeight = _this.$el.querySelector(
          ".hdty-map-search-route"
        ).offsetHeight;
        _this.$refs.endSearchRef.focus();
      });
      _this.setRouteSearchStartMarker();
    },
    // 设置起终点关键字联想
    setRouteSearchKeywordAuto() {
      let _this = this;
      _this.$nextTick(() => {
        if (_this.online) {
          // 建立自动完成的对象
          _this.startKeywordAutoInstance = new BMap.Autocomplete({
            input: _this.startKeywordSearchId,
            location: _this.map,
            onSearchComplete: _this.keywordAutoComplete
          });
          _this.startKeywordAutoInstance.setInputValue(
            _this.startSearchKeyword
          );
          document
            .getElementById(_this.startKeywordSearchId)
            .addEventListener("input", function (evt) {
              let value = evt.target.value;
              if (!value) {
                if (_this.keywordAutoVisible) {
                  _this.keywordAutoVisible = false;
                }
                _this.clearKeywordAutoResult();
                _this.clearKeywordSearchOverlays();
              }
            });
          _this.endKeywordAutoInstance = new BMap.Autocomplete({
            input: _this.endKeywordSearchId,
            location: _this.map,
            onSearchComplete: _this.keywordAutoComplete
          });
          _this.endKeywordAutoInstance.setInputValue(_this.endSearchKeyword);
          document
            .getElementById(_this.endKeywordSearchId)
            .addEventListener("input", function (evt) {
              let value = evt.target.value;
              if (!value) {
                if (_this.keywordAutoVisible) {
                  _this.keywordAutoVisible = false;
                }
                _this.clearKeywordAutoResult();
                _this.clearKeywordSearchOverlays();
              }
            });
        } else {
          document
            .getElementById(_this.startKeywordSearchId)
            .addEventListener("input", function (evt) {
              let value = evt.target.value;
              if (value) {
                // 参数
                let dataParams = {
                  ak: _this.lbsKey,
                  typeConvert: _this.$global.coordType.BD09,
                  current: _this.keywordSearchPage.current,
                  size: _this.keywordSearchPage.size,
                  queryStr: value
                };
                localSearch(_this.LBSServerURL, dataParams)
                  .then((response) => {
                    let { success, data } = response.data;
                    if (success) {
                      if (data.results && data.results.length > 0) {
                        data.results.forEach((e) => {
                          let addComp = _this.$utilStr.extractRegion(e.address);
                          e.business = e.name;
                          e.province = addComp.province;
                          e.city = addComp.city;
                          e.district = addComp.district;
                        });
                      }
                      _this.keywordAutoComplete(data.results);
                    }
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              } else {
                if (_this.keywordAutoVisible) {
                  _this.keywordAutoVisible = false;
                }
                _this.clearKeywordAutoResult();
                _this.clearKeywordSearchOverlays();
              }
            });
          document
            .getElementById(_this.endKeywordSearchId)
            .addEventListener("input", function (evt) {
              let value = evt.target.value;
              if (value) {
                // 参数
                let dataParams = {
                  ak: _this.lbsKey,
                  typeConvert: _this.$global.coordType.BD09,
                  current: _this.keywordSearchPage.current,
                  size: _this.keywordSearchPage.size,
                  queryStr: value
                };
                localSearch(_this.LBSServerURL, dataParams)
                  .then((response) => {
                    let { success, data } = response.data;
                    if (success) {
                      if (data.results && data.results.length > 0) {
                        data.results.forEach((e) => {
                          let addComp = _this.$utilStr.extractRegion(e.address);
                          e.business = e.name;
                          e.province = addComp.province;
                          e.city = addComp.city;
                          e.district = addComp.district;
                        });
                      }
                      _this.keywordAutoComplete(data.results);
                    }
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              } else {
                if (_this.keywordAutoVisible) {
                  _this.keywordAutoVisible = false;
                }
                _this.clearKeywordAutoResult();
                _this.clearKeywordSearchOverlays();
              }
            });
        }
      });
    },
    // 起点关键字检索框获得焦点
    handleStartKeywordSearchFocus() {
      let _this = this;
      _this.currentRouteSearchBoxFocus = "start";
      if (_this.currentRouteSearchBoxOccupy !== "start") {
        _this.currentRouteSearchBoxOccupy = "start";
      }
      if (_this.startSearchKeyword) {
        if (_this.keywordAutoResult.length > 0) {
          _this.keywordAutoVisible = true;
        }
        if (_this.keywordSearchResult.length > 0) {
          _this.keywordSearchVisible = true;
        } else if (_this.cityListSearchResult.length > 0) {
          _this.keywordSearchVisible = true;
        }
      }
      _this.map.onclick = (e) => {
        if (!_this.startSearchKeyword) {
          _this.map.onclick = null;
          _this.currentKeywordAuto = false;
          _this.routeSearchStartPoint = e.point;
          let startSearchKeyword = "未知";
          _this
            .getLocation(_this.routeSearchStartPoint)
            .then((rs) => {
              if (rs) {
                startSearchKeyword = _this.combineLocation(rs);
              }
            })
            .finally(() => {
              _this.startSearchKeyword = startSearchKeyword;
            });
          _this.currentDrivingRoutePath.start = _this.routeSearchStartPoint;
          _this.currentDrivingRoutePath.end = _this.routeSearchEndPoint;
          _this.currentDrivingRoutePath.ways = [];
          _this.setDrivingRoute(true);
        }
      };
      // 点击地图释放检索框焦点
      _this.mapElement.onclick = () => {
        if (_this.$refs.startSearchRef) _this.$refs.startSearchRef.blur();
        _this.mapElement.onclick = null;
      };
      _this.mapElement.oncontextmenu = () => {
        if (_this.$refs.startSearchRef) _this.$refs.startSearchRef.blur();
        _this.mapElement.oncontextmenu = null;
      };
      // 点击其他位置隐藏检索结果面板
      document.documentElement.onclick = (e) => {
        let input = _this.$el.querySelector(".hdty-search-route-start");
        if (input && !input.contains(e.target)) {
          let list = _this.$el.querySelector(".hdty-map-search-list");
          if (list && !list.contains(e.target)) {
            _this.keywordAutoVisible = false;
            _this.keywordSearchVisible = false;
            document.documentElement.onclick = null;
            document.documentElement.oncontextmenu = null;
          }
        }
      };
      document.documentElement.oncontextmenu = (e) => {
        let input = _this.$el.querySelector(".hdty-search-route-start");
        if (input && !input.contains(e.target)) {
          let list = _this.$el.querySelector(".hdty-map-search-list");
          if (list && !list.contains(e.target)) {
            _this.keywordAutoVisible = false;
            _this.keywordSearchVisible = false;
            document.documentElement.onclick = null;
            document.documentElement.oncontextmenu = null;
          }
        }
      };
    },
    // 起点关键字检索框失去焦点
    handleStartKeywordSearchBlur() {
      this.map.onclick = null;
      this.currentRouteSearchBoxFocus = "";
    },
    // 起点关键字检索框值发生改变
    handleStartKeywordSearchInput(val) {
      this.currentKeywordAuto = this.keywordAuto;
      if (this.keywordSearchVisible) {
        this.keywordSearchVisible = false;
      }
      this.clearKeywordSearchResult();
      if (!val) {
        this.routeSearchStartPoint = null;
        if (this.routeSearchStartMarker) {
          this.map.removeOverlay(this.routeSearchStartMarker);
          this.routeSearchStartMarker = null;
        }
        this.clearDrivingRoute();
        this.setRouteSearchEndMarker();
      }
    },
    // 点击起点关键字检索框清空按钮
    handleStartKeywordSearchClear() {
      if (!this.endSearchKeyword) {
        this.handleRouteSearchClose();
      } else {
        this.$refs.startSearchRef.focus();
        if (this.keywordAutoVisible) {
          this.keywordAutoVisible = false;
        }
        this.clearKeywordAutoResult();
        this.clearKeywordSearchOverlays();
      }
    },
    // 起点关键字检索
    handleStartKeywordSearch() {
      if (this.startSearchKeyword) {
        this.currentKeywordAuto = false;
        this.keywordAutoVisible = false;
        this.clearKeywordAutoResult();
        this.keywordSearchVisible = false;
        this.clearKeywordSearchResult();
        this.keywordSearchPage.current = 1;
        if (this.keywordSearchInstance) {
          this.keywordSearchInstance.clearResults();
        }
        this.poiSearch(this.startSearchKeyword);
      }
    },
    // 终点关键字检索框获得焦点
    handleEndKeywordSearchFocus() {
      let _this = this;
      _this.currentRouteSearchBoxFocus = "end";
      if (_this.currentRouteSearchBoxOccupy !== "end") {
        _this.currentRouteSearchBoxOccupy = "end";
      }
      if (_this.endSearchKeyword) {
        if (_this.keywordAutoResult.length > 0) {
          _this.keywordAutoVisible = true;
        }
        if (_this.keywordSearchResult.length > 0) {
          _this.keywordSearchVisible = true;
        } else if (_this.cityListSearchResult.length > 0) {
          _this.keywordSearchVisible = true;
        }
      }
      _this.map.onclick = (e) => {
        _this.map.onclick = null;
        if (!_this.endSearchKeyword) {
          _this.currentKeywordAuto = false;
          _this.routeSearchEndPoint = e.point;
          let endSearchKeyword = "未知";
          _this
            .getLocation(_this.routeSearchEndPoint)
            .then((rs) => {
              if (rs) {
                endSearchKeyword = _this.combineLocation(rs);
              }
            })
            .finally(() => {
              _this.endSearchKeyword = endSearchKeyword;
            });
          _this.currentDrivingRoutePath.start = _this.routeSearchStartPoint;
          _this.currentDrivingRoutePath.end = _this.routeSearchEndPoint;
          _this.currentDrivingRoutePath.ways = [];
          _this.setDrivingRoute(true);
        }
      };
      // 点击地图释放检索框焦点
      _this.mapElement.onclick = () => {
        if (_this.$refs.endSearchRef) _this.$refs.endSearchRef.blur();
        _this.mapElement.onclick = null;
      };
      _this.mapElement.oncontextmenu = () => {
        if (_this.$refs.endSearchRef) _this.$refs.endSearchRef.blur();
        _this.mapElement.oncontextmenu = null;
      };
      // 点击其他位置隐藏检索结果面板
      document.documentElement.onclick = (e) => {
        let input = _this.$el.querySelector(".hdty-search-route-end");
        if (input && !input.contains(e.target)) {
          let list = _this.$el.querySelector(".hdty-map-search-list");
          if (list && !list.contains(e.target)) {
            _this.keywordAutoVisible = false;
            _this.keywordSearchVisible = false;
            document.documentElement.onclick = null;
            document.documentElement.oncontextmenu = null;
          }
        }
      };
      document.documentElement.oncontextmenu = (e) => {
        let input = _this.$el.querySelector(".hdty-search-route-end");
        if (input && !input.contains(e.target)) {
          let list = _this.$el.querySelector(".hdty-map-search-list");
          if (list && !list.contains(e.target)) {
            _this.keywordAutoVisible = false;
            _this.keywordSearchVisible = false;
            document.documentElement.onclick = null;
            document.documentElement.oncontextmenu = null;
          }
        }
      };
    },
    // 终点关键字检索框失去焦点
    handleEndKeywordSearchBlur() {
      this.map.onclick = null;
      this.currentRouteSearchBoxFocus = "";
    },
    // 终点关键字检索框值发生改变
    handleEndKeywordSearchInput(val) {
      this.currentKeywordAuto = this.keywordAuto;
      if (this.keywordSearchVisible) {
        this.keywordSearchVisible = false;
      }
      this.clearKeywordSearchResult();
      if (!val) {
        this.$refs.endSearchRef.focus();
        this.routeSearchEndPoint = null;
        if (this.routeSearchEndMarker) {
          this.map.removeOverlay(this.routeSearchEndMarker);
          this.routeSearchEndMarker = null;
        }
        this.clearDrivingRoute();
        this.setRouteSearchStartMarker();
      }
    },
    // 点击终点关键字检索框清空按钮
    handleEndKeywordSearchClear() {
      if (!this.startSearchKeyword) {
        this.handleRouteSearchClose();
      } else {
        this.$refs.endSearchRef.focus();
        if (this.keywordAutoVisible) {
          this.keywordAutoVisible = false;
        }
        this.clearKeywordAutoResult();
        this.clearKeywordSearchOverlays();
      }
    },
    // 终点关键字检索
    handleEndKeywordSearch() {
      if (this.endSearchKeyword) {
        this.currentKeywordAuto = false;
        this.keywordAutoVisible = false;
        this.clearKeywordAutoResult();
        this.keywordSearchVisible = false;
        this.clearKeywordSearchResult();
        this.keywordSearchPage.current = 1;
        if (this.keywordSearchInstance) {
          this.keywordSearchInstance.clearResults();
        }
        this.poiSearch(this.endSearchKeyword);
      }
    },
    // 设置路线检索起点标注
    setRouteSearchStartMarker() {
      if (this.routeSearchStartPoint) {
        this.routeSearchStartMarker = new BMap.Marker(
          this.routeSearchStartPoint,
          {
            icon: this.getMapIcon("b4")
          }
        );
        this.map.addOverlay(this.routeSearchStartMarker);
      }
    },
    // 设置路线检索终点标注
    setRouteSearchEndMarker() {
      if (this.routeSearchEndPoint) {
        this.routeSearchEndMarker = new BMap.Marker(this.routeSearchEndPoint, {
          icon: this.getMapIcon("b5")
        });
        this.map.addOverlay(this.routeSearchEndMarker);
      }
    },
    // 路线检索起终点切换
    handleRouteSearchRevert() {
      let endSearchKeyword = this.endSearchKeyword;
      this.endSearchKeyword = this.startSearchKeyword;
      this.startSearchKeyword = endSearchKeyword;
      if (!this.startSearchKeyword) {
        this.$refs.startSearchRef.focus();
      }
      if (!this.endSearchKeyword) {
        this.$refs.endSearchRef.focus();
      }
      let routeSearchEndPoint = this.routeSearchEndPoint;
      this.routeSearchEndPoint = this.routeSearchStartPoint;
      this.routeSearchStartPoint = routeSearchEndPoint;
      if (this.routeSearchStartPoint && this.routeSearchEndPoint) {
        this.currentDrivingRoutePath.start = this.routeSearchStartPoint;
        this.currentDrivingRoutePath.end = this.routeSearchEndPoint;
        this.setDrivingRoute(true);
      }
    },
    // 路线检索关闭
    handleRouteSearchClose() {
      this.currentRouteSearchBoxOccupy = "";
      this.startSearchKeyword = "";
      this.endSearchKeyword = "";
      this.routeSearchStartPoint = null;
      this.routeSearchEndPoint = null;
      this.currentKeywordAuto = this.keywordAuto;
      this.currentCustomKeywordAuto = this.customKeywordAuto;
      this.currentCustomKeywordSearch = this.customKeywordSearch;
      this.keywordAutoVisible = false;
      this.clearKeywordAutoResult();
      this.keywordSearchVisible = false;
      this.clearKeywordSearchResult();
      this.clearKeywordSearchOverlays();
      this.clearRouteSearch();
      this.clearDrivingRoute();
      if (!this.searchKeyword) {
        this.clearKeywordSearchResultCache();
        if (this.currentKeywordShopRealChecked) {
          this.currentKeywordShopRealChecked = false;
        }
        if (this.currentKeywordShopMockChecked) {
          this.currentKeywordShopMockChecked = false;
        }
        this.currentKeywordShop = null;
        this.$emit("currentKeywordSearchClear");
      }
    },
    // 颜色选择改变
    handleColorChange(val) {
      if (val) {
        val = val.toLowerCase();
      }
      if (val === this.oldDrawingColor) {
        return;
      }
      this.oldDrawingColor = val;
      if (this.drawingManager) {
        this.drawingManager.polylineOptions.strokeColor = val;
        this.drawingManager.circleOptions.fillColor = val;
        this.drawingManager.circleOptions.strokeColor = val;
        this.drawingManager.polygonOptions.fillColor = val;
        this.drawingManager.polygonOptions.strokeColor = val;
        this.drawingManager.rectangleOptions.fillColor = val;
        this.drawingManager.rectangleOptions.strokeColor = val;
      } else {
        this.currentPolylineTarget.forEach((e) => {
          if (e.getEditing()) {
            e.setStrokeColor(val);
          }
        });
        this.currentCircleTarget.forEach((e) => {
          if (e.getEditing()) {
            e.setFillColor(val);
            e.setStrokeColor(val);
          }
        });
        this.currentPolygonTarget.forEach((e) => {
          if (e.getEditing()) {
            e.setFillColor(val);
            e.setStrokeColor(val);
          }
        });
      }
    },
    // 清除行政区边界
    clearBoundary() {
      for (let e of this.currentBoundaryTarget) {
        for (let v of e.overlays) {
          this.map.removeOverlay(v);
        }
      }
      for (let e of this.currentBoundaryStrokeTarget) {
        for (let v of e.overlays) {
          this.map.removeOverlay(v);
        }
      }
      for (let v of this.currentBoundaryModalTarget) {
        this.map.removeOverlay(v);
      }
      this.clearBoundaryCity();
      this.currentMaxBoundaryPath = "";
      this.currentBoundaryTarget = [];
      this.currentBoundaryStrokeTarget = [];
      this.currentBoundaryModalTarget = [];
      this.currentBoundaryViewDataset = [];
    },
    // 清除行政区当前选择高亮
    clearBoundaryHighlight() {
      let container = this.map.getContainer();
      if (this.boundaryCurrentName) {
        this.clearBoundaryCurrentName();
      }
      this.map.removeEventListener(
        "mousemove",
        this.listenerMousemoveSetBoundaryHighlight
      );
      container.addEventListener(
        "mouseleave",
        this.listenerMouseleaveSetBoundary
      );
    },
    // 清除高亮当前选择行政区
    clearBoundaryCurrentName() {
      if (this.currentBoundaryTarget.length > 0) {
        let boundaryColors = this.$utilStr.toArray(this.boundaryColor);
        let boundaryFillColors = this.$utilStr.toArray(this.boundaryFillColor);
        let fillOpacityOptions = this.overlayStyle.boundaryFillOpacity;
        let activeFillOpacity = 0;
        let activeStrokeWeight = 0;
        if (this.activeMapHasAnyOverlay) {
          if (this.currentZoom <= this.mapRegionZoomRange.province[1]) {
            activeFillOpacity = fillOpacityOptions.level2;
            activeStrokeWeight = this.activeBoundaryWeight;
          } else if (this.currentZoom <= this.mapRegionZoomRange.city[1]) {
            activeFillOpacity = fillOpacityOptions.level3;
            activeStrokeWeight = this.activeBoundaryWeight;
          } else if (this.currentZoom <= this.mapRegionZoomRange.district[1]) {
            activeFillOpacity = fillOpacityOptions.level4;
            activeStrokeWeight = this.activeBoundaryWeight;
          } else if (this.currentZoom <= this.mapRegionZoomRange.town[1]) {
            activeFillOpacity = fillOpacityOptions.level5;
            activeStrokeWeight = this.activeBoundaryWeight;
          } else {
            activeFillOpacity = 0;
            activeStrokeWeight = this.activeBoundaryBoldWeight;
          }
        } else {
          if (this.currentZoom <= this.mapRegionZoomRange.province[1]) {
            activeFillOpacity = fillOpacityOptions.level1;
          } else if (this.currentZoom <= this.mapRegionZoomRange.city[1]) {
            activeFillOpacity = fillOpacityOptions.level2;
          } else if (this.currentZoom <= this.mapRegionZoomRange.district[1]) {
            activeFillOpacity = fillOpacityOptions.level3;
          } else if (this.currentZoom <= this.mapRegionZoomRange.town[1]) {
            activeFillOpacity = fillOpacityOptions.level4;
          } else {
            activeFillOpacity = fillOpacityOptions.level5;
          }
          activeStrokeWeight = this.activeBoundaryWeight;
        }
        this.currentBoundaryTarget.forEach((e, i) => {
          let activeBoundaryCurrentName =
            this.oldBoundaryCurrentName || this.boundaryCurrentName;
          if (
            activeBoundaryCurrentName &&
            e.wd.includes(activeBoundaryCurrentName)
          ) {
            let activeBoundaryFillColor =
              boundaryFillColors[i % boundaryFillColors.length];
            let activeBoundaryColor = boundaryColors[i % boundaryColors.length];
            if (
              this.currentBoundaryHasStroke &&
              !this.currentDistrictHasMultiKind
            ) {
              activeBoundaryColor = this.boundaryStrokeColor;
            }
            e.overlays.forEach((ply) => {
              let currentFillColor = ply.getFillColor();
              let currentFillOpacity = ply.getFillOpacity();
              let currentStrokeWeight = ply.getStrokeWeight();
              let currentStrokeColor = ply.getStrokeColor();
              let currentStrokeOpacity = ply.getStrokeOpacity();
              if (
                activeBoundaryFillColor &&
                activeBoundaryFillColor !== "transparent" &&
                activeBoundaryFillColor !== "none"
              ) {
                if (activeFillOpacity) {
                  if (currentFillColor !== activeBoundaryFillColor) {
                    ply.setFillColor(activeBoundaryFillColor);
                  }
                  if (currentFillOpacity !== activeFillOpacity) {
                    ply.setFillOpacity(activeFillOpacity);
                  }
                } else {
                  if (currentFillColor !== "") {
                    ply.setFillColor("");
                  }
                  if (currentFillOpacity !== 0) {
                    ply.setFillOpacity(0);
                  }
                }
              } else {
                if (currentFillColor !== "none") {
                  ply.setFillColor("none");
                }
                if (currentFillOpacity !== 0) {
                  ply.setFillOpacity(0);
                }
              }
              if (
                activeBoundaryColor &&
                activeBoundaryColor !== "transparent" &&
                activeBoundaryColor !== "none"
              ) {
                if (currentStrokeWeight !== activeStrokeWeight) {
                  ply.setStrokeWeight(activeStrokeWeight);
                }
                if (currentStrokeColor !== activeBoundaryColor) {
                  ply.setStrokeColor(activeBoundaryColor);
                }
                if (currentStrokeOpacity !== 0.8) {
                  ply.setStrokOpacity(0.8);
                }
              } else {
                if (currentStrokeWeight !== 1) {
                  ply.setStrokeWeight(1);
                }
                if (currentStrokeColor !== "none") {
                  ply.setStrokeColor("none");
                }
                if (currentStrokeOpacity !== 0) {
                  ply.setStrokeOpacity(0);
                }
              }
            });
          }
        });
      }
    },
    // 清除行政区边界遮罩层
    clearBoundaryModal() {
      for (let v of this.currentBoundaryModalTarget) {
        this.map.removeOverlay(v);
      }
      this.currentBoundaryModalTarget = [];
      this.resetBoundaryModalStroke();
    },
    // 清除行政区边界遮罩层鼠标移入消失
    clearBoundaryModalHoverHide() {
      let container = this.map.getContainer();
      this.map.removeEventListener(
        "mousemove",
        this.listenerMousemoveSetBoundaryModalHoverHide
      );
      container.addEventListener(
        "mouseleave",
        this.listenerMouseleaveSetBoundaryModal
      );
    },
    // 清除行政区边界城市中心点
    clearBoundaryCity() {
      for (let v of this.currentBoundaryCityTarget) {
        this.map.removeOverlay(v);
      }
      this.currentBoundaryCityTarget = [];
    },
    // 清除标注点
    clearMarker() {
      this.clearConnectionLuShu();
      this.clearConnection();
      this.clearClusterer();
      for (let v of this.currentMarkersTarget) {
        this.map.removeOverlay(v);
      }
      this.currentMarkersTarget = [];
      this.currentMarkerViewDataset = [];
    },
    // 清除热力图
    clearHeatmap() {
      if (this.heatmapOverlay) {
        this.map.removeOverlay(this.heatmapOverlay);
        this.heatmapOverlay = null;
      }
    },
    // 清除聚合点
    clearClusterer() {
      if (this.markerClusterer) {
        this.markerClusterer.clearMarkers(this.currentClustererTarget);
        this.currentClustererTarget = [];
      }
    },
    // 清除点连线
    clearConnection() {
      if (this.currentConnectionTarget) {
        this.map.removeOverlay(this.currentConnectionTarget);
        this.currentConnectionTarget = null;
      }
    },
    // 清除点连线路书运动
    clearConnectionLuShu() {
      if (this.connectionLuShu) {
        this.map.removeOverlay(this.connectionLuShu._marker);
        this.connectionLuShu.stop();
        this.connectionLuShu = null;
      }
    },
    // 清除折线
    clearPolyline() {
      for (let v of this.polylineLuShu) {
        this.map.removeOverlay(v._marker);
        v.stop();
      }
      this.polylineLuShu = [];
      for (let v of this.currentPolylineTarget) {
        this.map.removeOverlay(v);
      }
      this.currentPolylineTarget = [];
      this.currentPolylineViewDataset = [];
    },
    // 清除圆
    clearCircle() {
      for (let v of this.currentCircleLabelTarget) {
        this.map.removeOverlay(v);
      }
      this.currentCircleLabelTarget = [];
      for (let v of this.currentCircleTarget) {
        this.map.removeOverlay(v);
      }
      this.currentCircleTarget = [];
      this.currentCircleViewDataset = [];
    },
    // 清除多边形
    clearPolygon() {
      for (let v of this.currentPolygonLabelTarget) {
        this.map.removeOverlay(v);
      }
      this.currentPolygonLabelTarget = [];
      for (let v of this.currentPolygonTarget) {
        this.map.removeOverlay(v);
      }
      this.currentPolygonTarget = [];
      this.currentPolygonViewDataset = [];
    },
    // 清除驾车路线
    clearDrivingRoute() {
      if (this.drivingRouteLuShu) {
        this.map.removeOverlay(this.drivingRouteLuShu._marker);
        this.drivingRouteLuShu.stop();
        this.drivingRouteLuShu = null;
      }
      if (this.drivingRoute) {
        this.drivingRoute.clearResults();
      }
      for (let v of this.currentDrivingRouteMendTarget) {
        this.map.removeOverlay(v);
      }
      this.currentDrivingRouteMendTarget = [];
      this.currentDrivingRouteViewDataset = [];
      this.currentRouteMileage = null;
    },
    // 清除绘制状态
    clearDrawingMode() {
      if (
        this.drawingManager &&
        this.currentDrawingMode &&
        this.currentDrawingMode !== "drag"
      ) {
        this.currentDrawingMode = "drag";
        this.drawingManager.close();
        this.$emit("update:drawingMode", this.currentDrawingMode);
        this.$emit("currentDrawingModeChanged", this.currentDrawingMode);
        if (this.enablePointTooltip) {
          this.setPointTooltip();
        }
      }
    },
    // 清除信息窗口
    clearInfoBox() {
      if (this.currentInfoBox) {
        this.currentInfoBox.close();
        this.currentInfoBox = null;
      }
    },
    // 清除关键字检索
    clearKeywordSearch() {
      this.clearKeywordSearchOverlays();
      this.clearRouteSearch();
    },
    // 清除关键字联想结果
    clearKeywordAutoResult() {
      if (this.keywordAutoResult.length > 0) {
        this.keywordAutoResult = [];
      }
    },
    // 清除关键字检索结果
    clearKeywordSearchResult() {
      if (this.keywordSearchResult.length > 0) {
        this.keywordSearchResult = [];
      }
      if (this.cityListSearchResult.length > 0) {
        this.cityListSearchResult = [];
      }
      this.currentKeywordSearchResultItemChecked = false;
      this.currentKeywordSearchResultItem = null;
      this.currentCityListSearchResultItemChecked = false;
      this.currentCityListSearchResultItem = null;
    },
    // 清除关键字检索结果缓存
    clearKeywordSearchResultCache() {
      if (this.cacheData.keywordSearchResult.length > 0) {
        this.cacheData.keywordSearchResult = [];
        this.cacheData.keywordSearchPage = null;
      }
      if (this.cacheData.cityListSearchResult.length > 0) {
        this.cacheData.cityListSearchResult = [];
        this.cacheData.cityListSearchResultViewZoom = null;
      }
      this.cacheData.currentKeywordSearchResultItem = null;
      this.cacheData.currentCityListSearchResultItem = null;
    },
    // 清除关键字检索结果标注点覆盖物
    clearKeywordSearchOverlays() {
      for (let v of this.currentKeywordSearchPoiTarget) {
        this.map.removeOverlay(v.marker);
      }
      this.currentKeywordSearchPoiTarget = [];
      this.currentKeywordSearchPoiViewDataset = [];
      this.clearInfoBox();
    },
    // 清除路线检索起终点
    clearRouteSearch() {
      if (this.routeSearchStartMarker) {
        this.map.removeOverlay(this.routeSearchStartMarker);
        this.routeSearchStartMarker = null;
      }
      if (this.routeSearchEndMarker) {
        this.map.removeOverlay(this.routeSearchEndMarker);
        this.routeSearchEndMarker = null;
      }
    },
    // 清除地图上所有覆盖物
    clearAll() {
      this.map.clearOverlays();
      if (this.markerClusterer) {
        this.markerClusterer.clearMarkers(this.currentClustererTarget);
      }
      this.currentOverlays = [];
      this.updateDrawingClearControl();
      this.clearDrawingMode();
      this.clearInfoBox();
      if (this.connectionLuShu) {
        this.connectionLuShu.stop();
      }
      for (let v of this.polylineLuShu) {
        v.stop();
      }
      if (this.drivingRouteLuShu) {
        this.drivingRouteLuShu.stop();
      }
      this.currentMaxBoundaryPath = "";
      this.currentBoundaryTarget = [];
      this.currentBoundaryStrokeTarget = [];
      this.currentBoundaryModalTarget = [];
      this.currentBoundaryCityTarget = [];
      this.currentBoundaryViewDataset = [];
      this.heatmapOverlay = null;
      this.connectionLuShu = null;
      this.currentMarkersTarget = [];
      this.currentClustererTarget = [];
      this.currentConnectionTarget = [];
      this.currentMarkerViewDataset = [];
      this.polylineLuShu = [];
      this.currentPolylineTarget = [];
      this.currentPolylineViewDataset = [];
      this.currentCircleLabelTarget = [];
      this.currentCircleTarget = [];
      this.currentCircleViewDataset = [];
      this.currentPolygonLabelTarget = [];
      this.currentPolygonTarget = [];
      this.currentPolygonViewDataset = [];
      this.drivingRouteLuShu = null;
      this.currentRouteMileage = null;
      this.currentDrivingRouteMendTarget = [];
      this.currentDrivingRouteViewDataset = [];
      this.currentKeywordSearchPoiTarget = [];
      this.currentKeywordSearchPoiViewDataset = [];
    },
    // 组合地址
    combineLocation(val) {
      let result = "未知";
      if (
        typeof val === "object" &&
        (val.addressComponents || val.surroundingPois)
      ) {
        let addComp = val.addressComponents;
        if (val.surroundingPois.length > 0) {
          result = val.surroundingPois[0].title;
        } else if (addComp.street) {
          result = addComp.street + addComp.streetNumber;
        } else if (addComp.province || addComp.city || addComp.district) {
          result = addComp.province + addComp.city + addComp.district;
        }
      }
      return result;
    },
    // 地址解析
    getPoint(val, unique) {
      let _this = this;
      return new Promise((resolve, reject) => {
        if (_this.online) {
          let geoc = new BMap.Geocoder();
          geoc.getPoint(val, function (pt) {
            resolve(pt);
          });
        } else {
          // 参数
          let dataParams = {
            ak: _this.lbsKey,
            typeConvert: _this.$global.coordType.BD09,
            queryStr: val
          };
          getPoint(_this.LBSServerURL, dataParams, unique)
            .then((response) => {
              let { success, data } = response.data;
              if (success) {
                if (data.results && data.results.length > 0) {
                  let pt = new BMap.Point(
                    data.results[0].lng,
                    data.results[0].lat
                  );
                  resolve(pt);
                } else {
                  resolve(null);
                }
              }
            })
            .catch((error) => {
              reject(error);
              console.error(error);
            });
        }
      });
    },
    // 逆地址解析
    getLocation(point, unique) {
      let _this = this;
      return new Promise((resolve, reject) => {
        if (_this.online) {
          let geoc = new BMap.Geocoder();
          geoc.getLocation(point, function (rs) {
            resolve(rs);
          });
        } else {
          // 参数
          let dataParams = {
            ak: _this.lbsKey,
            inParameterType: _this.$global.coordType.BD09,
            lng: point.lng,
            lat: point.lat
          };
          getLocation(_this.LBSServerURL, dataParams, unique)
            .then((response) => {
              let { success, data } = response.data;
              if (success) {
                if (data.results && data.results.length > 0) {
                  let rs = {};
                  let address = data.results[0].address || "";
                  rs.address = address;
                  rs.addressComponents = {};
                  let city = data.results[0].city || "";
                  let district = data.results[0].district || "";
                  let province = data.results[0].province || "";
                  let street = data.results[0].road || "";
                  let streetNumber = data.results[0].streetNo || "";
                  let town = data.results[0].town || "";
                  let regionId = data.results[0].regionId || "";
                  rs.addressComponents.city = city;
                  rs.addressComponents.district = district;
                  rs.addressComponents.province = province;
                  rs.addressComponents.street = street;
                  rs.addressComponents.streetNumber = streetNumber;
                  rs.addressComponents.town = town;
                  rs.addressComponents.regionId = regionId;
                  if (address) {
                    if (province) {
                      let reg = new RegExp("^(?!" + province + ").*$");
                      if (!reg.test(address)) {
                        address = address.replace(province, "");
                      }
                    }
                    if (city) {
                      let reg = new RegExp("^(?!" + city + ").*$");
                      if (!reg.test(address)) {
                        address = address.replace(city, "");
                      }
                    }
                    if (district) {
                      let reg = new RegExp("^(?!" + district + ").*$");
                      if (!reg.test(address)) {
                        address = address.replace(district, "");
                      }
                    }
                    if (street) {
                      let reg = new RegExp("^(?!" + street + ").*$");
                      if (!reg.test(address)) {
                        address = address.replace(street, "");
                      }
                    }
                    if (streetNumber) {
                      let reg = new RegExp("^(?!" + streetNumber + ").*$");
                      if (!reg.test(address)) {
                        address = address.replace(streetNumber, "");
                      }
                    }
                  }
                  rs.business = address;
                  rs.point = point;
                  let surroundingPois = [];
                  if (data.results[0].pois && data.results[0].pois.length > 0) {
                    data.results[0].pois.forEach((e) => {
                      let addComp = {
                        title: e.name || "",
                        point: new BMap.Point(e.lng, e.lat),
                        city: e.city || "",
                        district: e.district || "",
                        province: e.province || "",
                        regionId: e.adcode || ""
                      };
                      addComp.address =
                        e.province + e.city + e.district + e.title;
                      surroundingPois.push(addComp);
                    });
                  }
                  rs.surroundingPois = surroundingPois;
                  resolve(rs);
                } else {
                  resolve(null);
                }
              }
            })
            .catch((error) => {
              reject(error);
              console.error(error);
            });
        }
      });
    },
    // POI搜索
    poiSearch(val, unique) {
      let _this = this;
      _this.searchLoading = true;
      if (_this.online && !_this.currentCustomKeywordSearch) {
        if (_this.keywordSearchLocationChanged) {
          if (_this.keywordSearchLocation) {
            _this.keywordSearchInstance.setLocation(
              _this.keywordSearchLocation
            );
            if (!(_this.keywordSearchLocation instanceof BMap.Map)) {
              _this.keywordSearchLocation = _this.map;
            } else {
              _this.keywordSearchLocationChanged = false;
            }
          }
        }
        _this.keywordSearchInstance.search(val);
      } else if (!_this.currentCustomKeywordSearch) {
        // 参数
        let dataParams = {
          ak: _this.lbsKey,
          typeConvert: _this.$global.coordType.BD09,
          current: _this.keywordSearchPage.current,
          size: _this.keywordSearchPage.size,
          queryStr: val
        };
        localSearch(_this.LBSServerURL, dataParams, unique)
          .then((response) => {
            let { success, data } = response.data;
            if (success) {
              _this.currentKeywordSearchMode = BMAP_STATUS_SUCCESS;
              _this.keywordSearchComplete(data);
            }
          })
          .catch((error) => {
            _this.currentKeywordSearchMode = -1;
            _this.searchLoading = false;
            _this.clearKeywordSearchResult();
            _this.clearKeywordSearchResultCache();
            _this.clearKeywordSearchOverlays();
            if (_this.searchKeyword) {
              _this.keywordSearchVisible = true;
            }
            console.error(error);
          });
      }
    },
    // 创建全屏控件
    createFullscreenControl() {
      let _this = this;
      // 定义一个控件类,即function
      function FullscreenControl() {
        // 默认停靠位置和偏移量
        this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
        this.defaultOffset = new BMap.Size(
          _this.ctrlSpaceMini,
          _this.ctrlSpaceMini
        );
      }
      // 通过JavaScript的prototype属性继承于BMap.Control
      FullscreenControl.prototype = new BMap.Control();
      // 在本方法中创建元素作为控件的容器,并将其添加到地图容器中
      FullscreenControl.prototype.initialize = () => {
        // 创建DOM元素
        let div = document.createElement("div");
        let i = document.createElement("i");
        div.appendChild(i);
        // 设置样式
        div.className = "hdty-map-fullscreen";
        div.title = "切换全屏";
        i.className = "hdty-fullscreen-icon icon-maximize-arrow";
        // 绑定事件
        div.onclick = (e) => {
          _this.toggleFullscreen(e);
        };
        // 添加DOM元素到地图中
        _this.map.getContainer().appendChild(div);
        // 将DOM元素返回
        return div;
      };
      // 创建控件
      _this.fullscreenCtrl = new FullscreenControl();
      // 添加到地图当中
      _this.map.addControl(_this.fullscreenCtrl);
    },
    // 切换全屏模式
    toggleFullscreen(e) {
      if (Fullscreen.enabled) {
        Fullscreen.toggle(this.wrapperElement);
        if (!e.currentTarget.className.includes("is-reverse")) {
          e.currentTarget.classList.add("is-reverse");
        } else {
          e.currentTarget.classList.remove("is-reverse");
        }
      } else {
        this.$message({
          showClose: true,
          message: "您的浏览器暂不支持全屏",
          type: "warning",
          offset: 76
        });
      }
    }
  }
};
</script>

<style scoped></style>
