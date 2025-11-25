<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    append-to-body>
    <hd-pane
      fit>
      <el-form
        :model="detailData"
        ref="formRef"
        label-width="100px"
        border
        stripe
        @submit.native.prevent
        @keyup.enter.native="cancelForm">
        <el-form-item label="上级地区">
          {{ detailData.vox.parentId }}
        </el-form-item>
        <el-form-item label="地区编码">
          {{ detailData.vo.id }}
        </el-form-item>
        <el-form-item label="地区简称">
          {{ detailData.vo.name }}
        </el-form-item>
        <el-form-item label="地区全称">
          {{ detailData.vo.nameAll }}
        </el-form-item>
      </el-form>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { hdForm } from "@/utils/util-framework";
  import { getRegionDetail } from '@/api/region';
  export default {
    name: "RegionDetail",
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
        detailData: {
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
        // 参数
        let dataParams = {
          id: _this.row.id
        };
        // Lambda写法
        getRegionDetail(dataParams).then(response => {
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
      // 取消
      cancelForm() {
        this.visible = false;
      },
      // 重置
      resetForm() {
        this.detailData = {
          vo: {},
          vox: {}
        };
      }
    }
  }
</script>

<style scoped>

</style>
