<template>
  <el-dialog title="任务对象详情" :visible.sync="visible" custom-class="new-form" append-to-body>
    <hd-pane fit v-loading="loading">
      <el-form
        ref="formRef"
        :model="formData"
        label-width="130px"
        border
        stripe
        @submit.native.prevent
        @keyup.enter.native="cancelForm"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item prop="vo.itemLabel" label="任务对象列名">{{ formData.vo.name }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="vo.itemProp" label="任务对象标签名">{{ formData.vo.label }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="vo.itemProp" label="数据抽取时对应的列名">{{ formData.vo.tableKey }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="vo.itemProp" label="任务对象组件绑定表单对象属性名">{{ formData.vo.prop }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="vox.useType" label="是否系统配置">{{ formData.vox.isAdmin }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="vo.itemOrder" label="是否显示">{{ formData.vox.isShow }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="vox.zxbs" label="注销状态">{{ formData.vox.zxbs }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="vo.createUsername" label="采集人姓名">{{ formData.vo.createUsername }}</el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="formData.vo.zxbs === '1'">
          <el-col :span="12">
            <el-form-item prop="vo.createTime" label="注销时间">{{ formData.vox.zxsj }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="vo.createOrgId" label="注销人姓名">{{ formData.vo.zxrUsername }}</el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="formData.vo.zxbs === '1'">
          <el-col :span="12">
            <el-form-item prop="vo.createTime" label="注销原因">{{ formData.vo.zxyy }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="vo.createOrgId" label="注销人机构">{{ formData.vox.zxdw }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="vo.createTime" label="采集时间">{{ formData.vox.createTime }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="vo.createOrgId" label="采集人机构">{{ formData.vox.createOrgId }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item prop="vo.memo" label="备  注">{{ formData.vo.memo }}</el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="vo.config" label="表单项配置">
            <hd-json-editor v-model="formData.vo.config" height="400" readonly mode="text"></hd-json-editor>
          </el-form-item>
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
import { formObjectDetail } from './api';
export default {
  name: 'RwNformItemDetail',
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
    };
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
      formObjectDetail(dataParams)
        .then((response) => {
          //响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.formData.vo = {
              ...data.vo,
              config: JSON.stringify(JSON.parse(data.vo.config) || '', null, 2)
            };
            console.log('123', _this.formData);
            _this.formData.vox = data.vox;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
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
};
</script>

<style scoped>
</style>
