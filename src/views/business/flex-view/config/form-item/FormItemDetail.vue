<template>
  <el-dialog
    title="表单项配置详情"
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
          <el-form :model="detailData" ref="formRef" label-width="0">
            <hd-component :model="extendData" ref="componentRef">
              <biz-form-card title="基本信息" :id="anchorList[0].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item label="组件类型" :span="12">
                      <el-tag type="primary" size="small">
                        {{ getItemTypeLabel(detailData.vo.itemType) }}
                      </el-tag>
                    </biz-form-item>
                    <biz-form-item label="组件排序" :span="12">
                      {{ detailData.vo.itemOrder }}
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item label="组件标签" :span="24" pClass="p-divs">
                      {{ detailData.vo.itemLabel }}
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="属&ensp;性&ensp;名"
                      :span="24"
                      pClass="p-divs"
                    >
                      {{ detailData.vo.itemProp }}
                    </biz-form-item>
                  </biz-form-row>
                </biz-form>
              </biz-form-card>

              <biz-form-card title="数据映射" :id="anchorList[1].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item
                      label="列&ensp;类&ensp;型"
                      :span="detailData.vo.keyType === 'dict' ? 12 : 24"
                      :pClass="detailData.vo.keyType === 'dict' ? '' : 'p-divs'"
                    >
                      {{ getKeyTypeLabel(detailData.vo.keyType) }}
                    </biz-form-item>
                    <biz-form-item
                      v-if="detailData.vo.keyType === 'dict'"
                      label="字典编码"
                      :span="12"
                    >
                      {{ detailData.vo.dicType || "-" }}
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="是否映射表字段"
                      :span="24"
                      pClass="p-divs"
                    >
                      <el-tag
                        :type="
                          detailData.vo.isFixed === '1' ? 'success' : 'info'
                        "
                        size="small"
                      >
                        {{ detailData.vo.isFixed === "1" ? "是" : "否" }}
                      </el-tag>
                    </biz-form-item>
                  </biz-form-row>
                  <template v-if="detailData.vo.isFixed === '1'">
                    <biz-form-row>
                      <biz-form-item label="数据类型" :span="12">
                        {{ detailData.vo.dataType || "-" }}
                      </biz-form-item>
                      <biz-form-item label="映射列名" :span="12">
                        {{ detailData.vo.tableKey || "-" }}
                      </biz-form-item>
                    </biz-form-row>
                  </template>
                </biz-form>
              </biz-form-card>

              <biz-form-card title="组件配置" :id="anchorList[2].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item
                      label="组件配置JSON"
                      :span="24"
                      pClass="p-divs"
                    >
                      <div class="json-display">
                        <pre v-if="detailData.vo.itemConfig">{{
                          formatJSON(detailData.vo.itemConfig)
                        }}</pre>
                        <span v-else class="empty-text">未配置</span>
                      </div>
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="备&emsp;&emsp;注"
                      :span="24"
                      pClass="p-divs"
                    >
                      {{ detailData.vo.memo || "-" }}
                    </biz-form-item>
                  </biz-form-row>
                </biz-form>
              </biz-form-card>

              <biz-form-card title="操作信息" :id="anchorList[3].id">
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
import { ITEM_TYPE_OPTIONS, KEY_TYPE_OPTIONS } from "./constants";

export default {
  name: "FormItemDetail",
  provide() {
    return {
      FormItemDetail: this
    };
  },
  inject: ["hdList"],
  mixins: [hdForm, anchorScroll],
  data() {
    return {
      detailData: { vo: {}, vox: {} },
      extendData: {},
      row: {},
      visible: false,
      formId: "form" + this.$utilStr.uuid(32),
      anchorIds: [],
      activeAnchor: "",
      clickAnchor: false,
      loading: false,
      anchorList: [
        {
          label: "基本信息",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-document",
          show: true
        },
        {
          label: "数据映射",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-connection",
          show: true
        },
        {
          label: "组件配置",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-edit",
          show: true
        },
        {
          label: "操作信息",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-time",
          show: true
        }
      ],
      // 组件类型选项
      itemTypeOptions: ITEM_TYPE_OPTIONS,
      // 列类型选项
      keyTypeOptions: KEY_TYPE_OPTIONS
    };
  },
  methods: {
    /**
     * 根据组件类型值获取标签
     */
    getItemTypeLabel(value) {
      const item = this.itemTypeOptions.find(
        (option) => option.value === value
      );
      return item ? item.label : value;
    },

    /**
     * 根据列类型值获取标签
     */
    getKeyTypeLabel(value) {
      const item = this.keyTypeOptions.find((option) => option.value === value);
      return item ? item.label : value || "-";
    },

    beforeLoadForm() {
      let _this = this;
      _this.updateAnchorList();
      _this.$nextTick(() => {
        _this.initScrollBox();
        _this.resetForm();
        _this.loadForm();
      });
    },

    loadForm() {
      let _this = this;
      _this.loading = true;
      let dataParams = {
        id: _this.row.vo.id
      };

      detail(dataParams)
        .then((response) => {
          let { success, data } = response.data;
          if (success) {
            _this.detailData = data || {};
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          _this.loading = false;
        });
    },

    cancelForm() {
      this.visible = false;
      this.resetForm();
    },

    resetForm() {
      this.detailData = { vo: {}, vox: {} };
    },

    updateAnchorList() {
      this.anchorIds = this.anchorList
        .filter((item) => item.show)
        .map((item) => item.id);
      this.activeAnchor = this.anchorIds[0];
    },

    formatJSON(json) {
      try {
        const obj = typeof json === "string" ? JSON.parse(json) : json;
        return JSON.stringify(obj, null, 2);
      } catch (e) {
        return json;
      }
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
