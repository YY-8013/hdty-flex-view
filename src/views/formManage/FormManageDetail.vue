<template>
  <el-dialog title="表单详情" :visible.sync="visible" custom-class="new-form" append-to-body>
    <hd-pane fit v-loading="loading">
      <el-form
        ref="formRef"
        :model="formData"
        label-width="160px"
        border
        stripe
        @submit.native.prevent
        @keyup.enter.native="cancelForm"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="表单名称">{{ formData.formTitle }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="formId">{{ formData.formId }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="图标文字">{{formData.appIcon }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图标颜色">
              <input v-model="formData.appColor" readonly type="color" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="图标(web)">
              {{ formData.webIcon }}&nbsp;&nbsp;
              <i :class="formData.webIcon"></i>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="表单类型">{{ formData.formTypeValue }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属机构">{{formData.orgMc }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="父级字典">{{ formData.parentDicValue }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排  序">{{ formData.formOrder }}</el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="允许所有民警处理">{{ formData.allowAllMjDelValue }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否必须有任务对象">{{ formData.isMustObjectValue }}</el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="是否允许手动创建">{{ formData.isManualValue }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据抽取时对应的表名">{{ formData.etlTableName }}</el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="查询条件过滤类型">{{ formData.etlTypeMc }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="具体业务类别">{{ formData.etlYwlb }}</el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="采集人姓名">{{ formData.createUsername }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注销状态">
              <span
                :class="{'text-color-5': formData.zxbs === '0','text-color-1':formData.zxbs === '1'}"
              >{{ formData.zxbs === '0' ? '有效' : '无效' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="采集时间">{{ $utilDate.dateFtt(formData.createTime) }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采集人机构">{{ formData.orgMc }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="表单项配置">
            <hd-json-editor v-model="formData.formConfig" height="400" readonly mode="text"></hd-json-editor>
          </el-form-item>
        </el-row>
        <el-form-item label="备  注">{{ formData.memo }}</el-form-item>
      </el-form>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { hdForm } from '@/utils/util-framework';
import { getFormDetail } from './api';
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
      formData: {},
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
        id: _this.row.vo.formId
      };
      // Lambda写法
      getFormDetail(dataParams)
        .then((response) => {
          //响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.formData = {
              ...data.rwForm,
              appColor: data.rwForm.appColor ? `#${data.rwForm.appColor}` : ''
            };
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
        appColor: '#000000'
      };
    }
  }
};
</script>

<style scoped>
</style>
