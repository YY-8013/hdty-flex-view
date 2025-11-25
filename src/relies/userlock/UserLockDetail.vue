<template>
  <el-dialog
    title="详情"
    :visible.sync="visible"
    append-to-body>
    <hd-pane
      fit
      v-loading="loading">
      <el-form
        ref="formRef"
        :model="formData"
        label-width="110px"
        border
        stripe
        @submit.native.prevent
        @keyup.enter.native="cancelForm">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="vo.username" label="用 户 名">
              {{ formData.vo.username }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="vo.gmsfhm" label="身份证号">
              {{ formData.vo.gmsfhm }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="vo.retryCount" label="重试次数">
              {{ formData.vo.retryCount }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="vox.lastRetryTime" label="重试时间">
              {{$utilDate.dateFtt(formData.vo.lastRetryTime, 'yyyy-MM-dd HH:mm:ss')}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="vox.isLock" label="是否锁定">
              {{ formData.vox.isLock }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="vo.lockNum" label="锁定次数">
              {{ formData.vo.lockNum }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="vox.lockTime" label="锁定时间">
              {{$utilDate.dateFtt(formData.vo.lockTime, 'yyyy-MM-dd HH:mm:ss')}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="vox.unlockTime" label="预计解锁时间">
              {{$utilDate.dateFtt(formData.vo.unlockTime, 'yyyy-MM-dd HH:mm:ss')}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { hdForm } from "@/utils/util-framework";
import { detail } from './api';
export default {
  name: "UserLockDetail",
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
        vo: {
          username: '',
          gmsfhm: '',
          retryCount: '',
          lastRetryTime: '',
          isLock: '',
          lockTime: '',
        },
        vox: {}
      },
      // 行
      row: {},
      // 显示
      visible: false,
    }
  },
  methods: {
    // 加载表单之前
    beforeLoadForm() {
      this.$nextTick(()=>{
        // 重置
        this.resetForm();
        // 加载表单
        this.loadForm();
      })
    },
    // 加载表单
    loadForm() {
      let _this = this;
      _this.loading=true;
      // 参数
      let dataParams = {
        id: _this.row.vo.id
      };
      // Lambda写法
      detail(dataParams).then(response => {
        //响应成功回调
        let { success, data } = response.data;
        if (success) {
          _this.formData.vo = data.vo;
          _this.formData.vox = data.vox;
        }
      }).catch(error => {
        // 响应错误回调
        console.error(error);
      }).finally(() => {
        _this.loading=false;
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

<style scoped>

</style>
