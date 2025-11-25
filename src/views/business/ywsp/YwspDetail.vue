<template>
  <el-dialog
    title="业务审批配置 - 详情"
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
        <hd-pane fit v-loading="handleLoading" :id="formId">
          <el-form
            :model="formData"
            :rules="rules"
            ref="formRef"
            label-width="0"
          >
            <hd-component :model="extendData" ref="componentRef">
              <biz-form-card title="基础信息" :id="anchorList[0].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item
                      label="所属机构"
                      :span="24"
                      p-class="p-divs"
                      >{{ extendData.orgId }}</biz-form-item
                    >
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="审批是否启用"
                      :span="24"
                      p-class="p-divs"
                    >
                      <span
                        :style="{
                          color:
                            formData.spEnable === '1' ? '#67C23A' : '#F56C6C'
                        }"
                        >{{ formData.spEnable === "1" ? "启用" : "停用" }}</span
                      >
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="审批业务类型"
                      :span="24"
                      p-class="p-divs"
                      >{{ extendData.spYwType }}</biz-form-item
                    >
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="表单名称"
                      :required="false"
                      :span="12"
                      p-class="p-divs"
                    >
                      {{ extendData.formId }}
                    </biz-form-item>
                    <biz-form-item
                      label="表单&ensp;I&ensp;D"
                      :required="false"
                      :span="12"
                      p-class="p-divs"
                    >
                      {{ formData.formId }}
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="审批任务级别"
                      :span="12"
                      p-class="p-divs"
                      >{{ extendData.spLevel }}</biz-form-item
                    >
                    <biz-form-item
                      label="审批任务时限<br/>(单位：分钟)"
                      :span="12"
                      p-class="p-divs"
                      >{{ formData.spTimer }}</biz-form-item
                    >
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item
                      label="备&emsp;&emsp;注"
                      :span="24"
                      pClass="p-divs"
                      >{{ formData.memo }}</biz-form-item
                    >
                  </biz-form-row>
                </biz-form>
              </biz-form-card>
              <biz-form-card title="审批步骤" :id="anchorList[1].id">
                <div
                  v-if="
                    formData.fkSpConfigList &&
                    formData.fkSpConfigList.length > 0
                  "
                >
                  <el-steps
                    direction="vertical"
                    :active="formData.fkSpConfigList.length"
                  >
                    <el-step
                      v-for="(stepItem, index) in formData.fkSpConfigList"
                      :key="`step-${index}`"
                      :title="`步骤 ${index + 1}`"
                    >
                      <div slot="title" class="sp-step-header">
                        <div class="sp-step-title">步骤{{ index + 1 }}</div>
                      </div>
                      <div slot="description" class="step-form-text">
                        <biz-form style="margin-bottom: 20px">
                          <biz-form-row>
                            <biz-form-item
                              label="审批模式"
                              :required="false"
                              :span="24"
                              pClass="p-divs"
                              >{{ stepItem.spModeText }}</biz-form-item
                            >
                          </biz-form-row>
                          <biz-form-row>
                            <biz-form-item
                              label="步骤适用级别"
                              :required="false"
                              :span="24"
                              pClass="p-divs"
                              >{{ stepItem.spMatchLevelText }}</biz-form-item
                            >
                          </biz-form-row>

                          <biz-form-row v-if="stepItem.spMode === '2'">
                            <biz-form-item
                              label="审批机构级别"
                              :required="false"
                              :span="24"
                              p-class="p-divs"
                              >{{ stepItem.spOrgLevelText }}</biz-form-item
                            >
                          </biz-form-row>

                          <biz-form-row v-if="stepItem.spMode === '0'">
                            <biz-form-item
                              label="审批机构"
                              :required="false"
                              :span="24"
                              pClass="p-divs"
                              >{{ stepItem.spOrgIdText }}</biz-form-item
                            >
                          </biz-form-row>
                          <biz-form-row v-if="stepItem.spMode === '0'">
                            <biz-form-item
                              label="机构匹配模式"
                              :required="false"
                              :span="24"
                              p-class="p-divs"
                              >{{ stepItem.spOrgMatchText }}</biz-form-item
                            >
                          </biz-form-row>

                          <biz-form-row v-if="stepItem.spMode === '1'">
                            <biz-form-item
                              label="审批人员"
                              :required="false"
                              :span="24"
                              pClass="p-divs"
                            >
                              <el-tag
                                type="primary"
                                v-for="(
                                  spPersonItem, pIndex
                                ) in stepItem.spPersonList"
                                :key="`person-${pIndex}`"
                                style="margin-right: 5px"
                                >{{ spPersonItem.spUserName }}【{{
                                  spPersonItem.spUserCardId
                                }}】</el-tag
                              >
                            </biz-form-item>
                          </biz-form-row>

                          <biz-form-row>
                            <biz-form-item
                              label="备&emsp;&emsp;注"
                              :span="24"
                              pClass="p-divs"
                              >{{ formData.memo }}</biz-form-item
                            >
                          </biz-form-row>
                        </biz-form>
                      </div>
                    </el-step>
                  </el-steps>
                </div>
              </biz-form-card>
              <biz-form-card title="操作信息" :id="anchorList[2].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item
                      label="添&ensp;加&ensp;人"
                      :required="false"
                      :span="12"
                      pClass="p-divs"
                    >
                      <el-form-item>{{ formData.createUsername }}</el-form-item>
                    </biz-form-item>
                    <biz-form-item
                      label="添加时间"
                      :required="false"
                      :span="12"
                      pClass="p-divs"
                    >
                      <el-form-item>{{ extendData.createTime }}</el-form-item>
                    </biz-form-item>
                  </biz-form-row>

                  <biz-form-row>
                    <biz-form-item
                      label="操&ensp;作&ensp;人"
                      :required="false"
                      :span="12"
                      pClass="p-divs"
                    >
                      <el-form-item>{{ formData.updateUsername }}</el-form-item>
                    </biz-form-item>
                    <biz-form-item
                      label="更新时间"
                      :required="false"
                      :span="12"
                      pClass="p-divs"
                    >
                      <el-form-item>{{ extendData.updateTime }}</el-form-item>
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
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdForm, hdList } from "@/utils/util-framework";
import anchorScroll from "@/views/global/mixin/anchorScroll.js";

import { detail } from "./api";

export default {
  name: "YwspDetail",
  provide() {
    return {
      YwspDetail: this
    };
  },
  components: {},
  inject: ["hdList"],
  mixins: [hdList, hdForm, anchorScroll],

  data() {
    return {
      // 表单
      formData: {},
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
      // 动态为锚点添加id
      anchorList: [
        {
          label: "基础信息",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-tickets",
          show: true
        },
        {
          label: "审批步骤",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-tickets",
          show: true
        },
        {
          label: "操作信息",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-document-copy",
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
      // 参数
      let dataParams = {
        id: _this.row.vo.id
      };
      // Lambda写法
      detail(dataParams)
        .then((response) => {
          //响应成功回调
          let { success, data } = response.data;
          if (success) {
            let editData = data.vo;
            editData.fkSpConfigList = _this.reverseSpConfig(
              data.vo.fkSpConfigRefList || []
            );

            _this.formData = editData;
            _this.extendData = data.vox;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        });
    },
    reverseSpConfig(spConfigRefList) {
      // 首先按 spOrder 分组，并确保按 spOrder 升序排列
      const groupedByOrder = {};

      // 先按 spOrder 排序原始数组
      const sortedRefList = [...spConfigRefList].sort(
        (a, b) => a.spOrder - b.spOrder
      );

      sortedRefList.forEach((item) => {
        if (!groupedByOrder[item.spOrder]) {
          groupedByOrder[item.spOrder] = [];
        }
        groupedByOrder[item.spOrder].push(item);
      });

      // 获取排序后的 order 列表
      const sortedOrders = Object.keys(groupedByOrder)
        .map(Number)
        .sort((a, b) => a - b);

      // 转换为原始结构并按 order 排序
      const fkSpConfigList = sortedOrders
        .map((order) => {
          const group = groupedByOrder[order];
          const firstItem = group[0];

          if (firstItem.spMode === "0") {
            // 机构模式
            return {
              spMode: firstItem.spMode,
              spModeText: firstItem.spModeText,
              spMatchLevel: firstItem.spMatchLevel,
              spMatchLevelText: firstItem.spMatchLevelText,
              spOrgId: firstItem.spOrgId,
              spOrgIdText: firstItem.spOrgIdText,
              spOrgMatch: firstItem.spOrgMatch,
              spOrgMatchText: firstItem.spOrgMatchText,
              spOrgLevel: firstItem.spOrgLevel,
              spOrgLevelText: firstItem.spOrgLevelText,
              memo: firstItem.memo
            };
          } else if (firstItem.spMode === "1") {
            // 人员模式
            let pList = group.map((person) => ({
              spUserCardId: person.spUserCardId,
              spUserId: person.spUserId,
              spUserName: person.spUserName
            }));
            return {
              spMode: firstItem.spMode,
              spModeText: firstItem.spModeText,
              spMatchLevel: firstItem.spMatchLevel,
              spMatchLevelText: firstItem.spMatchLevelText,
              spPersonList: pList,
              personIds: pList.map((item) => item.spUserId),
              personNames: pList.map((item) => item.spUserName),
              memo: firstItem.memo
            };
          } else if (firstItem.spMode === "2") {
            // 逐级审批模式
            return {
              spMode: firstItem.spMode,
              spModeText: firstItem.spModeText,
              spMatchLevel: firstItem.spMatchLevel,
              spMatchLevelText: firstItem.spMatchLevelText,
              spOrgId: firstItem.spOrgId,
              spOrgIdText: firstItem.spOrgIdText,
              spOrgMatch: firstItem.spOrgMatch,
              spOrgMatchText: firstItem.spOrgMatchText,
              spOrgLevel: firstItem.spOrgLevel,
              spOrgLevelText: firstItem.spOrgLevelText,
              memo: firstItem.memo
            };
          }

          return null;
        })
        .filter(Boolean);

      return fkSpConfigList;
    },

    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    // 重置
    resetForm() {
      this.formData = {
        vo: {},
        vox: {}
      };
    },
    updateAnchorList() {
      this.anchorList = this.anchorList.map((item) => {
        switch (item.label) {
          case "基本信息":
            item.show = true;
            break;
          default:
            item.show = true;
        }
        return item;
      });
      this.anchorIds = this.anchorList
        .filter((item) => item.show)
        .map((item) => item.id);
      this.activeAnchor = this.anchorIds[0];
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-step__description {
  padding-right: 0;
}

.step-form-text {
  color: #303133;
}
</style>
