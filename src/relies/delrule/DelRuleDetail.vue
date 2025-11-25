<template>
  <el-dialog title="详情" :visible.sync="visible" append-to-body>
    <hd-pane fit>
      <el-form :model="formData" ref="formRef" label-width="100px" border stripe @submit.native.prevent @keyup.enter.native="cancelForm">
        <el-row>
          <el-form-item prop="vo.dataSource" label="数据源名称">{{ formData.vo.dataSource }}</el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="vo.dataRange" label="数据范围">{{ formData.vo.dataRange }}</el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="vo.remarks" label="备  注">{{ formData.vo.remarks }}</el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="vo.createUserId" label="添 加 人">{{ formData.vo.createUsername }}</el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="vo.createTime" label="添加时间"> {{ $utilDate.dateFtt(formData.vo.createTime, 'yyyy-MM-dd HH:mm:ss') }}</el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="vo.updateUserId" label="更 新 人">{{ formData.vo.updateUsername }}</el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="vo.updateTime" label="更新时间"> {{ $utilDate.dateFtt(formData.vo.updateTime, 'yyyy-MM-dd HH:mm:ss') }}</el-form-item>
        </el-row>
      </el-form>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { hdForm } from '@/utils/util-framework';
import { detail } from  '@/api/delrule';
export default {
  name: 'DelRuleDetail',
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
          id: '',
          typeString: '',
          wildcard: '',
          condition: '',
          reductionTime: '',
          dataSource: '',
          dataRange: '',
          remarks: '',
          createUserId: '',
          createTime: '',
          updateUserId: '',
          updateTime: '',
          delFlag: ''
        },
        vox: {}
      },
      // 行
      row: {},
      // 显示
      visible: false
    };
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
      detail(dataParams)
        .then(response => {
          //响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.formData.vo = data.vo;
            _this.formData.vox = data.vox;
          }
        })
        .catch(error => {
          // 响应错误回调
          console.error(error);
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
};
</script>

<style scoped></style>
