<template>
  <el-dialog title="编辑表单项" :visible.sync="visible" custom-class="hdty-dialog-medium" append-to-body>
    <hd-pane fit v-loading="loading">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="120px"
        @submit.native.prevent
      >
        <hd-component :model="extendData" ref="componentRef">
          <el-row>
            <el-form-item label="表单项名称" prop="itemLabel">
              <el-input
                v-model="formData.itemLabel"
                placeholder="请输入表单项名称"
                maxlength="200"
                underline
              ></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="表单项属性名" prop="itemProp">
                <el-input
                  v-model="formData.itemProp"
                  placeholder="请输入表单项属性名"
                  maxlength="200"
                  underline
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="组件类型" prop="itemType">
                <el-select
                  v-model="formData.itemType"
                  placeholder="请选择组件类型"
                  filterable
                  underline
                  @change="updateTemplate"
                >
                  <el-option
                    v-for="option in $global.componentType"
                    :key="option.value"
                    :label="`${option.label} - ${option.value}`"
                    :value="option.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="是否为公共属性" prop="isFixed">
                <hd-dict-radio
                  v-model="formData.isFixed"
                  :dict-code="$global.dictType.isOrNot"
                  underline
                ></hd-dict-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="表单项排序" prop="itemOrder">
                <el-input
                  v-model.number="formData.itemOrder"
                  placeholder="请输入表单项排序"
                  maxlength="3"
                  underline
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="使用类型" prop="useType">
                <el-select v-model="formData.useType" placeholder="请选择使用类型" filterable underline>
                  <el-option
                    v-for="option in $global.formUseType"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="表单项配置" prop="itemConfig">
              <hd-json-editor v-model="formData.itemConfig" maxlength="4000" height="368"></hd-json-editor>
              <!-- <el-card style="margin-left:8px;">
                配置示例：
                <div class="code-box">
                  <hd-code :jsonCode="itemConfig"></hd-code>
                </div>
              </el-card>-->
            </el-form-item>
          </el-row>
        </hd-component>
      </el-form>
    </hd-pane>
    <div slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { hdForm } from '@/utils/util-framework';
import { editFormItem, getFormItemDetail } from './api';

export default {
  name: 'FormItemEdit',
  provide() {
    return {
      hdAdd: this
    };
  },
  inject: ['hdList', 'formItemList'],
  mixins: [hdForm],
  data() {
    return {
      // 表单
      itemConfig: '',
      // 表单
      formData: {
        itemLabel: '',
        itemProp: '',
        itemConfig: {
          label: '姓名',
          prop: 'name',
          type: 'input',
          typeId: '012', // 字典值
          width: '50%',
          placeholder: '请输入姓名',
          disabled: false,
          rules: {
            requiredMsg: '请输入姓名',
            custom: 'checkChineseName',
            required: false,
            customMsg: '输入正确姓名'
          }
        },
        isFixed: '',
        itemOrder: '',
        useType: '',
        itemType: ''
      },
      // 表单扩展
      extendData: {},
      // 验证
      rules: {
        itemLabel: [
          { required: true, message: '请输入表单项名称', trigger: 'blur' }
        ],
        itemType: [
          {
            required: true,
            message: '请选择组件类型',
            trigger: 'change'
          }
        ],
        itemProp: [
          {
            required: true,
            message: '请输入表单项属性名',
            trigger: 'blur'
          }
        ],
        itemConfig: [
          {
            required: true,
            message: '请输入表单项配置',
            trigger: 'blur'
          }
        ],
        isFixed: [
          { required: true, message: '请选择是否为公共属性', trigger: 'change' }
        ],
        itemOrder: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        useType: [
          {
            required: true,
            message: '请选择使用类型',
            trigger: 'change'
          }
        ]
      },
      // 显示
      visible: false,
      row: { vo: {} }
    };
  },
  methods: {
    beforeLoadForm() {
      let _this = this;
      _this.$nextTick(() => {
        _this.loadForm();
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
            _this.formData = data.vo;
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
    // 提交
    submitForm() {
      let _this = this;
      console.log('示例', _this.formData);
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          _this.loading = true;
          // 参数
          let dataParams = {
            ..._this.formData
          };
          // 使用正则表达式去除换行和多余的空格
          let cleanedJsonString = _this.formData.itemConfig.replace(/\s+/g, '');
          // 将清理后的字符串转换为JSON对象
          dataParams.itemConfig = cleanedJsonString;
          console.log('处理后---dataParams', dataParams);
          // Lambda写法
          editFormItem(dataParams)
            .then((response) => {
              //响应成功回调
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
                _this.cancelForm();
                _this.formItemList.loadList();
              }
            })
            .catch((error) => {
              // 响应错误回调
              console.log(error);
            })
            .finally(() => {
              _this.loading = false;
            });
        }
      });
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    // 重置
    resetForm() {
      this.$refs.formRef.resetFields();
      this.$refs.componentRef.resetFields();
    },
    // 切换组件类型，动态更新配置模板
    updateTemplate(type) {
      let currentConfig = this.$global.componentType.find(
        (item) => item.value === type
      ).configType;
      let currentTemplate = this.$global.formItemConfigMap.get(currentConfig);
      this.formData.itemConfig = JSON.stringify(currentTemplate);
    }
  }
};
</script>

<style scoped>
</style>
