<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    custom-class="hdty-dialog-medium new-form"
    append-to-body
    @close="handleClose"
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
                  <biz-form-row>
                    <biz-form-item
                      v-for="field in formFields"
                      :key="field.prop"
                      :label="formatLabel(field.label)"
                      :required="false"
                      :span="field.span"
                      :pClass="field.pClass || 'p-divs'"
                    >
                      <biz-html :value="getFieldValue(field)"></biz-html>
                    </biz-form-item>
                  </biz-form-row>
                </biz-form>
              </biz-form-card>

              <!-- 操作信息 -->
              <biz-form-card title="操作信息" :id="anchorList[1].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item label="添&ensp;加&ensp;人" :span="12">
                      {{ detailData.vo.createUsername || "-" }}
                    </biz-form-item>
                    <biz-form-item label="添加时间" :span="12">
                      {{ detailData.vox.createTime }}
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item label="操&ensp;作&ensp;人" :span="12">
                      {{ detailData.vo.updateUsername || "-" }}
                    </biz-form-item>
                    <biz-form-item label="操作时间" :span="12">
                      {{ detailData.vox.updateTime }}
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item label="注销状态" :span="24">
                      <div
                        v-if="detailData.vo.zxbs === '0'"
                        style="color: #01b3c1"
                      >
                        正常
                      </div>
                      <div v-else style="color: #ff0b00">已注销</div>
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row v-if="detailData.vo.zxbs === '1'">
                    <biz-form-item label="注&ensp;销&ensp;人" :span="12">
                      {{ detailData.vo.zxrUsername || "-" }}
                    </biz-form-item>
                    <biz-form-item label="注销时间" :span="12">
                      {{ detailData.vox.zxsj }}
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row v-if="detailData.vo.zxbs === '1'">
                    <biz-form-item label="注销原因" :span="24" pClass="p-divs">
                      {{ detailData.vo.zxyy || "-" }}
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
    formConfig: Object,
    ywFormId: String
  },
  data() {
    return {
      // 弹窗显示控制
      visible: false,
      // 当前行数据
      currentRow: {},
      // 详情数据
      detailData: { vo: {}, vox: {} },
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
    }
  },
  methods: {
    // 根据字段类型获取对应的值
    getFieldValue(field) {
      const { keyType, prop } = field;
      // 如果类型是 org、region、dict、date，则从 vox 取值
      if (["org", "region", "dict", "date"].includes(keyType)) {
        return this.detailData.vox[prop];
      }
      // 其他情况从 vo 取值
      return this.detailData.vo[prop];
    },

    // 加载前初始化
    beforeLoadForm() {
      this.updateAnchorList();
      this.$nextTick(() => {
        this.initScrollBox();
        this.loadDetail();
      });
    },

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
        .filter((item) =>
          item.config && item.config.display
            ? item.config.display.showInForm !== false
            : true
        )
        .map((item) => {
          const layoutConfig = item.config.layout || {};
          return {
            prop: item.itemProp,
            label: item.itemLabel,
            type: item.itemType,
            keyType: item.keyType, // 添加 keyType 用于 getFieldValue 判断
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
      if (!this.currentRow || !this.currentRow.vo.id) {
        return;
      }

      this.loading = true;
      try {
        const response = await dynamicFormDetail({
          id: this.currentRow.vo.id,
          formId: this.ywFormId
        });

        if (response.data.success) {
          this.detailData = (response &&
            response.data &&
            response.data.data) || { vo: {}, vox: {} };
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
      this.visible = false;
      this.reset();
    },

    // 重置
    reset() {
      this.detailData = { vo: {}, vox: {} };
    },

    // 更新锚点列表
    updateAnchorList() {
      this.anchorIds = this.anchorList
        .filter((item) => item.show)
        .map((item) => item.id);
      this.activeAnchor = this.anchorIds[0];
    },

    // label动态格式化处理
    formatLabel(label) {
      if (!label) return label;

      const len = label.length;
      if (len === 2) {
        // 2个字：中间加&emsp;&emsp;(两个全角空格)
        return label[0] + "&emsp;&emsp;" + label[1];
      } else if (len === 3) {
        // 3个字：每两个字间加&ensp;(一个半角空格)
        return label[0] + "&ensp;" + label[1] + "&ensp;" + label[2];
      }
      // 其余情况返回原label
      return label;
    }
  }
};
</script>

<style lang="scss" scoped></style>
