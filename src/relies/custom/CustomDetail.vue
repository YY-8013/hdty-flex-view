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
        @keyup.enter.native="cancelForm">
        <el-form-item prop="vo.key" label="配置项">
          {{ detailData.vo.key }}
        </el-form-item>
        <el-form-item prop="vo.keyName" label="配置项名称">
          {{ detailData.vo.keyName }}
        </el-form-item>
        <el-form-item prop="vox.keyItem" label="配置项子项">
          {{ detailData.vo.keyItem }}
        </el-form-item>
        <el-form-item prop="vox.keyItemName" label="子项名称">
          {{ detailData.vo.keyItemName }}
        </el-form-item>
        <el-form-item prop="vo.value" label="配置值">
          <div class="con-text" v-html="detailData.vo.value"></div>
        </el-form-item>
        <el-form-item prop="vo.createTime" label="添加时间">
          {{ $utilDate.dateFtt(detailData.vo.createTime, 'yyyy-MM-dd HH:mm:ss') }}
        </el-form-item>
        <el-form-item prop="vo.creatTime" label="更新时间">
          {{ $utilDate.dateFtt(detailData.vo.updateTime, 'yyyy-MM-dd HH:mm:ss') }}
        </el-form-item>
        <el-form-item prop="vo.memo" label="备注">
          <div class="con-text" v-html="detailData.vo.memo"></div>
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
  import { detail } from '@/api/custom';

  export default {
    name: "CustomDetail",
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
          id: _this.row.vo.id
        };
        // Lambda写法
        detail(dataParams).then(response => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.detailData.vo = data.vo;
            _this.detailData.vox = data.vox;
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

<style lang="scss" scoped>
::v-deep.con-text{
  white-space: break-spaces;
  line-height: 24px;
}
</style>
