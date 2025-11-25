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
        label-width="120px"
        border
        stripe
        @submit.native.prevent
        @keyup.enter.native="cancelForm">
        <el-form-item label="上级机构">
          {{ detailData.vox.parentId }}
        </el-form-item>
        <el-form-item label="机构编码">
          {{ detailData.vo.id }}
        </el-form-item>
        <el-form-item label="机构名称">
          {{ detailData.vo.name }}
        </el-form-item>
        <el-form-item label="级  别">
          {{ detailData.vox.levelId }}
        </el-form-item>
        <el-form-item label="是否部门">
          {{ detailData.vox.isDept }}
        </el-form-item>
        <el-form-item label="是否统计">
          {{ detailData.vox.isStat }}
        </el-form-item>
        <el-form-item label="是否有社区业务">
          {{ detailData.vox.isSqyw }}
        </el-form-item>
        <el-form-item label="是否边防派出所">
          {{ detailData.vox.isBfPcs }}
        </el-form-item>
        <el-form-item label="备  注">
          {{ detailData.vo.memo }}
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
  import { getOrganDetail } from '@/api/organ';
  export default {
    name: "OrganDetail",
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
        getOrganDetail(dataParams).then(response => {
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
