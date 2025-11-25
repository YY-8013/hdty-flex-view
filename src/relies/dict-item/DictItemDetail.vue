<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    custom-class="hdty-dialog-small"
    append-to-body>
    <hd-pane
      fit>
      <el-form
        :model="detailData"
        ref="formRef"
        label-width="120px"
        border
        stripe
        @submit.native.prevent
        @keyup.enter.native="cancelForm">
        <el-form-item label="代码类型">
          {{ detailData.typeId }}
        </el-form-item>
        <el-form-item label="代码key值">
          {{ detailData.key }}
        </el-form-item>
        <el-form-item label="代码value值">
          {{ detailData.value }}
        </el-form-item>
        <el-form-item label="上级字典项代码">
          {{ detailData.parentId }}
        </el-form-item>
        <el-form-item label="排  序">
          {{ detailData.order }}
        </el-form-item>
        <el-form-item label="字典值首拼">
          {{ detailData.valueSp }}
        </el-form-item>
        <el-form-item label="添加日期">
          {{ detailData.createTime }}
        </el-form-item>
        <el-form-item label="备  注">
          {{ detailData.memo }}
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
  import {getDetail} from '@/api/dict-item';

  export default {
    name: "DictItemDetail",
    provide() {
      return {
        hdDetail: this
      };
    },
    inject: ['hdList'],
    mixins: [hdForm],
    data(){
      return{
        // 表单
        detailData: {},
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
        let dataParams = {
          id: _this.row.id
        };
        // Lambda写法
        getDetail(dataParams).then(response => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.detailData = data;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        })
      },
      //取消
      cancelForm() {
        this.visible = false;
      },
      // 重置
      resetForm() {
        this.detailData = {};
      }
    }
  }
</script>

<style scoped>

</style>
