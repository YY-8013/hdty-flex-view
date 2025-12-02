<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    custom-class="hdty-dialog-medium new-form"
    append-to-body
  >
    <div class="con-form-anchor">
      <!-- 左侧锚点导航 -->
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
          <!-- 返回顶部 -->
          <div class="anchor-item">
            <a href="javascript:;" @click.prevent="handleAnchor('top')">
              <i class="el-icon-caret-top"></i>
              <p>返回顶部</p>
            </a>
          </div>
        </div>
      </div>

      <!-- 右侧详情区域 -->
      <div class="con-form">
        <hd-pane fit v-loading="loading" :id="formId">
          <el-form :model="detailData" ref="formRef" label-width="0">
            <hd-component :model="extendData" ref="componentRef">
              <!-- 表单数据 -->
              <biz-form-card title="表单数据" :id="anchorList[0].id">
                <biz-form>
                  <biz-form-row
                    v-for="(row, rowIndex) in formFieldsRows"
                    :key="rowIndex"
                  >
                    <biz-form-item
                      v-for="field in row"
                      :key="field.prop"
                      :label="field.label"
                      :required="false"
                      :span="field.span"
                    >
                      {{ detailData[field.prop] || "-" }}
                    </biz-form-item>
                  </biz-form-row>
                </biz-form>
              </biz-form-card>

              <!-- 操作信息 -->
              <biz-form-card title="操作信息" :id="anchorList[1].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item label="添 加 人" :span="12">
                      {{ detailData.createUsername || "-" }}
                    </biz-form-item>
                    <biz-form-item label="添加时间" :span="12">
                      {{ formatDatetime(detailData.createTime) }}
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item label="操 作 人" :span="12">
                      {{ detailData.updateUsername || "-" }}
                    </biz-form-item>
                    <biz-form-item label="操作时间" :span="12">
                      {{ formatDatetime(detailData.updateTime) }}
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item label="注销状态" :span="24">
                      <div
                        v-if="detailData.zxbs === '0'"
                        style="color: #01b3c1"
                      >
                        正常
                      </div>
                      <div v-else style="color: #ff0b00">已注销</div>
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row v-if="detailData.zxbs === '1'">
                    <biz-form-item label="注 销 人" :span="12">
                      {{ detailData.zxrUsername || "-" }}
                    </biz-form-item>
                    <biz-form-item label="注销时间" :span="12">
                      {{ formatDatetime(detailData.zxsj) }}
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row v-if="detailData.zxbs === '1'">
                    <biz-form-item label="注销原因" :span="24" pClass="p-divs">
                      {{ detailData.zxyy || "-" }}
                    </biz-form-item>
                  </biz-form-row>
                </biz-form>
              </biz-form-card>
            </hd-component>
          </el-form>
        </hd-pane>
      </div>
    </div>

    <span slot="footer" class="hdty-dialog-footer">
      <el-button type="primary" @click="handleClose">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdForm } from "@/utils/util-framework";
import anchorScroll from "@/views/global/mixin/anchorScroll.js";
import { dynamicFormDetail } from "../api/index";

export default {
  name: "DetailDetailView",
  mixins: [hdForm, anchorScroll],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formConfig: Object,
    ywFormId: String,
    currentRow: Object
  },
  data() {
    return {
      // 详情数据
      detailData: {},
      extendData: {},
      // 表单字段
      formFields: [],
      // 加载状态
      loading: false,
      // 表单id
      formId: "form" + this.$utilStr.uuid(32),
      // 锚点相关
      anchorIds: [],
      activeAnchor: "",
      clickAnchor: false,
      anchorList: [
        {
          label: "表单数据",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-document",
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
  computed: {
    dialogTitle() {
      return (this.formConfig && this.formConfig.formName + "详情") || "详情";
    },
    // 将表单字段按行分组(动态根据span计算)
    formFieldsRows() {
      const rows = [];
      let currentRow = [];
      let currentSpan = 0;

      this.formFields.forEach((field) => {
        const fieldSpan = field.span || 12;

        // 如果当前行加上这个字段会超过24,或者字段span=24则新起一行
        if (currentSpan + fieldSpan > 24 || fieldSpan === 24) {
          if (currentRow.length > 0) {
            rows.push(currentRow);
          }
          currentRow = [field];
          currentSpan = fieldSpan;
        } else {
          currentRow.push(field);
          currentSpan += fieldSpan;
        }
      });

      // 添加最后一行
      if (currentRow.length > 0) {
        rows.push(currentRow);
      }

      return rows;
    }
  },
  watch: {
    formConfig: {
      handler(val) {
        if (val) {
          this.parseFormConfig();
        }
      },
      immediate: true
    },
    visible(val) {
      if (val) {
        this.updateAnchorList();
        this.$nextTick(() => {
          this.initScrollBox();
          this.loadDetail();
        });
      } else {
        this.reset();
      }
    }
  },
  methods: {
    // 解析表单配置
    parseFormConfig() {
      if (!this.formConfig || !this.formConfig.formItemList) {
        return;
      }

      const items = this.formConfig.formItemList;

      // 解析每个表单项的配置
      const parsedItems = items.map((item) => {
        const config = this.parseConfig(item.itemConfig);
        return {
          ...item,
          config
        };
      });

      // 构建表单字段(showInForm=true)
      this.formFields = parsedItems
        .filter((item) => item.config.display?.showInForm !== false)
        .map((item) => {
          const layoutConfig = item.config.layout || {};
          return {
            prop: item.itemProp,
            label: item.itemLabel,
            type: item.itemType,
            span: layoutConfig.span || 12, // 从配置中动态获取span
            config: item.config
          };
        });
    },

    // 解析配置JSON
    parseConfig(configStr) {
      try {
        return typeof configStr === "string"
          ? JSON.parse(configStr)
          : configStr || {};
      } catch {
        return {};
      }
    },

    // 加载详情数据
    async loadDetail() {
      if (!this.currentRow || !this.currentRow.id) {
        return;
      }

      this.loading = true;
      try {
        const response = await dynamicFormDetail({
          id: this.currentRow.id,
          formId: this.ywFormId
        });

        if (response.data.success) {
          this.detailData = response.data.data || {};
        }
      } catch (error) {
        console.error("加载详情失败:", error);
        this.$message.error("加载详情失败");
      } finally {
        this.loading = false;
      }
    },

    // 关闭
    handleClose() {
      this.$emit("update:visible", false);
    },

    // 重置
    reset() {
      this.detailData = {};
    },

    // 更新锚点列表
    updateAnchorList() {
      this.anchorIds = this.anchorList
        .filter((item) => item.show)
        .map((item) => item.id);
      this.activeAnchor = this.anchorIds[0];
    },

    /**
     * 格式化日期时间
     * @param {String} datetime - 日期时间字符串
     * @returns {String} 格式化后的字符串
     */
    formatDatetime(datetime) {
      if (!datetime) return "-";
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

<style lang="scss" scoped></style>
