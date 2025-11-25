<template>
  <el-dialog
    title="添加"
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
            @keyup.enter.native="submitForm"
          >
            <hd-component :model="extendData" ref="componentRef">
              <biz-form-card title="基础信息" :id="anchorList[0].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item label="单位地址" :required="true" :span="24">
                      <el-form-item prop="dwdzQhnxxdz">
                        <biz-bzdz-new
                          v-model="formData.houseid"
                          :model-text.sync="formData.dwdzQhnxxdz"
                          ywName
                          isYw
                          @handleGlbzdz="handleGlbzdz"
                        ></biz-bzdz-new>
                      </el-form-item>
                    </biz-form-item>
                  </biz-form-row>
                </biz-form>
              </biz-form-card>
              <biz-form-card
                title="其他信息"
                :id="anchorList[1].id"
              ></biz-form-card>
              <biz-form-card
                title="法定代表人信息"
                :id="anchorList[2].id"
              ></biz-form-card>
            </hd-component>
          </el-form>
        </hd-pane>
      </div>
    </div>

    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdForm, hdList } from "@/utils/util-framework";
import anchorScroll from "@/views/global/mixin/anchorScroll.js"; // 路径根据你的项目实际调整

// import { add } from './api';

export default {
  name: "ZdmbAdd",
  provide() {
    return {
      ZdmbAdd: this
    };
  },
  components: {},
  inject: ["hdList"],
  mixins: [hdList, hdForm, anchorScroll],

  data() {
    return {
      // 表单
      formData: {},
      // 扩展表单
      extendData: {},
      // 验证
      rules: {},
      // 显示
      visible: false,
      // 行
      row: {},
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
          label: "其他信息",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-document-copy",
          show: true
        },
        {
          label: "法定代表人信息",
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
      });
    },
    // 提交
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          _this.handleLoading = true;
          // 参数
          let dataParams = {
            ..._this.formData
          };
          // Lambda写法
          add(dataParams)
            .then((response) => {
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: "is-fixed",
                  message: msg,
                  type: "success"
                });
                _this.cancelForm();
                _this.hdList.loadList();
              }
            })
            .catch((error) => {
              // 响应错误回调
              console.log(error);
            })
            .finally(() => {
              _this.handleLoading = false;
            });
        }
      });
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    // 重置
    resetForm() {
      this.$refs.formRef.resetFields();
      this.$refs.componentRef.resetFields();
    },
    updateAnchorList() {
      this.anchorList = this.anchorList.map((item) => {
        switch (item.label) {
          case "基本信息":
            item.show = true; // 根据条件，动态设置是否展示
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
