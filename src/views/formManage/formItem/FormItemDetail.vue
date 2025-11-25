<template>
  <el-dialog title="表单项详情" :visible.sync="visible" custom-class="new-form" append-to-body>
    <hd-pane fit v-loading="loading">
      <el-form
        ref="formRef"
        :model="formData"
        label-width="110px"
        border
        stripe
        @submit.native.prevent
        @keyup.enter.native="cancelForm"
      >
        <el-row>
          <el-form-item prop="vo.itemLabel" label="表单项名称">{{ formData.vo.itemLabel }}</el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="vo.itemProp" label="表单项属性名">{{ formData.vo.itemProp }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="vo.itemType"
              label="组件类型"
            >{{ $global.componentTypeMap.get(formData.vo.itemType) }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item prop="vox.itemLabel" label="是否为固定属性">{{ formData.vox.isFixed }}</el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              prop="vox.useType"
              label="使用类型"
            >{{ $global.formUseTypeMap.get(formData.vo.useType) }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="vo.itemOrder" label="组件排序">{{ formData.vo.itemOrder }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="vo.createUsername" label="采集人姓名">{{ formData.vo.createUsername }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="vox.zxbs" label="注销状态">{{ formData.vox.zxbs }}</el-form-item>
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
          <el-form-item prop="vo.itemConfig" label="表单项配置">
            <hd-json-editor v-model="formData.vo.itemConfig" height="400" readonly mode="text"></hd-json-editor>
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
import { getFormItemDetail } from './api';
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
        id: _this.row.vo.itemId
      };
      // Lambda写法
      getFormItemDetail(dataParams)
        .then((response) => {
          //响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.formData.vo = {
              ...data.vo,
              itemConfig: JSON.stringify(
                JSON.parse(data.vo.itemConfig) || '',
                null,
                2
              )
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
