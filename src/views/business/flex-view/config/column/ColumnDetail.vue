<template>
  <el-dialog
    title="列配置详情"
    :visible.sync="visible"
    custom-class="hdty-dialog-medium new-form"
    append-to-body
  >
    <div class="con-form-anchor">
      <div class="con-anchor">
        <div class="inner">
          <div v-for="anchorItem in anchorList" :key="anchorItem.id">
            <div
              v-if="anchorItem.show"
              class="anchor-item anchor-item-menu"
              :class="{ 'is-active': activeAnchor === anchorItem.id }"
            >
              <a
                href="javascript:;"
                @click.prevent="handleAnchor(anchorItem.id)"
              >
                <i :class="anchorItem.iconClass"></i>
                <p>{{ anchorItem.label }}</p>
              </a>
            </div>
          </div>
          <!--回到顶部-->
          <div class="anchor-item">
            <a href="javascript:;" @click.prevent="handleAnchor('top')">
              <i class="el-icon-caret-top"></i>
              <p>返回顶部</p>
            </a>
          </div>
        </div>
      </div>
      <div class="con-form">
        <hd-pane fit v-loading="loading" :id="formId">
          <el-form
            :model="detailData"
            :rules="rules"
            ref="formRef"
            label-width="0"
          >
            <hd-component :model="extendData" ref="componentRef">
              <biz-form-card title="基本信息" :id="anchorList[0].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item
                      label="列&ensp;名&ensp;称"
                      :required="false"
                      :span="12"
                    >
                      {{ detailData.vo.label }}
                    </biz-form-item>
                    <biz-form-item
                      label="属&ensp;性&ensp;名"
                      :required="false"
                      :span="12"
                    >
                      {{ detailData.vo.prop }}
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="父&ensp;节&ensp;点"
                      :required="false"
                      :span="12"
                    >
                      {{ detailData.vox.parentId }}
                    </biz-form-item>
                    <biz-form-item
                      label="排&emsp;&emsp;序"
                      :required="false"
                      :span="12"
                    >
                      {{ detailData.vo.sortNum }}
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="备&emsp;&emsp;注"
                      :required="false"
                      :span="24"
                      pClass="p-divs"
                    >
                      {{ detailData.vo.memo }}
                    </biz-form-item>
                  </biz-form-row>
                </biz-form>
              </biz-form-card>

              <biz-form-card title="显示配置" :id="anchorList[1].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item
                      label="列&emsp;&emsp;宽"
                      :required="false"
                      :span="12"
                    >
                      {{
                        detailData.vo.columnWidth
                          ? detailData.vo.columnWidth + "px"
                          : "自适应"
                      }}
                    </biz-form-item>
                    <biz-form-item
                      label="对齐方式"
                      :required="false"
                      :span="12"
                    >
                      <el-tag
                        v-if="detailData.vox.align"
                        type="primary"
                        size="small"
                      >
                        {{ detailData.vox.align }}
                      </el-tag>
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="固&ensp;定&ensp;列"
                      :required="false"
                      :span="12"
                    >
                      <el-tag
                        v-if="detailData.vox.fixed"
                        size="small"
                        type="warning"
                      >
                        {{ detailData.vox.fixed }}
                      </el-tag>
                    </biz-form-item>
                    <biz-form-item
                      label="是否可排序"
                      :required="false"
                      :span="12"
                    >
                      <el-tag
                        size="small"
                        :type="
                          detailData.vo.sortable === '1' ? 'success' : 'info'
                        "
                      >
                        {{ detailData.vox.sortable }}
                      </el-tag>
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="关联表单"
                      :required="false"
                      :span="12"
                    >
                      <el-tag
                        v-if="detailData.vox.formId"
                        size="small"
                        type="primary"
                      >
                        {{ detailData.vox.formId }}
                      </el-tag>
                    </biz-form-item>
                    <biz-form-item
                      label="默认展开"
                      :required="false"
                      :span="12"
                    >
                      <el-tag
                        size="small"
                        :type="
                          detailData.vo.defaultExpand === '1'
                            ? 'success'
                            : 'info'
                        "
                      >
                        {{ detailData.vox.defaultExpand }}
                      </el-tag>
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row v-if="detailData.vo.formId">
                    <biz-form-item
                      label="关联表单项"
                      :required="false"
                      :span="24"
                    >
                      <el-tag
                        v-if="detailData.vox.formItemId"
                        size="small"
                        type="primary"
                      >
                        {{ detailData.vox.formItemId }}
                      </el-tag>
                    </biz-form-item>
                  </biz-form-row>
                </biz-form>
              </biz-form-card>

              <biz-form-card title="计算配置" :id="anchorList[2].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item
                      label="计算类型"
                      :required="false"
                      :span="24"
                      pClass="p-divs"
                    >
                      <el-tag
                        v-if="detailData.vo.calcType"
                        size="small"
                        type="success"
                      >
                        {{ getCalcTypeText(detailData.vo.calcType) }}
                      </el-tag>
                      <span v-else></span>
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="计算规则"
                      :required="false"
                      :span="24"
                      pClass="p-divs"
                    >
                      <div class="json-display">
                        <pre v-if="detailData.vo.calcRule">{{
                          formatJSON(detailData.vo.calcRule)
                        }}</pre>
                        <span v-else class="empty-text">未配置</span>
                      </div>
                    </biz-form-item>
                  </biz-form-row>
                </biz-form>
              </biz-form-card>

              <biz-form-card title="列前端配置" :id="anchorList[3].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item
                      label="列配置JSON"
                      :required="false"
                      :span="24"
                      pClass="p-divs"
                    >
                      <div class="json-display">
                        <pre v-if="detailData.vo.columnConfig">{{
                          formatJSON(detailData.vo.columnConfig)
                        }}</pre>
                        <span v-else class="empty-text">未配置</span>
                      </div>
                    </biz-form-item>
                  </biz-form-row>
                </biz-form>
              </biz-form-card>

              <biz-form-card title="状态信息" :id="anchorList[4].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item
                      label="启用状态"
                      :required="false"
                      :span="24"
                    >
                      <el-tag
                        :type="
                          detailData.vo.status === '1' ? 'success' : 'info'
                        "
                        size="small"
                        effect="dark"
                      >
                        {{ detailData.vox.status }}
                      </el-tag>
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row v-if="detailData.vo.status === '1'">
                    <biz-form-item
                      label="启用备注"
                      :required="false"
                      :span="24"
                      pClass="p-divs"
                    >
                      {{ detailData.vo.enableRemark }}
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row v-if="detailData.vo.status === '0'">
                    <biz-form-item
                      label="停用备注"
                      :required="false"
                      :span="24"
                      pClass="p-divs"
                    >
                      {{ detailData.vo.disableRemark }}
                    </biz-form-item>
                  </biz-form-row>
                </biz-form>
              </biz-form-card>

              <biz-form-card title="操作信息" :id="anchorList[5].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item label="添&ensp;加&ensp;人" :span="12">{{
                      detailData.vo.createUsername
                    }}</biz-form-item>
                    <biz-form-item label="添加时间" :span="12">{{
                      detailData.vox.createTime
                    }}</biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item label="操&ensp;作&ensp;人" :span="12">{{
                      detailData.vo.updateUsername
                    }}</biz-form-item>
                    <biz-form-item label="操作时间" :span="12">{{
                      detailData.vox.updateTime
                    }}</biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item label="注销状态" :span="24">
                      <div
                        v-if="detailData.vo.zxbs === '0'"
                        style="color: #01b3c1"
                      >
                        {{ detailData.vox.zxbs }}
                      </div>
                      <div v-else style="color: #ff0b00">
                        {{ detailData.vox.zxbs }}
                      </div>
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row v-if="detailData.vo.zxbs === '1'">
                    <biz-form-item label="注&ensp;销&ensp;人" :span="12">{{
                      detailData.vo.zxrUsername
                    }}</biz-form-item>
                    <biz-form-item label="注销时间" :span="12">{{
                      detailData.vox.zxsj
                    }}</biz-form-item>
                  </biz-form-row>
                  <biz-form-row v-if="detailData.vo.zxbs === '1'">
                    <biz-form-item
                      label="注销原因"
                      :span="24"
                      pClass="p-divs"
                      >{{ detailData.vo.zxyy }}</biz-form-item
                    >
                  </biz-form-row>
                </biz-form>
              </biz-form-card>
            </hd-component>
          </el-form>
        </hd-pane>
      </div>
    </div>

    <span slot="footer" class="hdty-dialog-footer">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdForm } from "@/utils/util-framework";
import anchorScroll from "@/views/global/mixin/anchorScroll.js";
import { detail } from "./api";

export default {
  name: "ColumnDetail",
  provide() {
    return {
      ColumnDetail: this
    };
  },
  components: {},
  inject: ["hdList"],
  mixins: [hdForm, anchorScroll],

  data() {
    return {
      // 表单
      extendData: {},
      // 行
      row: {},
      rules: {},
      // 显示
      visible: false,
      // 表单id
      formId: "form" + this.$utilStr.uuid(32),
      anchorIds: [],
      // 当前滚动选中的锚点
      activeAnchor: "",
      // 是否为点击锚点操作
      clickAnchor: false,
      loading: false,
      // 详情数据
      detailData: { vo: {}, vox: {} },
      // 动态为锚点添加id
      anchorList: [
        {
          label: "基本信息",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-document",
          show: true
        },
        {
          label: "显示配置",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-setting",
          show: true
        },
        {
          label: "计算配置",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-s-data",
          show: true
        },
        {
          label: "列前端配置",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-edit",
          show: true
        },
        {
          label: "状态信息",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-info",
          show: true
        },
        {
          label: "操作信息",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-time",
          show: true
        }
      ]
    };
  },
  mounted() {},
  methods: {
    // 加载表单之前
    beforeLoadForm() {
      let _this = this;
      _this.updateAnchorList();
      _this.$nextTick(() => {
        // 初始化滚动区域;
        _this.initScrollBox();
        _this.resetForm();
        // 加载表单
        _this.loadForm();
      });
    },
    // 加载表单
    loadForm() {
      let _this = this;
      _this.loading = true;
      // 参数
      let dataParams = {
        id: _this.row.id
      };

      // Lambda写法
      detail(dataParams)
        .then((response) => {
          //响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.detailData = data || {};
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.loading = false;
        });
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    // 重置
    resetForm() {
      this.detailData = { vo: {}, vox: {} };
    },
    updateAnchorList() {
      this.anchorIds = this.anchorList
        .filter((item) => item.show)
        .map((item) => item.id);
      this.activeAnchor = this.anchorIds[0];
    },
    /**
     * 获取对齐方式标签类型
     * @param {String} align - 对齐方式
     * @returns {String} 标签类型
     */
    getAlignType(align) {
      const typeMap = {
        left: "primary",
        center: "success",
        right: "warning"
      };
      return typeMap[align] || "";
    },

    /**
     * 获取计算类型文本
     * @param {String} calcType - 计算类型
     * @returns {String} 文本
     */
    getCalcTypeText(calcType) {
      const textMap = {
        sum: "求和(SUM)",
        avg: "平均值(AVG)",
        count: "计数(COUNT)",
        max: "最大值(MAX)",
        min: "最小值(MIN)",
        custom: "自定义(CUSTOM)"
      };
      return textMap[calcType] || calcType;
    },

    /**
     * 获取对齐方式文本
     * @param {String} align - 对齐方式
     * @returns {String} 文本
     */
    getAlignText(align) {
      const textMap = {
        left: "左对齐",
        center: "居中",
        right: "右对齐"
      };
      return textMap[align] || align;
    },

    /**
     * 格式化JSON显示
     * @param {String} json - JSON字符串
     * @returns {String} 格式化后的JSON
     */
    formatJSON(json) {
      try {
        const obj = typeof json === "string" ? JSON.parse(json) : json;
        return JSON.stringify(obj, null, 2);
      } catch (e) {
        return json;
      }
    },

    /**
     * 格式化日期时间
     * @param {String} datetime - 日期时间字符串(YYYYMMDDHHmmss)
     * @returns {String} 格式化后的字符串
     */
    formatDatetime(datetime) {
      if (!datetime) return "-";
      // 格式: 20251126100000 => 2025-11-26 10:00:00
      const str = datetime.toString();
      if (str.length < 14) return datetime;

      const date = str.substring(0, 8);
      const time = str.substring(8, 14);
      return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(
        6,
        8
      )} ${time.substring(0, 2)}:${time.substring(2, 4)}:${time.substring(
        4,
        6
      )}`;
    }
  }
};
</script>

<style lang="scss" scoped>
/* JSON显示样式 */
.json-display {
  flex: 1;

  pre {
    margin: 0;
    padding: 15px;
    background-color: #f4f4f5;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 13px;
    line-height: 1.6;
    color: #303133;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .empty-text {
    color: #909399;
    font-style: italic;
  }
}
</style>
