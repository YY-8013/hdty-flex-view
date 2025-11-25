<template>
  <el-dialog
    title="流动轨迹 - 详情"
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
              <biz-form-card title="流动轨迹信息" :id="anchorList[0].id">
                <biz-form>
                  <!-- 流动人员 -->
                  <biz-form-row>
                    <biz-form-item
                      label="人员姓名"
                      :required="false"
                      :span="12"
                    >
                      <span>{{ formData.vo.gzryXm }}</span>
                    </biz-form-item>
                    <biz-form-item
                      label="身份证号"
                      :required="false"
                      :span="12"
                    >
                      <span>{{ formData.vo.gzrySfzhm }}</span>
                    </biz-form-item>
                  </biz-form-row>
                  <!--流动类型-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">流动类型</label>
                      <div class="p-div p-divs">
                        <div class="text-div">{{ formData.vox.ldType }}</div>
                      </div>
                    </div>
                  </div>
                  <!--流动时间-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">流动时间</label>
                      <div class="p-div p-divs">
                        <div class="text-div">{{ formData.vox.ldsj }}</div>
                      </div>
                    </div>
                  </div>

                  <!--流出地址-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">流出地址</label>
                      <div class="p-div p-divs">
                        <div class="text-div">{{ formData.vo.lcdQhnxxdz }}</div>
                      </div>
                    </div>
                  </div>
                  <!--流出地址-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">流出地补充地址</label>
                      <div class="p-div p-divs">
                        <div class="text-div">{{ formData.vo.lcdBcdz }}</div>
                      </div>
                    </div>
                  </div>
                  <!--详细地址-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">流出地机构</label>
                      <div class="p-div p-divs">
                        <div class="text-div">{{ formData.vox.lcdOrgId }}</div>
                      </div>
                    </div>
                  </div>

                  <biz-form-row v-if="formData.vo.ldType === '02'">
                    <biz-form-item label="是否流出本市" :span="24">
                      {{ formData.vo.sflcbs === "0" ? "否" : "是" }}
                    </biz-form-item>
                  </biz-form-row>

                  <div
                    v-if="
                      formData.vo.ldType === '01' && formData.vo.sflcbs === '0'
                    "
                  >
                    <biz-form-row>
                      <biz-form-item label="流入地址" :span="24">
                        {{ formData.vox.lrdQhnxxdz }}
                      </biz-form-item>
                    </biz-form-row>

                    <biz-form-row>
                      <biz-form-item label="流入地补充地址" :span="24">
                        {{ formData.vo.lrdBcdz }}
                      </biz-form-item>
                    </biz-form-row>

                    <biz-form-row>
                      <biz-form-item label="流入地机构" :span="24">
                        {{ formData.vox.lrdOrgId }}
                      </biz-form-item>
                    </biz-form-row>
                  </div>

                  <!-- 流入地机构 -->
                  <biz-form-row v-if="formData.vo.ldType === '01'">
                    <biz-form-item
                      label="流入地所在辖区<br/>派出所联系电话"
                      :required="false"
                      :span="12"
                      pClass="p-divs"
                    >
                      <span>{{ formData.vo.lrdPcslxdh }}</span>
                    </biz-form-item>
                    <biz-form-item
                      label="流入地所在辖区<br/>分局联系电话"
                      :required="false"
                      :span="12"
                      pClass="p-divs"
                    >
                      <span>{{ formData.vo.lrdFjlxdh }}</span>
                    </biz-form-item>
                  </biz-form-row>

                  <!--流动原因-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">流动原因</label>
                      <div class="p-div p-divs">
                        <div class="text-div">{{ formData.vo.ldyy }}</div>
                      </div>
                    </div>
                  </div>

                  <!--备  注-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label">备&emsp;&emsp;注</label>
                      <div class="p-div p-divs">
                        <div class="text-div">{{ formData.vo.memo }}</div>
                      </div>
                    </div>
                  </div>
                </biz-form>
              </biz-form-card>
              <biz-form-card title="操作信息" :id="anchorList[1].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item label="添&ensp;加&ensp;人" :span="12">{{
                      formData.vo.createUsername
                    }}</biz-form-item>
                    <biz-form-item label="添加时间" :span="12">{{
                      formData.vox.createTime
                    }}</biz-form-item>
                  </biz-form-row>
                  <biz-form-row>
                    <biz-form-item label="审批状态" :span="24">
                      <span
                        v-if="formData.vo.spzt === '0'"
                        class="text-color-1"
                        >{{ formData.vox.spzt }}</span
                      >
                      <span
                        v-if="formData.vo.spzt === '1'"
                        class="text-color-6"
                        >{{ formData.vox.spzt }}</span
                      >
                      <span
                        v-if="formData.vo.spzt === '2'"
                        class="text-color-4"
                        >{{ formData.vox.spzt }}</span
                      >
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row v-if="['0', '1'].includes(formData.vo.spzt)">
                    <biz-form-item label="审&ensp;批&ensp;人" :span="12">{{
                      formData.vo.spUsername
                    }}</biz-form-item>
                    <biz-form-item label="审批时间" :span="12">{{
                      formData.vox.spTime
                    }}</biz-form-item>
                  </biz-form-row>
                  <biz-form-row v-if="['0', '1'].includes(formData.vo.spzt)">
                    <biz-form-item label="审批机构" :span="24" pClass="p-divs">
                      {{ formData.vox.spOrgId }}
                    </biz-form-item>
                  </biz-form-row>
                  <biz-form-row v-if="['0', '1'].includes(formData.vo.spzt)">
                    <biz-form-item
                      label="审批意见"
                      :span="24"
                      pClass="p-divs"
                      >{{ formData.vo.spyy }}</biz-form-item
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
import { hdForm, hdList } from "@/utils/util-framework";
import anchorScroll from "@/views/global/mixin/anchorScroll.js";

import { detail } from "./api";

export default {
  name: "TzzbDetail",
  provide() {
    return {
      TzzbDetail: this
    };
  },
  components: {},
  inject: ["hdList"],
  mixins: [hdList, hdForm, anchorScroll],

  data() {
    return {
      // 表单
      formData: {
        vo: {},
        vox: {}
      },
      extendData: {},
      // 文件列表
      fileList: [],
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
          label: "流动轨迹信息",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-box",
          show: true
        },
        {
          label: "操作信息",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-document-copy",
          show: true
        }
      ],
      fileList: []
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
            _this.formData.vo = data.vo;
            _this.formData.vox = data.vox;
            let oldIds = [];
            let oldFileList = [];
            if (
              data.vo &&
              data.vo.tzzbFileTableData &&
              data.vo.tzzbFileTableData.length > 0
            ) {
              data.vo.tzzbFileTableData[0].idList.forEach(
                (fileId, fileIndex) => {
                  oldIds.push(fileId);
                  let fileObj = {
                    id: fileId,
                    name: data.vo.tzzbFileTableData[0].nameList[fileIndex],
                    url: data.vo.tzzbFileTableData[0].urlList[fileIndex]
                  };
                  oldFileList.push(fileObj);
                }
              );
            }

            _this.fileList = oldFileList;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        });
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
      this.fileList = [];
    },
    updateAnchorList() {
      this.anchorList = this.anchorList.map((item) => {
        switch (item.label) {
          case "流动轨迹信息":
            item.show = true;
            break;
          case "操作信息":
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

<style lang="scss" scoped></style>
