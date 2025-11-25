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
        label-width="120px"
        border
        stripe
        v-loading="loading"
        @submit.native.prevent
        @keyup.enter.native="cancelForm">
        <el-form-item label="系统名称">
          {{ row.vo.systemName }}
        </el-form-item>
        <el-form-item label="所属机构" prop="vox.orgId">
          {{ formData.vox.orgId }}
        </el-form-item>
        <el-form-item label="前端访问地址" prop="vo.systemWebAddress">
          {{ formData.vo.systemWebAddress }}
        </el-form-item>
        <el-form-item label="服务端访问地址" prop="vo.systemApiAddress">
          {{ formData.vo.systemApiAddress }}
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户端类型" prop="vox.clientType">
              {{ formData.vox.clientType }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用" prop="vox.enable">
              {{ formData.vox.enable }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备  注" prop="vo.memo">
          {{ formData.vo.memo }}
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="vo.createUsername" label="添 加 人">
              {{ formData.vo.createUsername }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="vo.createTime" label="添加时间">
              {{ $utilDate.dateFtt(formData.vo.createTime, 'yyyy-MM-dd HH:mm:ss') }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="vo.updateUsername" label="更 新 人">
              {{ formData.vo.updateUsername }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="vo.updateTime" label="更新时间">
              {{ $utilDate.dateFtt(formData.vo.updateTime, 'yyyy-MM-dd HH:mm:ss') }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {hdForm} from "@/utils/util-framework";
  import {detail} from './api';

  export default {
    name: "RelUrlDetail",
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
        row: {
          vo: {},
          vox: {},
        },
        // 显示
        visible: false,
      }
    },
    methods: {
      // 加载表单之前
      beforeLoadForm() {
        this.$nextTick(() => {
          // 重置
          this.resetForm();
          // 加载表单
          this.loadForm();
        });
      },
      // 加载表单
      loadForm() {
        let _this = this;
        _this.loading = true;
        // 参数
        let dataParams = {
          id: _this.row.vo.id
        };
        // Lambda写法
        detail(dataParams).then(response => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.formData.vo = data.vo;
            _this.formData.vox = data.vox;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        }).finally(() => {
          _this.loading = false;
        });
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

<style lang="scss" scoped>

</style>
