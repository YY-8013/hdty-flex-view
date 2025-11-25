<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    append-to-body>
    <hd-pane
      fit>
      <el-form
        :model="formData"
        ref="formRef"
        label-width="100px"
        border
        stripe
        @submit.native.prevent
        @keyup.enter.native="cancelForm">
        <el-form-item prop="vo.sql" label="SQL">
          {{ formData.vo.sql }}
        </el-form-item>
      </el-form>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {hdForm} from "@/utils/util-framework";

  export default {
    name: "MsgDetail",
    provide() {
      return {
        hdDetail: this
      };
    },
    inject: ['hdList'],
    mixins: [hdForm],
    data() {
      return {
        // 表单
        formData: {
          vo: {},
          vox: {}
        },
        // 行
        row: {},
        // 显示
        visible: false
      }
    },
    methods: {
      // 加载表单之前
      beforeLoadForm() {

        // 重置
        this.resetForm();
        // 加载表单
        this.loadForm();
      },
      // 加载表单
      loadForm() {
        let _this = this;
        _this.formData.vo.sql=_this.row.sql;
      },
      // 取消
      cancelForm() {
        this.visible = false;
      },
      // 重置
      resetForm() {
        this.formData = {
          vo: {},
          vox: {}
        };
      }
    }
  }
</script>

<style scoped>

</style>
