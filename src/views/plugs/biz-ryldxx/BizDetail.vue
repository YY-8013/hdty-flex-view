<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    custom-class="new-form"
    append-to-body
  >
    <hd-pane fit v-loading="handleLoading">
      <biz-form-card title="流动信息">
        <biz-form>
          <biz-form-row>
            <biz-form-item
              label="来&ensp;源&ensp;地"
              :required="false"
              :span="24"
              pClass="p-divs"
            >
              {{ formData.lydText }}
            </biz-form-item>
          </biz-form-row>
          <biz-form-row>
            <biz-form-item
              label="来我市目的"
              :required="false"
              :span="24"
              pClass="p-divs"
            >
              {{ formData.lwsmd }}
            </biz-form-item>
          </biz-form-row>
          <biz-form-row>
            <biz-form-item
              label="到达日期"
              :required="false"
              :span="12"
              pClass="p-divs"
            >
              {{ formatDate(formData.ddsj) }}
            </biz-form-item>
            <biz-form-item
              label="到达交通工具"
              :required="false"
              :span="12"
              pClass="p-divs"
            >
              <el-tag
                v-for="(item, index) in formData.ddJtgjTextList"
                :key="index"
                type="primary"
                style="margin-right: 3px"
                >{{ item }}</el-tag
              >
            </biz-form-item>
          </biz-form-row>

          <biz-form-row>
            <biz-form-item
              label="目&ensp;的&ensp;地"
              :required="false"
              :span="24"
            >
              {{ formData.mddText }}
            </biz-form-item>
          </biz-form-row>
          <biz-form-row>
            <biz-form-item label="离开日期" :required="false" :span="12">
              {{ formatDate(formData.lksj) }}
            </biz-form-item>
            <biz-form-item label="离开交通工具" :required="false" :span="12">
              <el-tag
                v-for="(item, index) in formData.lkJtgjTextList"
                :key="index"
                type="primary"
                style="margin-right: 3px"
                >{{ item }}</el-tag
              >
            </biz-form-item>
          </biz-form-row>

          <biz-form-row>
            <biz-form-item
              label="备&emsp;&emsp;注"
              :required="false"
              :span="24"
              pClass="p-divs"
            >
              {{ formData.memo }}
            </biz-form-item>
          </biz-form-row>
        </biz-form>
      </biz-form-card>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdList, hdForm } from "@/utils/util-framework";

export default {
  name: "BizListDetail",
  provide() {
    return {
      BizListDetail: this
    };
  },
  inject: ["BizList"],
  mixins: [hdList, hdForm],
  components: {},
  data() {
    return {
      // 显示
      visible: false,
      // 表单
      formData: {},
      // 行
      row: {}
    };
  },
  methods: {
    // 初始化执行的方法
    beforeLoadForm() {
      this.$nextTick(() => {
        // 清空表单
        this.resetForm();
        // 加载表单
        this.loadForm();
      });
    },
    // 加载表单
    loadForm() {
      let _this = this;
      _this.handleLoading = true;
      _this.formData = _this.row;
      _this.handleLoading = false;
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    // 重置
    resetForm() {
      this.formData = {};
    }
  }
};
</script>

<style lang="scss" scoped></style>
